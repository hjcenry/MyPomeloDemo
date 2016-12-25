var Player = cc.Sprite.extend({
    id: "",
    radius: 0,
    speed: 0,
    angle: 0,
    type: "",
    img: 0,
    bg: null,
    pomelo: Global.pomelo,
    ctor: function (opt) {
        this._super();
        this.id = opt.id;
        this.type = opt.type;
        this.img = opt.img;
        this.radius = !!opt.radius ? opt.radius : this.radius;
        this.speed = !!opt.speed ? opt.speed : this.speed;
        this.setTexture("res/ball" + this.img + ".png");
        this.setScale(this.radius * 2 / this.width, this.radius * 2 / this.height);
        // 小球坐标
        this.x = opt.position.x;
        this.y = opt.position.y;
        //  玩家id
        var nameLabel = new cc.LabelTTF(this.id, "微软雅黑", 20);
        nameLabel.setPosition(this.radius, this.radius * 2 + 50);
        this.addChild(nameLabel);
        // 定时更新
        this.scheduleUpdate();
        return true;
    },
    setSpeed: function (speed) {
        if (this.type == Const.Entity.player) {
            // 速度计算公式（随便写的，大致速度差不多就行。。。）
            this.speed = Const.Screen.width / 10 * speed / (Const.Screen.width / 10);
            // 通知服务端移动操作
            this.notifyServerMove(this.angle, this.speed);
        } else {
            this.speed = speed;
        }
    },
    getSpeed: function () {
        return this.speed * (Const.Screen.width / 10) / (Const.Screen.width / 10)
    },
    setAngle: function (angle) {
        // 计算角度
        this.angle = angle;
        // 通知服务端移动操作
        this.notifyServerMove(this.angle, this.speed);
    },
    getAngle: function () {
        return this.angle;
    },
    setBgPosition: function (x, y) {
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
    notifyServerMove: function (angle, speed) {
        if (this.type == Const.Entity.player) {
            cc.log("notify server move angle[", angle, "],speed[", speed, "]");
            this.pomelo.notify(Route.move, {
                angle: angle,
                speed: speed,
                position: {x: this.x, y: this.y}
            }, function (err) {
                if (err != null) {
                    cc.log("move update err:" + err);
                }
            });
        }
    },
    moveX: function (moveX) {
        if (this.type == Const.Entity.player) {
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
        if (this.type == Const.Entity.player) {
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
        this.moveX(moveX);
        this.moveY(moveY);
    },
    onMove: function (player) {
        this.angle = player.angle;
        this.speed = player.speed;
        this.setPosition(player.x, player.y);
    }
});