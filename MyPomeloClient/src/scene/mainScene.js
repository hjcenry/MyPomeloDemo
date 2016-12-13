var MainSceneLayer = cc.Layer.extend({
    sprite: null,
    size: cc.winSize,
    rid: 0,
    userTags: {},
    player: {},
    bg: null,
    ctor: function (rid, users) {
        this._super();
        this.rid = rid;
        // 背景层
        this.bg = new MainBg();
        this.addChild(this.bg);
        // 房间号
        var roomLabel = new cc.LabelTTF("房间号：" + this.rid, "微软雅黑", 30);
        roomLabel.setPosition(roomLabel.width / 2 + 20, this.size.height - roomLabel.height / 2 - 20);
        this.addChild(roomLabel);
        // 玩家
        for (var username in users) {
            userTags[username] = userTags.length + 1;
            if (username == Userinfo.uid) {
                this.setUserInfo(users[username]);
                this.player = this.createPlayer({
                    id: username,
                    type: Const.Entity.player
                });
            } else {
                this.createPlayer({
                    id: username,
                    type: Const.Entity.other
                });
            }
            this.player.setPosition(users[username].position.x, users[username].position.y);
            this.bg.addChild(this.player);
        }
        // 虚拟摇杆
        var controller = new Controller(res.controllerBG_png, res.controller_png, 50, TouchType.FOLLOW, DirectionType.ALL, roomLabel);
        controller.setPosition(cc.p(100, 100));
        controller.setSpeedwithLevel1(1);
        controller.setSpeedwithLevel2(2);
        //controller.setOpacity(128);
        //controller.setEnable(true);
        controller.callback = this.onCallback.bind(this);
        this.addChild(controller, 0, 101);
        return true;
    },
    setUserInfo: function (player) {
        // 设置用户信息
        Userinfo.radius = player.radius;
        Userinfo.speed = player.speed;
        Userinfo.position.x = player.position.x;
        Userinfo.position.y = player.position.y;
    },
    onCallback: function () {
        var angle = this.getChildByTag(101).getAngle();
        cc.log("回调:" + angle);
    },
    createPlayer: function (opt) {
        var player = new Player(opt);
        return player;
    }
});

var MainScene = cc.Scene.extend({
    rid: 0,
    users: {},
    ctor: function (rid, users) {
        this._super();
        this.rid = rid;
        this.users = users;
        return true;
    },
    onEnter: function () {
        this._super();
        var layer = new MainSceneLayer(this.rid, this.users);
        this.addChild(layer);
    }
});

var pomeloChat = function () {
    var pomelo = window.pomelo;
    var host = "127.0.0.1";
    var port = "3010";
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function () {
        pomelo.request("connector.entryHandler.entry", "hello pomelo", function (data) {
            alert(data.msg);
        });
    });
}

