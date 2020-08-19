import express from 'express';
import { getUsers, getUserById, addUser, deleteUser, updateUser } from '../controllers/users.controller';


const route = express.Router();

//Verify if it is the admin logged in
// const verifyToken = 

route.get('/users/:id', (req, res) => getUserById(req, res));

route.get('/users', (req, res) => getUsers(req, res));

route.put('/users', (req, res) => updateUser(req, res));

route.post('/users', (req, res) => addUser(req, res));

route.delete('/users/:id', (req, res) => deleteUser(req, res));


export default route;


