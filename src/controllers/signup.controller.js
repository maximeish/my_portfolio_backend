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
    const dateJoined = new Date();
    if (username && email && password && role) {
        if (role === process.env.NORMAL_USER_ROLE || role === process.env.ADMIN_USER_ROLE) {

            //Hash the password
            password = jwt.sign(password, process.env.SECRET_KEY);
            let usersCount = users.length;
            
            jwt.sign({ id: usersCount + 1, username, email, password, role, date_joined: dateJoined }, process.env.SECRET_KEY, (err, token) => {
                if(token) {
                    users.push({ id: usersCount + 1, userToken: token, ...{ username, email, password, role, date_joined: dateJoined } });
                    res.status(200).json({
                        message: 'Sign up successful',
                        userRole: role,
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
                message: 'Invalid user role'
            });
        }
    }

    else res.status(400).json({
        status: 'Bad Request',
        message: 'Please, provide all details for a user (username, email, password, role)'
    });
}