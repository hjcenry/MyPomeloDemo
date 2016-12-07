var consts = require('../const/const');
var EntityType = require('../const/const').EntityType;
var Screen = require('../const/const').Screen;
var PlayerInit = require('../const/const').PlayerInit;
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');

module.exports = Player;

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

/**
 * 玩家信息初始化
 */
Player.prototype.init = function () {
    this.radius = PlayerInit.initRadius;
    this.speed = PlayerInit.initSpeed;
    this.position = {
        x: Math.random() * 1000,
        y: Math.random() * 1000
    };
    logger.info("玩家信息初始化:{}", this);
}

/**
 * 玩家移动
 * @param moveX
 * @param moveY
 */
Player.prototype.move = function (moveX, moveY) {
    this.position.x += Number(moveX);
    this.position.y += Number(moveY);
    // 判断左边界
    this.position.x = this.position.x - this.radius < 0 ? this.radiu : this.position.x;
    // 判断右边界
    this.position.x = this.position.x + this.radius > Screen.width ? Screen.width - this.radius : this.position.x;
    // 判断下边界
    this.position.y = this.position.y - this.radius < 0 ? this.radiu : this.position.y;
    // 判断上边界
    this.position.y = this.position.y + this.radius > Screen.height ? Screen.height - this.radius : this.position.y;
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