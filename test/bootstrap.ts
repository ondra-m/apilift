import { start as dbStart } from "../src/database"
import { start as serverStart } from "../src/server";
import { User } from "../src/models/user"

before(done => {
  (async () => {
    await dbStart()
    await serverStart()
    await User.create({ name: "test", email: "test@test.test", accessToken: "test" })

    done()
  })()
})

after((done) => {
  process.kill(process.pid, 'SIGTERM');
  done();
});
