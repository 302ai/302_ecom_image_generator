//!!You need to close standalone output on next.config.mjs first
module.exports = {
  apps: [
    {
      name: "302_Ecom_Image_Generator",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
