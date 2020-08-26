import chai, {assert} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import dotEnv from 'dotenv';

dotEnv.config();

const fakeUsername = process.env.FAKE_USERNAME;
const fakeUser_Email = process.env.FAKE_USER_EMAIL;
const fakeUser_Pass = process.env.FAKE_USER_PASS;
const fakeRole = process.env.FAKE_ROLE;

const normalUser_Email = process.env.NORMAL_USER_EMAIL;
const normalUser_Pass = process.env.NORMAL_USER_PASS;
const normalUser_Role = process.env.NORMAL_USER_ROLE;

const adminUser_Email = process.env.ADMIN_EMAIL;
const adminUser_Pass = process.env.ADMIN_PASS;
const adminUser_Role = process.env.ADMIN_USER_ROLE;


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
			.set('email', adminUser_Email)
			.set('password', adminUser_Pass)
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
			.set('name', 'John Doe')
			.set('email', 'j.doe@example.com')
			.set('telephone', '393895894')
			.set('message', 'asdf kljsfd  asdkfj a')
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 200);
				done();
			});
	});
})