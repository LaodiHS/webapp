import fs from "fs";
import { PdfReader } from "pdfreader";
import PDFParser from 'pdf2json'
import StringifyStream from "stringifystream";
import file_system_tools from './file_system.js'

const { file_system, root_dir, this_dir, join } = file_system_tools();


async function getPDFData() {
  let results = {};
  const words = {}
  // const  file = await file_system.readFile()

  const pdfParser = new PDFParser(this, 1);
  pdfParser.loadPDF(join(root_dir, "dic/english/english_idioms.pdf"))

  const pages = [];
  await new Promise((resolve, reject) => {

    pdfParser.on("pdfParser_dataReady", data => {

      let i = 0
      while (data.Pages.length) {
        const page = data.Pages.shift();
        pages.push([i++, page]);
      }

      while (pages.length) {
        const [color, node] = pages.shift();

        if (node && node.T) {
          results[color] = results[color] || []
          const str = decodeURIComponent(node.T)
          results[color].push(str)
          let temp = words;
          const literal = str.split("");

          let i = literal.length;
          for (const letter of literal) {
            if (letter === "*" || typeof letter === "undefined") {
              temp["*"] = temp["*"] || []
              temp["*"].push({ word: literal, text: str })
              break;
            }
            temp[letter] = temp[letter] || {};
            temp = temp[letter];

            if (!--i) {
              temp["*"] = temp["*"] || []
              temp["*"].push({ word: literal, text: str })

            }
          }


        }

        node && ((node.constructor === Array) || (node.constructor === Object)) && Object.keys(node).map(key => {
          node[key] && ((node[key].constructor === Array) || (node[key].constructor === Object)) && pages.unshift([color, node[key]])
        })
      }



      resolve(true)


    })


  })

  const path = join(root_dir, join(join(".file_system_root/dic", "english_idioms")))
  for (const word in words) {


    await file_system.writeFileAsync(join(path, `${word}.json`), JSON.stringify(words[word]), { encoding: "utf8" })

  }


  // await file_system.writeFileAsync(join(root_dir, "idioms_definitions.json"), JSON.stringify(results))

}

getPDFData()




