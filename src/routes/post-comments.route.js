import express from 'express';
import { addComment, deleteComment, updateComment } from '../controllers/comments.controller';


const route = express.Router();


route.post('/addComment', (req, res) => addComment(req, res));

route.put('/updateComment', (req, res) => updateComment(req, res));

route.delete('/deleteComment', (req, res) => deleteComment(req, res));


export default route;