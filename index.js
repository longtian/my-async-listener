var listeners = [];

process.addAsyncListener = function (object, data) {
    object._data = data;
    listeners.push(object);
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
                listener.before.apply(listener, [listener, listener._data]);
                cb.apply(this, arguments);
                // after callback is called
                listener.after.apply(listener, [listener, listener._data]);
            };

            listener.create.apply(listener, [listener, listener._data]);
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