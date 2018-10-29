const chai = require('chai');
chai.should();
const Seneca = require('seneca');
const uuidv1 = require('uuid/v1');
const serializeArgs = require('../serializeArgs');
const { map } = require('rxjs/operators');

describe('create actor and new actor that is calling client add service', function () {

  it('should print sum of all items', function (done) {
    this.timeout(6000);
    const id1 = uuidv1();
    const data = {
      operations: [{
        operator: 'reduce',
        args: [(s, i) => s + i]
      }]
    }

    const values = [{ 'next': 2 }, { 'next': 3 }, { 'next': 4 }, { 'next': 5 }, { 'next': 6 }, { 'complete': true }];

    Seneca({ log: 'test' })
      .use('mesh')
      .act('role:fw,cmd:creatActor', { data: serializeArgs(data), id: id1 }, function (err, out) { //passing id1 so that it is returned in seneca.add to client
        console.log("out id ", out.id);
        values.forEach(element => {
          Seneca()
            .use('mesh')
            // .ready(function () {
              .act(`role:app,type:actor,actorId:${out.id}`, { value: element }, (err, response) => {
                console.log('Response of actor receiving values in test case 1 :', response);
            // });
          })
        });
      });

    Seneca().add(`role:app,type:actor,actorId:${id1}`, function (data, reply) {
      console.log("response from actor with bussiness logic test case 1 : ", data.res);
      reply({ value: "reply via bussiness logic add method" });
      chai.expect(data.res).to.equal(20);
      done();
    })
      .use('mesh', {
        pin: `role:app,type:actor,actorId:${id1}`,
      })
  })
    ,
    it('should sum all the odd values', function (done) {
      this.timeout(6000);
      const id1 = uuidv1();
      const data = {
        operations: [{
          operator: 'filter',
          args: [i => i % 2 !== 0]
        }, {
          operator: 'reduce',
          args: [(s, i) => s + i]
        }]
      }

      const values = [{ 'next': 2 }, { 'next': 3 }, { 'next': 4 }, { 'next': 5 }, { 'next': 6 }, { 'complete': true }];

      Seneca({ log: 'test' })
        .use('mesh')
        .act('role:fw,cmd:creatActor', { data: serializeArgs(data), id: id1 }, function (err, out) { //passing id1 so that it is returned in seneca.add to client
          console.log("out id ", out.id)
          values.forEach(element => {
            Seneca()
              .use('mesh')
              // .ready(function () {
               .act(`role:app,type:actor,actorId:${out.id}`, { value: element }, (err, response) => {
                  console.log('Response of actor receiving values in test case 2 :', response);
              // });
            })
          });
        });

      Seneca().add(`role:app,type:actor,actorId:${id1}`, function (data, reply) {
        console.log("response from actor with bussiness logic test case 2 : ", data.res);
        reply({ value: "reply via bussiness logic add method" });
        chai.expect(data.res).to.equal(8);
        done();
      })
        .use('mesh', {
          pin: `role:app,type:actor,actorId:${id1}`,
        })
    })
    ,
    it('should print odd no. ', function (done) {
      this.timeout(10000);
      const id1 = uuidv1();
      const data = {
        operations: [{
          operator: 'filter',
          args: [i => i % 2 !== 0]
        }]
      }

      const values = [{ 'next': 2 }, { 'next': 3 }, { 'next': 4 }, { 'next': 5 }, { 'next': 6 }, { 'complete': true }];

      Seneca({ log: 'test' })
        .use('mesh')
        .act('role:fw,cmd:creatActor', { data: serializeArgs(data), id: id1 }, function (err, out) { //passing id1 so that it is returned in seneca.add to client
          values.forEach(element => {
            Seneca()
              .use('mesh')
              // .ready(function () {
                .act(`role:app,type:actor,actorId:${out.id}`, { value: element }, (err, response) => {
                  console.log('Response of actor receiving values in test case 3 :', response);
              // });
            })
          });
        });

      Seneca().add(`role:app,type:actor,actorId:${id1}`, function (data, reply) {
        console.log("response from actor with bussiness logic test case 3 : ", data.res);
        reply({ value: "reply via bussiness logic add method" });
        chai.assert(data.res % 2 !== 0,"is not an odd no"); // "is not an odd no" is displayed on error
        console.log("data")
      })
        .use('mesh', {
          pin: `role:app,type:actor,actorId:${id1}`,
        })
        done();
    });
});





