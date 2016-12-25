module.exports = function (app) {
    return new MainSceneRemote(app);
};

var PlayerService = require('../../../service/playerService');
var RoomService = require('../../../service/roomService');
var Player = require('../../../entity/player');
var utils = require('../../../util/utils');
var logger = require('pomelo-logger').getLogger(__filename);
var Event = require('../../../const/const').Event;

var MainSceneRemote = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 * 添加玩家信息
 * @param uid
 * @param sid
 * @param name
 * @param flag
 * @param cb
 */
MainSceneRemote.prototype.add = function (uid, sid, name, img, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    if (flag) {
        RoomService.saveRoom(name);
    }
    var username = uid.split('*')[0];
    // 创建玩家
    var player = new Player({
        id: username,
        rid: name,
        img: img
    });
    player.init();
    // 添加玩家信息
    var self = this;
    PlayerService.savePlayer(player, function (err, data) {
        // 添加到channel
        if (!!channel) {
            channel.add(uid, sid);
        }
        self.get(name, cb);
        channel.pushMessage(Event.enter, {
            uid: data.id,
            img: data.img,
            radius: data.radius,
            x: data.position.x,
            y: data.position.y
        });
    });
}

/**
 * 获取所有玩家
 * @param name
 * @param cb
 */
MainSceneRemote.prototype.get = function (name, cb) {
    PlayerService.getPlayers(name, function (err, data) {
        var users = data;
        logger.info(JSON.stringify(users));
        utils.invokeCallback(cb, users);
    })
};

/**
 * 踢出玩家
 * @param uid
 * @param sid
 * @param name
 */
MainSceneRemote.prototype.kick = function (args, cb) {
    var uid = args.uid;
    var sid = args.sid;
    var rid = args.rid;
    var channel = this.channelService.getChannel(rid, false);
    // leave channel
    if (!!channel) {
        channel.leave(uid, sid);
        if (channel.getMembers().length == 0) {
            // 房间没有人时销毁房间
            RoomService.deleteRoom(rid);
            channel.destroy();
        }
    }
    PlayerService.deletePlayer(uid.split("*")[0], rid, function (err, data) {
        channel.pushMessage(Event.leave, {
            uid: data.id
        });
        utils.invokeCallback(cb, err);
    });
};
