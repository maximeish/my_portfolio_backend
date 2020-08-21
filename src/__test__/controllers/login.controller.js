import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import userData from '../models/user-data.json';
import uniqid from 'uniqid';

dotEnv.config();

export const login = (req, res) => {
    // Assign each user a unique id
    let users = [];
    req.auth = false;

    for (let user of userData) {
        user = { id: uniqid('userid-'), ...user };
        users.push(user);
    }

    const { email, password } = req.headers;
    if (email && password) {
        for (let user of users) {
            if (email === user.email && password === user.password) {
                req.auth = true;
                try {
                    jwt.sign({ username: user.username, email, password }, process.env.SECRET_KEY, (err, token) => {
                        if(token) {
                            req.auth = true;
                            res.status(200).json({ token });
                            req.token = token;
                            next();
                        }
                        else if(err)
                            res.status(err.status).json({
                                status: err.status,
                                message: err.message
                            })
                        else
                            res.status(501).json({
                                status: 501,
                                message: "Unknown error"
                            });
                    })
                } catch (err) {
                    res.json({
                        status: err.status,
                        message: err.message
                    })
                }
            }
        }
    } else {
        res.status(400).json({
            status: 400,
            message: 'You need to supply the email and password'
        })
    }
    console.log(req.auth)
    if(!req.auth) {
        res.status(401).json({
            status: 401,
            message: 'Unable to find user with the provided email / password combination'
        });
    }
}