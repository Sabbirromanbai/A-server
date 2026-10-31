import { getAuthDb } from "../../config/db.js";

export async function getPublicUserProfiles(emails) {
  const uniqueEmails = [...new Set(emails.filter((email) => typeof email === "string" && email))];
  if (uniqueEmails.length === 0) {
    return [];
  }

  const users = await getAuthDb()
    .collection("user")
    .find(
      { email: { $in: uniqueEmails } },
      {
        projection: {
          _id: 0,
          email: 1,
          name: 1,
          image: 1,
        },
      },
    )
    .toArray();

  return users.map((user) => ({
    email: user.email,
    name: typeof user.name === "string" ? user.name : null,
    image: typeof user.image === "string" ? user.image : null,
  }));
}
