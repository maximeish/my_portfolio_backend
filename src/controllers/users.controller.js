import userData from '../models/user-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

// Assign each user a unique id

let users = [];

for (let user of userData) {
    users.push(user);
}

export const getUsers = (req, res) => {
    const { usertoken } = req.headers;
    
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
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
                    return res.status(200).json({
                        status: "Success",
                        usersCount: users.length,
                        users
                    });
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

    const { usertoken, admintoken } = req.headers;
    
    if (admintoken) {
        jwt.verify(admintoken, process.env.SECRET_KEY, (err, authUser) => {
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
                    console.log('admin token legit', authUser);
                    if (usertoken) {
                        jwt.verify(usertoken, process.env.SECRET_KEY, (err, userData) => {
                            if (err) {
                                return res.status(403).json({
                                    status: "Unauthorized",
                                    message: "You are not allowed to use this feature due to invalid token"
                                });
                            }

                            if (userData) {
                                console.log('user token legit', userData)
                                for (let user of users) {
                                    if(user.id === userData.id) {
                                        console.log('we found em')
                                        return res.status(200).json({
                                            status: "Success",
                                            user
                                        });
                                        
                                        reqUser = true;

                                        break;
                                    };  
                                }             
                            };
                        });
                        
                        if (!reqUser) 
                            return res.status(404).json({
                                status: "Not Found",
                                message: "User with the provided id not found"
                            });
                    } else {
                        return res.status(400).json({
                            status: "Bad Request",
                            message: "You need to provide a user token"
                        });
                    };
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

export const deleteUser = (req, res) => {
    let deleted = false;

    const { usertoken, admintoken } = req.headers;
    
    if (admintoken) {
        jwt.verify(admintoken, process.env.SECRET_KEY, (err, authUser) => {
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
                    if (usertoken) {
                        jwt.verify(usertoken, process.env.SECRET_KEY, (err, userData) => {
                            if (err) {
                                return res.status(403).json({
                                    status: "Unauthorized",
                                    message: "You are not allowed to use this feature due to invalid token"
                                });
                            }

                            if (userData) {

                                for (let [index, user] of users) {
                                    if (user.id === userData.id) {
                                        users.splice(index, 1);
                                        
                                        deleted = true;
                                        
                                        return res.status(200).json({
                                            status: "Success",
                                            message: "User successfully deleted",
                                            usersCount: users.length,
                                            users
                                        });

                                        break;
                                    }    
                                }
                                
                                if (!deleted) res.status(404).json({
                                    status: "Not Found",
                                    message: "User with the provided id not found"
                                });
                            };
                        });
                    } else {
                        return res.status(400).json({
                            status: "Bad Request",
                            message: "You need to provide a user token"
                        });
                    };
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
}

export const updateUser = (req, res) => {
    let updated = false;
    const {usertoken, admintoken, username, email, password} = req.headers;
    if (admintoken) {
        jwt.verify(admintoken, process.env.SECRET_KEY, (err, authUser) => {
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
                    if (usertoken) {
                        if (username || email || password) {
                            jwt.verify(usertoken, process.env.SECRET_KEY, (err, userData) => {
                                if (err) {
                                    return res.status(404).json({
                                        status: "Not Found",
                                        message: "User with the provided token not found"
                                    });
                                }

                                if (userData) {
                                    for (let [index, user] of users) {
                                        if (user.id === userData.id) {
                                            users[index].username = username || user.username;   
                                            users[index].email = email || user.email;   
                                            if (password) {
                                                jwt.sign(password, process.env.SECRET_KEY, (err, token) => {
                                                    if (err) {
                                                        return res.status(501).json({
                                                            status: "Internal Server Error",
                                                            message: "Cannot update user password"
                                                        });
                                                    }

                                                    if (token) {
                                                        users[index].password = token || user.password;   
                                                    }
                                                });
                                            };

                                            updated = true;

                                            return res.status(200).json({
                                                status: "Success",
                                                message: "User updated successfully",
                                                usersCount: users.length,
                                                users
                                            });

                                            break;
                                        }
                                    }

                                    if (!updated) {
                                        return res.status(404).json({
                                            status: "User Not Found",
                                            message: "Cannot find the user with the provided token"
                                        });
                                    }
                                }
                            });


                        } else {
                            return res.status(400).json({
                                status: "Bad Request",
                                message: "Please update either one of these (username, email, password) or all of them"
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: "Bad Request",
                            message: "Please provide the usertoken"
                        });
                    }
                }
            }
        });
    }
}