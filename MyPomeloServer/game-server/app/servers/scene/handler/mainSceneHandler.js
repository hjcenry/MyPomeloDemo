var Event = require('../../../const/const').Event;
var PlayerService = require('../../../service/playerService');
// var Player = require('../../../entity/player');
// var utils = require('../../../util/utils');

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
    var channelService = this.app.get('channelService');
    var param = {
        uid: username,
        moveX: msg.moveX,
        moveY: msg.moveY
    };
    // 玩家执行移动方法
    PlayerService.getPlayerByName(username, rid, function (err, data) {
        var player = data;
        player.move(msg.moveX, msg.moveY);
    });
    // 同步玩家移动消息
    var channel = channelService.getChannel(rid, false);
    channel.pushMessage(Event.move, param, null, next);
};