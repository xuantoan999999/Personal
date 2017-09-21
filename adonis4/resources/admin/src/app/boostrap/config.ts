export default class Config {
    static getConfigs() {
        let config = {
            adminUrl: {
                url: 'http://localhost:2206/admin',
                userJWT: 'Personal',
                storageExpireTime: 365 * 24 * 60 * 60 * 1000
            },
            apiUrl: {
                url: 'http://localhost:2206/api/v1',
            }
        };
        return config;
    }
}