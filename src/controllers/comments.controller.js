import commentData from '../models/comment-data.json';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

// Sign and save each comment as a token

let comments = [];

for (let comment of commentData) {
    jwt.sign(comment, process.env.SECRET_KEY, (err, token) => {
        if (err)
            return res.status(501).json({
                status: 'Internal Server Error',
                message: 'Cannot generate token for each comment'
            });
        if (token) {
            comment = {commentToken: token, ...comment};
            comments.push(comment);
        }
    });
}

export const getComments = (req, res) => {
    res.status(200).json(comments);
}

export const getCommentById = (req, res) => {
    let reqComment;
    
    comments.forEach(comment => {
        if(comment.id === req.params.id) {
            res.status(200).json(comment);
            reqComment = true;
        }
    })
    
    if (!reqComment) res.status(404).json({
        status: 404,
        message: "Error: Comment with the provided id not found"
    });
}

export const addComment = (req, res) => {
    const { usertoken, comment_text, posttoken } = req.headers;
    
    //check if post token is provided
    if (posttoken) {
        jwt.verify(posttoken, process.env.SECRET_KEY, (err, postData) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized to comment",
                    message: "You are not allowed to comment due to invalid token"
                });
            };

            if (postData) {
                //check if user token is provided
                if (usertoken) {
                    jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
                        if (err) {
                            return res.status(403).json({
                                status: 'Unauthorized',
                                message: "You are not authorized to comment due to invalid token"
                            });
                        }

                        if (authUser) {
                            if (comment_text) {
                                //Save comment in the database
                                let commentsCount = comments.length;
                                
                                const temp = {
                                    commentid: ++commentsCount,
                                    username: authUser.username,
                                    user_comment: comment_text,
                                    date_posted: new Date(),
                                    likes: 0,
                                    postid: postData.id
                                };

                                //Sign and save the comment's token in the comment
                                jwt.sign(temp, process.env.SECRET_KEY, (err, commentToken) => {
                                    if (err) {
                                        return res.status(501).json({
                                            status: 'Internal Server Error',
                                            message: "Cannot sign the comment to get its token"
                                        });
                                    };

                                    if (commentToken) {
                                        comments.push({ commentToken, ...temp });
                                        
                                        return res.status(200).json({
                                            status: 'Success',
                                            message: "Comment posted successfully"
                                        });
                                    };
                                });
                            } else {
                                return res.status(400).json({
                                    status: 'Bad Request',
                                    message: 'You need to provide the comment_text'
                                });
                            }
                        }
                    });
                } else {
                    return res.status(403).json({
                        status: 'Unauthorized to comment',
                        message: 'You are not authorized to comment as you are not logged in'
                    });
                };
            };
        });
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a post token'
        });
    };
};

export const deleteComment = (req, res) => {
    let deleted = false;
    const { usertoken, commenttoken } = req.headers;
    
    //check if user token is provided
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized to delete comment",
                    message: "You are not allowed to delete a comment due to invalid user token"
                });
            };

            if (authUser) {
                //check if comment token is provided
                if (commenttoken) {
                    jwt.verify(commenttoken, process.env.SECRET_KEY, (err, commentData) => {
                        if (err) {
                            return res.status(403).json({
                                status: 'Unauthorized',
                                message: "You are not authorized to delete due to invalid comment token"
                            });
                        }

                        if (commentData) {
                            for (let [index, comment] of comments.entries()) {
                                if (comment.commentid === commentData.commentid && comment.username === authUser.username) {
                                    comments.splice(index, 1);
                                    deleted = true;
                                    return res.status(200).json({
                                        status: "Success",
                                        message: "Comment successfully deleted"
                                    });
                                };
                            };
                        };

                        if (!deleted) {
                            return res.status(400).json({
                                status: "Bad Request",
                                message: "Cannot find the comment with the provided id"
                            })
                        }
                    });
                } else {
                    return res.status(403).json({
                        status: 'Unauthorized to delete comment',
                        message: 'Cannot delete comment. You need to supply the comment token'
                    });
                };
            };
        });
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a user token'
        });
    };
}

export const updateComment = (req, res) => {
    let updated = false;
    const { usertoken, commenttoken, likes, comment_text } = req.headers;
    
    //check if user token is provided
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized to update comment",
                    message: "You are not allowed to update the comment due to invalid user token"
                });
            };

            if (authUser) {
                //check if comment token is provided
                if (commenttoken) {
                    jwt.verify(commenttoken, process.env.SECRET_KEY, (err, commentData) => {
                        if (err) {
                            return res.status(403).json({
                                status: 'Unauthorized',
                                message: "Due to invalid comment token you are not allowed to update the comment"
                            });
                        }

                        if (commentData) {
                            //search the comment with the provided id and checks if the username of user who commented it is the same
                            //as the user who is logged in and update its text
                            let index = 0;
                            for (let comment of comments) {
                                if (comment.commentid === commentData.commentid && comment.username === authUser.username) {
                                    if(likes || comment_text) {
                                        if (likes) {
                                            if (comment.user_liked.includes(authUser.username)) {
                                                comments[index].likes -= 1;
                                                comments[index].user_liked.splice(comments[index].user_liked.indexOf(authUser.username), 1);
                                            } else {
                                                comments[index].likes += 1;
                                                comments[index].user_liked.push(authUser.username);
                                            }
                                        }
                                        if (comment_text) {
                                            comments[index].date_posted = new Date();
                                            comments[index].user_comment = comment_text;
                                        }

                                        updated = true;
                                        return res.status(200).json({
                                            status: "Success",
                                            message: "Comment successfully updated"
                                        });

                                        break;
                                    }
                                };
                                ++index;
                            }

                            for(let [index, comment] of comments.entries()) {
                                //search the comment with the provided id and checks if the user is logged in
                                //and update the comment's likes
                                if (likes && comment.id === commentData.id && comment.username !== authUser.username) {
                                    if (comment.user_liked.includes(authUser.username)) {
                                        comments[index].likes -= 1;
                                        comments[index].user_liked.splice(comments[index].user_liked.indexOf(authUser.username), 1);
                                        updated = true;
                                        return res.status(200).json({
                                            status: "Success",
                                            message: "Comment successfully updated (-1 like)"
                                        });
                                    } else {
                                        comments[index].likes += 1;
                                        comments[index].user_liked.push(authUser.username);
                                        updated = true;
                                        return res.status(200).json({
                                            status: "Success",
                                            message: "Comment successfully updated (+1 like)"
                                        });
                                    }

                                    break;
                                };
                            }
                        };

                        if (!updated) 
                            return res.status(400).json({
                                status: "Bad Request",
                                message: "You need to update at least the comment_text or like the comment"
                            });
                    });
                } else 
                    return res.status(400).json({
                        status: 'Bad Request',
                        message: 'You need to supply the comment token of the comment'
                    });
            };
        });
    } else
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to provide a user token'
        });
}
