const Seneca = require('seneca');
const deserializeArgs = require('./deserializeArgs');
const uuidv1 = require('uuid/v1'); 
const {Subject} = require('rxjs');
 
Seneca()
  .add('role:app', function (msg, reply) {
    const id = uuidv1();
    console.log(id)
    Seneca()
    .add(`role:fw,cmd:createActor,actorId:${id}`, (msg, resolve) => {
      const m = deserializeArgs(msg.d);
      const s = new Subject();

      const arr1 = m.operations.map(o => {
          const op = require('rxjs/operators')[o.operator];
          return op.apply(op, o.args); 
      });

      let result = `Not a multiple of 2 so , didnot double`;

      s.pipe.apply(s, arr1).subscribe((resp,err) => { 
          result = resp;
      });

      s.next(msg.value);
      s.complete();
      resolve({val:result});
    
    }).use('mesh', {
      isbase:false,
      pin: `role:fw,cmd:createActor,actorId:${id}`
    })
    reply({pattern:`role:fw,cmd:createActor,actorId:${id}`});
  })
  .use('mesh', {
    isbase:false,
    pin: 'role:app'
  })