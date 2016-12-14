var MainSceneLayer = cc.Layer.extend({
    sprite: null,
    size: cc.winSize,
    rid: 0,
    userTags: {},
    player: {},
    bg: null,
    ctor: function (rid, users) {
        this._super();
        var self = this;
        // 玩家
        cc.log("users:", users);
        this.rid = rid;
        // 背景层
        this.bg = new cc.LayerColor(new cc.color(100, 100, 100, 255), Const.Screen.width, Const.Screen.height);
        // 背景图片
        var bgImg = new cc.Sprite(res.background);
        bgImg.setAnchorPoint(0, 0);
        bgImg.setScale(Const.Screen.width / this.width, Const.Screen.width / this.height);
        this.bg.addChild(bgImg, 1);
        this.addChild(this.bg, 1);
        // 房间号
        var roomLabel = new cc.LabelTTF("房间号：" + this.rid, "微软雅黑", 30);
        roomLabel.setPosition(roomLabel.width / 2 + 20, this.size.height - roomLabel.height / 2 - 20);
        this.addChild(roomLabel);
        for (var username in users) {
            this.userTags[username] = this.createTag();
            var player;
            if (username == Userinfo.uid) {
                this.setUserInfo(users[username]);
                player = new Player({
                    id: username,
                    radius: users[username].radius,
                    type: Const.Entity.player
                });
                player.setBg(this.bg);
                this.player = player;
            } else {
                player = new Player({
                    id: username,
                    radius: users[username].radius,
                    type: Const.Entity.other
                });
            }
            player.setBgPosition(users[username].position.x, users[username].position.y);
            this.bg.addChild(player, 2);
        }
        // 虚拟摇杆
        var controller = new Controller(res.controllerBG_png, res.controller_png, 50, TouchType.FOLLOW, DirectionType.ALL, this.player);
        controller.setPosition(cc.p(100, 100));
        controller.setSpeedwithLevel1(1);
        controller.setSpeedwithLevel2(2);
        controller.setOpacity(128);
        controller.setEnable(true);
        this.addChild(controller, 10, 101);
        pomelo.on(Event.move, function (data) {
            // 其他玩家的移动方法
            var userTag = self.userTags[data.uid];
            var user = self.getChildByTag(userTag);
            user.setPosition(data.x, data.y);
        });
        pomelo.on(Event.enter, function (data) {
            // 其他玩家进入的方法
            if (data.uid != Userinfo.uid) {
                var player = new player({
                    id: data.uid,
                    radius: data.radius,
                    type: Const.Entity.other
                });
                player.setBgPosition(data.x, data.y);
                self.bg.addChild(player);
            }
        });
        pomelo.on(Event.leave, function (data) {
            // 其他玩家离开的方法
            self.getChildByTag(self.userTags[data.uid]).removeFromParent();
            delete self.userTags[data.uid];
        });
        return true;
    },
    createTag: function () {
        var tags = [];
        if (this.userTags.length == 0) {
            return 1;
        }
        for (var username in this.userTags) {
            tags.push(this.userTags[username]);
        }
        return Math.max.apply(null, tags) + 1;
    },
    setUserInfo: function (player) {
        // 设置用户信息
        Userinfo.radius = player.radius;
        Userinfo.speed = player.speed;
        Userinfo.position.x = player.position.x;
        Userinfo.position.y = player.position.y;
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

