// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,

    authServiceURL: 'http://tmpcmamva11.corp.ad.timeinc.com:9002',
    //authServiceURL: 'http://localhost:65034',
    PCATServiceURL: 'http://localhost:35248',
    keepAliveInterval: 27000,  // In seconsds (7.30 hours - for a timeout of 8 hours)
    UserIdleTime: 1800 //30 Minutes user Idle time out

};
