
function memory_mapped_file(){
    const mmap = require("mmap-io");
    
    const some_file = "some_file.txt";
    
    const fd = fs.openSync(some_file, "r" );
    const fd_w = fs.openSync(some_file, "r+");
    const size = fs.fstatSync(fd).size;
    
    
    const rx_prot = mmap.PROT_READ || mmap.PROT_EXECUTE
    const priv = mmap.MAP_SHARED
    
    
    const buffer =  mmap.map(size,rx_prot, priv,fd) 
    
    const buffer2 = mmap.map(size, mmap.PROT_READ, priv, fd, 0, mmap.MADV_SEQUENTIAL)
    
    const w_buffer= mmap.map(size , mmap.PROT_WRITE, priv, fd_w);
    mmap.advise(w_buffer, mmap.MADV_RANDOM)
    
    
    
    mmap.sync(w_buffer)
    mmap.sync(w_buffer, true)
    mmap.sync(w_buffer, 0, size)
    mmap.sync(w_buffer,0, size,true)
    mmap.sync(w_buffer, 0, size, true, false);
    
    const core_stats= mmap.incore(buffer)
    
    
    let buff = "This message overwrites the last message" 
    //new Uint8Array(Buffer.from("mellow Yellow"))
    let i =0;
    buff= buff.split("")
    while(i< buff.length)
    w_buffer[i]=buff[i++].charCodeAt();
    }
    
    memory_mapped_file();