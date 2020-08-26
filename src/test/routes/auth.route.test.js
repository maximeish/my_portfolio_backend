import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import dotEnv from 'dotenv';

dotEnv.config();

const fakeUsername = process.env.FAKE_USERNAME;
const fakeUser_Email = process.env.FAKE_USER_EMAIL;
const fakeUser_Pass = process.env.FAKE_USER_PASS;
const fakeRole = process.env.FAKE_ROLE;

const normalUser_Email = process.env.NORMAL_USER_EMAIL;
const normalUser_Pass = process.env.NORMAL_USER_PASS;
const normalUser_Role = process.env.NORMAL_USER_ROLE;

const adminUser_Email = process.env.ADMIN_EMAIL;
const adminUser_Pass = process.env.ADMIN_PASS;
const adminUser_Role = process.env.ADMIN_USER_ROLE;




chai.use(chaiHttp);

describe("Tests to API auth routes", () => {
    describe("POST requests to /signup", () => {
        it('(200 Success) user SIGN UP by POST to /signup and get token', done => {
            chai.request(server)
                .post('/signup')
                .set('username', fakeUsername)
                .set('email', fakeUser_Email)
                .set('password', fakeUser_Pass)
                .set('role', normalUser_Role)
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 200);
                    assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
                    done();
                });
        });

        it('(400 Bad Request) user SIGN UP by POST to /signup without supplying a role', done => {
            chai.request(server)
                .post('/signup')
                .set('username', fakeUsername)
                .set('email', fakeUser_Email)
                .set('password', fakeUser_Pass)
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 400);
                    done();
                });
        });

        it('(400 Bad Request) normal user SIGN UP by POST to /signup by supplying an invalid role', done => {
            chai.request(server)
                .post('/signup')
                .set('username', fakeUsername)
                .set('email', fakeUser_Email)
                .set('password', fakeUser_Pass)
                .set('role', fakeRole)
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 400);
                    done();
                });
        });
    });


    describe("POST requests to /login", () => {
        it('(200 Success) normal user LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .set('email', normalUser_Email)
                .set('password', normalUser_Pass)
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 200);
                    assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
                    done();
                });
        });

        it('(401 Unauthorized) user LOGIN by POST to /login with invalid credentials', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'user@example.com')
                .set('password', 'Password123')
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 401);
                    done();
                });
        });

        it('(400 Bad Request) user LOGIN by POST to /login with missing credentials', done => {
            chai.request(server)
                .post('/login')
                .set('email', normalUser_Email)
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 400);
                    done();
                });
        });

        it('(200 Success) admin LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .set('email', adminUser_Email)
                .set('password', adminUser_Pass)
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 200);
                    assert.deepPropertyVal(res.body, 'userRole', adminUser_Role);
                    done();
                });
        });
    });


    describe("GET requests to /admin", () => {
        it('(403 Forbidden) GET /admin without a usertoken', done => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 403);
                    done();
                });
        });

        //sign a dummy user up and get a valid token to GET /admin
        it('(403 Forbidden) GET /admin with a token but NOT admin user', done => {
            chai.request(server)
                .post('/signup')
                .set('username', fakeUsername)
                .set('email', fakeUser_Email)
                .set('password', fakeUser_Pass)
                .set('role', normalUser_Role)
                .end((err, res) => {
                    if (err) done(err);
                    chai.request(server)
                        .get('/admin')
                        .set('authorization', `Bearer ${res.body.token}`)
                        .end((err, res) => {
                            if (err) done(err);
                            assert.equal(res.status, 403);
                            done();
                        })
                })
        });

        //log in as admin and get token to GET /admin
        it('(200 Success) GET /admin with a token as admin user', done => {
            chai.request(server)
                .post('/login')
                .set('email', adminUser_Email)
                .set('password', adminUser_Pass)
                .end((err, res) => {
                    if (err) done(err);
                    chai.request(server)
                        .get('/admin')
                        .set('authorization', `Bearer ${res.body.token}`)
                        .end((err, res) => {
                            if (err) done(err);
                            assert.equal(res.status, 200);
                            done();
                        });
                });
        });
    });    
});