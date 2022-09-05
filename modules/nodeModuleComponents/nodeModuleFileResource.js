
  class GenerateDomResources {
    constructor() {
      this.memory = {};
      this.dependency={
        scripts: [],
        js: (copy, file) =>
          (this.dependency.scripts.push(`<script src="static/${copy}/${file}"></script>`)),
        styles: [],
        css: (copy, file) =>
          (this.dependency.styles.push( `<link rel="stylesheet" href="static/${copy}/${file}"></link>`)),
      };
    }


    async getAllScripts (array)
    {
      const hash = array.join(".");
      if (this.memory[hash]) return this.memory[hash];
      let domeResources = { scripts: "", styles: "" };
      let stop = false;
      while (!stop) {
        let res = array.shift();
       let genScripts=  await this.generateScripts(res)
        while (genScripts) {
          if (genScripts.scripts || genScripts.styles) {
            domeResources.scripts += genScripts.scripts + "\n";
            domeResources.styles += genScripts.styles + "\n";
            break;
          }
        }
        

        
        if (!array.length ) stop = true;
      }

      this.memory[hash] = domeResources;
      return domeResources;
    }
    async generateScripts (srcObjectPathStr)
    {
      try {
        if (this.memory[srcObjectPathStr]) return this.memory[srcObjectPathNodes];
        if (typeof srcObjectPathStr !== "string") throw Error("must best string");
        let srcObjectPathNodes = srcObjectPathStr.split(".");

        const { nodeModuleComponent } = require("./nodeModuleComponent.js");
        let root = await nodeModuleComponent(srcObjectPathNodes[0]);

        const srcObjectPath = srcObjectPathNodes.slice();
        while (srcObjectPathNodes.length) {
          let l = srcObjectPathNodes.shift();
          root = root[l];
        }
        if (root.constructor.name !== "Array") throw Error("module end point needs to be an array");
        let srcPath = srcObjectPath;
        srcPath.pop();
        const srcPathStr = srcPath.join("/");
        
        const files = root;
        while (files.length) {
          const scriptsNode = files.shift();
          if (scriptsNode.includes(".css"))this.dependency.css(srcPathStr, scriptsNode);
          
          if (scriptsNode.includes(".js"))this.dependency.js(srcPathStr, scriptsNode);
        }
        let resource = { scripts: this.dependency.scripts.join("\n"), styles: this.dependency.styles.join("\n") };
        this.dependency.scripts.length = 0;
        this.dependency.styles.length = 0;
        this.memory[srcObjectPathStr] = resource;
        return resource;
      } catch (error) {
        console.error(error);
      }
    }
  }


module.exports = {GenerateDomResources}