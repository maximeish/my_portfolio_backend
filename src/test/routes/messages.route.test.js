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
	sampleMessageid: null
}

describe("Tests to API Contact form routes from both contact page and admin page", () => {
	it("(200 Success) GET to /getMessages to get all messages with admin token", done => {
		chai.request(server)
			.post('/login')
			.send({
				email: adminUser_Email,
				password: adminUser_Pass
			})
			.end((err, res) => {
				if (err) done(err);
				tokens.adminToken = res.body.userToken;
				//GET to /messages after getting admin token
				chai.request(server)
					.get('/getMessages')
					.set('usertoken', tokens.adminToken)
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 200);
						assert.deepPropertyVal(res.body, 'status', 'Success');
						done();
					})
			});
	});

	it("(200 Success) POST to /addMessage to send a message (name, email, telephone, message) through the contact form (logged in or not)", done => {
		chai.request(server)
			.post('/addMessage')
			.send({
				name: 'Dr. John Doe La-Flamme',
				email: 'j.doe@example.com',
				telephone: '3498394394',
				message: 'Hello sdfj'
			})
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 200);
				assert.deepPropertyVal(res.body, 'status', 'Message saved successfully')
				tokens.sampleMessageid = res.body.result._id;
				done();
			});
	});

	it("(400 Bad Request) POST to /addMessage to send a badly formatted name in the message (name, email, telephone, message) through the contact form (logged in or not)", done => {
		chai.request(server)
			.post('/addMessage')
			.send({
				name: 'Dr. John Doe La-Flamme 234',
				email: 'j.doe@example.com',
				telephone: '3498394394',
				message: 'Hello sdfj'
			})
			.end((err, res) => {
				if (err) done(err);
				assert.equal(res.status, 400);
				assert.deepPropertyVal(res.body, 'message', 'The name cannot contain numbers. And also no more than one space is allowed between the names')
				done();
			});
	});

	it("(200 Success) DELETE to /deleteMessage to delete a message as admin user (admin token, messageid) through the admin page", done => {
		//get admin token by login
	    chai.request(server)
            .post('/login')
            .send({
                email: adminUser_Email,
                password: adminUser_Pass
            })
            .end((err, res) => {
                if (err) done(err);
				chai.request(server)
					.delete('/deleteMessage')
					.set('usertoken', res.body.userToken)
					.send({
						messageid: tokens.sampleMessageid
					})
					.end((err, res) => {
						if (err) done(err);
						assert.equal(res.status, 200);
						assert.deepPropertyVal(res.body, 'status', 'Message successfully deleted')
						done();
					});
			});
    })
})