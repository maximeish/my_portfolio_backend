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
                    status: 'Unauthorized',
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
                                })

                            // Post.findOneAndDelete({'comments': {$elemMatch: {_id: commentid, username: authUser.username}}}, function (err, result) {
                            //     if (err) {
                            //         return res.status(500).json({
                            //             Error: err
                            //         });
                            //     }    

                            //     if (result) {
                            //         return res.status(200).json({
                            //             status: "Deleted successfully",
                            //             message: result
                            //         });
                            //     } else {
                            //         return res.status(400).json({
                            //             status: "Not Found or Invalid User",
                            //             message: "Cannot find a comment with the provided id or you are not allowed to delete this comment"
                            //         });
                            //     }
                            // });
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
                    status: "Unauthorized to update comment",
                    message: "You are not allowed to update the comment due to invalid user token"
                });
            };

            if (authUser) {
                let currentLikes, currentLikedUsers = [];
                if (likes) {
                    Post.findOne({ "_id": postid, "comments._id": commentid})
                        .exec()
                        .then(comment => {
                            if (comment) {
                                currentLikes = comment.likes;
                                currentLikedUsers = comment.users_liked;
                                if (!currentLikedUsers.includes(authUser.username)) {
                                    Post.update({ "_id": postid, "comments._id": commentid },
                                        {
                                            $set: {"comments.$.likes": ++currentLikes},
                                            $push: {"comments.$.users_liked": authUser.username}
                                        })
                                        .exec()
                                        .then(result => {
                                            return res.status(200).json({
                                                status: "Success (+1 like)",
                                                message: result
                                            })
                                        })
                                        .catch(err => {
                                            return res.status(500).json({
                                                Error: err
                                            })
                                        })
                                } else {
                                    Post.update({ "_id": postid, "comments._id": commentid },
                                        {
                                            $set: {"comments.$.likes": --currentLikes},
                                            $pull: {"comments.$.users_liked": authUser.username}
                                        })
                                        .exec()
                                        .then(result => {
                                            return res.status(200).json({
                                                status: "Success (-1 like)",
                                                message: result
                                            })
                                        })
                                        .catch(err => {
                                            return res.status(500).json({
                                                Error: err
                                            })
                                        })
                                }
                            } else {
                                return res.status(404).json({
                                    status: "Not Found",
                                    message: "Cannot find a comment with the provided id"
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
                    Post.findOne({"comments._id": commentid})
                        .exec()
                        .then(comment => {
                            console.log(comment);
                            if (comment.username === authUser.username) {
                                Post.update({ "_id": postid, "comments._id": commentid },
                                {
                                    $set: {"comments.$.comment_text": comment_text, "comments.$.date_posted": new Date()}
                                })
                                .exec()
                                .then(result => {
                                    return res.status(200).json({
                                        status: "Success",
                                        message: "Comment updated successfully"
                                    });
                                })
                                .catch(err => {
                                    return res.status(500).json({
                                        Error: err
                                    })
                                });
                            } else {
                                return res.status(403).json({
                                    status: "Unauthorized",
                                    message: "You are not authorized to edit this comment"
                                });
                            }
                        })
                        .catch(err => {
                            Error: err
                        });
                }
            };
        });
    } else
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a user token, commentid, postid and update at least the comment_text or likes'
        });
}
