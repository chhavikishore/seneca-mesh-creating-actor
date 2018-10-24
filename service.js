const Seneca = require('seneca');
const deserializeArgs = require('./deserializeArgs');
const uuidv1 = require('uuid/v1');
const { Subject } = require('rxjs');

Seneca()
  .add('role:fw,cmd:creatActor', function (msg, reply) {
    const id = uuidv1(); //id2 creation
     console.log("id2 : ",id)
    Seneca()
      .add(`role:app,type:actor,actorId:${id}`, (message, resolve) => {
        //console.log(msg.id); //it is id1
        const m = deserializeArgs(message.data);
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
            .act(`role:app,type:actor,cmd:print,actorId:${msg.id}`,{res:resp},function(err,out){
              console.log("inside client subscription : ",out);
            });
          },
          (err) => {
            console.log(err)
          },
          (complete) => {
            console.log(complete)  
          }
        );

        if(message.value.hasOwnProperty("next")){
          s1.next(message.value.next);
          resolve({ val:'next value received'});
        } else if(message.value.hasOwnProperty("complete")){
          s1.complete();
          resolve({ val:'completed'});
        } else if(message.value.hasOwnProperty("error")){
          s1.error("error occurred");
          resolve({ val:'some error occured'});
        }

      }).use('mesh', {
        isbase: false,
        pin: `role:app,type:actor,actorId:${id}` //id2 created inside createActor
      })
    reply({id:id}); //id2 created inside createActor is returned that is used in nested add method
  })
  .use('mesh', {
    isbase: false,
    pin: 'role:fw,cmd:creatActor'
  })