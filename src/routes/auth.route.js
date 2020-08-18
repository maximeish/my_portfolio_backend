import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';

dotEnv.config();
const route = express.Router();

route.post('/signup', async(req, res) => {
    // const { username, email, password } = req.query;
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    try {
        const token = jwt.sign(
                    { username, email, password },
                    process.env.SECRET_KEY,
                    { algorithm: 'RS256' });
        res.status(200).send(token);
    } catch (err) {
        // res.send('Cannot sign up, bad request');
        res.json(req.body)
    }
});


// route.post('/login', (req, res, next) => {

// });

export default route;
