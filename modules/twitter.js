

require('dotenv').config();
import { Client, auth } from "twitter-api-sdk";
const { writeFile, readFile } = require('./modules/personalized_file_system');


const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback: "http://127.0.0.1:8080/callback",
  bearer_token: process.env.BEARER_TOKEN,
  scopes: ["tweet.read", "users.read", "offline.access"],
});


async function main(name) {

//   const followers_t = JSON.parse(await readFile("twitter_followers.json", { encoding: "utf8" })) || {};
//   const following_t = JSON.parse(await readFile("twitter_following.json", { encoding: "utf8" })) || {};
  const users_t = JSON.parse(await readFile("twitter_users.json", { encoding: "utf8" })) || {};
  const private_users = JSON.parse(await readFile("twitter_private_users.json", { encoding: "utf8" })) || {};
  const client = new Client(process.env.BEARER_TOKEN);
  const user = await client.users.findUserByUsername("Sayjack41");
  followers_t[user.data.id] = followers_t[user.data.id] || {};
  following_t[user.data.id] = following_t[user.data.id] || {};

  const user_following = async (id) => await client.users.usersIdFollowing(id)
  const user_followers = async (id) => await client.users.usersIdFollowers(id)
  const followers = [[user.data.id, following_t[user.data.id], user_following], [user.data.id, followers_t[user.data.id], user_followers]]
  for await (let [id, tree, assocations] of followers) {

    const assocates = await assocations(id);

    if (assocates.errors || private_users[id]) {
      private_users[id] = private_users[id] || users_t[id];
      continue;
    }
    await new Promise((resolve, reject) => {

      setTimeout(() => { resolve(true) }, 60000);

    })

    for (const follower of assocates.data) {
      const f_id = follower.id
      if (users_t[f_id]) continue;
      tree[f_id] = {};
      followers.push([f_id, tree[f_id], assocations])
      users_t[f_id] = follower;
    }

  }
//   await writeFile("twitter_following.json", JSON.stringify(following_t), { encoding: "utf8" })
//   await writeFile("twitter_followers.json", JSON.stringify(followers_t), { encoding: "utf8" })
//   await writeFile("twitter_users.json", JSON.stringify(users_t), { encoding: "utf8" })
//   await writeFile("twitter_private_users.json", JSON.stringify(users_t), { encoding: "utf8" })

}

main("Sayjack41");










export default function twitter(){
    const client = new Client(process.env.BEARER_TOKEN);
    const user = await client.users.findUserByUsername("Sayjack41");
}




