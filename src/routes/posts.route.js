import express from 'express';
import {getPosts, getPostById, addPost, deletePost, updatePost} from '../controllers/posts.controller';


const route = express.Router();


route.get('/posts', (req, res) => getPosts(req, res));

route.put('/posts', (req, res) => updatePost(req, res));

route.post('/blogPost', (req, res) => getPostById(req, res));

route.post('/posts', (req, res) => addPost(req, res));

route.delete('/posts/:id', (req, res) => deletePost(req, res));


export default route;