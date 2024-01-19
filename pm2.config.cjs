// to set pm2 environment variables (https://pm2.keymetrics.io/docs/usage/environment)
module.exports = {
    apps : [{
        name: 'socialbots',
        script: 'dist/main.js',
        env: {
            NODE_ENV: 'dev',
        },
        env_prod: {
            NODE_ENV: 'prod',
        }
    }],
};
