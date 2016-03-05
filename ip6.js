/**
 * Created by elgs on 3/5/16.
 */
;(function () {
    'use strict';

    var normalize = function (a) {
        if (!_validate(a)) {
            return false;
        }
        var nh = a.split(/\:\:/g);
        if (nh.length > 2) {
            return false;
        }

        var sections = [];
        if (nh.length == 1) {
            // full mode
            sections = a.split(/\:/g);
            if (sections.length !== 8) {
                return false;
            }
        } else if (nh.length == 2) {
            // compact mode
            var n = nh[0];
            var h = nh[1];
            var ns = n.split(/\:/g);
            var hs = h.split(/\:/g);
            for (var i in ns) {
                sections[i] = ns[i];
            }
            for (var i = hs.length; i > 0; --i) {
                sections[7 - (hs.length - i)] = hs[i - 1];
            }
            for (var i = 0; i < 8; ++i) {
                var section = sections[i];
                if (section === undefined) {
                    sections[i] = '0000';
                }
                if (sections[i].length < 4) {
                    var pad = '0000';
                    sections[i] = pad.substring(0, pad.length - section.length) + section;
                }
            }
        }
        return sections.join(':');
    };
    var compact = function (a) {
        if (!_validate(a)) {
            return false;
        }
    };

    // Basic validation
    var _validate = function (a) {
        return /^[a-f0-9\\:]+$/ig.test(a);
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