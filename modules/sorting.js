function arrange() {
    let randomNum = [];
    let i = 1000;
    let c = 1;
    while (i > 0) {
      randomNum[--i] = Math.floor(Math.random() * (1000 - c) + c);
    }
  
    let circle_source = {};
    let place = [];
    let hold = randomNum.slice();
    for (let val of randomNum) {
      let circle = circle_source;
  
      let node = JSON.stringify(val).split("");
      node.push(".");
      let depth = node.length;
  
      for (let char of node) {
        if (char === ".") {
          circle[char] = circle[char] || [];
          circle[char].push(val);
          continue;
        }
        circle[char] = circle[char] || {};
  
        circle = circle[char];
      }
    }
  
    let lookup = circle_source;
    let queue = [lookup];
    let resolved = [];
  
    for (const node of queue) {
      for (let key in node) {
        for (const marker in node[key]) {
          if (marker === ".") {
            for (let num of node[key]["."]) {
              resolved.push(num);
            }
            continue;
          }
        }
        queue.push(node[key]);
      }
    }
    randomNum.sort((a, b) => a - b);
  }
  arrange();