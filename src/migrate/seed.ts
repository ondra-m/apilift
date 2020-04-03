import { User } from "../models/user"

export function createUsers() {
  const records = []
  records.push(User.create({name: "Admin", email: "admin@example.net", accessToken: "d70bce60-73ed-11ea-bc9d-b7f14190b585"}))
  records.push(User.create({name: "Applifting", email: "info@applifting.cz", accessToken: "93f39e2f-80de-4033-99ee-249d92736a25"}))
  records.push(User.create({name: "Batman", email: "batman@example.com", accessToken: "dcb20f8a-5657-4f1b-9f7f-ce65739b359e"}))
  return Promise.all(records)
}
