import axios from 'axios';
import { captureRejections } from 'events';
import fs, { appendFile } from 'fs';
import Promise from "bluebird"

import { join, dirname } from 'path'
import { fileURLToPath } from "url";
import dot from 'dotenv';

const axios_con = {

    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }

};

const env = dot.config().parsed;
const fileSystem = Promise.promisifyAll(fs);
const __dirname = dirname(fileURLToPath(import.meta.url))
const fetch = {};
const method = (method) => axios[method];
const ax = Object.keys(axios);

while (ax.length) {
    const pr = ax.pop()
    fetch[pr] = async (api, payload = {}) => await method(pr)(env.BASENAME + "/" + api, payload, axios_con)
}



const rand = () => (Math.floor(Math.random() * 1000) % (Math.floor((Math.random() * 1000)) + 1)).toString()
const rand_str = () => Date.now().toString().split("").map(char => 'a'.charCodeAt() + +char).map(char => String.fromCharCode(char)).join("")
const random_string = async () => new Promise((resolve, _) => { setTimeout(() => resolve(rand_str()), 1) })

const users = [];
const tests = [];





export async function clear_database() {
    const file = join(__dirname, 'api/database/db.json')
    try {

        await fileSystem.writeFileAsync(file, "[]", { encoding: "utf8" })
        tests.push(["clear database", true])

    } catch (err) {
        tests.push(["clear database", false]);

    }

}


export async function generate_users(user_count,callback) {

    try {
        let i = 0;
        while (i++ < user_count) {
            users.push({
                name: { first: (await random_string()), last: (await random_string()) }, email: (await random_string()) + '@' + (await random_string()) + '.com', address: (await random_string()) + " parkway CA," +
                    (Date.now().toString().slice(7, 12)), balance: '$ ' + rand() + "." + rand().slice(0, 2), password: await random_string(), phone: Math.floor(Math.random() * 10000000000).toString(), company: await random_string()
            });
        }

                callback(users);

        tests.push(["generate database", true])
        return users;
    } catch (err) {
        tests.push(["generate database", false])
    }
}


export async function get_database() {
    try {
        const dir = join(__dirname, 'api/database/db.json')
        const file = await fileSystem.readFile(dir, { encoding: "utf8" })

        tests.push(["retrieve database", true])

        return JSON.parse(file);

    } catch (err) {

        tests.push(["retrieve database", false])
    }
}



export async function check_all_inserted_users_in_database(users) {
    const dir = join(__dirname, 'api/database/db.json')
    const file = await fileSystem.readFile(dir, { encoding: "utf8" })
    const users_in_database = json.parse(file);

    for (const user of users) {

        users_in_database[user.id]

    }
    
    tests.push(["check_all_inserted_users_in_database"])


}


export async function sign_up_all_users() {


    try {

        await clear_database();

        const users = await generate_users(100)

        for (const user of users) {

            const response = await fetch.post("signup", user).then(res => res.data);


            // write test to check all responses for session token
            // check session token for valid session on server
            // check all inputs are in the database
            // check for salt and has in database
            // check response clears all sensitive data; 

        }

        await check_all_inserted_users_in_database(users)



        tests.push(["sign_up_all_users", true])

    } catch (err) {

        tests.push(["sign_up_all_users", false])
    }
}







async function run_all_tests() {

    await sign_up_all_users()
    let all_tests = true;
    for (let test of tests) {
        console.log(test)
        all_tests = test[1];
        if (!all_tests) break;
    }



    console.log("All tests passed ", all_tests, all_tests ? "All the tests passed 😎" : "tests failed 🧐")
};


run_all_tests();
