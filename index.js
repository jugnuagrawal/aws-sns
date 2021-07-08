const router = require('express').Router();
const got = require('got');

router.post(async (req, res, next) => {
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
        //  else if (req.header('x-amz-sns-message-type') === 'Notification') {

        // }
        next();
    } catch (e) {
        if (typeof e === 'string') {
            throw new Error(e);
        }
        throw e;
    }
});

module.exports = function () {
    return router;
};