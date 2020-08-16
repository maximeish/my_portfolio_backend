import express from 'express';
import * as bodyParser from 'body-parser';
import users from './routes/users';

const app = express();
const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', users);

app.listen(port, () => {
    console.log(`todo-api listening on http://localhost:${port}`);
});