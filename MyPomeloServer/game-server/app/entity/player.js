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
Player.prototype.move = function (angle, speed) {
    // 计算之前角度与速度的位移
    var timestamp = new Date().getTime();
    var frame = Math.round((timestamp - this.timestamp) / (1000 / 60));// 经过的帧
    if (frame > 0) {
        var moveX = Math.cos(this.angle * (Math.PI / 180)) * this.speed * frame;
        var moveY = Math.sin(this.angle * (Math.PI / 180)) * this.speed * frame;
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
        this.timestamp = timestamp;
    }
    this.angle = angle;
    this.speed = speed;
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