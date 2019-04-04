import EXIF from './exif'

//金额格式化(千分符)
export function formatMoney(Number, n) {
    let _this = parseFloat(Number)
    let dot = n === 0
    n = n > 0 && n <= 20 ? n : 2;
    let formatMoney = parseFloat((_this + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = formatMoney.split(".")[0].split("").reverse(), r = formatMoney.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + (dot ? '' : ("." + r));
}

// 浮点数相加
export function addFloat(number1, number2) {
    return (parseFloat(number1) * 10000000000 + parseFloat(number2) * 10000000000) / 10000000000
}

// 距离格式化
export function distanceFormat(distance) {
    distance = parseFloat(distance)
    if (!distance) return ''
    return distance > 999 ? (distance / 1000).toFixed(2) + 'km' : distance + 'm'
}


/*
* 时间格式化
* */
Date.prototype.formatDate = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
//得到某天的前天，后天
Date.prototype.getCountDate = function (num) {
    return new Date(this.setDate(this.getDate() + num)).format('yyyy-MM-dd');
}
//某月最后一天
Date.prototype.getMonthEnd = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1).toJSON().substring(0, 10);
}
//某月多少天
Date.prototype.getMonthDays = function () {
    var curMonth = this.getMonth();
    this.setMonth(curMonth + 1);
    this.setDate(0);
    return this.getDate();
}
//某日是某年的第几周
Date.prototype.getTheWeek = function () {
    var totalDays = 0, now = this;
    var years = now.getFullYear()
    if (years < 1000)
        years += 1900
    var days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    //判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29
    } else {
        days[1] = 28
    }

    if (now.getMonth() == 0) {
        totalDays = totalDays + now.getDate();
    } else {
        var curMonth = now.getMonth();
        for (var count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
        }
        totalDays = totalDays + now.getDate();
    }
    //得到第几周
    var week = Math.ceil(totalDays / 7);
    return week;
}

/*
* String 处理
* */

//字符串超出点
export function formatEllipsis(obj, length) {
    if (!obj && typeof obj !== 'string') return '';
    return obj.length > length ? obj.slice(length) : obj
}

// 去敏处理
export function formatBankFour(str) {  //银行卡后四位
    return str.substr(str.length - 4)
}

export function formatBankSensitive(str) { //银行卡
    str = str + '';
    return str.substr(0, 4) + '*'.repeat(str.length - 8) + str.substr(str.length - 4)
}

export function formatPhoneSensitive(str) {
    str = str + '';
    return str.substr(0, 3) + '*'.repeat(str.length - 7) + str.substr(str.length - 4)
}

// 添加百分号
export function formatNumberPercent(str) {
    return str * 1000000000 / 10000000 + '%'
}

// 名字掩码
export function formatName(str) {
    return str.substr(0, 1) + '*'.repeat(str.length - 1)
}

//银行卡格式化
export function formatBankShow(card) {
    card = card + '';
    if (card.length < 1) return ''
    if (card.length > 0 && card.length < 5) return card
    if (card.length > 4) {
        return card.slice(0, 4) + ' ' + formatBankCard(card.slice(4))
    }
}


/*
* 类型判断
* */
const _ARRAY_NAME = "[object Array]"
const _OBJECT_NAME = "[object Object]"
const _FUNCTION_NAME = "[object Function]"

// 得到对象类型
function _isType(obj) {
    return Object.prototype.toString.call(obj)
}

export function isFunction(obj) {
    return _isType(obj) == _FUNCTION_NAME
}

export function isObject(obj) {
    return _isType(obj) == _OBJECT_NAME
}

export function isArray(obj) {
    return _isType(obj) == _ARRAY_NAME
}

export function isEmptyObject(obj) {  //是否是空对象
    for (let t in obj) {
        return false;
    }
    return true;
}

/*
* input 输入限制
* */

//处理金额限制
export function formatMoneyInput(value, n) {
    n = n || 2;
    if (value.match(/^0\d/)) value = value.slice(1)
    if (n == 0) value = value.replace(/\./g, '')
    if (value.match(/[^\d\.]/g)) return value.replace(/[^\d\.]/g, '')
    if (value.match(/^\./)) return '0.';
    var values = value.split('.')
    if ((values.length == 2 && values[1].length > 2) || values.length == 3) return values[0] + '.' + values[1].substr(0, 2);
    return value;
}

// 手机号限制
export function formatPhoneInput(value) {
    value = value.replace(/^\d/g, '')
    // iphone联系人复制出现问题
    var val = value.split("");
    value = val.filter(item => {
        if (item && item != '') {
            return item
        }
    })
    return value
}

//移除表情
// value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'');

//银行卡限制
export function formatBankCardInput(card) {
    card = card.replace(/[^\d\w]/g, '')
    card = card + '';
    if (card.length < 1) return ''
    if (card.length > 0 && card.length < 5) return card
    if (card.length > 4) {
        return card.slice(0, 4) + ' ' + formatBankCardInput(card.slice(4))
    }
}


/*
* HTML 属性
* */

//获取当前css浏览器前缀
export function getVendorPrefix() {
    var body = document.body || document.documentElement,
        style = body.style,
        vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'],
        i = 0;
    while (i < vendor.length) {
        if (typeof style[vendor[i] + 'Transition'] === 'string') {
            return vendor[i];
        }
        i++;
    }
}

//获取 translate 坐标
export function getTranslateInfo(t) {
    var reg = /translate\((.+)px?,(.+)px?\)/
    var rst = reg.exec(t)
    if (rst) {
        return {
            x: parseFloat(rst[1]),
            y: parseFloat(rst[2])
        }
    } else {
        return {
            x: 0,
            y: 0
        }
    }
}

//获取查询字段
export function getQueryString(name) {
    let search = window.location.search;
    let searchs = [], params = {}
    if (search && search.indexOf('&') !== -1) {
        searchs = search().substr(1).split('&')
    }
    searchs.forEach((item) => {
        if (item.indexOf('=') !== -1) {
            let info = item.split('=')
            params[info[0]] = info[1]
        }
    })
    if (name) return params[name]
    return params
}


//深扩展
function _extend(target, source) {
    if (_isType(source) == _ARRAY_NAME) {
        for (var i = 0; i < source.length; i++) {
            if (_isType(source[i]) == _ARRAY_NAME) {
                target[i] = source[i].concat(target[i] ? target[i] : [])
                _extend(target[i], source[i])
            } else if (_isType(source[i]) == _OBJECT_NAME) {
                target[i] = target[i] ? target[i] : {}
                _extend(target[i], source[i])
            } else {
                target[i] = source[i]
            }
        }
    } else {
        for (var v in source) {
            if (_isType(source[v]) == _ARRAY_NAME) {
                target[v] = source[v].concat(target[v] ? target[v] : [])
                _extend(target[v], source[v])
            } else if (_isType(source[v]) == _OBJECT_NAME) {
                target[v] = target[v] ? target[v] : {}
                _extend(target[v], source[v])
            } else {
                target[v] = source[v]
            }
        }
    }
    return target;
}

export function extend(target) {
    var targets, arg = Array.from(arguments).slice(1, arguments.length);
    if (arg.length > 0) {
        targets = _extend(target, arg[0])
    }
    if (arg.length > 1) {
        return extend(targets, arg[1])
    }
    return targets;
}


/*
* 图片压缩返回blob对象
* */
export function photoCompress(file, options) {
    EXIF.getData(file, function () {
        EXIF.getAllTags(this);
        Orientation = EXIF.getTag(this, 'Orientation');
    });

    var ready = new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload = function () {
        var re = this.result;
        _canvasDataURL(re, options)
    }
}

function _canvasDataURL(path, options) {
    let { callback,quality=1,mH,mW } = options
    var img = new Image();
    img.src = path;
    img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w/h;
        if(mW && mW<w){
            w = mW;
            h = w/scale
        }
        if(mH && mH<h){
            h = mH;
            w = mH*scale
        }
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        var base64 = null;
        if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
                case 6:
                    _rotateImg(this, 'left', canvas);
                    break;
                case 8:
                    _rotateImg(this, 'right', canvas);
                    break;
                case 3:
                    // TODO 未生效
                    _rotateImg(this, 'right', canvas);
                    _rotateImg(this, 'right', canvas);
                    break;
            }
        }
        base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback({
            src:path,
            file:convertBase64UrlToBlob(base64)
        });
    }
}

/*
* base64转file文件
* */
export function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime, lastModified: Date.now()});
}


function _rotateImg(img, direction, canvas) {
    //alert(img);
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);
    /*var canvas = document.getElementById('pic_' + pid);
    if (canvas == null) {
        img.style.display = 'none';
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'pic_' + pid);
        img.parentNode.appendChild(canvas);
    }  */
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}

/*
* app协议地址
* bak 回调函数 true 已经下载 false 、未下载
* */
export function isHasInstallApp(url,bak) {
  var ifr = document.createElement('iframe');
  ifr.src = url;
  ifr.style.display = 'none';
  let timestart = new Date().getTime()
  setTimeout(function() {
    let timeend = new Date().getTime()
    if(timeend - timestart<4000) bak();
    document.body.removeChild(ifr);
  },3000)
  document.body.appendChild(ifr);
}

/*
* 手机号空格处理
* 返回格式化，有空格的手机号码
* */

export function dealFormatPhone(val){
   if(val&&val.length>13) return val.slice(0, 13)
   if(/^\d{0,3}$/.test(val)) return val;
   if (/^\d{3}\s$/.test(val)) return `${val.slice(0, 3)}`;
   if (/^\d{4}.*$/.test(val)) return `${val.slice(0, 3)} ${val.slice(3)}`;
   if (/^\d{3}\s\d{4}\s$/.test(val)) return `${val.slice(0, 8)}`;
   if (/^\d{3}\s\d{1,3}\s.*$/.test(val)) return `${val.slice(0, 3)} ${val.slice(3).replace(/\s/g,'')}`
   if (/^\d{3}\s\d{5}.*$/.test(val)) return `${val.slice(0, 8)} ${val.slice(8)}`;
   return val
 }













