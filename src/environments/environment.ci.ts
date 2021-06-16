// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // testFlag : LOCAL_IT → local it
  // testFlag : NO_AUTH → no keycloak
  // testFlag : LOCAL_JSON → use json
  testFlag: 'LOCAL_IT',
  production: true,
  restRetry: 0,
  timeout: 60000,
  restBaseUrl: 'https://bff.stg.drive-agent-2c.com/api',
  restBaseUrlKeycloak: 'https://www.stg.drive-agent-2c.com',
  KEYCLOAK_LOGIN_DA: 'https://www.stg.drive-agent-2c.com/da/index.html',
  KEYCLOAK_LOGIN_DAP: 'https://www.stg.drive-agent-2c.com/dap/index.html',
  KEYCLOAK_LOGIN_TMNF: 'https://www.stg.drive-agent-2c.com/tmnf/index.html',
  WEB_MANUAL_URL_DA: 'https://www.stg.drive-agent-2c.com/login/docs/da-manual.html',
  TERMINAL_MANUAL_URL_DA_DAP: 'https://www.stg.drive-agent-2c.com/login/docs/device-manual.pdf',
  FAQ_URL_DA_DAP: 'https://www.stg.drive-agent-2c.com/login/docs/faq.pdf',
  AGREEMENT_URL_DA_DAP: 'https://www.stg.drive-agent-2c.com/login/docs/agreement.pdf',
  WEB_MANUAL_URL_DAP: 'https://www.stg.drive-agent-2c.com/login/docs/dap-manual.html',
  MANUAL_URL_TMNF: 'https://www.stg.drive-agent-2c.com/login/docs/tmnf-manual.html',
  AGREEMENT_URL_DA: 'https://www.stg.drive-agent-2c.com/terms/terms-of-service-da.html',
  AGREEMENT_URL_DAP: 'https://www.stg.drive-agent-2c.com/terms/terms-of-service-dap.html',
  EXTERNAL_FLAG: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

