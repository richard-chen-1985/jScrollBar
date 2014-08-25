/**
 * jScrollBar实现自定义滚动条
 * @author richard chen
 * @update 2014-06-17
 * @version 1.0
 * @参数 opt {}
 *     elem: 要添加滚动条的元素
 *     inner: 要滚动的元素
 *     dir: 滚动方向[ v|h ]，v:垂直滚动，h：水平滚动，默认为v
 *     step: 每次滚动步长(px)，默认为40
 *     barStyle: {} 滚动条的样式
 *     sliderStyle: {} 滚动滑块的样式
 */
var jScrollBar = function (opt) {
    return new jScrollBar.prototype.init(opt);
};

jScrollBar.prototype = {

    constructor: jScrollBar,

    createElem: function (opt) {
        this.scrollBar = document.createElement("div");
        this.sliderBar = document.createElement("span");

        this.scrollBar.className = "scroll-bar";
        this.scrollBar.appendChild(this.sliderBar);
        this.loadStyle(opt);
        this.elem.appendChild(this.scrollBar);

        this.loadEvents();
    },

    loadStyle: function (opt) {
        var
        // 内容可视尺寸和滚动尺寸的比例，用于计算滚动滑块的尺寸
            per,
            // 滚动条的初始样式
            barStyle = {
                background: "#333",
                position: "absolute"
            },
            // 滚动滑块的初始样式
            sliderStyle = {
                background: "#666",
                position: "absolute",
                cursor: "pointer",
                overflow: "hidden"
            };

        if (this.dir == "v") {
            per = this.inner.offsetHeight / this.inner.scrollHeight;

            this.extend(barStyle, {
                width: 1,
                height: this.elem.clientHeight,
                top: 0,
                right: 2,
                display: per < 1 ? "block" : "none"
            });

            this.extend(sliderStyle, {
                width: 5,
                height: per * this.elem.offsetHeight,
                top: 0,
                left: -2
            });

        } else if (this.dir == "h") {
            per = this.inner.offsetWidth / this.inner.scrollWidth;

            this.extend(barStyle, {
                width: this.elem.clientWidth,
                height: 1,
                lineHeight: 1,
                left: 0,
                bottom: 2,
                display: per < 1 ? "block" : "none"
            });

            this.extend(sliderStyle, {
                width: per * this.elem.offsetWidth,
                height: 5,
                left: 0,
                top: -2
            });
        }

        opt.barStyle && this.extend(barStyle, opt.barStyle);
        opt.sliderStyle && this.extend(sliderStyle, opt.sliderStyle);

        this.css(this.scrollBar, barStyle);
        this.css(this.sliderBar, sliderStyle);
    },

    loadEvents: function () {
        var _this = this;

        this.addEvent(this.inner, "scroll", function () {
            _this.setSliderPos();
        });

        this.addEvent(this.sliderBar, "mousedown", function (ev) {
            _this.barMouseDown(ev);
        });

        // 绑定主体鼠标滚动事件
        this.addEvent(this.elem, "mousewheel", function (ev) {
            _this.mouseScroll(ev)
        });
        // for firefox
        this.addEvent(this.elem, "DOMMouseScroll", function (ev) {
            _this.mouseScroll(ev)
        });
    },

    setSliderPos: function () {
        var style, scrollNow, size1, size2;

        if (this.dir == "v") {
            style = "top";
            scrollNow = this.inner.scrollTop;
            size1 = this.inner.scrollHeight - this.inner.offsetHeight;
            size2 = this.scrollBar.offsetHeight - this.sliderBar.offsetHeight;
        } else if (this.dir == "h") {
            style = "left";
            scrollNow = this.inner.scrollLeft;
            size1 = this.inner.scrollWidth - this.inner.offsetWidth;
            size2 = this.scrollBar.offsetWidth - this.sliderBar.offsetWidth;
        }

        this.sliderBar.style[style] = scrollNow / size1 * size2 + "px";
    },

    barMouseDown: function (ev) {
        var ev = ev || window.event,
            _this = this,
            disX = ev.clientX - this.sliderBar.offsetLeft,
            disY = ev.clientY - this.sliderBar.offsetTop;

        this.sliderBar.setCapture && this.sliderBar.setCapture();
        document.onmousemove = function (ev) {
            var ev = ev || window.event,
                scrollDir, dis, size1, size2;

            if (_this.dir == "v") {
                scrollDir = "scrollTop";
                dis = ev.clientY - disY;
                size1 = _this.scrollBar.offsetHeight - _this.sliderBar.offsetHeight;
                size2 = _this.inner.scrollHeight - _this.inner.offsetHeight;
            } else if (_this.dir == "h") {
                scrollDir = "scrollLeft";
                dis = ev.clientX - disX;
                size1 = _this.scrollBar.offsetWidth - _this.sliderBar.offsetWidth;
                size2 = _this.inner.scrollWidth - _this.inner.offsetWidth;
            }

            _this.inner[scrollDir] = dis / size1 * size2;

            _this.preventDefault(ev);
        };

        document.onmouseup = function () {
            _this.sliderBar.releaseCapture && _this.sliderBar.releaseCapture();
            document.onmousemove = null;
            document.onmouseup = null;
        }
    },

    mouseScroll: function (ev) {
        var ev = ev || window.event,
            // 判断滚动方向
            eDir = this.mouseDir(ev),
            // 能滚动的最大距离
            size,
            // offset参数
            offset;

        if (this.dir == "v") {
            size = this.inner.scrollHeight - this.inner.offsetHeight;
            offset = "scrollTop";
        } else if (this.dir == "h") {
            size = this.inner.scrollWidth - this.inner.offsetWidth;
            offset = "scrollLeft";
        }

        this.inner[offset] += (eDir > 0 ? -1 : 1) * this.step;

        // 在没滚动到边界时阻止浏览器的滚动默认行为
        if (this.inner[offset] != 0 && this.inner[offset] < size) {
            this.preventDefault(ev);
        }
    },

    extend: function (obj, target) {
        for (attr in target) {
            obj[attr] = target[attr];
        }
    },

    addEvent: function (obj, eventType, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(eventType, fn, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + eventType, fn);
        } else {
            obj["on" + eventType] = fn;
        }
    },

    removeEvent: function (obj, eventType, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(eventType, fn, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + eventType, fn);
        } else {
            obj["on" + eventType] = null;
        }
    },

    //获取鼠标滚动方向，1代表向下，-1代表向上
    mouseDir: function (ev) {
        var dir;
        if (ev.wheelDelta) {
            dir = ev.wheelDelta / 120;
        } else if (ev.detail) {
            dir = -ev.detail / 3;
        }
        return dir;
    },

    //停止默认事件及冒泡
    preventDefault: function (ev) {
        ev.stopPropagation && (ev.preventDefault(), ev.stopPropagation()) || (ev.cancelBubble = true, ev.returnValue = false);
    },

    css: function (elem, styles) {
        var val;

        for (s in styles) {
            val = styles[s];
            if (s != "opacity" && !isNaN(Number(val))) {
                val += "px";
            }
            elem.style[s] = val;
        }
    }
};

jScrollBar.prototype.init = function (opt) {
    if (!opt) return;

    // 要添加滚动条的元素
    this.elem = opt.elem || null;

    // 要滚动的元素
    this.inner = opt.inner || null;

    // 滚动方向[ v|h ]，v:垂直滚动，h：水平滚动，默认为v
    this.dir = opt.dir || "v";

    // 每次滚动步长
    this.step = 40;

    this.createElem(opt);
};

jScrollBar.prototype.init.prototype = jScrollBar.prototype;