

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from "url";
import { is_valid, salt_hash_password } from "./crypt.js";
import { generate_session } from "../status.js"
import sessions from "../sessions.js"
import body from "express-validator";
import update_database from './update_database.js';

const validation_module = body
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

export async function signup(req, res) {

    try {

        await db.read();

        const id = db.data.length;
        const user_found = db.data.find(user => user.email === req.body.email)

        if (user_found) {
            res.status(401).json({ "message": `use your own email Dude/Duetted! 🧐`, color: "#c94c4c" })

        } else {

            db.data[id] = { id: id }
            const { hash, salt } = salt_hash_password(req.body.password);
            req.body.password = hash;
            Object.assign(db.data[id], { password: hash, salt: salt })

            const user_object = update_database([req.body, db.data[id]])

            await db.write();

            res.status(201).json(generate_session(user_object))
        }

    } catch (error) {

        console.error(error)

    }
};

/*
todo:
use validation_module
to sanitize all inputs server side 
*/
export async function update_user(req, res) {

    const token  = req.body.token ;
    const has_session = sessions.has(token)
    const user = has_session ? sessions.get(token) : res.status(401).json({ message: "token_exp" })
    if (has_session) {
        
        try {

            await db.read();
            delete req.body.token
            const user_object = update_database([req.body, db.data[user.id]])
            await db.write();

            res.status(200).json(generate_session(user_object, token));

        } catch (error) {

            console.error(error)
        }
    }
};

export async function login(req, res) {

    const email = req.body.email;
    const pass = req.body.password;

    try {
        await db.read();

        const user_object = db.data.find(users => users.email === email);
        const valid_user = Boolean(user_object) ? is_valid(user_object.password, pass, user_object.salt) : false;
        delete user_object["salt"]
        delete user_object["password"]

        Boolean(valid_user) ? res.status(200).json(generate_session(user_object)) : res.status(401).json({ "message": `Are you up a creek, try password reset! 🧐`, color: "red" });

    } catch (err) {

        console.error(err);

    }
}



