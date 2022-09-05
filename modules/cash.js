



 function LRUCache(capacity) {
    const map = new Map()
    const cap = capacity;

    return {
        get,
        put
    }

    function get(key) {
        let val = map.get(key)
        if (map.has(key)) {
            map.delete(key)
            map.set(key, val)
        } else {
            return -1
        }
        return val;
    }

    function put(key, value) {
        if (map.has(key)) {
            map.delete(key)

        } else {

            if (map.size === cap) {
                map.delete(first())
            }
        }
        map.set(key, value)
    }

    function first() {
        return map.keys().next().value
    }

}


 function LFUCache(capacity) {
  
        const cap = capacity;
        const vals = new Map()
        const counts = new Map()
        const lists = new Map()
        lists.set(1, new Set())
        let min = -1;

    
return {put, get, vals};
  function  get(key) {
      
        if (!vals.has(key)) return -1;
        // get the the current count of the requested resource 
        let count = counts.get(key);
        // advane the counts of the requested resource key
        counts.set(key, count + 1)
        // lookup the request range of the resource and remove the resource from that range 
        lists.get(count).delete(key)

        if (count === min && lists.get(count).size === 0)min++;
        // check if the request range exists and if not add it
        if (!lists.has(count + 1)) lists.set(count + 1, new Set());
        // Then add the resource to the new range
        lists.get(count + 1).add(key)
        // return the resource of the key
        return vals.get(key)
    }

    function put(key, val) {
        if (cap <= 0) return;
        
        if (vals.has(key)) {
            //if the value exists reset the key to the end of the values map
            vals.delete(key)
            vals.set(key, val)
            //advance the range of counts     
            get(key)
            return;
        }
        // if the values table excced the buffer
        if (vals.size >= cap) {
            // we then grab the oldest lest requested resource . 
            let evict = lists.get(min).keys().next().value
            //and eliminate it
            lists.get(min).delete(evict);
            // subsquestly we also eliminate it from our key value pairs
            vals.delete(evict)
        }
         //set the key value pairs if the key does not already exist 
         vals.set(key, val)
         // set the initial count of the key 
         counts.set(key, 1)
         // reset the min to it's default value on this check:
         // "if (count === this.min && this.lists.get(count).size === 0)this.min++;""
        min = 1
         // add the key to the first range
        lists.get(1).add(key)
    }
};

module.exports =  {LRUCache,LFUCache };

// let LFUCacheMake= new LFUCache(2)
//     LFUCacheMake.put(2, 1);  
//     LFUCacheMake.put(1, 1);    
//     LFUCacheMake.put(2,3);      
//     LFUCacheMake.put(4, 1);    
//     LFUCacheMake.get(1) 
//     LFUCacheMake.get(2)  

//     let cache = new LRUCache(2)