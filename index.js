const got = require('got');

module.exports = function (options = { parseMessage: false }) {
    return async (req, res, next) => {
        try {
            let payload = req.body;
            if (typeof payload === 'string') {
                payload = JSON.parse(payload);
            }
            req.body = payload;
            if (req.header('x-amz-sns-message-type') === 'SubscriptionConfirmation') {
                await got(payload.SubscribeURL);
                return res.status(200).end();
            }
            if (options.parseMessage && req.header('x-amz-sns-message-type') === 'Notification') {
                let data = payload.Message;
                if(typeof data === 'string'){
                    data = JSON.parse(data);
                }
                req.body = data;
            }
            next();
        } catch (e) {
            if (typeof e === 'string') {
                throw new Error(e);
            }
            throw e;
        }
    };
};