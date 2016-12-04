'use strict';

import User from './user.model';
const server = require('../index.js');

describe('User API',() =>{

    before((done)=>{
        User.remove().then(()=>{
            User.create({
                name: 'test user admin',
                email: 'admin@test.com',
                password: 'password',
                role:'admin'
            });
            User.create({
                name: 'test user',
                email: 'user@test.com',
                password: 'password',
            });
            done();
        });
    });

    after((done)=>{
        User.remove().exec();
        done();
    });

 describe('GET /api/users as ADMIN',()=>{
     let token;

     before((done)=>{
         request(server)
            .post('/auth')
            .send({
                email:'admin@test.com',
                password:'password'
            })
            .end((err,res)=>{
                expect(res).to.have.status(200)
                expect(res).to.be.a('object');
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            })
     });

    it('should authorize admin',(done)=>{
        request(server)
            .get('/api/users')
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
    });
 });

 describe('GET /api/users as USER',()=>{
     let token;

     before((done)=>{
         request(server)
            .post('/auth')
            .send({
                email:'user@test.com',
                password:'password'
            })
            .end((err,res)=>{
                expect(res).to.have.status(200)
                expect(res).to.be.a('object');
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            });
     });

     it('should not authorize simple user',(done)=>{
        request(server)
            .get('/api/users')
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(res).to.have.status(403);
                done();
            })
    });

 });
});