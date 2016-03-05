/**
 * Created by elgs on 3/5/16.
 */
;(function () {
    'use strict';

    var normalize = function (a) {
    };
    var compact = function (a) {
    };

    // Basic validation
    var _validate = function (a) {
        return /^[a-f0-9\:]+$/ig.test(a);
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        exports.normalize = normalize;
        exports.compact = compact;
        exports._validate = _validate;
    } else {
        window.normalize = normalize;
        window._validate = _validate;
    }
})();