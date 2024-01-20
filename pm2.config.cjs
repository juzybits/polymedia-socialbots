// to set pm2 environment variables (https://pm2.keymetrics.io/docs/usage/environment)
module.exports = {
    apps : [{
        name: 'socialbots',
        script: 'dist/main.js',
        log_date_format: 'YY-MM-DD HH:mm:ss',
        env: {
            NODE_ENV: 'dev',
        },
        env_prod: {
            NODE_ENV: 'prod',
        }
    }],
};
