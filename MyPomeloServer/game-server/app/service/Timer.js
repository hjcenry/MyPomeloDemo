var Timer = function(opts){
    this.area = opts.area;
    this.interval = opts.interval||100;
};


Timer.prototype.run = function () {
    this.interval = setInterval(this.tick.bind(this), this.interval); //定时执行 tick
};

Timer.prototype.tick = function() {
    var area = this.area;

    //Update mob zones
    for(var key in area.zones){
        area.zones[key].update();  //遍历 所有zones的更新
    }

    //Update all the items
    for(var id in area.items) {  //检查人物状态值
        var item = area.entities[id];
        item.update();

        if(item.died) {   //如果角色死亡，向客户端发送消息
            area.channel.pushMessage('onRemoveEntities', {entities: [id]});
            area.removeEntity(id);
        }
    }

    //run all the action
    area.actionManager.update(); //动作更新

    area.aiManager.update();  //ai 更新，检查ai反应动作

    area.patrolManager.update(); //patrol巡逻动作更新
};