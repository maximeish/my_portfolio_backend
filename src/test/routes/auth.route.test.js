import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';

chai.use(chaiHttp);

describe("API calls to auth routes", () => {
    it('test for call to the /admin without the token', done => {
        chai.request(server)
            .post('/admin')
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 403);
                done();
            });
    });

    it('test for call to /admin with token but not admin user', done => {
        chai.request(server)
            .post('/signup')
            .set('username', 'test')
            .set('email', 'lsjdfl@lkdfj')
            .set('password', 'testsdfsdf')
            .set('role', 'user')
            .end((err, res) => {
                if (err) done(err);
                console.log(res.message, res.token);
                assert.equal(res.status, 200);
                done();
            })
    });
});