const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

async function insert(ctx, next) {
  const { goodsId, open_id } = ctx.request.body;
  await DB('like')
    .returning('id')
    .insert({
      goodsId: goodsId,
      open_id: open_id
    }).then(function (info) {
      ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
      ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function list(ctx, next) {
  const { thisPage, pageSize, open_id } = ctx.query;
  let result = DB('like').select().leftJoin('goods', 'like.goodsId', 'goods.id').where({ 'like.open_id': open_id }).whereRaw('goods.id=like.goodsId');





  let result2 = DB('like').select(
    'goods.id as goodsId',
    'like.id as likeId',
    'like.goodsId as likeGoodsId',
    'goods.name as name',
    'goods.category as category',
    'goods.mainImage as mainImage',
    'goods.price',
    'goods.discount',
    'goods.unit',
    'goods.remark',
    'goods.recommend',
    'goods.storage',
    'goods.status',
    'open_id',
    'goods.createDate')
    .leftJoin('goods', function () {
      this.on('like.goodsId', '=', 'goods.id')
    }).where({ 'like.open_id': open_id }).whereRaw('goods.id=like.goodsId').orderBy('like.createDate', 'desc');
  let _count = 0;
  await result.count().then((count) => {
    _count = count[0]['count(*)'];
    return result2.limit(pageSize).offset(pageSize * (thisPage - 1));
  }).then(function (info) {
    ctx.state = { code: httpCode.successCode, data: { list: info, recordCount: _count }, stateCode: httpCode.successCode };
  }, function (e) {
    ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
  })
}

async function remove(ctx, next) {
  const { id, open_id, goodsId } = ctx.request.body;
  const result = id ? DB('like').where('id', id) : DB('like').where('open_id', open_id).where('goodsId', goodsId)
  await result.del().then(function (info) {
    ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
  }, function (e) {
    ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
  })
}

module.exports = {
  insert,
  remove,
  list
}