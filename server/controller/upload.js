module.exports = async ctx => {
    // 获取上传之后的结果
    // 具体可以查看：
    try {
        const { uploader } = require('../qcloud')
        const data = await uploader(ctx.req)
        ctx.state.data = data
    } catch (e) {
        ctx.state.data = 'error';
    }

}
