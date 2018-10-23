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
}
const values = [2, 3, 4, 5];
 
Seneca({log: 'test'})
 
  .use('mesh')
  .act('role:app', function (err, out) {
      values.forEach(element => {
        Seneca({log: 'test'})
        .use('mesh')
        .ready(function(){
          this.act(out.pattern, {d:serializeArgs(data),value:element}, (err, response) => {
              console.log('Response of app :', response);
          });
        })
      });
  
    });