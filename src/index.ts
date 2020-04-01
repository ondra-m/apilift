import { start as dbStart } from "./database"
import { start as serverStart } from "./server";

// import { User } from "./models/user";

// const a = new User({id: 1})
// a
// debugger

// User.create({name: "Ondra", email: "aaa@aaa.aa"})


(async () => {
  await dbStart()
  await serverStart()
})()

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// console.log("1");

// (async () => {
//   await sleep(2000)
// console.log("2");

// })();

// async function ondra() {
//   await sleep(2000)
//   console.log("3")
// }

// ondra()

//   console.log("4")
