const net = require('net');
var natUpnp = require('nat-upnp');
const uuidv4 = require('uuid/v4')
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const SPort = 8621

const seeds = [
  { ip: "45.55.76.194", port: 8621 }
]

var clients = []
var peers = []

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

module.exports.connectToSeeds = function(){
  for (let i = 0; i < seeds.length; i++) {
    var socket = new net.Socket()

    socket.connect(seeds[i].port, seeds[i].ip, function() {
      console.log('Connected to ' + seeds[i].ip);
      socket.write(JSON.stringify({type:'lb'})); //Asks for the last block
      socket.write(JSON.stringify({type:'peers'})); //Asks for a list of peers
    });
    
    socket.on('data', function(data) {
      handleResponses(socket, data)
    });
    
    socket.on('close', function() {
      console.log('Connection closed');
    });
    
  }
}

var server = net.createServer(function(socket) {
  socket.write('Welcome\r\n');
  socket.name = uuidv4()
  clients.push(socket)
  console.log(socket.remoteAddress)

  socket.on('close', (e) => {
    console.log('Socket has been closed')
    removeClient(e.name)
  })

  socket.on('data', (data) => {
    handleRequests(socket, data)
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

function handleRequests(socket, data) {
  var st = decoder.write(data)
  console.log(st)
  try{
    var dat = JSON.parse(st)
    console.log(dat)
  }
  catch(e){
    //console.log(e)
  }
}

function handleResponses(socket, data) {
  var st = decoder.write(data)
  console.log(st)
  try{
    var dat = JSON.parse(st)
    console.log(dat)
  }
  catch(e){
    //console.log(e)
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

module.exports.getClients = function(){
  return clients
}




 

