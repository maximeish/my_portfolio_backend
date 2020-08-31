import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
const Post = require('../models/posts');

dotEnv.config();


export const addComment = (req, res) => {
    const { usertoken } = req.headers;
    const { postid, comment_text } = req.body;
    
    //check if post token is provided
    if (postid && usertoken && comment_text) {
        //check if user token is provided
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: 'Forbidden',
                    message: "You are not authorized to comment due to invalid usertoken"
                });
            }

            if (authUser) {
                //Save comment in the database
                Post.findById(postid)
                    .exec()
                    .then(post => {
                        if (post) {
                            Post.findByIdAndUpdate(
                                postid,
                                { 
                                     "$push":  {"comments":  {
                                        _id: new mongoose.Types.ObjectId(),
                                        username: authUser.username,
                                        user_comment: comment_text,
                                        date_posted: new Date(),
                                        likes: 0,
                                        users_liked: []
                                     }},
                                },
                                {"new": true, "upsert": true},
                                (err, doc) => {
                                    if (err) {
                                        return res.status(500).json({
                                            Error: err
                                        })
                                    }

                                    if (doc) {
                                        return res.status(200).json({
                                            status: "Comment added successfully",
                                            post: doc
                                        })
                                    }
                                }
                            );
                        } else {
                            return res.status(404).json({
                                status: "Not Found",
                                message: "Cannot find a post with the provided id"
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
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a postid, a usertoken, and comment_text'
        });
    };
};

export const deleteComment = (req, res) => {
    const { usertoken } = req.headers;
    const { postid, commentid } = req.body;
    
    //check if user token is provided
    if (postid && usertoken && commentid) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized to delete comment",
                    message: "You are not allowed to delete a comment due to invalid user token"
                });
            }

            if (authUser) {
                Post.findById(postid)
                    .exec()
                    .then(post => {
                        if (post) {
                            for (let [index, comment] of post.comments.entries()) {
                                if (comment._id.toString() === commentid.toString() && comment.username.toString() === authUser.username.toString()) {
                                    Post.findByIdAndUpdate(
                                        postid, { $pull: {"comments": {_id: commentid,  username: authUser.username} } },
                                        { safe: true, upsert: true },
                                        (err, result) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    Error: err
                                                })
                                            }

                                            return res.status(200).json({
                                                status: "comment successfully deleted",
                                                message: result
                                            })
                                        });

                                    break;
                                }
                            }
                        } else {
                            return res.status(404).json({
                                status: "Not Found",
                                message: "Post with the provided id not found"
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
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a user token, postid and commentid'
        });
    }
}

export const updateComment = (req, res) => {
    let updated = false;
    const { usertoken } = req.headers;
    const { postid, commentid, likes, comment_text } = req.body;
    //check if user token is provided
    if (usertoken && commentid && postid && (likes || comment_text)) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Forbidden",
                    message: "You are not allowed to update the comment due to invalid user token"
                });
            };

            if (authUser) {
                let currentLikes, currentLikedUsers = [];
                if (likes) {
                    Post.findById(postid)
                        .exec()
                        .then(post => {
                            if (post) {
                                let updated = false;
                                for(let [index, comment] of post.comments.entries()) {
                                    if (comment._id.toString() === commentid.toString()) {
                                        let currentLikes = post.comments[index].likes;
                                        let currentLikedUsers = post.comments[index].users_liked;
                                        if (!currentLikedUsers.includes(authUser.username)) {
                                            post.comments[index].likes += 1;
                                            post.comments[index].users_liked.push(authUser.username);
                                            post.save()
                                                .then(result => {
                                                    return res.status(200).json({
                                                        status: "Success. Likes (+1)",
                                                        message: result
                                                    })
                                                })
                                                .catch(err => {
                                                    return res.status(500).json({
                                                        Error: err
                                                    })
                                                })
                                        } else {
                                            post.comments[index].likes -= 1;
                                            post.comments[index].users_liked.splice(post.comments[index].users_liked.indexOf(authUser.username), 1);
                                            post.save()
                                                .then(result => {
                                                    return res.status(200).json({
                                                        status: "Success. Likes (-1)",
                                                        message: result
                                                    })
                                                })
                                                .catch(err => {
                                                    return res.status(500).json({
                                                        Error: err
                                                    })
                                                })
                                        }

                                        updated = true;
                                        
                                        break;
                                    }
                                }

                                if (!updated) {
                                    return res.status(404).json({
                                        status: "Not Found",
                                        message: "Cannot find a comment with the provided id"
                                    })
                                }
                            }
                            else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Cannot find a post with the provided id"
                                });
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                Error: err
                            })
                        });
                }

                if (comment_text) {
                    Post.findById(postid)
                        .exec()
                        .then(post => {
                            if (post) {
                                let updated = false;
                                for(let [index, comment] of post.comments.entries()) {
                                    if (comment._id.toString() === commentid.toString()) {
                                        if (comment.username.toString() === authUser.username.toString()) {
                                            post.comments[index].user_comment = comment_text;
                                            post.comments[index].date_posted = new Date();
                                            post.save()
                                                .then(message => {
                                                    return res.status(200).json({
                                                        status: "Comment modified",
                                                        message
                                                    })
                                                })
                                                .catch(err => {
                                                    return res.status(500).json({
                                                        Error: err
                                                    })
                                                })
                                            
                                            updated = true;
                                            
                                            break;
                                        }
                                        else {
                                            return res.status(403).json({
                                                status: "Unauthorized",
                                                message: "You are not authorized to edit this comment"
                                            });
                                        }
                                    }
                                }

                                if (!updated) {
                                    return res.status(404).json({
                                        status: "Not Found",
                                        message: "Cannot find a comment with the provided id"
                                    })
                                }
                            } else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Post with the provided id not found"
                                })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                Error: err
                            })
                        })
                }
            };
        });
    } else
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a user token, commentid, postid and update at least the comment_text or likes'
        });
}
