var smoke = require('smokesignal')
var ip = require("ip")

console.log("Creating Node")

var nodeIp = ip.address()

var node = smoke.createNode({
  port: 8495
, address: smoke.localIp(nodeIp) // Tell it your subnet and it'll figure out the right IP for you
, seeds: [{port: 8495, address:'45.55.76.194'}] // the address of a seed (a known node)
})

console.log(node.options)

node.on('connect', function() {
    console.log("Connected to peer")
    console.log(node.peers)
    node.broadcast.write('Hi')
    //Ask for latest block
})

node.on('disconnect', function() {

})

// Start the darn thing
node.start()