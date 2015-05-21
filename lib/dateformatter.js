var utils = require('./utils');

var _months = {
    full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ap: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
  },
  _days = {
    full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    alt: {'-1': 'Yesterday', 0: 'Today', 1: 'Tomorrow'}
  };

/*
DateZ is licensed under the MIT License:
Copyright (c) 2011 Tomo Universalis (http://tomouniversalis.com)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
exports.tzOffset = 0;
exports.DateZ = function (value) {
    var members = {
        'default': ['getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'toISOString', 'toGMTString', 'toUTCString', 'valueOf', 'getTime'],
        z: ['getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getYear', 'toDateString', 'toLocaleDateString', 'toLocaleTimeString']
    },
      d = this,
      numericValue = value instanceof Date ? Number(value) / 1000 : Number(value);

  d.date = d.dateZ = (arguments.length > 1) ? new Date(Date.UTC.apply(Date, arguments) + ((new Date()).getTimezoneOffset() * 60000)) : (arguments.length === 1) ? new Date(isNaN(numericValue) ? value : numericValue * 1000) : new Date();

  d.timezoneOffset = d.dateZ.getTimezoneOffset();

  utils.each(members.z, function (name) {
    d[name] = function () {
      return d.dateZ[name]();
    };
  });
  utils.each(members['default'], function (name) {
    d[name] = function () {
      return d.date[name]();
    };
  });

  this.setTimezoneOffset(exports.tzOffset);
};
exports.DateZ.prototype = {
  getTimezoneOffset: function () {
    return this.timezoneOffset;
  },
  setTimezoneOffset: function (offset) {
    this.timezoneOffset = offset;
    this.dateZ = new Date(this.date.getTime() + this.date.getTimezoneOffset() * 60000 - this.timezoneOffset * 60000);
    return this;
  }
};



/// a    'a.m.' or 'p.m.' (Note that this is slightly different than PHP's output, because this includes periods to match Associated Press style.)
exports.a = function (input) {
  return input.getHours() < 12 ? 'a.m.' : 'p.m.';
};

/// A    'AM' or 'PM'.
exports.A = function (input) {
  return input.getHours() < 12 ? 'AM' : 'PM';
};

/// b    'jan'          MMM *)  Month, textual, 3 letters, lowercase.
exports.b = function(input) {
  return exports.M(input).toLowerCase();
};

/// B Not implemented in server hypr.
exports.B = function (input) {
  var hours = input.getUTCHours(), beats;
  hours = (hours === 23) ? 0 : hours + 1;
  beats = Math.abs(((((hours * 60) + input.getUTCMinutes()) * 60) + input.getUTCSeconds()) / 86.4).toFixed(0);
  return ('000'.concat(beats).slice(beats.length));
};

/// c ISO 8601 format, for example: 2008-01-02T10:30:00.000123+02:00,
exports.c = function (input) {
  return input.toISOString();
};

/// d    '01' to'31' Day of the month, 2 digits with leading zeros.
exports.d = function (input) {
  return (input.getDate() < 10 ? '0' : '') + input.getDate();
};

/// D    'Fri' Day of the week, textual, 3 letters.
exports.D = function (input) {
  return _days.abbr[input.getDay()];
};

////
// exports.e not implemented, timezone name cannot be determined in JS

// E   Alternative month name, e.g. 'listopada' instead of 'Listopad' in Polish
exports.E = exports.F; // this will have to change with internationalization

// f    '1','1:30' Time, in 12-hour hours and minutes, with minutes left off if they're zero. Proprietary extension.
exports.f = function(input) {
    var minutes = exports.i(input),
        hours = exports.g(input);
    if (minutes === "00") return hours;
    return hours + ':' + minutes;
};

/// F    'January' Month, textual, long
exports.F = function (input) {
  return _months.full[input.getMonth()];
};

/// g    '1' to '12' Hour, 12-hour format without leading zeros.
exports.g = function (input) {
  var h = input.getHours();
  return h === 0 ? 12 : (h > 12 ? h - 12 : h);
};

/// G    '0' to '23' Hour, 24-hour format without leading zeros.
exports.G = function (input) {
  return input.getHours();
};

/// h    '01' to '12' Hour, 12-hour format.
exports.h = function (input) {
  var h = input.getHours();
  return ((h < 10 || (12 < h && 22 > h)) ? '0' : '') + ((h < 12) ? h : h - 12);
};

/// H    '00' to '23' Hour, 24-hour format.
exports.H = function (input) {
  var h = input.getHours();
  return (h < 10 ? '0' : '') + h;
};

/// i    '00' to '59'   mm      Minutes.
exports.i = function (input) {
  var m = input.getMinutes();
  return (m < 10 ? '0' : '') + m;
};

function standardTimezoneOffset(input) {
  var jan = new Date(input.getFullYear(), 0, 1);
  var jul = new Date(input.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
/// I If daylight savings time is implemented or not. probably will fail because server-side only :(
exports.I = function(input) {
  return (input.date.getTimezoneOffset() < standardTimezoneOffset(input)).toString();
};

/// j    '1' to '31' Day of the month without leading zeros.
exports.j = function (input) {
  return input.getDate();
};

/// l    'Friday'  day of the week, textual, long.
exports.l = function (input) {
  return _days.full[input.getDay()];
};

// L     'true'    leap year, true or false
exports.L = function (input) {
  return new Date(input.getFullYear(), 1, 29).getDate() === 29;
};

/// m    '01' to '12' Month, 2 digits with leading zeros.
exports.m = function (input) {
  return (input.getMonth() < 9 ? '0' : '') + (input.getMonth() + 1);
};

/// M    'Jan' Month, textual, 3 letters.
exports.M = function (input) {
  return _months.abbr[input.getMonth()];
};

/// n    '1' to '12'    M (%M)  Month without leading zeros.
exports.n = function (input) {
  return input.getMonth() + 1;
};

/// N  'Jan.', 'Feb.',
///    'March', 'May'   MMM *)  Month abbreviation in Associated Press style. Proprietary extension.
exports.N = function (input) {
  return _months.ap[input.getMonth()];
};

/// o  '1999' ISO-8601 week-numbering year, corresponding to the ISO-8601 week number (W)
exports.o = function (input) {
  var target = new Date(input.valueOf());
  target.setDate(target.getDate() - ((input.getDay() + 6) % 7) + 3);
  return target.getFullYear();
};

/// O    '+0200'        zzz     Difference to Greenwich time in hours.
///                         *** this will return '+02:00' - note an extra colon in the middle
exports.O = function (input) {
    var tz = input.date.getTimezoneOffset();
    var absTz = Math.abs(tz);
    var hours = Math.floor(absTz / 60);
    var minutes = absTz % 60;
  return (tz < 0 ? '+' : '-') + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
};


/// P  '1 a.m.',
///    '1:30 p.m.',
///    'midnight',
///    'noon',
///    '12:30 p.m.'      ?      Time, in 12-hour hours, minutes and 'a.m.'/'p.m.', with minutes left off if they're zero and the special-case strings 'midnight' and 'noon' if appropriate. Proprietary extension.
var midnightOrNoon = {
  '1200': 'noon',
  '0000': 'midnight'
};
exports.P = function(input) {
  return midnightOrNoon[exports.H(input) + exports.i(input)] || exports.f(input) + ' ' + exports.a(input);
};

/// r  'Thu, 21 Dec 2000 16:01:07 +0200' ISO-8601.
exports.r = function (input) {
  return input.toUTCString();
};

/// s    '00' to '59'   ss      Seconds, 2 digits with leading zeros.
exports.s = function (input) {
  var s = input.getSeconds();
  return (s < 10 ? '0' : '') + s;
};

/// S    'st', 'nd',
///      'rd' or 'th'    ?      English ordinal suffix for day of the month, 2 characters.
exports.S = function (input) {
  var d = input.getDate();
  return (d % 10 === 1 && d !== 11 ? 'st' : (d % 10 === 2 && d !== 12 ? 'nd' : (d % 10 === 3 && d !== 13 ? 'rd' : 'th')));
};

/// t    28 to 31 Number of days in the given month.
exports.t = function (input) {
  return 32 - (new Date(input.getFullYear(), input.getMonth(), 32).getDate());
};

///
// exports.T not implemented
// because timezone name is impossible to determine

///
// exports.u not implemented
// because microsecond resolution is unavailable


exports.U = function (input) {
  return Math.floor(input.getTime() / 1000);
};

/// w  '0' (Sunday) to
///    '6' (Saturday)   ddd *)  Day of the week, digits without leading zeros.
exports.w = function (input) {
  return input.getDay();
};

/// W    1, 53 ISO-8601 week number of year, with weeks starting on Monday.
exports.W = function (input) {
  var target = new Date(input.valueOf()),
    dayNr = (input.getDay() + 6) % 7,
    fThurs;

  target.setDate(target.getDate() - dayNr + 3);
  fThurs = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }

  return 1 + Math.ceil((fThurs - target) / 604800000);
};

/// y    '99' Year, 2 digits.
exports.y = function (input) {
  return (input.getFullYear().toString()).substr(2);
};

/// Y    '1999' Year, 4 digits.
exports.Y = function (input) {
  return input.getFullYear();
};

/// z    0 to 365 Day of the year.
exports.z = function (input, offset, abbr) {
  var year = input.getFullYear(),
    e = new exports.DateZ(year, input.getMonth(), input.getDate(), 12, 0, 0),
    d = new exports.DateZ(year, 0, 1, 12, 0, 0);

  e.setTimezoneOffset(offset, abbr);
  d.setTimezoneOffset(offset, abbr);
  return Math.round((e - d) / 86400000);
};

/// Z -43200 to 43200 Time zone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.
exports.Z = function (input) {
  return input.getTimezoneOffset() * 60;
};
