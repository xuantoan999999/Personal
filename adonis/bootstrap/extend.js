'use strict'

/*
|--------------------------------------------------------------------------
| Extend Providers
|--------------------------------------------------------------------------
|
| Some providers give options to be extended like SessionProvider. In this
| file you can easily track which providers are extended.
|
| @note - Here you do not have access to any providers, which means this file
| is called before loading service providers. But have access to the Ioc
| container and you can use it extend providers, which are about to get
| registered.
|
| @example
| Ioc.extend('Adonis/Src/Session', 'redis', function (app) {
|   // your redis driver implementation
| })
|
*/
const Ioc = require('adonis-fold').Ioc
global.APP_NAME = 'Personal';
global.COOKIE_NAME_WEB = 'Personal-token';
global.COOKIE_OPTIONS = {
    ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
    encoding: 'none',    // we already used JWT to encode
    path: '/',
    //isSecure: true,      // warm & fuzzy feelings
    isHttpOnly: false,    // prevent client alteration
    clearInvalid: true, // remove invalid cookies
    strictHeader: true   // don't allow violations of RFC 6265
}