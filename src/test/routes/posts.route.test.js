import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import dotEnv from 'dotenv';

dotEnv.config();

chai.use(chaiHttp);

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

const guestUser_Role = process.env.GUEST_USER_ROLE;

const adminUser_Email = process.env.ADMIN_EMAIL;
const adminUser_Pass = process.env.ADMIN_PASS;
const adminUser_Role = process.env.ADMIN_USER_ROLE;

describe('Tests to API post routes', () => {
	describe('Tests for retrieving posts from admin page', () => {
		it('(200 Success) GET /getPosts to get all posts with admin user token', done => {
			chai.request(server)
		    	.post('/login')
		    	.set('email', adminUser_Email)
		    	.set('password', adminUser_Pass)
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
		    	.set('email', normalUser_Email)
		    	.set('password', normalUser_Pass)
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


	describe('Tests for Adding Posts from admin page', () => {
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


	describe('Tests for retrieving posts from the blog page', () => {
		it('(200 Success) GET /blogPost to get a blog post using its posttoken as a not logged in user (post token)', done => {
			chai.request(server)
				.get('/getPosts')
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					tokens.postToken = res.body.posts[0].postToken;
					chai.request(server)
						.get('/blogPost')
						.set('posttoken', tokens.postToken)
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 200);
							assert.deepPropertyVal(res.body, 'userRole', guestUser_Role);
							done();
						});
				})
		});

		it('(400 Bad Request) GET /blogPost to get a blog post without the posttoken as a not logged in user', done => {
			chai.request(server)
				.get('/blogPost')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});

		it('(404 Not Found) GET /blogPost to get a blog post with an invalid posttoken as a not logged in user', done => {
			chai.request(server)
				.get('/blogPost')
				.set('posttoken', 'kasdfjkldfjakldsf')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					done();
				});
		});


		it('(200 Success) GET /blogPost to get a blog post using its posttoken as a logged in normal user (usertoken, posttoken)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.normalUserToken)
				.set('posttoken', tokens.postToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
					done();
				});
		});

		it('(400 Bad Request) GET /blogPost to get a blog post using its posttoken but with an invalid usertoken (usertoken, posttoken)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', 'askdfjadwfjal')
				.set('posttoken', tokens.postToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					done();
				});
		});

		it('(404 Not Found) GET /blogPost to get a blog post using an invalid posttoken but with a valid normal usertoken (usertoken, posttoken)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.normalUserToken)
				.set('posttoken', 'aksdjfkdjfsakl')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					done();
				});
		});

		it('(404 Not Found) GET /blogPost to get a blog post using an invalid posttoken with also an invalid usertoken (usertoken, posttoken)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', 'ksjdfkladfjkldfjk')
				.set('posttoken', 'aksdjfkdjfsakl')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					done();
				});
		});

		it('(200 Success) GET /blogPost to get a blog post using its posttoken as a logged in admin user (usertoken, posttoken)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.adminToken)
				.set('posttoken', tokens.postToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', adminUser_Role);
					done();
				});
		});

	});
});