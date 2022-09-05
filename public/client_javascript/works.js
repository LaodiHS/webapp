
const myWorker = new Worker(URL.createObjectURL(new Blob([`function tree(data,  key) {
    postMessage(searchTree);
}
onmessage = function (e) {
    let keys =  Object.keys(e.data)
            tree(e.data[key], key)
}`], { type: 'application/javascript' })));

myWorker.onmessage = function (e) { };