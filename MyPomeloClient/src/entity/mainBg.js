var MainBg = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setTexture(res.background);
        this.setScale(Const.Screen.width / this.width, Const.Screen.width / this.height);
        this.x = this.size.width / 2;
        this.y = this.size.height / 2;
        this.setAnchorPoint(0, 0);
        return true;
    }
});