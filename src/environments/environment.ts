// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // testFlag : LOCAL_IT → local it
  // testFlag : NO_AUTH → no keycloak
  // testFlag : LOCAL_JSON → use json
  testFlag: 'LOCAL_JSON',
  production: true,
  restRetry: 0,
  timeout: 60000,
  restBaseUrl: '',
  restBaseUrlKeycloak: 'http://192.168.180.25:30581',
  CLIENT_SECRET_DA: '1dffc851-e0d1-49d3-b1c0-f49440acc866',
  CLIENT_SECRET_DAP: '9216f615-5556-4051-aa6b-edbef2a5b541',
  CLIENT_SECRET_TMNF: 'baf69a5e-5ae2-42f3-b742-99fc628821aa',
  // tslint:disable-next-line:max-line-length
  KEYCLOAK_LOGIN_DA: 'http://192.168.180.25:30581/auth/realms/da/protocol/openid-connect/auth?client_id=angular-app&response_type=code&client_secret=1dffc851-e0d1-49d3-b1c0-f49440acc866',
  // tslint:disable-next-line:max-line-length
  KEYCLOAK_LOGIN_DAP: 'http://192.168.180.25:30581/auth/realms/dap/protocol/openid-connect/auth?client_id=angular-app&response_type=code&client_secret=9216f615-5556-4051-aa6b-edbef2a5b541',
  // tslint:disable-next-line:max-line-length
  KEYCLOAK_LOGIN_TMNF: 'http://192.168.180.25:30581/auth/realms/tmnf/protocol/openid-connect/auth?client_id=angular-app&response_type=code&client_secret=baf69a5e-5ae2-42f3-b742-99fc628821aa',
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
