var MainSceneLayer = cc.Layer.extend({
    sprite: null,
    size: cc.winSize,
    ctor: function () {
        this._super();
        var bg = new cc.Sprite("res/background.png");
        bg.setScale(this.size.width / bg.width, this.size.height / bg.height);
        this.addChild(bg);
        bg.x = this.size.width / 2;
        bg.y = this.size.height / 2;
        return true;
    }
});

var MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainSceneLayer();
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

