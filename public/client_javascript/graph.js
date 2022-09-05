
function graph() {
  const graphNodes = {
    Data_Bases: ["MongoDB", "SQL", "PostgreSQL"],
    Languages: ['C++', 'Vanillia JavaScript', 'Node', 'Go', 'C', 'Assembly'],
    Client: ["Browser", "Discord", "Postman", "Angular", "React"],
    "API's": ["Google Services", "RESTfull", "WordPress", "Stock Data"]
  };
  // Add and remove elements on the graph object
  addNode = function (id) {
    nodes.push({
      "id": id
    });
    update();
  };

  removeNode = function (id) {
    var i = 0;
    var n = findNode(id);
    while (i < links.length) {
      if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
        links.splice(i, 1);
      } else i++;
    }
    nodes.splice(findNodeIndex(id), 1);
    update();
  };

  removeLink = function (source, target) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].source.id == source && links[i].target.id == target) {
        links.splice(i, 1);
        break;
      }
    }
    update();
  };

  removeallLinks = function () {
    links.splice(0, links.length);
    update();
  };

  removeAllNodes = function () {
    nodes.splice(0, links.length);
    update();
  };

  addLink = function (source, target, value) {
    links.push({
      "source": findNode(source),
      "target": findNode(target),
      "value": value
    });
    update();
  };

  var findNode = function (id) {
    for (var i in nodes) {
      if (nodes[i]["id"] === id) return nodes[i];
    };
  };

  var findNodeIndex = function (id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id == id) {
        return i;
      }
    };
  };

  // set up the D3 visualisation in the specified element
  let windowSize = window.getComputedStyle(document.getElementById("sv"))

  const windowWidth = +windowSize.width.slice(0, windowSize.width.length - 2),
    windowHeight = +windowSize.height.slice(0, windowSize.height.length - 2) || 500;


  const color = d3.scale.category10();

  const vis = d3.select(document.getElementById("sv"))
    .append("svg:svg")
    .attr("width", windowWidth)
    .attr("height", windowHeight)
    .attr("id", "svg")
    .attr("pointer-events", "all")
    .attr("viewBox", "0 0 " + windowWidth + " " + windowHeight)
    .attr("perserveAspectRatio", "xMinYMid")
    .append('svg:g');

  const force = d3.layout.force();

  const nodes = force.nodes(),
    links = force.links();

  function update() {
    const link = vis.selectAll("line")
      .data(links, function (d) {
        return d.source.id + "-" + d.target.id || 5;
      });

    link.enter().append("line")
      .attr("id", function (d) {
        return d.source.id + "-" + d.target.id || 5;
      })
      .attr("stroke-width", function (d) {
        return d.value / 10;
      })
      .attr("class", "link");
    link.append("title")
      .text(function (d) {
        return d.value;
      });
    link.exit().remove();

    const node = vis.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id;
      });

    const nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    nodeEnter.append("svg:circle")
      .attr("r", function (d) {
        if (graphNodes[d.id]) return 16
        return 10
      })
      .attr("id", function (d) {
        return "Node;" + d.id;
      })
      //.attr("background", "url('https://www.placecage.com/c/200/200")
      .attr("class", "nodeStrokeClass")
      .attr("fill", function (d) {
        return color(d.id);
      });

    nodeEnter.append("svg:text")
      .attr("class", "textClass")
      .attr("x", 14)
      .attr("y", ".31em")
      .text(function (d) {
        return d.id;
      });

    node.exit().remove();

    force.on("tick", function () {

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      link.attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
    });

    // Restart the force layout.
    force.gravity(.01)
      .charge((node) => node.graph % 2 ? 10 : -300)
      .friction(0)
      .linkDistance(function (d) {
        return d.value * 10
      })
      .size([windowWidth, windowHeight])
      .start();


  };



  update();



  const graph = nodes;


  let tree = [graphNodes];



  let nodeLinks = [];
  while (tree.length) {

    let node = tree.pop()
    let keys = Object.keys(node)
    keys.forEach((node, i) => {

      addNode(node)

      if (i !== 0)
        addLink(keys[i - 1], node, 40);

    })


    for (let key of keys) {



      if (!node[key] || node[key].constructor === String) continue;

      if (node[key].constructor === Array) {
        let arr = node[key];

        let temp;

        while (arr.length) {

          let node = arr.pop()
          addNode(node)
          nodeLinks.push([key, node, Math.floor(Math.random() * (10 - 15 + 1)) + 10])
        }

      }
      if (node[key].constructor === Object) tree.push(node[key]);


    }


  }



  let setIntervalId;

  function triggerInterval() {
    return setInterval(function () {
      let [one, two, three] = nodeLinks.pop()
      addLink(one, two, three);
      keepNodesOnTop();
      if (!nodeLinks.length) window.clearInterval(setIntervalId)
    }, 200)
  }

  setIntervalId = triggerInterval()


  document.querySelectorAll(".nodeStrokeClass").forEach(function (index) {
    var gnode = index.parentNode;
    gnode.parentNode.appendChild(gnode);
  });

  // callback for the changes in the network
  var step = -1;

  function nextval() {
    step++;
    return 2000 + (1500 * step); // initial time, wait time
  }


  const mouseout = () => {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 8);
  }

}


function addNodes() {
  d3.select("svg")
    .remove();
  drawGraph();
}
