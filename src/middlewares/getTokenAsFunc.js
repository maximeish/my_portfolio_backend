import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();


//middleware to get the token from the request header
//and return it to the caller
export const getTokenAsFunc = req => {
    //get the auth token from the header
    let bearerToken;
    if(req.headers['authorization']) {
        //Save the token to bearerToken and return it
        bearerToken = req.headers['authorization'].split(' ')[1];
        return bearerToken;
    }
    else return 'invalid';
}