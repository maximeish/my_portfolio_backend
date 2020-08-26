import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import userData from '../models/user-data.json';

dotEnv.config();

export const login = (req, res) => {
    // Assign each user a unique id
    let users = [];
    req.auth = false;
    let unHashedPassword = '';
    let isLoggedin = false;

    for (let user of userData) {
        users.push(user);
    }

    let { email, password } = req.headers;
    
    if (email && password) {
        for (let user of users) {
            unHashedPassword = jwt.verify(user.password, process.env.SECRET_KEY);
            if (email === user.email && password === unHashedPassword) {
                if (user.role === process.env.NORMAL_USER_ROLE) {
                    isLoggedin = true;
                    jwt.sign({ username: user.username, email, password, role: user.role }, process.env.SECRET_KEY, (err, token) => {
                        if(token) {
                            req.auth = true;
                            req.token = token;
                            return res.status(200).json({ 
                                status: "Success",
                                userRole: process.env.NORMAL_USER_ROLE,
                                token 
                            });
                        }
                        
                        if(err)
                            return res.status(501).json({
                                status: 'Internal Server Error',
                                message: 'Unable to login. Please try again'
                            });
                    })
                }

                if (user.role === process.env.ADMIN_USER_ROLE) {
                    isLoggedin = true;
                    jwt.sign({ username: user.username, email, password, role: user.role }, process.env.SECRET_KEY, (err, token) => {
                        if(token) {
                            req.auth = true;
                            req.token = token;
                            return res.status(200).json({ 
                                status: "Success",
                                userRole: process.env.ADMIN_USER_ROLE,
                                token 
                            });
                        }
                        
                        if(err)
                            return res.status(501).json({
                                status: 'Internal Server Error',
                                message: 'Unable to login. Please try again'
                            });
                    })
                }
            }
        }
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to supply the email and password'
        })
    }
    
    if(!isLoggedin) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Unable to find user with the provided email / password combination'
        });
    }
}