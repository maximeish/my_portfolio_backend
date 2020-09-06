import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import dotEnv from 'dotenv';

dotEnv.config();

chai.use(chaiHttp);

const tokens = {
	adminToken: null,
	normalUserToken: null,
	samplePostid: null,
	sampleUserPostid: null,
	sampleCommentid: null
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
	describe('Tests for Adding Posts from admin page and user dashboard page', () => {
		it('(200 Success) POST /addPost to add a post with (admin token, title, body)', done => {
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
						.post('/addPost')
						.set('usertoken', tokens.adminToken)
						.send({
							title: 'Dummy Post from Admin',
							body: '<p>Dummy</p> <br/> <p>body</p>'
						})
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 200);
							tokens.samplePostid = res.body.message._id.toString();
							assert.deepPropertyVal(res.body, 'status', 'Post successfully created')
							done();
						});
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


		it('(200 Success) POST /addPost to add a post with (normal user token, title, body)', done => {
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
						.post('/addPost')
						.set('usertoken', tokens.normalUserToken)
						.send({
							title: 'Dummy Post from normal user',
							body: '<p>Dummy</p> <br/> <p>body</p>'
						})
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 200);
							tokens.sampleUserPostid = res.body.message._id.toString();
							assert.deepPropertyVal(res.body, 'status', 'Post successfully created');
							done();
						});
				})
		});	


		it('(400 Bad Request) POST /addPost to add a post with missing usertoken (title, body)', done => {
			chai.request(server)
				.post('/addPost')
				.send({
					title: 'Dummy Post',
					body: '<p>Dummy</p> <br/> <p>body</p>'
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
					body: '<p>Dummy</p> <br/> <p>body</p>'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Forbidden');
					done();
				});
		});	
	});


	describe('Tests for retrieving posts from admin page and user dashboard page', () => {
		it('(200 Success) GET /getPosts to get all posts with admin user token', done => {
    		chai.request(server)
				.get('/getPosts')
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Success');
					done();
				});		
		});

		it('(200 Success) GET /getPosts to get all posts of a user with normal user token', done => {
    		chai.request(server)
				.get('/getPosts')
				.set('usertoken', tokens.normalUserToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Success');
					done();
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

	describe('Tests for retrieving posts from the blog page', () => {
		it('(200 Success) GET /blogpost/:postid to get a blog post using its postid as a not logged in user (postid)', done => {
			chai.request(server)
				.get(`/blogpost/${tokens.samplePostid}`)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', guestUser_Role);
					done();
				});
		});

		it('(400 Bad Request) GET /blogpost to get a blog post without the postid as a not logged in user', done => {
			chai.request(server)
				.get('/blogpost')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				});
		});

		it('(500 Server Error) GET /blogpost/:postid to get a blog post with an invalid postid as a not logged in user (postid)', done => {
			chai.request(server)
				.get('/blogpost/alkjfklafjldf')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 500);
					assert.deepPropertyVal(res.body, 'status', 'Server Error')
					done();
				});
		});


		it('(200 Success) GET /blogpost/:postid to get a blog post using its postid as a logged in normal user (usertoken, postid)', done => {
			chai.request(server)
				.get(`/blogpost/${tokens.samplePostid}`)
				.set('usertoken', tokens.normalUserToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', normalUser_Role);
					done();
				});
		});

		it('(200 Success) GET /blogpost/:postid to get a blog post using its valid postid but with an invalid usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get(`/blogpost/${tokens.samplePostid}`)
				.set('usertoken', 'askdfjadwfjal')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', process.env.GUEST_USER_ROLE)
					done();
				});
		});

		it('(404 Not Found) GET /blogpost/:postid to get a blog post using a non-existing but valid postid with a valid normal usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogpost/5f4a2aff5039fe35fe86dbb5')
				.set('usertoken', tokens.normalUserToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					assert.deepPropertyVal(res.body, 'status', 'Not Found');
					done();
				});
		});

		it('(404 Not Found) GET /blogpost/:postid to get a blog post using a non-existing but valid postid with an invalid usertoken (usertoken, postid)', done => {
			chai.request(server)
				.get('/blogpost/5f4a2aff5039fe35fe86dbb5')
				.set('usertoken', 'ksjdfkladfjkldfjk')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 404);
					assert.deepPropertyVal(res.body, 'status', 'Not Found');
					done();
				});
		});

		it('(200 Success) GET /blogpost/:postid to get a blog post using its postid as a logged in admin user (usertoken, postid)', done => {
			chai.request(server)
				.get(`/blogpost/${tokens.samplePostid}`)
				.set('usertoken', tokens.adminToken)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'userRole', adminUser_Role);
					done();
				});
		});
	});

	describe('Tests for CRUD features for comments to posts on the blog post page', () => {
		//add comment
		it('(200 Success) POST to /addComment as a logged in user (usertoken, postid, comment_text)', done => {
			chai.request(server)
				.post('/addComment')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid,
					comment_text: 'hello'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Comment added successfully');
					tokens.sampleCommentid = res.body.post.comments[res.body.post.comments.length - 1]._id;
					done();
				})
		})

		it('(403 Forbidden) POST to /addComment with an invalid user token (usertoken, postid, comment_text)', done => {
			chai.request(server)
				.post('/addComment')
				.set('usertoken', 'jlsdfjakfjlfjkl')
				.send({
					postid: tokens.samplePostid,
					comment_text: 'hello'
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Forbidden');
					done();
				})
		})

		it('(400 Bad Request) POST to /addComment missing either usertoken, postid, or comment_text', done => {
			chai.request(server)
				.post('/addComment')
				.set('usertoken', 'jlsdfjakfjlfjkl')
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				})
		})

		//update the comment
		it('(200 Success) PUT to /updateComment as comment owner to update its text', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid,
					commentid: tokens.sampleCommentid,
					comment_text: "comment by tester"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Comment modified');
					done();
				})
		})

		it('(403 Forbidden) PUT to /updateComment to update comment text with invalid user token', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', 'skdfjkafjaklf')
				.send({
					postid: tokens.samplePostid,
					commentid: tokens.sampleCommentid,
					comment_text: "comment by tester"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Forbidden');
					done();
				})
		})

		it('(400 Bad Request) PUT to /updateComment to update comment with any missing data in postid, commentid, likes or comment_text and user token', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', 'skdfjkafjaklf')
				.send({
					commentid: tokens.sampleCommentid,
					comment_text: "comment by tester"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 400);
					assert.deepPropertyVal(res.body, 'status', 'Bad Request');
					done();
				})
		})

		it ('(200 Success) PUT to /updateComment to like the comment', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid,
					commentid: tokens.sampleCommentid,
					likes: 1
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Success. Likes (+1)');
					done();
				})
		})

		it ('(200 Success) PUT to /updateComment to unlike the comment', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid,
					commentid: tokens.sampleCommentid,
					likes: 1
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Success. Likes (-1)');
					done();
				})
		})

		it ('(403 Unauthorized) PUT to /updateComment to try and update comment text as not the comment owner', done => {
			chai.request(server)
				.put('/updateComment')
				.set('usertoken', tokens.adminToken)
				.send({
					postid: tokens.samplePostid,
					commentid: tokens.sampleCommentid,
					comment_text: "Updated by Unauthorized user"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'message', 'You are not authorized to edit this comment');
					done();
				})
		})
	})

	describe('Tests for updating posts from user dashboard page and admin page', () => {
		it('(200 Success) PUT /updatePost for a normal user to update their own post (usertoken, postid)', done => {
    		chai.request(server)
				.put('/updatePost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.sampleUserPostid,
					title: "New title from normal user",
					body: "New post body from normal user"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Post updated successfully');
					done();
				});		
		});


		it('(200 Success) PUT /updatePost for an admin user to update any user post  (usertoken, postid)', done => {
    		chai.request(server)
				.put('/updatePost')
				.set('usertoken', tokens.adminToken)
				.send({
					postid: tokens.sampleUserPostid,
					title: "New title from normal user",
					body: "New post body from normal user"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Post updated successfully');
					done();
				});		
		});

		it('(403 Unauthorized) PUT /updatePost for a normal user to update another user\'s post  (usertoken, postid)', done => {
    		chai.request(server)
				.put('/updatePost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid,
					title: "New title from normal user",
					body: "New post body from normal user"
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Unauthorized');
					done();
				});		
		});

	})

	describe('Tests for deleting posts from admin page and user dashboard page', () => {
		it('(403 Unauthorized) DELETE /deletePost for a normal user to delete another user\'s post  (usertoken, postid)', done => {
    		chai.request(server)
				.delete('/deletePost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 403);
					assert.deepPropertyVal(res.body, 'status', 'Unauthorized');
					done();
				});		
		});

		it('(200 Success) DELETE /deletePost for a normal user to delete their own post  (usertoken, postid)', done => {
    		chai.request(server)
				.delete('/deletePost')
				.set('usertoken', tokens.normalUserToken)
				.send({
					postid: tokens.sampleUserPostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Post successfully deleted');
					done();
				});		
		});

		it('(200 Success) DELETE /deletePost for an admin user to delete their own post and any other user\'s post (usertoken, postid)', done => {
    		chai.request(server)
				.delete('/deletePost')
				.set('usertoken', tokens.adminToken)
				.send({
					postid: tokens.samplePostid
				})
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.deepPropertyVal(res.body, 'status', 'Post successfully deleted');
					//add a new post as a normal user, get it's id, then delete it as an admin user
					chai.request(server)
						.post('/addPost')
						.set('usertoken', tokens.normalUserToken)
						.send({
							title: 'Dummy Post from normal user',
							body: '<p>Dummy</p> <br/> <p>body</p>'
						})
						.end((err, res) => {
							if (err) done(err);
							assert.equal(res.status, 200);
							tokens.sampleUserPostid = res.body.message._id.toString();
							chai.request(server)
								.delete('/deletePost')
								.set('usertoken', tokens.adminToken)
								.send({
									postid: tokens.sampleUserPostid
								})
								.end((err, res) => {
									if (err) done(err);
									assert.equal(res.status, 200);
									assert.deepPropertyVal(res.body, 'status', 'Post successfully deleted');
									done();
								})
						})
				});		
		});
	})
});