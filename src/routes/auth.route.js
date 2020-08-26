import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';
import { login } from '../controllers/login.controller';
import { signup } from '../controllers/signup.controller';
import { getToken } from '../middlewares/getToken';

dotEnv.config();

const route = express.Router();


route.post('/signup', async(req, res) => signup(req, res));

route.post('/login', (req, res) => login(req, res));

route.get('/admin', getToken, (req, res) => {
    //check if user is admin or not
        
    let isAdmin = false;

    jwt.verify(req.token, process.env.SECRET_KEY, (err, authUser) => {
        if (err) 
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this page"
            }) 
        else if (authUser.role !== 'admin')
            res.status(403).json({
                message: "You are not allowed to view this page",
                authUser
            });
        else
            res.status(200).json({
                status: 'Success',
                message: 'Welcome admin'
            });
    });
});


export default route;
