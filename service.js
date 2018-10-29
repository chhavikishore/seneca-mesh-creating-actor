const Seneca = require('seneca');
const deserializeArgs = require('./deserializeArgs');
const uuidv1 = require('uuid/v1');
const { Subject } = require('rxjs');

Seneca()
  .add('role:fw,cmd:creatActor', function (msg, reply) {
    const id = uuidv1(); //id2 creation
    console.log("id2 : ", id);
    const m = deserializeArgs(msg.data);
    let s = new Subject();
    let s1 = new Subject();

    const arr1 = m.operations.map(o => {
      const op = require('rxjs/operators')[o.operator];
      return op.apply(op, o.args);
    });

    let result = `Not a multiple of 2 so , didnot double`;
  
    s1 = s.pipe.apply(s, arr1);


    s1.subscribe(
      (resp) => {
        Seneca()
          .use('mesh')
          .act(`role:app,type:actor,actorId:${msg.id}`, { res: resp }, function (err, out) { //passing id1  
            console.log("Inside service subscribe which is passed to client add : ", out);
          });
      },
      (err) => {
        console.log("error in subscribe ",err)
      },
      (complete) => {
        console.log("subscribe completed :",complete)
      }
    );

    Seneca()
      .add(`role:app,type:actor,actorId:${id}`, (message, resolve) => { //in pattern its id2
        if (message.value.hasOwnProperty("error")) {
          s1.error("error occurred");
          resolve({ val: 'some error occured' });
        } else if (message.value.hasOwnProperty("next")) {
          s1.next(message.value.next);
          resolve({ val: 'next value received' });
        } else {
          s1.complete();
          resolve({ val: 'completed' });
        }
      }).use('mesh', {
        isbase: false,
        pin: `role:app,type:actor,actorId:${id}` //id2 created inside createActor
      })
    reply({ id: id }); //id2 created inside createActor is returned that is used in nested add method
  })
  .use('mesh', {
    isbase: false,
    pin: 'role:fw,cmd:creatActor'
  })