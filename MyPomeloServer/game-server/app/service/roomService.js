var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var mem = pomelo.app.get("memclient");
var utils = require('../util/utils');

var RoomService = module.exports;

var roomKey = function () {
    return "room";
}

/**
 * 获取所有房间
 * @param cb
 */
RoomService.getRooms = function (cb) {
    mem.get(roomKey(), function (err, data) {
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        } else {
            utils.invokeCallback(cb, null, !!!data ? {} : data);
        }
    });
}

/**
 * 保存房间
 * @param rid
 * @param cb
 */
RoomService.saveRoom = function (rid, cb) {
    mem.get(roomKey(), function (err, data) {
        var rooms = data;
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        }
        rooms = rooms == null ? [] : rooms;
        if (rooms.indexOf(rid) == -1) {
            rooms.push(rid);
        }
        mem.set(roomKey(), rooms);
        utils.invokeCallback(cb, null, rid);
    });
}

/**
 * 删除房间
 * @param rid
 * @param cb
 */
RoomService.deleteRoom = function (rid, cb) {
    mem.get(roomKey(), function (err, data) {
        var rooms = data;
        if (err != null) {
            utils.invokeCallback(cb, err.message, null);
        }
        if (!!rooms) {
            rooms.splice(rooms.indexOf(rid), 1);
            mem.set(roomKey(), rooms);
        }
        utils.invokeCallback(cb, null, rid);
    });
}