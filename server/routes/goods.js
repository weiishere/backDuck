const controller = require('../controller');

const router = require('koa-router')({
    prefix: 'goods/'
})
router.get('list', controller.goods.list);
router.get('listWithLike', controller.goods.listWithLike);
router.post('insert', controller.goods.insert);
router.post('update', controller.goods.update);
router.post('remove', controller.goods.remove);
router.post('pv',controller.goods.updateClick)

module.exports = router;
