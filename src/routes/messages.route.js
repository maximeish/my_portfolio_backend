import express from 'express';
import { getMessages, addMessage, deleteMessage } from '../controllers/messages.controller';


const route = express.Router();

route.get('/messages', (req, res) => getMessages(req, res));

route.post('/messages', (req, res) => addMessage(req, res));

route.delete('/messages/:id', (req, res) => deleteMessage(req, res));


export default route;