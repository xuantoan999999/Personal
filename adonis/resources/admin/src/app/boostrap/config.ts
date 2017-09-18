export default class Config {
    static getConfigs() {
        let config = {
            url: 'http://localhost:2206/admin',
            userJWT: 'Personal',
            storageExpireTime: 365 * 24 * 60 * 60 * 1000
        };
        return config;
    }
}