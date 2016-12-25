var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * 客户连接接口
 * @param msg
 * @param session
 * @param next
 */
handler.enter = function (msg, session, next) {
    var self = this;
    var rid = msg.rid;
    var uid = msg.username + '*' + rid;
    var img = msg.img;
    var sessionService = self.app.get('sessionService');

    //duplicate log in
    if (!!sessionService.getByUid(uid)) {
        next(null, {
            code: 500,
            error: true
        });
        return;
    }

    session.bind(uid);
    session.set('rid', rid);
    session.push('rid', function (err) {
        if (err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, self.app));

    //put user into channel
    self.app.rpc.scene.mainSceneRemote.add(session, uid, self.app.get('serverId'), rid, img, true, function (users) {
        next(null, {
            rid: rid,
            users: users
        });
    });
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }
    app.rpc.scene.mainSceneRemote.kick(session, {
            uid: session.uid,
            sid: app.get('serverId'),
            rid: session.get('rid')
        }, function (err) {
            if (!!err) {
                logger.error('user leave error! %j', err);
            }
        }
    )
    ;
};