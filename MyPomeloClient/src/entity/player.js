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
        this.setTexture(res.ball_png);
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
    setAngle: function (angle) {
        // 计算角度
        this.angle = angle;
    },
    setBgPosition: function (x, y) {
        cc.log("player x:", x, ",", y, "y:");
        // 小球坐标
        this.x = x;
        this.y = y;
        cc.log("player this x:", this.x, ",", this.y, "y:");
        // 背景图坐标
        this.bg.x = (-1) * (this.x - cc.winSize.width / 2);
        this.bg.y = (-1) * (this.y - cc.winSize.height / 2);
        // 超出左边界
        this.bg.x = (this.x < cc.winSize.width / 2) ? 0 : this.bg.x;
        // 超出右边界
        this.bg.x = (this.x > Const.Screen.width - cc.winSize.width / 2) ? (-1) * (Const.Screen.width - cc.winSize.width) : this.bg.x;
        // 超出下边界
        this.bg.y = (this.y < cc.winSize.height / 2) ? 0 : this.bg.y;
        // 超出上边界
        this.bg.y = (this.y > Const.Screen.height - cc.winSize.height / 2) ? (-1) * (Const.Screen.height - cc.winSize.height) : this.bg.y;
    },
    setBg: function (bg) {
        this.bg = bg;
    },
    update: function (dt) {
        var moveX = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var moveY = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        // 背景层反方向移动
        this.bg.x += (-1) * moveX;
        this.bg.y += (-1) * moveY;
        var startX = this.bg.x;
        var startY = this.bg.y;
        var calMoveX = this.bg.x + (-1) * moveX;
        var calMoveY = this.bg.y + (-1) * moveY;
        // 背景层左边界判断
        calMoveX = (calMoveX >= Const.Screen.width / 2) ? Const.Screen.width / 2 : calMoveX;
        // 背景层右边界判断
        calMoveX = (Math.abs(calMoveX) + cc.winSize.width >= Const.Screen.width / 2) ? (-1) * (Const.Screen.width / 2 - cc.winSize.width) : calMoveX;
        // 背景层上边界判断
        calMoveY = (Math.abs(calMoveY) + cc.winSize.height >= Const.Screen.height / 2) ? (-1) * (Const.Screen.height / 2 - cc.winSize.height) : calMoveY;
        // 背景层下边界判断
        calMoveY = (calMoveY >= Const.Screen.height / 2) ? Const.Screen.height : calMoveY;
        // x移动判断
        if (this.bg.x == calMoveX || (this.bg.x != calMoveX && (this.x < cc.winSize.width / 2 || this.x > cc.winSize.width / 2))) {
            // 背景图不通过边界判断或背景图通过边界判断且小球不在屏幕中心
            this.x += moveX;// 移动小球
            this.x = this.x - this.radius < 0 ? this.radiu : this.x;
            this.x = this.x + this.radius > cc.winSize.width ? cc.winSize.width - this.radius : this.x;
        } else if ((this.bg.x != calMoveX) && (this.x < cc.winSize.width / 2 || this.x > cc.winSize.width / 2)) {
            // 背景图通过边界判断且小球位于屏幕中心
            this.bg.x = calMoveX;
        }
        // y移动判断
        if (this.bg.y == calMoveY || (this.bg.y != calMoveY && (this.y < cc.winSize.height / 2 || this.y > cc.winSize.height / 2))) {
            // 背景图不通过边界判断或背景图通过边界判断且小球不在屏幕中心
            this.y += moveY;// 移动小球
            this.y = this.y - this.radius < 0 ? this.radiu : this.y;
            this.y = this.y + this.radius > cc.winSize.height ? cc.winSize.height - this.radius : this.y;
        } else if ((this.bg.y != calMoveY) && (this.y < cc.winSize.height / 2 || this.y > cc.winSize.height / 2)) {
            // 背景图通过边界判断且小球位于屏幕中心
            this.bg.y = calMoveY;
        }
        if (startX != this.bg.x || startY != this.bg.y) {
            // 通知服务端移动操作
            this.pomelo.notify(Route.move, {angle: this.angle, speed: this.speed}, function (err) {
                if (!!err) {
                    cc.log("move update err:" + err)
                }
            });
        }
    },
    onMove: function (x, y) {
        this.setPosition(x, y);
    }
});