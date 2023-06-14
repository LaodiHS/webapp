import Promise from "bluebird";
import permission from "./permission/responsibility.js";

import fs from "fs";

import __dirname from "../modules/__dirname.js";
import dot from "dotenv";
const env = dot.config().parsed;

const root_dir = __dirname().slice(0, __dirname().lastIndexOf("/"));

const fileSystem = Promise.promisifyAll(fs);

class Form_Generator {
  constructor(tag_properties) {
    this.section = [];
  }

  generate_user_section(user_object, tag_properties) {
    return this.form_values(user_object, tag_properties);
  }

  form_values(fields, tag_properties) {
    this.section.length = 0;

    const client_form = [[[], fields]];

    while (client_form.length) {
      const [route, input] = client_form.pop();

      for (const [key, value] of Object.entries(input)) {
        const temp = route.slice();

        const label = route.slice();
        label.push(key);
        temp.push(key + (input[key] ? "." : ""));

        value.constructor === Object
          ? client_form.push([temp, value])
          : this.section_generator(label.join(""), value, tag_properties);
      }
    }
    return this.section.join("\n");
  }

  section_generator(route, value, tag_properties) {
    if (tag_properties[route]) {
      const trans_form = route.split(".").reverse().join(" ");
      const display_value =
        trans_form.charAt(0).toUpperCase() + trans_form.slice(1, route.length);

      const tag = tag_properties[route] || {};

      this.section.push(`<div class="input-row">
    <label class="form-label" for="${route}">${display_value}:</label>
    <input class="input-group-text ${
      tag_properties.css_state || ""
    }" id=${route} prop="${route}" type="${tag.type || "text"}" placeholder="${
        value || tag.example || display_value
      }"  
   ${tag.pattern ? "pattern=" + tag.pattern : ""} value="${
        value || ""
      }" title="${display_value}" required autocomplete="off" ${
        tag.disabled ? "disabled" : ""
      } />
    </div>`);
    }
  }
  signup() {
    return this.form_values(
      {
        name: {
          first: "bob",
          last: "joe",
        },
        email: Math.random() + "@gmail.com",
        address: "24552",
        balance: "1234",
        phone: "1-949-742-1026",
        company: "chenchoon",
        password: Math.random(),
      },
      {
        css_state: "empty_input",
        "name.first": {
          type: "text",
          disabled: false,
          title: "Your Last Name",
        },
        "name.last": { type: "text", disabled: false, title: "Your Last Name" },
        balance: { type: "number", disabled: true },
        password: { type: "password", disabled: false, title: "Your password" },
        email: { type: "email", disabled: false, title: " Your Email" },
        phone: {
          type: "tel",
          pattern: "[0-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}",
          example: "1-949-712-1536",
          disabled: false,
          title: "10 digit phone number",
        },
      }
    );
  }
}

export function template_decorator(template, decorator) {
  try {
    const temp = new Form_Generator();
    return eval("`" + template + "`");
  } catch (err) {
    console.error(err);
  }
}

export async function html_snippets() {
  let paths = await fileSystem.readdirAsync(root_dir + "/public/html");
  paths = paths.map((file) => root_dir + "/public/html/" + file);
  for (const dir of paths) {
    const is_file = await fileSystem.statAsync(dir).catch(console.error);

    if (await is_file.isDirectory()) {
      (await fileSystem.readdirAsync(dir).catch(console.error)).map((file) =>
        paths.push(dir + "/" + file)
      );
    }
  }

  const Files = new Map();
  while (paths.length) {
    let file = paths.pop();
    file.includes(".") &&
      Files.set(
        file.split("/").pop().split(".").shift(),
        await fileSystem.readFileAsync(file, { encoding: "utf8" })
      );
  }
  return Files;
}

let getFiles = false;

export default async function tempting_service(user, template_id) {
  const { user_interface } = await permission();
  getFiles = getFiles ? getFiles : await html_snippets();
  const inter = user_interface(user).get("html_base_name");
  const file = getFiles.get(template_id || inter);

  let html = template_decorator(file, user);

  if (env && env.NO_CACHE) {
    getFiles = false; // clears cache, remove when done testing
  }

  return html;
}

// const section = template.form_values({
//   "name": {
//     "first": "",
//     "last": ""
//   },
//   "email": "",
//   "address": "",
//   "balance": "",
//   "phone": "",
//   "company": ""
// }, {
//   "name.first": { type: "text", disabled: false, title: "Your Last Name" }, "name.last": { type: "text", disabled: false, title: "Your Last Name" },
//   "balance": { type: "number", disabled: false },
//   "phone": { type: "tel", pattern: "[0-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}", example: "1-949-712-1536", disabled: false, title: "10 digit phone number" }

// });
