const Seneca = require('seneca');
const uuidv1 = require('uuid/v1');
const serializeArgs = require('./serializeArgs');

const id1 = uuidv1();
console.log("id 1:",id1);

const data = {
  operations: [{
    operator: 'filter',
    args: [i => i % 2 !== 0]
  }, {
    operator: 'map',
    args: [i => i * 2]
  }]
}
// const values = [2, 3, 4, 5];
const values = [{
  next:1
},{
  next:2
},{
  next:3
},{
  next:4
},{
  complete:true
}];

const seneca = Seneca({ log: 'test' });

seneca
  .use('mesh')
  .act('role:fw,cmd:creatActor',{data:serializeArgs(data),id:id1}, function (err, out) { //passing id1 so that it is returned in seneca.add to client
    values.forEach(element => {
        seneca
        .use('mesh')
        .ready(function () {
          this.act(`role:app,type:actor,actorId:${out.id}`,{value:element} ,(err, response) => {
            console.log('Response of actor receiving values :', response);
          }); 
        })
    });
  });

 seneca.add(`role:app,type:actor,actorId:${id1}`,function(data,reply){
    console.log("response from actor with bussiness logic : ",data.res);
    reply({value:"reply via bussiness logic add method"})
  })
  .use('mesh',{
    pin:`role:app,type:actor,actorId:${id1}`,
  })
