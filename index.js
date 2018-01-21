var network = require("./network")

initialize()


async function initialize(){
    await network.mapPort()
    network.startServer()
    network.connectToSeeds()
}

async function exitHandler() {
    await network.unMapPort()
    network.stopServer()
    process.exit()
}

//do something when app is closing
process.on('exit', exitHandler.bind());

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind());

//catches uncaught exceptions
process.on('uncaughtException', (e) => {
    console.log(e)
    exitHandler.bind()
});