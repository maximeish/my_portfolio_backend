import messageData from '../models/message-data.json';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

dotEnv.config();

export const getMessages = (req, res) => {
    const { usertoken } = req.headers;
    if (usertoken) {
        jwt.verify(usertoken, process.env.SECRET_KEY, (err, authUser) => {
            if (err) {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "Cannot get messages due to invalid user token"
                });
            };

            if (authUser.role !== 'admin') {
                return res.status(403).json({
                    status: "Unauthorized",
                    message: "You are not authorized to use this feature"
                });
            };

            if (authUser.role === 'admin') {
                return res.status(200).json({
                    status: "Success",
                    messagesCount: messageData.length,
                    messages: messageData
                });
            };
        });
    } else {
        return res.status(400).json({
            status: "Bad Request",
            message: "You need to supply a user token"
        });
    };
}


export const addMessage = (req, res) => {
    let { name, email, telephone, message } = req.headers;
    if (email || telephone) {
        let messagesCount = messageData.length;
        name = name || null;
        email = email || null;
        telephone = telephone || null;
        message = message || null;

        messageData.push({id: ++messagesCount, ...{name, email, telephone, message}});
        
        return res.status(200).json({
            status: "Success",
            message: "Message saved successfully"
        });
        
    }

    else 
        return res.status(400).json({
            status: 400,
            message: 'Please, provide at least the email or telephone'
        });
}