var Player = cc.Sprite.extend({
    id: "",
    radius: 0,
    speed: 0,
    angle: 0,
    type: "",
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
    update: function (dt) {
        this.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        this.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        // 判断左边界
        this.x = this.x - this.radius < 0 ? this.radiu : this.x;
        // 判断右边界
        this.x = this.x + this.radius > Const.Screen.width ? Const.Screen.width - this.radius : this.x;
        // 判断下边界
        this.y = this.y - this.radius < 0 ? this.radiu : this.y;
        // 判断上边界
        this.y = this.y + this.radius > Const.Screen.height ? Const.Screen.height - this.radius : this.y;
        this.pomelo.notify(Route.move, {angle: this.angle, speed: this.speed}, function (err) {
            if (!!err) {
                cc.log("move update err:" + err)
            }
        });
    },
    onMove: function (x, y) {
        this.setPosition(x, y);
    }
});