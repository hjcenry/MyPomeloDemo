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
        return true;
    },
    onEnter: function () {
        this._super();
        this.setTexture(res.ball_png);
        this.setScale(radius * 2 / this.width, radius * 2 / this.height);
        if (this.type == Const.Entity.player) {
            this.scheduleUpdate();
        }
        return true;
    },
    setSpeed: function (speed) {
        // 速度计算公式（随便写的，大致速度差不多就行。。。）
        this.speed = Const.Screen.width / 10 * speed / (Const.Screen.width / 10);
    },
    setAngle: function (angle) {
        this.angle = angle;
    },
    setBgPosition: function (x, y) {
        this.position.x = (-1) * (Const.Screen.width / 2 - cc.winSize.width / 2);
        this.position.y = (-1) * (Const.Screen.height / 2 - cc.winSize.height / 2);
    },
    update: function (dt) {
        var moveX = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var moveY = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        // 背景层反方向移动
        var startX = this.bg.x;
        var startY = this.bg.y;
        this.bg.x += (-1) * moveX;
        this.bg.y += (-1) * moveY;
        // 背景层左边界判断
        this.bg.x = (this.bg.x >= Const.Screen.width / 2) ? Const.Screen.width / 2 : this.bg.x;
        // 背景层右边界判断
        this.bg.x = (Math.abs(this.bg.x) + cc.winSize.width >= Const.Screen.width / 2) ? (-1) * (Const.Screen.width / 2 - cc.winSize.width) : this.bg.x;
        // 背景层上边界判断
        this.bg.y = (Math.abs(this.bg.y) + cc.winSize.height >= Const.Screen.height / 2) ? (-1) * (Const.Screen.height / 2 - cc.winSize.height) : this.bg.y;
        // 背景层下边界判断
        this.bg.y = (this.bg.getPositionY() + (-1) * moveY >= Const.Screen.height / 2) ? Const.Screen.height : this.bg.y;
        if (startX != this.bg.x && (this.x < cc.winSize.width / 2 || this.x > cc.winSize.width / 2)) {
            this.bg.x + moveX;// 背景层归位
            this.x += moveX;// 移动小球
            this.x = this.x - this.radius < 0 ? this.radiu : this.x;
            this.x = this.x + this.radius > cc.winSize.width ? cc.winSize.width - this.radius : this.x;
        } else if (startX == this.bg.x) {
            this.x += moveX;// 移动小球
            this.x = this.x - this.radius < 0 ? this.radiu : this.x;
            this.x = this.x + this.radius > cc.winSize.width ? cc.winSize.width - this.radius : this.x;
        }
        if (startY != this.bg.y && (this.y < cc.winSize.height / 2 || this.y > cc.winSize.height / 2)) {
            this.bg.y + moveY;// 背景层归位
            this.y += moveY;// 移动小球
            this.y = this.y - this.radius < 0 ? this.radiu : this.y;
        } else if (startY == this.bg.y) {
            this.y += moveY;// 移动小球
            this.y = this.y - this.radius < 0 ? this.radiu : this.y;
            this.y = this.y + this.radius > cc.winSize.height ? cc.winSize.height - this.radius : this.y;
        }
        // 通知服务端移动操作
        this.pomelo.notify(Route.move, {angle: this.angle, speed: this.speed}, function (err) {
            if (!!err) {
                cc.log("move update err:" + err)
            }
        });
    }
    ,
    onMove: function (x, y) {
        this.setPosition(x, y);
    }
});