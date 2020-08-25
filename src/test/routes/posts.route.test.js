import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';

chai.use(chaiHttp);

const tokens = {
	adminToken: null,
	normalUserToken: null,
	commentToken: null,
	postToken: null,
}

describe('Tests to API post routes', () => {
	it('(200 Success) GET /getPosts with admin user token', done => {
		chai.request(server)
	    	.post('/login')
	    	.set('email', 'admin@api.com')
	    	.set('password', 'tempone')
	    	.end((err, res) => {
	    		if (err) done(err);
	    		tokens.adminToken = res.body.token;
	    		chai.request(server)
				.get('/getPosts')
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					done();
				});		
			});
	});

	// it('(200 Success) POST /blogPost', done => {
	// 	chai.request(server)
	// 		.post('/blogPost')
	// 		.end((err, res) => {
	// 			if (err) done(err);
	// 			console.log(res.body, res.status);
	// 			assert.equal(res.status, 200);
	// 			done();
	// 		});
	// });


	// it('(200 Success) POST /blogPost', done => {
	// 	chai.request(server)
	// 		.post('/blogPost')
	// 		.end((err, res) => {
	// 			if (err) done(err);
	// 			console.log(res.body, res.status);
	// 			assert.equal(res.status, 200);
	// 			done();
	// 		});
	// });


	// it('(200 Success) POST /blogPost', done => {
	// 	chai.request(server)
	// 		.post('/blogPost')
	// 		.end((err, res) => {
	// 			if (err) done(err);
	// 			console.log(res.body, res.status);
	// 			assert.equal(res.status, 200);
	// 			done();
	// 		});
	// });
});