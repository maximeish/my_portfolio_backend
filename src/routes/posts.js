import express from 'express';
import {getPosts, getPostById, addPost, deletePost, updatePost} from '../controllers/posts.controller';


const router = express.Router();

router.get('/posts/:id', (req, res) => getPostById(req, res));

router.get('/posts', (req, res) => getPosts(req, res));

router.put('/posts', (req, res) => updatePost(req, res));

router.post('/posts', (req, res) => addPost(req, res));

router.delete('/posts/:id', (req, res) => deletePost(req, res));


export default router;