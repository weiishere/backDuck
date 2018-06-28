const controller = require('../controller');

const router = require('koa-router')({
    prefix: 'menu/'
})
router.get('list', controller.menu.list);
router.post('insert', controller.menu.insert);
router.post('update', controller.menu.update);
router.post('remove', controller.menu.remove);

module.exports = router;



