/**
 * 小程序配置文件
 */
//var host = "http://localhost:5757";
// 此处主机域名修改成腾讯云解决方案分配的域名
const localTest = false;
//var host = localTest ? "http://localhost:5757" : "https://q0ymddaf.qcloud.la";
var host = 'http://118.25.217.48:9881';
var config = {
  localTest: localTest,
  API: {
    user: {
      login: `${host}/user/login/oauth`,
      verification: `${host}/sms/get/verification/code`,
      bindPhone: `${host}/user/binding/phone`
    }
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