import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const Message = require('../models/messages');

dotEnv.config();

export const getMessages = (req, res) => {
    const { usertoken } = req.headers;
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "Cannot get messages due to invalid user token"
                });
            };

            if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not authorized to use this feature"
                });
            };

            if (authUser.role === process.env.ADMIN_USER_ROLE) {
                Message.find({}, (err, messages) => {
                    if (err) {
                        return res.status(500).json({
                            Error: err
                        })
                    }

                    if (messages.length > 0) {
                        return res.status(200).json({
                            status: "Success",
                            messagesCount: messages.length,
                            messages
                        })
                    } else {
                        return res.status(200).json({
                            status: "Success",
                            message: "No messages found"
                        })
                    }
                })
            };
        });
    } else {
        return res.status(400).json({
            status: "Bad Request",
            message: "You need to supply a user token"
        });
    };
}


export const addMessage = (req, res) => {
    let { name, email, telephone, message } = req.body;
    if (name && message && (email || telephone)) {
        let onlyLettersRegexp = /^[A-Za-z .\-]+$/ig;
        
        if (Boolean(name.match(onlyLettersRegexp))) {
            email = email || null;
            telephone = telephone || null;
            const message = new Message({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                telephone,
                message,
                date_sent: new Date()
            });

            message
                .save()
                .then(result => {
                    return res.status(200).json({
                        status: "Message saved successfully",
                        result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        Error: err
                    })
                })
        } else {
            return res.status(400).json({
                status: "Bad Request",
                message: "The name cannot contain numbers. And also no more than one space is allowed between the names"
            })
        }
    }
    else 
        return res.status(400).json({
            status: 400,
            message: 'Please, provide the name, message and at least an email or telephone'
        });
}

export const deleteMessage = (req, res) => {
    const {usertoken} = req.headers;
    const {messageid} = req.body;

    if (usertoken && messageid) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "Unable to delete the message due to invalid usertoken"
                })
            }

            if (authUser) {
                if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                    return res.status(403).json({
                        status: "Unauthorized",
                        message: "You are not allowed to use this feature"
                    })
                }

                if (authUser.role === process.env.ADMIN_USER_ROLE) {
                    Message.deleteOne({ _id: messageid })
                        .exec()
                        .then(result => {
                            if (result.deletedCount > 0) {
                                return res.status(200).json({
                                    status: "Message successfully deleted",
                                    message: result
                                });
                            } else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Cannot find a message with the provided id"
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
        })
    } else {
        return res.status(400).json({
            status: "Bad Request",
            message: "You need to provide a usertoken and messageid"
        })
    }
}