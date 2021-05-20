function shutDown(server) {
  console.log("Received kill signal, shutting down gracefully...");

  server.close(() => {
    console.log("Server closed gracefully");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not gracefully shutdown, forcefully shutting down...");
    process.exit(1);
  }, 3000);
}

const applyGracefullShutDownHandler = (server) => {
  console.log("Gracefull shutdown handler applied");
  const shutDownHanlder = () => shutDown(server);
  process.on("SIGTERM", shutDownHanlder);
  process.on("SIGINT", shutDownHanlder);
};

module.exports = {
  applyGracefullShutDownHandler,
};
