export default class Config {
    static getConfigs() {
        let config = {
            userJWT: 'Personal',
            adminUrl: {
                url: 'http://localhost:2206/admin',
                storageExpireTime: 365 * 24 * 60 * 60 * 1000
            },
            apiUrl: {
                url: 'http://localhost:2206/api/v1',
            }
        };
        return config;
    }
}