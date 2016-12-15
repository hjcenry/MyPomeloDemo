var Player = cc.Sprite.extend({
    id: "",
    radius: 0,
    speed: 0,
    angle: 0,
    type: "",
    bg: null,
    pomelo: Global.pomelo,
    ctor: function (opt) {
        this._super();
        this.id = opt.id;
        this.type = opt.type;
        this.radius = !!opt.radius ? opt.radius : this.radius;
        this.speed = !!opt.speed ? opt.speed : this.speed;
        var ballImgRandom = Math.ceil(Math.random() * 4);
        this.setTexture("res/ball" + ballImgRandom + ".png");
        this.setScale(this.radius * 2 / this.width, this.radius * 2 / this.height);
        if (this.type == Const.Entity.player) {
            this.scheduleUpdate();
        }
        return true;
    },
    setSpeed: function (speed) {
        // 速度计算公式（随便写的，大致速度差不多就行。。。）
        this.speed = Const.Screen.width / 10 * speed / (Const.Screen.width / 10);
    },
    getSpeed: function () {
        return this.speed * (Const.Screen.width / 10) / (Const.Screen.width / 10)
    },
    setAngle: function (angle) {
        // 计算角度
        this.angle = angle;
    },
    getAngle: function () {
        return this.angle;
    },
    setBgPosition: function (x, y) {
        // 小球坐标
        this.x = x;
        this.y = y;
        // 背景图坐标
        this.bg.x = (-1) * (this.x - cc.winSize.width / 2);
        this.bg.y = (-1) * (this.y - cc.winSize.height / 2);
        // 超出左边界
        this.bg.x = this.bg.x > 0 ? 0 : this.bg.x;
        // 超出右边界
        this.bg.x = this.bg.x < (-1) * (Const.Screen.width - cc.winSize.width) ? (-1) * (Const.Screen.width - cc.winSize.width) : this.bg.x;
        // 超出下边界
        this.bg.y = this.bg.y > 0 ? 0 : this.bg.y;
        // 超出上边界
        this.bg.y = this.bg.y < (-1) * (Const.Screen.height - cc.winSize.height) ? (-1) * (Const.Screen.height - cc.winSize.height) : this.bg.y;
    },
    setBg: function (bg) {
        this.bg = bg;
    },
    getWinSizeX: function () {
        return this.x + this.bg.x;
    },
    getWinSizeY: function () {
        return this.y + this.bg.y;
    },
    moveX: function (moveX) {
        if (this.type = Const.Entity.player) {
            var calBgMoveX = this.bg.x - moveX;
            // 背景层下边界判断
            calBgMoveX = calBgMoveX > 0 ? 0 : calBgMoveX;
            // 背景层上边界判断
            calBgMoveX = calBgMoveX < (-1) * (Const.Screen.width - cc.winSize.width) ? (-1) * (Const.Screen.width - cc.winSize.width) : calBgMoveX;
            if (this.getWinSizeX() >= cc.winSize.width / 2 - 10 && this.getWinSizeX() <= cc.winSize.width / 2 + 10) {
                this.bg.x = calBgMoveX;
            }
        }
        var calMoveX = this.x + moveX;
        // 小球下边界判断
        calMoveX = calMoveX < this.radius ? this.radius : calMoveX;
        // 小球上边界判断
        calMoveX = calMoveX > Const.Screen.width - this.radius ? Const.Screen.width - this.radius : calMoveX;
        this.x = calMoveX;
    },
    moveY: function (moveY) {
        if (this.type = Const.Entity.player) {
            var calBgMoveY = this.bg.y - moveY;
            // 背景层下边界判断
            calBgMoveY = calBgMoveY > 0 ? 0 : calBgMoveY;
            // 背景层上边界判断
            calBgMoveY = calBgMoveY < (-1) * (Const.Screen.height - cc.winSize.height) ? (-1) * (Const.Screen.height - cc.winSize.height) : calBgMoveY;
            if (this.getWinSizeY() >= cc.winSize.height / 2 - 10 && this.getWinSizeY() <= cc.winSize.height / 2 + 10) {
                this.bg.y = calBgMoveY;
            }
        }
        var calMoveY = this.y + moveY;
        // 小球下边界判断
        calMoveY = calMoveY < this.radius ? this.radius : calMoveY;
        // 小球上边界判断
        calMoveY = calMoveY > Const.Screen.height - this.radius ? Const.Screen.height - this.radius : calMoveY;
        this.y = calMoveY;
    },
    update: function (dt) {
        var moveX = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var moveY = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        var startBgX = this.bg.x;
        var startBgY = this.bg.y;
        var startX = this.x;
        var startY = this.y;
        this.moveX(moveX);
        this.moveY(moveY);
        // 背景图或小球发生位移，则发送服务端通知
        var isBgMoveX = startBgX == this.bg.x;
        var isBgMoveY = startBgY == this.bg.y;
        var isMoveX = startX == this.x;
        var isMoveY = startY == this.y;
        if (isBgMoveX || isBgMoveY || isMoveX || isMoveY) {
            // 通知服务端移动操作
            this.pomelo.notify(Route.move, {angle: this.angle, speed: this.speed}, function (err) {
                if (!!err) {
                    cc.log("move update err:" + err)
                }
            });
        }
    }
    ,
    onMove: function (x, y) {
        this.setPosition(x, y);
    }
});