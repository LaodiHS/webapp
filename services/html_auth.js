
import { authenticate_status } from './status.js'


export async function html_auth(req, res) {
  const template_id = req.params[0].slice(1);
  const user_agent = req.headers['user-agent']
  const user_token = req.params.token;

  const file = await authenticate_status(user_token, template_id)


  res.status(200).json(file);

}