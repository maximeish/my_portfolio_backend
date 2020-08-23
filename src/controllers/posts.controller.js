import postData from '../models/post-data.json';
import userData from '../models/user-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

let posts = [], users = [];

// Sign and save each post token
for (let post of postData) {
    jwt.sign(post, process.env.SECRET_KEY, (err, token) => {
        if (err)
            return res.status(501).json({
                status: 'Internal Server Error',
                message: 'Cannot generate token for each post'
            });
        if (token) {
            post = {postToken: token, ...post};
            posts.push(post);
        }
    });
}

// Sign and save each user token
for (let user of userData) {
    jwt.sign(user, process.env.SECRET_KEY, (err, token) => {
        if (err)
            return res.status(501).json({
                status: 'Internal Server Error',
                message: 'Cannot generate token for each user'
            });
        if (token) {
            user = {userToken: token, ...user};
            users.push(user);
        }
    });
}

export const getPosts = (req, res) => {
    res.status(200).json({
        count: posts.length,
        posts
    });
}

export const getPostById = (req, res) => {    
    let { posttoken, usertoken } = req.headers, postAvailable = false;

    if (posttoken) {
        jwt.verify(posttoken, process.env.SECRET_KEY, (err, postData) => {
            if (err) {
                res.status(400).json({
                    status: 'Bad Request',
                    message: 'You need to supply a VALID post token'
                });
            }

            // The post token is valid
            if (postData) {
                if (usertoken) {
                    // User may be logged in
                    jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
                        if (err) {
                            // User not logged in

                            // posts.forEach(post => {
                            //     if(post.id === postData.id) {
                            //         return res.status(200).json({
                            //             status: 'Success - Post Found - User NOT logged in',
                            //             userToken: null,
                            //             post
                            //         });
                            //     };
                            // });

                            for (let post of posts) {
                                if(post.id === postData.id) {
                                    postAvailable = true;
                                    return res.status(200).json({
                                        status: 'Success - Post Found - User NOT logged in',
                                        userToken: null,
                                        post
                                    });

                                    break;
                                };
                            }
                            
                            if(!postAvailable)          
                                return res.status(404).json({
                                    status: 'Post NOT Found - User NOT logged in',
                                    userToken: usertoken,
                                    message: "Post with the provided id not found"
                                });
                        }

                        if (authUser) {
                            // User is logged in
                            for (let post of posts) {
                                if(post.id === postData.id) {
                                    postAvailable = true;
                                    return res.status(200).json({
                                        status: 'Success - User logged in',
                                        userToken: usertoken,
                                        post
                                    });

                                    break;
                                }
                            }
                            
                            // posts.forEach(post => {
                            //     if(post.id === postData.id) {
                            //         return res.status(200).json({
                            //             status: 'Success - User logged in',
                            //             userToken: usertoken,
                            //             post
                            //         });
                            //         postAvailable = true;
                            //     }
                            // })
                            
                            if (!postAvailable) 
                                return res.status(404).json({
                                    status: 'Post NOT Found - User logged in',
                                    userToken: usertoken,
                                    message: "Post with the provided postid NOT found"
                                });
                        }
                    });
                } else {
                    // User is not logged in

                    //get post with the corresponding id
                    for (let post of posts) {
                        if(post.id === postData.id) {
                            postAvailable = true;
                            return res.status(200).json({
                                status: 'Success - Post Found - User NOT logged in',
                                userToken: null,
                                post
                            });

                            break;
                        };
                    }

                    // posts.forEach(post => {
                    //     if(post.id === postData.id) {
                    //         return res.status(200).json({
                    //             status: 'Success - Post Found - User NOT logged in',
                    //             userToken: null,
                    //             post
                    //         });
                    //     };
                    // });

                    // post not found
                    if (!postAvailable)
                        return res.status(404).json({
                            status: 'Post NOT Found - User NOT logged in',
                            userToken: null,
                            message: "Post with the provided id NOT found"
                        });
                }
            }
        })
    } else {
        // Did not supply a post token
        return res.status(400).json({
            status: 'Bad Request',
            message: 'You need to supply a post token'
        });
    };
};

export const addPost = (req, res) => {
    if (Object.values(req.query).length === 3) {
        posts.push({id: uniqid('postid-'), ...req.query});
        console.log(`Post with id ${posts[posts.length - 1].id} successfully created`)
        res.status(200).json(posts);
    }

    else res.status(400).json({
        status: 400,
        message: 'Error: Please, provide all details for the post (title, date_posted, paragraphs)'
    });
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
        else res.status(404).json({
            status: 404,
            message: 'Error: Post with the provided id not found'
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Error: Supply only the post id'
    });
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
            if (updated) 
                res.status(200).json({
                    count: posts.length, 
                    posts
                });
            else res.status(404).json({
                status: 404,
                message: 'Post with the provided id not found'
            });
        } else res.status(400).json({
            status: 400, 
            message: 'Please provide a post id'
        });
    } else res.status(400).json({
        status: 400,
        message: 'Please, update at least one field: title, date_posted or paragraphs'
    });
}