const { PasteClient, Publicity, ExpireDate } = require('pastebin-api')

require('dotenv').config();

const client = new PasteClient(process.env.PASTE_BIN_API_KEY)

async function pasteBinClient() {

    // const bins = (await getAllDocs()).reduce((dep, file) => (dep[file.paste_title] = file, dep), {});
    const bins = {};
    return { pasteBin: pasteBin, bins: bins };

    async function getAllDocs() {
        const token = await client.login(process.env.PASTE_BIN_USER, process.env.PASTE_BIN_PASSWORD);
        const pastes = await client.getPastesByUser({
            userKey: token,
            limit: 100,
        })
        return pastes;
    }


    async function pasteBin(text, fileName, type = "json") {

        const token = await client.login(process.env.PASTE_BIN_USER, process.env.PASTE_BIN_PASSWORD);

        const url = await client.createPaste({
            code: text,
            expireDate: ExpireDate.Never,
            format: type,
            name: fileName,
            publicity: Publicity.Unlisted,
            apiUserKey: token
        })

        bins[fileName] = url;
        return url;

    }


}
module.exports = pasteBinClient;