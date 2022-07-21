const { promisify } = require("util");
const fs = require("fs");
const path = require('path')
const dir = __dirname.split("/")
dir.pop();

const file_system = {
    dir:dir.join("/") + "/.file_system_root/",
    system_root: {},
    isDirectory:
        (async (file) =>
            (await (await (promisify(fs.stat)(file))).isDirectory())),
    fileInformation:
        async (path_, error_code = 2, log = false) => await new Promise(async (resolve, reject) => {
            return fs.stat(path_, async (err, stat) => {
                if (err && err.errno !== error_code) throw Error("file error:", err);
                if (log) console.log("fileInforatmion :", "error :", err, " stat", stat);
                return err ? resolve(false) : resolve(stat)
            })
        }),
    doesFileExist:
        async (path_, error_code, log = false) => {
            const error_codes = { if_file_does_not_exist_create_it: -2 }
            return await new Promise(async (resolve, reject) =>
                fs.stat(path_, (err, stat) => {
                    if (err && err.errno !== error_code) throw Error("file error:", err);
                    if (log) console.log("fileInforatmion :", "error :", err, " stat", stat)
                    err ? resolve(false) : resolve(true);

                }))
        },
    read_dir: promisify(fs.readdir),
    readFile: fs.promises.readFile,
    makeDirectory: fs.promises.mkdir,
    writeFile: fs.promises.writeFile,
    copyDir: async (src, dest) => {
        with (file_system) {
            let l = path.join(dest, src)
            await fileInformation(l, -2, true) && await deleteDirectory(l);
            await makeDirectory(l);

            const files = (await read_dir(src)).map(dest => path.join(src, dest))
            for (const file of files) {

                const dir = (await isDirectory(file)) && (await read_dir(file)).map(subFiles => files.push(path.join(file, subFiles)))
                try {
                    !dir && (await writeFile(path.join(dest, file), await readFile(file, { encoding: 'utf-8' })));
                } catch (err) {
                    console.log(err);
                }

            }
        }
    },
    makeDirectoryPaths: async (str) => {
        with (file_system) {
            let path_dir = str.split("/")
            
            let trail = file_system.dir;
            for (let dir of path_dir) {
                trail = path.join(trail, dir);
                const directoryExist = (await fileInformation(trail, -2));
                !directoryExist && await makeDirectory(trail);
            }
            return trail;
        }
    },
    deleteDirectory: async (directory, callback) => {
        with (file_system) {
            const files = (await read_dir(directory)).map(file => path.join(directory, file))

            const adjcent_dirs = [directory];
            for (let file of files) {

                const links = await isDirectory(file) && (await read_dir(file)).map(leaf => files.push(file + "/" + leaf)) && adjcent_dirs.unshift(file)
                !links && deleteFile(file);

            }
            for (let dir of adjcent_dirs) {
                await fs.promises.rmdir(dir, { recursive: true })
            }
        }
    },
    fileSize: async (file) =>
        (await fs.statSync(file)).size,

    deleteFile: (path, callback) =>
        fs.unlink(path, () => {

        })
}

module.exports = file_system;