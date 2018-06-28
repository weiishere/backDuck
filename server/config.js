const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx80e1713338eaa27e',

    // 微信小程序 App Secret
    appSecret: '125308f7e16d0a6ba92ec42d6c8dd871',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,


    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案 
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx80e1713338eaa27e',
        char: 'utf8mb4'
    },
    mysql_local: {
        host: 'localhost',
        user: 'root',
        pass: 'mysqlroot',
        db: 'store_DB',
        port: 3306,
        char: 'utf8mb4'
    },
    imagesHost: 'https://xiu-store-1255815795.cos.ap-chengdu.myqcloud.com/',
    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-chengdu',
        // Bucket 名称
        fileBucket: 'xiu-store',
        // 文件夹
        uploadFolder: 'images/' + (new Date()).toLocaleDateString()
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF

