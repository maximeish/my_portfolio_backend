import express from 'express';
import { getComments, getCommentById, addComment, deleteComment, updateComment } from '../controllers/comments.controller';


const route = express.Router();

route.get('/comments/:id', (req, res) => getCommentById(req, res));

route.get('/comments', (req, res) => getComments(req, res));

route.post('/comments', (req, res) => addComment(req, res));

route.put('/comments', (req, res) => updateComment(req, res));

route.delete('/comments/:username/:id', (req, res) => deleteComment(req, res));


export default route;