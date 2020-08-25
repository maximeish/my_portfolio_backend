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
            console.log('this was hashed', unHashedPassword)
            if (email === user.email && password === unHashedPassword) {
                if (user.role === 'user') {
                    isLoggedin = true;
                    jwt.sign({ username: user.username, email, password, role: user.role }, process.env.SECRET_KEY, (err, token) => {
                        if(token) {
                            console.log('you are logged in here is your token', token)
                            req.auth = true;
                            req.token = token;
                            return res.status(200).json({ 
                                status: "Success",
                                userRole: 'user',
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

                if (user.role === 'admin') {
                    isLoggedin = true;
                    jwt.sign({ username: user.username, email, password, role: user.role }, process.env.SECRET_KEY, (err, token) => {
                        if(token) {
                            req.auth = true;
                            req.token = token;
                            return res.status(200).json({ 
                                status: "Success",
                                userRole: 'admin',
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
    
    console.log('isLoggedin is ', isLoggedin)
    if(!isLoggedin) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Unable to find user with the provided email / password combination'
        });
    }
}