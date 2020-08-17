import messageData from '../models/message-data.json';
import uniqid from 'uniqid';

// Assign each message a unique id

let messages = [];

for (let message of messageData) {
    message = { id: uniqid('msgid-'), ...message };
    messages.push(message);
}

export const getMessages = (req, res) => {
    res.status(200).json(messages);
}


export const addMessage = (req, res) => {
    if (Object.values(req.query).length === 5) {
        messages.push({id: uniqid('postid-'), ...req.query});
        console.log(`Message with id ${messages[messages.length - 1].id} successfully created`)
        res.status(200).json(messages);
    }

    else res.status(501).send('Error: Please, provide all details for the message (name, email, telephone, message, date_sent)');
}

export const deleteMessage = (req, res) => {
    let deleted = false;
    if (Object.values(req.params).length === 1) {
        messages.map((message, index) => {
            if (message.id === req.params.id) {
                messages.splice(index, 1);
                console.log(`Message with id ${req.params.id} successfully deleted`);
                deleted = true;
            }
        });
        if (deleted) res.status(200).json(messages);
        else res.status(404).send('Error: Message with the provided id not found');
    }
    
    else res.status(404).send('Error: Supply only the message id');
}