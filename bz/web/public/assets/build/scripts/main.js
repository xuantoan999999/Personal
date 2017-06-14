webpackJsonp([0],Array(29).concat([
/* 29 */
/***/ (function(module, exports) {

var app = angular.module('GearUpApp', ['ngCookies', 'ngResource', 'ngAnimate', 'toastr', 'Contact', 'Auth', 'Notify', 'Checkout', 'Home', 'Category', 'Product', 'Search']).config(function ($httpProvider, toastrConfig) {
    $httpProvider.defaults.withCredentials = true;
    angular.extend(toastrConfig, {
        maxOpened: 4,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        target: 'body'
    });
});
angular.module('Core', []);

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var DateTime = function (window) {
  'use strict';

  return {
    dayCount: dayCount, // Đếm số ngày giữa 2 mốc thời gian
    monthCount: monthCount, // Đếm số tháng giữa 2 mốc thời gian
    dateBetween: dateBetween, // Kiểm tra ngày có thuộc giữ 2 mốc thời gian
    dateContain: dateContain, // Kiểm tra ngày có nằm trong mảng ngày
    dateInfo: dateInfo, // Lấy thông tin ngày (Thứ, ngày, tháng, năm...)
    timestampToDate: timestampToDate, // Chuyển đổi timestamp sang Date()
    dateToTimestamp: dateToTimestamp, // Chuyển đổi Date() sang timestamp
    isoDateToDate: isoDateToDate, // Chuyển đổi ISODate sang Date()
    daysInMonth: daysInMonth, // Lấy số ngày của tháng
    getAge: getAge // Lấy số tuổi
  };

  function dayCount(date1, date2) {
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date2.getTime() - date1.getTime()) / oneDay);
  }

  function monthCount(date1, date2) {
    return date1.getMonth() - date2.getMonth() + 12 * (date1.getFullYear() - date2.getFullYear()) + 1;
  }

  function dateBetween(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
  }

  function dateContain(date, dateArray) {
    var result = dateArray.filter(function (value) {
      return new Date(value).toDateString() === date.toDateString();
    });
    return result.length !== 0;
  }

  function dateInfo(date, lang) {
    var lang = lang || 'en';
    var dateNameArr = [Language[lang].DT_SUNDAY, Language[lang].DT_MONDAY, Language[lang].DT_TUESDAY, Language[lang].DT_WEDNESDAY, Language[lang].DT_THURSDAY, Language[lang].DT_FRIDAY, Language[lang].DT_SATURDAY];
    var monthNameArr = [Language[lang].DT_JAN, Language[lang].DT_JANUARY, Language[lang].DT_FEBRUARY, Language[lang].DT_MARCH, Language[lang].DT_APRIL, Language[lang].DT_MAY, Language[lang].DT_JUNE, Language[lang].DT_JULY, Language[lang].DT_AUGUST, Language[lang].DT_SEPTEMBER, Language[lang].DT_OCTOBER, Language[lang].DT_NOVEMBER, Language[lang].DT_DECEMBER];
    var dayOfWeek = date.getDay();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var dayName = dateNameArr[dayOfWeek];
    var monthName = monthNameArr[month];

    return {
      day: day,
      month: parseInt(month + 1),
      year: year,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      dateString: (day < 10 ? '0' + day : day) + '/' + (parseInt(month + 1) < 10 ? '0' + parseInt(month + 1) : parseInt(month + 1)) + '/' + year,
      timeString: (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes),
      dayName: dayName,
      monthName: monthName,
      dayCount: dayCount(date, new Date())
    };
  }

  function timestampToDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return dateInfo(date);
  }

  function dateToTimestamp(date) {
    return date.getTime() / 1000;
  }

  function isoDateToDate(isoString) {
    var dtstr = isoString;
    dtstr = dtstr.replace(/\D/g, ' ');
    var arr = dtstr.split(' ');
    arr[1]--;
    var result = new Date(Date.UTC(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]));
    return result;
  }

  function daysInMonth(month) {
    var date = new Date();
    return new Date(date.getFullYear(), month, 0).getDate();
  }

  function getAge(birthday) {
    var today = new Date();
    var thisYear = 0;
    if (today.getMonth() < birthday.getMonth()) {
      thisYear = 1;
    } else if (today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()) {
      thisYear = 1;
    }
    var age = today.getFullYear() - birthday.getFullYear() - thisYear;
    return age;
  }
}(window);

module.exports = window.DateTime = DateTime;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/***************************************************
Description: Helpers
****************************************************/
var Helper = function () {
    'use strict';

    return {
        detectScrollDirection: detectScrollDirection, // Bắt sự kiện scroll lên hoặc scroll xuống
        clearFileInput: clearFileInput, // Xóa nội dung input["file"]
        isUndefinedNullEmpty: isUndefinedNullEmpty, // Kiểm tra dữ liệu
        formatMoney: formatMoney, // Định dạng đơn vị tiền tệ
        enterFullScreen: enterFullScreen, // Bật chế độ xem toàn màn hình
        exitFullScreen: exitFullScreen, // Tắt chế độ xem toàn màn hình
        debounce: debounce, // Trì hoãn thực thi hàm khi hoàn thành thao tác
        throttle: throttle, // Trì hoãn thực thi hàm theo thời gian cố định
        hexToRgb: hexToRgb, // Chuyển đổi màu sắc Hex sang RGBA
        preloader: preloader, // Các tài nguyên sẽ được tải trước
        scrollToElement: scrollToElement, // Tự động cuộn tới đối tượng chỉ định
        scrollToTop: scrollToTop, // Tự động cuộn lên trên
        randomRangeFloat: randomRangeFloat, // Tạo số thực ngẫu nhiên
        randomRangeInt: randomRangeInt, // Tạo số nguyên ngẫu nhiên
        extend: extend // Kế thừa đối tượng
    };

    function detectScrollDirection() {
        var previousScroll = 0;

        $(window).on('scroll', function (event) {
            var currentScroll = $(this).scrollTop();
            if (currentScroll > previousScroll) {
                console.log('down');
            } else {
                console.log('up');
            }
            previousScroll = currentScroll;
        });
    }

    function clearFileInput(obj) {
        obj.replaceWith(obj.val('').clone(true));
    }

    function isUndefinedNullEmpty(data) {
        var output = true;
        if (!isNaN(data)) {
            output = false;
        } else if (data === null || data === undefined) {
            output = true;
        } else {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    output = false;
                }
            }
        }
        return output;
    }

    function formatMoney(number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 0;
        symbol = symbol !== undefined ? symbol : '';
        thousand = thousand || '.';
        decimal = decimal || ',';
        var negative = number < 0 ? '-' : '',
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
    }

    function enterFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    function debounce(fn, ms) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, ms);
        };
    }

    function throttle(fn, ms, scope) {
        ms || (ms = 250);
        var last, deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (last && now < last + ms) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, ms);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    function hexToRgb(hex, opacity) {
        var h = hex.replace('#', '');
        h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

        for (var i = 0; i < h.length; i++) {
            h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
        }

        if (typeof opacity != 'undefined') {
            h.push(opacity);
        }

        return 'rgba(' + h.join(',') + ')';
    }

    function preloader(fileList, callback) {
        var loaded = 0;
        var len = fileList.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                var img = new Image();
                img.src = fileList[i];
                img.onload = function (event) {
                    check(len);
                    console.info('File loaded: ', event.target.currentSrc);
                };

                img.onerror = function (event) {
                    check(len);
                    console.info('Cannot load file: ', event.target.currentSrc);
                };
            }
        } else {
            complete();
        }

        function check(count) {
            loaded++;
            if (loaded === count) {
                complete();
            }
        }

        function complete() {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    function scrollToElement(selector, time, verticalOffset) {
        time = typeof time !== 'undefined' ? time : 1000;
        verticalOffset = typeof verticalOffset !== 'undefined' ? verticalOffset : 0;
        var offset = $(selector).offset();
        var offsetTop = offset.top + verticalOffset;
        $('html,body').animate({ scrollTop: offsetTop }, time);
    }

    function scrollToTop(time) {
        time = typeof time !== 'undefined' ? time : 1000;
        $('html,body').animate({ scrollTop: 0 }, time);
    }

    function randomRangeFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    function randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }
}();

module.exports = window.Helper = Helper;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

var Language = function (window) {
  'use strict';

  return {
    vi: {
      DT_SUNDAY: 'Thứ hai',
      DT_MONDAY: 'Thứ ba',
      DT_TUESDAY: 'Thứ tư',
      DT_WEDNESDAY: 'Thứ năm',
      DT_THURSDAY: 'Thứ sáu',
      DT_FRIDAY: 'Thứ bảy',
      DT_SATURDAY: 'Chủ nhật',
      DT_JANUARY: 'Tháng 1',
      DT_FEBRUARY: 'Tháng 2',
      DT_MARCH: 'Tháng 3',
      DT_APRIL: 'Tháng 4',
      DT_MAY: 'Tháng 5',
      DT_JUNE: 'Tháng 6',
      DT_JULY: 'Tháng 7',
      DT_AUGUST: 'Tháng 8',
      DT_SEPTEMBER: 'Tháng 9',
      DT_OCTOBER: 'Tháng 10',
      DT_NOVEMBER: 'Tháng 11',
      DT_DECEMBER: 'Tháng 12'
    },
    en: {
      DT_SUNDAY: 'Sun',
      DT_MONDAY: 'Mon',
      DT_TUESDAY: 'Tue',
      DT_WEDNESDAY: 'Wed',
      DT_THURSDAY: 'Thu',
      DT_FRIDAY: 'Fri',
      DT_SATURDAY: 'Sat',
      DT_JANUARY: 'Jan',
      DT_FEBRUARY: 'Feb',
      DT_MARCH: 'Mar',
      DT_APRIL: 'Apr',
      DT_MAY: 'May',
      DT_JUNE: 'Jun',
      DT_JULY: 'Jul',
      DT_AUGUST: 'Aug',
      DT_SEPTEMBER: 'Sep',
      DT_OCTOBER: 'Otc',
      DT_NOVEMBER: 'Nov',
      DT_DECEMBER: 'Dec'
    }
  };
}(window);

module.exports = window.Language = Language;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by chung on 7/23/15.
 */

angular.module('Core').factory("Option", function ($rootScope) {

    const payment_methods = [{ name: 'COD', value: 'COD' }, { name: 'Thanh toán online', value: 'ONLINE' }, { name: 'Chuyển khoản', value: 'CK' }];

    var mapVN = [{
        "1": {
            "name": "Thành phố Cần Thơ",
            "districts": {
                "66": "Huyện Cờ Đỏ",
                "67": "Huyện Phong Điền",
                "68": "Huyện Thới Lai",
                "69": "Huyện Vĩnh Thạnh",
                "70": "Quận Bình Thủy",
                "71": "Quận Cái Răng",
                "72": "Quận Ninh Kiều",
                "73": "Quận Ô Môn",
                "74": "Quận Thốt Nốt"
            }
        },
        "2": {
            "name": "Thành phố Đà Nẵng",
            "districts": {
                "76": "Huyện Hòa Vang",
                "77": "Huyện Hoàng Sa",
                "78": "Quận Cẩm Lệ",
                "79": "Quận Hải Châu",
                "80": "Quận Liên Chiểu",
                "81": "Quận Ngũ Hành Sơn",
                "82": "Quận Sơn Trà",
                "83": "Quận Thanh Khê"
            }
        },
        "3": {
            "name": "Thành phố Hà Nội",
            "districts": {
                "85": "Huyện Ba Vì",
                "86": "Huyện Chương Mỹ",
                "87": "Huyện Đan Phượng",
                "88": "Huyện Đông Anh",
                "89": "Huyện Gia Lâm",
                "90": "Huyện Hoài Đức",
                "91": "Huyện Mê Linh",
                "92": "Huyện Mỹ Đức",
                "93": "Huyện Phú Xuyên",
                "94": "Huyện Phúc Thọ",
                "95": "Huyện Quốc Oai",
                "96": "Huyện Sóc Sơn",
                "97": "Huyện Thạch Thất",
                "98": "Huyện Thanh Oai",
                "99": "Huyện Thanh Trì",
                "100": "Huyện Thường Tín",
                "101": "Huyện Từ Liêm",
                "102": "Huyện ứng Hòa",
                "103": "Quận Ba Đình",
                "104": "Quận Cầu Giấy",
                "105": "Quận Đống Đa",
                "106": "Quận Hà Đông",
                "107": "Quận Hai Bà Trưng",
                "108": "Quận Hoàn Kiếm",
                "109": "Quận Hoàng Mai",
                "110": "Quận Long Biên",
                "111": "Quận Tây Hồ",
                "112": "Quận Thanh Xuân",
                "113": "Thị xã Sơn Tây"
            }
        },
        "4": {
            "name": "Thành phố Hải Phòng",
            "districts": {
                "115": "Huyện An Dương",
                "116": "Huyện An Lão",
                "117": "Huyện Bạch Long Vĩ",
                "118": "Huyện Cát Hải",
                "119": "Huyện Kiến Thụy",
                "120": "Huyện Thủy Nguyên",
                "121": "Huyện Tiên Lãng",
                "122": "Huyện Vĩnh Bảo",
                "123": "Quận Đồ Sơn",
                "124": "Quận Dương Kinh",
                "125": "Quận Hải An",
                "126": "Quận Hồng Bàng",
                "127": "Quận Kiến An",
                "128": "Quận Lê Chân",
                "129": "Quận Ngô Quyền"
            }
        },
        "5": {
            "name": "Thành phố Hồ Chí Minh",
            "districts": {
                "131": "Huyện Bình Chánh",
                "132": "Huyện Cần Giờ",
                "133": "Huyện Củ Chi",
                "134": "Huyện Hóc Môn",
                "135": "Huyện Nhà Bè",
                "136": "Quận 1",
                "137": "Quận 10",
                "138": "Quận 11",
                "139": "Quận 12",
                "140": "Quận 2",
                "141": "Quận 3",
                "142": "Quận 4",
                "143": "Quận 5",
                "144": "Quận 6",
                "145": "Quận 7",
                "146": "Quận 8",
                "147": "Quận 9",
                "148": "Quận Bình Tân",
                "149": "Quận Bình Thạnh",
                "150": "Quận Gò Vấp",
                "151": "Quận Phú Nhuận",
                "152": "Quận Tân Bình",
                "153": "Quận Tân Phú",
                "154": "Quận Thủ Đức"
            }
        },
        "6": {
            "name": "Tỉnh An Giang",
            "districts": {
                "155": "Huyện An Phú",
                "156": "Huyện Châu Phú",
                "157": "Huyện Châu Thành",
                "158": "Huyện Chợ Mới",
                "159": "Huyện Phú Tân",
                "160": "Huyện Thoại Sơn",
                "161": "Huyện Tịnh Biên",
                "162": "Huyện Tri Tôn",
                "163": "Thành phố Long Xuyên",
                "164": "Thị xã Châu Đốc",
                "165": "Thị xã Tân Châu"
            }
        },
        "7": {
            "name": "Tỉnh Bà Rịa-Vũng Tàu",
            "districts": {
                "166": "Huyện Châu Đức",
                "167": "Huyện Côn Đảo",
                "168": "Huyện Đất Đỏ",
                "169": "Huyện Long Điền",
                "170": "Huyện Tân Thành",
                "171": "Huyện Xuyên Mộc",
                "172": "Thành phố Vũng Tàu",
                "173": "Thị xã Bà Rịa"
            }
        },
        "8": {
            "name": "Tỉnh Bắc Giang",
            "districts": {
                "174": "Huyện Hiệp Hòa",
                "175": "Huyện Lạng Giang",
                "176": "Huyện Lục Nam",
                "177": "Huyện Lục Ngạn",
                "178": "Huyện Sơn Động",
                "179": "Huyện Tân Yên",
                "180": "Huyện Việt Yên",
                "181": "Huyện Yên Dũng",
                "182": "Huyện Yên Thế",
                "183": "Thành phố Bắc Giang"
            }
        },
        "9": {
            "name": "Tỉnh Bắc Kạn",
            "districts": {
                "184": "Huyện Ba Bể",
                "185": "Huyện Bạch Thông",
                "186": "Huyện Chợ Đồn",
                "187": "Huyện Chợ Mới",
                "188": "Huyện Na Rì",
                "189": "Huyện Ngân Sơn",
                "190": "Huyện Pác Nặm",
                "191": "Thị xã Bắc Kạn"
            }
        },
        "10": {
            "name": "Tỉnh Bạc Liêu",
            "districts": {
                "192": "Huyện Đông Hải",
                "193": "Huyện Giá Rai",
                "194": "Huyện Hòa Bình",
                "195": "Huyện Hồng Dân",
                "196": "Huyện Phước Long",
                "197": "Huyện Vĩnh Lợi",
                "198": "Thành Phố Bạc Liêu"
            }
        },
        "11": {
            "name": "Tỉnh Bắc Ninh",
            "districts": {
                "199": "Huyện Gia Bình",
                "200": "Huyện Lương Tài",
                "201": "Huyện Quế Võ",
                "202": "Huyện Thuận Thành",
                "203": "Huyện Tiên Du",
                "204": "Huyện Yên Phong",
                "205": "Thành phố Bắc Ninh",
                "206": "Thị xã Từ Sơn"
            }
        },
        "12": {
            "name": "Tỉnh Bến Tre",
            "districts": {
                "207": "Huyện Ba Tri",
                "208": "Huyện Bình Đại",
                "209": "Huyện Châu Thành",
                "210": "Huyện Chợ Lách",
                "211": "Huyện Giồng Trôm",
                "212": "Huyện Mỏ Cày Bắc",
                "213": "Huyện Mỏ Cày Nam",
                "214": "Huyện Thạnh Phú",
                "215": "Thành phố Bến Tre"
            }
        },
        "13": {
            "name": "Tỉnh Bình Định",
            "districts": {
                "216": "Huyện An Lão",
                "217": "Huyện An Nhơn",
                "218": "Huyện Hoài  Ân",
                "219": "Huyện Hoài Nhơn",
                "220": "Huyện Phù Mỹ",
                "221": "Huyện Phù cát",
                "222": "Huyện Tây Sơn",
                "223": "Huyện Tuy Phước",
                "224": "Huyện Vân Canh",
                "225": "Huyện Vĩnh Thạnh",
                "226": "Thành phố Quy Nhơn"
            }
        },
        "14": {
            "name": "Tỉnh Bình Dương",
            "districts": {
                "227": "Huyện Bến Cát",
                "228": "Huyện Dầu Tiếng",
                "229": "Huyện Dĩ An",
                "230": "Huyện Phú Giáo",
                "231": "Huyện Tân Uyên",
                "232": "Huyện Thuận An",
                "233": "Thị xã Thủ Dầu Một"
            }
        },
        "15": {
            "name": "Tỉnh Bình Phước",
            "districts": {
                "234": "Huyện Bù Đăng",
                "235": "Huyện Bù Đốp",
                "236": "Huyện Bù Gia Mập",
                "237": "Huyện Chơn Thành",
                "238": "Huyện Đồng Phú",
                "239": "Huyện Hớn Quản",
                "240": "Huyện Lộc Ninh",
                "241": "Thị xã Bình Long",
                "242": "Thị xã Đồng Xoài",
                "243": "Thị xã Phước Long"
            }
        },
        "16": {
            "name": "Tỉnh Bình Thuận",
            "districts": {
                "244": "Huyện  Đức Linh",
                "245": "Huyện Bắc Bình",
                "246": "Huyện Hàm Tân",
                "247": "Huyện Hàm Thuận Bắc",
                "248": "Huyện Hàm Thuận Nam",
                "249": "Huyện Phú Qúi",
                "250": "Huyện Tánh Linh",
                "251": "Huyện Tuy Phong",
                "252": "Thành phố Phan Thiết",
                "253": "Thị xã La Gi"
            }
        },
        "17": {
            "name": "Tỉnh Cà Mau",
            "districts": {
                "254": "Huyện Cái Nước",
                "255": "Huyện Đầm Dơi",
                "256": "Huyện Năm Căn",
                "257": "Huyện Ngọc Hiển",
                "258": "Huyện Phú Tân",
                "259": "Huyện Thới Bình",
                "260": "Huyện Trần Văn Thời",
                "261": "Huyện U Minh",
                "262": "Thành phố Cà Mau"
            }
        },
        "18": {
            "name": "Tỉnh Cao Bằng",
            "districts": {
                "263": "Huyện Bảo Lạc",
                "264": "Huyện Bảo Lâm",
                "265": "Huyện Hạ Lang",
                "266": "Huyện Hà Quảng",
                "267": "Huyện Hòa An",
                "268": "Huyện Nguyên Bình",
                "269": "Huyện Phục Hòa",
                "270": "Huyện Quảng Uyên",
                "271": "Huyện Thạch An",
                "272": "Huyện Thông Nông",
                "273": "Huyện Trà Lĩnh",
                "274": "Huyện Trùng Khánh",
                "275": "Thị xã Cao Bằng"
            }
        },
        "19": {
            "name": "Tỉnh Đắk Lắk",
            "districts": {
                "276": "Huyện Buôn Đôn",
                "277": "Huyện Cư Kuin",
                "278": "Huyện Cư MGar",
                "279": "Huyện Ea Kar",
                "280": "Huyện Ea Súp",
                "281": "Huyện EaHLeo",
                "282": "Huyện Krông Ana",
                "283": "Huyện Krông Bông",
                "284": "Huyện Krông Búk",
                "285": "Huyện Krông Năng",
                "286": "Huyện Krông Pắc",
                "287": "Huyện Lắk",
                "288": "Huyện MDrắk",
                "289": "Thành phố Buôn Ma Thuột",
                "290": "Thị xã Buôn Hồ"
            }
        },
        "20": {
            "name": "Tỉnh Đắk Nông",
            "districts": {
                "291": "Huyện Cư Jút",
                "292": "Huyện Đắk GLong",
                "293": "Huyện Đắk Mil",
                "294": "Huyện Đắk RLấp",
                "295": "Huyện Đắk Song",
                "296": "Huyện KRông Nô",
                "297": "Huyện Tuy Đức",
                "298": "Thị xã Gia Nghĩa"
            }
        },
        "21": {
            "name": "Tỉnh Điện Biên",
            "districts": {
                "299": "Huyện Điện Biên",
                "300": "Huyện Điện Biên Đông",
                "301": "Huyện Mường Chà",
                "302": "Huyện Mương Nhé",
                "303": "Huyện Mường ảng",
                "304": "Huyện Tủa Chùa",
                "305": "Huyện Tuần Giáo",
                "306": "Thành phố Điện Biên phủ",
                "307": "Thị xã Mường Lay"
            }
        },
        "22": {
            "name": "Tỉnh Đồng Nai",
            "districts": {
                "308": "Huyện Cẩm Mỹ",
                "309": "Huyện Định Quán",
                "310": "Huyện Long Thành",
                "311": "Huyện Nhơn Trạch",
                "312": "Huyện Tân Phú",
                "313": "Huyện Thống Nhất",
                "314": "Huyện Trảng Bom",
                "315": "Huyện Vĩnh Cửu",
                "316": "Huyện Xuân Lộc",
                "317": "Thành phố Biên Hòa",
                "318": "Thị xã Long Khánh"
            }
        },
        "23": {
            "name": "Tỉnh Đồng Tháp",
            "districts": {
                "319": "Huyện Cao Lãnh",
                "320": "Huyện Châu Thành",
                "321": "Huyện Hồng Ngự",
                "322": "Huyện Lai Vung",
                "323": "Huyện Lấp Vò",
                "324": "Huyện Tam Nông",
                "325": "Huyện Tân Hồng",
                "326": "Huyện Thanh Bình",
                "327": "Huyện Tháp Mười",
                "328": "Thành phố Cao Lãnh",
                "329": "Thị xã Hồng Ngự",
                "330": "Thị xã Sa Đéc"
            }
        },
        "24": {
            "name": "Tỉnh Gia Lai",
            "districts": {
                "331": "Huyện Chư Păh",
                "332": "Huyện Chư Pưh",
                "333": "Huyện Chư Sê",
                "334": "Huyện ChưPRông",
                "335": "Huyện Đăk Đoa",
                "336": "Huyện Đăk Pơ",
                "337": "Huyện Đức Cơ",
                "338": "Huyện Ia Grai",
                "339": "Huyện Ia Pa",
                "340": "Huyện KBang",
                "341": "Huyện KBang",
                "342": "Huyện Kông Chro",
                "343": "Huyện Krông Pa",
                "344": "Huyện Mang Yang",
                "345": "Huyện Phú Thiện",
                "346": "Thành phố Plei Ku",
                "347": "Thị xã AYun Pa",
                "348": "Thị xã An Khê"
            }
        },
        "25": {
            "name": "Tỉnh Hà Giang",
            "districts": {
                "349": "Huyện Bắc Mê",
                "350": "Huyện Bắc Quang",
                "351": "Huyện Đồng Văn",
                "352": "Huyện Hoàng Su Phì",
                "353": "Huyện Mèo Vạc",
                "354": "Huyện Quản Bạ",
                "355": "Huyện Quang Bình",
                "356": "Huyện Vị Xuyên",
                "357": "Huyện Xín Mần",
                "358": "Huyện Yên Minh",
                "359": "Thành Phố Hà Giang"
            }
        },
        "26": {
            "name": "Tỉnh Hà Nam",
            "districts": {
                "360": "Huyện Bình Lục",
                "361": "Huyện Duy Tiên",
                "362": "Huyện Kim Bảng",
                "363": "Huyện Lý Nhân",
                "364": "Huyện Thanh Liêm",
                "365": "Thành phố Phủ Lý"
            }
        },
        "27": {
            "name": "Tỉnh Hà Tĩnh",
            "districts": {
                "366": "Huyện Cẩm Xuyên",
                "367": "Huyện Can Lộc",
                "368": "Huyện Đức Thọ",
                "369": "Huyện Hương Khê",
                "370": "Huyện Hương Sơn",
                "371": "Huyện Kỳ Anh",
                "372": "Huyện Lộc Hà",
                "373": "Huyện Nghi Xuân",
                "374": "Huyện Thạch Hà",
                "375": "Huyện Vũ Quang",
                "376": "Thành phố Hà Tĩnh",
                "377": "Thị xã Hồng Lĩnh"
            }
        },
        "28": {
            "name": "Tỉnh Hải Dương",
            "districts": {
                "378": "Huyện Bình Giang",
                "379": "Huyện Cẩm Giàng",
                "380": "Huyện Gia Lộc",
                "381": "Huyện Kim Thành",
                "382": "Huyện Kinh Môn",
                "383": "Huyện Nam Sách",
                "384": "Huyện Ninh Giang",
                "385": "Huyện Thanh Hà",
                "386": "Huyện Thanh Miện",
                "387": "Huyện Tứ Kỳ",
                "388": "Thành phố Hải Dương",
                "389": "Thị xã Chí Linh"
            }
        },
        "29": {
            "name": "Tỉnh Hậu Giang",
            "districts": {
                "390": "Huyện Châu Thành",
                "391": "Huyện Châu Thành A",
                "392": "Huyện Long Mỹ",
                "393": "Huyện Phụng Hiệp",
                "394": "Huyện Vị Thủy",
                "395": "Thành Phố Vị Thanh",
                "396": "Thị xã Ngã Bảy"
            }
        },
        "30": {
            "name": "Tỉnh Hòa Bình",
            "districts": {
                "397": "Huyện Cao Phong",
                "398": "Huyện Đà Bắc",
                "399": "Huyện Kim Bôi",
                "400": "Huyện Kỳ Sơn",
                "401": "Huyện Lạc Sơn",
                "402": "Huyện Lạc Thủy",
                "403": "Huyện Lương Sơn",
                "404": "Huyện Mai Châu",
                "405": "Huyện Tân Lạc",
                "406": "Huyện Yên Thủy",
                "407": "Thành phố Hòa Bình"
            }
        },
        "31": {
            "name": "Tỉnh Hưng Yên",
            "districts": {
                "408": "Huyện Ân Thi",
                "409": "Huyện Khoái Châu",
                "410": "Huyện Kim Động",
                "411": "Huyện Mỹ Hào",
                "412": "Huyện Phù Cừ",
                "413": "Huyện Tiên Lữ",
                "414": "Huyện Văn Giang",
                "415": "Huyện Văn Lâm",
                "416": "Huyện Yên Mỹ",
                "417": "Thành phố Hưng Yên"
            }
        },
        "32": {
            "name": "Tỉnh Khánh Hòa",
            "districts": {
                "418": "Huyện Cam Lâm",
                "419": "Huyện Diên Khánh",
                "420": "Huyện Khánh Sơn",
                "421": "Huyện Khánh Vĩnh",
                "422": "Huyện Ninh Hòa",
                "423": "Huyện Trường Sa",
                "424": "Huyện Vạn Ninh",
                "425": "Thành phố Nha Trang",
                "426": "Thị xã Cam Ranh"
            }
        },
        "33": {
            "name": "Tỉnh Kiên Giang",
            "districts": {
                "427": "Huyện An Biên",
                "428": "Huyện An Minh",
                "429": "Huyện Châu Thành",
                "430": "Huyện Giang Thành",
                "431": "Huyện Giồng Riềng",
                "432": "Huyện Gò Quao",
                "433": "Huyện Hòn Đất",
                "434": "Huyện Kiên Hải",
                "435": "Huyện Kiên Lương",
                "436": "Huyện Phú Quốc",
                "437": "Huyện Tân Hiệp",
                "438": "Huyện U Minh Thượng",
                "439": "Huyện Vĩnh Thuận",
                "440": "Thành phố Rạch Giá",
                "441": "Thị xã Hà Tiên"
            }
        },
        "34": {
            "name": "Tỉnh Kon Tum",
            "districts": {
                "442": "Huyện Đắk Glei",
                "443": "Huyện Đắk Hà",
                "444": "Huyện Đắk Tô",
                "445": "Huyện Kon Plông",
                "446": "Huyện Kon Rẫy",
                "447": "Huyện Ngọc Hồi",
                "448": "Huyện Sa Thầy",
                "449": "Huyện Tu Mơ Rông",
                "450": "Thành phố Kon Tum"
            }
        },
        "35": {
            "name": "Tỉnh Lai Châu",
            "districts": {
                "451": "Huyện Mường Tè",
                "452": "Huyện Phong Thổ",
                "453": "Huyện Sìn Hồ",
                "454": "Huyện Tam Đường",
                "455": "Huyện Tân Uyên",
                "456": "Huyện Than Uyên",
                "457": "Thị xã Lai Châu"
            }
        },
        "36": {
            "name": "Tỉnh Lâm Đồng",
            "districts": {
                "458": "Huyện Bảo Lâm",
                "459": "Huyện Cát Tiên",
                "460": "Huyện Đạ Huoai",
                "461": "Huyện Đạ Tẻh",
                "462": "Huyện Đam Rông",
                "463": "Huyện Di Linh",
                "464": "Huyện Đơn Dương",
                "465": "Huyện Đức Trọng",
                "466": "Huyện Lạc Dương",
                "467": "Huyện Lâm Hà",
                "468": "Thành phố Bảo Lộc",
                "469": "Thành phố Đà Lạt"
            }
        },
        "37": {
            "name": "Tỉnh Lạng Sơn",
            "districts": {
                "470": "Huyện Bắc Sơn",
                "471": "Huyện Bình Gia",
                "472": "Huyện Cao Lộc",
                "473": "Huyện Chi Lăng",
                "474": "Huyện Đình Lập",
                "475": "Huyện Hữu Lũng",
                "476": "Huyện Lộc Bình",
                "477": "Huyện Tràng Định",
                "478": "Huyện Văn Lãng",
                "479": "Huyện Văn Quan",
                "480": "Thành phố Lạng Sơn"
            }
        },
        "38": {
            "name": "Tỉnh Lào Cai",
            "districts": {
                "481": "Huyện Bắc Hà",
                "482": "Huyện Bảo Thắng",
                "483": "Huyện Bảo Yên",
                "484": "Huyện Bát Xát",
                "485": "Huyện Mường Khương",
                "486": "Huyện Sa Pa",
                "487": "Huyện Si Ma Cai",
                "488": "Huyện Văn Bàn",
                "489": "Thành phố Lào Cai"
            }
        },
        "39": {
            "name": "Tỉnh Long An",
            "districts": {
                "490": "Huyện Bến Lức",
                "491": "Huyện Cần Đước",
                "492": "Huyện Cần Giuộc",
                "493": "Huyện Châu Thành",
                "494": "Huyện Đức Hòa",
                "495": "Huyện Đức Huệ",
                "496": "Huyện Mộc Hóa",
                "497": "Huyện Tân Hưng",
                "498": "Huyện Tân Thạnh",
                "499": "Huyện Tân Trụ",
                "500": "Huyện Thạnh Hóa",
                "501": "Huyện Thủ Thừa",
                "502": "Huyện Vĩnh Hưng",
                "503": "Thành phố Tân An"
            }
        },
        "40": {
            "name": "Tỉnh Nam Định",
            "districts": {
                "504": "Huyện Giao Thủy",
                "505": "Huyện Hải Hậu",
                "506": "Huyện Mỹ Lộc",
                "507": "Huyện Nam Trực",
                "508": "Huyện Nghĩa Hưng",
                "509": "Huyện Trực Ninh",
                "510": "Huyện Vụ Bản",
                "511": "Huyện Xuân Trường",
                "512": "Huyện ý Yên",
                "513": "Thành phố Nam Định"
            }
        },
        "41": {
            "name": "Tỉnh Nghệ An",
            "districts": {
                "514": "Huyện Anh Sơn",
                "515": "Huyện Con Cuông",
                "516": "Huyện Diễn Châu",
                "517": "Huyện Đô Lương",
                "518": "Huyện Hưng Nguyên",
                "519": "Huyện Kỳ Sơn",
                "520": "Huyện Nam Đàn",
                "521": "Huyện Nghi Lộc",
                "522": "Huyện Nghĩa Đàn",
                "523": "Huyện Quế Phong",
                "524": "Huyện Quỳ Châu",
                "525": "Huyện Quỳ Hợp",
                "526": "Huyện Quỳnh Lưu",
                "527": "Huyện Tân Kỳ",
                "528": "Huyện Thanh Chương",
                "529": "Huyện Tương Dương",
                "530": "Huyện Yên Thành",
                "531": "Thành phố Vinh",
                "532": "Thị xã Cửa Lò",
                "533": "Thị xã Thái Hòa"
            }
        },
        "42": {
            "name": "Tỉnh Ninh Bình",
            "districts": {
                "534": "Huyện Gia Viễn",
                "535": "Huyện Hoa Lư",
                "536": "Huyện Kim Sơn",
                "537": "Huyện Nho Quan",
                "538": "Huyện Yên Khánh",
                "539": "Huyện Yên Mô",
                "540": "Thành phố Ninh Bình",
                "541": "Thị xã Tam Điệp"
            }
        },
        "43": {
            "name": "Tỉnh Ninh Thuận",
            "districts": {
                "542": "Huyên Bác ái",
                "543": "Huyện Ninh Hải",
                "544": "Huyện Ninh Phước",
                "545": "Huyện Ninh Sơn",
                "546": "Huyện Thuận Bắc",
                "547": "Huyện Thuận Nam",
                "548": "Thành phố Phan Rang-Tháp Chàm"
            }
        },
        "44": {
            "name": "Tỉnh Phú Thọ",
            "districts": {
                "549": "Huyện Cẩm Khê",
                "550": "Huyện Đoan Hùng",
                "551": "Huyện Hạ Hòa",
                "552": "Huyện Lâm Thao",
                "553": "Huyện Phù Ninh",
                "554": "Huyện Tam Nông",
                "555": "Huyện Tân Sơn",
                "556": "Huyện Thanh Ba",
                "557": "Huyện Thanh Sơn",
                "558": "Huyện Thanh Thủy",
                "559": "Huyện Yên Lập",
                "560": "Thành phố Việt Trì",
                "561": "Thị xã Phú Thọ"
            }
        },
        "45": {
            "name": "Tỉnh Phú Yên",
            "districts": {
                "562": "Huyện Đông Hòa",
                "563": "Huyện Đồng Xuân",
                "564": "Huyện Phú Hòa",
                "565": "Huyện Sơn Hòa",
                "566": "Huyện Sông Hinh",
                "567": "Huyện Tây Hòa",
                "568": "Huyện Tuy An",
                "569": "Thành phố Tuy Hòa",
                "570": "Thị xã Sông Cầu"
            }
        },
        "46": {
            "name": "Tỉnh Quảng Bình",
            "districts": {
                "571": "Huyện Bố Trạch",
                "572": "Huyện Lệ Thủy",
                "573": "Huyện MinhHoá",
                "574": "Huyện Quảng Ninh",
                "575": "Huyện Quảng Trạch",
                "576": "Huyện Tuyên Hoá",
                "577": "Thành phố Đồng Hới"
            }
        },
        "47": {
            "name": "Tỉnh Quảng Nam",
            "districts": {
                "578": "Huyện Bắc Trà My",
                "579": "Huyện Đại Lộc",
                "580": "Huyện Điện Bàn",
                "581": "Huyện Đông Giang",
                "582": "Huyện Duy Xuyên",
                "583": "Huyện Hiệp Đức",
                "584": "Huyện Nam Giang",
                "585": "Huyện Nam Trà My",
                "586": "Huyện Nông Sơn",
                "587": "Huyện Núi Thành",
                "588": "Huyện Phú Ninh",
                "589": "Huyện Phước Sơn",
                "590": "Huyện Quế Sơn",
                "591": "Huyện Tây Giang",
                "592": "Huyện Thăng Bình",
                "593": "Huyện Tiên Phước",
                "594": "Thành phố Hội An",
                "595": "Thành phố Tam Kỳ"
            }
        },
        "48": {
            "name": "Tỉnh Quảng Ngãi",
            "districts": {
                "596": "Huyện Ba Tơ",
                "597": "Huyện Bình Sơn",
                "598": "Huyện Đức Phổ",
                "599": "Huyện Lý sơn",
                "600": "Huyện Minh Long",
                "601": "Huyện Mộ Đức",
                "602": "Huyện Nghĩa Hành",
                "603": "Huyện Sơn Hà",
                "604": "Huyện Sơn Tây",
                "605": "Huyện Sơn Tịnh",
                "606": "Huyện Tây Trà",
                "607": "Huyện Trà Bồng",
                "608": "Huyện Tư Nghĩa",
                "609": "Thành phố Quảng Ngãi"
            }
        },
        "49": {
            "name": "Tỉnh Quảng Ninh",
            "districts": {
                "610": "Huyện Ba Chẽ",
                "611": "Huyện Bình Liêu",
                "612": "Huyện Cô Tô",
                "613": "Huyện Đầm Hà",
                "614": "Huyện Đông Triều",
                "615": "Huyện Hải Hà",
                "616": "Huyện Hoành Bồ",
                "617": "Huyện Tiên Yên",
                "618": "Huyện Vân Đồn",
                "619": "Huyện Yên Hưng",
                "620": "Thành phố Hạ Long",
                "621": "Thành phố Móng Cái",
                "622": "Thị xã Cẩm Phả",
                "623": "Thị xã Uông Bí"
            }
        },
        "50": {
            "name": "Tỉnh Quảng Trị",
            "districts": {
                "624": "Huyện Cam Lộ",
                "625": "Huyện Cồn Cỏ",
                "626": "Huyện Đa Krông",
                "627": "Huyện Gio Linh",
                "628": "Huyện Hải Lăng",
                "629": "Huyện Hướng Hóa",
                "630": "Huyện Triệu Phong",
                "631": "Huyện Vính Linh",
                "632": "Thành phố Đông Hà",
                "633": "Thị xã Quảng Trị"
            }
        },
        "51": {
            "name": "Tỉnh Sóc Trăng",
            "districts": {
                "634": "Huyện Châu Thành",
                "635": "Huyện Cù Lao Dung",
                "636": "Huyện Kế Sách",
                "637": "Huyện Long Phú",
                "638": "Huyện Mỹ Tú",
                "639": "Huyện Mỹ Xuyên",
                "640": "Huyện Ngã Năm",
                "641": "Huyện Thạnh Trị",
                "642": "Huyện Trần Đề",
                "643": "Huyện Vĩnh Châu",
                "644": "Thành phố Sóc Trăng"
            }
        },
        "52": {
            "name": "Tỉnh Sơn La",
            "districts": {
                "645": "Huyện Bắc Yên",
                "646": "Huyện Mai Sơn",
                "647": "Huyện Mộc Châu",
                "648": "Huyện Mường La",
                "649": "Huyện Phù Yên",
                "650": "Huyện Quỳnh Nhai",
                "651": "Huyện Sông Mã",
                "652": "Huyện Sốp Cộp",
                "653": "Huyện Thuận Châu",
                "654": "Huyện Yên Châu",
                "655": "Thành phố Sơn La"
            }
        },
        "53": {
            "name": "Tỉnh Tây Ninh",
            "districts": {
                "656": "Huyện Bến Cầu",
                "657": "Huyện Châu Thành",
                "658": "Huyện Dương Minh Châu",
                "659": "Huyện Gò Dầu",
                "660": "Huyện Hòa Thành",
                "661": "Huyện Tân Biên",
                "662": "Huyện Tân Châu",
                "663": "Huyện Trảng Bàng",
                "664": "Thị xã Tây Ninh"
            }
        },
        "54": {
            "name": "Tỉnh Thái Bình",
            "districts": {
                "665": "Huyện Đông Hưng",
                "666": "Huyện Hưng Hà",
                "667": "Huyện Kiến Xương",
                "668": "Huyện Quỳnh Phụ",
                "669": "Huyện Thái Thụy",
                "670": "Huyện Tiền Hải",
                "671": "Huyện Vũ Thư",
                "672": "Thành phố Thái Bình"
            }
        },
        "55": {
            "name": "Tỉnh Thái Nguyên",
            "districts": {
                "673": "Huyện Đại Từ",
                "674": "Huyện Định Hóa",
                "675": "Huyện Đồng Hỷ",
                "676": "Huyện Phổ Yên",
                "677": "Huyện Phú Bình",
                "678": "Huyện Phú Lương",
                "679": "Huyện Võ Nhai",
                "680": "Thành phố Thái Nguyên",
                "681": "Thị xã Sông Công"
            }
        },
        "56": {
            "name": "Tỉnh Thanh Hóa",
            "districts": {
                "682": "Huyện Bá Thước",
                "683": "Huyện Cẩm Thủy",
                "684": "Huyện Đông Sơn",
                "685": "Huyện Hà Trung",
                "686": "Huyện Hậu Lộc",
                "687": "Huyện Hoằng Hóa",
                "688": "Huyện Lang Chánh",
                "689": "Huyện Mường Lát",
                "690": "Huyện Nga Sơn",
                "691": "Huyện Ngọc Lặc",
                "692": "Huyện Như Thanh",
                "693": "Huyện Như Xuân",
                "694": "Huyện Nông Cống",
                "695": "Huyện Quan Hóa",
                "696": "Huyện Quan Sơn",
                "697": "Huyện Quảng Xương",
                "698": "Huyện Thạch Thành",
                "699": "Huyện Thiệu Hóa",
                "700": "Huyện Thọ Xuân",
                "701": "Huyện Thường Xuân",
                "702": "Huyện Tĩnh Gia",
                "703": "Huyện Triệu Sơn",
                "704": "Huyện Vĩnh Lộc",
                "705": "Huyện Yên Định",
                "706": "Thành phố Thanh Hóa",
                "707": "Thị xã Bỉm Sơn",
                "708": "Thị xã Sầm Sơn"
            }
        },
        "57": {
            "name": "Tỉnh Thừa Thiên Huế",
            "districts": {
                "709": "Huyện A Lưới",
                "710": "Huyện Hương Trà",
                "711": "Huyện Nam Dông",
                "712": "Huyện Phong Điền",
                "713": "Huyện Phú Lộc",
                "714": "Huyện Phú Vang",
                "715": "Huyện Quảng Điền",
                "716": "Thành phố Huế",
                "717": "thị xã Hương Thủy"
            }
        },
        "58": {
            "name": "Tỉnh Tiền Giang",
            "districts": {
                "718": "Huyện Cái Bè",
                "719": "Huyện Cai Lậy",
                "720": "Huyện Châu Thành",
                "721": "Huyện Chợ Gạo",
                "722": "Huyện Gò Công Đông",
                "723": "Huyện Gò Công Tây",
                "724": "Huyện Tân Phú Đông",
                "725": "Huyện Tân Phước",
                "726": "Thành phố Mỹ Tho",
                "727": "Thị xã Gò Công"
            }
        },
        "59": {
            "name": "Tỉnh Trà Vinh",
            "districts": {
                "728": "Huyện Càng Long",
                "729": "Huyện Cầu Kè",
                "730": "Huyện Cầu Ngang",
                "731": "Huyện Châu Thành",
                "732": "Huyện Duyên Hải",
                "733": "Huyện Tiểu Cần",
                "734": "Huyện Trà Cú",
                "735": "Thành phố Trà Vinh"
            }
        },
        "60": {
            "name": "Tỉnh Tuyên Quang",
            "districts": {
                "736": "Huyện Chiêm Hóa",
                "737": "Huyện Hàm Yên",
                "738": "Huyện Na hang",
                "739": "Huyện Sơn Dương",
                "740": "Huyện Yên Sơn",
                "741": "Thành phố Tuyên Quang"
            }
        },
        "61": {
            "name": "Tỉnh Vĩnh Long",
            "districts": {
                "742": "Huyện Bình Minh",
                "743": "Huyện Bình Tân",
                "744": "Huyện Long Hồ",
                "745": "Huyện Mang Thít",
                "746": "Huyện Tam Bình",
                "747": "Huyện Trà Ôn",
                "748": "Huyện Vũng Liêm",
                "749": "Thành phố Vĩnh Long"
            }
        },
        "62": {
            "name": "Tỉnh Vĩnh Phúc",
            "districts": {
                "750": "Huyện Bình Xuyên",
                "751": "Huyện Lập Thạch",
                "752": "Huyện Sông Lô",
                "753": "Huyện Tam Đảo",
                "754": "Huyện Tam Dương",
                "755": "Huyện Vĩnh Tường",
                "756": "Huyện Yên Lạc",
                "757": "Thành phố Vĩnh Yên",
                "758": "Thị xã Phúc Yên"
            }
        },
        "63": {
            "name": "Tỉnh Yên Bái",
            "districts": {
                "759": "Huyện Lục Yên",
                "760": "Huyện Mù Cang Chải",
                "761": "Huyện Trạm Tấu",
                "762": "Huyện Trấn Yên",
                "763": "Huyện Văn Chấn",
                "764": "Huyện Văn Yên",
                "765": "Huyện Yên Bình",
                "766": "Thành phố Yên Bái",
                "767": "Thị xã Nghĩa Lộ"
            }
        }
    }];

    var listColor = [
    // { name: 'AliceBlue', value: '#F0F8FF' },
    // { name: 'AntiqueWhite', value: '#FAEBD7' },
    { name: 'Aqua', value: '#00FFFF' },
    // { name: 'Aquamarine', value: '#7FFFD4' },
    // { name: 'Azure', value: '#F0FFFF' },
    // { name: 'Beige', value: '#F5F5DC' },
    // { name: 'Bisque', value: '#FFE4C4' },
    { name: 'Black', value: '#000000' },
    // { name: 'BlanchedAlmond', value: '#FFEBCD' },
    { name: 'Blue', value: '#0000FF' },
    // { name: 'BlueViolet', value: '#8A2BE2' },
    { name: 'Brown', value: '#A52A2A' },
    // { name: 'BurlyWood', value: '#DEB887' },
    // { name: 'CadetBlue', value: '#5F9EA0' },
    // { name: 'Chartreuse', value: '#7FFF00' },
    // { name: 'Chocolate', value: '#D2691E' },
    // { name: 'Coral', value: '#FF7F50' },
    // { name: 'CornflowerBlue', value: '#6495ED' },
    // { name: 'Cornsilk', value: '#FFF8DC' },
    // { name: 'Crimson', value: '#DC143C' },
    // { name: 'Cyan', value: '#00FFFF' },
    // { name: 'DarkBlue', value: '#00008B' },
    // { name: 'DarkCyan', value: '#008B8B' },
    // { name: 'DarkGoldenRod', value: '#B8860B' },
    // { name: 'DarkGray', value: '#A9A9A9' },
    // { name: 'DarkGrey', value: '#A9A9A9' },
    // { name: 'DarkGreen', value: '#006400' },
    // { name: 'DarkKhaki', value: '#BDB76B' },
    // { name: 'DarkMagenta', value: '#8B008B' },
    // { name: 'DarkOliveGreen', value: '#556B2F' },
    // { name: 'DarkOrange', value: '#FF8C00' },
    // { name: 'DarkOrchid', value: '#9932CC' },
    // { name: 'DarkRed', value: '#8B0000' },
    // { name: 'DarkSalmon', value: '#E9967A' },
    // { name: 'DarkSeaGreen', value: '#8FBC8F' },
    // { name: 'DarkSlateBlue', value: '#483D8B' },
    // { name: 'DarkSlateGray', value: '#2F4F4F' },
    // { name: 'DarkSlateGrey', value: '#2F4F4F' },
    // { name: 'DarkTurquoise', value: '#00CED1' },
    // { name: 'DarkViolet', value: '#9400D3' },
    // { name: 'DeepPink', value: '#FF1493' },
    // { name: 'DeepSkyBlue', value: '#00BFFF' },
    // { name: 'DimGray', value: '#696969' },
    // { name: 'DimGrey', value: '#696969' },
    // { name: 'DodgerBlue', value: '#1E90FF' },
    // { name: 'FireBrick', value: '#B22222' },
    // { name: 'FloralWhite', value: '#FFFAF0' },
    // { name: 'ForestGreen', value: '#228B22' },
    // { name: 'Fuchsia', value: '#FF00FF' },
    // { name: 'Gainsboro', value: '#DCDCDC' },
    // { name: 'GhostWhite', value: '#F8F8FF' },
    // { name: 'Gold', value: '#FFD700' },
    // { name: 'GoldenRod', value: '#DAA520' },
    // { name: 'Gray', value: '#808080' },
    // { name: 'Grey', value: '#808080' },
    // { name: 'Green', value: '#008000' },
    // { name: 'GreenYellow', value: '#ADFF2F' },
    // { name: 'HoneyDew', value: '#F0FFF0' },
    // { name: 'HotPink', value: '#FF69B4' },
    // { name: 'IndianRed', value: '#CD5C5C' },
    // { name: 'Indigo', value: '#4B0082' },
    // { name: 'Ivory', value: '#FFFFF0' },
    // { name: 'Khaki', value: '#F0E68C' },
    // { name: 'Lavender', value: '#E6E6FA' },
    // { name: 'LavenderBlush', value: '#FFF0F5' },
    // { name: 'LawnGreen', value: '#7CFC00' },
    // { name: 'LemonChiffon', value: '#FFFACD' },
    // { name: 'LightBlue', value: '#ADD8E6' },
    // { name: 'LightCoral', value: '#F08080' },
    // { name: 'LightCyan', value: '#E0FFFF' },
    // { name: 'LightGoldenRodYellow', value: '#FAFAD2' },
    // { name: 'LightGray', value: '#D3D3D3' },
    // { name: 'LightGrey', value: '#D3D3D3' },
    // { name: 'LightGreen', value: '#90EE90' },
    // { name: 'LightPink', value: '#FFB6C1' },
    // { name: 'LightSalmon', value: '#FFA07A' },
    // { name: 'LightSeaGreen', value: '#20B2AA' },
    // { name: 'LightSkyBlue', value: '#87CEFA' },
    // { name: 'LightSlateGray', value: '#778899' },
    // { name: 'LightSlateGrey', value: '#778899' },
    // { name: 'LightSteelBlue', value: '#B0C4DE' },
    // { name: 'LightYellow', value: '#FFFFE0' },
    // { name: 'Lime', value: '#00FF00' },
    // { name: 'LimeGreen', value: '#32CD32' },
    // { name: 'Linen', value: '#FAF0E6' },
    // { name: 'Magenta', value: '#FF00FF' },
    // { name: 'Maroon', value: '#800000' },
    // { name: 'MediumAquaMarine', value: '#66CDAA' },
    // { name: 'MediumBlue', value: '#0000CD' },
    // { name: 'MediumOrchid', value: '#BA55D3' },
    // { name: 'MediumPurple', value: '#9370DB' },
    // { name: 'MediumSeaGreen', value: '#3CB371' },
    // { name: 'MediumSlateBlue', value: '#7B68EE' },
    // { name: 'MediumSpringGreen', value: '#00FA9A' },
    // { name: 'MediumTurquoise', value: '#48D1CC' },
    // { name: 'MediumVioletRed', value: '#C71585' },
    // { name: 'MidnightBlue', value: '#191970' },
    // { name: 'MintCream', value: '#F5FFFA' },
    // { name: 'MistyRose', value: '#FFE4E1' },
    // { name: 'Moccasin', value: '#FFE4B5' },
    // { name: 'NavajoWhite', value: '#FFDEAD' },
    { name: 'Navy', value: '#000080' },
    // { name: 'OldLace', value: '#FDF5E6' },
    // { name: 'Olive', value: '#808000' },
    // { name: 'OliveDrab', value: '#6B8E23' },
    { name: 'Orange', value: '#FFA500' },
    // { name: 'OrangeRed', value: '#FF4500' },
    // { name: 'Orchid', value: '#DA70D6' },
    // { name: 'PaleGoldenRod', value: '#EEE8AA' },
    // { name: 'PaleGreen', value: '#98FB98' },
    // { name: 'PaleTurquoise', value: '#AFEEEE' },
    // { name: 'PaleVioletRed', value: '#DB7093' },
    // { name: 'PapayaWhip', value: '#FFEFD5' },
    // { name: 'PeachPuff', value: '#FFDAB9' },
    { name: 'Peru', value: '#CD853F' }, { name: 'Pink', value: '#FFC0CB' },
    // { name: 'Plum', value: '#DDA0DD' },
    // { name: 'PowderBlue', value: '#B0E0E6' },
    { name: 'Purple', value: '#800080' },
    // { name: 'RebeccaPurple', value: '#663399' },
    { name: 'Red', value: '#FF0000' },
    // { name: 'RosyBrown', value: '#BC8F8F' },
    // { name: 'RoyalBlue', value: '#4169E1' },
    // { name: 'SaddleBrown', value: '#8B4513' },
    // { name: 'Salmon', value: '#FA8072' },
    // { name: 'SandyBrown', value: '#F4A460' },
    // { name: 'SeaGreen', value: '#2E8B57' },
    // { name: 'SeaShell', value: '#FFF5EE' },
    // { name: 'Sienna', value: '#A0522D' },
    { name: 'Silver', value: '#C0C0C0' },
    // { name: 'SkyBlue', value: '#87CEEB' },
    // { name: 'SlateBlue', value: '#6A5ACD' },
    // { name: 'SlateGray', value: '#708090' },
    // { name: 'SlateGrey', value: '#708090' },
    // { name: 'Snow', value: '#FFFAFA' },
    // { name: 'SpringGreen', value: '#00FF7F' },
    // { name: 'SteelBlue', value: '#4682B4' },
    // { name: 'Tan', value: '#D2B48C' },
    // { name: 'Teal', value: '#008080' },
    // { name: 'Thistle', value: '#D8BFD8' },
    // { name: 'Tomato', value: '#FF6347' },
    // { name: 'Turquoise', value: '#40E0D0' },
    // { name: 'Violet', value: '#EE82EE' },
    // { name: 'Wheat', value: '#F5DEB3' },
    { name: 'White', value: '#FFFFFF' },
    // { name: 'WhiteSmoke', value: '#F5F5F5' },
    { name: 'Yellow', value: '#FFFF00' }];

    return {
        mapVN: function () {
            return mapVN;
        },
        getPaymentMethods: function () {
            return payment_methods;
        },
        getListColor: function () {
            return listColor;
        }
    };
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/***************************************************
Description: Popup
****************************************************/
var Popup = function () {
  'use strict';

  var instance;

  return {
    open: open,
    close: close
  };

  function open(params) {
    if (typeof $.magnificPopup === 'undefined') {
      alert('Popup: magnificPopup not found!');
      return false;
    } else {
      var o = $.extend({
        type: 'inline',
        removalDelay: 300,
        closeOnBgClick: true,
        closeOnContentClick: false,
        alignTop: false,
        preloader: true,
        enableEscapeKey: true,
        showCloseBtn: true,
        closeBtnInside: true,
        modal: false,
        effect: 'popupAnimFade',
        overflowY: 'scroll',
        fixedContentPos: 'auto',
        fixedBgPos: true,
        index: null,
        gallery: {
          enabled: true,
          tCounter: '%curr%/%total%'
        },
        beforeOpen: function () {},
        open: function () {},
        beforeClose: function () {},
        close: function () {},
        afterClose: function () {},
        imageLoadComplete: function () {},
        buildControls: function () {},
        callbacks: {
          beforeOpen: function () {
            this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
            if (o.effect.length) {
              this.st.mainClass = o.effect;
            }
            if (typeof o.beforeOpen === 'function') o.beforeOpen();
          },
          open: function () {
            if (typeof o.open === 'function') o.open();
          },
          beforeClose: function () {
            if (typeof o.beforeClose === 'function') o.beforeClose();
          },
          close: function () {
            this.wrap.removeClass('mfp-image-loaded');
            if (typeof o.close === 'function') o.close();
          },
          afterClose: function () {
            if (typeof o.afterClose === 'function') o.afterClose();
          },
          imageLoadComplete: function () {
            var self = this;
            setTimeout(function () {
              self.wrap.addClass('mfp-image-loaded');
              if (typeof o.imageLoadComplete === 'function') o.imageLoadComplete();
            }, 16);
          },
          buildControls: function () {
            // try{
            // 	var contaniner = this.contentContainer;
            // 	var arrowLeft = this.arrowLeft;
            // 	var arrowRight = this.arrowRight;
            // 	contaniner.append(arrowLeft.add(arrowRight));
            // 	if(typeof o.buildControls === 'function') o.buildControls();
            // }
            // catch(err){
            // 	throw new Error(err);
            // }
          }
        }
      }, params);

      if (instance) {
        instance.close();
      }

      instance = $.magnificPopup.open(o);
    }
  }

  function close() {
    $.magnificPopup.close();
  }
}();

module.exports = window.Popup = Popup;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 35 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /******************************************************************
    Array
    *******************************************************************/

  Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][name] == value) {
        return i;
      }
    }
    return -1;
  };

  Array.prototype.removeAt = function (index) {
    var b = this.splice(index, 1);
    return b;
  };
  /******************************************************************
    String
    *******************************************************************/
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
      if (m == '{{') {
        return '{';
      }
      if (m == '}}') {
        return '}';
      }
      return args[n];
    });
  };

  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };

  String.prototype.getQueryString = function (name) {
    var a = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + a + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(this);
    if (results === null) return '';else return decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  /******************************************************************
    Number
    *******************************************************************/
})();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(io) {angular.module('Core').service("Socket", Socket).service("PubSub", PubSub).service("Cart", Cart).constant('KEY_LOCAL_STORAGE', {
    key_id_verhicle: 'id_verhicle',
    key_info_checkout: 'info_checkout',
    key_shipping_info: 'info_shiping'
});

// set key to save info local verhice

function Socket($http, $cookies, $window) {
    var cookieKey = window.cmsname + '-token';
    var jwt = $cookies.get(cookieKey);

    console.log('Token: ' + jwt);
    if (!jwt || !jwt.length) {
        console.log('There is no token');
    }

    var socket = io($window.settings.services.socketApi);
    socket.on('connect', function () {
        socket.emit('authenticate', { token: jwt }); //send the jwt
        socket.on('authenticated', function () {
            // use the socket as usual
            console.log('User is authenticated');
        });
        socket.on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
            throw new Error(msg.data.type);
        });
    });
    return socket;
}

function PubSub(Socket) {
    var container = [];
    return {
        getChannel: function (options) {

            var collectionName = options.collectionName;
            var action = options.action;
            var modelId = options.modelId;
            var method = options.method;

            var names = [];

            names.push(collectionName, action, modelId, method);
            names = names.filter(function (item) {
                //remove empty element
                return item ? true : false;
            });
            var channel = names.join('/');
            return channel;
        },
        subscribe: function (options, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("subscribe: " + channel);
                Socket.on(channel, callback);
                container.push(channel);
            } else {
                throw 'Options must be an object';
            }
        },
        publish: function (options, data, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("publish: " + channel);
                Socket.emit(channel, data, callback);
            } else {
                throw 'Options must be an object';
            }
        },
        unSubscribe: function (options) {
            var channel = this.getChannel(options);
            var index = container.indexOf(channel);
            container.splice(index, 1);
        },
        unSubscribeAll: function () {
            for (var index = 0; index < container.length; index++) {
                Socket.removeAllListeners(container[index]);
            }
            container = [];
        }

    };
}

function Cart(KEY_LOCAL_STORAGE) {
    return {
        addProduct: addProduct,
        removeProduct: removeProduct,
        getCart: getCart,
        removeCart: removeCart,
        saveProduct: saveProduct,
        getVerhicleId: getVerhicleId
    };

    function addProduct(product, quantity) {
        return { msg: 'Ok' };
    }

    function removeProduct(product) {
        return { msg: 'Ok' };
    }

    function getCart() {
        return { msg: 'Ok' };
    }

    function removeCart() {
        return { msg: 'Ok' };
    }

    // save product (verhicle) to local Storage
    function saveProduct(id) {
        var time = 30 * 24 * 60 * 60;
        if (typeof Storage !== "undefined") {
            Storage.set(KEY_LOCAL_STORAGE.key_id_verhicle, id, time);
        } else {
            console.error('The browser does not support Storage.');
        }
    }

    // get product (verhicle) from local Storage
    function getVerhicleId() {
        if (typeof Storage !== "undefined") {
            var data = Storage.get(KEY_LOCAL_STORAGE.key_id_verhicle);
            return data;
        } else {
            console.error('The browser does not support Storage.');
            return null;
        }
    }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 37 */
/***/ (function(module, exports) {

/***************************************************
Description: Sort algorithms
****************************************************/
var Sort = function () {
  return {
    bubble: bubbleSort,
    quick: quickSort,
    merge: mergeSort,
    selection: selectionSort,
    insertion: insertionSort
  };

  function bubbleSort(arr) {
    if (arr.length <= 1) return arr;
    var alen = arr.length;
    for (var i = 0; i < alen; i++) {
      for (var j = 0; j < alen - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  function quickSort(arr) {
    if (arr.length <= 1) return arr;
    var pivot = Math.floor((arr.length - 1) / 2),
        pivotValue = arr[pivot],
        left = [],
        right = [];
    arr = arr.slice(0, pivot).concat(arr.slice(pivot + 1));
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] < pivotValue) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [].concat(quickSort(left), [pivotValue], quickSort(right));
  }

  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    var mid = Math.floor(arr.length / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid);

    var merge = function merge(left, right) {
      var result = [];
      while (left.length && right.length) {
        if (left[0] < right[0]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
      return result.concat(left).concat(right);
    };
    return merge(mergeSort(left), mergeSort(right));
  }

  function selectionSort(arr) {
    for (var i = 0; i < arr.length; i++) {
      var min = i;
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) {
          min = j;
        }
      }
      if (min != i) {
        var temp = arr[min];
        arr[min] = arr[i];
        arr[i] = temp;
      }
    }
    return arr;
  }

  function insertionSort(arr) {
    for (var i = 0; i < arr.length; i++) {
      var j = i - 1,
          temp = arr[i];
      while (j >= 0 && arr[j] > temp) {
        arr[j + 1] = arr[j];
        arr[j] = temp;
        j--;
      }
    }
    return arr;
  }
}();

module.exports = window.Sort = Sort;

/***/ }),
/* 38 */
/***/ (function(module, exports) {

var Storage = function (window) {
  'use strict';

  var configs = {
    prefix: 'skeleton'
  };

  return {
    get: get,
    set: set,
    remove: remove,
    clear: clear
  };

  function get(name) {
    var date = new Date();
    var current = Math.round(+date / 1000);
    var storedData = JSON.parse(window.localStorage.getItem(configs.prefix + '.' + name)) || {};
    var storedTime = storedData.storageExpireTime || 0;

    if (storedTime && storedTime < current) {
      remove(configs.prefix + '.' + name);
      return undefined;
    } else {
      return storedData.store;
    }
  }

  function set(name, value, seconds) {
    var date = new Date();
    var schedule = Math.round(date.setSeconds(date.getSeconds() + seconds) / 1000);
    var data = JSON.stringify({ storageExpireTime: schedule, store: value });

    try {
      window.localStorage.setItem(configs.prefix + '.' + name, data);
    } catch (e) {
      if (e == window.QUOTA_EXCEEDED_ERR) {
        alert('Quota exceeded!');
      }
    }

    return data;
  }

  function remove(name) {
    window.localStorage.removeItem(configs.prefix + '.' + name);
  }

  function clear() {
    window.localStorage.clear();
  }
}(window);

module.exports = window.Storage = Storage;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

angular.module('Category', []);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {angular.module('Category').controller('categoryCtrl', categoryCtrl);

function categoryCtrl($scope, $filter, $cookies) {
    var vmCategory = this;

    // Methoad
    vmCategory.init = init;
    vmCategory.showMore = showMore;
    vmCategory.showProduct = 16;
    vmCategory.showNumEach = 16;

    // Function
    function init() {
        $('#show-more').removeClass('none');
    }

    function showMore() {
        vmCategory.showProduct += vmCategory.showNumEach;
    }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 41 */
/***/ (function(module, exports) {

angular.module('Checkout', []);

/***/ }),
/* 42 */
/***/ (function(module, exports) {

angular.module('Checkout').controller("checkoutCtrl", checkoutCtrl);

function checkoutCtrl($scope, Cart, KEY_LOCAL_STORAGE, Option, CheckoutSv, toastr) {
    var vmCheckout = this;
    ////////////////////// VARIABLE //////////////////////
    vmCheckout.ALLOW_SUBMIT_ORDER = false; // enanle/disable button Đặt mua
    const KEY_INFO_CHECKOUT_LOCAL = KEY_LOCAL_STORAGE.key_info_checkout || 'info_checkout'; // key to set or get info local storage
    const KEY_INFO_SHIPPING_LOCAL = KEY_LOCAL_STORAGE.key_shipping_info || 'info_shiping'; // enanle/disable button Đặt mua
    vmCheckout.mapVN = Option.mapVN();
    vmCheckout.Verhicle = null;
    vmCheckout.listAgent = [];
    vmCheckout.Agents = [];
    vmCheckout.STEP = {
        _1: {
            name: 'ENTER-CONTACT',
            status: 'NONE' // SHOW-FORM || DONE
        },
        _2: {
            name: 'ENTER-SHIPING-INFO',
            status: 'NONE' // SHOW-FORM || DONE
        },
        _3: {
            name: 'CHOOSE-PAYMENT-METHOD',
            status: 'NONE' // SHOW-FORM || DONE
        }
    };
    vmCheckout.Coupon = {
        formStatus: 'LOCK', // LOCK | SHOW_INPUT | HASCOUPON,
        code: '',
        object: null,
        error: false,
        message: ''
    };

    vmCheckout.formData = {
        customer_info: {
            customer: null,
            name: '',
            phone: '',
            email: ''
        },
        shipping_info: {
            agent: null,
            name: '',
            email: '',
            phone: '',
            address: '',
            province: '',
            district: ''
        },
        products: [],
        coupon: {
            id: null,
            code: '',
            name: '',
            value: 0
        },
        payment_method: 'COD',
        type: 'XE',
        status: 'NEW',
        total: 0,
        total_pay: 0,
        total_deposit: 0,
        total_extant: 0
    };

    ////////////////////// METHODS //////////////////////
    vmCheckout.initData = initData;
    vmCheckout.filterAgent = filterAgent;
    vmCheckout.showFormAddCoupon = showFormAddCoupon;
    vmCheckout.checkCoupon = checkCoupon;
    vmCheckout.cancelCoupon = cancelCoupon;
    vmCheckout.onEnterCoupon = onEnterCoupon;
    vmCheckout.onChangeAgent = onChangeAgent;

    vmCheckout.doneStep1 = doneStep1;
    vmCheckout.doneStep2 = doneStep2;
    vmCheckout.doneStep3 = doneStep3;

    // open form
    vmCheckout.openFormStep = openFormStep;
    // hide form
    vmCheckout.closeForm = closeForm;
    // user click edit form done
    vmCheckout.editInfoStep = editInfoStep;

    vmCheckout.submitOrder = submitOrder;

    ////////////////////// FUNCTION //////////////////////
    function initData() {
        initInfoLocal();
        initVerhicle();
    }

    function initInfoLocal() {
        CheckoutSv.getAgents().then(function (res) {
            vmCheckout.Agents = res.data;
            var infoCheckout = CheckoutSv.getInfoLocal(KEY_INFO_CHECKOUT_LOCAL);
            if (infoCheckout) {
                angular.extend(vmCheckout.formData.customer_info, infoCheckout);
                doneStep1(true);
                var infoShipping = CheckoutSv.getInfoLocal(KEY_INFO_SHIPPING_LOCAL);{
                    if (infoShipping) {
                        angular.extend(vmCheckout.formData.shipping_info, infoCheckout);
                        doneStep2(true);
                    }
                }
            } else {
                openFormStep(1);
            }
        }).catch(function (err) {
            openFormStep(1);
        });
    }

    function initVerhicle() {
        var idVerhicle = Cart.getVerhicleId() || '592e8a05fa0c0b58a972c710';
        CheckoutSv.getVerhicle(idVerhicle).then(function (verhicle) {
            vmCheckout.Verhicle = verhicle;
            // console.log(111, verhicle);

            // 1. Set order detail info
            var itemOrder = {
                product: vmCheckout.Verhicle._id,
                qty: 1,
                price: vmCheckout.Verhicle.price_user,
                total: vmCheckout.Verhicle.price_user
            };
            vmCheckout.formData.products = [itemOrder];

            // 2. Set order info
            var orderInfo = {
                total: vmCheckout.Verhicle.price_user,
                total_pay: vmCheckout.Verhicle.price_user,
                total_deposit: vmCheckout.Verhicle.deposit,
                total_extant: vmCheckout.Verhicle.price_user - vmCheckout.Verhicle.deposit
            };
            angular.extend(vmCheckout.formData, orderInfo);
        }).catch(function (err) {
            console.log(err);
        });
    }

    // on change district || province => filter agent
    function filterAgent(type) {
        vmCheckout.formData.shipping_info.agent = null;
        if (vmCheckout.formData.shipping_info.province != '') {
            CheckoutSv.filterAgent({
                province: vmCheckout.formData.shipping_info.province,
                district: vmCheckout.formData.shipping_info.district != '' ? vmCheckout.formData.shipping_info.district : null
            }).then(function (res) {
                if (res.success) {
                    vmCheckout.listAgent = res.data;
                    if (res.data.length == 0) {}
                }
            }).catch(function (err) {
                vmCheckout.listAgent = [];
                console.log('err', err);
                toastr.error("Không thể tải danh sách đại lý", 'Đại lý');
            });
        }
    }

    // show form add coupon => change status form
    function showFormAddCoupon() {
        if (vmCheckout.Coupon.formStatus === 'LOCK') vmCheckout.Coupon.formStatus = 'SHOW_INPUT';
        if (vmCheckout.Coupon.formStatus === 'HASCOUPON') {
            cancelCoupon();
            vmCheckout.Coupon.formStatus = 'SHOW_INPUT';
        }
    }

    // send request checkCoupon
    function checkCoupon() {}

    function cancelCoupon() {
        // reset coupon's order data
        angular.extend(vmCheckout.formData.coupon, {
            coupon: {
                id: null,
                code: '',
                name: '',
                value: 0
            }
        });

        // reset form data
        vmCheckout.Coupon = {
            code: '',
            object: null,
            error: false,
            message: ''
        };
    }

    function onEnterCoupon() {
        vmCheckout.Coupon.code = vmCheckout.Coupon.code.toUpperCase();
    }

    function onChangeAgent() {
        var agent = vmCheckout.listAgent.find(e => {
            return e._id == vmCheckout.formData.shipping_info.agent;
        });
        if (agent) {
            angular.extend(vmCheckout.formData.shipping_info, agent);
        }
    }

    // change to process to next step
    function doneStep1(isValid) {
        if (isValid) {
            CheckoutSv.saveInfoCheckout(KEY_INFO_CHECKOUT_LOCAL, vmCheckout.formData.customer_info);
            vmCheckout.STEP._1.status = 'DONE';
            vmCheckout.STEP._2.status = 'SHOW-FORM';
        } else {
            toastr.error("Thông tin liên hệ chưa hợp lệ!", 'Lỗi');
        }
    }

    function doneStep2(isValid) {
        if (isValid) {
            CheckoutSv.saveInfoCheckout(KEY_INFO_SHIPPING_LOCAL, vmCheckout.formData.shipping_info);
            vmCheckout.STEP._2.status = 'DONE';
            vmCheckout.STEP._3.status = 'SHOW-FORM';
        } else {
            toastr.error("Thông tin giao hàng chưa hợp lệ!", 'Lỗi');
        }
    }

    function doneStep3(isValid) {}

    function openFormStep(step) {
        if (step == 1) {
            vmCheckout.STEP._1.status = 'SHOW-FORM';
        }
        if (step == 2) {
            vmCheckout.STEP._2.status = 'SHOW-FORM';
        }
        if (step == 3) {
            vmCheckout.STEP._3.status = 'SHOW-FORM';
        }
    }

    function closeForm(step) {
        if (step == 1) {
            vmCheckout.STEP._1.status = 'NONE';
        }
        if (step == 2) {
            vmCheckout.STEP._2.status = 'NONE';
        }
        if (step == 3) {
            vmCheckout.STEP._3.status = 'NONE';
        }
    }

    function editInfoStep(step) {
        if (step == 1) {
            openFormStep(1);
            closeForm(2);closeForm(3);
        }
        if (step == 2) {
            openFormStep(2);
            closeForm(1);closeForm(3);
        }
        if (step == 3) {
            openFormStep(3);
            closeForm(1);closeForm(2);
        }
    }

    function submitOrder() {}
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('Checkout').service('CheckoutSv', CheckoutSv).factory('CheckoutFac', CheckoutFac);

function CheckoutFac($window, $resource) {
    return $resource(window.settings.services.apiUrl + '/:method/:param1/:param2', { method: '@method', param1: '@param1', param2: '@param2' }, {});
}

function CheckoutSv($q, $window, CheckoutFac) {
    return {
        getAgents: getAgents,
        filterAgent: filterAgent,
        getVerhicle: getVerhicle,

        saveInfoCheckout: saveInfoCheckout,
        getInfoLocal: getInfoLocal
    };

    function filterAgent(data) {
        var province = data.province;
        var district = data.district ? data.district : null;
        var getData = new CheckoutFac();
        var method = 'filter-agent';
        return getData.$get({ method: method, param1: province, param2: district });
    }

    function getAgents() {
        var getData = new CheckoutFac();
        var method = 'agents';
        return getData.$get({ method: method });
    }

    function getVerhicle(id) {
        var getData = new CheckoutFac();
        var method = 'cart';
        var param1 = 'verhicle';
        var param2 = id;
        return getData.$get({ method: method, param1: param1, param2: param2 });
    }

    // save InfoCheckout to local storage
    function saveInfoCheckout(key, data) {
        let time = 30 * 24 * 60 * 60;
        if (typeof Storage !== "undefined") {
            Storage.set(key, data, time);
        } else {
            console.error('The browser does not support Storage.');
        }
    }

    function getInfoLocal(key) {
        if (typeof Storage !== "undefined") {
            var data = Storage.get(key);
            return data;
        } else {
            console.error('The browser does not support Storage.');
            return null;
        }
    }
}

/***/ }),
/* 44 */
/***/ (function(module, exports) {

angular.module('Contact', []);

/***/ }),
/* 45 */
/***/ (function(module, exports) {

angular.module('Contact').controller("ContactController", ContactController);

function ContactController($scope, $filter, ContactService) {
    alert(2222);
    $scope.submit = function () {
        if ($scope.contactForm.$valid) {
            var data = { name: this.name, email: this.email, message: this.message };
            var promise = ContactService.submit(data);
            console.log(promise);
            promise.then(function (data, status, headers) {
                if (data.status == 1) {
                    $scope.contactSuccess = true;
                } else {
                    $scope.errors = data.messages;
                }
            });
        }
    };
}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

angular.module('Contact').service("ContactService", ContactService);

function ContactService($http, $window) {
    // console.log($resource)
    return {
        submit: function (data) {
            return $http.post($window.settings.services.contactApi + '/api/contact', data);
        }
    };
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {



/***/ }),
/* 48 */
/***/ (function(module, exports) {



/***/ }),
/* 49 */
/***/ (function(module, exports) {

angular.module('Home', []);

/***/ }),
/* 50 */
/***/ (function(module, exports) {

angular.module('Home').controller("homeCtrl", homeCtrl);

function homeCtrl($scope) {
    var vmHome = this;
};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

angular.module('Home').service('homeSvc', homeSvc);

function homeSvc($http, $window) {
    return {};
}

/***/ }),
/* 52 */
/***/ (function(module, exports) {



/***/ }),
/* 53 */
/***/ (function(module, exports) {



/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$('#mod-news-banner').slick({
  slidesToScroll: 1,
  // autoplay: true,
  dots: true,
  infinite: true,
  // autoplaySpeed: 2000,
  arrows: false
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 55 */
/***/ (function(module, exports) {

angular.module('Notify', ['Core']);

/***/ }),
/* 56 */
/***/ (function(module, exports) {

angular.module('Notify').controller("NotifyController", NotifyController);

function NotifyController($scope, $filter, NotifyService, PubSub) {

    $scope.messages = [];

    var findIndexOfMessage = function (message) {
        return $scope.messages.findIndex(function (element, index, array) {
            //console.log('message id :'+ message._id);
            if (element._id == message._id) {
                return true;
            }
            return false;
        });
    };

    var onMessages = function (data) {
        console.log(data);
        $scope.messages = data;
        $scope.$apply();
    };

    var onMessageCreated = function (message) {
        $scope.messages.push(message);
        $scope.action = "Created: " + message.title;
        $scope.$apply();
    };
    var onMessageDeleted = function (message) {
        console.log(message);
        $scope.action = "Deleted: " + message.title;
        var index = findIndexOfMessage(message);
        console.log(index);
        $scope.messages.splice(index, 1);
        $scope.$apply();
    };
    var onMessageUpdated = function (message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    };
    var onPriceUpdated = function (message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    };
    var onRoomJoined = function (data) {
        console.log("Join Room: " + data.room);
        $scope.action = "Join Room: " + data.room;
        $scope.$apply();

        //listening message after join room
        //get messages
        var options = { collectionName: 'messages', action: 'all' };
        PubSub.publish(options, onMessages); //emit
        //listening message change by other user
        PubSub.subscribe({ collectionName: 'message', action: 'created' }, onMessageCreated); //on
        PubSub.subscribe({ collectionName: 'message', action: 'deleted' }, onMessageDeleted);
        PubSub.subscribe({ collectionName: 'message', action: 'updated' }, onMessageUpdated);

        PubSub.subscribe({ collectionName: 'product', action: 'priceUpdated' }, onPriceUpdated);
    };
    $scope.totalMessage = 0;

    //join room
    //var rooms = ['notification','product-1'];
    $scope.joinRoom = function () {
        var rooms = $scope.myrooms;
        var options = { collectionName: 'room', action: 'join' };
        PubSub.publish(options, { roomId: rooms }, onRoomJoined);
    };

    $scope.deleteMessage = function () {};
    $scope.updateMessage = function () {};
    $scope.newMessage = function () {};
};

/***/ }),
/* 57 */
/***/ (function(module, exports) {

angular.module('Notify').service("NotifyService", NotifyService);

function NotifyService(PubSub) {
    return {};
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
    'use strict';

    var modHome = $("#mod-banner-gen");
    if (modHome.length > 0) {

        function sliderBannerHome() {
            modHome.find(".list-item").slick({
                dots: true,
                customPaging: function (slider, i) {
                    var thumb = $(slider.$slides[i]).data('thumb');
                    console.log(thumb);
                    return '<a>' + thumb + '</a>';
                },
                centerMode: true,
                centerPadding: '150px',
                slidesToShow: 1,
                arrows: true,
                slidesToScroll: 1,
                autoplaySpeed: 5000

            });
        }
        $(document).ready(function () {
            sliderBannerHome();
        });
    }
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
	'use strict';

	var modHome = $(".mod-banner-buy");

	if (modHome.length > 0) {

		function sliderBannerHome() {
			modHome.find(".ct-moto").slick({
				slidesToShow: 2,
				slidesToScroll: 2,
				dots: true,
				arrows: true,
				autoplay: false,
				autoplaySpeed: 5000
			});
		}
		$(document).ready(function () {
			sliderBannerHome();
		});
	}
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
	'use strict';

	var modHome = $("#mod-banner");

	if (modHome.length > 0) {

		function sliderBannerHome() {
			modHome.find(".list-iem").slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				arrows: true,
				autoplay: false,
				autoplaySpeed: 5000
			});
		}
		$(document).ready(function () {
			sliderBannerHome();
		});
	}
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {(function () {
	'use strict';

	var $modMenu = $("#mod-menu");
	var openClass = 'is-open',
	    closeClass = 'is-close',
	    $modMenuMb = $('#mod-menu-mob');

	function bzPullMenu() {

		$modMenuMb.find(".pull-menu").on('click', function (event) {
			console.log("1");
			event.preventDefault();
			if ($(this).hasClass(openClass)) {
				close();
				console.log("close");
			} else {
				open();
				console.log("open");
			}
		});

		function open() {
			$modMenuMb.find(".pull-menu").removeClass(closeClass).addClass(openClass);
			$modMenu.find(".menu-desk").removeClass(closeClass).addClass(openClass);
			$modMenu.find(".menu-gender").removeClass(closeClass).addClass(openClass);
		}

		function close() {
			$modMenuMb.find(".pull-menu").removeClass(openClass).addClass(closeClass);
			$modMenu.find(".menu-desk").removeClass(openClass).addClass(closeClass);
			$modMenu.find(".menu-gender").removeClass(openClass).addClass(closeClass);
		}
	}

	$(document).ready(function () {
		// bzDesktopMenu();
		bzPullMenu();
	});
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$("#engine").on("hide.bs.collapse", function () {
	$(".view-btn1").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
});
$("#engine").on("show.bs.collapse", function () {
	$(".view-btn1").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});
$("#bone").on("hide.bs.collapse", function () {
	$(".view-btn2").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
});
$("#bone").on("show.bs.collapse", function () {
	$(".view-btn2").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});
$("#size").on("hide.bs.collapse", function () {
	$(".view-btn3").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
});
$("#size").on("show.bs.collapse", function () {
	$(".view-btn3").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});

$('#mod-product-detail-banner').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	dots: true,
	arrows: true,
	autoplay: true,
	autoplaySpeed: 2000
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 64 */
/***/ (function(module, exports) {

angular.module('Product', []);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {angular.module('Product').controller('productCtrl', productCtrl);

function productCtrl($scope, $filter, $cookies) {
    var vmProduct = this;

    // Methoad
    vmProduct.init = init;
    vmProduct.changeImage = changeImage;

    // Function
    function init() {}

    function changeImage(image) {
        var img_old = $('#img-product').css(['background-image'])['background-image'].split('/').pop().split('"')[0];
        if (img_old != image) {
            $('#img-product').fadeOut('fast').css('background-image', 'url(files/product/' + image + ')').fadeIn();
        }
    }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 66 */
/***/ (function(module, exports) {

angular.module('Search', []);

/***/ }),
/* 67 */
/***/ (function(module, exports) {

angular.module('Search').controller('searchCtrl', searchCtrl);

function searchCtrl($scope, $filter, $cookies) {
    var vmSearch = this;

    // Methoad
    vmSearch.init = init;

    // Function
    function init() {}
}

/***/ }),
/* 68 */
/***/ (function(module, exports) {



/***/ }),
/* 69 */
/***/ (function(module, exports) {

angular.module('Auth', []);

/***/ }),
/* 70 */
/***/ (function(module, exports) {

angular.module('Auth').controller('AuthController', AuthController);

function AuthController($scope, $filter, AuthService, $cookies) {

    $scope.register = register;
    $scope.login = login;
    $scope.logout = logout;
    $scope.myaccount = myaccount;
    $scope.updateMyAccount = updateMyAccount;
    $scope.changePassword = changePassword;
    $scope.reset = reset;
    $scope.forgot = forgot;

    console.log(1111111111);
    alert(22222);

    function register() {
        if ($scope.registerForm.$valid) {
            var data = {
                name: this.name,
                email: this.email,
                password: this.password,
                cfpassword: this.cfpassword
            };
            AuthService.register(data).then(function (res) {
                $scope.registerSuccess = true;
                window.location.href = '/login';
            }).catch(function (res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function login() {
        if ($scope.loginForm.$valid) {
            var data = {
                email: this.email,
                password: this.password
            };
            AuthService.login(data).then(function (res) {
                $scope.loginSuccess = true;
                console.log(res.data.token);
                $cookies.put('token', res.data.token);
                window.location.href = '/';
            }).catch(function (res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function logout() {
        AuthService.logout().then(function (res) {
            $cookies.put('token', '');
            window.location.href = '/';
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function myaccount() {
        AuthService.account().then(function (res) {
            $scope.user = res.data;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function updateMyAccount() {
        var data = {
            email: this.user.email,
            name: this.user.name
        };
        AuthService.updateAccount(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function changePassword() {
        var data = {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        AuthService.changepassword(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function reset() {
        var data = {
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        var resetPasswordToken = angular.element('#resetPasswordToken').val();
        console.log(resetPasswordToken);
        AuthService.reset(resetPasswordToken, data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function forgot() {
        var data = { email: this.email };
        AuthService.forgot(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };
}

/***/ }),
/* 71 */
/***/ (function(module, exports) {

angular.module('Auth').service('AuthService', AuthService);

function AuthService($http, $window) {
    return {
        register: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/register', data);
        },
        login: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/login', data);
        },
        forgot: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/forgot', data);
        },
        account: function () {
            return $http.get($window.settings.services.userApi + '/api/user/account');
        },
        logout: function () {
            return $http.get($window.settings.services.userApi + '/api/user/logout');
        },
        updateAccount: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/updateprofile', data);
        },
        profile: function () {
            return $http.get($window.settings.services.userApi + '/api/user/profile');
        },
        changepassword: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/changepassword', data);
        },
        reset: function (token, data) {
            return $http.post($window.settings.services.userApi + '/api/user/reset?token=' + token, data);
        }
    };
}

/***/ }),
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 77 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 78 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 79 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 80 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 81 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 82 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 83 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 84 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 85 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 86 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 87 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 88 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 89 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 90 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 91 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 92 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 93 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 94 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(76);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);
__webpack_require__(32);
__webpack_require__(33);
__webpack_require__(34);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(37);
__webpack_require__(38);
__webpack_require__(77);
__webpack_require__(39);
__webpack_require__(40);
__webpack_require__(78);
__webpack_require__(41);
__webpack_require__(42);
__webpack_require__(43);
__webpack_require__(79);
__webpack_require__(44);
__webpack_require__(45);
__webpack_require__(46);
__webpack_require__(80);
__webpack_require__(47);
__webpack_require__(81);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(50);
__webpack_require__(51);
__webpack_require__(82);
__webpack_require__(52);
__webpack_require__(83);
__webpack_require__(53);
__webpack_require__(84);
__webpack_require__(54);
__webpack_require__(55);
__webpack_require__(56);
__webpack_require__(57);
__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(90);
__webpack_require__(91);
__webpack_require__(58);
__webpack_require__(59);
__webpack_require__(60);
__webpack_require__(61);
__webpack_require__(92);
__webpack_require__(62);
__webpack_require__(93);
__webpack_require__(63);
__webpack_require__(64);
__webpack_require__(65);
__webpack_require__(66);
__webpack_require__(67);
__webpack_require__(94);
__webpack_require__(68);
__webpack_require__(69);
__webpack_require__(70);
module.exports = __webpack_require__(71);


/***/ })
]),[131]);