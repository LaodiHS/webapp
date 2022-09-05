
window.Router = {
    state: "home",
    search: 0,
    dynamicGrid: 0,
    graph: 0,
    home: 1,
    search_target:"",
    window: window.location
};
// window.location.search=`?state=${"home"}`

const eventChange = new CustomEvent('router', {
    detail: window.Router
});


const Router = new Proxy(window.Router, {
    set(target, name, value) {
        let state;
        if (name === "state") state = value
        else state = name;
        if (value && name && target.state !== state) {

            target[target["state"]] = 0;

            target["state"] = state;
            target[target.state] = 1;

            history.pushState(null, document.title, `?state=${target.state }`);
            document.dispatchEvent(eventChange)

        }

    }

});



document.addEventListener("click", event =>{
    let target =event.target;
    if (target.tagName === "A" && target.name && window.Router[target.name] === 0) {
        window.search_target= target.getAttribute("dic")
        event.preventDefault() 
    
        
        Router.state = target.name;
      
    }

})

window.addEventListener('popstate', function (event) {

    const urlParams = new URLSearchParams(window.location.search);
    let state = urlParams.get('state')
    if (state !== window.Router.state && window.Router[state] === 0) {
        Router.state = state;

    }

});
