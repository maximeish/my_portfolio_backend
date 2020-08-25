import postData from '../models/post-data.json';
import userData from '../models/user-data.json';
import postCommentsData from '../models/comment-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

let posts = [], users = [];

// Sign and save each post token and add comments to each post
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

    //Find the comments with a matching id of each post 
    //and add them to the post's comment count
    posts.map(post => {
        postCommentsData.forEach(comment => {
            if (post.id === comment.postid) {
                post.comments += 1;
            };
        });
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
    const { usertoken } = req.headers;

    jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
        if (err)
            return res.status(403).json({
                status: "Unauthorized",
                message: "You need to provide a valid token"
            });

        if (authUser.role !== 'admin') 
            return res.status(403).json({
                status: "Unauthorized",
                message: "You are not allowed to view this page"
            });

        else if (authUser.role === 'admin') {
            //Find the comments with a matching id of each post 
            //and add them to the post's comment count
            posts.map(post => {
                postCommentsData.forEach(comment => {
                    if (post.id === comment.postid) {
                        post.comments += 1;
                    };
                });
            });


            return res.status(200).json({
                status: "Success",
                count: posts.length,
                posts
            });
        }
    })
}

export const getPostById = (req, res) => {    
    let { posttoken, usertoken } = req.headers, postAvailable = false;

    if (posttoken) {
        jwt.verify(posttoken, process.env.SECRET_KEY, (err, postData) => {
            if (err) {
                res.status(404).json({
                    status: 'Not Found',
                    message: 'Cannot find a post with the provided token. You need to supply a VALID post token'
                });
            }

            // The post token is valid
            if (postData) {
                if (usertoken) {
                    // User may be logged in
                    jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
                        if (err) {
                            // Got an invalid user token
                            return res.status(400).json({
                                status: "Bad Request",
                                message: "Invalid user token"
                            });
                        }

                        if (authUser) {
                            // User is logged in
                            if (authUser.role === 'user') {
                                for (let post of posts) {
                                    if(post.id === postData.id) {
                                        postAvailable = true;
                                        let comments = [];
                                        //Find the comments with a matching id of each post 
                                        //and add them to the post's comment count
                                        postCommentsData.forEach(comment => {
                                            if (post.id === comment.postid) {
                                                comments.push(comment);
                                            };
                                        });
                                        
                                        return res.status(200).json({
                                            status: 'Success - User logged in',
                                            userToken: usertoken,
                                            userRole: 'user',
                                            post,
                                            commentsCount: comments.length,
                                            comments                                        
                                        });

                                        break;
                                    }
                                }
                                
                                if (!postAvailable) 
                                    return res.status(404).json({
                                        status: 'Post NOT Found - User logged in',
                                        userToken: usertoken,
                                        userRole: 'user',
                                        message: "Post with the provided postid NOT found"
                                    });
                            }

                            if (authUser.role === 'admin') {
                                for (let post of posts) {
                                    if(post.id === postData.id) {
                                        postAvailable = true;
                                        let comments = [];
                                        //Find the comments with a matching id of each post 
                                        //and add them to the post's comment count
                                        postCommentsData.forEach(comment => {
                                            if (post.id === comment.postid) {
                                                comments.push(comment);
                                            };
                                        });
                                        
                                        return res.status(200).json({
                                            status: 'Success - Admin user logged in',
                                            userToken: usertoken,
                                            userRole: 'admin',
                                            post,
                                            commentsCount: comments.length,
                                            comments                                        
                                        });

                                        break;
                                    }
                                }
                                
                                if (!postAvailable) 
                                    return res.status(404).json({
                                        status: 'Post NOT Found - Admin user logged in',
                                        userToken: usertoken,
                                        userRole: 'admin',
                                        message: "Post with the provided postid NOT found"
                                    });
                            }
                        }
                    });
                } else {
                    // User is not logged in

                    //get post with the corresponding id
                    for (let post of posts) {
                        if(post.id === postData.id) {
                            postAvailable = true;
                            let comments = [];
                            //Find the comments with a matching id of each post 
                            //and add them to the post's comment count
                            postCommentsData.forEach(comment => {
                                if (post.id === comment.postid) {
                                    comments.push(comment);
                                };
                            });
                            return res.status(200).json({
                                status: 'Success - Post Found - User NOT logged in',
                                userToken: null,
                                userRole: 'guest',
                                post,
                                commentsCount: comments.length,
                                comments 
                            });

                            break;
                        };
                    }

                    // post not found
                    if (!postAvailable)
                        return res.status(404).json({
                            status: 'Post NOT Found - User NOT logged in',
                            userToken: null,
                            userRole: 'guest',
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
    const {usertoken, title, paragraphs} = req.headers;
    if (usertoken && title && paragraphs) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You need to provide a valid token"
                });
            }

            if (authUser.role !== 'admin') {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === 'admin') {
                let postsCount = posts.length;
                let temp = {
                    id: ++postsCount,
                    title,
                    paragraphs,
                    date_posted: new Date(),
                    comments: 0
                };
                
                jwt.sign(temp, process.env.SECRET_KEY, (err, postToken) => {
                    posts.push({postToken, ...temp});
                    return res.status(200).json({
                        status: "Success",
                        message: "Post added successfully"
                    });
                });
            };
        });
    }

    else res.status(400).json({
        status: 'Bad Request',
        message: 'Please, provide all details (usertoken, title, paragraphs)'
    });
}

export const deletePost = (req, res) => {
    let deleted = false;
    const {usertoken, posttoken} = req.headers;
    
    if (usertoken && posttoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You need to supply a valid token"
                });
            }

            if (authUser.role !== 'admin') {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === 'admin') {
                jwt.verify(posttoken, process.env.SECRET_KEY, (err, postData) => {
                    if (err) {
                        return res.status(400).json({
                            status: "Bad Request",
                            message: "Cannot delete post using invalid token"
                        });
                    }

                    if (postData) {
                        let index = 0;
                        for (let post of posts) {
                            if (post.id === postData.id) {
                                posts.splice(index, 1);
                                deleted = true;
                                return res.status(200).json({
                                    status: "Success",
                                    message: "Post successfully deleted"
                                });

                                break;
                            }
                            ++index;
                        };
                    }
                });
            }
        });
        if (!deleted) 
            return res.status(404).json({
            status: "Not Found",
            message: 'Post with the provided id not found'
        });
    }
    
    else res.status(400).json({
        status: 400,
        message: 'Supply the usertoken and posttoken'
    });
}

export const updatePost = (req, res) => {
    let updated = false;
    const {usertoken, posttoken, title, paragraphs} = req.headers;
    if (usertoken && posttoken && (title || paragraphs)) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to perform this operation due to invalid token"
                });
            };

            if (authUser.role !== 'admin') {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not allowed to use this feature"
                });
            }

            if (authUser.role === 'admin') {
                jwt.verify(posttoken, process.env.SECRET_KEY, (err, postData) => {
                    if (err) {
                        return res.status(400).json({
                            status: "Bad Request",
                            message: "Cannot find a matching post due to invalid token"
                        });
                    }

                    if (postData) {
                        if (title || paragraphs) {
                            let index = 0;
                            for (let post of posts) {
                                if (post.id === postData.id) {
                                    posts[index].title = title || post.title;
                                    posts[index].paragraphs = paragraphs || post.paragraphs;

                                    return res.status(200).json({
                                        status: "Success",
                                        message: "Post updated successfully"
                                    });

                                    break;
                                }
                                ++index;
                            }
                        } else {
                            return res.status(400).json({
                                status: "Bad Request",
                                message: "Update at least the title or paragraphs"
                            });
                        };
                    };
                });
            }
        });
    } else res.status(400).json({
        status: 'Bad Request',
        message: 'You must provide the usertoken and posttoken and update at least one field: title or paragraphs'
    });
}