import express from 'express';
import { getMessages, addMessage, deleteMessage } from '../controllers/messages.controller';


const route = express.Router();

route.get('/getMessages', (req, res) => getMessages(req, res));

route.post('/addMessage', (req, res) => addMessage(req, res));

route.delete('/deleteMessage', (req, res) => deleteMessage(req, res));

export default route;