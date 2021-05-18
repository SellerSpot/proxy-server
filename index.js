const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

/**
 * Below SSL certificats should be generated with a wildcard domain `*.sellerspot.in`
 * @see {@link: https://web.dev/how-to-use-local-https}
 */

const options = {
  key: fs.readFileSync('./security/_wildcard.sellerspot.in+5-key.pem'),
  cert: fs.readFileSync('./security/_wildcard.sellerspot.in+5.pem'),
};

const SERVER_PROXY_PORT = 4505;
const SERVER_PROXY_PORT_HTTPS = 4506;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);
app.use(morgan('dev'));

const SERVICE_VS_PORT = {
  auth: 4500,
  core: 4501,
  catalogue: 4502,
  pos: 4503,
  ecom: 4504,
};

app.use('/', express.static('./public'));

//proxy Services
Object.keys(SERVICE_VS_PORT).forEach((service) => {
  app.use(
    `/${service}`,
    createProxyMiddleware({
      target: `http://localhost:${SERVICE_VS_PORT[service]}`,
      changeOrigin: false,
      pathRewrite: {
        [`^/${service}`]: '/', // rewrite path
      },
    })
  );
});

const server = app.listen(SERVER_PROXY_PORT, () =>
  console.log(`Proxy server HTTP started on port ${SERVER_PROXY_PORT}`)
);

https
  .createServer(options, app)
  .listen(SERVER_PROXY_PORT_HTTPS, () =>
    console.log(`Proxy server HTTPS started on port ${SERVER_PROXY_PORT_HTTPS}`)
  );
function shutDown(server) {
  console.log('Received kill signal, shutting down gracefully...');

  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not gracefully shutdown, forcefully shutting down...');
    process.exit(1);
  }, 10000);
}

const applyGracefullShutDownHandler = (server) => {
  console.log('Gracefull shutdown handler applied');
  const shutDownHanlder = () => shutDown(server);
  process.on('SIGTERM', shutDownHanlder);
  process.on('SIGINT', shutDownHanlder);
};

applyGracefullShutDownHandler(server);
