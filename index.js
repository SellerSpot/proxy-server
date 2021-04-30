const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");

const SERVER_PROXY_PORT = 4505;

const app = express();

app.use(morgan("dev"));

const SERVICE_VS_PORT = {
  auth: 4500,
  core: 4501,
  catalogue: 4502,
  pos: 4503,
  ecom: 4504,
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
