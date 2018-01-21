const net = require('net');
var natUpnp = require('nat-upnp');
const uuidv4 = require('uuid/v4')
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const SPort = 8621

var clients = []

//CReate a new UPNP client
var client = natUpnp.createClient();

//Open port using UPNP
module.exports.mapPort = function(){
  return new Promise(function(resolve, reject){
    client.portMapping({
      public: SPort,
      private: SPort,
      ttl: 1000
    }, function(err) {
      console.log(err)
      console.log("Mapped")
      resolve()
    })
  })
}

//Close port using UPNP
module.exports.unMapPort = function(){
  return new Promise(function(resolve, reject){
    client.portUnmapping({
      public: SPort
    }, function(err) {
      console.log(err)
      console.log("unMapped")
      resolve()
    })
  })
}

var server = net.createServer(function(socket) {
  socket.write('Welcome\r\n');
  socket.name = uuidv4()
  clients.push(socket)
  console.log(socket.address())


  socket.on('close', (e) => {
    console.log('Socket has been closed')
    removeClient(e.name)
  })

  socket.on('data', (data) => {
    console.log(decoder.write(data))
  })

  socket.on('end', (e) => {
    console.log("Socket has been disconnected")
    removeClient(e.name)
  })
});

function removeClient(name){
  for(i=0; i < clients.length; i++){
    if(clients[i].name == name){
      clients.splice(i,1)
      return
    }
  }
}

module.exports.broadcast = function(data){
  for (let i = 0; i < clients.length; i++) {
    clients[i].write(data)
  }
}



module.exports.startServer = function(){
  server.listen(SPort, '0.0.0.0')
  console.log("Server started")
  console.log(server.address())
}

module.exports.stopServer = function(){
  server.close()
  console.log("Server closed")
}




 

