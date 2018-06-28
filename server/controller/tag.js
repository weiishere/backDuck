const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

async function insert(ctx, next) {
    const { name } = ctx.request.body;
    await DB('tag')
        .returning('id')
        .insert({
            name: name
        }).then(function (info) {
            ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
        }, function (e) {
            ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
        })
}

async function list(ctx, next) {
    const { ids, hasTagId } = ctx.query;
    let result = ids ? DB('tag').whereIn('id', ids.split(',')) : DB('tag').where(ctx.query);
    result = hasTagId ? result.whereNotIn('tagId', hasTagId) : result;
    await result.then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function remove(ctx, next) {
    const { id } = ctx.request.body;
    if (!id) {
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB('tag').where('id', id).del().then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function update(ctx, next) {
    const { id, name } = ctx.request.body;
    if (!id) {
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB('config').where('id', '=', id)
        .update({
            name: name,
            thisKeyIsSkipped: undefined
        }).then(function (info) {
            ctx.state = { code: httpCode.successCode, data: 'success', stateCode: httpCode.successCode };
        }, function (e) {
            ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
        })
}
module.exports = {
    insert,
    remove,
    update,
    list
}