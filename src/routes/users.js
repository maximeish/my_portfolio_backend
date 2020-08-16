import express from 'express';
import { restart } from 'nodemon';
import {getUsers, getUserById, addUser, deleteUser, updateUser} from '../controllers/user.controller';


const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Welcome to my blog's backend API");
});

router.get('/users/:id', (req, res) => getUserById(req, res));

router.get('/users', (req, res) => getUsers(req, res));

router.put('/users', (req, res) => updateUser(req, res));

router.post('/users', (req, res) => addUser(req, res));

router.delete('/users/:id', (req, res) => deleteUser(req, res));


export default router;


