var cachedclient = module.exports;
var _mem;

cachedclient.init = function (app) {
    if (!!_mem) {
        return cachedclient;
    } else {
        var M = require("memcached");
        _mem = new M(app.get("memcached"), {compressionThreshold: 10});
        return cachedclient;
    }
};

cachedclient.set = function (key, args, cb) {
    _mem.set(key, args, 0, function (err, result) {
        if (err) {
            console.error(err);
        }
        if (!!cb && typeof cb === "function") {
            cb(err, result);
        }
    });
}

cachedclient.get = function (key, cb) {
    _mem.get(key, function (err, result) {
        if (err) {
            console.error(err);
        }
        if (!!cb && typeof cb === "function") {
            cb(err, result);
        }
    });
};

cachedclient.del = function (key, cb) {
    _mem.del(key, function (err, result) {
        if (err) {
            console.error(err);
        }
        if (!!cb && typeof cb === "function") {
            cb(err, result);
        }
    });
}