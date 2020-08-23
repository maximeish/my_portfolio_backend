import postData from '../models/post-data.json';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';
import getTokenAsFunc from '../middlewares/getTokenAsFunc';
import dotEnv from 'dotenv';

dotEnv.config();

// Assign each user a unique id

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
}

export const getPostsByCount = (req, res) => {
    const previewPosts = [], auth = true;
    for (let i = 0; i < 3; i++) previewPosts.push(posts[i]);
    try {
        // console.log('got in the try block')
        // console.log('here is auth', req.headers.authorization);
        // const auth = req.headers['authorization'];
        console.log(req.token);
        if(auth) {
            console.log('got a try cond')
            //Verify the user token
            // const userToken = getTokenAsFunc(req);
            jwt.verify(token, process.env.SECRET_KEY, (err, authUser) => {
                if (err)
                    return res.status(200).json({
                        posts
                    });
                if (authUser.role === 'admin')
                    return res.status(200).json({
                        role: 'admin',
                        posts
                    });
                
                if (authUser.role === 'user')
                    return res.status(200).json({
                        role: 'user',
                        posts
                    });
            });
        };
    } catch(err) {
        return res.status(200).json({
            status: 'Success - user not logged in',
            posts
        });
    };
};