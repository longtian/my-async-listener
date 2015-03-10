var listeners = [];

var HAS_CREATE = 1 << 1;
var HAS_BEFORE = 1 << 2;
var HAS_AFTER = 1 << 3;

process.addAsyncListener = function (listenerObject, data) {
    listenerObject._data = data;
    listenerObject.flag = 0;

    if (listenerObject.create) {
        listenerObject.flag |= HAS_CREATE;
    }
    if (listenerObject.before) {
        listenerObject.flag |= HAS_BEFORE;
    }
    if (listenerObject.after) {
        listenerObject.flag |= HAS_AFTER;
    }

    listeners.push(listenerObject);
};

/**
 * 
 * @param {Object} module
 * @param {String} methodName
 * @param {Function} wrapperFunction
 * @returns {Function} wrapped function
 */
function wrapMethod(module, methodName, wrapperFunction) {
    var _origin = module[methodName];
    module[methodName] = wrapperFunction(_origin);
    module[methodName]._origin = _origin;
    return module[methodName];
}


/**
 * 
 * @param {Object} module
 * @param {String} methodName
 * @returns {undefined}
 */
function activatorLast(module, methodName) {
    wrapMethod(module, methodName, function (origin) {
        return function () {
            if (listeners.length === 0) {
                origin.apply(module, arguments);
                return;
            }

            var listener = listeners[0];

            var args = Array.prototype.slice.apply(arguments);

            var cb = args[arguments.length - 1];
            args[arguments.length - 1] = function () {
                // before callback is called
                listener.flag & HAS_BEFORE && listener.before.apply(listener, [listener, listener._data]);
                cb.apply(this, arguments);
                // after callback is called
                listener.flag & HAS_AFTER && listener.after.apply(listener, [listener, listener._data]);
            };

            listener.flag & HAS_CREATE && listener.create.apply(listener, [listener, listener._data]);
            origin.apply(module, args);
        };
    });
}

module.exports = {
    apply: function () {
        activatorLast(require("fs"), "readFile");
        activatorLast(require("dns"), "resolve");
    }
};