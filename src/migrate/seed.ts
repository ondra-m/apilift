import { User } from "../models/user";

export function createUsers() {
  const records = []
  records.push(User.create({name: "Admin", email: "admin@example.net", accessToken: "d70bce60-73ed-11ea-bc9d-b7f14190b585"}))
  return Promise.all(records)
}
