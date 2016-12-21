var PlayerService = require('../service/playerService');
var RoomService = require('../service/roomService');
var Player = require('../entity/player');
var utils = require('../util/utils');
var logger = require('pomelo-logger').getLogger(__filename);
var Event = require('../const/const').Event;
var Tick = require('../const/const').Tick;

var Timer = function (opts, app) {
    this.type = opts.type;
    this.app = app;
    this.interval = opts.interval || 100;
};

module.exports = Timer;

Timer.prototype.run = function () {
    switch (type) {
        case Tick.updateMainScene:
            this.interval = setInterval(this.updateScene.bind(this), this.interval);
            break;
        case Tick.generateBean:
            this.interval = setInterval(this.generateBean.bind(this), this.interval);
            break;
    }
};

/**
 * 生成小豆
 */
Timer.prototype.generateBean = function () {
};

/**
 * 更新主场景
 */
Timer.prototype.updateScene = function () {
    // 获取所有的房间
    RoomService.getRooms(function (err, rooms) {
        if (err != null) {
            logger.error("tick update scene failed,get rooms failed! err", err);
            return;
        }
        // 遍历所有房间
        for (var index in rooms) {
            rid = rooms[index];
            var channelService = this.app.get('channelService');
            var channel = this.channelService.getChannel(rid, false);
            PlayerService.getPlayers(rid, function (err, players) {
                if (err != null) {
                    logger.error("tick update scene failed,get players failed! err", err);
                    return;
                }
                channel.pushMessage(Route.mainSceneUpdateState, {players: players});
            });
        }
    });
};