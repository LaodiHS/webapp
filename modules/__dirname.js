import { fileURLToPath } from "url";

import { dirname } from "path"


export default function __dirname() {
    return dirname(fileURLToPath(import.meta.url));
};
