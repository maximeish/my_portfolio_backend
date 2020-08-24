import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('API base route default behavior', () => {
    it('(200 Success) GET /', done => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                done();
            });
    });

    it('(404 Not Found) can\'t GET undefined route ex: /aksdjfkadfjw', done => {
        chai.request(app)
            .get('/aksdjfkadfjw')
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 404);
                done();
            });
    });
});