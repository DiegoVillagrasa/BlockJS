const net = require('net');
var natUpnp = require('nat-upnp');

const SPort = 8621

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
  console.log(socket.address())
  
	socket.on('connect', (e) => {
    console.log('Socket has been created')
    
    //console.log(e)
  })

  socket.on('close', (e) => {
    console.log('Socket has been closed')
    console.log(e)
  })

  socket.on('data', (data) => {
    console.log(data)
  })

  socket.on('end', (e) => {
    console.log("Socket has been disconnected")
    console.log(e)
  })
});

module.exports.startServer = function(){
  server.listen(SPort, '0.0.0.0')
  console.log("Server started")
  console.log(server.address())
}

module.exports.stopServer = function(){
  server.close()
  console.log("Server closed")
}




 

