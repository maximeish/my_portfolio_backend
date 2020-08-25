// import chai, {assert} from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../index';

// chai.use(chaiHttp);

//Get admin user token, normal user token, first comment token (admin comment)
//and first Post token

// const tokens = {
// 	adminToken: null,
// 	normalUserToken: null,
// 	commentToken: null,
// 	postToken: null,
// }



// describe("Getting tokens for admin user, normal user, first comment (admin comment) and first Post", async() => {
//     it("Get admin user token", done => {
//         chai.request(server)
//         	.post('/login')
//         	.set('email', 'admin@api.com')
//         	.set('password', 'tempone')
//         	.end((err, res) => {
//         		if (err) done(err);
//         		tokens.adminToken = res.body.token;
//         		assert.equal(res.status, 200);
//         		done();
//         	})
//     });


//     it("Get normal user token", done => {
//         chai.request(server)
//         	.post('/login')
//         	.set('email', 'test2@tset.com')
//         	.set('password', 'temponesdf')
//         	.end((err, res) => {
//         		if (err) done(err);
//         		tokens.normalUserToken = res.body.token;
//         		assert.equal(res.status, 200);
//         		done();
//         	})
//     });


//     it("Get a sample post token (using Admin token)", done => {
//         chai.request(server)
//         	.get('/getPosts')
//         	.set('usertoken', adminToken)
//         	.end((err, res) => {
//         		if (err) done(err);
//         		tokens.postToken = res.body.posts[0].postToken;
//         		assert.equal(res.status, 200);
//         		done();
//         	})
//     });


//     it("Get admin comment token", done => {
//         chai.request(server)
//         	.get('/comments')
//         	.end((err, res) => {
//         		if (err) done(err);
//         		tokens.commentToken = res.body[0].commentToken;
//         		assert.equal(res.status, 200);
//         		done();
//         	})
//     });
// });