var fs = require("fs");
const path = require("path");
const { makeDirectoryPaths, writeFile, fileInformation, isDirectory, dir } = require("./personalized_file_system.js")
const search_api_end_points = { english_to_chines_dictionary: { parse_path: 'csv_dictionaries/english_to_chines_dictionary.csv', api: () => path.join(__dirname, '/english_to_chines_dictionary') } }



function generateTree(arr, key = null, root = {}) {
  if (!key) throw Error("key needs to be specified");
  let ar = arr.constructor === Array ? arr : JSON.parse(JSON.stringify(arr));
  while (ar.length) {
    let node = ar.pop();
    let word = node[key];
    let temp_root = root;
    let trail = word.length;


    for (let letter of word) {
      temp_root[letter] = temp_root[letter] || {};
      !--trail ? (temp_root[letter]["*"] = temp_root[letter]["*"] || []) : null;
      !trail ? temp_root[letter]["*"].push(node) : (temp_root = temp_root[letter]);
    }
  }
  return root;
}

const stringify = require('json-stringify');
const { dirname } = require("path");


async function write_files(json, dirName) {
  dirName = `.file_system_root/${dirName}`;
  await makeDirectoryPaths(dirName)

  let root = generateTree(json, "word")

  let files = {};
  for (let key in root) {

    files[key] = files[key] || `${key}.json`
    let result = stringify(root[key])

    fs.writeFile(`${dirName}/${files[key]}`, result, { flag: 'w' }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`File was successfully saved ${files[key]}.`);
      }
    });
  }

}



async function grab_json_array_file(json_array_file) {
  try {
    return await readFile(json_array_file, { encoding: 'utf-8' })

  } catch (error) {
    console.error("error", error)
  }
}

function generate_direcotry_path_from_file_path(path_to_target_file) {

  let dir = path_to_target_file.split("/");

  dir = dir.pop() && dir.join("/");
  return dir
}


async function generate_dictionaries() {
  const csv = require('csvtojson')

  const chines_to_english_csv_file_path = 'dic/english-to-chines-dictionary/english-to-chines-dictionary.csv'
  const en_thesaurus_path = 'dic/english-thesaurus/en_thesaurus.json'
  const en_security_terms = 'dic/network_security_terms/network_security_terms.json'


  let en_chin_dir = generate_direcotry_path_from_file_path(chines_to_english_csv_file_path);

  let thesaurus = generate_direcotry_path_from_file_path(en_thesaurus_path);
  let security_terms = generate_direcotry_path_from_file_path(en_security_terms);


  const en_ch_json = await csv({ flatKeys: true }).fromFile(chines_to_english_csv_file_path)

  const thesaurus_json = await grab_json_array_file(en_thesaurus_path).then(data => JSON.parse(data));
  const secur_ter_json = await grab_json_array_file(en_security_terms).then(data => JSON.parse(data))

  write_files(en_ch_json, en_chin_dir);
  write_files(thesaurus_json, thesaurus);
  write_files(secur_ter_json, security_terms);

}


async function generate_hans_wehr_dictionary(arabic_word_list, hans_wehr) {
  const { readFile } = require("fs").promises
  const capture = {};
  const direction_list = (await readFile(arabic_word_list, { encoding: 'utf-8' })).split('\n').reduce((dic, val) => {
    capture[val] = capture[val] || [];
    const q = val.split("");
    let temp = dic;
    while (q.length) {
      let l = q.shift();
      temp[l] = temp[l] || {}
      temp = temp[l];
    }
    temp["*"] = (temp["*"] || []);
    return dic;
  }, {});


  const hans = (await readFile(hans_wehr, { encoding: 'utf-8' })).split(" ")
  while (hans.length) {
    const particle = hans.shift();
    const collection = capture[particle]
    while (collection && !capture[[hans[0]]]) {
      const sub_par = hans.shift();
      collection.push(sub_par);
    }
  }

  const hans_wehr_def = JSON.stringify(capture);
  hans_wehr_dir = hans_wehr.split(".");
  hans_wehr_dir.pop();
  let hans_wehr_dir_name = hans_wehr_dir.join(".");

  const hans_wehr_path = await makeDirectoryPaths(hans_wehr_dir_name);


  const arabic_word_list_path = arabic_word_list.split(".");
  const word_list_path = await makeDirectoryPaths(arabic_word_list_path.join("/"));

                fs.writeFile()

  return { hans_wehr_direction_list: direction_list, hans_wehr_collection: collection }

}



async function generate_arabic_dictionaries() {
  const { readFile } = require("fs").promises
  const hans_wehr_arabic_word_list = 'dic/arabic-wordlists/hans-wehr.wordlist'
  const hans_wehr = 'dic/arabic-wordlists/hans-wehr.txt';
  const { hans_wehr_direction_list, hans_wehr_collection } = generate_hans_wehr_dictionary(hans_wehr_arabic_word_list, hans_wehr)

  const quran_wordlist = 'dic/arabic-wordlists/quran.wordlist'
  const quran = 'dic/arabic-wordlists/quran.txt'

  const quran_text = (await readFile(quran, { encoding: "utf8" })).split(/\s+/g)
  const dic = {};
  const map = {};
  let i = 78245;

  while (i-- >= 0) {
    !dic[quran_text[i]] ? dic[quran_text[i]] = i : dic[quran_text[i]];
    const key = dic[quran_text[i]]
    map[key] = map[key] || { left: [], right: [] }
    map[key].left.push(i - 1);
    i < 78245 - 1 && map[key].right.push(i + 1)
  }











}


generate_arabic_dictionaries()








module.exports = { generate_dictionaries: generate_dictionaries };
