import express from 'express';
import {getPosts, getPostById, addPost, deletePost, updatePost} from '../controllers/posts.controller';


const route = express.Router();


route.get('/getPosts', (req, res) => getPosts(req, res));

route.put('/updatePost', (req, res) => updatePost(req, res));

route.get('/blogPost', (req, res) => getPostById(req, res));

route.post('/addPost', (req, res) => addPost(req, res));

route.delete('/deletePost', (req, res) => deletePost(req, res));


export default route;