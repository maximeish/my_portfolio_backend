import users from '../models/users';
import uniqid from 'uniqid';


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
    
    if (!reqUser) res.status(404).send("User not found");
}

export const addUser = (req, res) => {
    if (Object.values(req.query).length === 3) {
        users.push({id: uniqid('userid-'), ...req.query});
        console.log(`User with id ${users[users.length - 1].id} successfully created`)
        res.status(200).json(users);
    }

    else res.status(501).send('Please, provide all details');
}

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
        else res.status(404).send('User not found');
    }
    
    else res.status(404).send('User not found');
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
            if (updated) res.status(200).json(users);
            else res.status(404).send('User with the provided id not found');
        } else res.status(501).send('Please provide a user id');
    } else res.status(501).send('Please, update at least one field: username, email or password');
}