module.exports = {
  apps: [
    {
      name: 'dome lend',
      exec_mode: 'cluster',
      instances: 1,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4000',

      env_local: {
        APP_ENV: 'local',
        NODE_ENV: 'development',
      },
      env_dev: {
        APP_ENV: 'dev',
        NODE_ENV: 'development',
      },
      env_prod: {
        APP_ENV: 'prod',
        NODE_ENV: 'production',
      },

      watch: true, 
      max_memory_restart: '200M',
      autorestart: true, 
      restart_delay: 5000, 
      error_file: './logs/err.log', 
      out_file: './logs/out.log', 
    }
  ]
}
