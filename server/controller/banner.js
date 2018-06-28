const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

async function insert(ctx, next) {
    const { imageUrl, title, article } = ctx.request.body;
    await DB('banners')
        .returning('id')
        .insert({
            imageUrl: imageUrl,
            title: title,
            article: article
        }).then(function (info) {
            ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
        }, function (e) {
            ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
        })
}

async function list(ctx, next) {
    const { id } = ctx.query;
    const result = DB('banners').where(ctx.query);
    await result.then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function remove(ctx, next) {
    const { id } = ctx.request.body;
    if(!id){
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB('banners').where('id', id).del().then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function update(ctx, next) {
    const { id, imageUrl, title, article } = ctx.request.body;
    if(!id){
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB('banners').where('id', '=', id)
        .update({
            imageUrl: imageUrl,
            title: title,
            article: article,
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