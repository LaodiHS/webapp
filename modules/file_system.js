import fs from 'fs';

import Promise from 'bluebird'

import { join, dirname } from 'path'


import { fileURLToPath } from "url";


const root_import = import.meta.url;

export default function file_system_tools(meta = import.meta.url) {
    const file_system = Promise.promisifyAll(fs);

    const this_dir = dirname(fileURLToPath(meta))
    let root_dir = dirname(fileURLToPath(root_import)).split("/")
    root_dir.pop();
    root_dir = root_dir.join("/");
    return { file_system, this_dir, root_dir, join };
}


