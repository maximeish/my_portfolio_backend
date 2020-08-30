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
	samplePostid: null
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
		    	.send({
		    		email: adminUser_Email,
		    		password: adminUser_Pass
		    	})
		    	.end((err, res) => {
		    		if (err) done(err);
		    		tokens.adminToken = res.body.userToken;
		    		chai.request(server)
						.get('/getPosts')
						.set('usertoken', tokens.adminToken)
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 200);
							tokens.samplePostid = res.body.posts[0]._id;
							assert.deepPropertyVal(res.body, 'status', 'Success');
							done();
						});		
				});
		});

		it('(403 Unauthorized) GET /getPosts to get all posts with normal user token', done => {
			chai.request(server)
		    	.post('/login')
		    	.send({
		    		email: normalUser_Email,
		    		password: normalUser_Pass
		    	})
		    	.end((err, res) => {
		    		if (err) done(err);
		    		tokens.normalUserToken = res.body.userToken;
		    		chai.request(server)
						.get('/getPosts')
						.set('usertoken', tokens.normalUserToken)
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 403);
							assert.deepPropertyVal(res.body, 'status', 'Unauthorized');
							done();
						});		
				});
		});

		it('(400 Bad Request) GET /getPosts to get all posts with no user token', done => {
			chai.request(server)
				.get('/getPosts')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
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
					assert.deepPropertyVal(res.body, 'status', 'Forbidden');
					done();
				});		
		});
	});


	describe('Tests for Adding Posts from admin page', () => {
		it('(200 Success) POST /addPost to add a post with (admin token, title, body, author)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.send({
					title: 'Dummy Post',
					body: '<p>Dummy</p> <br/> <p>body</p>',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Post successfully created')
					done();
				});
		});

		it('(400 Bad Request) POST /addPost to add a post as admin but with missing title (admin token, body, author)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.send({
					body: '<p>Dummy</p> <br/> <p>body</p>',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});


		it('(400 Bad Request) POST /addPost to add a post as admin but with missing body (admin token, title, author)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.send({
					title: 'Dummy Post',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});


		it('(400 Bad Request) POST /addPost to add a post as admin but with missing title, body and author (admin token)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});


		it('(403 Unauthorized) POST /addPost to add a post with (normal user token, title, body, author)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					title: 'Dummy Post',
					body: '<p>Dummy</p> <br/> <p>body</p>',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Unauthorized');
					done();
				});
		});	


		it('(400 Bad Request) POST /addPost to add a post with missing usertoken (title, body, author)', done => {
			chai.request(server)
				.post('/addPost')
				.send({
					title: 'Dummy Post',
					body: '<p>Dummy</p> <br/> <p>body</p>',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});

		it('(403 Forbidden) POST /addPost to add a post with invalid usertoken (usertoken, title, body)', done => {
			chai.request(server)
				.post('/addPost')
				.set('usertoken', 'ksdjfkldjsafks')
				.send({
					title: 'Dummy Post',
					body: '<p>Dummy</p> <br/> <p>body</p>',
					author: 'Tester'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Forbidden');
					done();
				});
		});	
	});


	describe('Tests for retrieving posts from the blog page', () => {
		it('(200 Success) GET /blogPost to get a blog post using its postid as a not logged in user (postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', guestUser_Role);
					done();
				});
		});

		it('(400 Bad Request) GET /blogPost to get a blog post without the postid as a not logged in user', done => {
			chai.request(server)
				.get('/blogPost')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});

		it('(500 Server Error) GET /blogPost to get a blog post with an invalid postid as a not logged in user (postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.send({
					postid: 85034
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 500);
					assert.deepPropertyVal(res.body, 'status', 'Server Error')
					done();
				});
		});


		it('(200 Success) GET /blogPost to get a blog post using its postid as a logged in normal user (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
					done();
				});
		});

		it('(200 Success) GET /blogPost to get a blog post using its valid postid but with an invalid usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', 'askdfjadwfjal')
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', process.env.GUEST_USER_ROLE)
					done();
				});
		});

		it('(404 Not Found) GET /blogPost to get a blog post using an invalid postid but with a valid normal usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: '5f4a2aff5039fe35fe86dbb5'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					assert.deepPropertyVal(res.body, 'status', 'Not Found');
					done();
				});
		});

		it('(404 Not Found) GET /blogPost to get a blog post using an invalid postid with also an invalid usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', 'ksjdfkladfjkldfjk')
				.send({
					postid: '5f4a2aff5039fe35fe86dbb5'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					assert.deepPropertyVal(res.body, 'status', 'Not Found');
					done();
				});
		});

		it('(200 Success) GET /blogPost to get a blog post using its postid as a logged in admin user (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogPost')
				.set('usertoken', tokens.adminToken)
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', adminUser_Role);
					done();
				});
		});
	});
});