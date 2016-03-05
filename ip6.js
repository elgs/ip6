;(function () {
    'use strict';

    var normalize = function (a) {
    };
    var compact = function (a) {
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        exports.normalize = normalize;
        exports.compact = compact;
    } else {
        window.normalize = normalize;
        window.compact = compact;
    }
})();