import postData from '../models/post-data.json';
import uniqid from 'uniqid';

// Assign each user a unique id

let posts = [];

for (let post of postData) {
    post = { id: uniqid('postid-'), ...post };
    posts.push(post);
}

export const getPosts = (req, res) => {
    res.status(200).json(posts);
}

export const getPostById = (req, res) => {
    let reqPost;
    
    posts.forEach(post => {
        if(post.id === req.params.id) {
            res.status(200).json(post);
            reqPost = true;
        }
    })
    
    if (!reqPost) res.status(404).send("Error: Post with the provided id not found");
}

export const addPost = (req, res) => {
    if (Object.values(req.query).length === 3) {
        posts.push({id: uniqid('postid-'), ...req.query});
        console.log(`Post with id ${posts[posts.length - 1].id} successfully created`)
        res.status(200).json(posts);
    }

    else res.status(501).send('Error: Please, provide all details for the post (title, date_posted, paragraphs)');
}

export const deletePost = (req, res) => {
    let deleted = false;
    if (Object.values(req.params).length === 1) {
        posts.map((post, index) => {
            if (post.id === req.params.id) {
                posts.splice(index, 1);
                console.log(`Post with id ${req.params.id} successfully deleted`);
                deleted = true;
            }
        });
        if (deleted) res.status(200).json(posts);
        else res.status(404).send('Error: Post with the provided id not found');
    }
    
    else res.status(404).send('Error: Supply only the post id');
}

export const updatePost = (req, res) => {
    let updated = false;
    if (Object.values(req.query).length <= 3 && Object.values(req.query).length !== 0) {
        if (req.query.id) {
            posts.map(post => {
                if (post.id === req.query.id) {
                    post.title = req.query.title || post.title;
                    post.date_posted = req.query.date_posted || post.date_posted;
                    post.paragraphs = req.query.paragraphs || post.paragraphs;
                    updated = true;
                }
            });
            if (updated) res.status(200).json(posts);
            else res.status(404).send('Post with the provided id not found');
        } else res.status(501).send('Please provide a post id');
    } else res.status(501).send('Please, update at least one field: title, date_posted or paragraphs');
}