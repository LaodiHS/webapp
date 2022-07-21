
import file_system_tools from '../modules/file_system.js'

const { file_system, this_dir, join } = file_system_tools(import.meta.url);
const { writeFileAsync, readFileAsync } = file_system;
export async function authorization_json(add_fields = "admin.coordinator") {


    const auth_object = JSON.parse(readFileAsync(join(this_dir, 'authentication_routes.json'), { encoding: "utf8" }));
    const fields = add_fields.split(".")
    const root = auth_object[true]


    while (root[fields[0]].constructor === Object && fields.length) {
        root = root[fields.shift()];

    };
    while (fields.length) {
        root[fields[0]] = (root[fields[0]] || {})
        root[fields[0]]
        fields.shift();
    }

    writeFileAsync(join(this_dir, 'authentication_routes.json', { encoding: "utf8" }))


}

/**
 * @code .js
 * @param {Object} responsibility_table
 * @returns {Object} responsibility_object: html
 */
export function get_user_interface(table) {


    /**
     * 
     * @param {String} responsibility_chain, string object denoted by 
     * @brief the responsibility_chain aligns 
     * @example: user.user_services.admin, user.tomato_eaters_club.tomato_president etc...
     * 
     */

    return function (responsibility_chain) {
    responsibility_chain =  Boolean(responsibility_chain) &&  responsibility_chain.responsibility
    responsibility_chain= responsibility_chain.toString();
        responsibility_chain = responsibility_chain.trim();
        let responsibility_table = table
        let temp_table = table[true.toString()];
        const is_user_seated = Boolean(responsibility_chain && responsibility_chain.split(".").every(prop => [temp_table = temp_table[prop], temp_table][1]))
        responsibility_chain = is_user_seated && responsibility_chain.split(".");

        responsibility_table = responsibility_table[is_user_seated.toString()];

        const auth = responsibility_chain;
        while (auth.length) {
            let responsibility = auth.shift();
            responsibility_table = responsibility_table[responsibility]
        }

        responsibility_table = new Map(Object.entries(responsibility_table).filter(prop => prop[1].constructor === String))

        return responsibility_table
    }
}

/**
 * @code .js
 * @returns {Object} user_interface
 */
export default async function responsibility() {
    let dir = join(this_dir, "responsibility_table.json")
    try {
        let table = await readFileAsync(dir, { encoding: "utf8" })

        const authentication_routes = JSON.parse(table);

        const user_interface = get_user_interface(authentication_routes)

        return { user_interface:user_interface };
    } catch (err) {
        console.log(err)
    }
}


async function test() {
    const route = await responsibility();
    console.log((() => {
        try {
            return route.user_interface(false).html === "login"
        }
        catch (err) {
            return err
            return true;
        }
    })());
    let b = route.user_interface("user.admin").get("html")
    b === "admin"
    console.log(b === "admin");
    [
        route.user_interface("user").get("html") === "user",
        route.user_interface("").get("html") === "login",
        route.user_interface("does_not_exist").get("html") === "login",
        route.user_interface("admin").get("html") === "login",

    ].forEach(res => console.log(res))

};

