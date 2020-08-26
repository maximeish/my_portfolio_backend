import express from 'express';
import { getUsers, getUserById, addUser, deleteUser, updateUser } from '../controllers/users.controller';


const route = express.Router();


route.get('/getUser', (req, res) => getUserById(req, res));

route.get('/getUsers', (req, res) => getUsers(req, res));

route.put('/updateUser', (req, res) => updateUser(req, res));

route.post('/addUser', (req, res) => addUser(req, res));

route.delete('/deleteUser', (req, res) => deleteUser(req, res));


export default route;


