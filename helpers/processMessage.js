const API_AI_TOKEN = '60b6c120646e45649fbc8134892ecf18';
const FACEBOOK_ACCESS_TOKEN = 'EAAErnRniJjgBAG7zbeHxvQ2ZAxTPx85jx2llknYriWQrDjbaE6FycDQ8TINMsolab0iJkYymt0BFA7wacbC54S6rk9FZBbyZBkzpYrtOFs0notoZBlCZAasx2UkfdHLlza5HuGGYPaqTkC8kWZB1M7SWr8yNuJy8ltLNNpyfXSwQZDZD';

const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendImage = (senderId, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url: imageUri }
                }
            }
        }
    });
};

const sendTextMessage = (senderId, text) => {
	console.log("sending text");
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'images.search') {
            sendImage(senderId, result);
        } else {
            sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
