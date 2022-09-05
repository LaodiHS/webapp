
import tempting_service from "./template_decorator.js";
import sessions from "./sessions.js"
import { is_valid, salt_hash_password } from "./database/crypt.js";
import dot from 'dotenv';
const env = dot.config().parsed;
const templates = {
  true: { html: "", style: 'login/login.css', token: null, user: null },
  false: { html: "", style: 'login/login.css', token: null, user: null },
}

/**
todo:
abstraction token from user 
change token from epoch to hash
**/


/**
todo:
for extra security send a time and activity sensitive token the client  
**/


/**
 *
 *
 * @export
 * @param {number} [time=3600000]
 */
export function expire_inactive_tokens(time = 3600000) {

  setInterval(() => {

    for (const token of sessions.keys()) {
      const naked_value = token.replace(/"/g, "")
      const active_user = Number(naked_value)
      if (Date.now() - active_user > time) {
        sessions.delete(token);
      }
    }
  }, time)
}

/**
@new_user_object {String}
@current_token {String} current temp token
generates temp token on server request
**/


export function generate_session(new_user_object = null, current_token = null) {

  const token = JSON.stringify(Date.now().toString());

  new_user_object && current_token && sessions.delete(current_token) && sessions.set(token, new_user_object)
  !new_user_object && current_token && sessions.set(token, sessions.get(current_token)) && sessions.delete(current_token)
  new_user_object && !current_token && sessions.set(token, new_user_object);

  return { token: token, user: sessions.get(token) }

}

/**
@req {Object}
@res {Object} 
checks client if their have a valid session 
**/





// return file object
export async function authenticate_status(user_token, template_id = null) {

  const is_there_a_session = sessions.has(user_token)
  const file = templates[is_there_a_session]
  const { token, user } = is_there_a_session ?
    generate_session(sessions.get(user_token), user_token)
    : { token: null, user: null };
  file.token = token;
  file.user = user;
  file.html = await tempting_service(user, template_id);
  return file;
}





export async function status(req, res) {
  const user_agent = req.headers['user-agent']
  const user_token = req.params.user_token;
  const template_id = req.params.template || null;
  const file = await authenticate_status(user_token, template_id)
  res.status(200).json(file);
}