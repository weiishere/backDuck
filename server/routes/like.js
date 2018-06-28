const controller = require('../controller');

const router = require('koa-router')({
  prefix: 'like/'
})
router.get('list', controller.like.list);
router.post('insert', controller.like.insert);
router.post('remove', controller.like.remove);

module.exports = router;