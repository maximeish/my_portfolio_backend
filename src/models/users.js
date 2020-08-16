import userData from './user-data.json';
import uniqid from 'uniqid';

let users = [];

for (let user of userData) {
    user = { id: uniqid('userid-'), ...user };
    users.push(user);
}

// console.log(users)

// users = JSON.parse(JSON.stringify(userData));

export default users;