import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const User = require('../models/users');

dotEnv.config();


export const signup = (req, res) => {
    let emails = [];
    let usernames = [];
    //Get provided values then sign user up
    let { username, email, password, role, subscribed } = req.body;
    if (username && email && password && role && subscribed) {
        if (!(subscribed === 'yes' || subscribed === 'no')) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Subscribed should be yes or no"
            })
        }

        if (role === process.env.NORMAL_USER_ROLE || role === process.env.ADMIN_USER_ROLE) {
            const uniqId = new mongoose.Types.ObjectId();
            const dateJoined = new Date();

            //Hash the password
            password = jwt.sign(password, process.env.SECRET_KEY);
            
            jwt.sign({ _id: uniqId, username, email, password, role, subscribed, date_joined: dateJoined }, process.env.SECRET_KEY, (err, token) => {
                if(token) {
                    //Create an instance of User model
                    const newUser = new User({
                        _id: uniqId,
                        userToken: token,
                        username,
                        email,
                        password,
                        role,
                        subscribed,
                        date_joined: dateJoined 
                    });


                    //Check if there are no users with the same email and 
                    // username the Save the user data to the database
                    User.find({})
                        .exec()
                        .then(async users => {
                            if (users.length > 0) {
                                for (let user of users) {
                                    emails.push(user.email);
                                    usernames.push(user.username);
                                }

                                if (!emails.includes(email)) {
                                    if (!usernames.includes(username)) {
                                        const saveUser =  newUser.save()
                                            
                                            saveUser.then(result => {
                                                return res.status(200).json({
                                                    message: "Sign up successful",
                                                    userToken: result.userToken,
                                                    userRole: result.role,
                                                    userId: result._id
                                                });
                                            })
                                            .catch(err => {
                                                return res.status(500).json({

                                                    Error: err
                                                });
                                            })
                                    } else {
                                        return res.status(409).json({
                                            status: "Username taken",
                                            message: "This username is already taken. Try choosing another one"
                                        })
                                    }
                                } else {
                                    return res.status(409).json({
                                        status: "Email taken",
                                        message: "This email is already taken. Try choosing another one"
                                    })
                                }

                            } else {
                                const saveUser = newUser.save();
                                    saveUser.then(result => {
                                        return res.status(200).json({
                                            message: "Sign up successful",
                                            userToken: result.userToken,
                                            userRole: result.role
                                        });
                                    })
                                    .catch(err => {
                                        return res.status(500).json({
                                            status: "caught from newUser.save()",
                                            Error: err
                                        });
                                    }); 
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                status: "caught from User.find({})",
                                Error: err
                            })
                        })
                }
                
                if (err) {
                    return res.status(500).json({
                        status: 'Server Error',
                        message: "Failed. Please sign up again"
                    })
                }
            });
        } else {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'Invalid role. Should be admin or user'
            });
        }
    }

    else return res.status(400).json({
        status: 'Bad Request',
        message: 'Please, provide all details for a user (username, email, password, role) and make sure subscribed is yes or no'
    });
}