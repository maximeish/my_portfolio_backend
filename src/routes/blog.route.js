import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';
import postData from '../models/post-data.json';
import uniqid from 'uniqid';
// import { getPostsByCount } from '../controllers/blog.controller';
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

route.post('/blog', getToken, (req, res) => {
    const previewPosts = [];
    for (let i = 0; i < 3; i++) previewPosts.push(posts[i]);
    
    try {
        jwt.verify(req.token, process.env.SECRET_KEY, (err, authUser) => {
            if (err)
                return res.status(200).json({
                	status: 'Success - user not logged in',
                	role: 'user',
                	userToken: null,
                    posts
                });
            if (authUser.role === 'admin')
                return res.status(200).json({
                	status: 'Success',
                    role: 'admin',
                    userToken: req.token || null,
                    posts
                });
            
            if (authUser.role === 'user')
                return res.status(200).json({
                	status: 'Success',
                    role: 'user',
                    userToken: req.token || null,
                    posts
                });
        });
    } catch(err) {
        return res.status(200).json({
            status: 'Success - user not logged in',
            role: 'user',
            userToken: null,
            posts
        });
    };
});

export default route;