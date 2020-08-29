import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const User = require('../models/users');

dotEnv.config();

export const login = (req, res) => {
    let userFound = false;

    let { email, password } = req.body;
    
    if (email && password) {
        User.find({})
            .exec()
            .then(users => {
                if (users.length > 0) {
                    console.log(users)
                    for (let [index, user] of users.entries()) {
                        console.log(user.password)
                        jwt.verify(user.password, process.env.SECRET_KEY, (err, unHashedPassword) => {
                            if (email === user.email && password === unHashedPassword) {
                                userFound = true;
                                return res.status(200).json({
                                    status: "Login successful",
                                    userRole: user.role,
                                    userToken: user.userToken
                                })
                            }
                        })
                        if (userFound) break;
                    }

                    if (!userFound) {
                        return res.status(404).json({
                            status: "User not found",
                            message: "Cannot find a user with the provided email / password combination"
                        })
                    }

                } else {
                    return res.status(200).json({
                        status: "Success",
                        message: "No users found"
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    Error: err
                })
            })
    }
}