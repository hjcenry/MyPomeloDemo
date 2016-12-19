var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var mem = pomelo.app.get("memclient");
var utils = require('../util/utils');

var PlayerService = module.exports;

var playesKey = function (rid) {
    return "players_" + rid;
}

/**
 * 根据玩家名字获取玩家信息
 * @param name
 * @param rid
 * @param cb
 */
PlayerService.getPlayerByName = function (name, rid, cb) {
    mem.get(playesKey(rid), function (err, data) {
        var players = data;
        var player = players[name];
        if (err !== null) {
            utils.invokeCallback(cb, err.message, null);
        } else if (!!player) {
            utils.invokeCallback(cb, null, player);
        } else {
            utils.invokeCallback(cb, null, null);
        }
    });
}

/**
 * 获取所有玩家
 * @param rid
 * @param cb
 */
PlayerService.getPlayers = function (rid, cb) {
    mem.get(playesKey(rid), function (err, data) {
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        } else {
            utils.invokeCallback(cb, null, !!!data ? {} : data);
        }
    });
}

/**
 * 添加玩家
 * @param player
 * @param cb
 */
PlayerService.savePlayer = function (player, cb) {
    mem.get(playesKey(player.rid), function (err, data) {
        var players = data;
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        }
        players = players == null ? {} : players;
        players[player.id] = player;
        mem.set(playesKey(player.rid), players);
        utils.invokeCallback(cb, null, player);
    });
}

/**
 * 删除玩家
 * @param player
 * @param cb
 */
PlayerService.deletePlayer = function (username, rid, cb) {
    mem.get(playesKey(rid), function (err, data) {
        var players = data;
        var player = players[username];
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        }
        if (!!players) {
            delete players[username];
            mem.set(playesKey(rid), players);
        }
        utils.invokeCallback(cb, null, player);
    });
}