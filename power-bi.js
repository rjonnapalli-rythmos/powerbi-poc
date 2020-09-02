const config = require('./config');
let { AuthenticationContext } = require("adal-node");
const fetch = require('node-fetch');
const log = console;
class PowerBI {

  async authenticate() {
    let authorityUrl = config.POWER_BI_AUTHORITY_URI;
    const authMode = config.POWER_BI_AUTHENTICATION_MODE.toLocaleLowerCase();
    if (authMode === 'masteruser') {
      let context = new AuthenticationContext(authorityUrl);
      return new Promise((resolve, reject) => {
        context.acquireTokenWithUsernamePassword(
          config.POWER_BI_SCOPE,
          config.POWER_BI_USERNAME,
          config.POWER_BI_PASSWORD,
          config.POWER_BI_CLIENT_ID,
          function(err, response) {
            if (err) {
              resolve(response == null
                ? ({ ok: false, error: err })
                : ({ ok: false, error: response }));
            }
            resolve({ ok: true, data: response });
          });
      });
    } else if (authMode = 'serviceprincipal') {
      authorityUrl = authorityUrl.replace("common", config.POWER_BI_TENANT_ID);
      let context = new AuthenticationContext(authorityUrl);
      return new Promise((resolve, reject) => {
        context.acquireTokenWithClientCredentials(
          config.POWER_BI_SCOPE,
          config.POWER_BI_CLIENT_ID,
          config.POWER_BI_CLIENT_SECRET,
          function(err, response) {
            if (err) {
              resolve(response == null
                ? ({ ok: false, error: err })
                : ({ ok: false, error: response }));
            }
            resolve({ ok: true, data: response });
          });
      });
    }
    return { ok: false, error: new Error('Invalid authentication type') };
  }

  async getEmbedDetails(opts) {
    const { entityType, entityId, accessToken } = opts || {};
    const entityDetailsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.POWER_BI_WORKSPACE_ID}/${entityType}s/${entityId}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": utils.getAuthHeader(accessToken)
    };
    const result = await fetch(entityDetailsUrl, {
      method: 'GET',
      headers
    }).then(async (data) => ({ ok: true, data: await data.json() }))
      .catch((error) => ({ ok: false, error }))
    log.debug('Embed details response: ', result);
    return result;
  }

  async getEmbedToken(embedData, opts) {
    const { entityType, accessToken } = opts || {};
    const embedTokenUrl = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": utils.getAuthHeader(accessToken)
    };

    const formData = {
      "datasets": [
        { "id": embedData.datasetId }
      ],
      [entityType + 's']: [
        { "id": embedData.id }
      ]
    };
    let result = await fetch(embedTokenUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData)
    }).then(async (data) => ({ ok: true, data: await data.json() }))
      .catch(error => ({ ok: false, error }));
    log.debug('Embed token response: ', result);
    return result;
  }

  async generateEmbedToken(req) {
    const { reportId, dashboardId } = req.query;
    const entityType = !reportId ? 'dashboard' : 'report';
    const entityId = !reportId ? dashboardId : reportId;
    const auth = new PowerBI();
    const authResponse = await auth.authenticate();
    if (!authResponse.ok) {
      log.error('Error while fetching access token');
      log.error(authResponse.error);
      return authResponse;
    }
    const { data: authResult } = authResponse;
    const { access_token: accessToken } = authResult;
    const opts = { accessToken, entityType, entityId };
    const embedResponse = await auth.getEmbedDetails(opts)
    if (!embedResponse.ok) {
      log.error('Error while fetching embed data for ' + entityId);
      log.error(embedResponse.error);
      return embedResponse;
    }
    const embedTokenResponse = await auth.getEmbedToken(embedResponse.data, opts)
    if (!embedTokenResponse.ok) {
      log.error('Error while fetching embed token');
      log.error(embedTokenResponse.error);
      return embedTokenResponse;
    }
    return embedTokenResponse;
  }

  async generateSampleEmbedToken(req) {
    let url = 'https://playgroundbe-bck-1.azurewebsites.net/Dashboards/SampleDashboard';
    if (req.query && req.query.entityType === 'report') {
      url = 'https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport';
    }
    return fetch(url)
      .then(async (data) => ({ ok: true, data: await data.json() }))
      .catch(error => ({ ok: false, error: error }));
  }
}

module.exports = PowerBI;