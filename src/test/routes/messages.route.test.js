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

describe("Tests to API Contact form routes", () => {
	it("(200 Success) GET to /messages to get all messages with admin token", done => {
		//get admin token by login
		chai.request(server)
			.post('/login')
			.set('email', 'admin@api.com')
			.set('password', 'tempone')
			.end((err, res) => {
				if (err) done(err);
				tokens.adminToken = res.body.token;
				//GET to /messages after getting admin token
				chai.request(server)
					.get('/messages')
					.set('usertoken', tokens.adminToken)
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 200);
						done();
					})
			});
	});

	it("(200 Success) POST to /messages to send a message (name, email, telephone, message) through the contact form (logged in or not)", done => {
		//get admin token by login
		chai.request(server)
			.post('/messages')
			.set('name', 'test')
			.set('email', 'user@test.com')
			.set('telephone', '3895894')
			.set('message', 'asdf kljsfd  asdkfj a')
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 200);
				done();
			});
	});
})