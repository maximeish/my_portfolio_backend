# backend-blog-api
[![Build Status](https://travis-ci.com/maximeish/backend-blog-api.svg?branch=develop)](https://travis-ci.com/maximeish/backend-blog-api)
[![Coverage Status](https://coveralls.io/repos/github/maximeish/backend-blog-api/badge.svg?branch=develop)](https://coveralls.io/github/maximeish/backend-blog-api?branch=develop)

# a Backend API for a Blog

This is a Backend API that uses mongoDB (with mongoose) to perform CRUD operations to different kinds of data like posts, users, and messages. The user can build
their own frontend for this API also. But he/she should make sure to check all the features the API has and the ones it does not have so that they won't break it or 
receive too much unhandled errors.

# Usage
- git clone https://github.com/maximeish/backend-blog-api
- cd backend-blog-api
- npm install
Make sure you have postman or any other API client installed so that it can be easy for you to test all the different kinds of features that the API has
- You can also run **npm run test** to first check if all the tests are passing 
- Then after that run **npm run dev-mode** to start a development server on 3000 port where you would need postman to test different features

# what the API can do

> Post management (with commenting)

- addPost (from admin page)
- getPostById (from blog page)
- deletePost (from admin page)
- get all posts (from admin page)
- get 3 post previews (from /blog)
- updatePost (from admin page)
- addComment (from blog post page)
- deleteComment (from blog post page)
- updateComment likes+comment_text (from blog post page)


> User authentication
- user signup
- user login

> User management

- get all users (from admin page)
- get user by id (from admin page)
- update user (from admin page, also from user profile page)
- delete user (from admin page (any user), from user profile page)

> Messaging from the contact form

- send message (from contact form)
- retrieve all messages (from admin page)
- delete a message (from admin page)

# default credentials
You can create your own environment variables and link them with your mongodb atlas database or use the hosted version at https://backend-blog-api.herokuapp.com/ which will be configured for you and will be good to go.

# contact info
Feel free to create an issue on this repo if you notice any bugs, improvements or you just want to give feedback.
Or send me a quick email for any further information. I hope you shall have a great experience with this API. :)
