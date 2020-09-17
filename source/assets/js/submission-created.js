require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.API_KEY;
const USERNAME = process.env.USERNAME;

exports.handler = async event => {
    const formFields = JSON.parse(event.body).payload;
    const email = formFields.email;
    const mailList = 'insertListName';

    //Madmini account details
    const params = {
        api_key: API_KEY,
        username: USERNAME,
    };

    console.log(`Recieved a submission: ${email}`);

    return fetch('https://api.madmimi.com/audience_lists/' + mailList + '/add?email=' + email, {
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
