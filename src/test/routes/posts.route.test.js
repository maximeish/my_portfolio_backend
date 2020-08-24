import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';

chai.use(chaiHttp);

describe('Tests to API post routes', () => {
	it('(200 Success) GET /posts', done => {
		chai.request(server)
			.get('/posts')
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 200);
				done();
			});
	});

	it('(200 Success) POST /blogPost', done => {
		chai.request(server)
			.post('/blogPost')
			.end((err, res) => {
				if (err) done(err);
				console.log(res.body, res.status);
				assert.equal(res.status, 200);
				done();
			});
	});


	it('(200 Success) POST /blogPost', done => {
		chai.request(server)
			.post('/blogPost')
			.end((err, res) => {
				if (err) done(err);
				console.log(res.body, res.status);
				assert.equal(res.status, 200);
				done();
			});
	});


	it('(200 Success) POST /blogPost', done => {
		chai.request(server)
			.post('/blogPost')
			.end((err, res) => {
				if (err) done(err);
				console.log(res.body, res.status);
				assert.equal(res.status, 200);
				done();
			});
	});
});