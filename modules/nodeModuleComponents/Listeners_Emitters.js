let listenersEmitters = {
    server: { listeners: [], emitters: [] },
    client: { listeners: [], emitters: {} },
  };
  
  const objs = [{ socket_flag: "string_code" }];
  
  while (objs.length) {
    const obj = objs.pop();
    obj.data = {};
    listenersEmitters.server.listeners.push(obj);
    let flag = JSON.stringify(obj.socket_flag);
    listenersEmitters.client.emitters[obj.socket_flag] = new String(`(
      socket,
      data
    ) =>
    {
      socket.emit(${flag}, { data: data });
    }`);
  }



module.exports = listenersEmitters;