const { DB } = require('./db');
const httpCode = require('../utils/httpCode');

async function insert(ctx, next) {
  const { name, category, mainImage, price, discount, unit, remark, recommend, storage, introImage, introduction, status } = ctx.request.body;
  await DB('goods')
    .returning('id')
    .insert({
      name: name,
      category: category,
      mainImage: mainImage,
      price: price,
      discount: discount,
      unit: unit,
      remark: remark,
      recommend: recommend,
      storage: storage,
      introImage: introImage,
      introduction: introduction,
      status: status
    }).then(function (info) {
      ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
    }, function (e) {
      ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function list(ctx, next) {
  const { id, thisPage, pageSize, name, category, orderby } = ctx.query;
  if (id) {
    await DB('goods').where({ id: id }).then((info) => {
      ctx.state = { code: httpCode.successCode, data: { list: info, recordCount: 1 }, stateCode: httpCode.successCode };
    })
  } else {
    //查询单个数据才给出详情，列表不给
    let result = name ? DB('goods').where('name', 'like', '%' + escape(name) + '%') : DB('goods');
    let result2 = DB('goods').select('id', 'name', 'category', 'mainImage', 'price', 'discount', 'unit', 'remark', 'recommend', 'storage', 'status', 'createDate');
    if (name) {
      result2 = result2.where('name', 'like', '%' + escape(name) + '%');
    }
    if (category) {
      result = result.where({ category: category });
      result2 = result2.where({ category: category });
    }
    if (orderby) {
      //     orderby = orderby.split(',');

      const order = orderby.split(',');
      // // result = result.orderBy(orderby[0],orderby[1]);
      // // result2 = result2.orderBy(orderby[0],orderby[1]);
      // result = result.orderBy('recommend','desc');
      // result2 = result2.orderBy('recommend','desc');
      result = result.orderBy(...order);
      result2 = result2.orderBy(...order);
    }
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
}

async function listWithLike(ctx, next) {
  const { id, thisPage, pageSize, name, category, orderby, open_id } = ctx.query;
  if (id) {
    await DB('goods').where({ id: id }).then((info) => {
      ctx.state = { code: httpCode.successCode, data: { list: info, recordCount: 1 }, stateCode: httpCode.successCode };
    })
  } else {
    //查询单个数据才给出详情，列表不给
    let result = name ? DB('goods').where('name', 'like', '%' + escape(name) + '%') : DB('goods');
    let result2 = DB('goods').select('goods.id', 'like.id as likeId', 'name', 'category', 'mainImage', 'price', 'discount', 'unit', 'remark', 'recommend', 'storage', 'status', 'goods.createDate').leftJoin('like', function () {
      this.on('goods.id', '=', 'like.goodsId').onIn('like.open_id', [open_id])
    })//.where({ 'like.open_id': open_id }).whereRaw('goods.id=like.goodsId');
    if (name) {
      result2 = result2.where('name', 'like', '%' + escape(name) + '%');
    }
    if (category) {
      result = result.where({ category: category });
      result2 = result2.where({ category: category });
    }
    if (orderby) {
      //     orderby = orderby.split(',');
      const order = orderby.split(',');
      if (order.length === 1) {
        order.push('asc');
      }
      //order[0] = 'goods.' + order[0];
      // // result = result.orderBy(orderby[0],orderby[1]);
      // // result2 = result2.orderBy(orderby[0],orderby[1]);
      // result = result.orderBy('recommend','desc');
      // result2 = result2.orderBy('recommend','desc');

      result = result.orderByRaw('`goods`.`' + order[0] + '` ' + order[1] + ',`goods`.`id` desc');//需要加上id次排序，不然顺序会随机混乱
      result2 = result2.orderByRaw('`goods`.`' + order[0] + '` ' + order[1] + ',`goods`.`id` desc');
      //result = result.orderBy(...order);
      //result2 = result2.orderBy(...order);
    }
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
}


async function remove(ctx, next) {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
    return next();
  }
  await DB('goods').where('id', id).del().then(function (info) {
    ctx.state = { code: httpCode.successCode, data: info, stateCode: httpCode.successCode };
  }, function (e) {
    ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
  })
}

async function update(ctx, next) {
  const { id, name, category, mainImage, price, discount, unit, remark, recommend, storage, introImage, introduction, status } = ctx.request.body;
  if (!id) {
    ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
    return next();
  }
  await DB('goods').where('id', '=', id)
    .update({
      name: name,
      category: category,
      mainImage: mainImage,
      price: price,
      discount: discount,
      unit: unit,
      remark: remark,
      recommend: recommend,
      storage: storage,
      introImage: introImage,
      introduction: introduction,
      status: status,
      thisKeyIsSkipped: undefined
    }).then(function (info) {
      ctx.state = { code: httpCode.successCode, data: 'success', stateCode: httpCode.successCode };
    }, function (e) {
      ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
    })
}

async function updateClick(ctx, next) {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.state = { code: httpCode.paramNullCode, data: 'id参数为空', stateCode: httpCode.paramNullCode };
    return next();
  }
  await DB.raw('UPDATE goods SET click = click + 1 WHERE id = ' + id).then(function (info) {
    ctx.state = { code: httpCode.successCode, data: 'success', stateCode: httpCode.successCode };
  }, function (e) {
    ctx.state = { code: e.sqlState, data: e.sqlMessage, stateCode: httpCode.sqlErrorCode };
  })
}
module.exports = {
  insert,
  remove,
  update,
  list,
  listWithLike,
  updateClick
}