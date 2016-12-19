var consts = require('../const/const');
var EntityType = require('../const/const').EntityType;
var Screen = require('../const/const').Screen;
var PlayerInit = require('../const/const').PlayerInit;
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var utils = require('../util/utils');
var PlayerService = require('../service/playerService');

/**
 * 构造玩家信息
 * @param opts json格式参数
 * @constructor
 */
var Player = function (opts) {
    this.id = opts.id;
    this.rid = opts.rid;
    this.init();
};

module.exports = Player;

/**
 * 玩家信息初始化
 */
Player.prototype.init = function () {
    this.type = EntityType.player;
    this.radius = PlayerInit.initRadius;
    this.speed = PlayerInit.initSpeed;
    this.position = {
        x: Math.random() * 1000 - PlayerInit.initRadius,
        y: Math.random() * 1000 - PlayerInit.initRadius
    };
    logger.info("玩家信息初始化:\r\n", this);
}

/**
 * 玩家移动
 * @param moveX
 * @param moveY
 */
Player.prototype.move = function (angle, speed) {
    var moveX = Math.cos(angle * (Math.PI / 180)) * speed;
    var moveY = Math.sin(angle * (Math.PI / 180)) * speed;
    this.position.x += moveX;
    this.position.y += moveY;
    // 判断左边界
    this.position.x = this.position.x - this.radius < 0 ? this.radius : this.position.x;
    // 判断右边界
    this.position.x = this.position.x + this.radius > Screen.width ? Screen.width - this.radius : this.position.x;
    // 判断下边界
    this.position.y = this.position.y - this.radius < 0 ? this.radius : this.position.y;
    // 判断上边界
    this.position.y = this.position.y + this.radius > Screen.height ? Screen.height - this.radius : this.position.y;
    // 同步到缓存
    PlayerService.savePlayer(this);
}

/**
 * 失败，玩家信息重置
 */
Player.prototype.lose = function () {
    this.init();
}

/**
 * 胜利，增大半径，减少速度
 * @param radius
 */
Player.prototype.win = function (radius) {
    this.radius += radius;
    this.speed -= radius;
    this.radius = this.radius > 1 ? this.radius : 1;
}