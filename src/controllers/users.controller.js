import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const User = require('../models/users');


dotEnv.config();

export const getUsers = (req, res) => {
    const { usertoken } = req.headers;
    
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Forbidden",
                    message: "You are not allowed to use this feature due to invalid token"
                });
            };

            if (authUser) {
                if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                    return res.status(403).json({
                        status: "Unauthorized",
                        message: "You are not allowed to use this feature"
                    });
                };

                if (authUser.role === process.env.ADMIN_USER_ROLE) {
                    User.find({})
                        .exec()
                        .then(users => {
                            if (users.length > 0) {
                                return res.status(200).json({
                                    status: "Success",
                                    usersCount: users.length,
                                    users
                                })
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
                };
            };
        });
    }

    else {
        return res.status(403).json({
            status: "Unauthorized",
            message: "You are not allowed to use this feature"
        });
    };
};

export const getUserById = (req, res) => {
    let reqUser = false;

    const { usertoken } = req.headers;
    const { userid } = req.body;
    
    if (usertoken && userid) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature due to invalid token"
                });
            }

            if (authUser) {
                if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                    return res.status(403).json({
                        status: "Unauthorized",
                        message: "You are not allowed to use this feature"
                    });
                }

                if (authUser.role === process.env.ADMIN_USER_ROLE) {
                    User.findById(userid)
                        .then(doc => {
                            if (doc) {
                                return res.status(200).json({
                                    status: "Success",
                                    user: doc
                                });
                            } else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Cannot find a user with that token"
                                });
                            };
                        })
                        .catch(err => {
                            return res.status(500).json({
                                Error: err
                            });
                        });
                };
            };
        });
    }

    else {
        return res.status(400).json({
            status: "Bad Request",
            message: "You need to provided a usertoken and userid"
        });
    };
};

export const deleteUser = (req, res) => {
    let deleted = false;

    const { usertoken } = req.headers;
    const { userid } = req.body;
    
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature due to invalid token"
                });
            }

            if (authUser) {
                if (authUser.role === process.env.NORMAL_USER_ROLE) {
                    console.log(authUser)
                    User.findById(authUser._id)
                        .exec()
                        .then(user => {
                            if (user) {
                                if (authUser._id === user._id) {
                                    User.deleteOne({ _id: user._id })
                                        .exec()
                                        .then(result => {
                                            return res.status(200).json({
                                                status: "user successfully deleted",
                                                message: result
                                            })
                                        })
                                        .catch(err => {
                                            return res.status(500).json({
                                                Error: err
                                            })
                                        })
                                } else {
                                    return res.status(403).json({
                                        status: "Unauthorized",
                                        message: "You are not authorized to delete this user"
                                    })
                                }
                            } else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Cannot find a user with the provided id"
                                })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                Error: err
                            })
                        })
                }

                if (authUser.role === process.env.ADMIN_USER_ROLE) {
                    if (userid) {
                        User.deleteOne({ _id: userid })
                            .exec()
                            .then(result => {
                                return res.status(200).json({
                                    status: "user successfully deleted",
                                    message: result
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
                            message: "You need to specify the userid"
                        })
                    }
                };
            };
        });
    }

    else {
        return res.status(400).json({
            status: "Bad Request",
            message: "You need to provide the usertoken"
        });
    };
}

export const updateUser = (req, res) => {
    const {usertoken} = req.headers;
    let {username, email, password, role, subscribed} = req.body
    if (usertoken && (username || email || password || role || subscribed)) {
        if (subscribed !== undefined) {
            if (!(subscribed === 'yes' || subscribed === 'no')) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "subscribed should be yes or no"
                })
            }
        }

        if (role !== undefined) {
            if (!(role === 'admin' || role === 'user')) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "role should be admin or user"
                })
            }
        }

        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature due to invalid token"
                });
            }

            if (authUser) {
                let userid = authUser._id;
                if (authUser.role === process.env.NORMAL_USER_ROLE) {
                    User.find({_id: userid}, (err, user) => {
                        if (err) {
                            return res.status(500).json({
                                Error: err
                            })
                        }

                        if (user) {
                            if (user[0].username === authUser.username) {
                                if (password) {
                                    password = jwt.sign(password, process.env.SECRET_KEY)
                                }

                                email = email || user[0].email;
                                password = password || user[0].password
                                subscribed = subscribed || user[0].subscribed;
                                const userToken = jwt.sign({ _id: user[0]._id, username: user[0].username, email, password, role: user[0].role, subscribed, date_joined: user[0].date_joined }, process.env.SECRET_KEY);

                                User.updateOne({ _id: userid }, { $set: { userToken, email, password, subscribed } })
                                    .exec()
                                    .then(result => {
                                        return res.status(200).json({
                                            status: "user data successfully updated",
                                            message: result
                                        })
                                    })
                                    .catch(err => {
                                        return res.status(500).json({
                                            Error: err
                                        })
                                    })

                            } else {
                                return res.status(403).json({
                                    status: "Unauthorized",
                                    message: "You are not allowed to change this user's data"
                                })
                            }
                        } else {
                            return res.status(404).json({
                                status: "Not Found",
                                message: "Cannot find the user with the provided id"
                            })
                        }
                    })
                }

                if (authUser.role === process.env.ADMIN_USER_ROLE) {
                    User.find({_id: userid}, (err, user) => {
                        if (err) {
                            return res.status(500).json({
                                Error: err
                            })
                        }

                        if (user) {
                            if (password) {
                                password = jwt.sign(password, process.env.SECRET_KEY)
                            }

                            username = username || user[0].username;
                            email = email || user[0].email;
                            password = password || user[0].password
                            role = role || user[0].role;
                            subscribed = subscribed || user[0].subscribed;

                            User.updateOne({ _id: userid }, { $set: { username, email, password, role, subscribed } })
                                .exec()
                                .then(result => {
                                    return res.status(200).json({
                                        status: "user data successfully updated",
                                        message: result
                                    })
                                })
                                .catch(err => {
                                    return res.status(500).json({
                                        Error: err
                                    })
                                })
                        } else {
                            return res.status(404).json({
                                status: "Not Found",
                                message: "Cannot find a user with the provided id"
                            })
                        }
                    })
                }
            }
        });
    } else {
        return res.status(400).json({
            status: "Bad Request",
            message: "Please provide a usertoken, and update at least one of these: (username, email, password, role) and make sure subscribed (if provided) is yes or no"
        });
    }
}