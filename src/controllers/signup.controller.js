import userData from '../models/user-data.json';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

// Assign each user a unique id

let users = [];

for (let user of userData) {
    users.push(user);
}

export const signup = (req, res) => {
    //Get provided values then sign user up
    let { username, email, password, role } = req.headers;
    if (username && email && password && role) {
        if (role === 'user' || role === 'admin') {

            //Encrypt the password
            password = jwt.sign(password, process.env.SECRET_KEY);
            let usersCount = users.length;
            
            jwt.sign({ id: usersCount + 1, username, email, password, role, date_joined: new Date() }, process.env.SECRET_KEY, (err, token) => {
                if(token) {
                    users.push({ id: usersCount + 1, userToken: token, ...{ username, email, password, role, date_joined: new Date() } });
                    res.status(200).json({
                        message: 'Sign up successful',
                        token 
                    });
                    
                    req.token = token;
                }
                else if (err)
                    res.status(400).json({
                        status: 'Bad Request',
                        message: err.message
                    })
                else 
                    res.status(501).json({
                        status: 'Server Error',
                        message: "Unknown error"
                    });
            });
        } else {
            res.status(400).json({
                status: 'Bad Request',
                message: 'The user role should be either "user" or "admin"'
            });
        }
    }

    else res.status(400).json({
        status: 'Bad Request',
        message: 'Please, provide all details for a user (username, email, password, role)'
    });
}