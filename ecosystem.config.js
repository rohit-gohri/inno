module.exports = {
  apps: [
    {
      exec_mode: "cluster",
      script: "./bin/www",
      name: "inno",
      node_args: "--harmony",
      watch: false,
      error_file: "./logs/inno.err.log",
      out_file: "./logs/inno.out.log",
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
