/**
 * 小程序配置文件
 */
//var host = "http://localhost:5757";
// 此处主机域名修改成腾讯云解决方案分配的域名
const localTest = false;
var host = localTest ? "http://localhost:5757" : "https://q0ymddaf.qcloud.la";

var config = {
  localTest: localTest,
  goodsApi: {
    list: `${host}/weapp/goods/list`,
    listWithLike: `${host}/weapp/goods/listWithLike`,
    insert: `${host}/weapp/goods/insert`,
    remove: `${host}/weapp/goods/remove`,
    update: `${host}/weapp/goods/update`
  },
  bannerApi: {
    list: `${host}/weapp/banner/list`,
    insert: `${host}/weapp/banner/insert`,
    remove: `${host}/weapp/banner/remove`,
    update: `${host}/weapp/banner/update`
  },
  menuApi: {
    list: `${host}/weapp/menu/list`,
    insert: `${host}/weapp/menu/insert`,
    remove: `${host}/weapp/menu/remove`,
    update: `${host}/weapp/menu/update`
  },
  tagApi: {
    list: `${host}/weapp/tag/list`,
    insert: `${host}/weapp/tag/insert`,
    remove: `${host}/weapp/tag/remove`,
    update: `${host}/weapp/tag/update`
  },
  goods2tagApi: {
    list: `${host}/weapp/goods2tag/list`,
    update: `${host}/weapp/goods2tag/update`
  },
  messageApi: {
    list: `${host}/weapp/message/list`,
    insert: `${host}/weapp/message/insert`,
    remove: `${host}/weapp/message/remove`,
    updateAgree: `${host}/weapp/message/update`
  },
  likeApi: {
    list: `${host}/weapp/like/list`,
    insert: `${host}/weapp/like/insert`,
    remove: `${host}/weapp/like/remove`
  },
  // 下面的地址配合云端 Demo 工作
  testUserInfo: {
    avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epxVr7z9CqDj3CxiakheCCh9YRB5J1v5Ao2mn5zJsKhEx9OLSicGTdBicibIZmIrHars4pZ6zXshKcDug/0",
    city: "Chengdu",
    country: "China",
    gender: 1,
    language: "zh_CN",
    nickName: "Yellow great",
    openId: "ogCv50Lz9Yn2v6sEBx9gt6VId1Zs",
    province: "Sichuan"
  },
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    //tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`
  }
};

module.exports = config;
