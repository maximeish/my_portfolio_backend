import commentData from '../models/comment-data.json';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

// Assign each user a unique id

let comments = [];

for (let comment of commentData) {
    comment = { id: uniqid('commentid-'), ...comment };
    comments.push(comment);
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
    const { token, user_comment, date_posted, likes, postid } = req.headers;
    
    if (token && user_comment && date_posted && likes && postid) {
        //Verify if token is valid
        jwt.verify(token, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "Not allowed to comment"
                });
            } else if (authUser) {
                comments.push({id: uniqid('commentid-'), ...req.query});
                res.status(200).json({
                    status: 'Success',
                    message: "Comment posted successfully"
                });
            }
        });
    } else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Error: Please, provide all details for the comment (token, user_comment, date_posted, likes, postid)'
        });
    }
}

export const deleteComment = (req, res) => {
    let deleted = false;
    const { token, commentid } = req.headers;
    if (token && commentid) {
        //Verify if the token is valid
        jwt.verify(token, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "Invalid token"
                });
            } else if (authUser) {
                comments.map((comment, index) => {
                    if (comment.id === commentid && comment.username === authUser.username) {
                        comments.splice(index, 1);
                        deleted = true;
                    }
                });
            }
        });

        
        if (deleted) {
            return res.status(200).json({
                status: "Success",
                message: "Comment successfully deleted"
            });
        }
        else {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Error: Comment with the provided id not found or unauthorized user. Supply data in /users/<username>/<commentid> format'
            });
        }
    }
    
    else {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to supply the token and commentid'
        });
    }
}

export const updateComment = (req, res) => {
    let updated = false;
    if (Object.values(req.query).length <= 4 && Object.values(req.query).length !== 0) {
        if (req.query.id) {
            comments.map(comment => {
                if (comment.id === req.query.id && comment.username === req.query.username) {
                    comment.date_posted = req.query.date_posted || comment.date_posted;
                    comment.likes = req.query.likes || comment.likes;
                    comment.user_comment = req.query.user_comment || comment.user_comment;
                    updated = true;
                } 
            });
            if (updated) res.status(200).json(comments);
            else res.status(404).json({
                status: 404,
                message: 'Comment with the provided id not found or unauthorized user'
            });
        } else res.status(400).json({
            status: 400,
            message: 'Please provide a comment id'
        });
    } else res.status(400).json({
        status: 400,
        message: 'Please, update at least one field: user_comment, likes, or date_posted (you must also supply the username)'
    });
}
