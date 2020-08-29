import postData from '../models/post-data.json';
import jwt from 'jsonwebtoken';
// import getTokenAsFunc from '../middlewares/getTokenAsFunc';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const Post = require('../models/posts');


dotEnv.config();


export const displayPreviews = (req, res) => {
    let postsLimit = 3;

    let previewPosts = [];

    Post.find()
        .sort({ _id: -1 })
        .limit(postsLimit)
        .exec((err, previewPosts) => {
            if (err) {
                return res.status(500).json({
                    status: "Server Error",
                    message: "Cannot fetch the posts from the database"
                })
            }

            if (previewPosts.length !== 0) {
                jwt.verify(req.token, process.env.SECRET_KEY, (err, authUser) => {
                    if (err) {
                        return res.status(200).json({
                            status: 'Success - user not logged in',
                            role: process.env.GUEST_USER_ROLE,
                            userToken: null,
                            previewPosts
                        });
                    }

                    if (authUser.role === process.env.ADMIN_USER_ROLE) {
                        return res.status(200).json({
                            status: 'Success',
                            role: process.env.ADMIN_USER_ROLE,
                            userToken: req.token || null,
                            previewPosts
                        });
                    }

                    if (authUser.role === process.env.NORMAL_USER_ROLE) {
                        return res.status(200).json({
                            status: 'Success',
                            role: process.env.NORMAL_USER_ROLE,
                            userToken: req.token || null,
                            previewPosts
                        });
                    }
                });
            } else {
                return res.status(200).json({
                    status: "Success",
                    message: "No documents found in the database"
                });
            }
        })
}


export const getPostById = (req, res) => {    
    let { usertoken } = req.headers, postAvailable = false;
    let { postid } = req.body;

    if (postid) {
        Post.findById(postid)
            .exec()
            .then(doc => {
                if (doc) {
                    if (usertoken) {
                        // User may be logged in
                        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
                            if (err) {
                                // Got an invalid user token
                                // User is not logged in
                                return res.status(200).json({
                                    status: 'Success - Post Found - User NOT logged in',
                                    userToken: null,
                                    userRole: process.env.GUEST_USER_ROLE,
                                    post: doc
                                });
                            }

                            if (authUser) {
                                // User is logged in
                                if (authUser.role === process.env.NORMAL_USER_ROLE) {             
                                    return res.status(200).json({
                                        status: 'Success - User logged in',
                                        userToken: usertoken,
                                        userRole: process.env.NORMAL_USER_ROLE,
                                        post: doc
                                    });
                                }

                                if (authUser.role === process.env.ADMIN_USER_ROLE) {                     
                                    return res.status(200).json({
                                        status: 'Success - Admin user logged in',
                                        userToken: usertoken,
                                        userRole: process.env.ADMIN_USER_ROLE,
                                        post: doc
                                    });
                                }
                            }
                        });
                    } else {
                        // No usertoken
                        // User is not logged in
                        return res.status(200).json({
                            status: 'Success - Post Found - User NOT logged in',
                            userToken: null,
                            userRole: process.env.GUEST_USER_ROLE,
                            post: doc
                        });
                    }
                } else {
                    return res.status(404).json({
                        status: "Not Found",
                        message: "Cannot find a post with the provided ID"
                    });
                }
            })
            .catch(err => {
                return res.status(500).json({
                    status: "Server Error",
                    Error: err
                });
            })
    } else {
        // Did not supply a post id
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to supply a post ID'
        });
    };
};