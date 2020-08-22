import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();


//middleware to get the token from the request header
//and pass it to the next /admin middleware to verify
//if user is admin or not
export const verifyToken = (req, res, nextMiddleware) => {
    //get the auth token from the header
    let bearerToken;
    if(req.headers['authorization']) {
        //Save the token to req.token and call nextMiddleware() to pass a modified req
        bearerToken = req.headers['authorization'].split(' ')[1];
        req.token = bearerToken;
        nextMiddleware();
    }
    else res.sendStatus(403);
}