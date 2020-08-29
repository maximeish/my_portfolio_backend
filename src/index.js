import express from 'express';
import * as bodyParser from 'body-parser';
import createError from 'http-errors';
import users from './routes/users.route';
import posts from './routes/posts.route';
import messages from './routes/messages.route';
import postComments from './routes/post-comments.route';
import auth from './routes/auth.route';
import blog from './routes/blog.route';
import mongoose from 'mongoose';

mongoose.connect(`mongodb+srv://admin-user:${process.env.MONGO_ATLAS_PWD}@blogdata-cluster.9zb8m.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
    useFindAndModify: false
});

const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
    	status: 'success',
        message: "Welcome to my blog's backend API"
    });
});

app.use('/', users);
app.use('/', posts);
app.use('/', blog);
app.use('/', messages);
app.use('/', postComments);
app.use('/', auth);

app.use((req, res, next) => {
    next(createError(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 404).json({
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

export default app;