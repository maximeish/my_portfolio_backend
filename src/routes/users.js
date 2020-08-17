import express from 'express';
import { getUsers, getUserById, addUser, deleteUser, updateUser } from '../controllers/users.controller';


const router = express.Router();

router.get('/users/:id', (req, res) => getUserById(req, res));

router.get('/users', (req, res) => getUsers(req, res));

router.put('/users', (req, res) => updateUser(req, res));

router.post('/users', (req, res) => addUser(req, res));

router.delete('/users/:id', (req, res) => deleteUser(req, res));


export default router;


