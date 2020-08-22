import userData from '../models/user-data.json';
import uniqid from 'uniqid';
// import jwt from 'jsonwebtoken';
// import dotEnv from 'dotenv';

// dotEnv.config();

// Assign each user a unique id

let users = [];

for (let user of userData) {
    user = { id: uniqid('userid-'), ...user };
    users.push(user);
}

export const getUsers = (req, res) => {
    res.status(200).json(users);
}

export const getUserById = (req, res) => {
    let reqUser;
    
    users.forEach(user => {
        if(user.id === req.params.id) {
            res.status(200).json(user);
            reqUser = true;
        }
    })
    
    if (!reqUser) res.status(404).json({
        status: 404,
        message: "User with the provided id not found"
    });
}

// export const addUser = (req, res) => {

// }

export const deleteUser = (req, res) => {
    let deleted = false;
    if (Object.values(req.params).length === 1) {
        users.map((user, index) => {
            if (user.id === req.params.id) {
                users.splice(index, 1);
                console.log(`User with id ${req.params.id} successfully deleted`);
                deleted = true;
            }
        });
        if (deleted) res.status(200).json(users);
        else res.status(404).json({
            status: 404,
            message: 'User with the provided id not found'
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Supply only the user id'
    });
}

export const updateUser = (req, res) => {
    let updated = false;
    if (Object.values(req.query).length <= 3 && Object.values(req.query).length !== 0) {
        if (req.query.id) {
            users.map(user => {
                if (user.id === req.query.id) {
                    user.username = req.query.username || user.username;
                    user.email = req.query.email || user.email;
                    user.password = req.query.password || user.password;
                    updated = true;
                }
            });
            if (updated) 
                res.status(200).json({
                    count: users.length,
                    users
                });
            else 
                res.status(404).json({
                    status: 404,
                    message: 'User with the provided id not found'
                });
        } else
            res.status(400).json({
                status: 400,
                message: 'Please provide a user id'
            });
    } else
        res.status(400).json({
            status: 400,
            message: 'Please, update at least one field: username, email or password'
        });
}