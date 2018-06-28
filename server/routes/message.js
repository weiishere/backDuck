const controller = require('../controller');

const router = require('koa-router')({
    prefix: 'message/'
})
router.get('list', controller.message.list);
router.post('insert', controller.message.insert);
router.post('updateAgree', controller.message.updateAgree);
router.post('remove', controller.message.remove);

module.exports = router;