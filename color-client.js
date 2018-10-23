// color-client.js
var Seneca = require('seneca');

const serializeArgs = require('./serializeArgs');

const data = {
  operations: [{
      operator: 'filter',
      args: [i => i%2 !== 0]
  }, {
      operator: 'map',
      args: [i => i*2]
  }]
  // values: [2, 3, 4, 5]
}
const values = [2, 3, 4, 5];
 
Seneca({log: 'test'})
 
  // load the mesh plugin
  .use('mesh')
  .ready( function () {
    
  // send a message out into the network
    this.act('role:app', function (err, out) {
      // console.log("out : ",out);
      // console.log('out pattern found:-------------------------------------------', out.pattern);
      values.forEach(element => {
      this.act(out.pattern, {d:serializeArgs(data),data:element}, (err, response) => {
            console.log('Response of app :', response);
        });
      });
  
      // prints #FF0000
      // console.log(out.color)
    });
  });