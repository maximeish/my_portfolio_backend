import userData from '../models/user-data.json';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

// Assign each user a unique id

let users = [];

for (let user of userData) {
    user = { id: uniqid('userid-'), ...user };
    users.push(user);
}

export const signup = async (req, res) => {
    //Get provided values then sign user up
    const { username, email, password, role } = req.body;
    if (username && email && password && role) {
        if (role === 'user' || role === 'admin') {
            users.push({id: uniqid('userid-'), ...{ username, email, password, role }});
            console.log(`User with id ${users[users.length - 1].id} successfully created`)


            // try {
            await jwt.sign({ username, email, password, role }, process.env.SECRET_KEY, (err, token) => {
                    if(token) {
                        res.status(200).json({
                            message: 'Sign up successful',
                            token 
                        });
                        
                        // req.token = token;
                    }
                    else if (err)
                        res.status(400).json({
                            status: err.status,
                            message: err.message
                        })
                    else 
                        res.status(501).json({
                            status: 501,
                            message: "Unknown error"
                        });
                });
            // } catch (err) {
            //     res.json({
            //         status: err.status,
            //         message: err.message
            //     })
            // }
        } else {
            res.status(400).json({
                status: 400,
                message: 'The user role should be either "user" or "admin"'
            });
        }
    }

    else res.status(400).json({
        status: 400,
        message: 'Please, provide all details for a user (username, email, password)'
    });
}