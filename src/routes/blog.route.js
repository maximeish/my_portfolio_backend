import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';
import postData from '../models/post-data.json';
import uniqid from 'uniqid';
import { displayPreviews, getPostById } from '../controllers/blog.controller';
import { getToken } from '../middlewares/getToken';


dotEnv.config();


const route = express.Router();

// Assign each post a unique id

let posts = [];

for (let post of postData) {
    post = { id: uniqid('postid-'), ...post };
    jwt.sign(post, process.env.SECRET_KEY, (err, token) => {
    	if (err)
    		return res.status(501).json({
    			status: 'Internal Server Error',
    			message: 'Cannot generate token for each post'
    		});
    	if (token) {
    		post = {postToken: token, ...post};
    		posts.push(post);
    	}
    });
};

route.get('/blog', getToken, displayPreviews);

route.get('/blogPost', (req, res) => getPostById(req, res));


export default route;