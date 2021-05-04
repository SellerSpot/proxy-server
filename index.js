const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const SERVICE_VS_PORT = {};
SERVICE_VS_PORT['auth'] = 6000;
SERVICE_VS_PORT['core'] = 6001;
SERVICE_VS_PORT['catalogue'] = 6002;
SERVICE_VS_PORT['pos'] = 6003;
SERVICE_VS_PORT['ecom'] = 6004;

app.use(express.static(path.join(__dirname, 'public')));

//Auth Service
app.use(
  '/auth',
  createProxyMiddleware({
    target: `http://localhost:${SERVICE_VS_PORT.auth}`,
    changeOrigin: false,
    pathRewrite: {
      '^/auth': '/', // rewrite path
    },
  })
);

//Core Service
app.use(
  '/core',
  createProxyMiddleware({
    target: `http://localhost:${SERVICE_VS_PORT.core}`,
    changeOrigin: false,
    pathRewrite: {
      '^/core': '/', // rewrite path
    },
  })
);

//Catalogue Service
app.use(
  '/catalogue',
  createProxyMiddleware({
    target: `http://localhost:${SERVICE_VS_PORT.catalogue}`,
    changeOrigin: false,
    pathRewrite: {
      '^/catalogue': '/', // rewrite path
    },
  })
);

//POS Service
app.use(
  '/pos',
  createProxyMiddleware({
    target: `http://localhost:${SERVICE_VS_PORT.pos}`,
    changeOrigin: false,
    pathRewrite: {
      '^/pos': '/', // rewrite path
    },
  })
);

//Ecommerce Service
app.use(
  '/ecom',
  createProxyMiddleware({
    target: `http://localhost:${SERVICE_VS_PORT.ecom}`,
    changeOrigin: false,
    pathRewrite: {
      '^/ecom': '/', // rewrite path
    },
  })
);

const SERVER_PROXY_PORT = 6005;
app.listen(SERVER_PROXY_PORT, () =>
  console.log(`Proxy server started on port ${SERVER_PROXY_PORT}`)
);
