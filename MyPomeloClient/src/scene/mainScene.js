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
        this.bg = new cc.Layer();
        // 背景图片
        var bgImg = new cc.Sprite(res.bg1);
        bgImg.setAnchorPoint(0, 0);
        bgImg.setScale(Const.Screen.width / bgImg.width, Const.Screen.height / bgImg.height);
        this.bg.addChild(bgImg, 1);
        this.addChild(this.bg);
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
                    type: Const.Entity.player,
                    position: users[username].position
                });
                player.setBg(this.bg);
                player.setBgPosition(users[username].position.x, users[username].position.y);
                this.player = player;
            } else {
                player = new Player({
                    id: username,
                    radius: users[username].radius,
                    type: Const.Entity.other,
                    position: users[username].position
                });
            }
            this.bg.addChild(player, 2, this.userTags[username]);
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
            cc.log("============");
            cc.log(data);
            // 其他玩家的移动方法
            if (data.uid != Userinfo.uid) {
                var userTag = self.userTags[data.uid];
                cc.log(userTag);
                var user = self.bg.getChildByTag(userTag);
                user.setSpeed(data.speed);
                user.setAngle(data.angle);
                user.setPosition(data.x, data.y);
            }
        });
        pomelo.on(Event.enter, function (data) {
            cc.log(data.uid + " enter");
            // 其他玩家进入的方法
            if (data.uid != Userinfo.uid) {
                self.userTags[data.uid] = self.createTag();
                cc.log(self.userTags[data.uid]);
                var player = new Player({
                    id: data.uid,
                    radius: data.radius,
                    type: Const.Entity.other,
                    position: {x: data.x, y: data.y}
                });
                self.bg.addChild(player, 2, self.userTags[data.uid]);
            }
        });
        pomelo.on(Event.leave, function (data) {
            cc.log(data.uid + " leave");
            // 其他玩家离开的方法
            if (data.uid != Userinfo.uid) {
                self.bg.getChildByTag(self.userTags[data.uid]).removeFromParent();
                delete self.userTags[data.uid];
            }
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
        var max = tags.length == 0 ? 1 : Math.max.apply(null, tags) + 1;
        return max;
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