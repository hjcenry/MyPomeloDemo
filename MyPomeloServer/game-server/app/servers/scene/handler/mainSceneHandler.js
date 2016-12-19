var Event = require('../../../const/const').Event;
var PlayerService = require('../../../service/playerService');
var logger = require('pomelo-logger').getLogger(__filename);
// var Player = require('../../../entity/player');
var utils = require('../../../util/utils');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * 场景中移动
 * @param msg
 * @param session
 * @param next
 */
handler.move = function (msg, session, next) {
    var rid = session.get('rid');
    var username = session.uid.split('*')[0];
    // var channelService = this.app.get('channelService');
    // 玩家执行移动方法
    PlayerService.getPlayerByName(username, rid, function (err, data) {
        var player = data;
        player.move(msg.angle, msg.speed);
    });
    utils.invokeCallback(next);
};