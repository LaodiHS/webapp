import dot from 'dotenv';
import { Client, auth } from "twitter-api-sdk";
import { TwitterApi } from 'twitter-api-v2'
import Twit from 'twit'
const env = dot.config().parsed;

// const { writeFile, readFile } = require('./modules/personalized_file_system');
const client = new TwitterApi({
  appKey:"z9Wp0ymlvop4P7eCEsl7nOLnr", 
  appSecret:"P0bRsFhRfEHVYFUGl0MAuOWklaD2UgUqevMg6TjRYvlbQrKOvL",
  accessToken:"1529846470374936576-wMEMy8zfBHlc0dJFUxM3s2BenE11CC",
  accessSecret:"D8UqOShdPn5jnky1FONETGvy48LfKyr3Dmq8PjmdrbGFq"
});

const rwClient = client.readWrite







// const authClient = new auth.OAuth2User({
//   client_id: env.CLIENT_ID,
//   client_secret: env.CLIENT_SECRET,
//   callback: "http://127.0.0.1:8080/callback",
//   bearer_token: env.BEARER_TOKEN,
//   scopes: ["tweet.read", "tweet.write","users.read", "offline.access"],
// });

// var T = new Twit({
//   consumer_key:         env.CLIENT_ID,
//   consumer_secret:      env.CLIENT_SECRET,
//   access_token:         env.ACCESS_TOKEN,
//   access_token_secret:  env.ACCESS_TOKEN_SECRET,
//   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL:            false,     // optional - requires SSL certificates to be valid.
// })


export async function post(){
  // const client = new Client(process.env.BEARER_TOKEN);
 
  
  try{
    await rwClient.v1.tweet({status:"hello world"}) 
  //  T.post('statuses/update', { status: 'hello world!' })
  // let response = await    client.tweets.createTweet('statuses/update',{status:"this is a test tweet"})
 // console.log(response);
  }catch(err){
    console.log(err);
  }
}
post()

// post()
// async function main(name) {

//   const followers_t = JSON.parse(await readFile("twitter_followers.json", { encoding: "utf8" })) || {};
//   const following_t = JSON.parse(await readFile("twitter_following.json", { encoding: "utf8" })) || {};
//   const users_t = JSON.parse(await readFile("twitter_users.json", { encoding: "utf8" })) || {};
//   const private_users = JSON.parse(await readFile("twitter_private_users.json", { encoding: "utf8" })) || {};
//   const client = new Client(process.env.BEARER_TOKEN);
//   const user = await client.users.findUserByUsername("Sayjack41");
//   followers_t[user.data.id] = followers_t[user.data.id] || {};
//   following_t[user.data.id] = following_t[user.data.id] || {};

//   const user_following = async (id) => await client.users.usersIdFollowing(id)
//   const user_followers = async (id) => await client.users.usersIdFollowers(id)
//   const followers = [[user.data.id, following_t[user.data.id], user_following], [user.data.id, followers_t[user.data.id], user_followers]]
//   for await (let [id, tree, assocations] of followers) {

//     const assocates = await assocations(id);

//     if (assocates.errors || private_users[id]) {
//       private_users[id] = private_users[id] || users_t[id];
//       continue;
//     }
//     await new Promise((resolve, reject) => {

//       setTimeout(() => { resolve(true) }, 60000);

//     })

//     for (const follower of assocates.data) {
//       const f_id = follower.id
//       if (users_t[f_id]) continue;
//       tree[f_id] = {};
//       followers.push([f_id, tree[f_id], assocations])
//       users_t[f_id] = follower;
//     }

//   }
//   await writeFile("twitter_following.json", JSON.stringify(following_t), { encoding: "utf8" })
//   await writeFile("twitter_followers.json", JSON.stringify(followers_t), { encoding: "utf8" })
//   await writeFile("twitter_users.json", JSON.stringify(users_t), { encoding: "utf8" })
//   await writeFile("twitter_private_users.json", JSON.stringify(users_t), { encoding: "utf8" })

// }

// // main("Sayjack41");/





