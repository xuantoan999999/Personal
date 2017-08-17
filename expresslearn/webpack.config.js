function buildConfig(env) {
    return require('./config/webpack/' + env + '.config.js');
    // return require('./config/webpack/dev.config.js');
}

module.exports = buildConfig