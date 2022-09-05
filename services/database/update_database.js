export default function update_database(database_object) {

    const db_data = database_object;
    const fields = [database_object]
    while (fields.length) {
        const [field, body] = fields.pop()
        for (const key in field) {
            if (body[key] && (typeof field[key]) === "object") {
                fields.push([field[key], body[key]])
                continue;
            }
            body[key] = field[key] || {}

        }
    }
    const data = JSON.parse(JSON.stringify(database_object[1]))
 
    delete data.password;
    delete data.salt;
    delete data.hash;
    delete data.token;
    return data;

}