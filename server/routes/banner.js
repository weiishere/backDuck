const controller = require('../controller');
const banner = require('./banner');

const router = require('koa-router')({
    prefix: 'banner/'
})
router.get('list', controller.banner.list);
router.post('insert', controller.banner.insert);
router.post('update', controller.banner.update);
router.post('remove', controller.banner.remove);

module.exports = router;



