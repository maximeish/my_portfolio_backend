import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';
import { login } from '../controllers/login.controller';
import { signup } from '../controllers/signup.controller';

dotEnv.config();

const route = express.Router();

const verifyToken = (req, res, next) => {
    //get the auth token from the header
    let bearerToken;
    if(req.headers['authorization']) {
        //Set the bearer token to req and call next() to pass a modified req
        bearerToken = req.headers['authorization'].split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else res.sendStatus(403);
}

route.post('/signup', async(req, res) => signup(req, res));

route.post('/login', async(req, res, next) => login(req, res, next));

route.post('/admin', verifyToken, (req, res, next) => {
    try {
        jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
            if (err) res.sendStatus(403);
            else 
                res.status(200).json({
                    message: 'Welcome admin',
                    authData
                });
        });
    } catch (err) {
        res.json({
            status: err.status,
            message: err.message
        })
    }
});


export default route;
