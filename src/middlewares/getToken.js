import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();


//middleware to get the token from the request header
//and pass it to the next /admin middleware to verify
//if user is admin or not
export const getToken = (req, res, nextMiddleware) => {
    //get the auth token from the headers
    let { usertoken } = req.headers;
    if(usertoken) {
        //Save the token to req.token and call nextMiddleware() to pass a modified req
        req.token = usertoken;
        nextMiddleware();
    }
    else {
    	req.token = 'invalid';
    	nextMiddleware();
    }
}