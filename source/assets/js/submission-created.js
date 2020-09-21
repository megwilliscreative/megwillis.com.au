require('dotenv').config();
const fetch = require('node-fetch');

//These are the MadMini account details that you need to setup in Netlify so they are available to this code
const API_KEY = process.env.MIMI_API_KEY;
const USERNAME = process.env.MIMI_USER;
const MAILLIST = process.env.MIMI_MAILLIST;

exports.handler = async event => {
    const formFields = JSON.parse(event.body).payload;
    const email = formFields.email;

    //Madmini account details
    const params = {
        api_key: API_KEY,
        username: USERNAME,
    };

    console.log(`Recieved a submission: ${email}`);

    return fetch('https://api.madmimi.com/audience_lists/' + MAILLIST + '/add?email=' + email, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Submitted to MadMini:\n ${data}`);
        })
        .catch(error => ({statusCode: 422, body: String(error)}));
};
