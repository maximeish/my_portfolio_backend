import commentData from '../models/comment-data.json';
import uniqid from 'uniqid';

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
    if (Object.values(req.query).length === 5) {
        comments.push({id: uniqid('commentid-'), ...req.query});
        console.log(`Comment with id ${comments[comments.length - 1].id} successfully created`)
        res.status(200).json(comments);
    }

    else res.status(400).json({
        status: 400,
        message: 'Error: Please, provide all details for the comment (username, user_comment, date_posted, likes, postid)'
    });
}

export const deleteComment = (req, res) => {
    let deleted = false;
    if (Object.values(req.params).length === 2) {
        comments.map((comment, index) => {
            if (comment.id === req.params.id && comment.username === req.params.username) {
                comments.splice(index, 1);
                console.log(`Comment with id ${req.params.id} successfully deleted`);
                deleted = true;
            }
        });
        if (deleted) res.status(200).json(comments);
        else res.status(404).json({
            status: 404,
            message: 'Error: Comment with the provided id not found or unauthorized user. Supply data in /users/<username>/<commentid> format'
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Error: Supply only the comment id'
    });
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
