const { join } = require("path");
const { readdir, stat } = require("fs");
const { promisify } = require("util");
const path = require("path");
const directoryPath = __dirname;
__dirname;

path;
const readdirP = promisify(readdir);
const statP = promisify(stat);
const { all } = require("express/lib/application");
const { isTypedArray } = require("lodash");

/**
 * @apiName nodeModuleComponent
 * @param {String} nodeModule
 * @returns {ObjectChain}
 */

async function nodeModuleComponent(nodeModule, done) {
  let myRoot = {};
  let path_th = `${__dirname}/../node_modules/${nodeModule}`;

  if (typeof nodeModule !== "string") return done(Error("Must be a string"));

  if (await !(await statP(path_th)).isDirectory())
    return done(Error("not a directory in node modules"));

  const queue = await Promise.all(
    (
      await readdirP(path_th)
    ).map(async (file) => {
      let node = { dir: path_th, files: [] };
      // console.log("file", file)
      let p = path_th + "/" + file;
      let s = await statP(p);
      if (!s.isDirectory()) node.files.push(file);
      return node;
    })
  );
  const color = {};
  while (queue.length) {
    let node = queue.pop();

    let p = node.dir;

    if (color[p]) {
      let i = 0;
      let parent_dir = p.split("/");
      let sub_root = myRoot;
      while (parent_dir[0] !== nodeModule) parent_dir.shift();
      while (parent_dir.length) {
        let n = parent_dir.shift();
        sub_root[n] = sub_root[n] || {};
        sub_root = sub_root[n];
      }

      if (!node.files.length) continue;

      sub_root.files = sub_root.files || [];
      sub_root.files = [...sub_root.files, ...node.files];
      continue;
    }
    color[p] = true;

    let s = await (await statP(p)).isDirectory();

    if (s) {
      const leafNodes = await readdirP(p);
      while (leafNodes.length) {
        let leafNode = leafNodes.pop();
        let leaf = node.dir + "/" + leafNode;
        let s = await (await statP(leaf)).isDirectory();

        if (s) {
          let gen_node = { dir: leaf, files: [] };

          queue.push(gen_node);
          continue;
        } else node.files.push(leafNode);
      }
      queue.push(node);
    }
  }

  return myRoot;
}
// catch (error) {
//   console.error(error);
// }
// }

module.exports = {
  nodeModuleComponent,
};
