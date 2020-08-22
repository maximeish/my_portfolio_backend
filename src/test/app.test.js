import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('Blog API default', () => {
    it('tests for the initial API call to /', done => {
        chai
            .request(app)
            .get('/')
            .end((err, res) => {
                if (err) done(err);
                console.log(res.message);
                assert.equal(res.status, 200);
                done();
            })
    });

    it('test for undefined route call from /', done => {
        chai
            .request(app)
            .get('/aksdjfkadfjw')
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 404);
                done();
            });
    });
});