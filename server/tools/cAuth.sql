

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';


DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imageUrl` varchar(500) NOT NULL,
  `title` varchar(500) NOT NULL,
  `article` text NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='banner信息';

DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `icon` varchar(20) NOT NULL,
  `parentId` int(11) NOT NULL DEFAULT 0,
  `type` varchar(30) NOT NULL DEFAULT 'category',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Menu信息';

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `category` varchar(11) NOT NULL,
  `mainImage` varchar(500) NOT NULL,
  `price` varchar(100) NOT NULL,
  `discount` FLOAT NOT NULL DEFAULT 1,
  `unit` varchar(50) NOT NULL,
  `remark` varchar(800) NULL,
  `recommend` int NOT NULL DEFAULT 0,
  `click` int NULL DEFAULT 0,
  `storage` varchar(50) NULL,
  `introImage`  varchar(1000) NULL,
  `introduction`  text NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品信息';

SET FOREIGN_KEY_CHECKS = 1;

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentId` int(11) NOT NULL DEFAULT 0,
  `key` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `value` varchar(200) NOT NULL DEFAULT 0,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配置信息表';

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `click` int NOT NULL DEFAULT 0,
  `type` int NOT NULL DEFAULT 1,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tag信息';

DROP TABLE IF EXISTS `goods2tag`;
CREATE TABLE `goods2tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tag/Goods级联表信息';

DROP TABLE IF EXISTS `like`;
CREATE TABLE `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL,
  `open_id` varchar(100) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='喜欢收藏表';

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL,
  `content` varchar(200) NOT NULL,
  `agree` int NOT NULL DEFAULT 0,
  `type`  int NOT NULL DEFAULT 1,
  `hideName` int DEFAULT 1,
  `belongId` int(11) NOT NULL DEFAULT 0,
  `style` varchar(50) NOT NULL DEFAULT '0,0,0,1',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) 
)ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='留言表';


insert into tag (`name`) value('美妆口红');
insert into tag (`name`) value('精华美肤');
insert into tag (`name`) value('羊奶粉');
insert into tag (`name`) value('施华洛世奇');

insert into goods2tag (`goodsId`,`tagId`) value(4,1);
insert into goods2tag (`goodsId`,`tagId`) value(4,2);