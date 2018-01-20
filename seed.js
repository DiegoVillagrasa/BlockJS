var Seed = require('n2n').Seed;
 
var seed = new Seed();
seed.listen(6785);
console.log('Seed listening 6785...');

node.on('online', function () {
    console.log('I am online:', this.id);
  });

node.on('node::online', function (newNode) {
    console.log('Someone is online:', newNode.id);
  });