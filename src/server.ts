import restify from "restify";
import { Endpoints } from "./controllers/endpoints";

export function start() {
  const server = restify.createServer()

  server.pre(restify.plugins.pre.context());
  server.use(restify.plugins.authorizationParser());
  server.use(restify.plugins.bodyParser({
    mapParams: true,
  }));

  new Endpoints(server).start()

  // server.get("/", (req, res, next) => res.send("ondra"))

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
}
