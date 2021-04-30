const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");

const SERVER_PROXY_PORT = 6005;

const app = express();

app.use(morgan("dev"));

const SERVICE_VS_PORT = {
  auth: 6000,
  core: 6001,
  catalogue: 6002,
  pos: 6003,
  ecom: 6004,
};

//proxy Services
Object.keys(SERVICE_VS_PORT).forEach((service) => {
  app.use(
    `/${service}`,
    createProxyMiddleware({
      target: `http://localhost:${SERVICE_VS_PORT[service]}`,
      changeOrigin: false,
      pathRewrite: {
        [`^/${service}`]: "/", // rewrite path
      },
    })
  );
});

app.listen(SERVER_PROXY_PORT, () =>
  console.log(`Proxy server started on port ${SERVER_PROXY_PORT}`)
);
