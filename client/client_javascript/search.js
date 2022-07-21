


let lastQueryResult = [];

const graphObjects = [];
const searchTree = { search: {} };







const socket = io(`${window.location.host}`)

// socket.on("disconnect", (socket) => {
//     socket.open();
// });

// socket.on("socket_connect", data => {

// })







class CACHE {

    constructor() {
        this.cach = {};
        this.api = this.cach;
        this.empty = {}
    }
    set_end_point(end_point, key) {

        this.api[end_point] = {};
        return this.api[end_point];
    }
    get_end_point(end_point) {
        return this.api[end_point];
    }
    cache_results(api, branch, key) {
        const root_node = this.set_end_point(api);

        for (const leaf of branch) {
            let node = root_node;
            if (!leaf[key]) {

                throw Error(404)
                continue;
            }
            let i = leaf[key].length;

            for (const aski of leaf[key]) {
                node[aski] = node[aski] || {}
                node = node[aski];
                !--i && (node["^"] = node["^"] || []).push(leaf)
            }
        }
    }
    get_cache(api, input) {
        if (!input) return false;
        let node = this.api[api] ? this.api[api] : false;
        if (!node) return false;
        let results = [];
        input = input.split("")
        let i = input.length;
        for (const leaf of input) {
            if (!node[leaf]) return false;

            !leaf !== "^" && (node = node[leaf]);
            if (--i <= 0) {
                let queue = [node]
                while (queue.length) {
                    const n = queue.shift()
                    for (const sub_nodes in n) {
                        sub_nodes === "^" && results.push(n["^"]);
                        sub_nodes !== "^" && queue.push(n[sub_nodes]);
                    }
                }
            }
        }
        return results.length ? results.flat(Infinity) : false;
    }
    set_404(api,val) {
        this.empty[api] = this.empty[api] || {};
        this.empty[api][val] =true;
    }
    get_404(api,val) {
         this.empty[api] = this.empty[api]|| {}
        return this.empty[api][val]
    }
}

const cache = new CACHE();


async function search(word, limit, search_target = window.search_target, input = { value: "" }) {
    const placeholder = document.getElementById('complete')

    if (!word || cache.get_404(search_target,word)) {

        input.value = "";
        return [{ word: "no results" }]
    }
    input.value = "";
    try {

        const cach = cache.get_cache(search_target, word)
        cach && (input.value = cach[0].word)
        if (cach) return cach;

        const s_search = (await fetch(`${window.location.origin}/search/${search_target}/${word}/${limit}`, {}).then(_ => _.json())).flat(Infinity);
        input && (input.value = s_search[0].word);
        cache.cache_results(search_target, s_search, "word");

        return s_search;
    } catch (error) {
        cache.set_404(search_target,word)
        input.value = "no results";
        placeholder.value = ""
        return [{ word: "no results" }]
    }
}


async function lookupAjacentTerms(word, limit = 20, search_target = "english-thesaurus") {
    if (!word || cache.get_404(search_target,word)) {
        drawSearchGraph(word, [{ word: "no results" }]);
        
        return false;
    }
    const cach = cache.get_cache(search_target, word)
    if (cach) {
        drawSearchGraph(word, cach);
        return cach;
    }
    try {

        const s_search = (await search(word, limit, search_target)).map(synonym_block => synonym_block.synonyms).flat(Infinity).map(x => ({ word: x }));
        cache.cache_results(search_target, s_search, "word");
        drawSearchGraph(word, s_search);
    } catch (err) {
        cache.set_404(search_target, word);
        const branch = [{ word: "no results" }]
        drawSearchGraph(word, branch)
    }
}


const placeholder = { english_to_chines: "Search over 1 million Words, Records, and Synonyms with no Lag", network_security_terms: "Search Over 897 Network Security Terms and Definitions" }

function search_api() {

    document.getElementById("input").setAttribute("placeholder", placeholder[window.search_target])

    return searchTerms()


    function searchTerms() {

        let lastSearch = {};
        let element;
        let queryResult;
        let frag = document.createDocumentFragment()
        return {
            searchBox,
            transformList,
            keydown: function (event) {
                this.searchBox(event)
            },
            click: async function (event) {
                await this.transformList(event)
            }
        }

        async function searchBox(event) {

            setTimeout(async () => {
                const input = event.target

                const previousSibling = event.target.previousElementSibling
                element = document.getElementById('search').querySelector('span');
                const stringInput = input.value

                queryResult = lastSearch[stringInput] ? lastSearch[stringInput] : await search(stringInput, 20, window.search_target, previousSibling)


                element.innerHTML = "";

                let k = 0;
                while (queryResult.length > k) {
                    let ele = document.createElement("a")
                    ele.setAttribute('href', "#" + queryResult[k].word)
                    ele.setAttribute("id", k)
                    ele.innerHTML = queryResult[k].word
                    frag.appendChild(ele)
                    k++;
                }
                element.appendChild(frag);
                queryResult.length && drawSearchGraph(queryResult[queryResult.length - 1].word, queryResult)
            }, 0)

        }

        async function transformList({
            target
        }) {
            if (target === document.querySelector('form > span > a:hover')) {
                element.innerHTML = `<span> ${queryResult[target.id].word}  :  ${Object.entries(queryResult[target.id])} </span>`
                const placeholder = document.getElementById('complete')
                const input = document.querySelector('input');


                let check = inputValueCheck(input, queryResult[target.id].word)

                if (input.value.length && check) {
                    input.value = queryResult[target.id].word
                    placeholder.value = "";
                    element.previousElementSibling.value = "";
                } else {
                    input.value = ""
                    document.querySelector('form.container').reset()
                }

                lookupAjacentTerms(queryResult[target.id].word)
            }

        }

    };

    function inputValueCheck(input, map) {
        let i = 0;
        let check = true;
        while (input.value[i]) {
            if (map[i] !== input.value[i]) {
                check = false;
                break;
            }
            i++;

        }
        return check;
    }




};

function drawSearchGraph(input, queryResult) {
    queryResult = queryResult.map(x => x.word)
    lastQueryResult = queryResult.slice();
    sv.innerHTML = ""
    addNode = function (id) {
        nodes.push({
            "id": id
        });
        update();
    };

    this.removeNode = function (id) {
        let i = 0;
        let n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                links.splice(i, 1);
            } else i++;
        }
        nodes.splice(findNodeIndex(id), 1);
        update();
    };

    this.removeLink = function (source, target) {
        for (let i = 0; i < links.length; i++) {
            if (links[i].source.id == source && links[i].target.id == target) {
                links.splice(i, 1);
                break;
            }
        }
        update();
    };

    this.removeallLinks = function () {
        links.splice(0, links.length);
        update();
    };

    this.removeAllNodes = function () {
        nodes.splice(0, links.length);
        update();
    };

    this.addLink = function (source, target, value) {
        links.push({
            "source": findNode(source),
            "target": findNode(target),
            "value": value
        });
        update();
    };

    this.findNode = function (id) {
        for (let i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];
        };
    };

    this.findNodeIndex = function (id) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) {
                return i;
            }
        };
    };

    // set up the D3 visualisation in the specified element
    let moo = window.getComputedStyle(document.getElementById("sv"))

    let w = +moo.width.slice(0, moo.width.length - 2) || 500,
        h = +moo.height.slice(0, moo.height.length - 2) || 500;


    let color = d3.scale.category20();

    let vis = d3.select(document.getElementById("sv"))
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "svg")
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("perserveAspectRatio", "xMinYMid")
        .append('svg:g');

    let force = d3.layout.force();

    let nodes = force.nodes(),
        links = force.links();

    let update = function () {
        let link = vis.selectAll("line")
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

        let node = vis.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id;
            });

        let nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("svg:circle")
            .attr("r", 10)
            .attr("id", function (d) {
                return "Node;" + d.id;
            })

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


        force
            .gravity(.01)
            .charge((node) => node.graph % 2 ? 10 : -300)
            .friction(0)
            .linkDistance(function (d) {
                return d.value * Math.floor(Math.random() * (20 - 5 + 1) + 5)
            })
            .size([w, h])
            .start();


    };
    update();
    let table = queryResult;
    addNode(input)
    let len = input.length
    let node = table.shift();
    addNode(node)
    addLink(input, node, 4)
    while (table.length) {

        let subNode = table.shift()
        addNode(subNode)
        addLink(input, subNode, Math.floor(Math.random() * (15 - 5 + 1)) + 5)
        while (table.length && subNode[len] === table[0][len]) {
            let auxilaryNode = table.shift()
            addNode(auxilaryNode)

            addLink(auxilaryNode, subNode, Math.floor(Math.random() * (24 - 10 + 1)) + 10)
            if (table.length && table[0][len + 1] === auxilaryNode[len + 1]) {

                subNode = auxilaryNode
                len += 1

            } else addLink(auxilaryNode, input, Math.floor(Math.random() * (35 - 25 + 1)) + 25)

        }

    };



    keepNodesOnTop();

    let step = -1;



    const mouseout = () => {
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 8);
    };
    graphObjects.push([removeNode])
};

function keepNodesOnTop() {
    document.querySelectorAll(".nodeStrokeClass").forEach(function (index) {
        let gnode = index.parentNode;
        gnode.parentNode.appendChild(gnode);
    });
};

function addNodes() {
    d3.select("svg").remove();
    drawGraph();
};

