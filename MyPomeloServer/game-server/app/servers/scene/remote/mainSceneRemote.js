module.exports = function (app) {
    return new MainSceneRemote(app);
};

var PlayerService = require('../../../service/playerService');
var Player = require('../../../entity/player');
var utils = require('../../../util/utils');

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
MainSceneRemote.prototype.add = function (uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];
    // 创建玩家
    var player = new Player({
        id: username,
        rid: name
    });
    // 添加玩家信息
    PlayerService.addPlayer(player, function (err, data) {
        var param = {
            route: 'onAdd',
            user: data
        };
        channel.pushMessage(param);
    });
    // 添加到channel
    if (!!channel) {
        channel.add(uid, sid);
    }
    this.get(name, cb);
};

/**
 * 获取所有玩家
 * @param name
 * @param cb
 */
MainSceneRemote.prototype.get = function (name, cb) {
    PlayerService.getPlayers(name, function (err, data) {
        var users = {users: data};
        utils.invokeCallback(cb, err, users);
    })
};

/**
 * 踢出玩家
 * @param uid
 * @param sid
 * @param name
 */
MainSceneRemote.prototype.kick = function (uid, sid, name) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if (!!channel) {
        channel.leave(uid, sid);
    }
    PlayerService.deletePlayer(uid, name, function (err, data) {
        var player = data;
        var param = {
            route: 'onLeave',
            user: player
        };
        channel.pushMessage(param);
    });
};
