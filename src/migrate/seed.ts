import { User } from "../models/user";

export function createUsers() {
  const records = []
  records.push(User.create({name: "Ondra", email: "aaa@aaa.aa"}))
  records.push(User.create({name: "Ondra 2 ", email: "awefwefwefaa@aaa.aa"}))
  return Promise.all(records)
}
