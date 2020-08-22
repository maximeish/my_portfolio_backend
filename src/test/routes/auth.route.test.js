import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';

chai.use(chaiHttp);

describe("API calls to auth routes", () => {

    describe("POST requests to /signup", () => {
        it('(200 Success) user SIGN UP by POST to /signup and get token', done => {
            chai.request(server)
                .post('/signup')
                .set('username', 'skdfj')
                .set('email', 'skdfj@sdf.com')
                .set('password', 'alkfjds')
                .set('role', 'user')
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.status, 200);
                    done();
                });
        });

        it('(400 Bad Request) user SIGN UP by POST to /signup without supplying a role', done => {
            chai.request(server)
                .post('/signup')
                .set('username', 'skdfj')
                .set('email', 'skdfj@sdf.com')
                .set('password', 'alkfjds')
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.status, 400);
                    done();
                });
        });

        it('(400 Bad Request) user SIGN UP by POST to /signup by supplying an invalid role', done => {
            chai.request(server)
                .post('/signup')
                .set('username', 'skdfj')
                .set('email', 'skdfj@sdf.com')
                .set('password', 'alkfjds')
                .set('role', 'akdsfjklas')
                .end((err, res) => {
                    if (err) done(err);
                    assert(res.status, 400);
                    done();
                });
        });
    });


    describe("POST requests to /login", () => {
        it('(200 Success) user LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'test2@tset.com')
                .set('password', 'temponesdf')
                .end((err, res) => {
                    if(err) done(err);
                    assert(res.status, 200);
                    done();
                });
        });

        it('(401 Unauthorized) user LOGIN by POST to /login with invalid credentials', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'test@ts.com')
                .set('password', 'temone')
                .end((err, res) => {
                    if(err) done(err);
                    assert(res.status, 401);
                    done();
                });
        });

        it('(400 Bad Request) user LOGIN by POST to /login with missing credentials', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'test@ts.com')
                .end((err, res) => {
                    if(err) done(err);
                    assert(res.status, 400);
                    done();
                });
        });

        it('(200 Success) admin LOGIN by POST to /login and get token', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'admin@api.com')
                .set('password', 'tempone')
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 200);
                    done();
                });
        });
    });


    describe("POST requests to /admin", () => {
        it('(403 Forbidden) POST to /admin without a token', done => {
            chai.request(server)
                .post('/admin')
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.status, 403);
                    done();
                });
        });

        //sign a dummy user up and get a valid token to POST to /admin
        it('(403 Forbidden) POST to /admin with a token but NOT admin user', done => {
            chai.request(server)
                .post('/signup')
                .set('username', 'test')
                .set('email', 'lsjdfl@lkdfj')
                .set('password', 'testsdfsdf')
                .set('role', 'user')
                .end((err, res) => {
                    if (err) done(err);
                    chai.request(server)
                        .post('/admin')
                        .set('authorization', `Bearer ${res.body.token}`)
                        .end((err, res) => {
                            if (err) done(err);
                            assert.equal(res.status, 403);
                            done();
                        })
                })
        });

        //log in as admin and get token to POST to /admin
        it('(200 Success) POST to /admin with a token as admin user', done => {
            chai.request(server)
                .post('/login')
                .set('email', 'admin@api.com')
                .set('password', 'tempone')
                .end((err, res) => {
                    if (err) done(err);
                    chai.request(server)
                        .post('/admin')
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