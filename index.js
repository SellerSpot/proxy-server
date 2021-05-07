const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

/**
 * Below SSL certificats should be generated with a wildcard domain `*.sellerspot.in`
 * @see {@link: https://web.dev/how-to-use-local-https}
 */

const options = {
  key: fs.readFileSync("/home/thayalangr/localhost+4-key.pem"),
  cert: fs.readFileSync("/home/thayalangr/localhost+4.pem"),
};

const SERVER_PROXY_PORT = 4505;
const SERVER_PROXY_PORT_HTTPS = 4506;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(morgan("dev"));

const SERVICE_VS_PORT = {
  auth: 4500,
  core: 4501,
  catalogue: 4502,
  pos: 4503,
  ecom: 4504,
};

app.use("/", express.static("./public"));

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
  console.log(`Proxy server HTTP started on port ${SERVER_PROXY_PORT}`)
);

https
  .createServer(options, app)
  .listen(SERVER_PROXY_PORT_HTTPS, () =>
    console.log(`Proxy server HTTPS started on port ${SERVER_PROXY_PORT_HTTPS}`)
  );
