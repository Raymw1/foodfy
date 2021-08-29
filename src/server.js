const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const methodOverride = require("method-override");
const session = require("./config/session");
const path = require("path");
const server = express();

server.use(session);
server.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));
server.set("view engine", "njk");
nunjucks.configure(path.join(__dirname, "app/views/"), {
  express: server,
  autoescape: false,
  noCache: true,
});
server.use(routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Go to: http://127.0.0.1:${PORT}`);
});
