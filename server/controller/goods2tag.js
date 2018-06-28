const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

function insert({ goodsId, tagIds }) {
    //const { goodsId, tagIds } = ctx.request.body;
    let arr = [];
    tagIds.forEach(item => {
        arr.push({ goodsId: goodsId, tagId: item });
    });
    return DB('goods2tag').returning('id').insert(arr);
}
async function list(ctx, next) {
    const { goodsId, tagId } = ctx.query;
    let result = DB('goods2tag');
    result = goodsId ? result.where('goodsId', goodsId) : result;
    result = tagId ? result.whereIn('tagId', tagId) : result;
    //result = hasTagId ? result.whereNotIn('tagId', hasTagId) : result;
    await result.then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

 function remove({ goodsId }) {
    //const { goodsId } = ctx.request.body;
    if (!goodsId) {
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    return DB('goods2tag').where('goodsId', goodsId).del();
}
async function update(ctx, next) {
    const { goodsId, tagIds } = ctx.request.body;
    //先删后加
    // const callback = function () {
    //     const callback2 = function () {
    //         ctx.state = { code: httpCode.successCode, data: 'success', stateCode: httpCode.successCode };
    //     }
    //     insert({ goodsId: goodsId, tagIds: tagIds.split(','), callback2 });
    // }

    await remove({ goodsId: goodsId });
    await insert({ goodsId: goodsId, tagIds: tagIds.split(',') }).then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    });
}

module.exports = {
    update,
    list
}