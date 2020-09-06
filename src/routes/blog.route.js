import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';
import express from 'express';
import { displayPreviews, getPostById, getNoPost } from '../controllers/blog.controller';
import { getToken } from '../middlewares/getToken';


dotEnv.config();


const route = express.Router();


route.get('/blog', getToken, displayPreviews);

route.get('/blogpost/:postid', (req, res) => getPostById(req, res));
route.get('/blogpost', (req, res) => getNoPost(req, res));


export default route;