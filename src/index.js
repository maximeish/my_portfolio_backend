import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("hello these are your tasks", req);
});

app.listen(port, () => {
    console.log(`todo-api listening on http://localhost:${port}`);
});