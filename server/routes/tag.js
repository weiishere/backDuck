const controller = require('../controller');

const router = require('koa-router')({
    prefix: 'tag/'
})
router.get('list', controller.tag.list);
router.post('insert', controller.tag.insert);
router.post('update', controller.tag.update);
router.post('remove', controller.tag.remove);

module.exports = router;