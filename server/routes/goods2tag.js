const controller = require('../controller');

const router = require('koa-router')({
    prefix: 'goods2tag/'
})
router.get('list', controller.goods2tag.list);
router.post('update', controller.goods2tag.update);

module.exports = router;