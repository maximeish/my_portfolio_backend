import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const Post = require('../models/posts');

dotEnv.config();

export const getPosts = (req, res) => {
    const { usertoken } = req.headers;

    if(usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err)
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You need to provide a valid token"
                });

            if (authUser.role !== process.env.ADMIN_USER_ROLE) 
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to view this page"
                });

            if (authUser.role === process.env.ADMIN_USER_ROLE) {
                Post.find({}, (err, docs) => {
                    if (err) {
                        return res.status(500).json({
                            Error: err
                        })
                    }

                    if (docs.length > 0) {
                        return res.status(200).json({
                            status: "Success",
                            postsCount: docs.length,
                            posts: docs
                        })
                    } else {
                        return res.status(200).json({
                            status: "Success",
                            message: "No posts available"
                        })
                    }
                });
            }
        })
    } else {
        return res.status(403).json({
            status: "Unauthorized",
            message: "You need to provide an admin token"
        })
    }
}

export const addPost = (req, res) => {
    const { usertoken } = req.headers;
    const { title, body, author } = req.body;
    if (usertoken && title && body && author) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You need to provide a valid token"
                });
            }

            if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === process.env.ADMIN_USER_ROLE) {
                const post = new Post({
                    _id: new mongoose.Types.ObjectId(),
                    title,
                    body,
                    author,
                    date_posted: new Date()
                });

                post.save()
                    .then(result => {
                        return res.status(200).json({
                            status: "Post successfully created",
                            message: result
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            Error: err
                        })
                    })
            };
        });
    }

    else res.status(400).json({
        status: 'Bad Request',
        message: 'Please, provide all details (usertoken, title, body, author)'
    });
}

export const deletePost = (req, res) => {
    const { usertoken } = req.headers;
    const { postid } = req.body;
    
    if (usertoken && postid) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You need to supply a valid token"
                });
            }

            if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === process.env.ADMIN_USER_ROLE) {
                Post.deleteOne({ _id: postid })
                    .exec()
                    .then(result => {
                        return res.status(200).json({
                            status: "Post successfully deleted",
                            message: result
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            Error: err
                        })
                    })
            }
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Supply the usertoken and post id'
    });
}

export const updatePost = (req, res) => {
    const { usertoken } = req.headers;
    const { postid, title, body, author } = req.body;
    if (usertoken && postid && (title || body || author)) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to perform this operation due to invalid token"
                });
            };

            if (authUser.role !== process.env.ADMIN_USER_ROLE) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === process.env.ADMIN_USER_ROLE) {
                Post.findById({ _id: postid })
                    .exec()
                    .then(post => {
                        if (post) {
                            title = title || post.title;
                            body = body || post.body;
                            author = author || post.author;
                            
                            Post.update({ _id: postid }, { $set: { title, body, author } })
                                .exec()
                                .then(result => {
                                    return res.status(200).json({
                                        status: "Post updated successfully",
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
                                message: "Cannot find the post with the provided id"
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            Error: err
                        })
                    })
            }
        });
    } else res.status(400).json({
        status: 'Bad Request',
        message: 'You must provide the usertoken and postid and update at least one field: title, body, or author'
    });
}