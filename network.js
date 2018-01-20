var Node = require('n2n').Node;
var node = new Node(6785);
node.connect([{ host: '10.8.117.131', port: 6785 }]);

node.on('online', function () {
  console.log('I am online:', this.id);
});

node.on('node::online', function (newNode) {
  console.log('Someone is online:', newNode.id);
});