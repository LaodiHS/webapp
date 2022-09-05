
// Router.dynamicGrid = 0;
let longestBr;
const instances = {}
let skipListObject = {}
instances.hash = {};
skipListObject.skipListObjectSkip = [];
skipListObject.dic = [];
skipListObject.max = 0;
skipListObject.count = {};

document.dynamicGrids = function dynamicGrids(_gridSize = 100, _gridDimentions = 100, _gridGap = 0) {
    if (!document.getElementById('grid')) return;
    if (_gridSize < 100) return;
    const gridSize = _gridSize || +document.getElementById('grid').getAttribute('size')
    const gridRow = _gridDimentions || +document.getElementById('grid').getAttribute('dimention');
    const gridCol = _gridDimentions || +document.getElementById('grid').getAttribute('dimention');
    const gridGap = _gridGap || +document.getElementById('grid').getAttribute('gap');

    let fragment = new DocumentFragment()
    const createElement = (name, node) => Object.assign(document.createElement(name), node);

    document.getElementById('grid').appendChild(createElement('div', {
        className: "container"
    }))

    function setBackGroundGridElements(element) {

        const {
            offsetWidth,
            offsetHeight,
            style
        } = element;
        const width = Math.floor(offsetWidth) || 100;
        const height = Math.floor(offsetHeight) || 100;

        style.background = `url('https://via.placeholder.com/${width}x${height}')`
        return element;
    }

    function setNumberOfElements(gridSize) {

        const gridContainer = document.getElementById('grid').firstElementChild;

        let elements = Array.from(new Array(gridSize), (x, i) => {

            let container = createElement("div", {
                className: "item"
            })

            container.innerHTML =
                `<span class="menue" style="background:transparent">
        <span class="buttons"><button class="0">+</button><button class="0">-</button>
        <br/><button class="1">+</button><button class="1">-</button></span> <span>content ${i} </span>
        </span>`
            container.id = i;
            container.style.order = i - 1;
            fragment.appendChild(container);;
            setBackGroundGridElements(container)

            return container;
        })
        gridContainer.appendChild(fragment);


        Eelements(elements);
        setDomElements(elements)
        dragDrop(gridContainer, elements)
       
        return elements;

    }




    function skipList(ElementIndex, gamut) {

        skipListObject.max = Math.max(skipListObject.max, gamut)


        if (!skipListObject.dic[ElementIndex]) {
            skipListObject.dic[ElementIndex] = [ElementIndex, gamut];
            let location = skipListObject.skipListObjectSkip.push(skipListObject.dic[ElementIndex]) - 1;
            skipListObject.dic[ElementIndex][2] = location;
            skipListObject.count[gamut] = (skipListObject.count[gamut] || 0)
            skipListObject.count[gamut] += gamut;
            return skipListObject.skipListObjectSkip;
        }

        if (skipListObject.dic[ElementIndex]) {
            skipListObject.count[skipListObject.dic[ElementIndex][1]] = (skipListObject.count[skipListObject.dic[ElementIndex][1]] || 0)
            skipListObject.count[skipListObject.dic[ElementIndex][1]] -= skipListObject.dic[ElementIndex][1];

            if (gamut !== 1) {


                skipListObject.count[gamut] = (skipListObject.count[gamut] || 0);
                skipListObject.count[gamut] += gamut

            }

            skipListObject.dic[ElementIndex][1] = gamut
            if (gamut === 1) {
                let [_0, _1, location] = skipListObject.dic[ElementIndex];
                skipListObject.dic[ElementIndex] = false;
                let element = skipListObject.skipListObjectSkip.pop()
                let [subElementIndex, _00, _11] = element;

                if (skipListObject.skipListObjectSkip.length > 1 && subElementIndex !== ElementIndex) {

                    skipListObject.dic[subElementIndex][2] = location;
                    skipListObject.skipListObjectSkip[location] = skipListObject.dic[subElementIndex];

                    return skipListObject.skipListObjectSkip;
                }

            }

        }

    }


    /**
     * @param  {Array}  spans [int col, int row]
     * @param  {Integer} maxColGamut = 5
     */

    setNumberOfElements(gridSize)

    // instances.docElements =
    function Eelements(docElements) {

        const gamuts = [...new Array(docElements.length)].map(x => []);

        setGridCanvis()

        Object.defineProperty(instances, 'layout', {
            get: () => document.querySelector('#grid').firstElementChild,
            configurable: true
        })
        Object.defineProperty(instances, 'currentColSize', {
            get: () => {
                const {
                    offsetWidth
                } = instances.layout;
                const coreColFloor = Math.floor(offsetWidth / (gridCol + (+gridGap * 2)));
                return coreColFloor;
            },
            configurable: true

        })


        let prop = {
            GridElementCount: 0,
            virtualGridElementCount: 0,
            gridElementCountCol: 0,
            gridElementCountRow: 0,
            gamuts: gamuts,
            docElements: docElements,
            domElements: [],
            colPivot: instances.currentColSize,
            pivot: {},
            ordering: [],
            subRows: 0,
            colNumber: {
                len: 0
            },
            gridSize: gridSize,
            maxColGamut: gridSize,
            rowCount: 0,
            gridItems: gridSize

        }
        Object.assign(instances, prop)


        const ancillaryColElements = [];
        const ancillaryRowElements = [];






        return {
            gridProperties: {
                gridRow: gridRow,
                gridCol: gridCol,
                gridGap: gridGap,
            },


            instances,

            putAncillaryCol: (index, oldGamut, newGamut) => {
                const [precedingAncillaryCol, accedingAncillaryCol] = checkDependantSpanCatagory(ancillaryColElements, oldGamut, newGamut);

            },
            putAncillaryRow: (index, oldGamut, newGamut) => {
                const ancillaryRow = checkDependantSpanCatagory(ancillaryRowElements, oldGamut, newGamut);

            },
            checkDependantSpanCatagory: (catagory, oldGamut, newGamut) => {
                oldGamutArray = addArrayObject(catagory, oldGamut);
                newGamutArray = addArrayObject(catagory, newGamut);
                return [oldGamutArray, newGamutArray];
            },
            addArrayObject: (array, index) => {
                array[index] = (array[index] || []);
                return array[index]
            },
            colNumber(index) {

                let subRows = 0;
                let tempPiv = instances.colPivot
                let ElementCount = index;
                while (tempPiv > 1) {
                    let elements = instances.gamuts[tempPiv].length
                    while (elements) {

                        elements--;
                        const element = instances.gamuts[tempPiv][elements];

                        if (element >= index) continue;

                        const node = instances.domElements[element];
                        const order = +node.element.style.order + 2
                        const nextNum = (order) + (instances.currentColSize * (node.gamutRow))



                        subRows = Math.max(nextNum, subRows)

                        ElementCount += (node.gamutRow * node.gamutCol) - 1;
                    };

                    tempPiv--;
                }


                let col = Math.ceil(Math.max(ElementCount, subRows) / instances.currentColSize)


                return col;

            },


        }



    }

    function setDomElements(docElements) {

        instances.spanSizesSections = [...new Array(docElements.length)].map(x => [1, 1]);


        instances.domElements = docElements.map((_, i) => {
            return {
                id: i,
                element: instances.docElements[i],
                gamutCol: instances.spanSizesSections[i][0],
                gamutRow: instances.spanSizesSections[i][1]
            }
        })

        instances.domElements.forEach((node, i) => {
            let length = node.gamutCol > node.gamutRow ? node.gamutCol : node.gamutRow;
            let index = instances.gamuts[length].push(i) - 1;
            node.gamutSpanIndex = index;
            node.gamut = length;
        })

        instances.virtualGridElementCount = instances.docElements.length;
        instances.GridElementCount = instances.virtualGridElementCount;
       
    }

    function moveElementToNewCatagory(index, newCatagory) {


        let element = instances.domElements[index]
        let targetGamutIndexId = instances.gamuts[element.gamut][element.gamutSpanIndex];


        let lastGamutElementIndexId = instances.gamuts[element.gamut].pop();

        if (instances.gamuts[element.gamut].length && targetGamutIndexId !== lastGamutElementIndexId) {
            instances.gamuts[element.gamut][element.gamutSpanIndex] = lastGamutElementIndexId;
        }

        instances.domElements[lastGamutElementIndexId].gamutSpanIndex = instances.domElements[index].gamutSpanIndex;

        instances.domElements[index].gamut = newCatagory;
        instances.domElements[index].gamutSpanIndex = instances.gamuts[newCatagory].push(targetGamutIndexId) - 1;

    }
    // Eelements();


    let gridContainer = instances.layout;




    function setGridCanvis() {
        const parentGridLayOut = document.getElementById("grid");
        const grid = parentGridLayOut.firstElementChild;
        const mobileRow = instances.gridSize * gridRow + ((instances.gridSize * gridGap) - (gridGap * 2))
        const canvisSize = Math.ceil(instances.gridSize / 10) * instances.gridSize;
        parentGridLayOut.style.gridTemplateRows = `repeat(auto-fill, minmax(${gridRow}px, ${mobileRow}px) )`
        parentGridLayOut.style.gridTemplateColumns = `repeat(auto-fill,  minmax(${gridRow}px, ${instances.currentColSize * gridRow}px))`;
        parentGridLayOut.style.gridTemplateColumns = `auto`;
        grid.style.gridTemplateRows = `repeat(auto-fill,  minmax(${gridRow}px, ${gridRow}px) )`;
        grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridCol}px, ${gridCol}px) )`;
        grid.style.gridTemplateRows = `repeat(auto-fill,  minmax(${gridRow}px, ${gridRow}px) )`;
        grid.style.gridGap = `${gridGap}px`;
        grid.style.display = `grid`;
        grid.style.gridAutoFlow = `dense`;
        grid.style.width = `100%`;
        grid.style.backgroundColor = `#eee`;


    }








    function matrixHeight() {
        let subRows = 0;
        let colTotal = 0;
        let ElementCount = 0;
        let skipList = skipListObject.skipListObjectSkip.slice()


        skipList.sort((a, b) => a[0] - b[0])


        let nextEl = 0;
        let lastLen = [0, null];
        let currentColChange = 0;
        let elementNumbersInColumn = {};
        let totalRows = 0;
        for (let skipListElement of skipList) {
            let [elementIndex] = skipListElement
            const node = instances.domElements[elementIndex];
            let gamutColumn = Math.min(node.gamutCol, instances.currentColSize)
            let gamutRow = node.gamutRow;

            if (currentColChange !== Math.ceil((elementIndex + 1 + colTotal) / instances.currentColSize)) {
                currentColChange = Math.ceil((elementIndex + colTotal) / instances.currentColSize);
                colTotal = 0;
            }

            colTotal += gamutColumn - 1;

            let elementSpanInColumn = (elementIndex + 1 + colTotal) % instances.currentColSize

            let colNumber = Math.ceil((elementIndex + colTotal) / instances.currentColSize)

            elementNumbersInColumn[colNumber] = (elementNumbersInColumn[colNumber] || [])

            elementNumbersInColumn[colNumber].push([elementIndex, elementSpanInColumn])
            let last = elementNumbersInColumn[colNumber].length - 1

            let currentFloorElements = elementNumbersInColumn[colNumber]
            if (elementNumbersInColumn[colNumber].length > 1) {

                currentFloorElements[last][0] - currentFloorElements[last - 1][0]
            }

            ElementCount += (gamutColumn * gamutRow) - 1;
            const order = +node.element.style.order + 2

            totalRows += gamutRow * instances.currentColSize
            let rowCurve = Math.sqrt((totalRows * totalRows) + (instances.currentColSize * instances.currentColSize))
            let nextNum = order + (rowCurve);
            subRows = Math.ceil(Math.max(nextNum, subRows))
        }

        let maxVirtualElementCount = Math.max((ElementCount + instances.gridSize), subRows);

        let rowRemainder = ((maxVirtualElementCount % instances.currentColSize) ? 1 : 0);
        
        let height = Math.ceil(maxVirtualElementCount / instances.currentColSize);
        instances.layout.style.height = `${(height +rowRemainder ) * gridRow}px`;
        document.getElementsByTagName("section")[1].style.height = `${(height ) * gridRow} px`;
        const parentGridLayOut = document.getElementById("grid");
        parentGridLayOut.style.gridTemplateRows = `repeat(auto-fill, minmax(${gridRow}px,  ${(height ) * gridCol}px ))`
        return height;
    }

    instances.colPivot = instances.currentColSize;
    let lastChange = null;

    function minGamutRange() {


        if (instances.currentColSize === instances.colPivot) return;

        let gamut = instances.currentColSize;
        if (gamut === lastChange || gamut < 1 || gamut > instances.maxColGamut) return 0;
        lastChange = gamut;
        let dynamicElements = [];
        let minColGamut = Math.min(instances.colPivot, gamut);

        while (!instances.gamuts[instances.colPivot].length && instances.colPivot > 1) --instances.colPivot;
        let leadingColStart = Math.max(gamut, instances.colPivot);
        instances.colPivot = leadingColStart;
        let colElements = instances.gamuts[leadingColStart].length - 1;
        while (leadingColStart + 1 !== minColGamut) {
            let gamutWidth = Math.min(leadingColStart, gamut);
            let colNode = instances.gamuts[leadingColStart][colElements];
            colElements = colElements > 0 ? --colElements : instances.gamuts[--leadingColStart].length - 1;
            if (colNode === undefined) continue;
            setGridArea(instances.docElements[colNode], instances.domElements[colNode].gamutRow, Math.min(instances.domElements[colNode].gamutCol, gamutWidth));
            dynamicElements.push([leadingColStart + 1, colNode]);
        }
        matrixHeight()
        return instances.colPivot;

    }

    function updateGamutWindow(ElementIndex, newGamutWidth, newGamutHeight) {

        if (ElementIndex > instances.domElements.length - 1 || newGamutWidth > instances.gamuts.lengths - 1) return 0;


        let element = instances.domElements[ElementIndex];

        newGamutWidth = newGamutWidth || element.gamutCol;
        newGamutHeight = newGamutHeight || element.gamutRow;


        let largerGamut = Math.max(newGamutWidth, newGamutHeight);

        moveElementToNewCatagory(ElementIndex, largerGamut)

        if (newGamutWidth && newGamutWidth !== element.gamutCol) {
            instances.spanSizesSections[ElementIndex][0] = newGamutWidth
            instances.domElements[ElementIndex].gamutCol = newGamutWidth;
        }

        if (newGamutHeight && newGamutHeight !== element.gamutRow) {
            instances.spanSizesSections[ElementIndex][1] = newGamutHeight
            instances.domElements[ElementIndex].gamutRow = newGamutHeight;
        }
        skipList(ElementIndex, largerGamut)

        matrixHeight()

        return 1;
    }



    function setBackGroundGridElements(element) {

        const {
            offsetWidth,
            offsetHeight,
            style
        } = element;
        const width = Math.floor(offsetWidth) || 100
        const height = Math.floor(offsetHeight) || 100

        let str = `https://via.placeholder.com/${width}x${height}`

        style.background =  `url(${str})`

        return element;
    }

    function setGridArea(element, row, col) {
        element.style.gridArea = `auto/auto/span ${row} /span ${col}`;
        setBackGroundGridElements(element)
    }


    function dragDrop(gridContainer, docElements) {
        const longestBranchLength = longestDomBranchDepth('#grid> .container > .item')
        let c = instances.layout



        docElements = instances.docElements


        let order = -1;
        let first = gridContainer.firstElementChild
        while (first) {
            first.draggable = true;

            instances.ordering.push(first)
            first = first.nextElementSibling
        };

        let temp;


        if (!gridContainer.getAttribute("dragstart")) {

            ;
            ["dragstart", "dragover", "dragend", "drop"].forEach(type => gridContainer.removeEventListener(type, dragDrop, false))



            gridContainer.setAttribute("dragstart", true)

            gridContainer.addEventListener('dragstart', (ev) => {
                let count = longestBranchLength;
                let target = checkPathToRootElement(ev, count);
                if (target.style.order.length) {
                    temp = instances.ordering[instances.ordering.indexOf(target)];
                }
            }, false)
            gridContainer.addEventListener('dragover', ev => {
                ev.preventDefault()
            }, false)
            gridContainer.addEventListener('dragend', ev => {
                ev.target.style.opacity = "";

            }, false)
            gridContainer.addEventListener('drop', ev => {
                let count = longestBranchLength;
                let target = checkPathToRootElement(ev, count);
                if (target.style.order.length) {
                    ev.preventDefault();
                    let a = instances.ordering[instances.docElements.indexOf(target)];
                    a.style.order = [temp.style.order, temp.style.order = a.style.order][0]
                    matrixHeight()
                }
            }, false)
        }
        return null;
    }



    window.addEventListener('resize', function (event) {
        minGamutRange();
    })



    function expandingMenue(e) {

        if (Router.dynamicGrid === 0) return;
        const gridContainer = document.querySelector('#grid').firstElementChild;
        let containerElement = ((e.target.parentElement || {}).parentElement || {}).parentElement

        if (containerElement && containerElement.className.includes('item')) {


            let elementIndex = instances.docElements.indexOf(containerElement);
            if (elementIndex !== -1) {
                if (!instances.spanSizesSections[elementIndex]) {
                    instances.spanSizesSections[elementIndex] = [1, 1]
                }

                instances.spanSizesSections[elementIndex];
                const gridComputedStyle = window.getComputedStyle(gridContainer);
                let {
                    offsetHeight,
                    clientHeight,
                    height
                } = gridComputedStyle;
                offsetHeight = offsetHeight || clientHeight || +height.replace("px", "")
                const gridRowCount = Math.ceil(offsetHeight / (gridCol + (gridGap * 2)))
                //matrixHeight();
                const gridColumnCount = instances.currentColSize;
                instances.rowCount = gridRowCount;

                let incrament_dec = {
                    "+": function (side) {
                        instances.spanSizesSections[elementIndex][side]++;
                        instances.spanSizesSections[elementIndex][0] = instances.spanSizesSections[elementIndex][0] > gridColumnCount ? instances.spanSizesSections[elementIndex][0] - 1 : instances.spanSizesSections[elementIndex][0];
                        instances.spanSizesSections[elementIndex][1] = instances.spanSizesSections[elementIndex][1] > gridRowCount ? instances.spanSizesSections[elementIndex][1] - 1 : instances.spanSizesSections[elementIndex][1];


                        return instances.spanSizesSections[elementIndex];
                    },
                    "-": function (side) {
                        if (instances.spanSizesSections[elementIndex][side] === 1) return instances.spanSizesSections[elementIndex]
                        instances.spanSizesSections[elementIndex][side]--;
                        return instances.spanSizesSections[elementIndex];
                    }
                };
                let option = {
                    "0": function ({
                        className,
                        innerText
                    }) {
                        let [col, row] = incrament_dec[innerText](className);
                        updateGamutWindow(elementIndex, col, row);
                        setGridArea(containerElement, row, col);
                    },
                    "1": function ({
                        className,
                        innerText
                    }) {
                        let [col, row] = incrament_dec[innerText](className);
                        updateGamutWindow(elementIndex, col, row);
                        setGridArea(containerElement, row, col);
                    }
                }

                let excute = option[e.target.className];
                if (excute) {

                    excute(e.target);
                    setBackGroundGridElements(containerElement);

                }

            }

        }

    }

    function longestDomBranchDepth(cssSelector) {
        if (longestBr) return longestBr
        let rootBranch = document.querySelector(cssSelector).firstElementChild;
        let longestBranch = 0
        let domDepth = 0;
        let nextDomNode = [{
            node: rootBranch,
            depth: 1
        }];

        while (rootBranch) {
            for (let item of nextDomNode) {
                domDepth = item.depth + 1;
                if (domDepth > longestBranch) longestBranch = domDepth;
                if (!item || !item.node) continue;
                nextDomNode.push({
                    node: item.node.firstElementChild,
                    depth: domDepth
                })
            }
            rootBranch = rootBranch.nextElementSibling;
        }
        longestBr = longestBranch;
        return longestBranch
    }

    function checkPathToRootElement(ev, count) {
        let target = ev.target;
        while (!target.style.order.length) {
            target = ev.target.parentElement;
            if (!count--) break;
        }
        return target;
    }


    let obj_ = {
        expandingMenue: expandingMenue,
        minGamutRange: minGamutRange,
        resize: (event) => {
            this.minGamutRange(event)
        },
        keydown: (event) => {
            setTimeout(function () {
                if (event.target.name === "gridSize" && +event.target
                    .value > 100 && +event.target
                    .value <= 2000) {
                    let gridSize = +event.target.value
                    document.getElementById("grid").firstElementChild
                        .innerHTML = ""
                    let gridDimentions = 100
                    dynamicGrids(gridSize)
                }
            }, 350)
        },
        click: function(event)  {
      
         this.expandingMenue(event)
        }
    } 
    matrixHeight()
    return obj_;
}
