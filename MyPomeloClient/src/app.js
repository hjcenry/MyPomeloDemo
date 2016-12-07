var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    userNameHint: "请输入用户名",
    roomHint: "请输入房间号",
    ctor: function () {
        this._super();
        var size = cc.winSize;
        // 标题
        var title = new cc.LabelTTF("MyPomeloDemo", "微软雅黑", 50);
        title.setPosition(size.width / 2, size.height * 3 / 4);
        this.addChild(title);
        // 用户名
        var userNameLabel = new cc.LabelTTF("用户名：", "微软雅黑", 30);
        var userNameInput = new cc.EditBox(cc.size(300.00, userNameLabel.height), new cc.Scale9Sprite("res/orange_edit.png"), new cc.Scale9Sprite("res/orange_edit.png"));
        userNameInput.setString(this.userNameHint);
        userNameInput.setFontColor(cc.color(119, 136, 153));
        userNameInput.setDelegate(this);
        this.addChild(userNameLabel);
        this.addChild(userNameInput);
        userNameLabel.x = size.width / 2 - userNameInput.width / 2 - userNameLabel.width / 2 + userNameLabel.width / 2;
        userNameInput.x = size.width / 2 - userNameInput.width / 2 - userNameLabel.width / 2 + userNameLabel.width + userNameInput.width / 2;
        userNameInput.y = title.getPositionY() - title.height / 2 - userNameInput.height / 2 - 20;
        userNameLabel.y = title.getPositionY() - title.height / 2 - userNameInput.height / 2 - 20;
        // 房间号
        var roomLabel = new cc.LabelTTF("房间号：", "微软雅黑", 30);
        var roomInput = new cc.EditBox(cc.size(300.00, userNameLabel.height), new cc.Scale9Sprite("res/orange_edit.png"), new cc.Scale9Sprite("res/orange_edit.png"));
        roomInput.setString(this.roomHint);
        roomInput.setFontColor(cc.color(119, 136, 153));
        roomInput.setDelegate(this);
        this.addChild(roomLabel);
        this.addChild(roomInput);
        roomLabel.x = size.width / 2 - roomInput.width / 2 - roomLabel.width / 2 + roomLabel.width / 2;
        roomInput.x = size.width / 2 - roomInput.width / 2 - roomLabel.width / 2 + roomLabel.width + roomInput.width / 2;
        roomInput.y = userNameLabel.getPositionY() - userNameLabel.height / 2 - roomInput.height / 2 - 20;
        roomLabel.y = userNameLabel.getPositionY() - userNameLabel.height / 2 - roomInput.height / 2 - 20;
        // 登录按钮
        var startBtn = new cc.MenuItemSprite(new cc.Sprite("res/btn-test-0.png"), new cc.Sprite("res/btn-test-1.png"), new cc.Sprite("res/btn-test-0.png"), function () {
            var userName = userNameInput.getString();
            var room = roomInput.getString();
            var flag = true;
            // 用户名合法性检查
            if (userName == this.userNameHint || userName.length == 0) {
                this.showError("请输入用户名", userNameInput.x, userNameInput.y);
                flag = false;
            }
            // 房间号合法性检查
            if (room == this.roomHint || room.length == 0) {
                this.showError("请输入房间号", roomInput.x, roomInput.y);
                flag = false;
            }
            if (!!flag) {
                // 输入合法，进入游戏场景
                this.enterMainScene(userName, room);
            }
        }, this);
        startBtn.x = size.width / 2;
        startBtn.y = roomLabel.getPositionY() - roomLabel.height / 2 - roomInput.height / 2 - 40;
        // 登录按钮文字
        var startLabel = new cc.LabelTTF("进入房间", "微软雅黑", 20);
        startLabel.x = startBtn.x;
        startLabel.y = startBtn.y;
        this.addChild(startLabel, 10);
        var menu = new cc.Menu(startBtn);
        menu.setAnchorPoint(0, 0);
        menu.setPosition(0, 0);
        this.addChild(menu);
        return true;
    },
    showError: function (errText, x, y) {
        var alertLabel = new cc.LabelTTF(errText);
        alertLabel.setPosition(x, y);
        this.addChild(alertLabel);
        alertLabel.setColor(new cc.Color(255, 0, 0, 255));
        alertLabel.runAction(new cc.sequence(new cc.spawn(new cc.fadeOut(1), new cc.moveBy(1, cc.p(0, 20))), new cc.callFunc(function (alertLabel) {
            alertLabel.removeFromParent();
        }, this, alertLabel)));
    },
    enterMainScene: function (userName, room) {
        cc.log("enter main scene username:" + userName + ",room " + room + "");
        // 请求pomelo服务器
        //query entry of connection
        this.queryEntry(userName, function (host, port) {
            pomelo.init({
                host: host,
                port: port,
                log: true
            }, function () {
                var route = "connector.entryHandler.enter";
                pomelo.request(route, {
                    username: userName,
                    rid: room
                }, function (data) {
                    if (data.error) {
                        this.showError(data.error);
                        return;
                    }
                    // setName();
                    // setRoom();
                    // showChat();
                    // initUserList(data);
                    cc.log(data);
                    cc.log(data.users);
                    cc.director.runScene(new cc.TransitionFade(2, new MainScene()));
                });
            });
        });
    },
    queryEntry: function (uid, callback) {
        var route = 'gate.gateHandler.queryEntry';
        Global.pomelo.init({
            host: NetConfig.gateHost,
            port: NetConfig.gatePort,
            log: true
        }, function () {
            cc.log("call back");
            Global.pomelo.request(route, {
                uid: uid
            }, function (data) {
                cc.log(data);
                Global.pomelo.disconnect();
                if (data.code === 500) {
                    this.showError(data.error);
                    return;
                }
                callback(data.host, data.port);
            });
        });
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
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

