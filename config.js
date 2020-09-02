module.exports = {
  PORT: process.env.PORT || '9898',
  POWER_BI_AUTHENTICATION_MODE: process.env.POWER_BI_AUTHENTICATION_MODE || '',
  POWER_BI_AUTHORITY_URI: process.env.POWER_BI_AUTHORITY_URI || 'https://login.microsoftonline.com/common/',
  POWER_BI_SCOPE: process.env.POWER_BI_SCOPE || 'https://analysis.windows.net/powerbi/api',
  POWER_BI_API_URL: process.env.POWER_BI_API_URL || 'https://api.powerbi.com/',
  POWER_BI_TENANT_ID: process.env.POWER_BI_TENANT_ID || '',
  POWER_BI_USERNAME: process.env.POWER_BI_USERNAME || '',
  POWER_BI_PASSWORD: process.env.POWER_BI_PASSWORD || '',
  POWER_BI_CLIENT_ID: process.env.POWER_BI_CLIENT_ID || '',
  POWER_BI_CLIENT_SECRET: process.env.POWER_BI_CLIENT_SECRET || '',
  POWER_BI_WORKSPACE_ID: process.env.POWER_BI_WORKSPACE_ID || '',
};