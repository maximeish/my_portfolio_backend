import express from 'express';
import { getComments, getCommentById, addComment, deleteComment, updateComment } from '../controllers/comments.controller';


const router = express.Router();

router.get('/comments/:id', (req, res) => getCommentById(req, res));

router.get('/comments', (req, res) => getComments(req, res));

router.post('/comments', (req, res) => addComment(req, res));

router.put('/comments', (req, res) => updateComment(req, res));

router.delete('/comments/:username/:id', (req, res) => deleteComment(req, res));


export default router;