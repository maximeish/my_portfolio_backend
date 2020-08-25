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
	describe('Tests for retrieving posts', () => {
		it('(200 Success) GET /getPosts to get all posts with admin user token', done => {
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

		it('(403 Forbidden) GET /getPosts to get all posts with normal user token', done => {
			chai.request(server)
		    	.post('/login')
		    	.set('email', 'test2@tset.com')
		    	.set('password', 'temponesdf')
		    	.end((err, res) => {
		    		if (err) done(err);
		    		tokens.normalUserToken = res.body.token;
		    		chai.request(server)
					.get('/getPosts')
					.set('usertoken', tokens.normalUserToken)
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 403);
						done();
					});		
				});
		});

		it('(403 Forbidden) GET /getPosts to get all posts with no user token', done => {
			chai.request(server)
				.get('/getPosts')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					done();
				});		
		});

		it('(403 Forbidden) GET /getPosts to get all posts with invalid user token', done => {
			chai.request(server)
				.get('/getPosts')
				.set('usertoken', 'skdsfjldfjdwjakdsf')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					done();
				});		
		});
	});


	describe('Tests for Adding Posts', () => {
		it('(200 Success) POST /addPost to add a post with (admin token, title, paragraphs)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.set('title', 'Dummy Post')
				.set('paragraphs', '<p>Dummy</p> <br/> <p>paragraphs</p>')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					done();
				});
		});

		it('(400 Bad Request) POST /addPost to add a post as admin but with missing title (admin token, paragraphs)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.set('paragraphs', '<p>Dummy</p> <br/> <p>paragraphs</p>')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});


		it('(400 Bad Request) POST /addPost to add a post as admin but with missing paragraphs (admin token, title)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.set('title', 'Dummy Post')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});


		it('(400 Bad Request) POST /addPost to add a post as admin but with missing title and paragraphs (admin token)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});


		it('(403 Forbidden) POST /addPost to add a post with (normal user token, title, paragraphs)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.normalUserToken)
				.set('title', 'Dummy Post')
				.set('paragraphs', '<p>Dummy</p> <br/> <p>paragraphs</p>')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					done();
				});
		});	


		it('(400 Bad Request) POST /addPost to add a post with missing usertoken (title, paragraphs)', done => {
			chai.request(server)
				.post('/addPost')
				.set('title', 'Dummy Post')
				.set('paragraphs', '<p>Dummy</p> <br/> <p>paragraphs</p>')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});

		it('(403 Unauthorized) POST /addPost to add a post with invalid usertoken (usertoken, title, paragraphs)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', 'ksdjfkldjsafks')
				.set('title', 'Dummy Post')
				.set('paragraphs', '<p>Dummy</p> <br/> <p>paragraphs</p>')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					done();
				});
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