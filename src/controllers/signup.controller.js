import userData from '../models/user-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const User = require('../models/users');

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

        if (role === process.env.NORMAL_USER_ROLE || role === process.env.ADMIN_USER_ROLE) {

            const uniqId = new mongoose.Types.ObjectId();
            const dateJoined = new Date();

            //Hash the password
            password = jwt.sign(password, process.env.SECRET_KEY);
            
            jwt.sign({ _id: uniqId, username, email, password, role, date_joined: dateJoined }, process.env.SECRET_KEY, (err, token) => {
                if(token) {
                    //Create an instance of User model
                    const user = new User({
                        _id: uniqId,
                        userToken: token,
                        username,
                        email,
                        password,
                        role,
                        date_joined: dateJoined 
                    });


                    //Save the user data to the database
                    user.save()
                        .then(result => {
                            req.token = result.userToken;

                            return res.status(200).json({
                                message: "Sign up successful",
                                userToken: result.userToken,
                                userRole: result.role
                            });
                        })
                        .catch(err => {
                            return res.status(501).json({
                                err
                            });
                        }); 
                }
                if (err) {
                    return res.status(501).json({
                        status: 'Server Error',
                        message: "Failed. Please sign up again"
                    })
                }
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