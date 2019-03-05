'use strict';

var _ = require('lodash');

var get_value = function (str) {
    var params = /(>|<|!=|=|not like|like)\s*(.+)/gi.exec(str.toLowerCase());
    if (params) {
        if (params[1].indexOf('like') >= 0) {
            params[2] = '%' + params[2] + '%';
        }

        return params.splice(1, 2);
    }

    if (str && str != "") {
        return ['=', str];
    }

    return null;
};

var qs = {
    filters: {
        decode: function (str) {
            str = str || '';
            var filters = {};

            _.each(str.split(';'), function (item) {
                var filter = item.split(':');

                if (filter.length == 2) {
                    var mod = filter[0].split('.');

                    if (mod.length == 2) {
                        filters[mod[0]] = filters[mod[0]] || {};
                        filters[mod[0]][mod[1]] = filters[mod[0]][mod[1]] || [];
                        filters[mod[0]][mod[1]].push(get_value(filter[1]));
                    } else {
                        filters[filter[0]] = filters[filter[0]] || [];
                        filters[filter[0]].push(get_value(filter[1]));
                    }
                }
            });

            return filters;
        }
    },

    sort: {
        decode: function (str) {
            str = str || '';
            var sort = {};

            _.each(str.split(';'), function (item) {
                var tmp = /(\-?)(\w+)/.exec(item);

                if (tmp) {
                    sort[tmp[2]] = tmp[1] == '' ? 'asc' : 'desc';
                }
            });

            return sort;
        }
    }
};

module.exports = qs;