module.exports = {

    PlayerInit: {
        initRadius: 10,
        initSpeed: 0,
        initAngle: 0
    },

    EntityType: {
        player: 'player',
        sub_bean: 'sub_bean',
        bean: 'bean'
    },

    Event: {
        move: 'onMove',
        enter: 'onEnter',
        leave: 'onLeave'
    },

    Screen: {
        width: 2000,
        height: 2000
    },

    Tick: {
        updateMainScene: 1
    }
};
