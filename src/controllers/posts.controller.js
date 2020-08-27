// import postData from '../models/post-data.json';
// import userData from '../models/user-data.json';
// import postCommentsData from '../models/comment-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const Post = require('../models/posts');

dotEnv.config();

// let posts = [], users = [];

// // Sign and save each post token and add comments to each post
// for (let post of postData) {
//     jwt.sign(post, process.env.SECRET_KEY, (err, token) => {
//         if (err)
//             return res.status(501).json({
//                 status: 'Internal Server Error',
//                 message: 'Cannot generate token for each post'
//             });
//         if (token) {
//             post = {postToken: token, ...post};
//             posts.push(post);
//         }
//     });

//     //Find the comments with a matching id of each post 
//     //and add them to the post's comment count
//     posts.map(post => {
//         postCommentsData.forEach(comment => {
//             if (post.id === comment.postid) {
//                 post.comments += 1;
//             };
//         });
//     });
// }

// Sign and save each user token
// for (let user of userData) {
//     jwt.sign(user, process.env.SECRET_KEY, (err, token) => {
//         if (err)
//             return res.status(501).json({
//                 status: 'Internal Server Error',
//                 message: 'Cannot generate token for each user'
//             });
//         if (token) {
//             user = {userToken: token, ...user};
//             users.push(user);
//         }
//     });
// }

export const getPosts = (req, res) => {
    const { usertoken } = req.headers;

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
}

export const addPost = (req, res) => {
    const { usertoken } = req.headers;
    const { title, body } = req.body;
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
    let deleted = false;
    const {usertoken} = req.headers;
    const {postid} = req.body;
    
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
                let index = 0;
                for (let post of posts) {
                    if (post.id === postid) {
                        posts.splice(index, 1);
                        deleted = true;
                        return res.status(200).json({
                            status: "Success",
                            message: "Post successfully deleted"
                        });

                        break;
                    }
                    ++index;
                };
            }
        });
        
        if (!deleted) 
            return res.status(404).json({
            status: "Not Found",
            message: 'Post with the provided id not found'
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Supply the usertoken and post id'
    });
}

export const updatePost = (req, res) => {
    let updated = false;
    const {usertoken} = req.headers;
    const {postid, title, body} = req.body;
    if (usertoken && postid && (title || body)) {
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
                let index = 0;
                for (let post of posts) {
                    if (post.id === postid) {
                        posts[index].title = title || post.title;
                        posts[index].body = body || post.body;

                        return res.status(200).json({
                            status: "Success",
                            message: "Post updated successfully"
                        });

                        break;
                    }
                    ++index;
                }
            }
        });
    } else res.status(400).json({
        status: 'Bad Request',
        message: 'You must provide the usertoken and postid and update at least one field: title or body'
    });
}