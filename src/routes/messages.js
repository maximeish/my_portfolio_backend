import express from 'express';
import { getMessages, addMessage, deleteMessage } from '../controllers/messages.controller';


const router = express.Router();

router.get('/messages', (req, res) => getMessages(req, res));

router.post('/messages', (req, res) => addMessage(req, res));

router.delete('/messages/:id', (req, res) => deleteMessage(req, res));


export default router;