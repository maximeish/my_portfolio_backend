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

describe('Tests to API user routes (from admin page)', () => {
	it('(200 Success) GET /getUsers to get all users using admin token (usertoken)', done => {
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
					.get('/getUsers')
					.set('usertoken', tokens.adminToken)
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 200);
						assert.deepPropertyVal(res.body, 'status', 'Success')
						done();
					})
			})
	});

	it('(403 Unauthorized) GET /getUsers with a normal user token (usertoken)', done => {
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
					.get('/getUsers')
					.set('usertoken', tokens.normalUserToken)
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 403);
						assert.deepPropertyVal(res.body, 'status', 'Unauthorized')
						done();
					})
			})
	});

	it('(403 Unauthorized) GET /getUsers to get all users but without a user token', done => {
		chai.request(server)
			.get('/getUsers')
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 403);
				assert.deepPropertyVal(res.body, 'status', 'Unauthorized')
				done();
			});
	})

	it('(403 Forbidden) GET /getUsers to get all users with an invalid user token', done => {
		chai.request(server)
			.get('/getUsers')
			.set('usertoken', 'jkljkljkljj')
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 403);
				assert.deepPropertyVal(res.body, 'status', 'Forbidden')
				done();
			});
	})
})