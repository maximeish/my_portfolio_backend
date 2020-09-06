import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import dotEnv from 'dotenv';

dotEnv.config();

const tokens = {
    adminToken: null,
    normalUserToken: null,
    commentToken: null,
    postToken: null,
}


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
                .send({
                    username: fakeUsername,
                    email: fakeUser_Email,
                    password: fakeUser_Pass,
                    role: normalUser_Role,
                    subscribed: 'no'
                })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 200);
                    assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
                    assert.isDefined(res.body.userToken);
                    tokens.normalUserToken = res.body.userToken;
                    done();
                })
        });


        it('(409 Conflict) user with existing email SIGN UP by POST to /signup and not get token', done => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: fakeUsername,
                    email: fakeUser_Email,
                    password: fakeUser_Pass,
                    role: normalUser_Role,
                    subscribed: 'no'
                })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 409);
                    assert.deepPropertyVal(res.body, 'status', 'Email taken');
                    assert.isUndefined(res.body.userToken);
                    done();
                })
        });

        it('(409 Conflict) user with existing username SIGN UP by POST to /signup and not get token', done => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: fakeUsername,
                    email: "new_email@yahoo.com",
                    password: fakeUser_Pass,
                    role: normalUser_Role,
                    subscribed: 'no'
                })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 409);
                    assert.deepPropertyVal(res.body, 'status', 'Username taken');
                    assert.isUndefined(res.body.userToken);
                    done();
                })
        });

        it('(400 Bad Request) user SIGN UP by POST to /signup without supplying a role', done => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: fakeUsername,
                    email: fakeUser_Email,
                    password: fakeUser_Pass,
                    subscribed: "no"
                })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 400);
                    assert.deepPropertyVal(res.body, 'message', 'Please, provide all details for a user (username, email, password, role) and make sure subscribed is yes or no');
                    done();
                });
        });

        it('(400 Bad Request) normal user SIGN UP by POST to /signup by supplying an invalid role', done => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: fakeUsername,
                    email: fakeUser_Email,
                    password: fakeUser_Pass,
                    role: 'ksjdfklsf',
                    subscribed: 'no'
                })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 400);
                    assert.deepPropertyVal(res.body, 'message', 'Invalid role. Should be admin or user')
                    done();
                });
        });
    });


    describe("POST requests to /login", () => {
        it('(200 Success) normal user LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: normalUser_Email,
                    password: normalUser_Pass
                })
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 200);
                    assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
                    assert.isDefined(res.body.userToken);
                    done();
                });
        });

        it('(401 Unauthorized) user LOGIN by POST to /login with invalid credentials', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: "sldj@sdkfj.dslfj",
                    password: "sdkfjsdkAsdfjk"
                })
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 401);
                    assert.deepPropertyVal(res.body, 'status', 'User not found or invalid login credentials');
                    done();
                });
        });

        it('(400 Bad Request) user LOGIN by POST to /login with missing credentials', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: normalUser_Email
                })
                .end((err, res) => {
                    if(err) done(err);
                    assert.equal(res.status, 400);
                    done();
                });
        });

        it('(200 Success) admin LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: adminUser_Email,
                    password: adminUser_Pass
                })
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
                    assert.deepPropertyVal(res.body, 'status', 'Forbidden')
                    done();
                });
        });

        it('(403 Forbidden) GET /admin with a token but NOT admin user', done => {
            chai.request(server)
                .get('/admin')
                .set('usertoken', tokens.normalUserToken)
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 403);
                    assert.deepPropertyVal(res.body, 'status', 'Unauthorized');
                    done();
                })
        });

        //log in as admin and get token to GET /admin
        it('(200 Success) GET /admin with a token as admin user', done => {
            chai.request(server)
                .post('/login')
                .send({
                    email: adminUser_Email,
                    password: adminUser_Pass
                })
                .end((err, res) => {
                    if (err) done(err);
                    tokens.adminToken = res.body.userToken;
                    chai.request(server)
                        .get('/admin')
                        .set('usertoken', tokens.adminToken)
                        .end((err, res) => {
                            if (err) done(err);
                            assert.equal(res.status, 200);
                            assert.deepPropertyVal(res.body, 'status', 'Success');
                            done();
                        });
                });
        });
    });    
});