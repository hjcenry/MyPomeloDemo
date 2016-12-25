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
    this.img = opts.img;
    this.type = opts.type;
    this.radius = opts.radius;
    this.speed = opts.speed;
    this.angle = opts.angle;
    this.timestamp = opts.timestamp;
    this.position = opts.position;
};

module.exports = Player;

/**
 * 玩家信息初始化
 */
Player.prototype.init = function () {
    this.type = EntityType.player;
    this.radius = PlayerInit.initRadius;
    this.speed = PlayerInit.initSpeed;
    this.angle = PlayerInit.initAngle;
    this.timestamp = new Date().getTime();
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
Player.prototype.move = function (angle, speed, position) {
    this.angle = angle;
    this.speed = speed;
    this.position.x = position.x;
    this.position.y = position.y;
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