const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

async function insert(ctx, next) {
    const { open_id, content, hideName, style } = ctx.request.body;
    await DB('message')
        .returning('id')
        .insert({
            open_id: open_id,
            content: content,
            hideName: hideName,
            style: style
        }).then(function (info) {
            ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
        }, function (e) {
            ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
        })
}

async function list(ctx, next) {
    const { thisPage, pageSize } = ctx.query;
    let result = DB('message').select();
    let result2 = DB('message').select('message.content','message.hideName','message.createDate','message.style','cSessionInfo.user_info').join('cSessionInfo', {'message.open_id': 'cSessionInfo.open_id'}).orderBy('createDate', 'desc');
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
    const { id } = ctx.request.body;
    if (!id) {
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB('message').where('id', id).del().then(function (info) {
        ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function updateAgree(ctx, next) {
    const { id } = ctx.request.body;
    if (!id) {
        ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
        return next();
    }
    await DB.raw('UPDATE message SET agree = agree + 1 WHERE id = ' + id).then(function (info) {
        ctx.state = { code: httpCode.successCode, data: 'success', stateCode: httpCode.successCode };
    }, function (e) {
        ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}
module.exports = {
    insert,
    remove,
    updateAgree,
    list
}