import fs from 'fs';

import file_system_tools from './file_system.js'
const {file_system, this_dir, root_dir, join} = file_system_tools()

const cache = {}
export default async  function search(req, response) {
  try {
    let word = req.params.word.split("");
    let limit = req.params.limit;
    const api = req.params.api
    if (cache[req.params.word + req.params.api + req.params.limit])
      return response.status(200).json(cache[req.params.word + req.params.api + req.params.limit]);

   const dir_i = join(root_dir , `/.file_system_root/dic/${api}/${word.shift()}.json`);
    let root = JSON.parse(await file_system.readFileAsync(dir_i, "utf8"));
    let temp_root = root;
    let path = word.length;
    let results = [];
    for (let letter of word) {
      if (!temp_root[letter]) {
        return response.sendStatus(404);

      }
      temp_root = temp_root[letter]

    }
    const queue = [temp_root];
    while (queue.length) {
      const suggested = queue.pop();
      for (let branch in suggested) {
        branch === "*"
          ? results.push(suggested[branch])
          : queue.push(suggested[branch]);
      }
      queue.length = results.length >= limit ? 0 : queue.length;
    }

    results.length ? response.status(200).json(results.flat(Infinity)) : response.sendStatus(404);
   if(results.length)cache[req.params.word + req.params.api + req.params.limit] = results.flat(Infinity);
  } catch (error) {
    response.sendStatus(404);
  }
}




