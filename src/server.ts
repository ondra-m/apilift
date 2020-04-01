import restify from "restify";
import { Endpoints } from "./controllers/endpoints";
import { Users } from "./controllers/users";

export let server: restify.Server

export function start() {
  return new Promise(resolve => {
    server = restify.createServer()

    server.pre(restify.plugins.pre.context());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.bodyParser({
      mapParams: true,
    }));

    new Endpoints(server).start()
    new Users(server).start()

    server.listen(3000, function() {
      console.log('%s listening at %s', server.name, server.url);
      resolve()
    });
  })
}
