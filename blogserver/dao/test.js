define(function(require, exports, modules) {
    require("ui-core");
    require("ui-mouse");
    require("ui-position");
    require("ui-resizable");
    require("ui-draggable");
    require("ui-dialog");
    require("ui-messagebox");
    require("ui-calendar");
    require("ui-checkbox");
    require("ui-combo");
    require("ui-textpopup");
    require("ui-radio");
    require("ui-search");
    require("ui-flip");
    require("ui-textarea");
    require("ui-textfield");
    require("ui-panel");
    require("ui-menu");
    require("ui-tabs");
    require("ui-breadcrumb");
    require("ui-validate");
    require("ui-form");
    require("ui-progressbar");
    require("ui-tree");
    require("ui-grid");
    require("ui-popup");
    require("ui-tips");
    require("ui-pageflow");
    require("ui-tpl");
    require("ui-slider");
    require("ui-offCanvas");
    require("ui-import");
    require("ui-irguide");
});
define("ui-core", function(require, exports, moudles) {
    $.ae = $.ae || {};
    if ($.ae.version) {
        return;
    }
    $.extend($.ae, {
        version: 2.2,
        keyCode: {
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            BACKSPACE: 8
        },
        lang: {
            get: function() {
                var c = arguments;
                var d = c[0];
                if (!d || !$.isString(d)) {
                    return;
                }
                var e = $.lang[d];
                if (e && $.isString(e)) {
                    if (c.length > 1) {
                        e = e.replace(/\{(\d{1})\}/ig, function(f) {
                            var g = f.match(/\{(\d{1})\}/i);
                            if (g && g.length == 2) {
                                return ( c[g[1]] ? c[g[1]] : "") ;
                            }
                            return f;
                        });
                    }
                    return e;
                }
            },
            set: function(c, d) {
                if (!c || !$.isString(c)) {
                    return;
                }
                if (!d || !$.isString(d)) {
                    return;
                }
                $.lang[c] = d;
            },
            extend: function(c) {
                $.extend($.lang, c);
            }
        }
    });
    $.fn.extend({
        propAttr: $.fn.prop || $.fn.attr,
        _oldFocus: $.fn.focus,
        focus: function(c, d) {
            return typeof c === "number" ? this.each(function() {
                var e = this;
                setTimeout(function() {
                    $(e).focus();
                    if (d) {
                        d.call(e);
                    }
                }, c);
            }) : this._oldFocus.apply(this, arguments);
        },
        scrollParent: function() {
            var c;
            if ((/msie/.test(navigator.userAgent.toLowerCase()) && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                c = this.parents().filter(function() {
                    return (/(relative|absolute|fixed)/).test($.css(this, "position", 1)) && (/(auto|scroll)/).test($.css(this, "overflow", 1) + $.css(this, "overflow-y", 1) + $.css(this, "overflow-x", 1));
                }).eq(0);
            } else {
                c = this.parents().filter(function() {
                    return (/(auto|scroll)/).test($.css(this, "overflow", 1) + $.css(this, "overflow-y", 1) + $.css(this, "overflow-x", 1));
                }).eq(0);
            }
            return (/fixed/).test(this.css("position")) || !c.length ? $(document) : c;
        },
        zIndex: function(f) {
            if (f !== undefined) {
                return this.css("zIndex", f);
            }
            if (this.length) {
                var d = $(this[0]), c, e;
                while (d.length && d[0] !== document) {
                    c = d.css("position");
                    if (c === "absolute" || c === "relative" || c === "fixed") {
                        e = parseInt(d.css("zIndex"), 10);
                        if (!isNaN(e) && e !== 0) {
                            return e;
                        }
                    }
                    d = d.parent();
                }
            }
            return 0;
        },
        disableSelection: function() {
            return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ae-disableSelection", function(c) {
                c.preventDefault();
            });
        },
        enableSelection: function() {
            return this.unbind(".ae-disableSelection");
        }
    });
    function b(e, c) {
        var h = e.nodeName.toLowerCase();
        if ("area" === h) {
            var g = e.parentNode, f = g.name, d;
            if (!e.href || !f || g.nodeName.toLowerCase() !== "map") {
                return false;
            }
            d = $("img[usemap=#" + f + "]")[0];
            return !!d && a(d);
        }
        return (/input|select|textarea|button|object/.test(h) ? !e.disabled : "a" == h ? e.href || c : c) && a(e);
    }
    function a(c) {
        return !$(c).parents().andSelf().filter(function() {
            return $.css(this, "visibility") === "hidden" || $.expr.filters.hidden(this);
        }).length;
    }
    $.extend($.expr[":"], {
        data: function(e, d, c) {
            return !!$.data(e, c[3]);
        },
        focusable: function(c) {
            return b(c, !isNaN($.attr(c, "tabindex")));
        },
        tabbable: function(e) {
            var c = $.attr(e, "tabindex")
              , d = isNaN(c);
            return (d || c >= 0) && b(e, !d);
        }
    });
    $.extend($.ae, {
        plugin: {
            add: function(d, e, g) {
                var f = $.ae[d].prototype;
                for (var c in g) {
                    f.plugins[c] = f.plugins[c] || [];
                    f.plugins[c].push([e, g[c]]);
                }
            },
            call: function(c, e, d) {
                var g = c.plugins[e];
                if (!g || !c.element[0].parentNode) {
                    return;
                }
                for (var f = 0; f < g.length; f++) {
                    if (c.options[g[f][0]]) {
                        g[f][1].apply(c.element, d);
                    }
                }
            }
        }
    });
    $.aeWidget = function(d, f, c) {
        var e = d.split(".")[0], h;
        d = d.split(".")[1];
        h = e + "-" + d;
        if (!c) {
            c = f;
            f = $.AEWidget;
        }
        $.expr[":"][h] = function(i) {
            return !!$.data(i, d);
        }
        ;
        $[e] = $[e] || {};
        $[e][d] = function(i, j) {
            if (arguments.length) {
                this._createWidget(i, j);
            }
        }
        ;
        var g = new f();
        g.options = $.extend(true, {}, g.options);
        $[e][d].prototype = $.extend(true, g, {
            namespace: e,
            widgetName: d,
            widgetEventPrefix: $[e][d].prototype.widgetEventPrefix || d,
            widgetBaseClass: h
        }, c);
        $.aeWidget.bridge(d, $[e][d]);
    }
    ;
    $.aeWidget.bridge = function(d, c) {
        $.fn[d] = function(g) {
            var e = typeof g === "string"
              , f = Array.prototype.slice.call(arguments, 1)
              , h = this;
            g = !e && f.length ? $.extend.apply(null , [true, g].concat(f)) : g;
            if (e && g.charAt(0) === "_") {
                return h;
            }
            if (e) {
                this.each(function() {
                    var i = $.data(this, d);
                    if (!i) {
                        if ($(this).attr("aeType") === d) {
                            $.data(this, d, new c(i,this));
                            i = $.data(this, d);
                        } else {
                            alert("cannot call methods on " + d + " prior to initialization; " + "attempted to call method '" + g + "'");
                        }
                    }
                    if (g == "options") {
                        h = i && i.options;
                        return false;
                    } else {
                        var j = i && $.isFunction(i[g]) ? i[g].apply(i, f) : i;
                        if (j !== i && j !== undefined) {
                            h = j;
                            return false;
                        }
                    }
                });
            } else {
                this.each(function() {
                    var i = $.data(this, d);
                    if (i) {
                        i._setOptions(g || {});
                        $.extend(i.options, g);
                        $(i.beforeInitListeners).each(function() {
                            this.call(i);
                        });
                        i._init();
                        $(i.initListeners).each(function() {
                            this.call(i);
                        });
                    } else {
                        $.data(this, d, new c(g,this));
                    }
                });
            }
            return h;
        }
        ;
    }
    ;
    $.aeWidget.addCreateListener = function(d, e) {
        var c = d.split(".");
        $[c[0]][c[1]].prototype.createListeners.push(e);
    }
    ;
    $.aeWidget.addInitListener = function(d, e) {
        var c = d.split(".");
        $[c[0]][c[1]].prototype.initListeners.push(e);
    }
    ;
    $.aeWidget.addBeforeInitListener = function(d, e) {
        var c = d.split(".");
        $[c[0]][c[1]].prototype.beforeInitListeners.push(e);
    }
    ;
    $.AEWidget = function(c, d) {
        this.createListeners = [];
        this.initListeners = [];
        this.beforeInitListeners = [];
        if (arguments.length) {
            this._createWidget(c, d);
        }
    }
    ;
    $.AEWidget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function(d, e) {
            $.data(e, this.widgetName, this);
            this.element = $(e);
            this.options = $.extend(true, {}, this.options, this._getCreateOptions(), d);
            var c = this;
            this.element.bind("ae-remove._" + this.widgetName, function() {
                c.destroy();
            });
            this._create();
            $(this.createListeners).each(function() {
                this.call(c);
            });
            this._trigger("create");
            $(this.beforeInitListeners).each(function() {
                this.call(c);
            });
            this._init();
            $(this.initListeners).each(function() {
                this.call(c);
            });
        },
        _getCreateOptions: function() {
            return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
        },
        _create: function() {},
        _init: function() {},
        destroy: function() {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName);
        },
        widget: function() {
            return this.element;
        },
        option: function(d, e) {
            var c = d;
            if (arguments.length === 0) {
                return $.extend({}, this.options);
            }
            if (typeof d === "string") {
                if (e === undefined) {
                    return this.options[d];
                }
                c = {};
                c[d] = e;
            }
            this._setOptions(c);
            return this;
        },
        _setOptions: function(d) {
            var c = this;
            $.each(d, function(e, f) {
                c._setOption(e, f);
            });
            return this;
        },
        _setOption: function(c, d) {
            this.options[c] = d;
            return this;
        },
        _trigger: function(e, f) {
            var j = this.options[e];
            f = $.Event(f);
            f.type = e;
            if (f.originalEvent) {
                for (var d = $.event.props.length, h; d; ) {
                    h = $.event.props[--d];
                    f[h] = f.originalEvent[h];
                }
            }
            var c = []
              , g = arguments.length;
            for (var d = 2; d < g; d++) {
                c[d - 2] = arguments[d];
            }
            if (g > 1) {
                c[g - 2] = arguments[1];
            }
            return !($.isFunction(j) && j.apply(this.element, c) === false || f.isDefaultPrevented());
        }
    };
});
define("ui-mouse", function(require, exports, moudles) {
    $.aeWidget("ae.aeMouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function(b) {
                return a._mouseDown(b);
            }).bind("click." + this.widgetName, function(b) {
                if (true === $.data(b.target, a.widgetName + ".preventClickEvent")) {
                    $.removeData(b.target, a.widgetName + ".preventClickEvent");
                    b.stopImmediatePropagation();
                    return false;
                }
            });
            this.started = false;
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName);
        },
        _mouseDown: function(c) {
            c.originalEvent = c.originalEvent || {};
            if (c.originalEvent.mouseHandled) {
                return;
            }
            (this._mouseStarted && this._mouseUp(c));
            this._mouseDownEvent = c;
            var b = this
              , d = (c.which == 1)
              , a = (typeof this.options.cancel == "string" ? $(c.target).closest(this.options.cancel).length : false);
            if (!d || a || !this._mouseCapture(c)) {
                return true;
            }
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function() {
                    b.mouseDelayMet = true;
                }, this.options.delay);
            }
            if (this._mouseDistanceMet(c) && this._mouseDelayMet(c)) {
                this._mouseStarted = (this._mouseStart(c) !== false);
                if (!this._mouseStarted) {
                    c.preventDefault();
                    return true;
                }
            }
            if (true === $.data(c.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(c.target, this.widgetName + ".preventClickEvent");
            }
            this._mouseMoveDelegate = function(e) {
                return b._mouseMove(e);
            }
            ;
            this._mouseUpDelegate = function(e) {
                return b._mouseUp(e);
            }
            ;
            $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            c.preventDefault();
            c.originalEvent.mouseHandled = true;
            return true;
        },
        _mouseMove: function(a) {
            if ($.support.msie && !(document.documentMode >= 9) && !a.button) {
                return this._mouseUp(a);
            }
            if (this._mouseStarted) {
                this._mouseDrag(a);
                return a.preventDefault();
            }
            if (this._mouseDistanceMet(a) && this._mouseDelayMet(a)) {
                this._mouseStarted = (this._mouseStart(this._mouseDownEvent, a) !== false);
                (this._mouseStarted ? this._mouseDrag(a) : this._mouseUp(a));
            }
            return !this._mouseStarted;
        },
        _mouseUp: function(a) {
            $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                if (a.target == this._mouseDownEvent.target) {
                    $.data(a.target, this.widgetName + ".preventClickEvent", true);
                }
                this._mouseStop(a);
            }
            return false;
        },
        _mouseDistanceMet: function(a) {
            return ( Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance) ;
        },
        _mouseDelayMet: function(a) {
            return this.mouseDelayMet;
        },
        _mouseStart: function(a) {},
        _mouseDrag: function(a) {},
        _mouseStop: function(a) {},
        _mouseCapture: function(a) {
            return true;
        }
    });
});
define("ui-resizable", function(require, exports, moudles) {
    $.aeWidget("ae.aeResizable", $.ae.aeMouse, {
        widgetEventPrefix: "resize",
        options: {
            alsoResize: false,
            aspectRatio: false,
            autoHide: false,
            containment: false,
            handles: "e,s,se",
            helper: false,
            maxHeight: null ,
            maxWidth: null ,
            minHeight: 10,
            minWidth: 10,
            zIndex: 1000
        },
        _create: function() {
            var d = this
              , h = this.options;
            this.element.addClass("om-resizable");
            $.extend(this, {
                _aspectRatio: !!(h.aspectRatio),
                aspectRatio: h.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: h.helper || h.ghost || h.animate ? h.helper || "om-resizable-helper" : null 
            });
            if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
                if (/relative/.test(this.element.css("position")) && $.support.opera) {
                    this.element.css({
                        position: "relative",
                        top: "auto",
                        left: "auto"
                    });
                }
                this.element.wrap($('<div class="om-wrapper" style="overflow: hidden;"></div>').css({
                    position: this.element.css("position"),
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight(),
                    top: this.element.css("top"),
                    left: this.element.css("left")
                }));
                this.element = this.element.parent().data("resizable", this.element.data("resizable"));
                this.elementIsWrapper = true;
                this.element.css({
                    marginLeft: this.originalElement.css("marginLeft"),
                    marginTop: this.originalElement.css("marginTop"),
                    marginRight: this.originalElement.css("marginRight"),
                    marginBottom: this.originalElement.css("marginBottom")
                });
                this.originalElement.css({
                    marginLeft: 0,
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0
                });
                this.originalResizeStyle = this.originalElement.css("resize");
                this.originalElement.css("resize", "none");
                this._proportionallyResizeElements.push(this.originalElement.css({
                    position: "static",
                    zoom: 1,
                    display: "block"
                }));
                this.originalElement.css({
                    margin: this.originalElement.css("margin")
                });
                this._proportionallyResize();
            }
            this.handles = h.handles || (!$(".om-resizable-handle", this.element).length ? "e,s,se" : {
                n: ".om-resizable-n",
                e: ".om-resizable-e",
                s: ".om-resizable-s",
                w: ".om-resizable-w",
                se: ".om-resizable-se",
                sw: ".om-resizable-sw",
                ne: ".om-resizable-ne",
                nw: ".om-resizable-nw"
            });
            if (this.handles.constructor == String) {
                if (this.handles == "all") {
                    this.handles = "n,e,s,w,se,sw,ne,nw";
                }
                var j = this.handles.split(",");
                this.handles = {};
                for (var e = 0; e < j.length; e++) {
                    var g = $.trim(j[e])
                      , c = "om-resizable-" + g;
                    var f = $('<div class="om-resizable-handle ' + c + '"></div>');
                    if (/sw|se|ne|nw/.test(g)) {
                        f.css({
                            zIndex: ++h.zIndex
                        });
                    }
                    if ("se" == g) {
                        f.addClass("om-icon om-icon-gripsmall-diagonal-se");
                    }
                    this.handles[g] = ".om-resizable-" + g;
                    this.element.append(f);
                }
            }
            this._renderAxis = function(o) {
                o = o || this.element;
                for (var l in this.handles) {
                    if (this.handles[l].constructor == String) {
                        this.handles[l] = $(this.handles[l], this.element).show();
                    }
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                        var m = $(this.handles[l], this.element)
                          , n = 0;
                        n = /sw|ne|nw|se|n|s/.test(l) ? m.outerHeight() : m.outerWidth();
                        var k = ["padding", /ne|nw|n/.test(l) ? "Top" : /se|sw|s/.test(l) ? "Bottom" : /^e$/.test(l) ? "Right" : "Left"].join("");
                        o.css(k, n);
                        this._proportionallyResize();
                    }
                    if (!$(this.handles[l]).length) {
                        continue;
                    }
                }
            }
            ;
            this._renderAxis(this.element);
            this._handles = $(".om-resizable-handle", this.element).disableSelection();
            this._handles.mouseover(function() {
                if (!d.resizing) {
                    if (this.className) {
                        var i = this.className.match(/om-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                    }
                    d.axis = i && i[1] ? i[1] : "se";
                }
            });
            if (h.autoHide) {
                this._handles.hide();
                $(this.element).addClass("om-resizable-autohide").hover(function() {
                    if (h.disabled) {
                        return;
                    }
                    $(this).removeClass("om-resizable-autohide");
                    d._handles.show();
                }, function() {
                    if (h.disabled) {
                        return;
                    }
                    if (!d.resizing) {
                        $(this).addClass("om-resizable-autohide");
                        d._handles.hide();
                    }
                });
            }
            this._mouseInit();
        },
        destroy: function() {
            this._mouseDestroy();
            var c = function(e) {
                $(e).removeClass("om-resizable om-resizable-disabled om-resizable-resizing").removeData("resizable").unbind(".resizable").find(".om-resizable-handle").remove();
            }
            ;
            if (this.elementIsWrapper) {
                c(this.element);
                var d = this.element;
                d.after(this.originalElement.css({
                    position: d.css("position"),
                    width: d.outerWidth(),
                    height: d.outerHeight(),
                    top: d.css("top"),
                    left: d.css("left")
                })).remove();
            }
            this.originalElement.css("resize", this.originalResizeStyle);
            c(this.originalElement);
            return this;
        },
        _mouseCapture: function(d) {
            var e = false;
            for (var c in this.handles) {
                if ($(this.handles[c])[0] == d.target) {
                    e = true;
                }
            }
            return !this.options.disabled && e;
        },
        _mouseStart: function(e) {
            var h = this.options
              , d = this.element.position()
              , c = this.element;
            this.resizing = true;
            this.documentScroll = {
                top: $(document).scrollTop(),
                left: $(document).scrollLeft()
            };
            if (c.is(".ui-draggable") || (/absolute/).test(c.css("position"))) {
                c.css({
                    position: "absolute",
                    top: d.top,
                    left: d.left
                });
            }
            if ($.support.opera && (/relative/).test(c.css("position"))) {
                c.css({
                    position: "relative",
                    top: "auto",
                    left: "auto"
                });
            }
            this._renderProxy();
            var i = b(this.helper.css("left"))
              , f = b(this.helper.css("top"));
            if (h.containment) {
                i += $(h.containment).scrollLeft() || 0;
                f += $(h.containment).scrollTop() || 0;
            }
            this.offset = this.helper.offset();
            this.position = {
                left: i,
                top: f
            };
            this.size = this._helper ? {
                width: c.outerWidth(),
                height: c.outerHeight()
            } : {
                width: c.width(),
                height: c.height()
            };
            this.originalSize = this._helper ? {
                width: c.outerWidth(),
                height: c.outerHeight()
            } : {
                width: c.width(),
                height: c.height()
            };
            this.originalPosition = {
                left: i,
                top: f
            };
            this.sizeDiff = {
                width: c.outerWidth() - c.width(),
                height: c.outerHeight() - c.height()
            };
            this.originalMousePosition = {
                left: e.pageX,
                top: e.pageY
            };
            this.aspectRatio = (typeof h.aspectRatio == "number") ? h.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);
            var g = $(".om-resizable-" + this.axis).css("cursor");
            $("body").css("cursor", g == "auto" ? this.axis + "-resize" : g);
            c.addClass("om-resizable-resizing");
            this._propagate("start", e);
            return true;
        },
        _mouseDrag: function(c) {
            var f = this.helper
              , e = this.options
              , k = {}
              , n = this
              , h = this.originalMousePosition
              , l = this.axis;
            var p = (c.pageX - h.left) || 0
              , m = (c.pageY - h.top) || 0;
            var g = this._change[l];
            if (!g) {
                return false;
            }
            var j = g.apply(this, [c, p, m])
              , i = $.support.msie && $.support.version < 7
              , d = this.sizeDiff;
            this._updateVirtualBoundaries(c.shiftKey);
            if (this._aspectRatio || c.shiftKey) {
                j = this._updateRatio(j, c);
            }
            j = this._respectSize(j, c);
            this._propagate("resize", c);
            f.css({
                top: this.position.top + "px",
                left: this.position.left + "px",
                width: this.size.width + "px",
                height: this.size.height + "px"
            });
            if (!this._helper && this._proportionallyResizeElements.length) {
                this._proportionallyResize();
            }
            this._updateCache(j);
            this._trigger("resize", c, this.ui());
            return false;
        },
        _mouseStop: function(f) {
            this.resizing = false;
            var g = this.options
              , k = this;
            if (this._helper) {
                var e = this._proportionallyResizeElements
                  , c = e.length && (/textarea/i).test(e[0].nodeName)
                  , d = c && k._hasScroll(e[0], "left") ? 0 : k.sizeDiff.height
                  , i = c ? 0 : k.sizeDiff.width;
                var l = {
                    width: (k.helper.width() - i),
                    height: (k.helper.height() - d)
                }
                  , h = (parseInt(k.element.css("left"), 10) + (k.position.left - k.originalPosition.left)) || null 
                  , j = (parseInt(k.element.css("top"), 10) + (k.position.top - k.originalPosition.top)) || null ;
                if (!g.animate) {
                    this.element.css($.extend(l, {
                        top: j,
                        left: h
                    }));
                }
                k.helper.height(k.size.height);
                k.helper.width(k.size.width);
                if (this._helper && !g.animate) {
                    this._proportionallyResize();
                }
            }
            $("body").css("cursor", "auto");
            this.element.removeClass("om-resizable-resizing");
            this._propagate("stop", f);
            if (this._helper) {
                this.helper.remove();
            }
            return false;
        },
        _updateVirtualBoundaries: function(e) {
            var h = this.options, g, f, d, i, c;
            c = {
                minWidth: a(h.minWidth) ? h.minWidth : 0,
                maxWidth: a(h.maxWidth) ? h.maxWidth : Infinity,
                minHeight: a(h.minHeight) ? h.minHeight : 0,
                maxHeight: a(h.maxHeight) ? h.maxHeight : Infinity
            };
            if (this._aspectRatio || e) {
                g = c.minHeight * this.aspectRatio;
                d = c.minWidth / this.aspectRatio;
                f = c.maxHeight * this.aspectRatio;
                i = c.maxWidth / this.aspectRatio;
                if (g > c.minWidth) {
                    c.minWidth = g;
                }
                if (d > c.minHeight) {
                    c.minHeight = d;
                }
                if (f < c.maxWidth) {
                    c.maxWidth = f;
                }
                if (i < c.maxHeight) {
                    c.maxHeight = i;
                }
            }
            this._vBoundaries = c;
        },
        _updateCache: function(c) {
            var d = this.options;
            this.offset = this.helper.offset();
            if (a(c.left)) {
                this.position.left = c.left;
            }
            if (a(c.top)) {
                this.position.top = c.top;
            }
            if (a(c.height)) {
                this.size.height = c.height;
            }
            if (a(c.width)) {
                this.size.width = c.width;
            }
        },
        _updateRatio: function(f, e) {
            var g = this.options
              , h = this.position
              , d = this.size
              , c = this.axis;
            if (a(f.height)) {
                f.width = (f.height * this.aspectRatio);
            } else {
                if (a(f.width)) {
                    f.height = (f.width / this.aspectRatio);
                }
            }
            if (c == "sw") {
                f.left = h.left + (d.width - f.width);
                f.top = null ;
            }
            if (c == "nw") {
                f.top = h.top + (d.height - f.height);
                f.left = h.left + (d.width - f.width);
            }
            return f;
        },
        _respectSize: function(j, e) {
            var h = this.helper
              , g = this._vBoundaries
              , p = this._aspectRatio || e.shiftKey
              , n = this.axis
              , r = a(j.width) && g.maxWidth && (g.maxWidth < j.width)
              , k = a(j.height) && g.maxHeight && (g.maxHeight < j.height)
              , f = a(j.width) && g.minWidth && (g.minWidth > j.width)
              , q = a(j.height) && g.minHeight && (g.minHeight > j.height);
            if (f) {
                j.width = g.minWidth;
            }
            if (q) {
                j.height = g.minHeight;
            }
            if (r) {
                j.width = g.maxWidth;
            }
            if (k) {
                j.height = g.maxHeight;
            }
            var d = this.originalPosition.left + this.originalSize.width
              , m = this.position.top + this.size.height;
            var i = /sw|nw|w/.test(n)
              , c = /nw|ne|n/.test(n);
            if (f && i) {
                j.left = d - g.minWidth;
            }
            if (r && i) {
                j.left = d - g.maxWidth;
            }
            if (q && c) {
                j.top = m - g.minHeight;
            }
            if (k && c) {
                j.top = m - g.maxHeight;
            }
            var l = !j.width && !j.height;
            if (l && !j.left && j.top) {
                j.top = null ;
            } else {
                if (l && !j.top && j.left) {
                    j.left = null ;
                }
            }
            return j;
        },
        _proportionallyResize: function() {
            var h = this.options;
            if (!this._proportionallyResizeElements.length) {
                return;
            }
            var e = this.helper || this.element;
            for (var d = 0; d < this._proportionallyResizeElements.length; d++) {
                var f = this._proportionallyResizeElements[d];
                if (!this.borderDif) {
                    var c = [f.css("borderTopWidth"), f.css("borderRightWidth"), f.css("borderBottomWidth"), f.css("borderLeftWidth")]
                      , g = [f.css("paddingTop"), f.css("paddingRight"), f.css("paddingBottom"), f.css("paddingLeft")];
                    this.borderDif = $.map(c, function(j, l) {
                        var k = parseInt(j, 10) || 0
                          , m = parseInt(g[l], 10) || 0;
                        return k + m;
                    });
                }
                if ($.support.msie && !(!($(e).is(":hidden") || $(e).parents(":hidden").length))) {
                    continue;
                }
                f.css({
                    height: (e.height() - this.borderDif[0] - this.borderDif[2]) || 0,
                    width: (e.width() - this.borderDif[1] - this.borderDif[3]) || 0
                });
            }
        },
        _renderProxy: function() {
            var d = this.element
              , g = this.options;
            this.elementOffset = d.offset();
            if (this._helper) {
                this.helper = this.helper || $('<div style="overflow:hidden;"></div>');
                var c = $.support.msie && $.support.version < 7
                  , e = (c ? 1 : 0)
                  , f = (c ? 2 : -1);
                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() + f,
                    height: this.element.outerHeight() + f,
                    position: "absolute",
                    left: this.elementOffset.left - e + "px",
                    top: this.elementOffset.top - e + "px",
                    zIndex: ++g.zIndex
                });
                this.helper.appendTo("body").disableSelection();
            } else {
                this.helper = this.element;
            }
        },
        _change: {
            e: function(e, d, c) {
                return {
                    width: this.originalSize.width + d
                };
            },
            w: function(f, d, c) {
                var h = this.options
                  , e = this.originalSize
                  , g = this.originalPosition;
                return {
                    left: g.left + d,
                    width: e.width - d
                };
            },
            n: function(f, d, c) {
                var h = this.options
                  , e = this.originalSize
                  , g = this.originalPosition;
                return {
                    top: g.top + c,
                    height: e.height - c
                };
            },
            s: function(e, d, c) {
                return {
                    height: this.originalSize.height + c
                };
            },
            se: function(e, d, c) {
                return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, d, c]));
            },
            sw: function(e, d, c) {
                return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, d, c]));
            },
            ne: function(e, d, c) {
                return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, d, c]));
            },
            nw: function(e, d, c) {
                return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, d, c]));
            }
        },
        _propagate: function(d, c) {
            $.ae.plugin.call(this, d, [c, this.ui()]);
            (d != "resize" && this._trigger(d, c, this.ui()));
        },
        _hasScroll: function(f, d) {
            if ($(f).css("overflow") === "hidden") {
                return false;
            }
            var c = (d && d === "left") ? "scrollLeft" : "scrollTop"
              , e = false;
            if (f[c] > 0) {
                return true;
            }
            f[c] = 1;
            e = (f[c] > 0);
            f[c] = 0;
            return e;
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            };
        }
    });
    $.extend($.ae.resizable, {
        version: "1.1"
    });
    $.ae.plugin.add("aeResizable", "alsoResize", {
        start: function(d, e) {
            var c = $(this).data("aeResizable")
              , g = c.options;
            var f = function(h) {
                $(h).each(function() {
                    var i = $(this);
                    i.data("resizable-alsoresize", {
                        width: parseInt(i.width(), 10),
                        height: parseInt(i.height(), 10),
                        left: parseInt(i.css("left"), 10),
                        top: parseInt(i.css("top"), 10),
                        position: i.css("position")
                    });
                });
            }
            ;
            if (typeof (g.alsoResize) == "object" && !g.alsoResize.parentNode) {
                if (g.alsoResize.length) {
                    g.alsoResize = g.alsoResize[0];
                    f(g.alsoResize);
                } else {
                    $.each(g.alsoResize, function(h) {
                        f(h);
                    });
                }
            } else {
                f(g.alsoResize);
            }
        },
        resize: function(e, g) {
            var d = $(this).data("aeResizable")
              , h = d.options
              , f = d.originalSize
              , j = d.originalPosition;
            var i = {
                height: (d.size.height - f.height) || 0,
                width: (d.size.width - f.width) || 0,
                top: (d.position.top - j.top) || 0,
                left: (d.position.left - j.left) || 0
            }
              , c = function(k, l) {
                $(k).each(function() {
                    var o = $(this)
                      , p = $(this).data("resizable-alsoresize")
                      , n = {}
                      , m = l && l.length ? l : o.parents(g.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                    $.each(m, function(q, s) {
                        var r = (p[s] || 0) + (i[s] || 0);
                        if (r && r >= 0) {
                            n[s] = r || null ;
                        }
                    });
                    if ($.support.opera && /relative/.test(o.css("position"))) {
                        d._revertToRelativePosition = true;
                        o.css({
                            position: "absolute",
                            top: "auto",
                            left: "auto"
                        });
                    }
                    o.css(n);
                });
            }
            ;
            if (typeof (h.alsoResize) == "object" && !h.alsoResize.nodeType) {
                $.each(h.alsoResize, function(k, l) {
                    c(k, l);
                });
            } else {
                c(h.alsoResize);
            }
        },
        stop: function(e, f) {
            var d = $(this).data("aeResizable")
              , g = d.options;
            var c = function(h) {
                $(h).each(function() {
                    var i = $(this);
                    i.css({
                        position: i.data("resizable-alsoresize").position
                    });
                });
            }
            ;
            if (d._revertToRelativePosition) {
                d._revertToRelativePosition = false;
                if (typeof (g.alsoResize) == "object" && !g.alsoResize.nodeType) {
                    $.each(g.alsoResize, function(h) {
                        c(h);
                    });
                } else {
                    c(g.alsoResize);
                }
            }
            $(this).removeData("resizable-alsoresize");
        }
    });
    $.ae.plugin.add("aeResizable", "containment", {
        start: function(d, n) {
            var r = $(this).data("aeResizable")
              , h = r.options
              , j = r.element;
            var e = h.containment
              , i = (e instanceof $) ? e.get(0) : (/parent/.test(e)) ? j.parent().get(0) : e;
            if (!i) {
                return;
            }
            r.containerElement = $(i);
            if (/document/.test(e) || e == document) {
                r.containerOffset = {
                    left: 0,
                    top: 0
                };
                r.containerPosition = {
                    left: 0,
                    top: 0
                };
                r.parentData = {
                    element: $(document),
                    left: 0,
                    top: 0,
                    width: $(document).width(),
                    height: $(document).height() || document.body.parentNode.scrollHeight
                };
            } else {
                var l = $(i)
                  , g = [];
                $(["Top", "Right", "Left", "Bottom"]).each(function(p, o) {
                    g[p] = b(l.css("padding" + o));
                });
                r.containerOffset = l.offset();
                r.containerPosition = l.position();
                r.containerSize = {
                    height: (l.innerHeight() - g[3]),
                    width: (l.innerWidth() - g[1])
                };
                var m = r.containerOffset
                  , c = r.containerSize.height
                  , k = r.containerSize.width
                  , f = (r._hasScroll(i, "left") ? i.scrollWidth : k)
                  , q = (r._hasScroll(i) ? i.scrollHeight : c);
                r.parentData = {
                    element: i,
                    left: m.left,
                    top: m.top,
                    width: f,
                    height: q
                };
            }
        },
        resize: function(e, n) {
            var r = $(this).data("aeResizable")
              , g = r.options
              , d = r.containerSize
              , m = r.containerOffset
              , k = r.size
              , l = r.position
              , p = r._aspectRatio || e.shiftKey
              , c = {
                top: 0,
                left: 0
            }
              , f = r.containerElement;
            if (f[0] != document && (/static/).test(f.css("position"))) {
                c = m;
            }
            if (l.left < (r._helper ? m.left : 0)) {
                r.size.width = r.size.width + (r._helper ? (r.position.left - m.left) : (r.position.left - c.left));
                if (p) {
                    r.size.height = r.size.width / g.aspectRatio;
                }
                r.position.left = g.helper ? m.left : 0;
            }
            if (l.top < (r._helper ? m.top : 0)) {
                r.size.height = r.size.height + (r._helper ? (r.position.top - m.top) : r.position.top);
                if (p) {
                    r.size.width = r.size.height * g.aspectRatio;
                }
                r.position.top = r._helper ? m.top : 0;
            }
            r.offset.left = r.parentData.left + r.position.left;
            r.offset.top = r.parentData.top + r.position.top;
            var j = Math.abs((r._helper ? r.offset.left - c.left : (r.offset.left - c.left)) + r.sizeDiff.width)
              , q = Math.abs((r._helper ? r.offset.top - c.top : (r.offset.top - m.top)) + r.sizeDiff.height);
            var i = r.containerElement.get(0) == r.element.parent().get(0)
              , h = /relative|absolute/.test(r.containerElement.css("position"));
            if (i && h) {
                j -= r.parentData.left;
            }
            if (j + r.size.width >= r.parentData.width) {
                r.size.width = r.parentData.width - j;
                if (p) {
                    r.size.height = r.size.width / r.aspectRatio;
                }
            }
            if (q + r.size.height >= r.parentData.height) {
                r.size.height = r.parentData.height - q;
                if (p) {
                    r.size.width = r.size.height * r.aspectRatio;
                }
            }
        },
        stop: function(d, l) {
            var n = $(this).data("aeResizable")
              , e = n.options
              , j = n.position
              , k = n.containerOffset
              , c = n.containerPosition
              , f = n.containerElement;
            var g = $(n.helper)
              , p = g.offset()
              , m = g.outerWidth() - n.sizeDiff.width
              , i = g.outerHeight() - n.sizeDiff.height;
            if (n._helper && !e.animate && (/relative/).test(f.css("position"))) {
                $(this).css({
                    left: p.left - c.left - k.left,
                    width: m,
                    height: i
                });
            }
            if (n._helper && !e.animate && (/static/).test(f.css("position"))) {
                $(this).css({
                    left: p.left - c.left - k.left,
                    width: m,
                    height: i
                });
            }
        }
    });
    var b = function(c) {
        return parseInt(c, 10) || 0;
    }
    ;
    var a = function(c) {
        return !isNaN(parseInt(c, 10));
    }
    ;
});
define("ui-position", function(require, exports, moudles) {
    $.ae = $.ae || {};
    var d = /left|center|right/
      , e = /top|center|bottom/
      , a = "center"
      , b = $.fn.position
      , c = $.fn.offset;
    $.fn.position = function(g) {
        if (!g || !g.of) {
            return b.apply(this, arguments);
        }
        g = $.extend({}, g);
        var k = $(g.of), j = k[0], m = (g.collision || "flip").split(" "), l = g.offset ? g.offset.split(" ") : [0, 0], i, f, h;
        if (j.nodeType === 9) {
            i = k.width();
            f = k.height();
            h = {
                top: 0,
                left: 0
            };
        } else {
            if (j.setTimeout) {
                i = k.width();
                f = k.height();
                h = {
                    top: k.scrollTop(),
                    left: k.scrollLeft()
                };
            } else {
                if (j.preventDefault) {
                    g.at = "left top";
                    i = f = 0;
                    h = {
                        top: g.of.pageY,
                        left: g.of.pageX
                    };
                } else {
                    i = k.outerWidth();
                    f = k.outerHeight();
                    h = k.offset();
                }
            }
        }
        $.each(["my", "at"], function() {
            var n = (g[this] || "").split(" ");
            if (n.length === 1) {
                n = d.test(n[0]) ? n.concat([a]) : e.test(n[0]) ? [a].concat(n) : [a, a];
            }
            n[0] = d.test(n[0]) ? n[0] : a;
            n[1] = e.test(n[1]) ? n[1] : a;
            g[this] = n;
        });
        if (m.length === 1) {
            m[1] = m[0];
        }
        l[0] = parseInt(l[0], 10) || 0;
        if (l.length === 1) {
            l[1] = l[0];
        }
        l[1] = parseInt(l[1], 10) || 0;
        if (g.at[0] === "right") {
            h.left += i;
        } else {
            if (g.at[0] === a) {
                h.left += i / 2;
            }
        }
        if (g.at[1] === "bottom") {
            h.top += f;
        } else {
            if (g.at[1] === a) {
                h.top += f / 2;
            }
        }
        h.left += l[0];
        h.top += l[1];
        return this.each(function() {
            var q = $(this), s = q.outerWidth(), p = q.outerHeight(), r = parseInt($.css(this, "marginLeft", true)) || 0, o = parseInt($.css(this, "marginTop", true)) || 0, u = s + r + (parseInt($.css(this, "marginRight", true)) || 0), v = p + o + (parseInt($.css(this, "marginBottom", true)) || 0), t = $.extend({}, h), n;
            if (g.my[0] === "right") {
                t.left -= s;
            } else {
                if (g.my[0] === a) {
                    t.left -= s / 2;
                }
            }
            if (g.my[1] === "bottom") {
                t.top -= p;
            } else {
                if (g.my[1] === a) {
                    t.top -= p / 2;
                }
            }
            t.left = Math.round(t.left);
            t.top = Math.round(t.top);
            n = {
                left: t.left - r,
                top: t.top - o
            };
            $.each(["left", "top"], function(x, w) {
                if ($.ae.aePosition[m[x]]) {
                    $.ae.aePosition[m[x]][w](t, {
                        targetWidth: i,
                        targetHeight: f,
                        elemWidth: s,
                        elemHeight: p,
                        collisionPosition: n,
                        collisionWidth: u,
                        collisionHeight: v,
                        offset: l,
                        my: g.my,
                        at: g.at
                    });
                }
            });
            if ($.fn.bgiframe) {
                q.bgiframe();
            }
            q.offset($.extend(t, {
                using: g.using
            }));
        });
    }
    ;
    $.ae.aePosition = {
        fit: {
            left: function(f, g) {
                var i = $(window)
                  , h = g.collisionPosition.left + g.collisionWidth - i.width() - i.scrollLeft();
                f.left = h > 0 ? f.left - h : Math.max(f.left - g.collisionPosition.left, f.left);
            },
            top: function(f, g) {
                var i = $(window)
                  , h = g.collisionPosition.top + g.collisionHeight - i.height() - i.scrollTop();
                f.top = h > 0 ? f.top - h : Math.max(f.top - g.collisionPosition.top, f.top);
            }
        },
        flip: {
            left: function(g, i) {
                if (i.at[0] === a) {
                    return;
                }
                var k = $(window)
                  , j = i.collisionPosition.left + i.collisionWidth - k.width() - k.scrollLeft()
                  , f = i.my[0] === "left" ? -i.elemWidth : i.my[0] === "right" ? i.elemWidth : 0
                  , h = i.at[0] === "left" ? i.targetWidth : -i.targetWidth
                  , l = -2 * i.offset[0];
                g.left += i.collisionPosition.left < 0 ? f + h + l : j > 0 ? f + h + l : 0;
            },
            top: function(g, i) {
                if (i.at[1] === a) {
                    return;
                }
                var k = $(window)
                  , j = i.collisionPosition.top + i.collisionHeight - k.height() - k.scrollTop()
                  , f = i.my[1] === "top" ? -i.elemHeight : i.my[1] === "bottom" ? i.elemHeight : 0
                  , h = i.at[1] === "top" ? i.targetHeight : -i.targetHeight
                  , l = -2 * i.offset[1];
                g.top += i.collisionPosition.top < 0 ? f + h + l : j > 0 ? f + h + l : 0;
            }
        }
    };
    if (!$.offset.setOffset) {
        $.offset.setOffset = function(j, g) {
            if (/static/.test($.css(j, "position"))) {
                j.style.position = "relative";
            }
            var i = $(j)
              , l = i.offset()
              , f = parseInt($.css(j, "top", true), 10) || 0
              , k = parseInt($.css(j, "left", true), 10) || 0
              , h = {
                top: (g.top - l.top) + f,
                left: (g.left - l.left) + k
            };
            if ("using" in g) {
                g.using.call(j, h);
            } else {
                i.css(h);
            }
        }
        ;
        $.fn.offset = function(f) {
            var g = this[0];
            if (!g || !g.ownerDocument) {
                return null ;
            }
            if (f) {
                return this.each(function() {
                    $.offset.setOffset(this, f);
                });
            }
            return c.call(this);
        }
        ;
    }
});
define("ui-draggable", function(require, exports, moudles) {
    $.aeWidget("ae.aeDraggable", $.ae.aeMouse, {
        widgetEventPrefix: "drag",
        options: {
            axis: false,
            containment: false,
            cursor: "auto",
            _scope: "default",
            handle: false,
            helper: "original",
            revert: false,
            scroll: true
        },
        _create: function() {
            if (this.options.helper == "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
                this.element[0].style.position = "relative";
            }
            this.element.addClass("om-draggable");
            (this.options.disabled && this.element.addClass("om-draggable-disabled"));
            this._mouseInit();
        },
        destroy: function() {
            if (!this.element.data("aeDraggable")) {
                return;
            }
            this.element.removeData("aeDraggable").unbind(".draggable").removeClass("om-draggable" + " om-draggable-dragging" + " om-draggable-disabled");
            this._mouseDestroy();
            return this;
        },
        _mouseCapture: function(a) {
            var b = this.options;
            if (this.helper || b.disabled || $(a.target).is(".om-resizable-handle")) {
                return false;
            }
            this.handle = this._getHandle(a);
            if (!this.handle) {
                return false;
            }
            return true;
        },
        _mouseStart: function(a) {
            var b = this.options;
            this.helper = this._createHelper(a);
            this._cacheHelperProportions();
            if ($.ae.ddmanager) {
                $.ae.ddmanager.current = this;
            }
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            $.extend(this.offset, {
                click: {
                    left: a.pageX - this.offset.left,
                    top: a.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this.position = this._generatePosition(a);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            if (b.containment) {
                this._setContainment();
            }
            if (this._trigger("onStart", a) === false) {
                this._clear();
                return false;
            }
            this._cacheHelperProportions();
            if ($.ae.ddmanager && !b.dropBehaviour) {
                $.ae.ddmanager.prepareOffsets(this, a);
            }
            this.helper.addClass("om-draggable-dragging");
            this._mouseDrag(a, true);
            if ($.ae.ddmanager) {
                $.ae.ddmanager.dragStart(this, a);
            }
            return true;
        },
        _mouseDrag: function(a, c) {
            this.position = this._generatePosition(a);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!c) {
                var b = this._uiHash();
                if (this._trigger("onDrag", a, b) === false) {
                    this._mouseUp({});
                    return false;
                }
                this.position = b.position;
            }
            if (!this.options.axis || this.options.axis != "y") {
                this.helper[0].style.left = this.position.left + "px";
            }
            if (!this.options.axis || this.options.axis != "x") {
                this.helper[0].style.top = this.position.top + "px";
            }
            if ($.ae.ddmanager) {
                $.ae.ddmanager.drag(this, a);
            }
            return false;
        },
        _mouseStop: function(b) {
            var c = false;
            if ($.ae.ddmanager && !this.options.dropBehaviour) {
                c = $.ae.ddmanager.drop(this, b);
            }
            if (this.dropped) {
                c = this.dropped;
                this.dropped = false;
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") {
                return false;
            }
            if ((this.options.revert == "invalid" && !c) || (this.options.revert == "valid" && c) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, c))) {
                var a = this;
                $(this.helper).animate(this.originalPosition, 500, function() {
                    if (a._trigger("onStop", b) !== false) {
                        a._clear();
                    }
                });
            } else {
                if (this._trigger("onStop", b) !== false) {
                    this._clear();
                }
            }
            return false;
        },
        _mouseUp: function(a) {
            if ($.ae.ddmanager) {
                $.ae.ddmanager.dragStop(this, a);
            }
            return $.ae.aeMouse.prototype._mouseUp.call(this, a);
        },
        cancel: function() {
            if (this.helper.is(".om-draggable-dragging")) {
                this._mouseUp({});
            } else {
                this._clear();
            }
            return this;
        },
        _getHandle: function(a) {
            var b = true;
            return b;
        },
        _createHelper: function(b) {
            var c = this.options;
            var a = $.isFunction(c.helper) ? $(c.helper.apply(this.element[0], [b])) : (c.helper == "clone" ? this.element.clone().removeAttr("id") : this.element);
            if (!a.parents("body").length) {
                a.appendTo(this.element[0].parentNode);
            }
            if (a[0] != this.element[0] && !(/(fixed|absolute)/).test(a.css("position"))) {
                a.css("position", "absolute");
            }
            return a;
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var a = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                a.left += this.scrollParent.scrollLeft();
                a.top += this.scrollParent.scrollTop();
            }
            if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && /msie/.test(navigator.userAgent.toLowerCase()))) {
                a = {
                    top: 0,
                    left: 0
                };
            }
            return {
                top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var a = this.element.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return {
                    top: 0,
                    left: 0
                };
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"), 10) || 0),
                top: (parseInt(this.element.css("marginTop"), 10) || 0),
                right: (parseInt(this.element.css("marginRight"), 10) || 0),
                bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
            };
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function() {
            var e = this.options;
            if (e.containment == "parent") {
                e.containment = this.helper[0].parentNode;
            }
            if (e.containment == "document" || e.containment == "window") {
                this.containment = [e.containment == "document" ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, e.containment == "document" ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (e.containment == "document" ? 0 : $(window).scrollLeft()) + $(e.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (e.containment == "document" ? 0 : $(window).scrollTop()) + ($(e.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            }
            if (!(/^(document|window|parent)$/).test(e.containment) && e.containment.constructor != Array) {
                var f = $(e.containment);
                var b = f[0];
                if (!b) {
                    return;
                }
                var d = f.offset();
                var a = ($(b).css("overflow") != "hidden");
                this.containment = [(parseInt($(b).css("borderLeftWidth"), 10) || 0) + (parseInt($(b).css("paddingLeft"), 10) || 0), (parseInt($(b).css("borderTopWidth"), 10) || 0) + (parseInt($(b).css("paddingTop"), 10) || 0), (a ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt($(b).css("borderLeftWidth"), 10) || 0) - (parseInt($(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (a ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt($(b).css("borderTopWidth"), 10) || 0) - (parseInt($(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
                this.relative_container = f;
            } else {
                if (e.containment.constructor == Array) {
                    this.containment = e.containment;
                }
            }
        },
        _convertPositionTo: function(e, g) {
            if (!g) {
                g = this.position;
            }
            var b = e == "absolute" ? 1 : -1;
            var c = this.options
              , a = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent
              , f = (/(html|body)/i).test(a[0].tagName);
            return {
                top: (g.top + this.offset.relative.top * b + this.offset.parent.top * b - ((this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (f ? 0 : a.scrollTop())) * b)),
                left: (g.left + this.offset.relative.left * b + this.offset.parent.left * b - ((this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0 : a.scrollLeft()) * b))
            };
        },
        _generatePosition: function(d) {
            var f = this.options
              , a = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent
              , h = (/(html|body)/i).test(a[0].tagName);
            var c = d.pageX;
            var b = d.pageY;
            if (this.originalPosition) {
                var g;
                if (this.containment) {
                    if (this.relative_container) {
                        var e = this.relative_container.offset();
                        g = [this.containment[0] + e.left, this.containment[1] + e.top, this.containment[2] + e.left, this.containment[3] + e.top];
                    } else {
                        g = this.containment;
                    }
                    if (d.pageX - this.offset.click.left < g[0]) {
                        c = g[0] + this.offset.click.left;
                    }
                    if (d.pageY - this.offset.click.top < g[1]) {
                        b = g[1] + this.offset.click.top;
                    }
                    if (d.pageX - this.offset.click.left > g[2]) {
                        c = g[2] + this.offset.click.left;
                    }
                    if (d.pageY - this.offset.click.top > g[3]) {
                        b = g[3] + this.offset.click.top;
                    }
                }
            }
            return {
                top: (b - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ((this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (h ? 0 : a.scrollTop())))),
                left: (c - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ((this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : h ? 0 : a.scrollLeft())))
            };
        },
        _clear: function() {
            this.helper.removeClass("om-draggable-dragging");
            if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval) {
                this.helper.remove();
            }
            this.helper = null ;
            this.cancelHelperRemoval = false;
        },
        _trigger: function(a, b, c) {
            c = c || this._uiHash();
            $.ae.plugin.call(this, a, [b, c]);
            if (a == "onDrag") {
                this.positionAbs = this._convertPositionTo("absolute");
            }
            return $.AEWidget.prototype._trigger.call(this, a, b, c);
        },
        plugins: {},
        _uiHash: function(a) {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }
    });
    $.ae.plugin.add("aeDraggable", "cursor", {
        onStart: function(c, b) {
            var a = $("body")
              , d = $(this).data("aeDraggable").options;
            if (a.css("cursor")) {
                d._cursor = a.css("cursor");
            }
            a.css("cursor", d.cursor);
        },
        onStop: function(c, b) {
            var a = $(this).data("aeDraggable");
            if (a) {
                var d = a.options;
                if (d._cursor) {
                    $("body").css("cursor", d._cursor);
                }
            }
        }
    });
    $.ae.plugin.add("aeDraggable", "scroll", {
        onStart: function(c, b) {
            var a = $(this).data("aeDraggable");
            if (a.scrollParent[0] != document && a.scrollParent[0].tagName != "HTML") {
                a.overflowOffset = a.scrollParent.offset();
            }
        },
        onDrag: function(f, e) {
            var c = $(this).data("aeDraggable")
              , g = c.options
              , a = false
              , b = 20
              , d = 20;
            if (c.scrollParent[0] != document && c.scrollParent[0].tagName != "HTML") {
                if (!g.axis || g.axis != "x") {
                    if ((c.overflowOffset.top + c.scrollParent[0].offsetHeight) - e.pageY < b) {
                        c.scrollParent[0].scrollTop = a = c.scrollParent[0].scrollTop + d;
                    } else {
                        if (e.pageY - c.overflowOffset.top < b) {
                            c.scrollParent[0].scrollTop = a = c.scrollParent[0].scrollTop - d;
                        }
                    }
                }
                if (!g.axis || g.axis != "y") {
                    if ((c.overflowOffset.left + c.scrollParent[0].offsetWidth) - e.pageX < b) {
                        c.scrollParent[0].scrollLeft = a = c.scrollParent[0].scrollLeft + d;
                    } else {
                        if (e.pageX - c.overflowOffset.left < b) {
                            c.scrollParent[0].scrollLeft = a = c.scrollParent[0].scrollLeft - d;
                        }
                    }
                }
            } else {
                if (!g.axis || g.axis != "x") {
                    if (e.pageY - $(document).scrollTop() < b) {
                        a = $(document).scrollTop($(document).scrollTop() - d);
                    } else {
                        if ($(window).height() - (e.pageY - $(document).scrollTop()) < b) {
                            a = $(document).scrollTop($(document).scrollTop() + d);
                        }
                    }
                }
                if (!g.axis || g.axis != "y") {
                    if (e.pageX - $(document).scrollLeft() < b) {
                        a = $(document).scrollLeft($(document).scrollLeft() - d);
                    } else {
                        if ($(window).width() - (e.pageX - $(document).scrollLeft()) < b) {
                            a = $(document).scrollLeft($(document).scrollLeft() + d);
                        }
                    }
                }
            }
            if (a !== false && $.ae.ddmanager && !g.dropBehaviour) {
                $.ae.ddmanager.prepareOffsets(c, e);
            }
        }
    });
});
define("ui-dialog", function(require, exports, moudles) {
    var c = "om-dialog " + "om-widget " + "om-widget-content " + "om-corner-all "
      , b = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    }
      , d = {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    }
      , a = $.attrFn || {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true,
        click: true
    };
    $.aeWidget("ae.aeDialog", {
        options: {
            autoOpen: true,
            buttons: {},
            closeOnEscape: true,
            closeText: "close",
            dialogClass: "",
            draggable: true,
            hide: null ,
            height: "auto",
            maxHeight: false,
            maxWidth: false,
            minHeight: 200,
            minWidth: 200,
            modal: false,
            position: {
                my: "center",
                at: "center",
                collision: "fit",
                using: function(f) {
                    var e = $(this).css(f).offset().top;
                    if (e < 0) {
                        $(this).css("top", f.top - e);
                    }
                }
            },
            resizable: true,
            show: null ,
            stack: true,
            title: "",
            width: 300,
            zIndex: 1000
        },
        _create: function() {
            this.originalTitle = this.element.attr("title");
            if (typeof this.originalTitle !== "string") {
                this.originalTitle = "";
            }
            this.options.title = this.options.title || this.originalTitle;
            var q = this;
            q.element.parent().bind("om-remove.omDialog", (q.__removeBind = function() {
                q.element.remove();
            }
            ));
            var l = this.options.partId
              , i = document.body;
            if (l) {
                i = $("#" + l);
            }
            var s = q.options
              , n = s.title || "&#160;"
              , f = $.ae.aeDialog.getTitleId(q.element)
              , o = (q.uiDialog = $("<div></div>")).appendTo(i).hide().addClass(c + s.dialogClass).css({
                zIndex: s.zIndex
            }).attr("tabIndex", -1).css("outline", 0).keydown(function(t) {
                if (s.closeOnEscape && t.keyCode && t.keyCode === $.ae.keyCode.ESCAPE) {
                    q.close(t);
                    t.preventDefault();
                }
            }).attr({
                role: "dialog",
                "aria-labelledby": f
            }).mousedown(function(t) {
                q.moveToTop(false, t);
            })
              , h = q.element.show().removeAttr("title").addClass("om-dialog-content " + "om-widget-content").appendTo(o)
              , g = (q.uiDialogTitlebar = $("<div></div>")).addClass("om-dialog-titlebar " + "om-corner-all " + "om-helper-clearfix " + "c_popupTitle").prependTo(o)
              , r = $("<div></div>").addClass("fn").appendTo(g)
              , m = $("<a></a>").addClass("refresh").attr("role", "button").appendTo(r)
              , k = $("<a></a>").addClass("min").attr("role", "button").appendTo(r)
              , p = $("<a></a>").addClass("max").attr("role", "button").appendTo(r)
              , j = $("<a></a>").addClass("close").attr("role", "button").click(function(t) {
                q.close(t);
                return false;
            }).appendTo(r)
              , e = $("<span></span>").addClass("om-dialog-title").attr("id", f).html(n).prependTo(g);
            g.find("*").add(g).disableSelection();
            if (!s.showFlush) {
                m.hide();
            }
            if (!s.showClose) {
                j.hide();
            }
            if (!s.showMinMax) {
                k.hide();
                p.hide();
            } else {
                k.hide();
            }
            if (s.draggable && $.ae.aeDraggable) {
                q._makeDraggable();
            }
            if (s.resizable && $.fn.aeResizable) {
                q._makeResizable();
            }
            q._createButtons(s.buttons);
            q._isOpen = false;
            if ($.fn.bgiframe) {
                o.bgiframe();
            }
        },
        _init: function() {
            if (this.options.autoOpen) {
                this.open();
            }
        },
        destroy: function() {
            var e = this;
            if (e.overlay) {
                e.overlay.destroy();
            }
            e.uiDialog.hide();
            e.element.unbind(".dialog").removeData("dialog").removeClass("om-dialog-content om-widget-content").hide().appendTo("body");
            e.uiDialog.remove();
            if (e.originalTitle) {
                e.element.attr("title", e.originalTitle);
            }
            return e;
        },
        widget: function() {
            return this.uiDialog;
        },
        close: function(k) {
            var g = this, j, i, h = this.options, e = h.onBeforeClose, f = h.onClose;
            if (e && false === g._trigger("onBeforeClose", k)) {
                return;
            }
            if (g.overlay) {
                g.overlay.destroy();
            }
            g.uiDialog.unbind("keypress.om-dialog");
            g._isOpen = false;
            if (g.options.hide) {
                g.uiDialog.hide(g.options.hide, function() {
                    f && g._trigger("onClose", k);
                });
            } else {
                g.uiDialog.hide();
                f && g._trigger("onClose", k);
            }
            if (g.options.modal) {
                j = 0;
                $(".om-dialog").each(function() {
                    if (this !== g.uiDialog[0]) {
                        i = $(this).css("z-index");
                        if (!isNaN(i)) {
                            j = Math.max(j, i);
                        }
                    }
                });
                $.ae.aeDialog.maxZ = j;
            }
            if (g.options.popupType !== "div") {
                g.uiDialog.remove();
            }
            return g;
        },
        isOpen: function() {
            return this._isOpen;
        },
        moveToTop: function(i, h) {
            var e = this, g = e.options, f;
            if ((g.modal && !i) || (!g.stack && !g.modal)) {
                return e._trigger("onFocus", h);
            }
            if (g.zIndex > $.ae.aeDialog.maxZ) {
                $.ae.aeDialog.maxZ = g.zIndex;
            }
            if (e.overlay) {
                $.ae.aeDialog.maxZ += 1;
                e.overlay.$el.css("z-index", $.ae.aeDialog.overlay.maxZ = $.ae.aeDialog.maxZ);
            }
            f = {
                scrollTop: e.element.scrollTop(),
                scrollLeft: e.element.scrollLeft()
            };
            $.ae.aeDialog.maxZ += 1;
            e.uiDialog.css("z-index", $.ae.aeDialog.maxZ);
            e.element.attr(f);
            e._trigger("onFocus", h);
            return e;
        },
        open: function() {
            if (this._isOpen) {
                return;
            }
            var g = this
              , h = g.options
              , f = g.uiDialog;
            g.overlay = h.modal ? new $.ae.aeDialog.overlay(g) : null ;
            g._size();
            g._position(h.position);
            f.show(h.show);
            g.moveToTop(true);
            if (h.modal) {
                f.bind("keypress.om-dialog", function(k) {
                    if (k.keyCode !== $.ae.keyCode.TAB) {
                        return;
                    }
                    var j = $(":tabbable", this)
                      , l = j.filter(":first")
                      , i = j.filter(":last");
                    if (k.target === i[0] && !k.shiftKey) {
                        l.focus(1);
                        return false;
                    } else {
                        if (k.target === l[0] && k.shiftKey) {
                            i.focus(1);
                            return false;
                        }
                    }
                });
            }
            $(g.element.find(":tabbable").get().concat(f.find(".om-dialog-buttonpane :tabbable").get().concat(f.get()))).eq(0).focus();
            g._isOpen = true;
            var e = h.onOpen;
            if (e) {
                g._trigger("onOpen");
            }
            return g;
        },
        _createButtons: function(h) {
            var g = this
              , e = false
              , f = $("<div></div>").addClass("om-dialog-buttonpane " + "om-helper-clearfix")
              , i = $("<div></div>").addClass("om-dialog-buttonset").appendTo(f);
            g.uiDialog.find(".om-dialog-buttonpane").remove();
            if (typeof h === "object" && h !== null ) {
                $.each(h, function() {
                    return !(e = true);
                });
            }
            if (e) {
                $.each(h, function(j, l) {
                    l = $.isFunction(l) ? {
                        click: l,
                        text: j
                    } : l;
                    var k = $('<button type="button"></button>').click(function() {
                        l.click.apply(g.element[0], arguments);
                    }).appendTo(i);
                    $.each(l, function(m, n) {
                        if (m === "click") {
                            return;
                        }
                        if (m in a) {
                            k[m](n);
                        } else {
                            k.attr(m, n);
                        }
                    });
                    if ($.fn.aeButton) {
                        k.aeButton();
                    }
                });
                f.appendTo(g.uiDialog);
            }
        },
        _makeDraggable: function() {
            var e = this, h = e.options, i = $(document), g;
            function f(j) {
                return {
                    position: j.position,
                    offset: j.offset
                };
            }
            e.uiDialog.aeDraggable({
                cancel: ".om-dialog-content, .close",
                handle: ".om-dialog-titlebar",
                containment: "document",
                cursor: "move",
                onStart: function(k, j) {
                    g = h.height === "auto" ? "auto" : $(this).height();
                    $(this).height($(this).height()).addClass("om-dialog-dragging");
                    e._trigger("onDragStart", f(k), j);
                },
                onDrag: function(k, j) {
                    e._trigger("onDrag", f(k), j);
                },
                onStop: function(k, j) {
                    h.position = [k.position.left - i.scrollLeft(), k.position.top - i.scrollTop()];
                    $(this).removeClass("om-dialog-dragging").height(g);
                    e._trigger("onDragStop", f(k), j);
                    $.ae.aeDialog.overlay.resize();
                }
            });
        },
        _makeResizable: function(j) {
            j = (j === undefined ? this.options.resizable : j);
            var f = this
              , i = f.options
              , e = f.uiDialog.css("position")
              , h = (typeof j === "string" ? j : "n,e,s,w,se,sw,ne,nw");
            function g(k) {
                return {
                    originalPosition: k.originalPosition,
                    originalSize: k.originalSize,
                    position: k.position,
                    size: k.size
                };
            }
            f.uiDialog.aeResizable({
                cancel: ".om-dialog-content",
                containment: "document",
                alsoResize: f.element,
                maxWidth: i.maxWidth,
                maxHeight: i.maxHeight,
                minWidth: i.minWidth,
                minHeight: f._minHeight(),
                handles: h,
                start: function(k, l) {
                    $(this).addClass("om-dialog-resizing");
                    f._trigger("onResizeStart", k, g(l));
                },
                resize: function(k, l) {
                    f._trigger("onResize", k, g(l));
                },
                stop: function(k, l) {
                    $(this).removeClass("om-dialog-resizing");
                    i.height = $(this).height();
                    i.width = $(this).width();
                    f._trigger("onResizeStop", k, g(l));
                    $.ae.aeDialog.overlay.resize();
                }
            }).css("position", e).find(".om-resizable-se").addClass("om-icon om-icon-grip-diagonal-se");
        },
        _minHeight: function() {
            var e = this.options;
            if (e.height === "auto") {
                return e.minHeight;
            } else {
                return Math.min(e.minHeight, e.height);
            }
        },
        _position: function(f) {
            var g = [], h = [0, 0], e;
            if (f) {
                if (typeof f === "string" || (typeof f === "object" && "0" in f)) {
                    g = f.split ? f.split(" ") : [f[0], f[1]];
                    if (g.length === 1) {
                        g[1] = g[0];
                    }
                    $.each(["left", "top"], function(k, j) {
                        if (+g[k] === g[k]) {
                            h[k] = g[k];
                            g[k] = j;
                        }
                    });
                    f = {
                        my: g.join(" "),
                        at: g.join(" "),
                        offset: h.join(" ")
                    };
                }
                f = $.extend({}, $.ae.aeDialog.prototype.options.position, f);
            } else {
                f = $.ae.aeDialog.prototype.options.position;
            }
            e = this.uiDialog.is(":visible");
            if (!e) {
                this.uiDialog.show();
            }
            this.uiDialog.css({
                top: 0,
                left: 0
            }).position($.extend({
                of: window
            }, f));
            if (!e) {
                this.uiDialog.hide();
            }
        },
        _setOptions: function(h) {
            var f = this
              , e = {}
              , g = false;
            $.each(h, function(i, j) {
                f._setOption(i, j);
                if (i in b) {
                    g = true;
                }
                if (i in d) {
                    e[i] = j;
                }
            });
            if (g) {
                this._size();
            }
            if (this.uiDialog.is(":data(resizable)")) {
                this.uiDialog.aeResizable("option", e);
            }
        },
        _setOption: function(h, i) {
            var f = this
              , e = f.uiDialog;
            switch (h) {
            case "buttons":
                f._createButtons(i);
                break;
            case "dialogClass":
                e.removeClass(f.options.dialogClass).addClass(c + i);
                break;
            case "disabled":
                if (i) {
                    e.addClass("om-dialog-disabled");
                } else {
                    e.removeClass("om-dialog-disabled");
                }
                break;
            case "draggable":
                var g = e.is(":data(draggable)");
                if (g && !i) {
                    e.aeDraggable("destroy");
                }
                if (!g && i) {
                    f._makeDraggable();
                }
                break;
            case "position":
                f._position(i);
                break;
            case "resizable":
                var j = e.is(":data(resizable)");
                if (j && !i) {
                    e.aeResizable("destroy");
                }
                if (j && typeof i === "string") {
                    e.aeResizable("option", "handles", i);
                }
                if (!j && i !== false) {
                    f._makeResizable(i);
                }
                break;
            case "title":
                $(".om-dialog-title", f.uiDialogTitlebar).html("" + (i || "&#160;"));
                break;
            }
            $.AEWidget.prototype._setOption.apply(f, arguments);
        },
        _size: function() {
            var h = this.options, f, g, e = this.uiDialog.is(":visible");
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                height: 0
            });
            if (h.minWidth > h.width) {
                h.width = h.minWidth;
            }
            f = this.uiDialog.css({
                height: "auto",
                width: h.width
            }).height();
            g = Math.max(0, h.minHeight - f);
            if (h.height === "auto") {
                if ($.support.minHeight) {
                    this.element.css({
                        minHeight: g,
                        height: "auto"
                    });
                } else {
                    this.uiDialog.show();
                    if (!e) {
                        this.uiDialog.hide();
                    }
                    this.element.height(h.height);
                }
            } else {
                this.element.height(Math.max(h.height - f, 0));
            }
            if (this.uiDialog.is(":data(resizable)")) {
                this.uiDialog.aeResizable("option", "minHeight", this._minHeight());
            }
        }
    });
    $.extend($.ae.aeDialog, {
        version: "2.0",
        uuid: 0,
        maxZ: 0,
        getTitleId: function(e) {
            var f = e.attr("id");
            if (!f) {
                this.uuid += 1;
                f = this.uuid;
            }
            return "ui-dialog-title-" + f;
        },
        overlay: function(e) {
            this.$el = $.ae.aeDialog.overlay.create(e);
        }
    });
    $.extend($.ae.aeDialog.overlay, {
        instances: [],
        oldInstances: [],
        maxZ: 0,
        events: $.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function(e) {
            return e + ".dialog-overlay";
        }).join(" "),
        create: function(f) {
            if (this.instances.length === 0) {
                setTimeout(function() {
                    if ($.ae.aeDialog.overlay.instances.length) {
                        $(document).bind($.ae.aeDialog.overlay.events, function(h) {
                            if ($(h.target).zIndex() < $.ae.aeDialog.overlay.maxZ) {
                                return false;
                            }
                        });
                    }
                }, 1);
                $(document).bind("keydown.dialog-overlay", function(h) {
                    if (f.options.closeOnEscape && h.keyCode && h.keyCode === $.ae.keyCode.ESCAPE) {
                        f.close(h);
                        h.preventDefault();
                    }
                });
                $(window).bind("resize.dialog-overlay", $.ae.aeDialog.overlay.resize);
            }
            var g = document.body;
            if (f.options.partId) {
                g = $("#" + f.options.partId);
            }
            var e = (this.oldInstances.pop() || $("<div></div>").addClass("om-widget-overlay")).appendTo(g).css({
                width: this.width(),
                height: this.height(),
                "overflow": "hidden"
            });
            if ($.fn.bgiframe) {
                e.bgiframe();
            }
            this.instances.push(e);
            return e;
        },
        destroy: function(e) {
            e.parent().unbind(this.__removeBind);
            var f = $.inArray(e, this.instances);
            if (f != -1) {
                this.oldInstances.push(this.instances.splice(f, 1)[0]);
            }
            if (this.instances.length === 0) {
                $([document, window]).unbind(".dialog-overlay");
            }
            e.remove();
            var g = 0;
            $.each(this.instances, function() {
                g = Math.max(g, this.css("z-index"));
            });
            this.maxZ = g;
        },
        height: function() {
            var f, e;
            if ("undefined" == typeof (document.body.style.maxHeight)) {
                f = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                e = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
                if (f < e) {
                    return $(window).height() + "px";
                } else {
                    return f + "px";
                }
            } else {
                return $(document).height() + "px";
            }
        },
        width: function() {
            var e, f;
            if (/msie/.test(navigator.userAgent.toLowerCase())) {
                e = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                f = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                if (e < f) {
                    return $(window).width() + "px";
                } else {
                    return e + "px";
                }
            } else {
                return $(document).width() + "px";
            }
        },
        resize: function() {
            var e = $([]);
            $.each($.ae.aeDialog.overlay.instances, function() {
                e = e.add(this);
            });
            e.css({
                width: 0,
                height: 0
            }).css({
                width: $.ae.aeDialog.overlay.width(),
                height: $.ae.aeDialog.overlay.height()
            });
        }
    });
    $.extend($.ae.aeDialog.overlay.prototype, {
        destroy: function() {
            $.ae.aeDialog.overlay.destroy(this.$el);
        }
    });
});
define("ui-calendar", function(require, exports, moudles) {
    $.aeWidget("ae.aeCalendar", {
        options: {
            date: new Date(),
            startDay: 0,
            pages: 1,
            minDate: false,
            maxDate: false,
            popup: true,
            showTime: false,
            onSelect: function(a, b) {},
            disabledDays: [],
            disabledFn: function(a) {},
            enable: true,
            visible: true,
            editable: true,
            dateFormat: false,
            initType: "html"
        },
        enable: function(e) {
            if (e === undefined) {
                e = true;
            }
            var a = this
              , d = a.options
              , b = d.enable
              , f = a.element
              , c = a.expandTrigger;
            if (e === true || e === "true") {
                if (d.popup) {
                    b = true;
                    f.attr("disabled", false);
                    c.removeClass("e_dis").unbind();
                    f.parent().parent().removeClass("e_dis").unbind();
                    a._buildStatusEvent();
                }
            }
            if (e === false || e === "false") {
                if (d.popup) {
                    a.hide();
                    b = false;
                    f.attr("disabled", true).unbind(".aeCalendar");
                    c.addClass("e_dis").unbind();
                    f.parent().parent().addClass("e_dis").unbind();
                }
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        getValue: function() {
            var a = "";
            a = $.aeCalendar.formatDate(this.options.date, this.options.dateFormat || this._defaultFormat);
            return a;
        },
        setValue: function(e) {
            var b = this;
            if (typeof e === "undefined" || e === "") {
                $(this.element).val("").focus().blur();
            } else {
                var c = $.aeCalendar.parseDate(e, this.options.dateFormat || b._defaultFormat);
                if (this.options.popup) {
                    if (!isNaN(c)) {
                        var a = $.aeCalendar.formatDate(c, this.options.dateFormat || b._defaultFormat);
                        $(this.element).val(a).attr("title", a).focus().blur();
                    }
                }
                this.options.date = c;
                this._render({
                    date: c
                });
            }
        },
        _create: function() {
            var c = this.element
              , b = this.options;
            if (b.initType == "html") {
                this._buildOptions(b, c);
            }
            this.cid = this._stamp(c);
            if (b.popup) {
                var a = c.wrap('<span class="e_elements"><span class="e_input e_input-left"><span></span></span></span>').closest(".e_input");
                this.expandTrigger = $('<button type="button" class="e_button-right"><i class="e_ico-date"></i><span></span></button>').insertBefore(a);
                this.con = $("<div></div>").appendTo(document.body).css({
                    "top": "0px",
                    "position": "absolute",
                    "background": "white",
                    "visibility": "hidden",
                    "z-index": "2000"
                });
                this._buildBodyEvent();
                this._buildStatusEvent();
            } else {
                this.con = this.element;
            }
            this.con.addClass("c_option");
        },
        _init: function() {
            var d = this.element
              , c = this.options
              , b = this;
            if (c.popup) {
                d.val() && (c.date = $.aeCalendar.parseDate(d.val(), c.dateFormat || b._defaultFormat) || new Date());
            }
            this._render();
            this._buildInputEvent();
            this.expandTrigger.click(function() {
                d.trigger("click");
            });
            if (c.width) {
                d.parents(".e_elements").css({
                    "width": c.width
                });
            }
            if (c.type === "form") {
                if (c.uiid) {
                    d.removeAttr("uiid");
                }
            } else {
                c.uiid ? d.attr("uiid", c.uiid) : d.attr("uiid", d.attr("id"));
            }
            c.aeType ? d.attr("aeType", c.aeType) : d.attr("aeType", "aeCalendar");
            !c.editable ? d.attr("readonly", "readOnly").unbind() : d.removeAttr("readonly");
            !c.enable ? b.enable(false) : b.enable(true);
            if (!c.visible) {
                d.parents(".li").hide();
            }
            if (c.date) {
                if (c.popup) {
                    if (!isNaN(c.date)) {
                        var a = $.aeCalendar.formatDate(c.date, c.dateFormat || this._defaultFormat);
                        d.val(a).attr("title", a).focus().blur();
                    }
                }
            }
        },
        _buildOptions: function(d, f) {
            d.startDay = f.attr("startDay") ? parseInt(f.attr("startDay")) : d.startDay;
            d.showTime = f.attr("showTime") == "true" ? true : d.showTime;
            d.enable = f.attr("enable") == "false" ? false : d.enable;
            d.visible = f.attr("visible") == "false" ? false : d.visible;
            d.editable = f.attr("editable") == "false" ? false : d.editable;
            d.dateFormat = f.attr("dateFormat") || d.dateFormat;
            d.aeType = f.attr("aeType");
            d.uiid = f.attr("uiid");
            d.width = f.attr("width");
            var b = this;
            b._buildParam();
            if (f.attr("date")) {
                d.date = $.aeCalendar.parseDate(f.attr("date"), d.dateFormat || b._defaultFormat);
            }
            if (f.attr("minDate")) {
                d.minDate = $.aeCalendar.parseDate(f.attr("minDate"), d.dateFormat || b._defaultFormat);
            }
            if (f.attr("maxDate")) {
                d.maxDate = $.aeCalendar.parseDate(f.attr("maxDate"), d.dateFormat || b._defaultFormat);
            }
            if (f.attr("disabledDays") && f.attr("disabledDays").indexOf("[") == 0) {
                var c = [];
                var a = f.attr("disabledDays").substring(1, f.attr("disabledDays").length - 1).split(",");
                for (var e = 0; e < a.length; e++) {
                    c.push(parseInt(a[e], 10));
                }
                d.disabledDays = c;
            }
            this._buildOptionsEvent(d, f);
        },
        _buildOptionsEvent: function(b, c) {
            var a = c.attr("onSelect");
            b.onSelect = a ? function(e, j) {
                if ($.isString(a)) {
                    var g = a.indexOf("(");
                    var f = g > 0 ? a.substring(0, g) : a;
                    var h = "return window." + f + "?" + f + ".call(window, d ,e):false;";
                    return new Function("d","e",h)(e, j);
                }
            }
             : b.onSelect;
            var d = c.attr("disabledFn");
            b.disabledFn = d ? function(e) {
                if ($.isString(d)) {
                    var g = d.indexOf("(");
                    var f = g > 0 ? d.substring(0, g) : d;
                    var h = "return window." + f + "?" + f + ".call(window, d):false;";
                    return new Function("d",h)(e);
                }
            }
             : b.disabledFn;
        },
        _buildInputEvent: function() {
            var a = this
              , c = this.element
              , b = this.options;
            $("#" + this.cid).bind("change", function(g) {
                var f = $.aeCalendar.parseDate(c.val(), b.dateFormat || a._defaultFormat);
                if (!f) {
                    alert("日期{" + c.val() + "}不符合{" + (b.dateFormat || a._defaultFormat) + "}格式,请重新输入!");
                    var d = $.aeCalendar.formatDate(b.date, b.dateFormat || this._defaultFormat);
                    c.val(d).focus().blur();
                }
            });
        },
        _render: function(c) {
            var f = 0, a, d, g, j = this.element, b = this.options;
            this.ca = [];
            this._parseParam(c);
            this.con.html("");
            for (f = 0,
            g = [this.year, this.month]; f < b.pages; f++) {
                if (f === 0) {
                    a = true;
                } else {
                    a = false;
                    g = this._computeNextMonth(g);
                }
                d = f == (b.pages - 1);
                this.ca.push(new $.ae.aeCalendar.Page({
                    year: g[0],
                    month: g[1],
                    prevArrow: a,
                    nextArrow: d,
                    showTime: self.showTime
                },this));
                this.ca[f]._render();
            }
            if (b.pages > 1) {
                var e = j.find(".om-cal-box");
                var h = [];
                $.each(e, function(k, l) {
                    h.push($(l).css("height"));
                });
                h.sort();
                e.css("height", h[h.length - 1]);
            }
        },
        _stamp: function(a) {
            if (a.attr("id") === undefined || a.attr("id") === "") {
                a.attr("id", "K_" + new Date().getTime());
            }
            return a.attr("id");
        },
        _buildStatusEvent: function() {
            var a = this
              , c = a.element
              , b = a.options;
            c.unbind(".aeCalendar").bind("click.aeCalendar", function(f) {
                var g = $.aeCalendar.parseDate(c.val(), b.dateFormat || a._defaultFormat) || new Date();
                a._render({
                    date: g
                });
                a.toggle();
            }).bind("focus.aeCalendar", function() {
                $(this).keydown(function(d) {
                    if (d.keyCode == $.ae.keyCode.BACKSPACE && $(this).attr("readonly") == "readonly") {
                        return false;
                    }
                });
            });
            this.expandTrigger.unbind().click(function() {
                a.element.trigger("focus");
                a.show();
            });
        },
        _buildBodyEvent: function() {
            var a = this;
            $(document).bind("mousedown.aeCalendar", this.globalEvent = function(b) {
                a.hide();
            }
            );
            a.con.mousedown(function(b) {
                b.stopPropagation();
            });
        },
        toggle: function() {
            if (!this.isVisible()) {
                this.show();
            } else {
                this.hide();
            }
        },
        isVisible: function() {
            if (this.con.css("visibility") == "hidden") {
                return false;
            }
            return true;
        },
        show: function() {
            var d = this.element.parent();
            this.con.css("visibility", "");
            var c = d.offset().left
              , a = d.offsetHeight || d.outerHeight()
              , b = d.offset().top + a;
            this.con.css("left", c.toString() + "px");
            this.con.css("top", b.toString() + "px");
        },
        hide: function() {
            this.con.css("visibility", "hidden");
        },
        destroy: function() {
            var a = this.element;
            $("body").unbind(".aeCalendar", this.globalEvent);
            if (this.options.popup) {
                a.parent().after(a).remove();
                this.con.remove();
            }
        },
        _buildParam: function() {
            var a = this.options;
            a.startDay && (a.startDay = (7 - a.startDay) % 7);
            !a.dateFormat && (this._defaultFormat = a.showTime ? "yy-mm-dd H:i:s" : "yy-mm-dd");
            this.EV = [];
            return this;
        },
        _parseParam: function(a) {
            a && $.extend(this.options, a);
            this._handleDate();
        },
        _templetShow: function(b, g) {
            var d, h, c, a, f, e;
            if (g instanceof Array) {
                d = "";
                for (c = 0; c < g.length; c++) {
                    d += arguments.callee(b, g[c]);
                }
                b = d;
            } else {
                h = b.match(/{\$(.*?)}/g);
                if (g !== undefined && h !== null ) {
                    for (c = 0,
                    a = h.length; 
                    c < a; c++) {
                        e = h[c].replace(/({\$)|}/g, "");
                        f = (g[e] !== undefined) ? g[e] : "";
                        b = b.replace(h[c], f);
                    }
                }
            }
            return b;
        },
        _handleDate: function() {
            var a = this.options.date;
            if (a) {
                this.day = a.getDate();
                this.month = a.getMonth();
                this.year = a.getFullYear();
            }
        },
        _monthAdd: function() {
            var a = this;
            if (a.month == 11) {
                a.year++;
                a.month = 0;
            } else {
                a.month++;
            }
            a.options.date.setFullYear(a.year, a.month, 1);
            return this;
        },
        _monthMinus: function() {
            var a = this;
            if (a.month === 0) {
                a.year--;
                a.month = 11;
            } else {
                a.month--;
            }
            a.options.date.setFullYear(a.year, a.month, 1);
            return this;
        },
        _yearAdd: function() {
            var a = this;
            a.year++;
            a.options.date.setFullYear(a.year, a.month, 1);
            return this;
        },
        _yearMinus: function() {
            var a = this;
            a.year--;
            a.options.date.setFullYear(a.year, a.month, 1);
            return this;
        },
        _computeNextMonth: function(b) {
            var d = b[0]
              , c = b[1];
            if (c == 11) {
                d++;
                c = 0;
            } else {
                c++;
            }
            return [d, c];
        },
        _handleOffset: function() {
            var d = this
              , g = $.ae.lang.aeCalendar
              , f = [g.sun, g.mon, g.tue, g.wed, g.thu, g.fri, g.sat]
              , c = "<li><span>{$day}</span></li>"
              , j = this.options.startDay
              , h = ""
              , b = [];
            for (var e = 0; e < 7; e++) {
                b[e] = {
                    day: f[(e - j + 7) % 7]
                };
            }
            h = d._templetShow(c, b);
            return {
                day_html: h
            };
        }
    });
    $.extend($.ae.aeCalendar, {
        Page: function(b, a) {
            var c = $.ae.lang.aeCalendar;
            this.father = a;
            this.month = Number(b.month);
            this.year = Number(b.year);
            this.prevArrow = b.prevArrow;
            this.nextArrow = b.nextArrow;
            this.node = null ;
            this.timmer = null ;
            this.id = "";
            this.EV = [];
            this.html = ['<div class="c_optionContent" id="{$id}" style="width:200px;">', '<div class="c_calendar">', '<div class="date">', '<a title="' + c.preyear + '" class="preYear"></a>', '<a href="#nogo" title="' + c.premon + '" class="preMonth"></a>', '<span class="year"><input type="text" value="{$year}" maxlength="4" /></span>', '<span class="month"><input type="text" value="{$month}" maxlength="2"/></span>', '<a href="#nogo" title="' + c.nextmon + '" class="nextMonth"></a>', '<a title="' + c.nextyear + '" class="nextYear"></a>', "</div>", '<ul class="week">', a._handleOffset().day_html, "</ul>", '<ul class="day">', "{$ds}", "</ul>", '<div class="time" style="display:none;">', "</div>", '<div class="fn">', '<button type="button" class="today"><span>' + c.today + "</span></button>", '<button type="button" class="clear"><span>' + c.clear + "</span></button>", '<button type="button" class="cancel"><span>' + c.cancel + "</span></button>", "</div>", '<div class="option option-year" style="display:none;">', "</div>", '<div class="option option-month" style="display:none;">', "</div>", '<div class="time_select option" style="display:none;">', "</div>", "</div>", "</div>"].join("");
            this.year_select_html = ['<div class="list">', "{$yearselect}", "</div>", '<div class="page">', '<a href="#nogo" class="pre">' + c.pre + "</a>", '<a href="#nogo" class="next">' + c.next + "</a>", '<a href="#nogo" class="close"></a>', "</div>"].join("");
            this.month_select_html = ['<div class="list">', '<a href="#nogo" val="1">' + c.jan + "</a>", '<a href="#nogo" val="7">' + c.july + "</a>", '<a href="#nogo" val="2">' + c.feb + "</a>", '<a href="#nogo" val="8">' + c.aug + "</a>", '<a href="#nogo" val="3">' + c.mar + "</a>", '<a href="#nogo" val="9">' + c.sep + "</a>", '<a href="#nogo" val="4">' + c.apr + "</a>", '<a href="#nogo" val="10">' + c.oct + "</a>", '<a href="#nogo" val="5">' + c.may + "</a>", '<a href="#nogo" val="11">' + c.nov + "</a>", '<a href="#nogo" val="6">' + c.june + "</a>", '<a href="#nogo" val="12">' + c.dec + "</a>", "</div>", '<div class="page">', '<div class="goto right">', '<a href="#nogo" class="close"></a>', "</div>", "</div>"].join("");
            this.Verify = function() {
                var e = function(g) {
                    if (!/^\d+$/i.test(g)) {
                        return false;
                    }
                    g = Number(g);
                    return !(g < 1 || g > 31);
                }
                  , d = function(g) {
                    if (!/^\d+$/i.test(g)) {
                        return false;
                    }
                    g = Number(g);
                    return !(g < 100 || g > 10000);
                }
                  , f = function(g) {
                    if (!/^\d+$/i.test(g)) {
                        return false;
                    }
                    g = Number(g);
                    return !(g < 1 || g > 12);
                }
                ;
                return {
                    isDay: e,
                    isYear: d,
                    isMonth: f
                };
            }
            ;
            this._renderUI = function() {
                var g = this, d = {}, f, e = g.father.options;
                g.HTML = "";
                d.ds = "";
                d.year = "";
                d.month = "";
                d.id = g.id = "ae-cal-" + Math.random().toString().replace(/.\./i, "");
                d.year = g.year;
                d.month = g.month + 1;
                g.createDS();
                d.ds = g.ds;
                g.father.con.append(g.father._templetShow(g.html, d));
                g.node = $("#" + g.id);
                if (e.showTime) {
                    f = g.node.find(".time");
                    f.show();
                    g.timmer = new $.ae.aeCalendar.TimeSelector(f,g.father);
                }
                return this;
            }
            ;
            this._buildEvent = function() {
                var g = this, e, d = $("#" + g.id), f = g.father.options;
                g.EV[0] = d.find("div.date >span.year >input").bind("click", function() {
                    try {
                        g.timmer.hidePopup();
                    } catch (h) {}
                    d.find("div.option-month").hide();
                    g._buildYearSelect(g.year - 6, g.year, d.find("div.option-year"));
                    d.find("div.option-year").show();
                });
                g.EV[1] = d.find("div.date >span.month >input").bind("click", function() {
                    try {
                        g.timmer.hidePopup();
                    } catch (h) {}
                    d.find("div.option-year").hide();
                    d.find("div.option-month").html(g.month_select_html).show();
                    d.find("div.option-month a[val=" + (g.month + 1) + "]").addClass("on");
                });
                g.EV[2] = d.find("div.date >a.preMonth").bind("click", function() {
                    g.father._monthMinus()._render();
                    return false;
                });
                g.EV[3] = d.find("div.date >a.nextMonth").bind("click", function() {
                    g.father._monthAdd()._render();
                    return false;
                });
                g.EV[4] = d.find("div.date >a.preYear").bind("click", function() {
                    g.father._yearMinus()._render();
                });
                g.EV[5] = d.find("div.date >a.nextYear").bind("click", function() {
                    g.father._yearAdd()._render();
                });
                g.EV[6] = d.find("div.option-year").bind("click", function(j) {
                    j.preventDefault();
                    var k = $(j.target)
                      , i = $(this);
                    if (k.hasClass("close")) {
                        i.hide();
                    } else {
                        if (k.hasClass("pre")) {
                            g._buildYearSelect(i.data("start_year") - 18, g.year, i);
                        } else {
                            if (k.hasClass("next")) {
                                g._buildYearSelect(i.data("start_year") + 18, g.year, i);
                            } else {
                                var h = k.text();
                                if (!g.Verify().isYear(h)) {
                                    return;
                                }
                                g.father._render({
                                    date: g._computeDate(g, h, g.month)
                                });
                            }
                        }
                    }
                });
                g.EV[7] = d.find("div.option-month").bind("click", function(j) {
                    j.preventDefault();
                    var k = $(j.target)
                      , i = $(this);
                    if (k.hasClass("close")) {
                        i.hide();
                    } else {
                        var h = k.attr("val");
                        if (!g.Verify().isMonth(h)) {
                            return;
                        }
                        g.father._render({
                            date: g._computeDate(g, g.year, h - 1)
                        });
                    }
                });
                g.EV[8] = d.find("div.fn >button.today").bind("click", function(i) {
                    var j = new Date();
                    g.father.dt_date = j;
                    g.father._trigger("onSelect", i, j);
                    if (f.popup) {
                        g.father.hide();
                        if (!isNaN(g.father.dt_date)) {
                            var h = $.aeCalendar.formatDate(g.father.dt_date, f.dateFormat || g.father._defaultFormat);
                            $(g.father.element).val(h).attr("title", h).focus().blur();
                        }
                    }
                    g.father._render({
                        date: j
                    });
                });
                g.EV[9] = d.find("div.fn >button.clear").bind("click", function() {
                    $(g.father.element).val("").attr("title", "").focus();
                    g.father.hide();
                });
                g.EV[10] = d.find("div.fn >button.cancel").bind("click", function() {
                    g.father.hide();
                });
                g.EV[11] = d.find("ul.day >li").bind("click", function(j) {
                    var l = $(j.target);
                    if (l.hasClass("li_day_dis") || l.parent().hasClass("li_day_dis")) {
                        return;
                    } else {
                        var i = Number(l.text());
                        var k = new Date(f.date);
                        k.setFullYear(g.year, g.month, i);
                        g.father.dt_date = k;
                        g.father._trigger("onSelect", j, k);
                        if (f.popup) {
                            g.father.hide();
                            if (!isNaN(g.father.dt_date)) {
                                var h = $.aeCalendar.formatDate(g.father.dt_date, f.dateFormat || g.father._defaultFormat);
                                $(g.father.element).val(h).attr("title", h).focus().blur();
                            }
                        }
                        g.father._render({
                            date: k
                        });
                    }
                });
            }
            ;
            this._buildYearSelect = function(d, f, g) {
                var h = this;
                h._creatYear(d, f);
                var e = h.father._templetShow(h.year_select_html, {
                    yearselect: h.yearselect
                });
                g.html(e);
            }
            ;
            this._computeDate = function(g, e, f) {
                var d = new Date(g.father.options.date.getTime());
                d.setFullYear(e, f);
                return d;
            }
            ;
            this._getNode = function() {
                var d = this;
                return d.node;
            }
            ;
            this._getNumOfDays = function(d, e) {
                return 32 - new Date(d,e - 1,32).getDate();
            }
            ;
            this._creatYear = function(g, h) {
                var f = this
                  , d = $("#" + f.id)
                  , o = ""
                  , k = g + 17;
                if (!/^[1-2]\d{3}$/.test(g)) {
                    return;
                }
                if ((g + 19) < 1900 || g > 2099) {
                    return;
                }
                for (var j = g; j <= k; j++) {
                    var e = j - g;
                    var m = (e > 0 ? parseInt(e / 3) : 0) + parseInt(e % 3) * 6;
                    var l = g + m;
                    if (l < 1900 || l > 2099) {
                        o += "<a></a>";
                        continue;
                    } else {
                        if (h && l == h) {
                            o += '<a class="on" href="#nogo">' + l + "</a>";
                        } else {
                            o += '<a href="#nogo">' + l + "</a>";
                        }
                    }
                }
                d.find("div.option-year").data("start_year", g);
                return f.yearselect = o;
            }
            ;
            this.createDS = function() {
                var f = this, m = f.father.options, r = "", g = (new Date(f.year + "/" + (f.month + 1) + "/01").getDay() + m.startDay + 7) % 7, j = f._getNumOfDays(f.year, f.month + 1) + g, l, e;
                var q = $.aeCalendar.parseDate(f.father.element.val(), f.father.options.dateFormat || f.father._defaultFormat);
                if (!q) {
                    q = f.father.options.date;
                }
                var n = ""
                  , h = ""
                  , p = "";
                if (q) {
                    p = q.getDate();
                    h = q.getMonth();
                    n = q.getFullYear();
                }
                var d = [];
                for (l = 0; l < m.disabledDays.length; l++) {
                    d[l] = m.disabledDays[l] % 7;
                }
                for (l = 0; l < j; l++) {
                    var o = new Date(f.year + "/" + Number(f.month + 1) + "/" + (l + 1 - g).toString());
                    if (l < g) {
                        r += '<li><a class="li_day" href="#nogo"><span class="g">&nbsp;</span></a></li>';
                    } else {
                        if ($.inArray((l + m.startDay) % 7, d) >= 0) {
                            r += '<li><a class="li_day_dis" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                        } else {
                            if (m.disabledFn(o) === false) {
                                r += '<li><a class="li_day_dis" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                            } else {
                                if (m.minDate instanceof Date && new Date(f.year + "/" + (f.month + 1) + "/" + (l + 1 - g)).getTime() < (m.minDate.getTime() + 1)) {
                                    r += '<li><a class="li_day_dis" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                                } else {
                                    if (m.maxDate instanceof Date && new Date(f.year + "/" + (f.month + 1) + "/" + (l + 1 - g)).getTime() > m.maxDate.getTime()) {
                                        r += '<li><a class="li_day_dis" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                                    } else {
                                        if (l == (g + p - 1) && f.month == h && f.year == n) {
                                            r += '<li class="on"><a class="li_day" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                                        } else {
                                            if (l == (g + (new Date()).getDate() - 1) && (new Date()).getFullYear() == f.year && (new Date()).getMonth() == f.month) {
                                                r += '<li class="today"><a class="li_day" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                                            } else {
                                                r += '<li><a class="li_day" href="#nogo"><span class="g">' + (l - g + 1) + "</span></a></li>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (j % 7 !== 0) {
                    for (l = 0; 
                    l < (7 - j % 7); l++) {
                        r += '<li><a class="li_day"><span class="g">&nbsp;</span></a></li>';
                    }
                }
                f.ds = r;
            }
            ;
            this._render = function() {
                var d = this;
                d._renderUI();
                d._buildEvent();
            }
            ;
        }
    });
    $.extend($.ae.aeCalendar, {
        TimeSelector: function(e, c) {
            var b = c.options.date
              , d = $.ae.lang.aeCalendar;
            this.father = c;
            this.fcon = e.parents(".c_optionContent");
            this.popupannel = this.fcon.find(".time_select");
            this.yearPopupannel = this.fcon.find("div.option-year");
            this.monthPopupannel = this.fcon.find("div.option-month");
            if (typeof b == "undefined") {
                c.options.date = new Date();
            }
            this.time = c.options.date;
            this.status = "s";
            var a = ["<ul>", "<li>", '<span class="e_elements">', '<span class="e_label e_label-right">', "<span>" + d.miniHour + "</span>", "</span>", '<span class="e_input e_input-left">', '<span><input type="text" class="h" maxlength="2"/></span>', "</span>", "</span>", "</li>", "<li>", '<span class="e_elements">', '<span class="e_label e_label-right">', "<span>" + d.miniMinute + "</span>", "</span>", '<span class="e_input e_input-left">', '<span><input type="text" class="m" maxlength="2"/></span>', "</span>", "</span>", "</li>", "<li>", '<span class="e_elements">', '<span class="e_label e_label-right">', "<span>" + d.miniSecond + "</span>", "</span>", '<span class="e_input e_input-left">', '<span><input type="text" class="s" maxlength="2"/></span>', "</span>", "</span>", "</li>", "</ul>"].join("");
            this.ctime = $(a);
            this.h_a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
            this.m_a = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
            this.s_a = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
            this.parseSubHtml = function(f, g) {
                var j = "";
                j += '<div class="page">';
                j += '  <div class="title"></div>';
                j += '  <a href="#nogo" class="close"></a>';
                j += "</div>";
                j += '<div class="list">';
                for (var h = 0; h < f.length; h++) {
                    if (g === f[h]) {
                        j += '<a href="#nogo" class="on" val="' + f[h] + '">' + f[h] + "</a>";
                    } else {
                        j += '<a href="#nogo" val="' + f[h] + '">' + f[h] + "</a>";
                    }
                }
                j += "</div>";
                return j;
            }
            ;
            this.showPopup = function(h) {
                var i = this
                  , g = this.popupannel;
                i.yearPopupannel.hide();
                i.monthPopupannel.hide();
                g.html(h).show().removeClass("option-hour option-minute option-second");
                var f = i.status;
                switch (f) {
                case "h":
                    g.addClass("option-hour").find(".title").text(d.hour);
                    break;
                case "m":
                    g.addClass("option-minute").find(".title").text(d.minute);
                    break;
                case "s":
                    g.addClass("option-second").find(".title").text(d.second);
                    break;
                }
            }
            ;
            this.hidePopup = function() {
                this.popupannel.hide();
            }
            ;
            this._render = function() {
                var g = this;
                var j = g.get("h");
                var f = g.get("m");
                var i = g.get("s");
                g.father._time = g.time;
                g.ctime.find(".h").val(j);
                g.ctime.find(".m").val(f);
                g.ctime.find(".s").val(i);
                return g;
            }
            ;
            this.set = function(f, h) {
                var g = this;
                h = Number(h);
                switch (f) {
                case "h":
                    g.time.setHours(h);
                    break;
                case "m":
                    g.time.setMinutes(h);
                    break;
                case "s":
                    g.time.setSeconds(h);
                    break;
                }
                g._render();
            }
            ;
            this.get = function(f) {
                var g = this;
                var h = g.time;
                switch (f) {
                case "h":
                    return h.getHours();
                case "m":
                    return h.getMinutes();
                case "s":
                    return h.getSeconds();
                }
            }
            ;
            this._timeInit = function() {
                var f = this;
                e.html("").append(f.ctime);
                f._render();
                f.popupannel.bind("click", function(i) {
                    var h = $(i.target);
                    if (h.hasClass("close")) {
                        f.hidePopup();
                    } else {
                        var g = Number(h.html());
                        f.set(f.status, g);
                        f.hidePopup();
                    }
                });
                f.ctime.find(".h").bind("click", function(i) {
                    var g = $(i.target);
                    var h = f.parseSubHtml(f.h_a, g.val());
                    f.status = "h";
                    f.showPopup(h);
                });
                f.ctime.find(".m").bind("click", function(i) {
                    var g = $(i.target);
                    var h = f.parseSubHtml(f.m_a, g.val());
                    f.status = "m";
                    f.showPopup(h);
                });
                f.ctime.find(".s").bind("click", function(i) {
                    var g = $(i.target);
                    var h = f.parseSubHtml(f.s_a, g.val());
                    f.status = "s";
                    f.showPopup(h);
                });
            }
            ;
            this._timeInit();
        }
    });
    $.aeCalendar = $.aeCalendar || {};
    $.extend($.aeCalendar, {
        leftPad: function(d, b, c) {
            var a = new String(d);
            if (!c) {
                c = " ";
            }
            while (a.length < b) {
                a = c + a;
            }
            return a.toString();
        }
    });
    $.extend($.aeCalendar, {
        getShortDayName: function(a) {
            return $.aeCalendar.dayMaps[a][0];
        },
        getDayName: function(a) {
            return $.aeCalendar.dayMaps[a][1];
        },
        getShortMonthName: function(a) {
            return $.aeCalendar.monthMaps[a][0];
        },
        getMonthName: function(a) {
            return $.aeCalendar.monthMaps[a][1];
        },
        dayMaps: [["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"]],
        monthMaps: [["Jan", "January"], ["Feb", "February"], ["Mar", "March"], ["Apr", "April"], ["May", "May"], ["Jun", "June"], ["Jul", "July"], ["Aug", "August"], ["Sep", "September"], ["Oct", "October"], ["Nov", "November"], ["Dec", "December"]],
        formatCodes: {
            d: {
                g: "this.getDate()",
                s: "this.setDate({param})",
                r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
            },
            dd: {
                g: "$.aeCalendar.leftPad(this.getDate(), 2, '0')",
                s: "this.setDate(parseInt('{param}', 10))",
                r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
            },
            m: {
                g: "(this.getMonth() + 1)",
                s: "this.setMonth(parseInt('{param}', 10) - 1)",
                r: "(0[1-9]|1[0-2]|[1-9])"
            },
            mm: {
                g: "$.aeCalendar.leftPad(this.getMonth() + 1, 2, '0')",
                s: "this.setMonth(parseInt('{param}', 10) - 1)",
                r: "(0[1-9]|1[0-2]|[1-9])"
            },
            y: {
                g: "('' + this.getFullYear()).substring(2, 4)",
                s: "this.setFullYear(parseInt('20{param}', 10))",
                r: "(\\d{2})"
            },
            yy: {
                g: "this.getFullYear()",
                s: "this.setFullYear(parseInt('{param}', 10))",
                r: "(\\d{4})"
            },
            h: {
                g: "$.aeCalendar.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
                s: "this.setHours(parseInt('{param}', 10))",
                r: "(0[0-9]|1[0-1])"
            },
            H: {
                g: "$.aeCalendar.leftPad(this.getHours(), 2, '0')",
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-1][0-9]|2[0-3])"
            },
            g: {
                g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-9]|1[0-1])"
            },
            G: {
                g: "this.getHours()",
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-9]|1[0-9]|2[0-3])"
            },
            i: {
                g: "$.aeCalendar.leftPad(this.getMinutes(), 2, '0')",
                s: "this.setMinutes(parseInt('{param}', 10))",
                r: "([0-5][0-9])"
            },
            s: {
                g: "$.aeCalendar.leftPad(this.getSeconds(), 2, '0')",
                s: "this.setSeconds(parseInt('{param}', 10))",
                r: "([0-5][0-9])"
            },
            u: {
                g: "$.aeCalendar.leftPad(this.getMilliseconds(), 3, '0')",
                s: "this.setMilliseconds(parseInt('{param}', 10))",
                r: "(\\d{1,3})"
            },
            D: {
                g: "$.aeCalendar.getShortDayName(this.getDay())",
                s: "",
                r: ""
            },
            DD: {
                g: "$.aeCalendar.getDayName(this.getDay())",
                s: "",
                r: ""
            },
            M: {
                g: "$.aeCalendar.getShortMonthName(this.getMonth())",
                s: "",
                r: ""
            },
            MM: {
                g: "$.aeCalendar.getMonthName(this.getMonth())",
                s: "",
                r: ""
            },
            a: {
                g: "(this.getHours() < 12 ? 'am' : 'pm')",
                s: "",
                r: ""
            },
            A: {
                g: "(this.getHours() < 12 ? 'AM' : 'PM')",
                s: "",
                r: ""
            }
        }
    });
    $.extend($.aeCalendar, {
        formatDate: function(b, d) {
            if (!b || !d) {
                return null ;
            }
            if (!(Object.prototype.toString.call(b) === "[object Date]")) {
                return null ;
            }
            var c, f, a = "", e = false;
            for (c = 0; c < d.length; c++) {
                f = d.charAt(c);
                fi_next = d.charAt(c + 1);
                if (f == "'") {
                    e = !e;
                    continue;
                }
                if (!e && $.aeCalendar.formatCodes[f + fi_next]) {
                    f = new Function("return " + $.aeCalendar.formatCodes[f + fi_next].g).call(b);
                    c++;
                } else {
                    if (!e && $.aeCalendar.formatCodes[f]) {
                        f = new Function("return " + $.aeCalendar.formatCodes[f].g).call(b);
                    }
                }
                a += f;
            }
            return a;
        },
        parseDate: function(f, h) {
            if (!f || !h) {
                return null ;
            }
            if (!(Object.prototype.toString.call(f) === "[object String]")) {
                return null ;
            }
            var b = [], d, j, g = null , a;
            for (d = 0; d < h.length; d++) {
                j = h.charAt(d);
                fi_next = h.charAt(d + 1);
                if ($.aeCalendar.formatCodes[j + fi_next]) {
                    g = $.aeCalendar.formatCodes[j + fi_next];
                    d++;
                } else {
                    if ($.aeCalendar.formatCodes[j]) {
                        g = $.aeCalendar.formatCodes[j];
                    } else {
                        continue;
                    }
                }
                a = f.match(new RegExp(g.r));
                if (!a) {
                    return null ;
                }
                b.push(g.s.replace("{param}", a[0]));
                f = f.substring(a.index + a[0].length);
                var e = h.charAt(d + 1);
                if (!(e == "" && f == "") && (e !== f.charAt(0)) && ($.aeCalendar.formatCodes[e] === undefined)) {
                    return null ;
                }
            }
            var c = new Date();
            new Function(b.join(";")).call(c);
            return c;
        }
    });
    $.ae.lang.aeCalendar = {
        preyear: "Previous Year",
        premon: "Previous Month",
        nextyear: "Next Year",
        nextmon: "Next Month",
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        pre: "Prev",
        next: "Next",
        jan: "Jan",
        feb: "Feb",
        mar: "Mar",
        apr: "Apr",
        may: "May",
        june: "Jun",
        july: "Jul",
        aug: "Aug",
        sep: "Sep",
        oct: "Oct",
        nov: "Nov",
        dec: "Dec",
        miniHour: "H",
        miniMinute: "M",
        miniSecond: "S",
        hour: "Hour",
        minute: "Minute",
        second: "Second"
    };
});
define("ui-checkbox", function(require, exports, moudles) {
    $.aeWidget("ae.aeCheckbox", {
        options: {
            multiSeparator: ",",
            enable: true,
            visible: true,
            labelField: "text",
            valueField: "value",
            initType: "html"
        },
        _create: function() {
            var a = this.options
              , b = this.element;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            b.hide();
            this.dropList = $('<div class="c_fn"><ul></ul></div>').insertAfter(b);
        },
        _init: function() {
            var a = this
              , c = a.options
              , d = a.element;
            if (c.checkboxCol) {
                a.dropList.addClass("c_fn-col-" + c.checkboxCol);
            }
            if (c.labelLength) {
                a.dropList.addClass("c_fn-label-" + c.labelLength);
            }
            if (!c.visible) {
                this.element.parents(".li").hide();
            }
            if (!c.enable) {
                var b = $.data(this.element, "delay");
                if (b) {
                    clearTimeout(b);
                }
                b = setTimeout(function() {
                    a.enable(false);
                }, 200);
                $.data(this.element, "delay", b);
            }
            if (c.type === "form") {
                if (c.uiid) {
                    d.removeAttr("uiid");
                }
            } else {
                c.uiid ? d.attr("uiid", c.uiid) : d.attr("uiid", d.attr("id"));
            }
            c.aeType ? d.attr("aeType", c.aeType) : d.attr("aeType", "aeCheckbox");
        },
        _buildOptions: function(a, b) {
            a.checkboxCol = b.attr("checkboxCol");
            a.labelLength = b.attr("labelLength");
            a.multiSeparator = b.attr("multiSeparator") || a.multiSeparator;
            a.enable = b.attr("enable") == "false" ? false : a.enable;
            a.visible = b.attr("visible") == "false" ? false : a.visible;
            a.aeType = b.attr("aeType");
            a.uiid = b.attr("uiid");
            a.labelField = b.attr("labelField") || a.labelField;
            a.valueField = b.attr("valueField") || a.valueField;
        },
        getValue: function() {
            var c = this.options
              , b = this._getAllOptions()
              , a = [];
            b.each(function(d, e) {
                if ($.prop(e, "checked")) {
                    a.push("" + $(e).val());
                }
            });
            return a.join(c.multiSeparator);
        },
        setValue: function(f) {
            if (typeof f === "undefined" || f === "" || f == null ) {
                return;
            }
            var h = this
              , b = h.element
              , j = h.options
              , g = []
              , a = $.data(b, "allValues")
              , e = h._getAllOptions();
            e.removeAttr("checked");
            g = f.split(j.multiSeparator);
            for (var c = 0; c < g.length; c++) {
                var d = a ? a.indexOf(g[c]) : -1;
                if (d > -1) {
                    if (!$.attr(e[d], "disabled")) {
                        $.prop(e[d], "checked", true);
                    }
                }
            }
        },
        clear: function() {
            this._getAllOptions().removeAttr("checked");
        },
        reload: function(a) {
            this._loadData(a);
        },
        enable: function(e) {
            if (e === undefined) {
                e = true;
            }
            var b = this
              , d = b.options
              , c = d.enable
              , a = b._getAllOptions();
            if (e === true || e === "true") {
                a.removeAttr("disabled").unbind();
                c = true;
            }
            if (e === false || e === "false") {
                a.attr("disabled", true).unbind();
                c = false;
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        _loadData: function(d) {
            var c = this
              , f = c.element
              , b = ""
              , a = []
              , e = c.dropList.find("ul");
            e.empty();
            $(d).each(function(g, h) {
                b += c._wrapText(h);
                a.push("" + h[c.options.valueField]);
            });
            $(b).appendTo(e);
            $.data(f, "allValues", a);
        },
        _getAllOptions: function() {
            return this.dropList.find(".e_checkbox");
        },
        _wrapText: function(a) {
            return '<li><label><input type="checkbox" class="e_checkbox" value="' + a[this.options.valueField] + '" ' + (a.checked ? a.checked : "") + " " + (a.disabled ? a.disabled : "") + "/>" + a[this.options.labelField] + "</label></li>";
        }
    });
});
define("ui-combo", function(require, exports, moudles) {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(c) {
            var a = this.length;
            for (var b = 0; b < a; b++) {
                if (this[b] === c) {
                    return b;
                }
            }
            return -1;
        }
        ;
    }
    $.aeWidget("ae.aeCombo", {
        options: {
            optionField: "text",
            valueField: "value",
            width: "auto",
            enable: true,
            onlyRead: false,
            editable: true,
            visible: true,
            lazyLoad: false,
            listMaxHeight: 300,
            listAutoWidth: false,
            autoFilter: true,
            filterStrategy: "first",
            filterDelay: 500,
            forceSelection: false,
            multi: false,
            multiSeparator: ",",
            initType: "html",
            isCustomList: false
        },
        _init: function() {
            var a = this.options
              , e = this.textInput
              , d = a.dataSource
              , c = this.element;
            if (!a.textField) {
                a.textField = a.optionField;
            }
            if (typeof a.value !== "undefined") {
                a.lazyLoad = false;
            }
            if (a.width != "auto") {
                c.parents(".e_elements").css({
                    "width": a.width
                });
            }
            if (a.multi) {
                a.editable = this.options.editable = false;
            }
            this._refeshEmptyText(a.emptyText);
            if (a.type === "form") {
                if (a.uiid) {
                    c.removeAttr("uiid");
                }
            } else {
                a.uiid ? c.attr("uiid", a.uiid) : c.attr("uiid", c.attr("id"));
            }
            a.aeType ? c.attr("aeType", a.aeType) : c.attr("aeType", "aeCombo");
            !a.enable ? this.enable(false) : this.enable(true);
            (a.onlyRead || !a.editable) ? e.attr("readonly", "readOnly") : e.removeAttr("readonly");
            if (!a.visible) {
                c.parents(".li").hide();
            }
            if (!a.lazyLoad) {
                if (a.dataSource) {
                    var b = a.dataSource();
                    if (b) {
                        this._loadData(b);
                    }
                }
                if (a.listProvider) {
                    this._loadData();
                }
                this.dataHasLoaded = true;
            } else {
                this.dataHasLoaded = false;
            }
            var f = !a.enable || a.onlyRead;
            if (f) {
                this.expandTrigger.addClass("e_dis");
                this.textInput.parent().parent().addClass("e_dis");
            } else {
                this._bindEvent();
            }
        },
        _create: function() {
            var c = this.element
              , a = this.options;
            if (a.initType == "html") {
                this._buildOptions(a, c);
            }
            var b = $('<span class="e_elements"></span>').insertAfter(c).wrapInner(c);
            this.expandTrigger = $('<button class="e_button-right"><i class="e_ico-combobox"></i><span></span></button>').appendTo(b);
            b.append('<span class="e_input e_input-left"><span></span></span>');
            this.textInput = c.clone().removeAttr("dataField").attr("id", "COMBO_INPUT_TEXT_" + c.attr("id"));
            b.find(".e_input-left span").append(this.textInput);
            c.hide();
            this.inputClear = $('<a class="e_inputClear"></a>').insertBefore(this.textInput.parent()).hide();
            this.dropList = $($('<div class="c_combox"><div class="c_comboxContent"></div></div>').css({
                position: "absolute",
                zIndex: 2000
            }).appendTo(document.body).children()[0]).hide();
        },
        _buildOptions: function(a, b) {
            a.enable = b.attr("enable") == "false" ? false : a.enable;
            a.editable = b.attr("editable") == "false" ? false : a.editable;
            a.visible = b.attr("visible") == "false" ? false : a.visible;
            a.emptyText = b.attr("emptyText") || a.emptyText;
            a.listAutoWidth = b.attr("listAutoWidth") == "true" ? true : a.listAutoWidth;
            a.listMaxHeight = parseInt(b.attr("listMaxHeight")) || a.listMaxHeight;
            a.multi = b.attr("multi") == "true" ? true : a.multi;
            a.multiSeparator = b.attr("multiSeparator") || a.multiSeparator;
            a.onlyRead = b.attr("onlyRead") == "true" ? true : a.onlyRead;
            a.value = b.attr("value") || a.value;
            a.textField = b.attr("textField") || undefined;
            a.optionField = b.attr("optionField") || a.optionField;
            a.valueField = b.attr("valueField") || a.valueField;
            a.width = b.attr("width") || a.width;
            a.aeType = b.attr("aeType");
            a.uiid = b.attr("uiid");
            a.dataSource = b.attr("dataSource");
            this._buildOptionsEvent(a, b);
        },
        _buildOptionsEvent: function(b, d) {
            var c = d.attr("listProvider") || "";
            var a = d.attr("onValueChange") || "";
            this._buildCommonEvent(b, "textField", b.textField);
            this._buildCommonEvent(b, "optionField", b.optionField);
            this._buildCommonEvent(b, "valueField", b.valueField);
            this._buildCommonEvent(b, "dataSource", b.dataSource);
            b.listProvider = c ? function(e, f) {
                if ($.isString(c)) {
                    var h = c.indexOf("(");
                    var g = h > 0 ? c.substring(0, h) : c;
                    var j = "return window." + g + "?" + g + ".call(window, c ,r):false;";
                    return new Function("c","r",j)(e, f);
                }
            }
             : "";
            b.onValueChange = a ? function(l, k, e, j) {
                if ($.isString(a)) {
                    var g = a.indexOf("(");
                    var f = g > 0 ? a.substring(0, g) : a;
                    var h = "return window." + f + "?" + f + ".call(window, t ,n,o,e):false;";
                    return new Function("t","n","o","e",h)(l, k, e, j);
                }
            }
             : "";
        },
        _buildCommonEvent: function(a, c, b) {
            a[c] = b && b.indexOf("(") > 0 ? function(h, g) {
                if ($.isString(b)) {
                    var e = b.indexOf("(");
                    var d = e > 0 ? b.substring(0, e) : b;
                    var f = "return window." + d + "?" + d + ".call(window,p1,p2):false;";
                    return new Function("p1","p2",f)(h, g);
                }
            }
             : a[c];
        },
        reload: function(c) {
            var a = this
              , d = a.textInput
              , b = a.element;
            a.options.value = "";
            b.val("");
            d.val("");
            a._loadData(c);
        },
        getData: function() {
            var a = this.options.dataSource;
            return (typeof a == "object") ? a : null ;
        },
        getValue: function() {
            var a = this.element.val();
            return a ? a : "";
        },
        setValue: function(a) {
            this._setValue(a + "");
            return this;
        },
        enable: function(f) {
            if (f === undefined) {
                f = true;
            }
            var b = this
              , e = b.options
              , c = e.enable
              , a = b.textInput
              , d = b.expandTrigger;
            if (f === true || f === "true") {
                a.removeAttr("disabled").unbind();
                c = true;
                d.removeClass("e_dis").unbind();
                a.parent().parent().removeClass("e_dis").unbind();
                b._bindEvent();
            }
            if (f === false || f === "false") {
                a.attr("disabled", true).unbind();
                c = false;
                d.addClass("e_dis").unbind();
                a.parent().parent().addClass("e_dis").unbind();
                b.inputClear.hide();
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        getDisplayText: function() {
            var a = this.textInput.val();
            return a ? a : "";
        },
        clear: function() {
            var a = this
              , c = a.textInput
              , b = a.element;
            a.options.value = "";
            b.val("");
            c.val("");
            a.inputClear.hide();
        },
        validate: function() {
            var i = this
              , j = i.options
              , f = i.textInput
              , b = i.element
              , c = j.emptyText;
            var h = f.val();
            if (h !== "") {
                var e = $.data(b, "allInputText");
                var a = $.data(b, "allValues");
                var d = e.indexOf(h);
                if (d > -1) {
                    i._setValue(a[d]);
                } else {
                    if (!j.forceSelection) {
                        b.val(f.val());
                    } else {
                        var g = b.val();
                        d = a.indexOf(g);
                        if (d > -1) {
                            f.val(e[d]);
                        } else {
                            alert("输入框的值不合法!");
                            f.val("");
                        }
                    }
                }
            } else {
                b.val("");
            }
            i._refeshEmptyText(c);
        },
        destroy: function() {
            var a = this.element;
            $(document).unbind("mousedown.aeCombo", this.globalEvent);
            a.parent().after(a).remove();
            this.dropList.parent().remove();
        },
        _bindEvent: function() {
            var h = this
              , i = h.options
              , d = h.textInput
              , b = h.element
              , a = h.dropList
              , f = h.expandTrigger
              , c = i.emptyText
              , g = h.inputClear;
            var e = d.parent("span");
            e.mouseenter(function() {
                if (i.enable) {}
            }).mouseleave(function() {}).mousedown(function(j) {
                j.stopPropagation();
            });
            d.focus(function() {
                $(".c_comboxContent").hide();
                $(".c_option").css("visibility", "hidden");
                h._refeshEmptyText(c);
                if (!h.dataHasLoaded) {
                    if (!f.hasClass("om-loading")) {
                        h.dataHasLoaded = true;
                    }
                }
                if (i.enable && !i.onlyRead) {
                    h._showDropList();
                }
            }).blur(function(m) {
                if (i.enable && !i.onlyRead && !i.multi && i.dataSource) {
                    if (h.hasManualInput) {
                        h.hasManualInput = false;
                        var n = d.val();
                        if (n !== "") {
                            var o = $.data(b, "allInputText");
                            var j = $.data(b, "allValues");
                            var k = o.indexOf(n);
                            if (k > -1) {
                                h._setValue(j[k]);
                            } else {
                                if (!i.forceSelection) {
                                    b.val(d.val());
                                } else {
                                    var l = b.val();
                                    k = j.indexOf(l);
                                    if (k > -1) {
                                        d.val(o[k]);
                                    } else {
                                        d.val("");
                                    }
                                }
                            }
                        } else {
                            b.val("");
                        }
                    }
                    h._refeshEmptyText(c);
                    if (d.val() === "" || d.val() === i.emptyText) {
                        g.hide();
                    } else {
                        g.show();
                    }
                }
            }).keyup(function(l) {
                var j = l.keyCode
                  , k = $.ae.keyCode;
                switch (j) {
                case k.DOWN:
                    h._selectNext();
                    break;
                case k.UP:
                    h._selectPrev();
                    break;
                case k.ENTER:
                    h._backfill(h.dropList.find(".om-state-hover"));
                    break;
                case k.ESCAPE:
                    a.hide();
                    break;
                case k.TAB:
                    break;
                default:
                    h.hasManualInput = true;
                    if (i.enable && !i.onlyRead && i.editable && i.autoFilter) {
                        if (window._aeComboFilterTimer) {
                            clearTimeout(window._aeComboFilterTimer);
                        }
                        window._aeComboFilterTimer = setTimeout(function() {
                            if ($(document).attr("activeElement").id == d.attr("id")) {
                                a.show();
                            }
                            h._doFilter(d);
                        }, i.filterDelay);
                    }
                }
            });
            g.click(function() {
                i.value = "";
                d.val("");
                b.val("");
                d.blur();
            });
            a.mousedown(function(j) {
                j.stopPropagation();
            });
            f.click(function() {
                d.focus();
            });
            $(document).bind("mousedown.aeCombo", this.globalEvent = function() {
                a.hide();
            }
            );
        },
        _showDropList: function() {
            var o = this, q = o.options, m = o.textInput, n = o.element, a = o.dropList.scrollTop(0).css("height", "auto"), p, d = n.val(), j = a.find("li"), g = o._getAllOptionsBeforeFiltered();
            if (g.size() <= 0) {
                return;
            }
            j.removeClass("on");
            if (d !== undefined && d !== "") {
                var b = $.data(n, "allValues");
                if (q.multi) {
                    var h = d.split(q.multiSeparator);
                    for (var c = 0; c < h.length; c++) {
                        var e = b.indexOf(h[c]);
                        if (e > -1) {
                            $(a.find("li").get(e)).addClass("on");
                        }
                    }
                    valueItem = h[0];
                } else {
                    var e = b ? b.indexOf(d) : -1;
                    if (e > -1) {
                        p = $(a.find("li").get(e)).addClass("on");
                    }
                }
            }
            var l = a.parent()
              , k = m.parent();
            if (!q.listAutoWidth) {
                if (q.type === "form") {
                    l.width(this.element.parent().outerWidth() - 20);
                } else {
                    l.width(this.element.parent().outerWidth());
                }
            } else {
                if (q.type === "form") {
                    l.width(a.outerWidth() + 20);
                } else {
                    l.width(a.outerWidth());
                }
            }
            if (q.listMaxHeight != "auto" && a.show().height() > q.listMaxHeight) {
                a.height(q.listMaxHeight).css("overflow-y", "auto");
            }
            var f = k.offset();
            l.css({
                "left": f.left,
                "top": f.top + k.outerHeight()
            });
            a.show();
            if (p) {
                a.scrollTop($(p).offset().top - a.offset().top);
            }
        },
        _toggleLoading: function(a) {
            if (this.options.enable) {}
        },
        _loadData: function(e) {
            var l = this.options
              , d = this.element;
            l.dataSource = e;
            this.dataHasLoaded = true;
            var f = l.textField;
            var g = [];
            if (typeof f === "string") {
                $(e).each(function() {
                    if (f === "text" && !this[f]) {
                        g.push(this["TEXT"]);
                    } else {
                        g.push(this[f]);
                    }
                });
            } else {
                $(e).each(function(m) {
                    g.push(f(this, m));
                });
            }
            $.data(d, "allInputText", g);
            var k = l.valueField;
            var b = [];
            if (typeof k === "string") {
                $(e).each(function() {
                    if (k === "value" && !this[k]) {
                        b.push("" + this["VALUE"]);
                    } else {
                        b.push("" + this[k]);
                    }
                });
            } else {
                $(e).each(function(m) {
                    b.push("" + k(this, m));
                });
            }
            $.data(d, "allValues", b);
            var a = this.dropList.empty();
            if (l.listProvider) {
                var i = l.listProvider(a, e);
            } else {
                var h = l.optionField;
                var c = '<div class="c_list c_list-table c_list-col-1"><ul>';
                var j = this;
                if (typeof h === "string") {
                    $(e).each(function(m) {
                        if (f === "text" && !this[h]) {
                            c += j._wrapText(this["TEXT"]);
                        } else {
                            c += j._wrapText(this[h]);
                        }
                    });
                } else {
                    $(e).each(function(m) {
                        c += j._wrapText(l.optionField(this, m));
                    });
                }
                c += "</ul></div>";
                if (c) {
                    $(c).appendTo(a);
                    a.show().css("height", "auto");
                    if (l.listMaxHeight != "auto" && a.height() > l.listMaxHeight) {
                        a.height(l.listMaxHeight).css("overflow-y", "auto");
                    }
                    a.hide();
                }
            }
            if (l.value) {
                this._setValue("" + l.value);
            }
            this._bindEventsToList();
        },
        _bindEventsToList: function() {
            var b = this
              , a = b._getAllOptionsBeforeFiltered();
            a.mousedown(function() {
                if (!b.options.isCustomList) {
                    b._backfill(this);
                }
            });
        },
        _wrapText: function(a) {
            return '<li><a class="text"><span>' + a + "</span></a></li>";
        },
        _setValue: function(j) {
            var h = this.textInput
              , c = this.element
              , l = this.inputClear;
            var f = true;
            var a = c.val();
            var m = this.options;
            if (j == a) {
                f = false;
            }
            var b = $.data(c, "allValues");
            var e = []
              , k = [];
            if (m.multi) {
                k = j.split(m.multiSeparator);
            } else {
                k.push(j);
            }
            for (var d = 0; d < k.length; d++) {
                var g = b ? b.indexOf(k[d]) : -1;
                if (g > -1) {
                    e.push($.data(c, "allInputText")[g]);
                } else {
                    if (!m.forceSelection) {
                        e.push(j);
                    } else {
                        c.val("");
                        j = "";
                    }
                }
            }
            c.val(j);
            if (m.multi) {
                h.val(e.join(m.multiSeparator));
            } else {
                h.val(e.join(""));
            }
            m.value = j;
            if (m.onValueChange && f) {
                this._trigger("onValueChange", null , h, j, a);
            }
            if (h.val() === "" || h.val() === m.emptyText) {
                l.hide();
            } else {
                l.show();
            }
            this._refeshEmptyText(m.emptyText);
        },
        _findHighlightItem: function() {
            var a = this.dropList;
            var b = a.find("li[class*=on]");
            return b.length > 0 ? b[0] : b;
        },
        _selectPrev: function() {
            var a = this._findHighlightItem();
            var c = this._getAllOptionsAfterFiltered();
            var e = c.index(a);
            var b = $(c[e]);
            if (e === 0) {
                e = c.length;
            } else {
                if (e == -1) {
                    e = c.length;
                }
            }
            var d = $(c[e - 1]);
            this._highLisghtAndScrollTo(b, d);
        },
        _selectNext: function() {
            var c = this.dropList;
            if (c.css("display") == "none") {
                this._showDropList();
                return;
            }
            var d = this._getAllOptionsAfterFiltered().parent();
            var e = d.index(this._findHighlightItem());
            var b = $(d[e]);
            if (e == d.length - 1) {
                e = -1;
            }
            var a = $(d[e + 1]);
            this._highLisghtAndScrollTo(b, a);
        },
        _highLisghtAndScrollTo: function(b, c) {
            var a = this.dropList;
            b.removeClass("om-state-hover");
            c.addClass("om-state-hover");
            if (c.position().top <= 0) {
                a.scrollTop(a.scrollTop() + c.position().top);
            } else {
                if (c.position().top + c.outerHeight() > a.height()) {
                    a.scrollTop(a.scrollTop() + c.position().top + c.outerHeight() - a.height());
                }
            }
        },
        _backfill: function(a) {
            if (a.length === 0) {
                return;
            }
            var j = this
              , d = j.element
              , b = j.dropList
              , k = j.options
              , c = k.multi;
            if (c) {
                $(a).parent().toggleClass("on");
            } else {
                this._getAllOptionsBeforeFiltered().parent().removeClass("on");
                $(a).parent().addClass("on");
            }
            if (b.css("display") == "none") {
                return;
            }
            var h = []
              , g = b.find("li[class*=on]");
            for (var f = 0; f < g.length; f++) {
                var e = this._getAllOptionsBeforeFiltered().parent().index(g[f]);
                if (e > -1) {
                    h.push($.data(d, "allValues")[e]);
                }
            }
            this._setValue(h.join(c ? k.multiSeparator : ""));
            if (!c) {
                b.hide();
            }
        },
        _getAllOptionsBeforeFiltered: function() {
            return this.dropList.find("a");
        },
        _getAllOptionsAfterFiltered: function() {
            var a = this.dropList;
            return a.find("li").not(a.find(".e_hide"));
        },
        _doFilter: function() {
            var a = this
              , e = a.textInput
              , d = a.element
              , b = a.options;
            records = b.dataSource,
            filterStrategy = b.filterStrategy,
            text = e.val(),
            needShow = false,
            items = a._getAllOptionsBeforeFiltered().parent(),
            allInputText = $.data(d, "allInputText");
            $(records).each(function(f) {
                if (a._filetrPass(filterStrategy, text, records[f], allInputText[f])) {
                    $(items.get(f)).removeClass("e_hide");
                    needShow = true;
                } else {
                    $(items.get(f)).addClass("e_hide");
                }
            });
            var c = this.dropList.css("height", "auto");
            if (b.listMaxHeight != "auto" && c.height() > b.listMaxHeight) {
                c.height(b.listMaxHeight).css("overflow-y", "auto");
            }
            if (!needShow) {
                c.hide();
            }
        },
        _filetrPass: function(c, e, a, d) {
            if (e === "") {
                return true;
            }
            if (typeof c === "function") {
                return c(e, a);
            } else {
                if (c === "first") {
                    return d.indexOf(e) === 0;
                } else {
                    if (c === "anywhere") {
                        return d.indexOf(e) > -1;
                    } else {
                        if (c === "last") {
                            var b = d.lastIndexOf(e);
                            return b > -1 && b + e.length == d.length;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        _refeshEmptyText: function(a) {
            var b = this.textInput;
            if (!a) {
                return;
            }
            if (b.val() === "") {
                b.val(a).addClass("default");
            } else {
                if (b.val() === a) {
                    b.val("");
                }
                b.removeClass("default");
            }
        },
        hideList: function() {
            this.dropList.hide();
        }
    });
});
define("ui-flip", function(require, exports, modules) {
    $.aeWidget("ae.aeFlip", {
        options: {
            value: 0,
            degree: 1,
            initType: "html"
        },
        _create: function() {
            var c = this.element
              , b = this.options;
            if (b.initType == "html") {
                this._buildOptions(b, c);
            }
            var a = c.wrap('<span class="e_elements"><span class="e_input e_input-left"><span></span></span></span>').closest(".e_input");
            this.buttonTrigger = $('<span class="e_flip"><button class="e_flipAdd"></button><button class="e_flipReduce"></button></span>').insertBefore(a);
        },
        _init: function() {
            var a = this
              , c = a.element
              , b = a.options;
            a._buildInitEvent();
            b.previousValue = a._getInitValue();
            c.val(this.options.previousValue);
            if (b.width) {
                c.parents(".e_elements").width(b.width);
            }
        },
        _buildOptions: function(a, b) {
            a.value = b.attr("value") || a.value;
            a.degree = b.attr("degree") || a.degree;
            a.minData = b.attr("minData");
            a.maxData = b.attr("maxData");
            a.width = b.attr("width");
        },
        _buildInitEvent: function() {
            var a = this;
            a.element.unbind().bind("change", function() {
                a._justIfNumeric();
            }).bind("input propertychange", function() {
                a._valueChanged();
            });
            a.buttonTrigger.find("button.e_flipAdd").unbind().click(function() {
                a._increase();
            }).next().unbind().click(function() {
                a._decrease();
            });
        },
        _justIfNumeric: function() {
            this._verifyNumeric(this.element.val());
        },
        _verifyNumeric: function(g) {
            var c = this
              , d = this.element
              , f = this.options
              , a = f.previousValue;
            var e = c._checkNumeric(g);
            if (e) {
                e = c._checkNumbericRange(g, f.minData, f.maxData);
            } else {
                $.aries.messagebox.alert("", "", "The value is not a number or beyond the range of data set!");
                var b = c._checkNumeric(a);
                b ? d.val(a) : d.val(c._getInitValue());
                return;
            }
            f.previousValue = g;
        },
        _valueChanged: function() {
            var b = this
              , c = this.element
              , e = this.options
              , a = e.previousValue
              , d = c.val();
            if (d == a) {
                return;
            }
            if (d) {
                if (d.lastIndexOf(".") == d.length - 1) {
                    d = d.substring(0, d.length - 1);
                }
                b._verifyNumeric(d);
            }
        },
        _increase: function() {
            var h = this
              , a = this.element
              , g = this.options
              , c = g.degree
              , j = g.previousValue
              , s = a.val();
            var q = h._checkNumeric(s);
            if (!q) {
                var e = h._checkNumeric(j);
                e ? a.val(j) : a.val(h._getInitValue());
                return;
            }
            var k = s.indexOf(".");
            var f = (c + "").indexOf(".");
            var l = s.length;
            var n = (c + "").length;
            var b = k > -1 || f > -1;
            s = b ? (parseFloat(s, 10) + parseFloat(c, 10)) : (parseInt(s, 10) + parseInt(c, 10));
            var r = h._checkNumbericRange(s, g.minData, g.maxData);
            if (!r) {
                s = b ? (parseFloat(s, 10) - parseFloat(c, 10)) : (parseInt(s, 10) - parseInt(c, 10));
            }
            if (b) {
                if (k == -1) {
                    k = l;
                }
                if (f == -1) {
                    f = n;
                }
                var p = l - k;
                var m = n - f;
                if (m < p) {
                    m = p;
                }
                var d = "0.";
                m = m - 1;
                for (var o = 0; o < m; o++) {
                    d += "0";
                }
                s = $.format.number(s, d);
            }
            g.previousValue = s;
            a.val(s);
        },
        _decrease: function() {
            var h = this
              , a = this.element
              , g = this.options
              , c = g.degree
              , j = g.previousValue
              , s = a.val();
            var q = h._checkNumeric(s);
            if (!q) {
                var e = h._checkNumeric(j);
                e ? a.val(j) : a.val(h._getInitValue());
                return;
            }
            var k = s.indexOf(".");
            var f = (c + "").indexOf(".");
            var l = s.length;
            var n = (c + "").length;
            var b = k > -1 || f > -1;
            if (b) {
                s = (parseFloat(s, 10) - parseFloat(c, 10));
            } else {
                s = (parseInt(s, 10) - parseInt(c, 10));
            }
            var r = h._checkNumbericRange(s, g.minData, g.maxData);
            if (!r) {
                s = b ? (parseFloat(s, 10) + parseFloat(c, 10)) : (parseInt(s, 10) + parseInt(c, 10));
            }
            if (b) {
                if (k == -1) {
                    k = l;
                }
                if (f == -1) {
                    f = n;
                }
                var p = l - k;
                var m = n - f;
                if (m < p) {
                    m = p;
                }
                var d = "0.";
                m = m - 1;
                for (var o = 0; o < m; o++) {
                    d += "0";
                }
                s = $.format.number(s, d);
            }
            g.previousValue = s;
            a.val(s);
        },
        _getInitValue: function() {
            var b = this
              , a = this.options.value;
            var c = b._checkNumeric(a);
            if (c) {
                c = b._checkNumbericRange(a, this.options.minData, this.options.maxData);
                if (!c) {
                    a = "";
                }
            } else {
                a = "";
            }
            return a;
        },
        _checkNumeric: function(c, b) {
            if ("" != c && !/^(-|\+)?\d+(\.\d+)?$/.test(c)) {
                return false;
            }
            if ("" != c && b && $.isString(b) && b.indexOf(".") != -1 && c) {
                var a = parseFloat(c);
                if (a < 0) {
                    a = -a;
                }
                a = a.toString();
                if (a.indexOf(".") != -1 && (b.length - b.indexOf(".") < a.length - a.indexOf("."))) {
                    return false;
                }
            }
            return true;
        },
        _checkNumbericRange: function(c, b, a) {
            if (c != undefined && b != undefined && (parseFloat(c) < parseFloat(b))) {
                return false;
            }
            if (c != undefined && a != undefined && (parseFloat(c) > parseFloat(a))) {
                return false;
            }
            return true;
        }
    });
});
define("ui-radio", function(require, exports, moudles) {
    $.aeWidget("ae.aeRadio", {
        options: {
            enable: true,
            visible: true,
            labelField: "text",
            valueField: "value",
            initType: "html"
        },
        _create: function() {
            var a = this.options
              , b = this.element;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            b.hide();
            this.dropList = $('<div class="c_fn"><ul></ul></div>').insertAfter(b);
        },
        _init: function() {
            var a = this
              , c = a.options
              , d = a.element;
            if (c.radioCol) {
                a.dropList.addClass("c_fn-col-" + c.radioCol);
            }
            if (c.labelLength) {
                a.dropList.addClass("c_fn-label-" + c.labelLength);
            }
            if (!c.visible) {
                this.element.parents(".li").hide();
            }
            if (!c.enable) {
                var b = $.data(this.element, "delay");
                if (b) {
                    clearTimeout(b);
                }
                b = setTimeout(function() {
                    a.enable(false);
                }, 200);
                $.data(this.element, "delay", b);
            }
            if (c.type === "form") {
                if (c.uiid) {
                    d.removeAttr("uiid");
                }
            } else {
                c.uiid ? d.attr("uiid", c.uiid) : d.attr("uiid", d.attr("id"));
            }
            c.aeType ? d.attr("aeType", c.aeType) : d.attr("aeType", "aeRadio");
        },
        _buildOptions: function(b, c) {
            b.radioCol = c.attr("radioCol");
            b.labelLength = c.attr("labelLength");
            b.enable = c.attr("enable") == "false" ? false : b.enable;
            b.visible = c.attr("visible") == "false" ? false : b.visible;
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            b.labelField = c.attr("labelField") || b.labelField;
            b.valueField = c.attr("valueField") || b.valueField;
            var a = c.attr("onSelect");
            b.onSelect = a ? function(g) {
                if ($.isString(a)) {
                    var e = a.indexOf("(");
                    var d = e > 0 ? a.substring(0, e) : a;
                    var f = "return window." + d + "?" + d + ".call(window,e):false;";
                    return new Function("e",f)(g);
                }
            }
             : b.onSelect;
        },
        _buildEvent: function() {
            var b = this
              , a = b._getAllOptions()
              , c = b.options.onSelect;
            a.bind("click.aeRadio", function(d) {
                c && b._trigger("onSelect", null , d);
            });
        },
        getValue: function() {
            var b = this._getAllOptions()
              , a = [];
            b.each(function(c, d) {
                if ($.prop(d, "checked")) {
                    a.push("" + $(d).val());
                }
            });
            return a.join("");
        },
        setValue: function(b) {
            if (typeof b === "undefined" || b === "" || b == null ) {
                return;
            }
            var a = this._getAllOptions();
            a.each(function(c, d) {
                if ($(d).val() === b && !$.attr(d, "disabled")) {
                    $.prop(d, "checked", true);
                }
            });
        },
        clear: function() {
            this._getAllOptions().removeAttr("checked");
        },
        reload: function(a) {
            this._loadData(a);
        },
        enable: function(e) {
            if (e === undefined) {
                e = true;
            }
            var b = this
              , d = b.options
              , c = d.enable
              , a = b._getAllOptions();
            if (e === true || e === "true") {
                a.removeAttr("disabled").unbind();
                c = true;
            }
            if (e === false || e === "false") {
                a.attr("disabled", true).unbind();
                c = false;
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        _loadData: function(c) {
            var b = this
              , a = ""
              , d = b.dropList.find("ul");
            d.empty();
            $(c).each(function(e, f) {
                a += b._wrapText(f);
            });
            $(a).appendTo(d);
            b._buildEvent();
        },
        _getAllOptions: function() {
            return this.dropList.find(".e_radio");
        },
        _wrapText: function(a) {
            return '<li><label><input type="radio" class="e_radio" name="' + a.name + '" value="' + a[this.options.valueField] + '" ' + (a.checked ? a.checked : "") + " " + (a.disabled ? a.disabled : "") + "/>" + a[this.options.labelField] + "</label></li>";
        }
    });
});
define("ui-search", function(require, exports, moudles) {
    $.aeWidget("ae.aeSearch", {
        options: {
            enable: true,
            onlyRead: false,
            minChars: 1,
            delay: 500,
            cacheSize: 10,
            method: "POST",
            listMaxHeight: 300,
            queryName: "key",
            crossDomain: false,
            preProcess: function(b, a) {
                return a;
            },
            onBeforeSuggest: function(b, a) {},
            onSuggesting: function(b, a) {},
            onSuccess: function(b, c, a) {},
            onError: function(c, d, a, b) {},
            onSelect: function(c, d, a, b) {},
            initType: "html"
        },
        _create: function() {
            var b = this.element
              , a = this.options;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            b.wrap('<span class="e_elements"><span class="e_input e_input-left"><span></span></span></span>');
            this.dropList = $($('<div class="c_combox"><div class="c_comboxContent"></div></div>').css({
                position: "absolute",
                zIndex: 2000
            }).appendTo(document.body).children().first()).hide();
        },
        _buildOptions: function(i, b) {
            if (b.attr("cacheSize")) {
                i.cacheSize = parseInt(b.attr("cacheSize"));
            }
            i.delay = parseInt(b.attr("delay")) || i.delay;
            i.enable = b.attr("enable") == "false" ? false : i.enable;
            i.onlyRead = b.attr("onlyRead") == "true" ? true : i.onlyRead;
            i.listMaxHeight = parseInt(b.attr("listMaxHeight")) || i.listMaxHeight;
            i.listWidth = parseInt(b.attr("listWidth"));
            i.minChars = parseInt(b.attr("minChars")) || i.minChars;
            i.queryName = b.attr("queryName") || i.queryName;
            i.dataSource = b.attr("dataSource");
            var h = b.attr("clientFormatter");
            var a = b.attr("preProcess");
            var g = b.attr("onBeforeSuggest");
            var d = b.attr("onSuggesting");
            var f = b.attr("onSelect");
            var e = b.attr("onSuccess");
            var c = b.attr("onError");
            this._buildOptionsEvent(i, "clientFormatter", h);
            this._buildOptionsEvent(i, "preProcess", a);
            this._buildOptionsEvent(i, "onBeforeSuggest", g);
            this._buildOptionsEvent(i, "onSuggesting", d);
            i.onSelect = f ? function(p, o, j, n) {
                if ($.isString(f)) {
                    var l = f.indexOf("(");
                    var k = l > 0 ? f.substring(0, l) : f;
                    var m = "return window." + k + "?" + k + ".call(window, t ,r , i , e):false;";
                    return new Function("t","r","i","e",m)(p, o, j, n);
                }
            }
             : i.onSelect;
            i.onSuccess = e ? function(n, o, m) {
                if ($.isString(e)) {
                    var k = e.indexOf("(");
                    var j = k > 0 ? e.substring(0, k) : e;
                    var l = "return window." + j + "?" + j + ".call(window, d ,t ,e):false;";
                    return new Function("d","t","e",l)(n, o, m);
                }
            }
             : i.onSuccess;
            i.onError = c ? function(o, p, j, n) {
                if ($.isString(c)) {
                    var l = c.indexOf("(");
                    var k = l > 0 ? c.substring(0, l) : c;
                    var m = "return window." + k + "?" + k + ".call(window, c ,i ,er ,e):false;";
                    return new Function("c","i","er","e",m)(o, p, j, n);
                }
            }
             : i.onError;
        },
        _buildOptionsEvent: function(a, c, b) {
            a[c] = b ? function(h, g) {
                if ($.isString(b)) {
                    var e = b.indexOf("(");
                    var d = e > 0 ? b.substring(0, e) : b;
                    var f = "return window." + d + "?" + d + ".call(window,p1,p2):false;";
                    return new Function("p1","p2",f)(h, g);
                }
            }
             : a[c];
        },
        _init: function() {
            var a = this
              , b = this.options
              , d = this.element
              , c = this.dropList;
            if (b.minChars < 0) {
                b.minChars = 0;
            }
            if (b.cacheSize < 0) {
                b.cacheSize = 0;
            }
            if (b.delay < 0) {
                b.delay = 0;
            }
            !b.enable ? a.disable() : a.enable();
            b.onlyRead ? d.attr("readonly", "readonly") : d.removeAttr("readonly");
            d.focus(function() {
                $(".c_comboxContent").hide();
                $(".c_option").css("visibility", "hidden");
            }).blur(function() {}).keydown(function(f) {
                if (f.keyCode == $.ae.keyCode.TAB) {
                    c.hide();
                }
            }).keyup(function(h) {
                var g = h.keyCode
                  , i = $.ae.keyCode;
                switch (g) {
                case i.DOWN:
                    if (c.css("display") !== "none") {
                        a._selectNext();
                    } else {
                        if (c.find("a").size() > 0) {
                            c.show();
                        }
                    }
                    break;
                case i.UP:
                    if (c.css("display") !== "none") {
                        a._selectPrev();
                    } else {
                        if (c.find("a").size() > 0) {
                            c.show();
                        }
                    }
                    break;
                case i.ENTER:
                    if (c.css("display") === "none") {
                        return;
                    }
                    c.hide();
                    a._triggerOnSelect(h);
                    return false;
                case i.ESCAPE:
                    c.hide();
                    break;
                case i.TAB:
                    break;
                default:
                    if (!b.enable || b.onlyRead) {
                        return false;
                    }
                    if (b.delay > 0) {
                        var f = $.data(d, "delayTimer");
                        if (f) {
                            clearTimeout(f);
                        }
                        f = setTimeout(function() {
                            a._suggest();
                        }, b.delay);
                        $.data(d, "delayTimer", f);
                    } else {
                        a._suggest();
                    }
                }
            }).mousedown(function(f) {
                f.stopPropagation();
            });
            c.mousedown(function(f) {
                f.stopPropagation();
            });
            $(document).bind("mousedown.aeSearch", this.globalEvent = function() {
                c.hide();
            }
            );
        },
        clearCache: function() {
            $.removeData(this.element, "cache");
        },
        showMessage: function(c) {
            var d = this.element;
            var b = this.dropList.empty().css("height", "auto");
            $("<div>" + c + "<div>").appendTo(b);
            b.parent().css("left", d.parent().offset().left).css("top", d.offset().top + d.outerHeight());
            var e = this.options.listWidth;
            if (!e) {
                b.parent().width(d.parent().outerWidth());
            } else {
                if (e !== "auto") {
                    b.parent().width(e);
                }
            }
            b.show();
            var a = this.options.listMaxHeight;
            if (a !== "auto") {
                if (b.height() > a) {
                    b.height(a).css("overflow", "auto");
                }
            }
            return this;
        },
        disable: function() {
            this.options.enable = false;
            this.element.attr("disabled", "disabled").parent().parent().addClass("e_dis");
        },
        enable: function() {
            this.options.enable = true;
            this.element.removeAttr("disabled").parent().parent().removeClass("e_dis");
        },
        reload: function(b) {
            var a = this.options;
            if (b) {
                a.dataSource = b;
            }
            if (a.cacheSize > 0) {
                this.clearCache();
            }
        },
        getData: function() {
            var a = $.data(this.element, "records");
            return a || null ;
        },
        getDropList: function() {
            return this.dropList;
        },
        destroy: function() {
            $(document).unbind("mousedown.aeSearch", this.globalEvent);
            this.dropList.parent().remove();
        },
        _clear: function() {
            this.element.val("");
            return this.dropList.find("li").removeClass("on");
        },
        _selectNext: function() {
            var b = this.dropList
              , a = b.find(".on").index()
              , c = this._clear();
            a += 1;
            if (a >= c.size()) {
                a = 0;
            }
            this._scrollToAndSelect(c, a, b);
        },
        _selectPrev: function() {
            var b = this.dropList
              , a = b.find(".on").index()
              , c = this._clear();
            a -= 1;
            if (a < 0) {
                a = c.size() - 1;
            }
            this._scrollToAndSelect(c, a, b);
        },
        _scrollToAndSelect: function(d, a, c) {
            if (d.size() < 1) {
                return;
            }
            var e = $(d.get(a)).addClass("on");
            var b = e.position().top;
            if (b <= 0) {
                c.scrollTop(c.scrollTop() + b);
            } else {
                var f = b + e.outerHeight() - c.height();
                if (f > 0) {
                    c.scrollTop(c.scrollTop() + f);
                }
            }
            this._select(a);
        },
        _select: function(b) {
            var d = this.element;
            var a = $.data(d, "records");
            var c, e;
            if (a.valueField) {
                c = a.data[b];
                e = c[a.valueField];
            } else {
                c = a[b];
                e = c;
            }
            d.val(e);
            $.data(d, "lastStr", e);
        },
        _suggest: function() {
            var e = this.element;
            var g = e.val();
            var f = $.data(e, "lastStr");
            if (f && f === g) {
                return;
            }
            $.data(e, "lastStr", g);
            var i = this.options;
            var a = $.data(e, "cache");
            if (g.length > 0 && g.length >= i.minChars) {
                if (a) {
                    var c = a[g];
                    if (c) {
                        $.data(e, "records", c);
                        this._buildDropList(c, g);
                        return;
                    }
                }
                if (i.onBeforeSuggest) {
                    if (this._trigger("onBeforeSuggest", null , g) === false) {
                        this.dropList.empty().hide();
                        return;
                    }
                }
                var h = this;
                var b = '{"' + i.queryName + '":"' + g + '"}';
                $.aries.ajax.post(i.dataSource, b, function(p, r) {
                    var q = i.onSuccess;
                    if (q && h._trigger("onSuccess", null , p, r) === false) {
                        return;
                    }
                    var n = i.preProcess;
                    if (n) {
                        p = n(g, p);
                    }
                    if ($.isEmptyObject(p)) {
                        p = [];
                    }
                    if (i.cacheSize > 0) {
                        var l = $.data(e, "cache") || {
                            ___keys: []
                        };
                        var o = l.___keys;
                        if (o.length == i.cacheSize) {
                            var j = o[0];
                            l.___keys = o.slice(1);
                            l[j] = undefined;
                        }
                        l[g] = p;
                        l.___keys.push(g);
                        $.data(e, "cache", l);
                    }
                    $.data(e, "records", p);
                    var m = $.data(e, "delay");
                    if (m) {
                        clearTimeout(m);
                    }
                    m = setTimeout(function() {
                        h._buildDropList(p, g);
                    }, 100);
                    $.data(e, "delay", m);
                }, function(l, m, j) {
                    var k = i.onError;
                    if (k) {
                        h._trigger("onError", null , l, m, j);
                    }
                }, $.extend({}, {
                    type: i.method,
                    dataType: i.crossDomain ? "jsonp" : "json"
                }));
                var d = i.onSuggesting;
                if (d) {
                    h._trigger("onSuggesting", null , g);
                }
            } else {
                this.dropList.empty().hide();
            }
        },
        _buildDropList: function(c, j) {
            var i = this.element
              , a = this.dropList.empty().css("height", "auto")
              , e = c.valueField ? false : true
              , k = this.options.clientFormatter
              , l = this
              , b = '<div class="c_list c_list-table c_list-col-1"><ul>';
            if (e) {
                if (k) {
                    $(c).each(function(m) {
                        b += l._addRow(k(this, m));
                    });
                } else {
                    $(c).each(function(m) {
                        b += l._addRow(this);
                    });
                }
            } else {
                if (k) {
                    $(c.data).each(function(m) {
                        b += l._addRow(k(this, m));
                    });
                }
            }
            b += "</ul></div>";
            if (b) {
                $(b).appendTo(a);
            }
            var h = a.find("a")
              , f = a.find("li");
            if (h.size() > 0) {
                a.parent().css("left", parseInt(i.parent().offset().left)).css("top", i.offset().top + i.outerHeight());
                var g = this.options.listWidth;
                if (!g) {
                    a.parent().width(i.parents(".e_input").outerWidth());
                } else {
                    if (g !== "auto") {
                        a.parent().width(g);
                    }
                }
                f.mouseover(function() {
                    f.removeClass("on");
                    $(this).addClass("on");
                }).mousedown(function(n) {
                    var m = a.find(".on").index();
                    l._select(m);
                    a.hide();
                    l._triggerOnSelect(n);
                });
                a.show();
                var d = this.options.listMaxHeight;
                if (d !== "auto") {
                    if (a.height() > d) {
                        a.height(d).css("overflow", "auto");
                    }
                }
                a.scrollTop(0);
            }
        },
        _addRow: function(a) {
            return '<li><a class="text"><span>' + a + "</span></a></li>";
        },
        _triggerOnSelect: function(d) {
            var c = this.options.onSelect;
            if (c) {
                var b = this.dropList.find(".on").index();
                if (b < 0) {
                    return;
                }
                var a = $.data(this.element, "records"), e, f;
                if (a.valueField) {
                    e = a.data[b];
                    f = e[a.valueField];
                } else {
                    e = a[b];
                    f = e;
                }
                this._trigger("onSelect", d, e, f, b);
            }
        }
    });
});
define("ui-textarea", function(require, exports, moudles) {
    $.aeWidget("ae.aeTextarea", {
        options: {
            enable: true,
            editable: true,
            visible: true,
            initType: "html"
        },
        _create: function() {
            var b = this.options
              , d = this.element;
            if (b.initType == "html") {
                this._buildOptions(b, d);
            }
            var c = $("<textarea></textarea>");
            c.attr({
                "aeType": d.attr("aeType"),
                "label": d.attr("label"),
                "id": d.attr("id"),
                "dataField": d.attr("dataField")
            });
            this.element = c;
            d.after(c);
            d.empty().hide();
            var a = $('<span class="e_textareaContent"></span>').insertAfter(c).wrapInner(c).wrap('<span class="e_textarea"></span>');
            $('<span class="e_textareaTop"><span></span></span>').insertBefore(a);
            $('<span class="e_textareaBottom"><span></span></span>').insertAfter(a);
        },
        _init: function() {
            var a = this
              , b = this.options
              , c = this.element;
            if (!b.visible) {
                c.parents(".li").hide();
            }
            if (b.width) {
                c.parents(".e_textarea").width(b.width);
            }
            if (b.height) {
                c.height(b.height);
            }
            !b.enable ? a.enable(false) : a.enable(true);
            !b.editable ? c.attr("readonly", "readOnly") : c.removeAttr("readonly");
            if (b.type === "form") {
                if (b.uiid) {
                    c.removeAttr("uiid");
                }
            } else {
                b.uiid ? c.attr("uiid", b.uiid) : c.attr("uiid", c.attr("id"));
            }
            b.aeType ? c.attr("aeType", b.aeType) : c.attr("aeType", "aeTextarea");
        },
        _buildOptions: function(a, b) {
            a.visible = b.attr("visible") == "false" ? false : a.visible;
            a.enable = b.attr("enable") == "false" ? false : a.enable;
            a.editable = b.attr("editable") == "false" ? false : a.editable;
            a.aeType = b.attr("aeType");
            a.uiid = b.attr("uiid");
            a.width = parseInt(b.attr("width"));
            a.height = parseInt(b.attr("height"));
        },
        enable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                c.removeAttr("disabled").unbind();
                a = true;
                c.parent().parent().removeClass("e_dis").unbind();
            }
            if (b === false || b === "false") {
                c.attr("disabled", true).unbind();
                a = false;
                c.parent().parent().addClass("e_dis").unbind();
            }
        },
        editable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                c.removeAttr("readonly").unbind();
                a = true;
            }
            if (b === false || b === "false") {
                c.attr("readonly", "readOnly").unbind();
                a = false;
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        getValue: function() {
            var a = this.element.val();
            return a ? a : "";
        },
        setValue: function(a) {
            if (typeof a === "undefined" || a === "") {
                this.element.val("");
            } else {
                this.element.val(a);
            }
        },
        clear: function() {
            this.element.val("").focus();
        }
    });
});
define("ui-textfield", function(require, exports, moudles) {
    $.aeWidget("ae.aeTextfield", {
        options: {
            enable: true,
            editable: true,
            visible: true,
            showClear: false,
            initType: "html"
        },
        _create: function() {
            var a = this
              , b = a.options
              , c = a.element;
            if (b.initType == "html") {
                this._buildOptions(b, c);
            }
            c.wrap('<span class="e_elements"><span class="e_input"><span></span></span></span>');
            this.inputClear = $('<a class="e_inputClear"></a>').insertBefore(c.parent()).hide();
        },
        _init: function() {
            var a = this
              , c = this.options
              , e = this.element
              , d = a.inputClear
              , b = c.onValueChange;
            if (!c.visible) {
                e.parents(".li").hide();
            }
            if (c.width) {
                e.parents(".e_elements").width(c.width);
            }
            if (c.password) {
                e.attr("type", "password");
            }
            !c.enable ? a.enable(false) : a.enable(true);
            !c.editable ? e.attr("readonly", "readOnly") : e.removeAttr("readonly");
            if (c.type === "form") {
                if (c.uiid) {
                    e.removeAttr("uiid");
                }
            } else {
                c.uiid ? e.attr("uiid", c.uiid) : e.attr("uiid", e.attr("id"));
            }
            c.aeType ? e.attr("aeType", c.aeType) : e.attr("aeType", "aeTextfield");
            if (c.showClear) {
                e.bind("input propertychange", function(f) {
                    if (e.val() !== "") {
                        d.show();
                    }
                    if (b) {
                        b && a._trigger("onValueChange", null , f);
                    }
                });
                d.click(function() {
                    e.val("");
                    d.hide();
                });
            }
        },
        _buildOptions: function(b, c) {
            b.visible = c.attr("visible") == "false" ? false : b.visible;
            b.enable = c.attr("enable") == "false" ? false : b.enable;
            b.editable = c.attr("editable") == "false" ? false : b.editable;
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            b.width = parseInt(c.attr("width"));
            b.showClear = c.attr("showClear") == "true" ? true : b.showClear;
            b.password = c.attr("password") == "true" ? true : b.password;
            var a = c.attr("onValueChange");
            b.onValueChange = a ? function(g) {
                if ($.isString(a)) {
                    var e = a.indexOf("(");
                    var d = e > 0 ? a.substring(0, e) : a;
                    var f = "return window." + d + "?" + d + ".call(window,e):false;";
                    return new Function("e",f)(g);
                }
            }
             : "";
        },
        enable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                c.removeAttr("disabled").unbind();
                a = true;
                c.parent().parent().removeClass("e_dis").unbind();
            }
            if (b === false || b === "false") {
                c.attr("disabled", true).unbind();
                a = false;
                c.parent().parent().addClass("e_dis").unbind();
            }
        },
        editable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                c.removeAttr("readonly").unbind();
                a = true;
            }
            if (b === false || b === "false") {
                c.attr("readonly", "readOnly").unbind();
                a = false;
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var b = this.element;
            if (a === true || a === "true") {
                b.parents(".li").show();
            }
            if (a === false || a === "false") {
                b.parents(".li").hide();
            }
        },
        getValue: function() {
            var a = this.element.val();
            return a ? a : "";
        },
        setValue: function(a) {
            if (typeof a === "undefined" || a === "") {
                this.element.val("");
            } else {
                this.element.val(a);
                if (this.options.showClear) {
                    this.inputClear.show();
                }
            }
        },
        clear: function() {
            this.element.val("").focus();
            if (this.options.showClear) {
                this.inputClear.hide();
            }
        }
    });
});
define("ui-textpopup", function(require, exports, moudles) {
    $.aeWidget("ae.aeTextpopup", {
        options: {
            enable: true,
            editable: true,
            visible: true,
            draggable: false,
            resizable: false,
            popupWidth: "600",
            popupHeight: "auto",
            showFlush: false,
            showClose: true,
            showMinMax: false,
            modal: true,
            initType: "html"
        },
        enable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                a = true;
                c.attr("disabled", false).parent().parent().removeClass("e_dis").unbind().prev().removeClass("e_dis").unbind().click(function() {
                    c.trigger("click");
                });
            }
            if (b === false || b === "false") {
                a = false;
                c.attr("disabled", true).parent().parent().addClass("e_dis").unbind().prev().addClass("e_dis").unbind();
            }
        },
        editable: function(b) {
            if (b === undefined) {
                b = true;
            }
            var c = this.element
              , a = this.options.enable;
            if (b === true || b === "true") {
                c.removeAttr("readonly").unbind();
                a = true;
            }
            if (b === false || b === "false") {
                c.attr("readonly", "readOnly").unbind();
                a = false;
            }
        },
        visible: function(a) {
            if (a === undefined) {
                a = true;
            }
            var c = this.element
              , b = this.options.visible;
            if (a === true || a === "true") {
                c.parents(".li").show();
                b = true;
            }
            if (a === false || a === "false") {
                c.parents(".li").hide();
                b = false;
            }
        },
        clear: function() {
            this.element.val("").focus();
        },
        getDisplayText: function() {
            var a = this.element.val();
            return a ? a : "";
        },
        getValue: function() {
            var a = this.element.attr("valueField");
            return a ? a : "";
        },
        setValue: function(a) {
            if (typeof a !== "undefined" || a !== "") {
                this.element.attr("valueField", a);
            }
        },
        setDisplayText: function(a) {
            if (typeof a === "undefined" || a === "") {
                this.element.val("");
            } else {
                this.element.val(a);
            }
        },
        _create: function() {
            var c = this.element
              , b = this.options;
            if (b.initType == "html") {
                this._buildOptions(b, c);
            }
            var a = c.wrap('<span class="e_elements"><span class="e_input e_input-left"><span></span></span></span>').closest(".e_input");
            a.before('<button type="button" class="e_button-right"><i class="e_ico-check"></i><span></span></button>');
        },
        _init: function() {
            var a = this
              , c = this.element
              , b = this.options;
            a._bindEvent();
            if (!b.visible) {
                c.parents(".li").hide();
            }
            if (b.width) {
                c.parents(".e_elements").width(b.width);
            }
            !b.enable ? a.enable(false) : a.enable(true);
            !b.editable ? c.attr("readonly", "readOnly") : c.removeAttr("readonly");
            if (b.type === "form") {
                if (b.uiid) {
                    c.removeAttr("uiid");
                }
            } else {
                b.uiid ? c.attr("uiid", b.uiid) : c.attr("uiid", c.attr("id"));
            }
            b.aeType ? c.attr("aeType", b.aeType) : c.attr("aeType", "aePopup");
        },
        _buildOptions: function(b, c) {
            b.enable = c.attr("enable") == "false" ? false : b.enable;
            b.editable = c.attr("editable") == "false" ? false : b.editable;
            b.visible = c.attr("visible") == "false" ? false : b.visible;
            b.draggable = c.attr("draggable") == "true" ? true : b.draggable;
            b.resizable = c.attr("resizable") == "true" ? true : b.resizable;
            b.popupWidth = parseInt(c.attr("popupWidth")) || b.popupWidth;
            b.popupHeight = parseInt(c.attr("popupHeight")) || b.popupHeight;
            b.showMinMax = c.attr("showMinMax") == "true" ? true : b.showMinMax;
            b.showClose = c.attr("showClose") == "false" ? false : b.showClose;
            b.popupTitle = $.evalI18nString(c.attr("popupTitle"));
            b.popupSource = c.attr("popupSource");
            b.popupType = c.attr("popupType");
            b.modal = c.attr("modal") == "false" ? false : b.modal;
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            b.width = c.attr("width");
            if (b.popupType === "page") {
                b.showFlush = c.attr("showFlush") == "true" ? true : b.showFlush;
            }
            var a = c.attr("initAfterAction");
            b.initAfterAction = a ? function() {
                if ($.isString(a)) {
                    var e = a.indexOf("(");
                    var d = e > 0 ? a.substring(0, e) : a;
                    var f = "return window." + d + "?" + d + ".call(window):false;";
                    return new Function(f)();
                }
            }
             : "";
        },
        _bindEvent: function() {
            var b = this
              , c = b.options
              , a = c.initAfterAction;
            this.element.unbind("click.aePopup").bind("click.aePopup", function() {
                var d = {
                    autoOpen: true,
                    modal: c.modal,
                    draggable: c.draggable,
                    resizable: c.resizable,
                    showFlush: c.showFlush,
                    showClose: c.showClose,
                    showMinMax: c.showMinMax,
                    width: c.popupWidth,
                    height: c.popupHeight,
                    title: c.popupTitle,
                    popupType: c.popupType,
                    onClose: function() {
                        $.aries.page.data._removeHidedData("ae_textPopup_Id");
                    }
                };
                if (c.popupSource) {
                    if (c.popupType === "page") {
                        $.ajax(c.popupSource, {
                            cache: false,
                            success: function(f, g, e) {
                                $('<div id="ae_popup_div"></div>').appendTo("body");
                                $("#ae_popup_div").html(f);
                                $("#ae_popup_div").aeDialog(d);
                                $.aries.page.data._setHidedData("ae_textPopup_Id", b.element.attr("id"));
                                $.aries.common.globalInit();
                            },
                            error: function(e, g, f) {}
                        });
                    }
                    if (c.popupType === "div") {
                        a && b._trigger("initAfterAction");
                        $.aries.page.data._setHidedData("ae_textPopup_Id", c.popupSource);
                        $("#" + c.popupSource).attr("elementId", b.element.attr("id"));
                        $("#" + c.popupSource).aeDialog(d);
                    }
                }
            }).parent().parent().prev().unbind().click(function() {
                b.element.trigger("click");
            });
        }
    });
    $.extend($.ae.aeTextpopup, {
        closePopup: function(j, b, k) {
            var g, d;
            var h = $.aries.page.data._getHidedData("ae_textPopup_Id");
            if (!h) {
                return;
            }
            if ($("#ae_popup_div").length > 0) {
                $("#ae_popup_div").aeDialog("close");
                g = $("#" + h).attr("afterAction");
                d = $("#" + h);
            } else {
                $("#" + h).aeDialog("close");
                var f = $("#" + h).attr("elementId");
                if (f) {
                    d = $("#" + f);
                    g = d.attr("afterAction");
                }
            }
            if (j) {
                if (g) {
                    var e = g.indexOf("(");
                    var c = e > 0 ? g.substring(0, e) : g;
                    var a = "return window." + c + "?" + c + ".call(window,j):false;";
                    new Function("j",a)(j);
                } else {
                    if (b) {
                        d.val(j[b]);
                    }
                    if (k) {
                        d.attr("valueField", j[k]);
                    }
                }
            }
        }
    });
    $.closeTextPopup = $.ae.aeTextpopup.closePopup;
});
define("ui-irguide", function(require, exports, moudles) {
    $.aeWidget("ae.aeIrguide", {
        options: {
            initial: false,
            title: "",
            width: 600,
            height: "auto",
            button: false,
            initType: "html"
        },
        _create: function() {
            var c = this
              , d = this.options
              , g = this.element;
            if (d.initial == true) {
                return;
            }
            if (d.initType == "html") {
                this._buildOptions(d, g);
            }
            d.aeType ? g.attr("aeType", d.aeType) : g.attr("aeType", "aeIrguide");
            d.uiid ? g.attr("uiid", d.uiid) : g.attr("uiid", g.attr("id"));
            g.addClass("c_guide");
            g.find("ul:first").wrap('<div class="c_guideStep"></div>');
            var a = d.height - 105 + "px";
            g.find(".c_guideStep:first").after('<div class="c_guideContent" style="height:' + a + '"></div>').after('<div class="c_guideShadow"></div>');
            if (d.button == true) {
                var b = '<div class="c_submit">' + '<button class="e_button-page"><span>确定</span></button>' + '<button class="e_button-page e_button-page-cancel"><span>取消</span></button>' + "</div>";
                g.find(".c_guideContent:first").after(b);
                g.find(".c_guideContent:first").next(".c_submit:first").children("button:first").click(function() {
                    $("#" + d.id).aeIrguide("prev");
                });
                g.find(".c_guideContent:first").next(".c_submit:first").children("button:last").click(function() {
                    $("#" + d.id).aeIrguide("prev", true);
                });
            }
            var f = g.find("ul:first li");
            var e = g.find(".c_guideContent:first");
            d.totalSteps = f.length;
            d.historyStep = new Array();
            f.each(function(j, k) {
                var l = $(k).attr("stepId");
                var i = $(k).attr("stepSrc");
                if (l) {
                    $("#" + l).wrap('<div class="c_guideWrapper"></div>');
                    var m = $("#" + l).parent(".c_guideWrapper:first");
                    d.historyStep[j] = m.html();
                    m.appendTo(e);
                } else {
                    if (i) {
                        var h = g.attr("id") + "_irGuideStep_" + j;
                        e.append('<div id="' + h + '" class="c_guideWrapper"></div>');
                        d.historyStep[j] = i;
                    } else {
                        e.append('<div class="c_guideWrapper"></div>');
                        d.historyStep[j] = '<div class="c_guideWrapper"></div>';
                    }
                }
            });
            d.initial = true;
        },
        _init: function() {
            var a = this
              , b = a.options
              , c = a.element;
            b.active = 0;
            c.find(".c_guideContent:first").children(".c_guideWrapper").each(function(d, e) {
                $(e).empty().hide();
            });
            c.find("ul:first li").each(function(d, e) {
                if (d == 0) {
                    $(e).addClass("first active").removeClass("disable");
                } else {
                    if (d == b.totalSteps - 1) {
                        $(e).addClass("last e_hide");
                    } else {
                        $(e).addClass("e_hide").removeClass("active disable");
                    }
                }
            });
        },
        _buildOptions: function(a, b) {
            a.id = b.attr("id");
            a.title = b.attr("title");
            a.button = b.attr("button") == "true" ? true : a.button;
            a.width = b.attr("width") || a.width;
            a.height = b.attr("height") || a.height;
            a.aeType = b.attr("aeType");
            a.uiid = b.attr("uiid");
            this._buildOptionEvent(a, "onBeforeStart", b.attr("onBeforeStart"));
            this._buildOptionEvent(a, "onStart", b.attr("onStart"));
            this._buildOptionEvent(a, "onBeforeNext", b.attr("onBeforeNext"));
            this._buildOptionEvent(a, "onNext", b.attr("onNext"));
            this._buildOptionEvent(a, "onBeforePrev", b.attr("onBeforePrev"));
            this._buildOptionEvent(a, "onPrev", b.attr("onPrev"));
            this._buildOptionEvent(a, "onBeforeClose", b.attr("onBeforeClose"));
            this._buildOptionEvent(a, "onClose", b.attr("onClose"));
        },
        _buildOptionEvent: function(a, c, b) {
            a[c] = b ? function(h, g) {
                if ($.isString(b)) {
                    var e = b.indexOf("(");
                    var d = e > 0 ? b.substring(0, e) : b;
                    var f = "return window." + d + "?" + d + ".call(window,p1,p2):false;";
                    return new Function("p1","p2",f)(h, g);
                }
            }
             : a[c];
        },
        _stepsInit: function(h) {
            var m = this
              , n = m.options
              , j = m.element;
            var l = j.find(".c_guideContent:first");
            var a = l.children(".c_guideWrapper").eq(h);
            var g = j.find("ul:first li");
            var f = g.eq(h).attr("stepId");
            var k = $("#" + f).attr("initFunction");
            if (k) {
                var c = a.find("[aeInit=false]");
                if (c) {
                    $(c).each(function(i, o) {
                        $(o).attr("aeInit", "true");
                    });
                    $.aries.common.globalInit(a);
                    var e = k.indexOf("(");
                    var d = e > 0 ? k.substring(0, e) : k;
                    var b = "return window." + d + "?" + d + ".call(window):false;";
                    new Function(b)();
                }
            } else {
                var c = a.find('[aeInit="false"]');
                if (c && c.length) {
                    $(c).each(function(i, o) {
                        $(o).attr("aeInit", "true");
                    });
                    $.aries.common.globalInit(a);
                }
            }
        },
        _stepsShow: function(c, d) {
            var a = this
              , b = a.options
              , e = a.element;
            var f = e.find(".c_guideContent:first").children(".c_guideWrapper");
            if (d == "next") {
                f.eq(c - 1).hide();
            }
            if (d == "prev") {
                f.eq(c + 1).empty();
            }
            f.eq(c).show();
            f.eq(c).children().show();
        },
        start: function() {
            var b = this
              , c = b.options
              , e = b.element;
            b._init();
            $.setPublicData("irGuide", e.attr("id"));
            if (c.onBeforeStart && false === b._trigger("onBeforeStart")) {
                return;
            }
            var d = $.extend(true, {}, $.extend({
                modal: true,
                draggable: false,
                resizable: false,
                showFlush: false,
                showClose: true,
                showMinMax: false,
                popupType: "div",
                onBeforeClose: c.onBeforeClose,
                onClose: c.onClose
            }));
            c.dialogSettings = b._buildDialogSettings(c.title, c.width, c.height, d);
            if (c.historyStep[0] && c.historyStep[0].indexOf(".html") == c.historyStep[0].length - 5) {
                var a = e.attr("id") + "_irGuideStep_0";
                $.aries.common.includeHtml(a, c.historyStep[0], function() {
                    b._startThen();
                });
            } else {
                e.find(".c_guideContent:first").children(".c_guideWrapper").eq(0).html(c.historyStep[0]);
                b._startThen();
            }
        },
        _startThen: function() {
            var a = this
              , b = a.options
              , c = a.element;
            a._stepsInit(0);
            a._stepsShow(0);
            c.aeDialog(b.dialogSettings);
            b.active = 0;
            b.onStart && a._trigger("onStart");
        },
        _buildDialogSettings: function(e, d, a, c) {
            var b = this;
            return dialogSettings = {
                autoOpen: true,
                modal: c.modal,
                width: d || "600",
                height: "auto",
                title: e || "",
                popupType: c.popupType || "",
                draggable: c.draggable,
                resizable: c.resizable,
                showFlush: c.showFlush,
                showClose: c.showClose,
                showMinMax: c.showMinMax,
                partId: c.partId,
                onBeforeClose: function() {
                    if (c.onBeforeClose && false === b._trigger("onBeforeClose")) {
                        return false;
                    }
                },
                onClose: function() {
                    c.onClose && b._trigger("onClose");
                    $.removePublicData("irGuide");
                }
            };
        },
        next: function() {
            var b = this
              , c = b.options
              , f = b.element;
            var e = c.active;
            if (c.onBeforeNext && false === b._trigger("onBeforeNext", null , c.active)) {
                return;
            }
            if (e == c.totalSteps - 1) {
                return;
            }
            var d = f.find("ul:first li");
            d.eq(e + 1).addClass("active").removeClass("e_hide");
            d.eq(e).removeClass("active").addClass("disable");
            if (c.historyStep[e + 1].indexOf(".html") == c.historyStep[e + 1].length - 5) {
                var a = f.attr("id") + "_irGuideStep_" + (e + 1);
                $.aries.common.includeHtml(a, c.historyStep[e + 1], function() {
                    b._stepsInit(e + 1);
                    b._stepsShow(e + 1, "next");
                    c.active++;
                    c.onNext && b._trigger("onNext", null , c.active);
                });
            } else {
                f.find(".c_guideContent:first").children(".c_guideWrapper").eq(e + 1).html(c.historyStep[e + 1]);
                b._stepsInit(e + 1);
                b._stepsShow(e + 1, "next");
                c.active++;
                c.onNext && b._trigger("onNext", null , c.active);
            }
        },
        getActive: function() {
            var a = this.options.active;
            return a;
        },
        prev: function(c) {
            var a = this
              , b = a.options
              , e = a.element;
            var d = b.active;
            if (d == 0) {
                e.aeDialog("close");
                return;
            }
            if (c == true || c == "true") {
                a._prev();
                return;
            }
            if (b.onBeforePrev && false === a._trigger("onBeforePrev", null , b.active)) {
                return;
            }
            a._prev();
            b.onPrev && a._trigger("onPrev", null , b.active);
        },
        _prev: function(d) {
            var a = this
              , b = a.options
              , f = a.element;
            var e = b.active;
            var c = f.find("ul:first li");
            c.eq(e - 1).addClass("active").removeClass("disable");
            c.eq(e).removeClass("active").addClass("e_hide");
            a._stepsShow(e - 1, "prev");
            b.active--;
        }
    });
});
define("ui-offCanvas", function(require, exports, moudles) {
    $.aeWidget("ae.aeOffCanvas", {
        options: {
            initial: false,
            mouseMode: "click",
            location: "left",
            width: "15%",
            height: "15%",
            sideMargin: 0,
            animSpeed: 0,
            button: true,
            pushpin: false,
            bgColor: "#fff",
            opacity: 1,
            initialMode: "close",
            initType: "html"
        },
        _create: function() {
            var b = this
              , c = b.options
              , e = b.element;
            if (c.initial == true) {
                return;
            }
            if (c.initType == "html") {
                this._buildOptions(c, e);
            }
            c.aeType ? e.attr("aeType", c.aeType) : e.attr("aeType", "aeOffCanvas");
            c.uiid ? e.attr("uiid", c.uiid) : e.attr("uiid", e.attr("id"));
            var a = e.find("[name='offCanvas_side']");
            if (a.length == 0) {
                a = e.children(":first");
                a.attr("name", "offCanvas_side");
            }
            var d = c.sideData = {};
            d.width = c.width;
            d.height = c.height;
            d.cssTop = a.css("top");
            d.cssBottom = a.css("bottom");
            d.cssLeft = a.css("left");
            d.cssRight = a.css("right");
            c.bodyWidth = $(document.body).outerWidth(true);
            c.bodyHeight = $(document.body).outerHeight(true);
            a.width(c.width);
            a.height(c.height);
            e.addClass("offCanvas_content");
            a.addClass("offCanvas_side");
            e.children().css({
                "background": c.bgColor,
                "opacity": c.opacity
            });
            c.initial = true;
        },
        _init: function() {
            var b = this
              , c = b.options
              , e = b.element;
            var a = e.find("[name='offCanvas_side']");
            if (c.initialMode == "close") {
                c.side = false;
            } else {
                c.side = true;
            }
            var d = b._getSideLocation(!c.side);
            a.css(d);
            if (c.button) {
                b._offCanvasButton();
            }
        },
        _buildOptions: function(c, e) {
            c.aeType = e.attr("aeType");
            c.uiid = e.attr("uiid");
            c.mouseMode = e.attr("mouseMode") || c.mouseMode;
            c.location = e.attr("location") || c.location;
            c.animSpeed = parseInt(e.attr("animSpeed")) || c.animSpeed;
            c.width = e.attr("width") || c.width;
            c.height = e.attr("height") || c.height;
            c.sideMargin = e.attr("sideMargin") || c.sideMargin;
            c.bgColor = e.attr("bgColor") || c.bgColor;
            c.opacity = e.attr("opacity") || c.opacity;
            c.initialMode = e.attr("initialMode") || c.initialMode;
            c.button = e.attr("button") == "false" ? false : c.button;
            var d = e.attr("onBeforeOpen");
            c.onBeforeOpen = d ? function(k) {
                if ($.isString(d)) {
                    var h = d.indexOf("(");
                    var g = h > 0 ? d.substring(0, h) : d;
                    var j = "return window." + g + "?" + g + ".call(window, e):false;";
                    return new Function("e",j)(k);
                }
            }
             : "";
            var b = e.attr("onAfterOpen");
            c.onAfterOpen = b ? function(k) {
                if ($.isString(b)) {
                    var h = b.indexOf("(");
                    var g = h > 0 ? b.substring(0, h) : b;
                    var j = "return window." + g + "?" + g + ".call(window, e):false;";
                    return new Function("e",j)(k);
                }
            }
             : "";
            var a = e.attr("onBeforeClose");
            c.onBeforeClose = a ? function(k) {
                if ($.isString(a)) {
                    var h = a.indexOf("(");
                    var g = h > 0 ? a.substring(0, h) : a;
                    var j = "return window." + g + "?" + g + ".call(window, e):false;";
                    return new Function("e",j)(k);
                }
            }
             : "";
            var f = e.attr("onAfterClose");
            c.onAfterClose = f ? function(k) {
                if ($.isString(f)) {
                    var h = f.indexOf("(");
                    var g = h > 0 ? f.substring(0, h) : f;
                    var j = "return window." + g + "?" + g + ".call(window, e):false;";
                    return new Function("e",j)(k);
                }
            }
             : "";
        },
        _open: function() {
            var b = this
              , c = b.options
              , e = b.element;
            var a = e.find("[name='offCanvas_side']");
            if (c.side == true) {
                return;
            }
            if (c.onBeforeOpen && b._trigger("onBeforeOpen", null ) === false) {
                return false;
            }
            var d = b._getSideLocation(c.side);
            a.animate(d, c.animSpeed);
            if (c.button) {
                b._btnOpen();
            }
            if (c.onAfterOpen) {
                b._trigger("onAfterOpen", null );
            }
            c.side = true;
        },
        _close: function() {
            var b = this
              , c = b.options
              , g = b.element;
            var a = g.find("[name='offCanvas_side']");
            if (c.side == false) {
                return;
            }
            if (c.onBeforeClose && b._trigger("onBeforeClose", null ) === false) {
                return false;
            }
            var e;
            if (c.button) {
                var d = g.find("[name='offCanvasBtn']");
                e = d.siblings(":not([name='offCanvas_side'])");
            } else {
                e = a.siblings();
            }
            if (e.length > 0) {
                e.hide();
            }
            var f = b._getSideLocation(c.side);
            a.animate(f, c.animSpeed);
            if (c.button) {
                b._btnClose();
            }
            if (c.onAfterClose) {
                b._trigger("onAfterClose", null );
            }
            c.side = false;
        },
        _getSideLocation: function(d) {
            var b = this
              , c = b.options
              , g = b.element;
            var e = c.sideData;
            var f, a;
            if (d == undefined) {
                d = c.side;
            }
            if (c.location == "top") {
                a = b._calculator(c.sideMargin, 2, e.height);
                e.leftOpen = e.leftClose = 0;
                e.topOpen = e.topClose = 0;
                e.topClose = a;
                if (d == false) {
                    f = {
                        "top": e.topOpen
                    };
                } else {
                    f = {
                        "top": e.topClose
                    };
                }
            } else {
                if (c.location == "bottom") {
                    a = b._calculator(c.sideMargin, 2, e.height);
                    e.leftOpen = e.leftClose = 0;
                    e.bottomOpen = e.bottomClose = 0;
                    e.bottomClose = a;
                    if (d == false) {
                        f = {
                            "bottom": e.bottomOpen
                        };
                    } else {
                        f = {
                            "bottom": e.bottomClose
                        };
                    }
                } else {
                    if (c.location == "right") {
                        a = b._calculator(c.sideMargin, 2, e.width);
                        e.topOpen = e.topClose = 0;
                        e.rightOpen = e.rightClose = 0;
                        e.rightClose = a;
                        if (d == false) {
                            f = {
                                "right": e.rightOpen
                            };
                        } else {
                            f = {
                                "right": e.rightClose
                            };
                        }
                    } else {
                        a = b._calculator(c.sideMargin, 2, e.width);
                        e.topOpen = e.topClose = 0;
                        e.leftOpen = e.leftClose = c.sideMargin;
                        e.leftClose = a;
                        if (d == false) {
                            f = {
                                "left": e.leftOpen
                            };
                        } else {
                            f = {
                                "left": e.leftClose
                            };
                        }
                    }
                }
            }
            return f;
        },
        _btnOpen: function() {
            var a = this
              , b = a.options
              , e = a.element;
            var c = e.find("[name='offCanvasBtn']");
            var d = a._getBtnLocation(b.side);
            c.animate(d, b.animSpeed);
            c.removeClass("offCanvas_close_btn_" + b.location).addClass("offCanvas_open_btn_" + b.location);
        },
        _btnClose: function() {
            var a = this
              , b = a.options
              , e = a.element;
            var c = e.find("[name='offCanvasBtn']");
            var d = a._getBtnLocation(b.side);
            c.animate(d, b.animSpeed);
            c.removeClass("offCanvas_open_btn_" + b.location).addClass("offCanvas_close_btn_" + b.location);
        },
        _offCanvasButton: function() {
            var h = this
              , i = h.options
              , f = h.element;
            var c = i.btnData = {};
            var b = i.sideData;
            var e, a;
            a = "offCanvas_close_btn_" + i.location;
            if (i.side) {
                a = "offCanvas_open_btn_" + i.location;
            }
            var d = '<div name="offCanvasBtn">&nbsp;</div>';
            f.prepend(d);
            var g = f.find("[name='offCanvasBtn']");
            g.addClass(a);
            c.width = g.width();
            c.height = g.height();
            e = h._getBtnLocation(!i.side);
            g.css(e);
            if (i.mouseMode == "mouseover") {
                g.mouseover(function() {
                    if (i.side == true) {
                        h._close();
                    } else {
                        h._open();
                    }
                });
            } else {
                g.click(function() {
                    if (i.side == true) {
                        h._close();
                    } else {
                        h._open();
                    }
                });
            }
        },
        _getBtnLocation: function(e) {
            var i = this
              , j = i.options
              , f = i.element;
            var a = j.sideData
              , b = j.btnData;
            var d, h, c, g;
            if (e == undefined) {
                e = j.side;
            }
            if (j.location == "top") {
                h = i._calculator(a.width, 4, 2);
                h = i._calculator(h, 2, b.width / 2);
                if (a.cssLeft !== "auto") {
                    c = i._calculator(a.cssLeft, 1, h);
                    b.leftOpen = b.leftClose = c;
                } else {
                    if (a.cssRight !== "auto") {
                        c = i._calculator(a.cssRight, 1, h);
                        b.rightOpen = b.rightClose = c;
                    } else {
                        b.leftOpen = b.leftClose = h;
                    }
                }
                g = i._calculator(j.sideMargin, 1, a.height);
                b.topOpen = g;
                b.topClose = j.sideMargin;
                if (e == false) {
                    d = {
                        "top": b.topOpen,
                        "left": b.leftOpen,
                        "right": b.rightOpen
                    };
                } else {
                    d = {
                        "top": b.topClose,
                        "left": b.leftClose,
                        "right": b.rightClose
                    };
                }
            } else {
                if (j.location == "bottom") {
                    h = i._calculator(a.width, 4, 2);
                    h = i._calculator(h, 2, b.width / 2);
                    if (a.cssLeft !== "auto") {
                        c = i._calculator(a.cssLeft, 1, h);
                        b.leftOpen = b.leftClose = c;
                    } else {
                        if (a.cssRight !== "auto") {
                            c = i._calculator(a.cssRight, 1, h);
                            b.rightOpen = b.rightClose = c;
                        } else {
                            b.leftOpen = b.leftClose = h;
                        }
                    }
                    g = i._calculator(j.sideMargin, 1, a.height);
                    b.leftOpen = b.leftClose = h;
                    b.bottomOpen = g;
                    b.bottomClose = j.sideMargin;
                    if (e == false) {
                        d = {
                            "bottom": b.bottomOpen,
                            "left": b.leftOpen,
                            "right": b.rightOpen
                        };
                    } else {
                        d = {
                            "bottom": b.bottomClose,
                            "left": b.leftClose,
                            "right": b.rightClose
                        };
                    }
                } else {
                    if (j.location == "right") {
                        h = i._calculator(a.height, 4, 2);
                        h = i._calculator(h, 2, b.height / 2);
                        if (a.cssTop !== "auto") {
                            c = i._calculator(a.cssTop, 1, h);
                            b.TopOpen = b.TopClose = c;
                        } else {
                            if (a.cssBottom !== "auto") {
                                c = i._calculator(a.cssBottom, 1, h);
                                b.rightOpen = b.rightClose = c;
                            } else {
                                b.bottomOpen = b.bottomClose = h;
                            }
                        }
                        g = i._calculator(j.sideMargin, 1, a.width);
                        b.topOpen = b.topClose = h;
                        b.rightOpen = g;
                        b.rightClose = j.sideMargin;
                        if (e == false) {
                            d = {
                                "top": b.topOpen,
                                "right": b.rightOpen,
                                "bottom": b.bottomOpen
                            };
                        } else {
                            d = {
                                "top": b.topClose,
                                "right": b.rightClose,
                                "bottom": b.bottomClose
                            };
                        }
                    } else {
                        h = i._calculator(a.height, 4, 2);
                        h = i._calculator(h, 2, b.height / 2);
                        if (a.cssTop !== "auto") {
                            c = i._calculator(a.cssTop, 1, h);
                            b.TopOpen = b.TopClose = c;
                        } else {
                            if (a.cssBottom !== "auto") {
                                c = i._calculator(a.cssBottom, 1, h);
                                b.rightOpen = b.rightClose = c;
                            } else {
                                b.bottomOpen = b.bottomClose = h;
                            }
                        }
                        g = i._calculator(j.sideMargin, 1, a.width);
                        b.topOpen = b.topClose = h;
                        b.leftOpen = g;
                        b.leftClose = j.sideMargin;
                        if (e == false) {
                            d = {
                                "top": b.topOpen,
                                "left": b.leftOpen,
                                "bottom": b.bottomOpen
                            };
                        } else {
                            d = {
                                "top": b.topClose,
                                "left": b.leftClose,
                                "bottom": b.bottomClose
                            };
                        }
                    }
                }
            }
            return d;
        },
        _calculator: function(f, c, d) {
            var e, b, a;
            if (typeof f == "string") {
                if (f.indexOf("%") != -1) {
                    b = "%";
                } else {
                    if (f.indexOf("px") != -1) {
                        b = "px";
                    }
                }
                f = parseInt(f);
            }
            if (typeof d == "string") {
                if (d.indexOf("%") != -1) {
                    a = "%";
                } else {
                    if (d.indexOf("px") != -1) {
                        a = "px";
                    }
                }
                d = parseInt(d);
            }
            switch (c) {
            case 1:
                e = f + d;
                break;
            case 2:
                e = f - d;
                break;
            case 3:
                e = f * d;
                break;
            case 4:
                e = f / d;
                break;
            case 5:
                e = f % d;
                break;
            default:
                return false;
            }
            if (b !== undefined || a !== undefined) {
                if (b == a) {
                    e += b;
                } else {
                    b = a || b;
                    e += b;
                }
            }
            return e;
        },
        open: function() {
            this._open();
        },
        close: function() {
            this._close();
        },
        reload: function(c) {
            return;
            var a = this
              , b = this.options
              , d = this.element;
            if (c) {
                data = a._transformToNodes(data);
                d.empty();
                d.append(a._appendNodes.apply(a, [data]));
                a._bindEvent();
            }
        }
    });
});
define("ui-panel", function(require, exports, moudles) {
    var a = {
        anim: true,
        speed: "slow"
    };
    $.aeWidget("ae.aePanel", {
        options: {
            initial: false,
            title: "",
            width: "auto",
            height: "auto",
            header: true,
            collapsible: false,
            closable: false,
            closed: false,
            collapsed: false,
            fold: false,
            initType: "html"
        },
        _create: function() {
            var b = this.options
              , c = this.element;
            if (b.initial == true) {
                return;
            }
            if (b.initType == "html") {
                this._buildOptions(b, c);
            }
            b.aeType ? c.attr("aeType", b.aeType) : c.attr("aeType", "aePanel");
            b.uiid ? c.attr("uiid", b.uiid) : c.attr("uiid", c.attr("id"));
            c.wrap("<div class='c_box'></div>");
            b.initial = true;
        },
        _init: function() {
            var d = this.options, e = this.element, f = e.parent(), c;
            this._renderHeader();
            c = e.prev();
            if (d.header === false) {
                f.removeClass("c_box");
            }
            this._bindEvent();
            this._resize(f);
            var b = d.header !== false ? c.outerHeight() : 0;
            if (d.collapsed !== false) {
                "auto" !== d.height && f.height(b);
                e.hide();
                if (d.header !== false) {
                    c.find(">.op >.fold").removeClass("fold").addClass("unfold");
                }
            } else {
                e.show();
                "auto" !== d.height && f.height(b + e.outerHeight());
                if (d.header !== false) {
                    c.find(">.op >.unfold").removeClass("unfold").addClass("fold");
                }
            }
            d.closed !== false ? f.hide() : f.show();
            this.reload();
        },
        _buildOptions: function(b, c) {
            b.header = c.attr("header") == "false" ? false : b.header;
            b.closable = c.attr("closable") == "true" ? true : b.closable;
            b.closed = c.attr("closed") == "true" ? true : b.closed;
            b.collapsed = c.attr("collapsed") == "true" ? true : b.collapsed;
            b.collapsible = c.attr("collapsible") == "true" ? true : b.collapsible;
            b.fold = c.attr("fold") == "true" ? true : b.fold;
            b.height = c.attr("height") || b.height;
            b.width = c.attr("width") || b.width;
            b.title = c.attr("title") || b.title;
            b.url = c.attr("url");
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            this._buildOptionEvent(b, "tools", c.attr("tools"));
            this._buildOptionEvent(b, "onBeforeClose", c.attr("onBeforeClose"));
            this._buildOptionEvent(b, "onBeforeCollapse", c.attr("onBeforeCollapse"));
            this._buildOptionEvent(b, "onBeforeExpand", c.attr("onBeforeExpand"));
            this._buildOptionEvent(b, "onBeforeOpen", c.attr("onBeforeOpen"));
            this._buildOptionEvent(b, "onClose", c.attr("onClose"));
            this._buildOptionEvent(b, "onCollapse", c.attr("onCollapse"));
            this._buildOptionEvent(b, "onExpand", c.attr("onExpand"));
            this._buildOptionEvent(b, "onOpen", c.attr("onOpen"));
        },
        _buildOptionEvent: function(b, d, c) {
            b[d] = c ? function(h) {
                if ($.isString(c)) {
                    var f = c.indexOf("(");
                    var e = f > 0 ? c.substring(0, f) : c;
                    var g = "return window." + e + "?" + e + ".call(window,p1):false;";
                    return new Function("p1",g)(h);
                }
            }
             : b[d];
        },
        _bindEvent: function() {
            var b = this
              , d = this.element
              , c = this.options
              , e = d.prev();
            if (c.fold !== false) {
                e.click(function(f) {
                    if ($(f.target).is(".text,.c_title")) {
                        c.collapsed !== false ? b.expand() : b.collapse();
                    }
                });
            }
            if (c.collapsible !== false) {
                e.find(".fold , .unfold").click(function() {
                    c.collapsed !== false ? b.expand() : b.collapse();
                });
            }
            if (c.closable !== false) {
                e.find(".close").click(function(f) {
                    b.close();
                });
            }
        },
        _renderHeader: function() {
            this.header && this.header.remove();
            if (this.options.header === false) {
                return;
            }
            var d = this
              , c = this.options
              , e = c.tools
              , b = this.header = $("<div class='c_title'></div>").insertBefore(this.element);
            $("<div class='text'></div>").html(c.title).appendTo(b);
            $tool = $("<div class='op'></div>");
            if (c.collapsible !== false) {
                $("<a class='fold'></a>").appendTo($tool);
            }
            if (c.closable !== false) {
                $("<a class='close'></a>").appendTo($tool);
            }
            $tool.appendTo(b);
            if (e) {
                $tools = $("<div class='fn'></div>").appendTo(b);
                e($tools);
            }
        },
        _resize: function(f) {
            var e = this.element
              , b = e.prev()
              , f = e.parent()
              , c = this.options;
            if (c.width == "fit") {
                c.width = "100%";
                f.width("100%");
                b.css("width", "");
                e.css("width", "");
            } else {
                if (c.width !== "auto") {
                    f.width(c.width);
                    b.outerWidth(f.width());
                    e.outerWidth(f.width());
                } else {
                    var d = e.attr("style");
                    if (d && d.indexOf("width") !== -1) {
                        f.width(e.outerWidth());
                        b.outerWidth(e.outerWidth());
                    } else {
                        f.css("width", "");
                        b.css("width", "");
                        e.css("width", "");
                    }
                }
            }
            if (c.height == "fit") {
                c.height = "100%";
                f.height("100%");
                e.outerHeight(f.height() - (this.options.header !== false ? b.outerHeight() : 0));
            } else {
                if (c.height !== "auto") {
                    f.height(c.height);
                    e.outerHeight(f.height() - (this.options.header !== false ? b.outerHeight() : 0));
                } else {
                    var d = e.attr("style");
                    if (d && d.indexOf("height") !== -1) {
                        f.height(b.outerHeight() + e.outerHeight());
                    } else {
                        f.css("height", "");
                        e.css("height", "");
                    }
                }
            }
        },
        _showLoadingMessage: function() {
            var b = this.options
              , c = this.element
              , d = c.next(".e_loadingBar_small");
            if (d.length === 0) {
                $("<div  class='c_nodata'><span class='e_loadingBar_small'></span></div>").appendTo(c);
            } else {
                d.show();
            }
        },
        _hideLoadingMessage: function() {
            this.element.parent().find(".e_loadingBar_small").hide();
        },
        setTitle: function(b) {
            this.element.prev().find(">.text").html(b);
        },
        open: function() {
            var c = this.element
              , b = this.options;
            if (b.closed) {
                if (b.onBeforeOpen && this._trigger("onBeforeOpen") === false) {
                    return;
                }
                (c.parent()).show();
                b.closed = false;
                b.onOpen && this._trigger("onOpen");
            }
        },
        close: function() {
            var c = this.element
              , b = this.options;
            if (!b.closed) {
                if (b.onBeforeClose && this._trigger("onBeforeClose") === false) {
                    return;
                }
                c.parent().hide();
                b.closed = true;
                b.onClose && this._trigger("onClose");
            }
        },
        reload: function(d) {
            var c = this.options
              , e = this.element
              , b = this;
            if (e.data("loading")) {
                return;
            } else {
                e.data("loading", true);
            }
            d = d || c.url;
            if (!d) {
                e.data("loading", false);
                return;
            }
            c.url = d;
            this._showLoadingMessage();
            this._includeHtml(d, e.attr("id"));
        },
        _includeHtml: function(e, f) {
            var b = this
              , c = this.options
              , d = this.element;
            $.ajax(e, {
                cache: false,
                success: function(h, i, g) {
                    d.html(c.preProcess ? c.preProcess.call(d[0], h, i) : h);
                    $.aries.common.globalInit(f);
                    d.data("loading", false);
                    b._hideLoadingMessage();
                },
                error: function(g, i, h) {
                    d.data("loading", false);
                    b._hideLoadingMessage();
                }
            });
        },
        resize: function(c) {
            var d = this.options, e, b;
            if ($.isPlainObject(c)) {
                e = c.width || null ;
                b = c.height || null ;
            } else {
                e = arguments[0];
                b = arguments[1];
            }
            d.width = e || d.width;
            d.height = b || d.height;
            this._resize(this.element.parent());
        },
        collapse: function() {
            var i = this
              , f = this.element
              , b = f.prev()
              , e = f.parent()
              , h = f.next(".e_loadingBar_small")
              , j = this.options
              , d = a.anim
              , c = a.speed;
            if (arguments[0] != undefined) {
                d = arguments[0];
            }
            c = arguments[1] || c;
            if (j.collapsed) {
                return;
            }
            if (j.onBeforeCollapse && i._trigger("onBeforeCollapse") === false) {
                return;
            }
            e.stop(true, true);
            if (b.length !== 0) {
                var g = b.find("> .op > a.fold");
                if (g.length !== 0) {
                    g.removeClass("fold").addClass("unfold");
                }
            }
            e.animate({
                height: "-=" + f.outerHeight()
            }, d ? (c || "normal") : 0, function() {
                f.hide();
                h.hide();
                "auto" === j.height && e.css("height", "");
                j.onCollapse && i._trigger("onCollapse");
            });
            j.collapsed = true;
        },
        expand: function() {
            var i = this
              , f = this.element
              , b = f.prev()
              , e = f.parent()
              , h = f.next(".e_loadingBar_small")
              , j = this.options
              , d = a.anim
              , c = a.speed;
            if (arguments[0] != undefined) {
                d = arguments[0];
            }
            c = arguments[1] || c;
            if (!j.collapsed) {
                return;
            }
            if (j.onBeforeExpand && i._trigger("onBeforeExpand") === false) {
                return;
            }
            e.stop(true, true);
            if (b.length !== 0) {
                var g = b.find("> .op > a.unfold");
                if (g.length !== 0) {
                    g.removeClass("unfold").addClass("fold");
                }
            }
            "auto" === j.height && e.height(b.outerHeight());
            f.show();
            if (f.data("loading")) {
                h.show();
            }
            e.animate({
                height: "+=" + f.outerHeight()
            }, d ? (c || "normal") : 0, function() {
                "auto" === j.height && e.css("height", "");
                j.onExpand && i._trigger("onExpand");
            });
            j.collapsed = false;
        },
        destroy: function() {
            var b = this.element;
            b.parent().remove();
        }
    });
});
define("ui-tabs", function(require, exports, moudles) {
    var c = "current"
      , a = "pre_dis"
      , d = "next_dis";
    function b(g, f) {
        if (f.content) {
            $(g).html(f.content);
        }
        return $(g).aePanel(f);
    }
    function e() {
        return $.browser.msie && parseInt($.browser.version) == 7;
    }
    $.aeWidget("ae.aeTabs", {
        options: {
            initial: false,
            leaveRefresh: true,
            width: "auto",
            height: "auto",
            advanced: true,
            scrollable: true,
            closable: false,
            position: "top",
            switchMode: "click",
            autoPlay: false,
            interval: 1000,
            active: 0,
            tabMenu: false,
            onBeforeActivate: function(g, f) {},
            onActivate: function(g, f) {},
            onBeforeClose: function(g, f) {},
            onClose: function(g, f) {},
            onBeforeCloseAll: function(f) {},
            onCloseAll: function() {},
            onAdd: function(f, g) {},
            onBeforeAdd: function(f, g) {},
            onLoadComplete: function(f, g) {},
            initType: "html"
        },
        _create: function() {
            var f = this.options
              , g = this.element;
            if (f.initial == true) {
                return;
            }
            f.random = (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
            f.id = 0;
            this._makeSketch();
            this._collectItems();
            this.history = [];
            f.initial = true;
        },
        _makeSketch: function() {
            var f = this
              , g = this.options
              , i = this.element;
            var h = [];
            if (g.initType == "html") {
                this._buildOptions(g, i);
            }
            g.aeType ? i.attr("aeType", g.aeType) : i.attr("aeType", "aeTabs");
            g.uiid ? i.attr("uiid", g.uiid) : i.attr("uiid", i.attr("id"));
            if (g.advanced == false) {
                g.ctab = "c_tab";
            } else {
                g.ctab = "c_advance_tab";
            }
            i.addClass("c_box").children("ul:first").wrapAll('<div class="' + g.ctab + " " + g.ctab + '-nowrap"></div>').wrapAll('<div class="tab"></div>');
            i.find(">div." + g.ctab + " >div.tab >ul").children().wrap("<li></li>").before("<a></a>");
            if (i.children(":not(div." + g.ctab + ")").legth) {
                i.children(":not(div." + g.ctab + ")").wrapAll('<div class="ae-tabs-panels" style="width:100%;"></div>');
            } else {
                i.append('<div class="ae-tabs-panels" style="width:100%;"/>');
            }
            i.find(">div." + g.ctab + " li").each(function(k, l) {
                var j = "tabId-" + g.random + "-" + g.id++;
                var n = $(l).children("span").attr("src");
                $(l).children("a").attr("tabId", j);
                if (n && n.indexOf("#") == 0) {
                    $(l).children("a").attr("href", n);
                    if (!i.find(">div.ae-tabs-panels").children(n).length) {
                        var m = $(n).prop("outerHTML");
                        $(n).remove();
                        i.find(">div.ae-tabs-panels").append(m);
                    }
                    h.push({
                        tabId: j,
                        tempHtml: $(n).html()
                    });
                }
                if (n && n.indexOf(".html") == n.length - 5) {
                    $(l).children("a").attr("href", "#" + j);
                    i.find(">div.ae-tabs-panels").append('<div id="' + j + '"></div>');
                }
            });
            this.tabPanels = h;
            this.$menu = $("<div></div>").appendTo($("body"));
        },
        _includeHtml: function(h, j, k) {
            var f = this
              , g = this.options
              , i = this.element;
            $.ajax(j, {
                async: false,
                cache: false,
                success: function(m, n, l) {
                    $("#" + h).html(m);
                    $.globalInit(h);
                    if (k && $.isFunction(k)) {
                        k(m, n, l);
                    }
                },
                error: function(l, n, m) {
                    $.message.error("", "", "tabs reloading error.");
                }
            });
        },
        _collectItems: function() {
            var f = this
              , i = this.options
              , j = this.element;
            var h = []
              , g = [];
            j.find(">div." + i.ctab + " a").each(function() {
                var l = this.getAttribute("href", 2);
                var q = $(this).next("span").attr("src");
                var n = $(this);
                var m = n.attr("tabId");
                var k = {
                    initType: "js",
                    tabId: m,
                    title: n.text(),
                    _closeMode: "visibility",
                    header: false,
                    closed: true,
                    onSuccess: function(r, t, s) {
                        f._trigger("onLoadComplete", null , k.tabId);
                    },
                    onError: function(s, t, r) {
                        f._trigger("onLoadComplete", null , k.tabId);
                    }
                };
                var p = $(l, j)[0];
                var o = new b(p || $('<div id="' + m + '"></div>')[0],k);
                if (i.active == parseInt(m.split("-")[2]) && q && q.indexOf("#") != 0) {
                    f._includeHtml(m, q);
                }
                if (g.length > 0) {
                    this.loadInfo = g;
                }
                h.push(o);
            });
            $lis = j.find(">div." + i.ctab + " ul li");
            this.items = h;
        },
        _buildOptions: function(h, k) {
            h.aeType = k.attr("aeType");
            h.uiid = k.attr("uiid");
            h.active = parseInt(k.attr("active"), 10) || h.active;
            h.advanced = k.attr("advanced") == "false" ? false : h.advanced;
            h.leaveRefresh = k.attr("leaveRefresh") == "false" ? false : h.leaveRefresh;
            var l = k.attr("closable");
            if (l && l == "true") {
                h.closable = true;
            } else {
                if (l && l.indexOf("[") == 0) {
                    var l = [];
                    var f = k.attr("closable").substring(1, k.attr("closable").length - 1).split(",");
                    for (var j = 0; j < f.length; j++) {
                        l.push(parseInt(f[j], 10));
                    }
                    h.closable = l;
                } else {
                    h.closable = false;
                }
            }
            h.height = parseInt(k.attr("height"), 10) || h.height;
            h.scrollable = k.attr("scrollable") == "false" ? false : h.scrollable;
            h.switchMode = k.attr("switchMode") || h.switchMode;
            h.tabMenu = k.attr("tabMenu") == "true" ? true : h.tabMenu;
            h.width = parseInt(k.attr("width"), 10) || h.width;
            this._buildOptionEvent(h, "onActivate", k.attr("onActivate"));
            this._buildOptionEvent(h, "onAdd", k.attr("onAdd"));
            this._buildOptionEvent(h, "onBeforeActivate", k.attr("onBeforeActivate"));
            this._buildOptionEvent(h, "onBeforeAdd", k.attr("onBeforeAdd"));
            this._buildOptionEvent(h, "onBeforeClose", k.attr("onBeforeClose"));
            this._buildOptionEvent(h, "onClose", k.attr("onClose"));
            this._buildOptionEvent(h, "onLoadComplete", k.attr("onLoadComplete"));
            var m = k.attr("onBeforeCloseAll");
            h.onBeforeCloseAll = m ? function(q) {
                if ($.isString(m)) {
                    var o = m.indexOf("(");
                    var n = o > 0 ? m.substring(0, o) : m;
                    var p = "return window." + n + "?" + n + ".call(window,e):false;";
                    return new Function("e",p)(q);
                }
            }
             : "";
            var g = k.attr("onCloseAll");
            h.onCloseAll = g ? function(q) {
                if ($.isString(g)) {
                    var o = g.indexOf("(");
                    var n = o > 0 ? g.substring(0, o) : g;
                    var p = "return window." + n + "?" + n + ".call(window,e):false;";
                    return new Function("e",p)(q);
                }
            }
             : "";
        },
        _buildOptionEvent: function(f, h, g) {
            f[h] = g ? function(n, m) {
                if ($.isString(g)) {
                    var k = g.indexOf("(");
                    var j = k > 0 ? g.substring(0, k) : g;
                    var l = "return window." + j + "?" + j + ".call(window,p1,p2):false;";
                    return new Function("p1","p2",l)(n, m);
                }
            }
             : f[h];
        },
        _init: function() {
            this._render();
            this._afterRender();
            this._buildEvent();
        },
        _render: function() {
            var f = this
              , k = this.element
              , i = this.options
              , g = this.items
              , j = k.find(">div." + i.ctab);
            if (typeof i.active == "number") {
                if (i.active < 0) {
                    i.active = 0;
                }
                if (i.active > g.length - 1) {
                    i.active = g.length - 1;
                }
            }
            if (i.width == "fit") {
                k.outerWidth(k.parent().width());
            } else {
                if (i.width != "auto") {
                    k.css("width", i.width);
                }
            }
            if (i.height == "fit") {
                k.outerHeight(k.parent().height());
            } else {
                if (i.height != "auto") {
                    k.css("height", i.height);
                }
            }
            if (i.closable == true && i.tabMenu && $.fn.aeMenu) {
                var h = k.attr("id");
                this.menu = this.$menu.aeMenu({
                    initType: "js",
                    contextMenu: true,
                    dataSource: [{
                        id: h + "_001",
                        label: "关闭"
                    }, {
                        id: h + "_002",
                        label: "关闭其它"
                    }, {
                        id: h + "_003",
                        label: "关闭所有"
                    }],
                    onSelect: function(l, m) {
                        if (l.id == h + "_001") {
                            f.close(f.getAlter($(f.$currentLi).find("a").attr("tabid")));
                        } else {
                            if (l.id == h + "_002") {
                                j.find("ul li").each(function(o, p) {
                                    var n = $(f.$currentLi).find("a").attr("tabid");
                                    var q = $(p).find("a").attr("tabid");
                                    if (n === q) {
                                        return;
                                    }
                                    f.close(f.getAlter(q));
                                });
                            } else {
                                if (l.id == h + "_003") {
                                    f.closeAll();
                                }
                            }
                        }
                    }
                });
            }
            if ($.isArray(i.closable) && i.tabMenu && $.fn.aeMenu) {
                var h = k.attr("id");
                this.menu = this.$menu.aeMenu({
                    initType: "js",
                    contextMenu: true,
                    dataSource: [{
                        id: h + "_001",
                        label: "关闭"
                    }, {
                        id: h + "_002",
                        label: "关闭其它"
                    }, {
                        id: h + "_003",
                        label: "关闭所有"
                    }],
                    onSelect: function(l, m) {
                        if (l.id == h + "_001") {
                            f.close(f.getAlter($(f.$currentLi).find("a").attr("tabid")));
                        } else {
                            if (l.id == h + "_002") {
                                j.find("ul li").each(function(o, p) {
                                    var n = $(f.$currentLi).find("a").attr("tabid");
                                    var q = $(p).find("a");
                                    if (q.hasClass("closed")) {
                                        var r = q.attr("tabid");
                                        if (n === r) {
                                            return;
                                        }
                                        f.close(f.getAlter(r));
                                    }
                                });
                            } else {
                                if (l.id == h + "_003") {
                                    j.find("ul li").each(function(n, o) {
                                        var p = $(o).find("a");
                                        if (p.hasClass("closed")) {
                                            var q = p.attr("tabid");
                                            f.close(f.getAlter(q));
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
            this._renderHeader();
            this._renderBody();
        },
        _renderHeader: function() {
            var h = this.element
              , f = this.options
              , g = this.history;
            $headers = h.find(">div." + f.ctab),
            $lis = $headers.find("ul li");
            $lis.each(function(j) {
                var i = $(this).find("a");
                if (j === f.active || f.active === i.attr("tabId")) {
                    $(this).addClass(c);
                    f.activeTabId = i.attr("tabId");
                    f.active = j;
                    if (!$.inArray(f.activeTabId, g)) {
                        g.push(f.activeTabId);
                    }
                } else {
                    $(this).removeClass(c);
                }
                if (f.closable === true || ($.isArray(f.closable) && -1 !== $.inArray(j, f.closable))) {
                    i.addClass("closed");
                }
            });
            this._checkScroller() && this._enableScroller();
        },
        _renderBody: function() {
            var m = this.element
              , h = this.options
              , g = this.items
              , l = m.find(">div.ae-tabs-panels");
            l.children().detach();
            if (h.height !== "auto") {
                var f = m.innerHeight()
                  , k = m.find(">div." + h.ctab).outerHeight();
                l.css("height", f - k);
            }
            var j = g.length;
            while (j--) {
                g[j].addClass("ae-state-nobd").parent().prependTo(l);
            }
        },
        _afterRender: function() {
            var k = this.element
              , h = this.options
              , g = this.items;
            var j = g.length;
            k.children().each(function() {
                $(this).is("." + h.ctab + ",.ae-tabs-panels") || $(this).remove();
            });
            while (j--) {
                var f = $(g[j]);
                if (j == h.active) {
                    f.aePanel("open");
                } else {
                    f.aePanel("close");
                }
            }
            k.css("height", k.height());
            k.css("height", h.height);
        },
        _buildEvent: function() {
            var f = this
              , j = this.element
              , g = this.options
              , h = j.find(">div." + g.ctab + " a.closed");
            h.unbind("click.aetabs").bind("click.aetabs", function(l) {
                var k = $(l.target).attr("tabId");
                f._close(k);
                return false;
            });
            var i = j.find(">div." + g.ctab + " ul li");
            if (g.switchMode.indexOf("mouseover") != -1) {
                i.bind("mouseover.aetabs", function() {
                    var k = $(this).find("a").attr("tabId")
                      , l = $.data(j[0], "activateTimer");
                    (typeof l !== "undefined") && clearTimeout(l);
                    l = setTimeout(function() {
                        f._activate(k);
                        return false;
                    }, 200);
                    $.data(j[0], "activateTimer", l);
                });
            } else {
                if (g.switchMode.indexOf("click") != -1) {
                    i.bind("click.aetabs", function() {
                        f._activate($(this).find("a").attr("tabId"));
                    });
                }
            }
            i.bind("click.aetabs", function() {
                return false;
            });
            if (g.autoPlay == true) {
                g.autoInterId = setInterval(function() {
                    j.aeTabs("activate", "next");
                }, g.interval);
            } else {
                clearInterval(g.autoInterId);
            }
            if (g.switchMode.indexOf("mouseover") == -1) {
                if (g.closable == true && g.tabMenu) {
                    i.each(function(k, l) {
                        $(l).bind("contextmenu", function(m) {
                            if ($.fn.aeMenu) {
                                f.$currentLi = this;
                                $(f.menu).aeMenu("show", m);
                            }
                        });
                    });
                }
                if ($.isArray(g.closable) && g.tabMenu) {
                    i.find("a.closed").each(function(k, l) {
                        $(l).parent().bind("contextmenu", function(m) {
                            if ($.fn.aeMenu) {
                                f.$currentLi = this;
                                $(f.menu).aeMenu("show", m);
                            }
                        });
                    });
                }
            }
            j.find(">div." + g.ctab + " >div.op a").bind("click.aetabs", function(k) {
                if ($(this).hasClass(a) || $(this).hasClass(d)) {
                    return false;
                }
                var l = $(this).parents("." + g.ctab).find("ul").children("li:last").outerWidth(true);
                if ($(this).hasClass("pre")) {
                    f._scroll(l, f._scrollCbFn());
                }
                if ($(this).hasClass("next")) {
                    f._scroll(-l, f._scrollCbFn());
                }
                if ($(this).hasClass("all")) {}
                return false;
            });
        },
        _purgeEvent: function() {
            var h = this.element
              , f = this.options;
            var g = h.find(">div." + f.ctab);
            g.children().unbind(".aetabs");
            g.find(">ul >li >a").unbind(".aetabs");
            if (f.autoInterId) {
                clearInterval(f.autoInterId);
            }
        },
        _activate: function(t) {
            var k = this, z = this.element, h = this.options, s = this.items, l, o;
            var q = z.find(">div." + h.ctab + " ul");
            var j = z.find(">div." + h.ctab + " ul li a");
            if (h.activeTabId === t || h.active === t) {
                return false;
            }
            if (h.onBeforeActivate && this._trigger("onBeforeActivate", null , t) === false) {
                return false;
            }
            j.each(function() {
                if ($(this).attr("tabId") == t) {
                    var i = t;
                    o = $(this).next("span").attr("src");
                    if (o && o.indexOf("#") != 0) {
                        if (h.leaveRefresh == true) {
                            k._includeHtml(i, o);
                        } else {
                            if ($("#" + i).html() == "") {
                                k._includeHtml(i, o);
                            }
                        }
                    }
                    if (o && o.indexOf("#") == 0) {
                        $.globalInit(o.split("#")[1]);
                    }
                }
            });
            t = t || 0;
            var r, x = t;
            if (t == "next") {
                t = (h.active + 1) % s.length;
            } else {
                if (t == "prev") {
                    t = (h.active - 1) % s.length;
                }
            }
            if (typeof t == "number") {
                x = this._getAlter(t);
            } else {
                if (typeof t == "string") {
                    t = this._getAlter(t);
                }
            }
            r = q.find("li a[tabId=" + x + "]");
            r.parent().addClass(c).siblings().removeClass(c);
            h.activeTabId = x;
            h.active = t;
            var v = s.length;
            for (v = s.length; v--; v >= 0) {
                var g = s[v];
                if (g.aePanel("option", "tabId") == x) {
                    g.aePanel("open");
                    if (l = this._getUnloadedUrl(x)) {
                        g.aePanel("reload", l);
                        this._removeLoadInfo(x);
                    }
                }
            }
            for (v = s.length; v--; v >= 0) {
                var g = s[v];
                if (g.aePanel("option", "tabId") != x) {
                    g.aePanel("close");
                }
            }
            if (this._checkScroller()) {
                q.stop(true, true);
                z.clearQueue();
                var A = z.find(">div." + h.ctab + " >div.op");
                var u = r.parent().offset().left;
                var w = u + r.parent().outerWidth(true);
                var p = 4 - u;
                var f = A.offset().left - w;
                if (p >= 0) {
                    this._scroll(p, this._scrollCbFn());
                } else {
                    if (f <= 0) {
                        this._scroll(f, this._scrollCbFn());
                    } else {
                        this._scrollCbFn()();
                    }
                }
            }
            var y = this.history
              , m = $.inArray(x, y);
            m === -1 ? y.push(x) : y.push(y.splice(m, 1)[0]);
            h.onActivate && this._trigger("onActivate", null , t);
        },
        _getUnloadedUrl: function(g) {
            var h = this.loadInfo;
            for (var f in h) {
                if (h[f].tabId === g && h[f].loaded === false) {
                    return h[f].url;
                }
            }
            return null ;
        },
        _removeLoadInfo: function(i) {
            var g = this.loadInfo, f, h;
            if (g) {
                f = g.length;
                while (h = g[--f]) {
                    if (h.tabId === i) {
                        g.splice(f, 1);
                        break;
                    }
                }
            }
        },
        _addLoadInfo: function(g, f) {
            this.loadInfo.push({
                tabId: g,
                loaded: false,
                url: f
            });
        },
        _getAlter: function(i) {
            var h = this.element, g = this.options, f;
            if (typeof i == "number") {
                f = h.find(">div." + g.ctab + " li:eq(" + i + ") a").attr("tabId");
            } else {
                if (typeof i == "string") {
                    h.find(">div." + g.ctab + " li a").each(function(j) {
                        if ($(this).attr("tabId") == i) {
                            f = j;
                            return false;
                        }
                    });
                }
            }
            return f === undefined ? null  : f;
        },
        _getActivated: function() {
            return this.options.activeTabId;
        },
        _add: function(h) {
            var m = this
              , k = this.element
              , q = this.options
              , l = this.items;
            var i = k.find(">div." + q.ctab + " ul");
            var g = h.tabId ? h.tabId : "tabId-" + q.random + "-" + q.id++;
            h.index = h.index || "last";
            if (h.index == "last" || h.index > l.length - 1) {
                h.index = l.length;
            }
            h.title = h.title || "New Title " + g;
            h.url = $.trim(h.url);
            h.content = $.trim(h.content);
            if (h.url) {
                h.content = undefined;
            } else {
                h.url = undefined;
                h.content = h.content || "New Content " + g;
            }
            if (q.onBeforeAdd && m._trigger("onBeforeAdd", null , h) == false) {
                return false;
            }
            var o = $("<li></li>");
            var p = $("<a></a>").attr({
                href: "#" + g,
                tabId: g
            }).appendTo(o);
            var n = $("<span></span>").html(h.title).appendTo(o);
            if ((h.closable === true) || (h.closable == undefined && q.closable)) {
                p.addClass("closed");
            }
            var j = {
                initType: "js",
                tabId: g,
                title: p.text(),
                _closeMode: "visibility",
                header: false,
                closed: true,
                onSuccess: function(r, t, s) {
                    m._trigger("onLoadComplete", null , g);
                },
                onError: function(s, t, r) {
                    m._trigger("onLoadComplete", null , g);
                }
            };
            $.extend(j, h);
            if (h.url && (q.lazyLoad || h.lazyLoad)) {
                m.loadInfo.push({
                    tabId: g,
                    url: h.url,
                    loaded: false
                });
                j.url = null ;
            }
            var f = new b($("<div>" + (h.content || "") + "</div>")[0],j);
            if (h.index == l.length) {
                l[h.index] = f;
                o.appendTo(i);
            } else {
                l.splice(h.index, 0, f);
                i.children().eq(h.index).before(o);
            }
            if (i.innerWidth() - o.position().left < 500) {
                i.width(i.width() + 500);
            }
            this._checkScroller() && this._enableScroller();
            l[h.index].addClass("ae-state-nobd").parent().insertAfter(h.index > 0 ? k.find(">div.ae-tabs-panels").children().eq(h.index - 1) : 0);
            this._purgeEvent();
            this._buildEvent();
            this._trigger("onAdd", null , j);
            if (!(h.activateNew === false)) {
                this._activate(h.index);
            }
        },
        _close: function(k) {
            var v = this.element
              , h = this.options
              , p = this.items
              , o = v.find(">div." + h.ctab)
              , l = v.find(">div.ae-tabs-panels")
              , n = o.find("ul")
              , q = v.height()
              , x = k
              , u = this.history;
            k = (k === undefined ? h.active : k);
            if (typeof k == "string") {
                k = this._getAlter(k);
            } else {
                x = this._getAlter(k);
            }
            if (h.onBeforeClose && this._trigger("onBeforeClose", null , k) == false) {
                return false;
            }
            this._removeLoadInfo(this._getAlter(k));
            o.find("li").eq(k).remove();
            l.children().eq(k).empty().remove();
            p.splice(k, 1);
            if (l.children().length == 0) {
                l.css({
                    height: q - o.outerHeight()
                });
            }
            for (var s = u.length - 1; s >= 0; s--) {
                if (x === u[s]) {
                    u.splice(s, 1);
                    break;
                }
            }
            h.onClose && this._trigger("onClose", null , k);
            if (p.length == 0) {
                h.active = -1;
                h.activeTabId = null ;
                return;
            } else {
                if (k == h.active) {
                    h.active = -1;
                    this._activate(u.length > 0 ? u.pop() : 0);
                } else {
                    k < h.active && h.active--;
                    if (this._checkScroller()) {
                        n.stop(true, true);
                        v.clearQueue();
                        var j = n.children(":last");
                        var f = n.children(":first");
                        var w = v.find(">div." + h.ctab + " >div.op");
                        var r = j.offset().left;
                        var t = r + j.outerWidth(true);
                        var m = 4 - f.offset().left;
                        var g = w.offset().left - t;
                        if (g > 0) {
                            this._scroll(g, this._scrollCbFn());
                        } else {
                            this._scroll(m, this._scrollCbFn());
                        }
                    }
                }
            }
        },
        _closeAll: function() {
            var n = this.element
              , j = this.options
              , h = this.items
              , m = n.find(">div." + j.ctab)
              , l = n.find(">div.ae-tabs-panels")
              , g = n.height();
            if (j.onBeforeCloseAll && this._trigger("onBeforeCloseAll") === false) {
                return false;
            }
            for (var k = 0, f = h.length; k < f; k++) {
                this._removeLoadInfo(h[k].aePanel("option", "tabId"));
            }
            m.find("li").remove();
            l.empty();
            h.splice(0, h.length);
            l.css({
                height: g - m.outerHeight()
            });
            j.active = -1;
            j.activeTabId = null ;
            this.history = [];
            this._doLayout();
            j.onCloseAll && this._trigger("onCloseAll");
        },
        _checkScroller: function() {
            var l = this.element
              , j = this.options;
            if (!j.scrollable) {
                return false;
            }
            var i = l.find(">div." + j.ctab + " ul");
            var g = l.find(">div." + j.ctab + " >div.tab");
            var f = 4;
            i.children().each(function() {
                f += $(this).outerWidth(true);
            });
            if (f > i.parent().parent().innerWidth()) {
                if (g.siblings().length === 0) {
                    var k = $("<div></div>").insertAfter(g).addClass("op");
                    var m = $("<a></a>").appendTo(k).addClass("pre");
                    var h = $("<a></a>").appendTo(k).addClass("next");
                }
                return true;
            } else {
                g.siblings().remove();
                i.parent().animate({
                    left: 0
                }, "normal", "swing");
                return false;
            }
        },
        _scrollCbFn: function() {
            var f = this;
            return function() {
                f._enableScroller();
            }
            ;
        },
        _enableScroller: function() {
            var m = this.element.find(">div." + this.options.ctab)
              , k = m.find("ul");
            if (m.length == 0 || k.length == 0) {
                return false;
            }
            var n = m.find(">div.op >a.pre")
              , i = m.find(">div.op >a.next")
              , l = k.children(":last")
              , f = m.offset().left
              , j = n.offset().left
              , g = k.offset().left
              , h = l.offset().left + l.outerWidth(true);
            n.toggleClass(a, g >= f);
            i.toggleClass(d, h <= j);
        },
        _scroll: function(f, o) {
            var n = this
              , m = this.element
              , p = this.options;
            var k = m.find(">div." + p.ctab + " ul")
              , l = k.children(":last")
              , j = k.children(":first")
              , h = m.find(">div." + p.ctab + " >div.op >a");
            if (f == 0) {
                return;
            }
            var i = h.parent().offset();
            var g = function(r) {
                if (f > 0 && h.hasClass("pre " + a) || f < 0 && h.hasClass("next " + d)) {
                    k.stop(true, true);
                    m.clearQueue();
                    return;
                }
                var q = false;
                f = (f > 0) ? "+=" + Math.min(Math.abs(j.offset().left) + 4, f) : "-=" + Math.min((l.offset().left + l.outerWidth(true) - i.left), Math.abs(f));
                n.isScrolling = true;
                k.parent().animate({
                    left: f + "px"
                }, "normal", "swing", function() {
                    !!o && o();
                    n.isScrolling = false;
                    r();
                });
            }
            ;
            m.queue(g);
            if (m.queue().length == 1 && !n.isScrolling) {
                m.dequeue();
            }
        },
        _getLength: function() {
            return this.items.length;
        },
        _doLayout: function() {
            this._checkScroller() && this._enableScroller();
        },
        _setDataSource: function(i) {
            var j = this.element
              , f = this.items
              , h = this.options
              , g = this._getAlter(i.index);
            i.url = $.trim(i.url);
            i.content = $.trim(i.content);
            if (i.url) {
                if (h.lazyLoad !== false) {
                    this._addLoadInfo(g, i.url);
                    f[i.index].aePanel("option", "url", i.url);
                } else {
                    this._removeLoadInfo(g);
                    f[i.index].aePanel("reload", i.url);
                }
            } else {
                f[i.index].html(i.content);
            }
        },
        _reload: function(i, h, j) {
            var k = this.element
              , f = this.items
              , g = this._getAlter(i);
            if (h) {
                this._removeLoadInfo(g);
                f[i].aePanel("reload", h);
            } else {
                if (j) {
                    f[i].html(j);
                } else {
                    f[i].aePanel("reload", this._getUnloadedUrl(g));
                    this._removeLoadInfo(g);
                }
            }
        },
        add: function(f) {
            this._add(f);
        },
        close: function(f) {
            this._close(f);
        },
        closeAll: function() {
            this._closeAll();
        },
        activate: function(f) {
            this._activate(f);
        },
        getAlter: function(f) {
            return this._getAlter(f);
        },
        getActivated: function() {
            return this._getActivated();
        },
        getLength: function() {
            return this._getLength();
        },
        setDataSource: function(f) {
            if (f.index === undefined || (!f.url && !f.content)) {
                return;
            }
            this._setDataSource(f);
        },
        reload: function(g, f, h) {
            this._reload(g, f, h);
        },
        doLayout: function() {
            this._doLayout();
        }
    });
});
define("ui-grid", function(require, exports, moudles) {
    $.ae.lang.aeGrid = {
        loadingMsg: "Loading...",
        emptyMsg: "No Result",
        errorMsg: "Load Error",
        pageText: "Page {index}, Total Page {totalPage}",
        pageStat: "Total {total} Data，From {from} To {to}"
    };
    $.aeWidget("ae.aeGrid", {
        options: {
            height: 462,
            width: "100%",
            colModel: false,
            autoFit: true,
            showIndex: true,
            dataSource: false,
            extraData: {},
            method: "POST",
            loadingMsg: $.ae.lang.aeGrid.loadingMsg,
            emptyMsg: $.ae.lang.aeGrid.emptyMsg,
            errorMsg: $.ae.lang.aeGrid.errorMsg,
            preProcess: false,
            pagingSize: 10,
            rowClasses: ["oddRow", "evenRow"],
            singleSelect: true,
            title: "",
            onRowSelect: function(c, b, a) {},
            onRowDeselect: function(c, b, a) {},
            onRowClick: function(c, b, a) {},
            onRowDblClick: function(c, b, a) {},
            onPageChange: undefined,
            onSuccess: function(a) {},
            onError: function(a, b) {},
            onRefresh: function(c, a, b) {},
            _onRefreshCallbacks: [],
            _onResizableCallbacks: [],
            _onResizeCallbacks: [],
            initType: "html",
            _minWidth: 100,
            pagingAlign: "right",
            pagingType: "",
            singleRowClass: false,
            _defaultThHeight: 34,
            _params: "",
            _header: "",
            _clickTimer: null ,
            dataField: "",
            isPaging: false,
            showMsg: true,
            _initial: false
        },
        _create: function() {
            var c = this.options
              , b = this.element;
            if (c._initial) {
                return;
            } else {
                c._initial = true;
            }
            if (c.initType == "html") {
                this._buildOptions(c, b);
            } else {
                this._buildOptionsEvents(c);
            }
            b.wrap('<div class="om-grid om-widget om-widget-content"></div>');
            this.grid = b.parent();
            var a = [];
            a.push('<div class="c_title"></div>');
            a.push('<div class="hDiv om-state-default"><div class="hDivBox"><table cellPadding="0" cellSpacing="0"></table></div></div>');
            a.push('<div class="bDiv" style="width:auto"><table cellPadding="0" cellSpacing="0"><tbody></tbody></table></div>');
            a.push('<div class="c_nodata" style="display:none;"><span class="e_loadingBar_small">' + c.loadingMsg + "</span></div>");
            a.push('<div class="c_nodata" style="display:none;"><span class="e_tip"></span></div>');
            a.push('<div class="c_page" style="display:none;"></div>');
            this.grid.append(a.join(""));
            this.titleDiv = this.grid.find(".c_title");
            this.hDiv = this.grid.find(".hDiv");
            this.bDiv = this.grid.find(".bDiv");
            this.pDiv = this.grid.find(".c_page");
            this.element = this.bDiv.children().eq(0);
            this.tbody = this.element.children().eq(0);
            this.loadMask = this.grid.find(".c_nodata").eq(0);
            this.msgDiv = this.grid.find(".c_nodata").eq(1);
            b.empty();
            b.css("border-width", 0).hide();
            if (!$.isArray(this._getColModel())) {
                return;
            }
            this._guid = 0;
            this._selectIndex = -1;
            c._onRefreshCallbacks.push(function() {
                this._refreshHeaderCheckBox();
            });
            this._bindScrollEnvent();
        },
        _init: function() {
            var b = this.options
              , a = this.grid;
            this._measure(a, b);
            if (!$.isArray(this._getColModel())) {
                return;
            }
            this._extraData = {};
            this.tbody.empty();
            this.hDiv.find("table").empty();
            this.pDiv.empty();
            this.titleDiv.empty();
            this._buildTableHead();
            this._buildPagingToolBar();
            this._bindSelectAndClickEnvent();
            this._makeColsResizable();
            this._buildTitle();
            this._resetHeight();
            this.pageData = {
                nowPage: 1,
                totalPages: 1
            };
        },
        _buildOptions: function(b, a) {
            b.id = a.attr("id") != undefined ? a.attr("id") : "";
            b.aeType = a.attr("aeType") || "aeGrid";
            b.title = $.evalI18nString(a.attr("title"));
            b.width = a.attr("width") || b.width;
            b.height = a.attr("height") || b.height;
            b.singleSelect = a.attr("singleSelect") == "true" ? true : false;
            b.dataSource = a.attr("dataSource") || b.dataSource;
            b.showIndex = a.attr("showIndex") == "true" ? true : false;
            b.autoFit = a.attr("autoFit") == "false" ? false : true;
            b.emptyMsg = $.evalI18nString(a.attr("emptyMsg")) || b.emptyMsg;
            b.errorMsg = $.evalI18nString(a.attr("errorMsg")) || b.errorMsg;
            b.loadingMsg = $.evalI18nString(a.attr("loadingMsg")) || b.loadingMsg;
            b.pagingType = a.attr("pagingType") || b.pagingType;
            b.pagingAlign = a.attr("pagingAlign") || b.pagingAlign;
            b.singleRowClass = a.attr("singleRowClass") == "true" ? true : false;
            b.dataField = a.attr("dataField") || b.dataField;
            if (a.attr("pagingSize") && "" != a.attr("pagingSize")) {
                b.pagingSize = parseInt(a.attr("pagingSize"));
            }
            b.showMsg = a.attr("showMsg") == "false" ? false : true;
            b.datafield = a.attr("datafield") || b.datafield;
            b.isPaging = a.attr("isPaging") == "true" ? true : false;
            b.preProcess = a.attr("preProcess") || b.preProcess;
            b.treeColumn = a.attr("treeColumn") || "";
            b.treeIdField = a.attr("treeIdField") || "";
            b.treePidField = a.attr("treePidField") || "";
            b.treeSortField = a.attr("treeSortField") || "";
            b.onRowClick = a.attr("onRowClick") || b.onRowClick;
            b.onRowSelect = a.attr("onRowSelect") || b.onRowSelect;
            b.onRowDeselect = a.attr("onRowDeselect") || b.onRowDeselect;
            b.onRowDblClick = a.attr("onRowDblClick") || b.onRowDblClick;
            b.onPageChange = a.attr("onPageChange") || b.onPageChange;
            b.onRefresh = a.attr("onRefresh") || b.onRefresh;
            b.onSuccess = a.attr("onSuccess") || b.onSuccess;
            b.onError = a.attr("onError") || b.onError;
            this._buildOptionsEvents(b);
            var c = a.children("[datafield]");
            if (typeof (c) != "undefined" && c.length) {
                b.colModel = new Array();
                c.each(function(d, g) {
                    var e = {}
                      , g = $(g);
                    e.abbr = g.attr("datafield") || "";
                    if (e.abbr != "") {
                        e.abbr = e.abbr.replace(new RegExp(/\./g), "|");
                    }
                    e.title = $.evalI18nString(g.attr("title")) || "";
                    e.width = g.attr("width") || "";
                    e.headAlign = g.attr("headAlign") || "center";
                    e.align = g.attr("align") || "left";
                    e.visible = g.attr("visible") == "false" ? false : true;
                    e.wrap = g.attr("wrap") == "true" ? true : false;
                    e.renderer = g.attr("renderer") || undefined;
                    var f = e.renderer;
                    if ($.isString(f)) {
                        e.renderer = f ? function(m, l, n) {
                            var j = f.indexOf("(");
                            var h = j > 0 ? f.substring(0, j) : f;
                            var k = "return window." + h + "?" + h + ".call(window,c,rd,ri):false;";
                            return new Function("c","rd","ri",k)(m, l, n);
                        }
                         : undefined;
                    }
                    e.sortable = g.attr("sortable") == "true" || false;
                    b.colModel.push(e);
                });
            }
        },
        _buildOptionsEvents: function(b) {
            this._buildCommonEvent(b, "onRowClick", b.onRowClick);
            this._buildCommonEvent(b, "onRowSelect", b.onRowSelect);
            this._buildCommonEvent(b, "onRowDeselect", b.onRowDeselect);
            this._buildCommonEvent(b, "onRowDblClick", b.onRowDblClick);
            this._buildCommonEvent(b, "onPageChange", b.onPageChange);
            this._buildCommonEvent(b, "onRefresh", b.onRefresh);
            var d = b.onSuccess;
            if ($.isString(d)) {
                b.onSuccess = d ? function(j, e, k) {
                    var g = d.indexOf("(");
                    var f = g > 0 ? d.substring(0, g) : d;
                    var h = "return window." + f + "?" + f + ".call(window,d,t,x):false;";
                    return new Function("d","t","x",h)(j, e, k);
                }
                 : function(f, e, g) {}
                ;
            }
            var c = b.onError;
            if ($.isString(c)) {
                b.onError = c ? function(j, l, k, h) {
                    var f = c.indexOf("(");
                    var e = f > 0 ? c.substring(0, f) : c;
                    var g = "return window." + e + "?" + e + ".call(window,x,t,er,e):false;";
                    return new Function("x","t","er","e",g)(j, l, k, h);
                }
                 : function(f, h, g, e) {}
                ;
            }
            var a = b.preProcess;
            if ($.isString(a)) {
                b.preProcess = a ? function(h) {
                    var f = a.indexOf("(");
                    var e = f > 0 ? a.substring(0, f) : a;
                    var g = "return window." + e + "?" + e + ".call(window,d):false;";
                    return new Function("d",g)(h);
                }
                 : false;
            }
        },
        _buildCommonEvent: function(a, c, b) {
            if ($.isString(b)) {
                a[c] = b ? function(j, h, g) {
                    var e = b.indexOf("(");
                    var d = e > 0 ? b.substring(0, e) : b;
                    var f = "return window." + d + "?" + d + ".call(window,p1,p2,e):false;";
                    return new Function("p1","p2","e",f)(j, h, g);
                }
                 : function(f, e, d) {}
                ;
            }
        },
        _measure: function(a, b) {
            a.outerWidth(b.width === "fit" ? a.parent().width() : b.width);
            a.outerHeight(b.height === "fit" ? a.parent().height() : b.height);
        },
        _resetHeight: function() {
            var a = this.hDiv.outerHeight(true) < 10 ? this.options._defaultThHeight : this.hDiv.outerHeight(true)
              , b = this.options.isPaging ? this.pDiv.outerHeight(true) : 0
              , c = this.options.title ? this.titleDiv.outerHeight(true) : 0;
            this.bDiv.outerHeight(this.grid.height() - a - b - c);
        },
        _resetWidth: function() {
            var f = this.options
              , d = this._getColModel()
              , b = -1
              , a = this.grid
              , e = this.thead
              , g = 0;
            $.each(d, function(i, h) {
                var j = h.width || f._minWidth;
                if (h.width == "autoExpand") {
                    j = 0;
                    b = i;
                }
                e.find("th[axis='col" + i + "'] >div").width(j);
                g += j;
            });
            this._fixHeaderWidth(b, g);
            var c = {};
            $(this._getHeaderCols()).each(function() {
                c[$(this).attr("abbr")] = $(this).find("div").width();
            });
            this.tbody.find("td[abbr]").each(function(i, j) {
                var h = $(j).prop("abbr");
                if (c[h] != null ) {
                    $(j).find(">div:first").width(c[h]);
                }
            });
        },
        _getColModel: function() {
            return this.options.colModel;
        },
        _buildTitle: function() {
            var a = this.titleDiv
              , b = this.options.title;
            if (b && b != "") {
                a.html("<div class='text'>" + b + "</div>").show();
            } else {
                a.empty().hide();
            }
        },
        _fixHeaderWidth: function(b, j) {
            var k = this.grid
              , h = this.thead
              , i = this._getColModel()
              , c = this.options
              , f = k.width()
              , d = null ;
            if (b != -1) {
                var f = k.width() - 32
                  , d = h.find('th[axis="col' + b + '"] div');
                d.parent().hide();
                var e = f - h.width();
                d.parent().show();
                if (e <= 0) {
                    d.css("width", 60);
                } else {
                    d.css("width", e);
                }
            } else {
                if (c.autoFit) {
                    var f = k.width() - 22
                      , e = f - h.width()
                      , g = 1 + e / j
                      , a = h.find('th[axis^="col"] >div');
                    $.each(i, function(l) {
                        var m = a.eq(l);
                        m.width(parseInt(m.width() * g));
                    });
                }
            }
        },
        _buildTableHead: function() {
            var e = this.options
              , f = this.element
              , a = this.grid
              , k = this._getColModel()
              , o = 0
              , g = 25
              , q = 17
              , c = -1;
            thead = $("<thead></thead>");
            tr = $("<tr></tr>").appendTo(thead);
            if (e.showIndex) {
                var p = $('<th axis="indexCol" class="indexCol" align="center"><div class="indexheader" style="text-align:center;width:' + g + 'px;"></div></th>');
                tr.append(p);
            }
            if (!e.singleSelect) {
                var p = $('<th axis="checkboxCol" class="checkboxCol" align="center"><div style="text-align:center;width:' + q + 'px;"><input class="e_checkbox" type="checkbox"></input></div></th>');
                tr.append(p);
            }
            for (var h = 0, j = k.length; h < j; h++) {
                var n = k[h]
                  , b = n.width || e._minWidth
                  , l = n.headAlign || "center";
                if (b == "autoExpand") {
                    b = 0;
                    c = h;
                }
                if (!n.visible) {
                    b = 0;
                    n.width = 0;
                }
                if ($.isString(b) && b != "") {
                    b = parseInt(b);
                }
                var m = $("<div></div>").html(n.title).css({
                    "text-align": l,
                    width: b
                });
                n.wrap && m.addClass("wrap");
                var d = $("<th></th>").attr("axis", "col" + h).addClass("col" + h).append(m);
                if (!n.visible) {
                    d.hide();
                }
                if (n.abbr) {
                    d.attr("abbr", n.abbr);
                }
                if (n.align) {
                    d.attr("align", n.align);
                }
                o += b;
                tr.append(d);
            }
            f.prepend(thead);
            $("table", this.hDiv).append(thead);
            this.thead = thead;
            this._fixHeaderWidth(c, o);
            thead = null ;
        },
        _buildPagingToolBar: function() {
            var e = this.options;
            if (e.pagingSize <= 0) {
                e.isPaging = false;
            }
            if (!e.isPaging) {
                this.pDiv.css("border-width", 0).hide();
                return;
            }
            var c = this
              , d = this.element
              , a = this.pDiv
              , f = [];
            if (e.pagingType == "simple") {
                f.push('<div class="turn turn-simple"><a class="first e_dis"></a>');
                f.push('<a class="pre"></a><span class="stat"><span>1</span>/1</span>');
                f.push('<a class="next"></a><a class="last e_dis"></a>');
                f.push('<a class="e_ico-refresh e_dis"></a></div>');
            } else {
                if (e.pagingType == "number") {} else {
                    f.push('<div class="turn turn-num"><a class="first">First</a>');
                    f.push('<a class="pre">Previous</a>');
                    f.push('<span class="stat"><span class="e_input"><span><input type="text" value=""/></span></span><span class="total"></span></span>');
                    f.push('<a class="next">Next</a><a class="last">Last</a>');
                }
            }
            a.show().html(f.join(""));
            var b = $(".turn", a);
            if (e.pagingAlign == "left") {
                b.addClass("left");
            } else {
                if (e.pagingAlign == "center") {
                    b.addClass("center");
                } else {
                    b.addClass("right");
                }
            }
            $(".refresh", a).click(function() {
                c._populate();
            });
            $(".first", a).click(function() {
                c._changePage("first");
            });
            $(".pre", a).click(function() {
                c._changePage("prev");
            });
            $(".next", a).click(function() {
                c._changePage("next");
            });
            $(".last", a).click(function() {
                c._changePage("last");
            });
            $("input", a).keydown(function(g) {
                if (g.keyCode == $.ae.keyCode.ENTER) {
                    c._changePage("input");
                }
            });
        },
        _changePage: function(b) {
            if (this.loading) {
                return true;
            }
            var d = this.element
              , e = this.options
              , a = this.grid
              , c = this.pageData
              , g = c.nowPage
              , i = c.totalPages
              , f = g
              , h = this.pDiv.find("input");
            this._oldPage = g;
            switch (b) {
            case "first":
                f = 1;
                break;
            case "prev":
                if (g > 1) {
                    f = g - 1;
                }
                break;
            case "next":
                if (g < i) {
                    f = g + 1;
                }
                break;
            case "last":
                f = i;
                break;
            case "input":
                var j = parseInt(h.val());
                if (isNaN(j)) {
                    j = g;
                }
                if (j < 1) {
                    j = 1;
                } else {
                    if (j > i) {
                        j = i;
                    }
                }
                h.val(j);
                f = j;
                break;
            default:
                if (/\d/.test(b)) {
                    var j = parseInt(b);
                    if (isNaN(j)) {
                        j = 1;
                    }
                    if (j < 1) {
                        j = 1;
                    } else {
                        if (j > i) {
                            j = i;
                        }
                    }
                    h.val(j);
                    f = j;
                }
            }
            if (f == g) {
                return false;
            }
            if (e.onPageChange && this._trigger("onPageChange", null , b, f) === false) {
                return;
            }
            c.nowPage = f;
            this._populate();
        },
        _populate: function() {
            var j = this
              , d = j.element
              , a = j.grid
              , e = j.options
              , i = j.msgDiv;
            if (!e.dataSource && e.showMsg) {
                i.find("span").html(e.emptyMsg);
                i.show();
                j._showPagingBar(false);
                return false;
            }
            if (j.loading) {
                return true;
            }
            var c = j.pageData
              , g = c.nowPage || 1
              , b = j.loadMask
              , h = e.pagingSize;
            start = -1,
            end = -1;
            j.loading = true;
            i.hide();
            b.show();
            if (h > 0) {
                start = j.getStart();
                end = j.getEnd();
            }
            var f = e._params;
            if (e.isPaging) {
                f += "&start=" + start + "&end=" + end;
            }
            $.aries.ajax.post(e.dataSource, f, function(n) {
                j.loading = false;
                var o = e.onSuccess;
                if (n && e.dataField) {
                    n = $.aries.common.getDataByDatafield(n, e.dataField);
                }
                if (typeof (o) == "function") {
                    j._trigger("onSuccess", null , n);
                }
                if ($.isArray(n)) {
                    var m = {};
                    m.total = n.length;
                    m.rows = n;
                    n = m;
                }
                if (n) {
                    if (n.rows && n.rows.length && e.treeColumn) {
                        n.rows = j._buildTreeData(n.rows);
                    }
                    if (n.total && $.isString(n.total)) {
                        n.total = parseInt(n.total);
                    }
                    if (n.total) {
                        j._addData(n);
                    }
                }
                for (var l = 0, k = e._onRefreshCallbacks.length; l < k; l++) {
                    e._onRefreshCallbacks[l].call(j);
                }
                j._trigger("onRefresh", null , g, n.rows);
                b.hide();
                if (!n || n.total == 0) {
                    if (e.showMsg) {
                        i.find("span").html(e.emptyMsg);
                        i.show();
                    }
                    j._showPagingBar(false);
                    j.clear();
                } else {
                    j._showPagingBar(true);
                }
            }, function(l, n) {
                if (e.showMsg) {
                    i.find("span").html(e.errorMsg);
                }
                j._showPagingBar(false);
                j.loading = false;
                try {
                    var k = e.onError;
                    if (typeof (k) == "function") {
                        k(l, n);
                    }
                } catch (m) {} finally {
                    b.hide();
                    if (e.showMsg) {
                        i.show();
                    }
                    j.loading = false;
                    j.clear();
                    return false;
                }
            }, $.extend({}, {
                type: e.method
            }), e._header);
        },
        _addData: function(f) {
            var e = this.options
              , d = this.element
              , c = this.grid
              , b = e.preProcess
              , a = this.pageData;
            b && (f = b(f));
            a.data = f;
            if (f && f.total) {
                a.totalPages = Math.ceil(f.total / e.pagingSize);
            } else {
                a.totalPages = 1;
            }
            this._buildPager();
            this._renderDatas();
        },
        _buildPager: function() {
            var e = this.options;
            if (e.pagingSize <= 0) {
                return;
            }
            var d = this.element
              , a = this.pDiv
              , c = this.pageData
              , g = c.nowPage
              , f = c.totalPages
              , h = c.data
              , b = "";
            if (h && h.total === 0) {
                a.find("input").val(1);
                a.find("span:last").html("/" + 1);
            } else {
                a.find("input").val(g);
                a.find("span:last").html("/" + f);
            }
        },
        _renderDatas: function() {
            var l = this, d = this.element, c = this.options, a = this.grid, n = this._getHeaderCols(), h = [], i = this._getColModel(), r = c.rowClasses, b = this.tbody.empty(), u = c.singleRowClass, s = (typeof r === "function"), e = 0, o = '<td align="$" abbr="$" class="$" style="$" title="$"><div align="$" class="innerCol $" style="width:$px">$</div></td>', t = '<td align="$" abbr="$" class="$" style="$" title="$" aeNodeLevel="$" aeNodeId="$" aeNodePId="$"><a class="ico"></a><a align="$" class="text" style="">$</a></td>', g = [], m = [], k, f = this.pageData, p;
            if (c.isPaging) {
                if (!f.data.rows) {
                    f.data.rows = [];
                }
                h = f.data.rows;
                e = l.getStart();
            } else {
                h = f.data.rows;
            }
            l.hDiv.scrollLeft(0);
            $(n).each(function(j) {
                g[j] = $(this).find("div").width();
            });
            if (typeof h == "undefined") {
                return;
            }
            $.each(h, function(j, x) {
                var w = ""
                  , y = l._buildRowCellValues(i, x, j);
                if (!u) {
                    w = s ? r(j, x) : r[j % r.length];
                }
                m.push('<tr _grid_row_id="' + (l._guid++) + '" class="om-grid-row');
                if (w != "") {
                    m.push(" " + w);
                }
                m.push('" rawClass="om-grid-row');
                if (w != "") {
                    m.push(" " + w);
                }
                m.push('">');
                var v = x;
                $(n).each(function(G) {
                    var D = $(this).attr("axis"), B = false, H = "", F, C = true, A = "", I = "";
                    if (D == "indexCol") {
                        F = j + e;
                    } else {
                        if (D == "checkboxCol") {
                            F = '<input class="e_checkbox" type="checkbox"></input>';
                        } else {
                            if (D.substring(0, 3) == "col") {
                                var J = D.substring(3);
                                F = y[J];
                                if (i[J].wrap) {
                                    B = true;
                                }
                                C = i[J].visible;
                                H = i[J].align;
                                if (H == "") {
                                    H = "center";
                                }
                                I = F;
                                if (i[J].renderer) {
                                    I = "";
                                }
                            } else {
                                F = "";
                            }
                        }
                    }
                    if (!C) {
                        A = "display:none;";
                    }
                    if (c.treeColumn && c.treeColumn == this.abbr) {
                        var z = v["aeNodeLevel"];
                        if (!z) {
                            z = "1";
                        }
                        var E = v["aeHasChild"];
                        if (E) {
                            E = "unfold";
                        } else {
                            E = "file";
                        }
                        D = D + " level level-" + z + " " + E;
                        A += "width:" + (g[G]) + "px;";
                        k = [this.align, this.abbr, D, A, I, z, v["aeNodeId"], v["aeNodePId"], this.align, F];
                        p = 0;
                        m.push(t.replace(/\$/g, function() {
                            return k[p++];
                        }));
                    } else {
                        k = [this.align, this.abbr, D, A, I, this.align, B ? "wrap" : "", g[G], F];
                        p = 0;
                        m.push(o.replace(/\$/g, function() {
                            return k[p++];
                        }));
                    }
                });
                m.push("</tr>");
            });
            b.html(m.join(""));
            if (c.treeColumn) {
                var q = $("td[abbr=" + c.treeColumn + "] a.ico", this.tbody);
                if (q.length) {
                    q.prop("isOpen", true).bind("click", function(v) {
                        var j = $(this).prop("isOpen");
                        if (j) {
                            l._expandTreeNode($(this).parent().attr("aeNodeId"), false);
                            $(this).prop("isOpen", false);
                        } else {
                            l._expandTreeNode($(this).parent().attr("aeNodeId"), true);
                            $(this).prop("isOpen", true);
                        }
                        v.stopPropagation();
                    });
                }
            }
        },
        _getHeaderCols: function() {
            return this.hDiv.find("th[axis]");
        },
        _buildRowCellValues: function(h, b, g) {
            var e = h.length
              , j = [];
            for (var d = 0; d < e; d++) {
                var f = h[d], k, a = f.renderer;
                if (f.abbr.indexOf("|") > 0) {
                    k = $.aries.common.getDataByDatafield(b, f.abbr.replace(new RegExp(/\|/g), "."));
                }
                if (k == undefined) {
                    k = b[f.abbr] == undefined ? "" : b[f.abbr];
                }
                if (typeof a === "function") {
                    k = a(k, b, g);
                }
                j[d] = k;
                k = null ;
            }
            return j;
        },
        _bindScrollEnvent: function() {
            var a = this;
            this.bDiv.scroll(function() {
                a.hDiv.scrollLeft($(this).scrollLeft());
            });
        },
        _bindSelectAndClickEnvent: function() {
            var a = this;
            this.tbody.unbind();
            if (!this.options.singleSelect) {
                $("th.checkboxCol input.e_checkbox", this.thead).click(function() {
                    var d = $(this)
                      , c = a._getTrs().size();
                    if (d.attr("isChecked") == "true") {
                        d.prop("checked", false);
                        d.attr("isChecked", "false");
                        for (var b = 0; b < c; b++) {
                            a._rowDeSelect(b);
                        }
                    } else {
                        d.prop("checked", true);
                        d.attr("isChecked", "true");
                        for (var b = 0; b < c; b++) {
                            a._rowSelect(b);
                        }
                    }
                });
                this.tbody.delegate("td.checkboxCol input.e_checkbox", "click", function(c) {
                    var d = $(this).parent().parent().parent()
                      , b = a._getRowIndex(d);
                    if (d.hasClass("om-state-highlight")) {
                        a._rowDeSelect(b);
                    } else {
                        a._rowSelect(b);
                        a._selectIndex = b;
                    }
                    a._refreshHeaderCheckBox();
                    c.stopPropagation();
                });
                this.tbody.delegate("tr", "click", function(c) {
                    var d = $(this)
                      , b = a._getRowIndex(d);
                    a._clickTimer && clearTimeout(a._clickTimer);
                    a._clickTimer = setTimeout(function() {
                        if (d.hasClass("om-state-highlight")) {
                            a._rowDeSelect(b);
                        } else {
                            a._rowSelect(b);
                            a._selectIndex = b;
                        }
                        a._refreshHeaderCheckBox();
                        a._trigger("onRowClick", c, b, a._getRowData(b));
                    }, 300);
                });
                this.tbody.delegate("tr.om-grid-row", "dblclick", function(c) {
                    a._clickTimer && clearTimeout(a._clickTimer);
                    var d = $(this)
                      , b = a._getRowIndex(d);
                    if (d.hasClass("om-state-highlight")) {} else {
                        a._rowSelect(b);
                        a._refreshHeaderCheckBox();
                    }
                    a._trigger("onRowDblClick", c, b, a._getRowData(b));
                });
            } else {
                this.tbody.delegate("tr.om-grid-row", "click", function(c) {
                    var d = $(this)
                      , b = a._getRowIndex(d);
                    a._clickTimer && clearTimeout(a._clickTimer);
                    a._clickTimer = setTimeout(function() {
                        if (!d.hasClass("om-state-highlight")) {
                            (a._selectIndex != -1) && a._rowDeSelect(a._selectIndex);
                            a._rowSelect(b);
                            a._selectIndex = b;
                        }
                        a._trigger("onRowClick", c, b, a._getRowData(b));
                    }, 300);
                });
                this.tbody.delegate("tr.om-grid-row", "dblclick", function(c) {
                    a._clickTimer && clearTimeout(a._clickTimer);
                    var b = a._getRowIndex(this);
                    a._trigger("onRowDblClick", c, b, a._getRowData(b));
                });
            }
        },
        _getRowData: function(a) {
            return this.pageData.data.rows[a];
        },
        _rowSelect: function(c) {
            var d = this.element
              , b = this.tbody
              , e = this._getTrs().eq(c)
              , a = $("td.checkboxCol input.e_checkbox", e);
            e.attr("class", "om-state-highlight");
            if (a.length) {
                a.prop("checked", true);
            }
            this._trigger("onRowSelect", null , c, this._getRowData(c));
        },
        _rowDeSelect: function(d) {
            var e = this.element
              , c = this.tbody
              , f = this._getTrs().eq(d)
              , a = $("td.checkboxCol input.e_checkbox", f);
            f.removeClass("om-state-highlight");
            var b = f.attr("rawClass");
            if (b && b != "") {
                f.attr("class", b);
            }
            if (a.length) {
                a.prop("checked", false);
            }
            this._trigger("onRowDeselect", null , d, this._getRowData(d));
        },
        _refreshHeaderCheckBox: function() {
            var d = this.getSelections()
              , c = this._getTrs()
              , b = $("th.checkboxCol input.e_checkbox", this.thead)
              , a = c.length;
            if (a > 0 && a == d.length) {
                b.prop("checked", true);
                b.attr("isChecked", "true");
            } else {
                b.prop("checked", false);
                b.attr("isChecked", "false");
            }
        },
        _makeColsResizable: function() {
            var a = this, e = a.bDiv, c = a.grid, b = this.titleDiv, f, d = $('th[axis^="col"] div', a.thead);
            if (d.length == 0) {
                return;
            }
            d.aeResizable({
                handles: "e",
                containment: "document",
                minWidth: a.options._minWidth,
                resize: function(k, j) {
                    var l = $(this)
                      , h = l.parent().attr("abbr")
                      , i = $('td[abbr="' + h + '"] > div', a.tbody)
                      , g = a.hDiv;
                    l.width(k.size.width).height("");
                    i.width(k.size.width).height("");
                    e.height(c.height() - (a.options.title ? b.outerHeight(true) : 0) - (g.outerHeight(true) < 10 ? a.options._defaultThHeight : g.outerHeight(true)) - (a.options.isPaging ? a.pDiv.outerHeight(true) : 0));
                    g.scrollLeft(e.scrollLeft());
                },
                start: function(h, g) {
                    f = $(this).parent().width();
                },
                stop: function(n, m) {
                    var l = a.options._onResizableCallbacks
                      , k = $(this).parent()
                      , h = a.hDiv;
                    f = k.width() - f;
                    for (var j = 0, g = l.length; j < g; j++) {
                        l[j].call(a, k, f);
                    }
                    h.scrollLeft(e.scrollLeft());
                }
            });
        },
        _getRow: function(a) {
            return $("tr[_grid_row_id=" + a + "]", this.tbody);
        },
        _getRowIndex: function(a) {
            return this._getTrs().index(a);
        },
        _getTrs: function() {
            return this.tbody.find("tr");
        },
        _buildTreeData: function(d) {
            var c = []
              , a = []
              , b = this.options;
            col = {};
            col.idField = b.treeIdField;
            col.pIdField = b.treePidField;
            col.labelField = "";
            col.valueField = "";
            col.sortField = b.treeSortField;
            a = $.buildTreeData(d, col);
            if (a && a.length) {
                c = this._iterateBuildTreeData(a, c);
            }
            return c;
        },
        _iterateBuildTreeData: function(e, d) {
            if (!e || !e.length) {
                return d;
            }
            var c, b;
            for (var a = 0; a < e.length; a++) {
                c = e[a];
                b = c.aeChildren;
                if (b && b.length) {
                    c.aeHasChild = true;
                }
                if (typeof b != "undefined") {
                    delete c.aeChildren;
                }
                delete c.aeNodeLabel;
                delete c.aeNodeValue;
                d.push(c);
                if (b && b.length) {
                    this._iterateBuildTreeData(b, d);
                }
            }
            return d;
        },
        _showPagingBar: function(a) {
            if (a) {
                this.pDiv.show();
            } else {
                this.pDiv.hide();
            }
        },
        resize: function(c) {
            var d = this, f = this.options, b = this.grid, e, a;
            c = c || {};
            f.width = c.width || arguments[0] || f.width;
            f.height = c.height || arguments[1] || f.height;
            this._measure(b, f);
            this._resetWidth();
            this._resetHeight();
            $.each(f._onResizeCallbacks, function(g, h) {
                h.call(d);
            });
        },
        getData: function() {
            if (this.pageData.data) {
                return this.pageData.data.rows;
            }
            if (typeof this.pageData.data == "undefined") {
                return [];
            }
            return this.pageData.data;
        },
        refresh: function() {
            if (this.loading) {
                return true;
            }
            this.loading = true;
            var c = this.options;
            $(".pPageStat", this.pDiv).html(c.loadingMsg);
            this.loadMask.show();
            this._buildPager();
            this._renderDatas();
            this._trigger("onRefresh", null , this.pageData.nowPage || 1, this.pageData.data.rows);
            for (var b = 0, a = c._onRefreshCallbacks.length; b < a; b++) {
                c._onRefreshCallbacks[b].call(this);
            }
            this.loadMask.hide();
            this.loading = false;
        },
        reload: function(f, d, h) {
            if (this.loading) {
                return true;
            }
            var k = this
              , a = k.grid
              , c = k.options
              , j = k.msgDiv
              , b = k.pageData;
            k.clear();
            if (f) {
                if ($.isObject(f)) {
                    if (c.dataField) {
                        f = $.aries.common.getDataByDatafield(f, c.dataField);
                    }
                    k.loading = false;
                    j.hide();
                    if (!f || (f && (f.total == 0 || f.total == "0"))) {
                        if (c.showMsg) {
                            j.find("span").html(c.emptyMsg);
                            j.show();
                        }
                        k._showPagingBar(false);
                        k.clear();
                        return false;
                    }
                    if (typeof (f.rows) == "undefined" || f.rows.length == 0) {
                        k._showPagingBar(false);
                        return false;
                    }
                    if ($.isArray(f) && !f.rows) {
                        var l = f;
                        f = {};
                        f.rows = l;
                    }
                    if (c.isPaging) {
                        if (typeof h !== "undefined") {
                            h = parseInt(h) || 1;
                            if (h < 0) {
                                h = 1;
                            }
                            if (h > b.totalPages) {
                                h = b.totalPages;
                            }
                            b.nowPage = h;
                        }
                        k._addData(f);
                    } else {
                        b.data = f;
                        k._renderDatas();
                    }
                    for (var e = 0, g = c._onRefreshCallbacks.length; e < g; e++) {
                        c._onRefreshCallbacks[e].call(k);
                    }
                    k._trigger("onRefresh", null , b.nowPage, f.rows);
                } else {
                    if ($.isString(f)) {
                        this.options.dataSource = f;
                        if (d) {
                            this.options._params = d;
                        }
                        if (typeof h !== "undefined") {
                            h = parseInt(h) || 1;
                            if (h < 0) {
                                h = 1;
                            }
                            if (h > this.pageData.totalPages) {
                                h = this.pageData.totalPages;
                            }
                            this.pageData.nowPage = h;
                        } else {
                            this.pageData.nowPage = 1;
                        }
                        this._populate();
                    } else {
                        if ($.isArray(f)) {
                            if (c.dataField) {
                                f = $.aries.common.getDataByDatafield(f, c.dataField);
                            }
                            k.loading = false;
                            j.hide();
                            if (f.length == 0) {
                                if (c.showMsg) {
                                    j.find("span").html(c.emptyMsg);
                                    j.show();
                                }
                                k._showPagingBar(false);
                                k.clear();
                                return false;
                            }
                            if (c.treeColumn) {
                                f = k._buildTreeData(f);
                            }
                            var l = f;
                            f = {};
                            f.rows = l;
                            b.data = f;
                            k._renderDatas();
                        }
                    }
                }
            } else {
                if (c.showMsg) {
                    j.find("span").html(c.emptyMsg);
                    j.show();
                }
                k._showPagingBar(false);
                k.clear();
                return;
            }
            k._showPagingBar(true);
            k.loadMask.hide();
        },
        clear: function() {
            this.pageData.data = {
                rows: [],
                total: 0
            };
            this._addData({
                rows: [],
                total: 0
            });
            this.loadMask.hide();
        },
        setSelections: function(b) {
            var a = this;
            if (!$.isArray(b)) {
                b = [b];
            }
            var c = this.getSelections();
            $(c).each(function() {
                a._rowDeSelect(this);
            });
            $(b).each(function() {
                a._rowSelect(this);
            });
            a._refreshHeaderCheckBox();
        },
        getSelections: function(b) {
            var e = this
              , d = e._getTrs()
              , f = d.filter(".om-state-highlight")
              , a = [];
            if (b) {
                var c = e.getData();
                if (c && c.length) {
                    f.each(function(g, h) {
                        a[a.length] = c[d.index($(h))];
                    });
                }
            } else {
                f.each(function(g, h) {
                    a[a.length] = d.index($(h));
                });
            }
            return a;
        },
        destroy: function() {
            var a = this.element;
            this.grid.after(a).remove();
        },
        getStart: function() {
            var c = this.options
              , b = this.pageData
              , d = b.nowPage || 1
              , a = c.pagingSize;
            start = -1;
            if (a > 0) {
                start = a * (d - 1) + 1;
            }
            return start;
        },
        getEnd: function() {
            var c = this.options
              , b = this.pageData
              , d = b.nowPage || 1
              , a = c.pagingSize;
            end = -1;
            if (a > 0) {
                end = a * d;
            }
            return end;
        },
        setAjaxHeader: function(a) {
            this.options._header = a;
        },
        getAjaxHeader: function() {
            return this.options._header;
        },
        getValue: function(f, d) {
            var c = this
              , a = "";
            if (parseInt(f) >= 0 && d) {
                var b = c.getData();
                if (b && b.length) {
                    var e = b[f];
                    if (e) {
                        a = e[d];
                    }
                }
            }
            return a;
        },
        setValue: function(g, c, f) {
            if (parseInt(g) >= 0 && c) {
                var e = this._getRow(g), b = this.options, a, d;
                if (e.length) {
                    if (b.treeColumn == c) {
                        a = $('td[abbr="' + c + '"] > a.text', e);
                    } else {
                        a = $('td[abbr="' + c + '"] > div', e);
                    }
                    a.html(f);
                    d = this._getRowData(g);
                    if (d) {
                        d[c] = f;
                    }
                }
            }
        },
        _expandTreeNode: function(c, b) {
            if (c) {
                var g = $("td[aeNodeId=" + c + "]", this.tbody);
                if (g.length) {
                    var a, f = g.parent(), e, d;
                    var a = f.nextAll("tr");
                    e = a.filter(function(h) {
                        return $("td[aeNodeLevel]", $(this)).attr("aeNodeLevel") <= g.attr("aeNodeLevel");
                    });
                    if (e.length) {
                        d = e.eq(0);
                        var c = a.index(d);
                        a = f.nextAll("tr:lt(" + c + ")");
                    }
                    if (a.length) {
                        if (b) {
                            a.show();
                            this._changeTreeNodeState(f, true);
                        } else {
                            a.hide();
                            this._changeTreeNodeState(f, false);
                        }
                    }
                }
            }
        },
        _changeTreeNodeState: function(b, a) {
            if (a) {
                $("td[aeNodeLevel]", b).removeClass("fold").addClass("unfold");
            } else {
                $("td[aeNodeLevel]", b).removeClass("unfold").addClass("fold");
            }
        }
    });
});
define("ui-breadcrumb", function(require, exports, moudles) {
    $.aeWidget("ae.aeBreadcrumb", {
        options: {
            initType: "html"
        },
        _create: function() {
            var a = this.options
              , b = this.element;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            b.addClass("e_crumb").append("<span>Your position:</span>").hide();
        },
        _init: function() {
            this._buildEvent();
        },
        _buildOptions: function(a, b) {
            var c = b.attr("onLeave");
            a.onLeave = c ? function(g) {
                if ($.isString(c)) {
                    var e = c.indexOf("(");
                    var d = e > 0 ? c.substring(0, e) : c;
                    var f = "return window." + d + "?" + d + ".call(window, e):false;";
                    return new Function("e",f)(g);
                }
            }
             : "";
        },
        reload: function(a) {
            this._loadData(a);
        },
        _buildEvent: function() {
            var a = this;
            this.element.unbind("click").bind("click", function(g) {
                var b = $(g.target);
                if (b[0].nodeName != "A") {
                    return;
                }
                var f = a.options.onLeave;
                var c = b.attr("url");
                var d = !(new RegExp("^#").test(c) || new RegExp("^javascript:").test(c));
                if (d && f && a._trigger("onLeave") === false) {
                    c = "#nogo";
                }
                location.href = c;
            });
        },
        _loadData: function(b) {
            var d = ""
              , a = this.element;
            $(b).each(function(h, j) {
                var i = j.disabled === true || ($.isString(j.disabled) && j.disabled === "true");
                var g = j.url || "#nogo";
                var f = j.label || "";
                if (h != 0) {
                    d += " &gt; ";
                }
                if (i) {
                    d += '<em class="noclick">' + f + "</em>";
                } else {
                    var e = (h == b.length - 1) ? "current" : "normal";
                    d += '<a class="' + e + '" href="javascript:void(0);" url="' + g + '">' + f + "</a>";
                }
            });
            var c = a.find("a");
            if (c.length > 0) {
                a.find("a:last").after(" &gt; " + d);
                c.filter(":last").removeClass("current").addClass("normal");
            } else {
                $(d).appendTo(this.element);
            }
            if (a.css("display") === "none") {
                a.show();
            }
        }
    });
});
define("ui-form", function(require, exports, moudles) {
    $.aeWidget("ae.aeForm", {
        options: {
            initType: "html"
        },
        _create: function() {
            var self = this
              , options = self.options
              , el = self.element;
            if (options.initType == "html") {
                self._buildOptions(options, el);
            }
            if (options.size === "normal" || options.size === "search") {
                el.addClass("c_form c_form-label-" + options.size).show();
            } else {
                el.addClass("c_form").show();
                if (options.col) {
                    el.addClass("c_form-col-" + options.col);
                }
                if (options.size) {
                    el.addClass("c_form-label-" + options.size);
                }
            }
            var cols = $(el.children()[0]).find("[dataField]");
            var html = ""
              , flag = false;
            if (typeof (cols) != "undefined" && cols.length) {
                cols.each(function(idx, item) {
                    var obj = $(item);
                    var customized = obj.parents("[aeType=aeCustom]");
                    if (customized.length > 0) {
                        if (!flag) {
                            flag = true;
                            obj = customized;
                            var header = obj.attr("label") ? obj.attr("label") : obj.attr("header")
                              , col = obj.attr("col")
                              , require = obj.attr("require") == "true" ? true : false;
                            i18n = obj.attr("i18n") == "true" ? true : false;
                            html += '<li class="li' + (col ? " col-" + col : "") + '">';
                            if (header) {
                                if (i18n) {
                                    header = $.evalI18nString(header);
                                }
                                html += ' <span class="label" title="' + header + '">' + (require ? '<span class="e_required"></span>' + header : header) + "</span>";
                            }
                            html += obj[0].outerHTML;
                            html += "</li>";
                        }
                    } else {
                        var header = obj.attr("label") ? obj.attr("label") : obj.attr("header")
                          , col = obj.attr("col")
                          , require = obj.attr("require") == "true" ? true : false;
                        i18n = obj.attr("i18n") == "true" ? true : false;
                        html += '<li class="li' + (col ? " col-" + col : "") + '">';
                        if (header) {
                            if (i18n) {
                                header = $.evalI18nString(header);
                            }
                            html += ' <span class="label" title="' + header + '">' + (require ? '<span class="e_required"></span>' + header : header) + "</span>";
                        }
                        html += obj[0].outerHTML;
                        html += "</li>";
                    }
                });
                $(el.children()[0]).html(html);
            }
            var changeCols = el.find("[aeType]");
            if (typeof (changeCols) != "undefined" && changeCols.length) {
                changeCols.each(function(idx, item) {
                    if ($(item).attr("dataField")) {
                        var dataField = $(item).attr("dataField").replace(new RegExp(/\./g), "_");
                        if (/\[\d{1,}\]/g.test(dataField)) {
                            dataField = dataField.replace(new RegExp(/\[/g), "_").replace(new RegExp(/\]/g), "");
                        }
                        var id = el.attr("id") + "_" + dataField;
                        $(item).attr("id", id);
                    }
                    switch ($(item).attr("aeType")) {
                    case "aeCombo":
                        $("#" + id).aeCombo({
                            type: "form"
                        });
                        break;
                    case "aeCalendar":
                        $("#" + id).aeCalendar({
                            type: "form"
                        });
                        break;
                    case "aeTextfield":
                        $("#" + id).aeTextfield({
                            type: "form"
                        });
                        break;
                    case "aeTextarea":
                        $("#" + id).aeTextarea({
                            type: "form"
                        });
                        break;
                    case "aeTextpopup":
                        $("#" + id).aeTextpopup({
                            type: "form"
                        });
                        break;
                    case "aeCheckbox":
                        $("#" + id).aeCheckbox({
                            type: "form"
                        });
                        break;
                    case "aeRadio":
                        $("#" + id).aeRadio({
                            type: "form"
                        });
                        break;
                    case "aeSearch":
                        $("#" + id).aeSearch({
                            type: "form"
                        });
                        break;
                    case "aeFlip":
                        $("#" + id).aeFlip({
                            type: "form"
                        });
                        break;
                    case "aeCustom":
                        self._buildCustom($(item));
                        break;
                    }
                });
            }
            options.aeType ? el.attr("aeType", options.aeType) : el.attr("aeType", "aeForm");
            options.uiid ? el.attr("uiid", options.uiid) : el.attr("uiid", el.attr("id"));
        },
        _init: function() {},
        _buildOptions: function(options, el) {
            options.col = el.attr("col");
            options.size = el.attr("labelLength") ? el.attr("labelLength") : el.attr("size");
            options.dataField = el.attr("dataField");
            options.aeType = el.attr("aeType");
            options.uiid = el.attr("uiid");
        },
        _buildCustom: function(item) {
            if (item) {
                item.addClass("e_elapse");
                if (item[0].children.length > 0) {
                    var customWidth = "50";
                    if (item[0].children.length === 3) {
                        customWidth = "33.3";
                    }
                    if (item[0].children.length === 4) {
                        customWidth = "25";
                    }
                    for (var i = 0; i < item[0].children.length; i++) {
                        if ($(item[0].children[i]).attr("customWidth")) {
                            customWidth = $(item[0].children[i]).attr("customWidth");
                        }
                        $(item[0].children[i]).wrap('<span class="e_elapseFrom" style="width:' + customWidth + '%;"></span>');
                    }
                }
            }
        },
        setEditSts: function(value) {
            var el = this.element;
            return el.each(function() {
                $("input[datafield],textarea[datafield]", this).enable(value);
            });
        },
        setColEditSts: function(dataField, value) {
            var areaId = this.element.attr("id");
            var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
            els.enable(value);
        },
        setColVisibleSts: function(dataField, value) {
            var areaId = this.element.attr("id");
            var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
            els.visible(value);
        },
        clear: function(dataField) {
            var el = this.element;
            if (typeof dataField === "undefined" || dataField === "") {
                return el.each(function() {
                    $("input[dataField],textarea[dataField]", this).clearFields();
                });
            } else {
                var areaId = el.attr("id");
                if (dataField.indexOf(",") >= 0) {
                    var dataFields = dataField.split(",");
                    for (var i in dataFields) {
                        var els = $("#" + areaId + " input[dataField='" + dataFields[i] + "'],#" + areaId + " textarea[dataField='" + dataFields[i] + "']");
                        els.clearFields();
                    }
                } else {
                    var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
                    els.clearFields();
                }
            }
        },
        setValueByField: function(dataField, value) {
            var areaId = this.element.attr("id");
            var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
            els.setField(value);
        },
        getValueByField: function(dataField) {
            var areaId = this.element.attr("id");
            var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
            return els.getValue();
        },
        getDisplayTextByField: function(dataField) {
            var areaId = this.element.attr("id");
            var els = $("#" + areaId + " input[dataField='" + dataField + "'],#" + areaId + " textarea[dataField='" + dataField + "']");
            return els.getDisplayText();
        },
        getField: function(dataField) {
            if (dataField) {
                var dataField = dataField.replace(new RegExp(/\./g), "_");
                if (/\[\d{1,}\]/g.test(dataField)) {
                    dataField = dataField.replace(new RegExp(/\[/g), "_").replace(new RegExp(/\]/g), "");
                }
                return $("#" + this.element.attr("id") + "_" + dataField);
            }
        },
        reload: function(data) {
            var self = this
              , el = this.element
              , opts = self.options;
            if (data) {
                data = $.aries.common.getDataByDatafield(data, opts.dataField);
                return el.each(function() {
                    $("input[dataField],select[dataField],textarea[dataField]", this).setField(data);
                });
            }
        },
        getData: function(needTrans) {
            var obj = {}
              , returnData = {}
              , dataField = this.options.dataField;
            this.element.find("input[dataField],textarea[dataField]").each(function(index, item) {
                var dataField = $(item).attr("dataField")
                  , id = $(item).attr("id")
                  , type = $(item).attr("aeType")
                  , val = "";
                if (dataField) {
                    if (type === "aeCheckbox") {
                        val = $("#" + id).aeCheckbox("getValue");
                    } else {
                        if (type === "aeRadio") {
                            val = $("#" + id).aeRadio("getValue");
                        } else {
                            if (type === "aeTextpopup") {
                                val = $("#" + id).aeTextpopup("getValue");
                            } else {
                                val = $(item).val();
                            }
                        }
                    }
                    obj = $.aries.common.buildUiidData(obj, dataField, val);
                }
            });
            if (dataField) {
                returnData = $.aries.common.buildUiidData(returnData, dataField, obj);
            } else {
                returnData = obj;
            }
            if (needTrans && (needTrans == "true" || needTrans == true)) {
                returnData = JSON.stringify(returnData);
            }
            return returnData;
        },
        validate: function(rules) {
            var valid = true
              , id = this.element.attr("id");
            if (rules) {
                valid = $("#" + id).validate(rules);
                if (valid) {
                    var success = $("#" + id).find(">ul >li span.e_elements-success");
                    if (success.length > 0) {
                        success.removeClass("e_elements-success e_elements_focus");
                    }
                }
            }
            return valid;
        }
    });
    $.fn.clearFields = function() {
        return this.each(function() {
            var aeType = $.attr(this, "aeType")
              , id = $.attr(this, "id");
            eval('$("#' + id + '").' + aeType + "('clear');");
        });
    }
    ;
    $.fn.enable = function(b) {
        if (b === undefined) {
            b = true;
        }
        return this.each(function() {
            var aeType = $.attr(this, "aeType")
              , id = $.attr(this, "id");
            var enable = !b ? '$("#' + id + '").' + aeType + "('enable',false);" : '$("#' + id + '").' + aeType + "('enable',true);";
            eval(enable);
        });
    }
    ;
    $.fn.visible = function(b) {
        if (b === undefined) {
            b = true;
        }
        return this.each(function() {
            var aeType = $.attr(this, "aeType")
              , id = $.attr(this, "id");
            var enable = !b ? '$("#' + id + '").' + aeType + "('visible',false);" : '$("#' + id + '").' + aeType + "('visible',true);";
            eval(enable);
        });
    }
    ;
    $.fn.setField = function(v) {
        return this.each(function() {
            var value = ""
              , objValue = v;
            id = $.attr(this, "id"),
            type = $.attr(this, "aeType");
            if (v && typeof v == "object") {
                if ($.isArray(v)) {
                    objValue = v[0];
                }
                var dataField = $.attr(this, "dataField");
                if (dataField) {
                    value = $.aries.common.getDataByDatafield(objValue, dataField);
                }
            } else {
                value = v;
            }
            switch (type) {
            case "aeCombo":
                $("#" + id).aeCombo("setValue", value);
                break;
            case "aeCalendar":
                $("#" + id).aeCalendar("setValue", value);
                break;
            case "aeCheckbox":
                $("#" + id).aeCheckbox("setValue", value);
                break;
            case "aeRadio":
                $("#" + id).aeRadio("setValue", value);
                break;
            default:
                if (typeof value === "undefined" || value === "") {
                    $(this).val("");
                } else {
                    $(this).val(value);
                }
                break;
            }
        });
    }
    ;
    $.fn.getValue = function() {
        var value = "";
        this.each(function() {
            var id = $.attr(this, "id")
              , type = $.attr(this, "aeType");
            switch (type) {
            case "aeCombo":
                value = $("#" + id).aeCombo("getValue");
                break;
            case "aeCheckbox":
                value = $("#" + id).aeCheckbox("getValue");
                break;
            case "aeRadio":
                value = $("#" + id).aeRadio("getValue");
                break;
            case "aeTextpopup":
                value = $("#" + id).aeTextpopup("getValue");
                break;
            default:
                value = $(this).val();
                break;
            }
        });
        return value;
    }
    ;
    $.fn.getDisplayText = function() {
        var value = "";
        this.each(function() {
            var id = $.attr(this, "id")
              , type = $.attr(this, "aeType");
            switch (type) {
            case "aeCombo":
                value = $("#" + id).aeCombo("getDisplayText");
                break;
            case "aeCheckbox":
                value = $("#" + id).aeCheckbox("getValue");
                break;
            case "aeRadio":
                value = $("#" + id).aeRadio("getValue");
                break;
            default:
                value = $(this).val();
                break;
            }
        });
        return value;
    }
    ;
});
define("ui-import", function(require, exports, moudles) {
    $.aeWidget("ae.aeImport", {
        options: {
            _fileCount: 0,
            _fileSize: 0,
            _state: "pedding",
            _percentages: {},
            _uploader: "",
            initType: "html"
        },
        _create: function() {
            var b = this.element
              , a = this.options;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
        },
        _init: function() {
            var a = this
              , b = a.options
              , c = a.element;
            a._buildPopupDiv();
            a._bindEvent();
        },
        _buildOptions: function(b, c) {
            b.server = c.attr("server");
            b.id = c.attr("id");
            var a = c.attr("onParams");
            b.onParams = a ? function(g) {
                if ($.isString(a)) {
                    var e = a.indexOf("(");
                    var d = e > 0 ? a.substring(0, e) : a;
                    var f = "return window." + d + "?" + d + ".call(window,e):false;";
                    return new Function("e",f)(g);
                }
            }
             : "";
        },
        _bindEvent: function() {
            var b = this
              , c = b.options
              , a = c.onParams;
            this.element.unbind("click.aeImport").bind("click.aeImport", function() {
                $.aries.popup.openDiv("uploader_" + b.options.id, "上传文件", "800");
                if (typeof a === "function") {
                    var d = a();
                    if ($.isObject(d)) {
                        c.formData = d;
                    }
                }
                b._buildUpload();
            });
        },
        _buildPopupDiv: function() {
            var a = [];
            a.push('<div id="uploader_' + this.options.id + '" style="display:none;">');
            a.push('<div class="queueList">');
            a.push('<div id="dndArea" class="placeholder"><div id="filePicker_' + this.options.id + '"></div></div>');
            a.push("</div>");
            a.push('<div class="statusBar" style="display:none;">');
            a.push('<div class="progress"><span class="text">0%</span><span class="percentage"></span></div>');
            a.push('<div class="info"></div>');
            a.push('<div class="btns"><div id="filePicker2_' + this.options.id + '" style="float:left;"></div><div class="uploadBtn">开始上传</div></div>');
            a.push("</div>");
            a.push("</div>");
            $(document.body).append(a.join(""));
        },
        _buildUpload: function() {
            var m = this
              , a = this.options;
            if (a._uploader !== "") {
                return;
            }
            var n = $("#uploader_" + a.id)
              , e = n.find(".statusBar")
              , k = n.find(".placeholder")
              , h = n.find(".uploadBtn")
              , b = e.find(".info")
              , j = e.find(".progress").hide()
              , f = "filePicker_" + a.id
              , d = "filePicker2_" + a.id;
            var i = window.devicePixelRatio || 1
              , c = 110 * i
              , l = 110 * i;
            $('<ul class="filelist"></ul>').appendTo(n.find(".queueList"));
            a._uploader = WebUploader.create({
                pick: {
                    id: "#" + f,
                    label: "选择文件",
                    multiple: true
                },
                sendAsBinary: false,
                server: a.server,
                formData: a.formData || {}
            });
            var g = a._uploader;
            g.addButton({
                id: "#" + d,
                label: "继续添加"
            });
            g.onUploadProgress = function(q, o) {
                var r = $("#" + q.id)
                  , p = r.find(".progress span");
                p.css("width", o * 100 + "%");
                a._percentages[q.id][1] = o;
                m._updateTotalProgress();
            }
            ;
            g.onFileQueued = function(o) {
                (a._fileCount)++;
                a._fileSize += o.size;
                if (a._fileCount === 1) {
                    k.addClass("element-invisible");
                    e.show();
                }
                m._addFile(o, c, l);
                m._setState("ready");
                m._updateTotalProgress();
            }
            ;
            g.onFileDequeued = function(o) {
                (a._fileCount)--;
                a._fileSize -= o.size;
                if (!a._fileCount) {
                    m._setState("pedding");
                }
                m._removeFile(o);
                m._updateTotalProgress();
            }
            ;
            g.on("all", function(p) {
                var o;
                switch (p) {
                case "uploadFinished":
                    m._setState("confirm");
                    break;
                case "startUpload":
                    m._setState("uploading");
                    break;
                case "stopUpload":
                    m._setState("paused");
                    break;
                }
            });
            g.onError = function(o) {
                alert("Eroor: " + o);
            }
            ;
            h.on("click", function() {
                if ($(this).hasClass("disabled")) {
                    return false;
                }
                if (a._state === "ready") {
                    g.upload();
                } else {
                    if (a._state === "paused") {
                        g.upload();
                    } else {
                        if (a._state === "uploading") {
                            g.stop();
                        } else {
                            if (a._state === "finish") {
                                alert("文件不能重复上传!");
                            }
                        }
                    }
                }
            });
            b.on("click", ".retry", function() {
                g.retry();
            });
            b.on("click", ".ignore", function() {
                alert("todo");
            });
            h.addClass("state-" + a._state);
            m._updateTotalProgress();
        },
        _isSupportBase64: function() {
            var b = new Image();
            var a = true;
            b.onload = b.onerror = function() {
                if (this.width != 1 || this.height != 1) {
                    a = false;
                }
            }
            ;
            b.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return a;
        },
        _addFile: function(d, c, k) {
            var l = this
              , b = l.options._percentages
              , h = l.options._uploader;
            var j = $('<li id="' + d.id + '">' + '<p class="title">' + d.name + "</p>" + '<p class="imgWrap"></p>' + '<p class="progress"><span></span></p>' + "</li>")
              , e = $('<div class="file-panel">' + '<span class="cancel">删除</span>' + '<span class="rotateRight">向右旋转</span>' + '<span class="rotateLeft">向左旋转</span></div>').appendTo(j)
              , i = j.find("p.progress span")
              , m = j.find("p.imgWrap")
              , a = $('<p class="error"></p>')
              , f = function(n) {
                switch (n) {
                case "exceed_size":
                    text = "文件大小超出";
                    break;
                case "interrupt":
                    text = "上传暂停";
                    break;
                default:
                    text = "上传失败，请重试";
                    break;
                }
                a.text(text).appendTo(j);
            }
            ;
            if (d.getStatus() === "invalid") {
                f(d.statusText);
            } else {
                m.text("预览中");
                h.makeThumb(d, function(o, p) {
                    var n;
                    if (o) {
                        m.text("不能预览");
                        return;
                    }
                    if (l._isSupportBase64()) {
                        n = $('<img src="' + p + '">');
                        m.empty().append(n);
                    }
                }, c, k);
                b[d.id] = [d.size, 0];
                d.rotation = 0;
            }
            d.on("statuschange", function(o, n) {
                if (n === "progress") {
                    i.hide().width(0);
                } else {
                    if (n === "queued") {
                        j.off("mouseenter mouseleave");
                        e.remove();
                    }
                }
                if (o === "error" || o === "invalid") {
                    f(d.statusText);
                    b[d.id][1] = 1;
                } else {
                    if (o === "interrupt") {
                        f("interrupt");
                    } else {
                        if (o === "queued") {
                            b[d.id][1] = 0;
                        } else {
                            if (o === "progress") {
                                a.remove();
                                i.css("display", "block");
                            } else {
                                if (o === "complete") {
                                    j.append('<span class="success"></span>');
                                }
                            }
                        }
                    }
                }
                j.removeClass("state-" + n).addClass("state-" + o);
            });
            j.on("mouseenter", function() {
                e.stop().animate({
                    height: 30
                });
            });
            j.on("mouseleave", function() {
                e.stop().animate({
                    height: 0
                });
            });
            e.on("click", "span", function() {
                var n = $(this).index(), o;
                switch (n) {
                case 0:
                    h.removeFile(d);
                    return;
                case 1:
                    d.rotation += 90;
                    break;
                case 2:
                    d.rotation -= 90;
                    break;
                }
                var p = (function() {
                    var q = document.createElement("p").style
                      , t = "transition" in q || "WebkitTransition" in q || "MozTransition" in q || "msTransition" in q || "OTransition" in q;
                    q = null ;
                    return t;
                })();
                if (p) {
                    o = "rotate(" + d.rotation + "deg)";
                    m.css({
                        "-webkit-transform": o,
                        "-mos-transform": o,
                        "-o-transform": o,
                        "transform": o
                    });
                } else {
                    m.css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + (~~((d.rotation / 90) % 4 + 4) % 4) + ")");
                }
            });
            var g = $("#uploader_" + l.options.id).find(".filelist");
            j.appendTo(g);
        },
        _updateTotalProgress: function() {
            var c = 0, f = 0, a = $("#uploader_" + this.options.id).find(".statusBar .progress"), d = a.children(), b = this.options._percentages, g = this.options._state, e;
            $.each(b, function(i, h) {
                f += h[0];
                c += h[0] * h[1];
            });
            e = f ? c / f : 0;
            d.eq(0).text(Math.round(e * 100) + "%");
            d.eq(1).css("width", Math.round(e * 100) + "%");
            this._updateStatus();
        },
        _updateStatus: function() {
            var f = "", c = this.options, d = c._state, g = c._fileCount, a = c._fileSize, e = c._uploader, b;
            if (d === "ready") {
                f = "选中" + g + "个文件，共" + WebUploader.formatSize(a) + "。";
            } else {
                if (d === "confirm") {
                    b = e.getStats();
                    if (b.uploadFailNum) {
                        f = "已成功上传" + b.successNum + "个文件，" + b.uploadFailNum + '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>';
                    }
                } else {
                    b = e.getStats();
                    f = "共" + g + "个（" + WebUploader.formatSize(a) + "），已上传" + b.successNum + "个";
                    if (b.uploadFailNum) {
                        f += "，失败" + b.uploadFailNum + "个";
                    }
                }
            }
            $("#uploader_" + c.id).find(".statusBar .info").html(f);
        },
        _setState: function(b) {
            var c, f, k = this, g = k.options._uploader, h = $("#uploader_" + k.options.id).find(".uploadBtn"), j = $("#uploader_" + k.options.id).find(".placeholder"), e = $("#uploader_" + k.options.id).find(".filelist"), d = $("#uploader_" + k.options.id).find(".statusBar"), i = d.find(".progress"), a = "filePicker2_" + k.options.id;
            if (b === k.options._state) {
                return;
            }
            h.removeClass("state-" + k.options._state);
            h.addClass("state-" + b);
            k.options._state = b;
            switch (k.options._state) {
            case "pedding":
                j.removeClass("element-invisible");
                e.hide();
                d.addClass("element-invisible");
                g.refresh();
                break;
            case "ready":
                j.addClass("element-invisible");
                $("#" + a).removeClass("element-invisible");
                e.show();
                d.removeClass("element-invisible");
                g.refresh();
                break;
            case "uploading":
                $("#" + a).addClass("element-invisible");
                i.show();
                h.text("暂停上传");
                break;
            case "paused":
                i.show();
                h.text("继续上传");
                break;
            case "confirm":
                i.hide();
                $("#" + a).removeClass("element-invisible");
                h.text("开始上传");
                f = g.getStats();
                if (f.successNum && !f.uploadFailNum) {
                    k._setState("finish");
                    return;
                }
                break;
            case "finish":
                f = g.getStats();
                if (f.successNum) {
                    alert("上传成功");
                } else {
                    k.options._state = "done";
                    location.reload();
                }
                break;
            }
            k._updateStatus();
        },
        _removeFile: function(b) {
            var a = this
              , c = $("#" + b.id);
            delete this.options._percentages[b.id];
            a._updateTotalProgress();
            c.off().find(".file-panel").off().end().remove();
        }
    });
});
/*! WebUploader 0.1.5 */
(function(f, d) {
    var c = {}, b = function(n, o) {
        var l, k, m;
        if (typeof n === "string") {
            return e(n);
        } else {
            l = [];
            for (k = n.length,
            m = 0; m < k; m++) {
                l.push(e(n[m]));
            }
            return o.apply(null , l);
        }
    }
    , j = function(m, l, k) {
        if (arguments.length === 2) {
            k = l;
            l = null ;
        }
        b(l || [], function() {
            i(m, k, arguments);
        });
    }
    , i = function(o, k, l) {
        var m = {
            exports: k
        }, n;
        if (typeof k === "function") {
            l.length || (l = [b, m.exports, m]);
            n = k.apply(null , l);
            n !== undefined && (m.exports = n);
        }
        c[o] = m.exports;
    }
    , e = function(l) {
        var k = c[l] || f[l];
        if (!k) {
            throw new Error("`" + l + "` is undefined");
        }
        return k;
    }
    , h = function(q) {
        var l, o, p, k, n, m;
        m = function(r) {
            return r && (r.charAt(0).toUpperCase() + r.substr(1));
        }
        ;
        for (l in c) {
            o = q;
            if (!c.hasOwnProperty(l)) {
                continue;
            }
            p = l.split("/");
            n = m(p.pop());
            while ((k = m(p.shift())) ) {
                o[k] = o[k] || {};
                o = o[k];
            }
            o[n] = c[l];
        }
        return q;
    }
    , a = function(k) {
        f.__dollar = k;
        return h(d(f, j, b));
    }
    , g;
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = a();
    } else {
        if (typeof define === "function" && define.amd) {
            define(["jquery"], a);
        } else {
            g = f.WebUploader;
            f.WebUploader = a();
            f.WebUploader.noConflict = function() {
                f.WebUploader = g;
            }
            ;
        }
    }
})(window, function(b, c, a) {
    c("dollar-third", [], function() {
        var d = b.__dollar || b.jQuery || b.Zepto;
        if (!d) {
            throw new Error("jQuery or Zepto not found!");
        }
        return d;
    });
    c("dollar", ["dollar-third"], function(d) {
        return d;
    });
    c("promise-third", ["dollar"], function(d) {
        return {
            Deferred: d.Deferred,
            when: d.when,
            isPromise: function(e) {
                return e && typeof e.then === "function";
            }
        };
    });
    c("promise", ["promise-third"], function(d) {
        return d;
    });
    c("base", ["dollar", "promise"], function(h, j) {
        var g = function() {}
          , f = Function.call;
        function e(k) {
            return function() {
                return f.apply(k, arguments);
            }
            ;
        }
        function i(l, k) {
            return function() {
                return l.apply(k, arguments);
            }
            ;
        }
        function d(k) {
            var l;
            if (Object.create) {
                return Object.create(k);
            } else {
                l = function() {}
                ;
                l.prototype = k;
                return new l();
            }
        }
        return {
            version: "0.1.5",
            $: h,
            Deferred: j.Deferred,
            isPromise: j.isPromise,
            when: j.when,
            browser: (function(o) {
                var n = {}
                  , m = o.match(/WebKit\/([\d.]+)/)
                  , k = o.match(/Chrome\/([\d.]+)/) || o.match(/CriOS\/([\d.]+)/)
                  , r = o.match(/MSIE\s([\d\.]+)/) || o.match(/(?:trident)(?:.*rv:([\w.]+))?/i)
                  , p = o.match(/Firefox\/([\d.]+)/)
                  , q = o.match(/Safari\/([\d.]+)/)
                  , l = o.match(/OPR\/([\d.]+)/);
                m && (n.webkit = parseFloat(m[1]));
                k && (n.chrome = parseFloat(k[1]));
                r && (n.ie = parseFloat(r[1]));
                p && (n.firefox = parseFloat(p[1]));
                q && (n.safari = parseFloat(q[1]));
                l && (n.opera = parseFloat(l[1]));
                return n;
            })(navigator.userAgent),
            os: (function(m) {
                var l = {}
                  , k = m.match(/(?:Android);?[\s\/]+([\d.]+)?/)
                  , n = m.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);
                k && (l.android = parseFloat(k[1]));
                n && (l.ios = parseFloat(n[1].replace(/_/g, ".")));
                return l;
            })(navigator.userAgent),
            inherits: function(m, l, k) {
                var n;
                if (typeof l === "function") {
                    n = l;
                    l = null ;
                } else {
                    if (l && l.hasOwnProperty("constructor")) {
                        n = l.constructor;
                    } else {
                        n = function() {
                            return m.apply(this, arguments);
                        }
                        ;
                    }
                }
                h.extend(true, n, m, k || {});
                n.__super__ = m.prototype;
                n.prototype = d(m.prototype);
                l && h.extend(true, n.prototype, l);
                return n;
            },
            noop: g,
            bindFn: i,
            log: (function() {
                if (b.console) {
                    return i(console.log, console);
                }
                return g;
            })(),
            nextTick: (function() {
                return function(k) {
                    setTimeout(k, 1);
                }
                ;
            })(),
            slice: e([].slice),
            guid: (function() {
                var k = 0;
                return function(n) {
                    var l = (+new Date()).toString(32)
                      , m = 0;
                    for (; m < 5; m++) {
                        l += Math.floor(Math.random() * 65535).toString(32);
                    }
                    return (n || "wu_") + l + (k++).toString(32);
                }
                ;
            })(),
            formatSize: function(m, k, l) {
                var n;
                l = l || ["B", "K", "M", "G", "TB"];
                while ((n = l.shift()) && m > 1024) {
                    m = m / 1024;
                }
                return (n === "B" ? m : m.toFixed(k || 2)) + n;
            }
        };
    });
    c("mediator", ["base"], function(f) {
        var g = f.$, k = [].slice, j = /\s+/, e;
        function d(l, m, o, n) {
            return g.grep(l, function(p) {
                return p && (!m || p.e === m) && (!o || p.cb === o || p.cb._cb === o) && (!n || p.ctx === n);
            });
        }
        function i(l, n, m) {
            g.each((l || "").split(j), function(o, p) {
                m(p, n);
            });
        }
        function h(p, n) {
            var m = false, o = -1, l = p.length, q;
            while (++o < l) {
                q = p[o];
                if (q.cb.apply(q.ctx2, n) === false) {
                    m = true;
                    break;
                }
            }
            return !m;
        }
        e = {
            on: function(l, p, m) {
                var n = this, o;
                if (!p) {
                    return this;
                }
                o = this._events || (this._events = []);
                i(l, p, function(q, s) {
                    var r = {
                        e: q
                    };
                    r.cb = s;
                    r.ctx = m;
                    r.ctx2 = m || n;
                    r.id = o.length;
                    o.push(r);
                });
                return this;
            },
            once: function(l, o, m) {
                var n = this;
                if (!o) {
                    return n;
                }
                i(l, o, function(p, r) {
                    var q = function() {
                        n.off(p, q);
                        return r.apply(m || n, arguments);
                    }
                    ;
                    q._cb = r;
                    n.on(p, q, m);
                });
                return n;
            },
            off: function(n, l, m) {
                var o = this._events;
                if (!o) {
                    return this;
                }
                if (!n && !l && !m) {
                    this._events = [];
                    return this;
                }
                i(n, l, function(q, p) {
                    g.each(d(o, q, p, m), function() {
                        delete o[this.id];
                    });
                });
                return this;
            },
            trigger: function(o) {
                var m, n, l;
                if (!this._events || !o) {
                    return this;
                }
                m = k.call(arguments, 1);
                n = d(this._events, o);
                l = d(this._events, "all");
                return h(n, m) && h(l, arguments);
            }
        };
        return g.extend({
            installTo: function(l) {
                return g.extend(l, e);
            }
        }, e);
    });
    c("uploader", ["base", "mediator"], function(d, f) {
        var e = d.$;
        function g(h) {
            this.options = e.extend(true, {}, g.options, h);
            this._init(this.options);
        }
        g.options = {};
        f.installTo(g.prototype);
        e.each({
            upload: "start-upload",
            stop: "stop-upload",
            getFile: "get-file",
            getFiles: "get-files",
            addFile: "add-file",
            addFiles: "add-file",
            sort: "sort-files",
            removeFile: "remove-file",
            cancelFile: "cancel-file",
            skipFile: "skip-file",
            retry: "retry",
            isInProgress: "is-in-progress",
            makeThumb: "make-thumb",
            md5File: "md5-file",
            getDimension: "get-dimension",
            addButton: "add-btn",
            predictRuntimeType: "predict-runtime-type",
            refresh: "refresh",
            disable: "disable",
            enable: "enable",
            reset: "reset"
        }, function(h, i) {
            g.prototype[h] = function() {
                return this.request(i, arguments);
            }
            ;
        });
        e.extend(g.prototype, {
            state: "pending",
            _init: function(i) {
                var h = this;
                h.request("init", i, function() {
                    h.state = "ready";
                    h.trigger("ready");
                });
            },
            option: function(h, j) {
                var i = this.options;
                if (arguments.length > 1) {
                    if (e.isPlainObject(j) && e.isPlainObject(i[h])) {
                        e.extend(i[h], j);
                    } else {
                        i[h] = j;
                    }
                } else {
                    return h ? i[h] : i;
                }
            },
            getStats: function() {
                var h = this.request("get-stats");
                return h ? {
                    successNum: h.numOfSuccess,
                    progressNum: h.numOfProgress,
                    cancelNum: h.numOfCancel,
                    invalidNum: h.numOfInvalid,
                    uploadFailNum: h.numOfUploadFailed,
                    queueNum: h.numOfQueue,
                    interruptNum: h.numofInterrupt
                } : {};
            },
            trigger: function(j) {
                var i = [].slice.call(arguments, 1)
                  , k = this.options
                  , h = "on" + j.substring(0, 1).toUpperCase() + j.substring(1);
                if (f.trigger.apply(this, arguments) === false || e.isFunction(k[h]) && k[h].apply(this, i) === false || e.isFunction(this[h]) && this[h].apply(this, i) === false || f.trigger.apply(f, [this, j].concat(i)) === false) {
                    return false;
                }
                return true;
            },
            destroy: function() {
                this.request("destroy", arguments);
                this.off();
            },
            request: d.noop
        });
        d.create = g.create = function(h) {
            return new g(h);
        }
        ;
        d.Uploader = g;
        return g;
    });
    c("runtime/runtime", ["base", "mediator"], function(e, h) {
        var g = e.$
          , f = {}
          , i = function(k) {
            for (var j in k) {
                if (k.hasOwnProperty(j)) {
                    return j;
                }
            }
            return null ;
        }
        ;
        function d(j) {
            this.options = g.extend({
                container: document.body
            }, j);
            this.uid = e.guid("rt_");
        }
        g.extend(d.prototype, {
            getContainer: function() {
                var l = this.options, k, j;
                if (this._container) {
                    return this._container;
                }
                k = g(l.container || document.body);
                j = g(document.createElement("div"));
                j.attr("id", "rt_" + this.uid);
                j.css({
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden"
                });
                k.append(j);
                k.addClass("webuploader-container");
                this._container = j;
                this._parent = k;
                return j;
            },
            init: e.noop,
            exec: e.noop,
            destroy: function() {
                this._container && this._container.remove();
                this._parent && this._parent.removeClass("webuploader-container");
                this.off();
            }
        });
        d.orders = "html5,flash";
        d.addRuntime = function(k, j) {
            f[k] = j;
        }
        ;
        d.hasRuntime = function(j) {
            return !!(j ? f[j] : i(f));
        }
        ;
        d.create = function(m, k) {
            var j, l;
            k = k || d.orders;
            g.each(k.split(/\s*,\s*/g), function() {
                if (f[this]) {
                    j = this;
                    return false;
                }
            });
            j = j || i(f);
            if (!j) {
                throw new Error("Runtime Error");
            }
            l = new f[j](m);
            return l;
        }
        ;
        h.installTo(d.prototype);
        return d;
    });
    c("runtime/client", ["base", "mediator", "runtime/runtime"], function(g, h, f) {
        var d;
        d = (function() {
            var i = {};
            return {
                add: function(j) {
                    i[j.uid] = j;
                },
                get: function(k, j) {
                    var l;
                    if (k) {
                        return i[k];
                    }
                    for (l in i) {
                        if (j && i[l].__standalone) {
                            continue;
                        }
                        return i[l];
                    }
                    return null ;
                },
                remove: function(j) {
                    delete i[j.uid];
                }
            };
        })();
        function e(k, j) {
            var i = g.Deferred(), l;
            this.uid = g.guid("client_");
            this.runtimeReady = function(m) {
                return i.done(m);
            }
            ;
            this.connectRuntime = function(n, m) {
                if (l) {
                    throw new Error("already connected!");
                }
                i.done(m);
                if (typeof n === "string" && d.get(n)) {
                    l = d.get(n);
                }
                l = l || d.get(null , j);
                if (!l) {
                    l = f.create(n, n.runtimeOrder);
                    l.__promise = i.promise();
                    l.once("ready", i.resolve);
                    l.init();
                    d.add(l);
                    l.__client = 1;
                } else {
                    g.$.extend(l.options, n);
                    l.__promise.then(i.resolve);
                    l.__client++;
                }
                j && (l.__standalone = j);
                return l;
            }
            ;
            this.getRuntime = function() {
                return l;
            }
            ;
            this.disconnectRuntime = function() {
                if (!l) {
                    return;
                }
                l.__client--;
                if (l.__client <= 0) {
                    d.remove(l);
                    delete l.__promise;
                    l.destroy();
                }
                l = null ;
            }
            ;
            this.exec = function() {
                if (!l) {
                    return;
                }
                var m = g.slice(arguments);
                k && m.unshift(k);
                return l.exec.apply(this, m);
            }
            ;
            this.getRuid = function() {
                return l && l.uid;
            }
            ;
            this.destroy = (function(m) {
                return function() {
                    m && m.apply(this, arguments);
                    this.trigger("destroy");
                    this.off();
                    this.exec("destroy");
                    this.disconnectRuntime();
                }
                ;
            })(this.destroy);
        }
        h.installTo(e.prototype);
        return e;
    });
    c("lib/dnd", ["base", "mediator", "runtime/client"], function(e, h, d) {
        var f = e.$;
        function g(i) {
            i = this.options = f.extend({}, g.options, i);
            i.container = f(i.container);
            if (!i.container.length) {
                return;
            }
            d.call(this, "DragAndDrop");
        }
        g.options = {
            accept: null ,
            disableGlobalDnd: false
        };
        e.inherits(d, {
            constructor: g,
            init: function() {
                var i = this;
                i.connectRuntime(i.options, function() {
                    i.exec("init");
                    i.trigger("ready");
                });
            }
        });
        h.installTo(g.prototype);
        return g;
    });
    c("widgets/widget", ["base", "uploader"], function(g, e) {
        var f = g.$
          , i = e.prototype._init
          , k = e.prototype.destroy
          , h = {}
          , d = [];
        function l(o) {
            if (!o) {
                return false;
            }
            var n = o.length
              , m = f.type(o);
            if (o.nodeType === 1 && n) {
                return true;
            }
            return m === "array" || m !== "function" && m !== "string" && (n === 0 || typeof n === "number" && n > 0 && (n - 1) in o);
        }
        function j(m) {
            this.owner = m;
            this.options = m.options;
        }
        f.extend(j.prototype, {
            init: g.noop,
            invoke: function(m, n) {
                var o = this.responseMap;
                if (!o || !(m in o) || !(o[m] in this) || !f.isFunction(this[o[m]])) {
                    return h;
                }
                return this[o[m]].apply(this, n);
            },
            request: function() {
                return this.owner.request.apply(this.owner, arguments);
            }
        });
        f.extend(e.prototype, {
            _init: function() {
                var o = this
                  , n = o._widgets = []
                  , m = o.options.disableWidgets || "";
                f.each(d, function(q, p) {
                    (!m || !~m.indexOf(p._name)) && n.push(new p(o));
                });
                return i.apply(o, arguments);
            },
            request: function(n, t, w) {
                var q = 0, u = this._widgets, s = u && u.length, p = [], o = [], r, m, x, v;
                t = l(t) ? t : [t];
                for (; q < s; 
                q++) {
                    r = u[q];
                    m = r.invoke(n, t);
                    if (m !== h) {
                        if (g.isPromise(m)) {
                            o.push(m);
                        } else {
                            p.push(m);
                        }
                    }
                }
                if (w || o.length) {
                    x = g.when.apply(g, o);
                    v = x.pipe ? "pipe" : "then";
                    return x[v](function() {
                        var y = g.Deferred()
                          , z = arguments;
                        if (z.length === 1) {
                            z = z[0];
                        }
                        setTimeout(function() {
                            y.resolve(z);
                        }, 1);
                        return y.promise();
                    })[w ? v : "done"](w || g.noop);
                } else {
                    return p[0];
                }
            },
            destroy: function() {
                k.apply(this, arguments);
                this._widgets = null ;
            }
        });
        e.register = j.register = function(n, p) {
            var o = {
                init: "init",
                destroy: "destroy",
                name: "anonymous"
            }, m;
            if (arguments.length === 1) {
                p = n;
                f.each(p, function(q) {
                    if (q[0] === "_" || q === "name") {
                        q === "name" && (o.name = p.name);
                        return;
                    }
                    o[q.replace(/[A-Z]/g, "-$&").toLowerCase()] = q;
                });
            } else {
                o = f.extend(o, n);
            }
            p.responseMap = o;
            m = g.inherits(j, p);
            m._name = o.name;
            d.push(m);
            return m;
        }
        ;
        e.unRegister = j.unRegister = function(m) {
            if (!m || m === "anonymous") {
                return;
            }
            for (var n = d.length; n--; ) {
                if (d[n]._name === m) {
                    d.splice(n, 1);
                }
            }
        }
        ;
        return j;
    });
    c("widgets/filednd", ["base", "uploader", "lib/dnd", "widgets/widget"], function(e, g, d) {
        var f = e.$;
        g.options.dnd = "";
        return g.register({
            name: "dnd",
            init: function(l) {
                if (!l.dnd || this.request("predict-runtime-type") !== "html5") {
                    return;
                }
                var k = this, h = e.Deferred(), i = f.extend({}, {
                    disableGlobalDnd: l.disableGlobalDnd,
                    container: l.dnd,
                    accept: l.accept
                }), j;
                this.dnd = j = new d(i);
                j.once("ready", h.resolve);
                j.on("drop", function(m) {
                    k.request("add-file", [m]);
                });
                j.on("accept", function(m) {
                    return k.owner.trigger("dndAccept", m);
                });
                j.init();
                return h.promise();
            },
            destroy: function() {
                this.dnd && this.dnd.destroy();
            }
        });
    });
    c("lib/filepaste", ["base", "mediator", "runtime/client"], function(f, h, e) {
        var g = f.$;
        function d(i) {
            i = this.options = g.extend({}, i);
            i.container = g(i.container || document.body);
            e.call(this, "FilePaste");
        }
        f.inherits(e, {
            constructor: d,
            init: function() {
                var i = this;
                i.connectRuntime(i.options, function() {
                    i.exec("init");
                    i.trigger("ready");
                });
            }
        });
        h.installTo(d.prototype);
        return d;
    });
    c("widgets/filepaste", ["base", "uploader", "lib/filepaste", "widgets/widget"], function(e, g, d) {
        var f = e.$;
        return g.register({
            name: "paste",
            init: function(k) {
                if (!k.paste || this.request("predict-runtime-type") !== "html5") {
                    return;
                }
                var j = this, h = e.Deferred(), i = f.extend({}, {
                    container: k.paste,
                    accept: k.accept
                }), l;
                this.paste = l = new d(i);
                l.once("ready", h.resolve);
                l.on("paste", function(m) {
                    j.owner.request("add-file", [m]);
                });
                l.init();
                return h.promise();
            },
            destroy: function() {
                this.paste && this.paste.destroy();
            }
        });
    });
    c("lib/blob", ["base", "runtime/client"], function(e, d) {
        function f(g, i) {
            var h = this;
            h.source = i;
            h.ruid = g;
            this.size = i.size || 0;
            if (!i.type && this.ext && ~"jpg,jpeg,png,gif,bmp".indexOf(this.ext)) {
                this.type = "image/" + (this.ext === "jpg" ? "jpeg" : this.ext);
            } else {
                this.type = i.type || "application/octet-stream";
            }
            d.call(h, "Blob");
            this.uid = i.uid || this.uid;
            if (g) {
                h.connectRuntime(g);
            }
        }
        e.inherits(d, {
            constructor: f,
            slice: function(h, g) {
                return this.exec("slice", h, g);
            },
            getSource: function() {
                return this.source;
            }
        });
        return f;
    });
    c("lib/file", ["base", "lib/blob"], function(g, h) {
        var f = 1
          , d = /\.([^.]+)$/;
        function e(i, j) {
            var k;
            this.name = j.name || ("untitled" + f++);
            k = d.exec(j.name) ? RegExp.$1.toLowerCase() : "";
            if (!k && j.type) {
                k = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(j.type) ? RegExp.$1.toLowerCase() : "";
                this.name += "." + k;
            }
            this.ext = k;
            this.lastModifiedDate = j.lastModifiedDate || (new Date()).toLocaleString();
            h.apply(this, arguments);
        }
        return g.inherits(h, e);
    });
    c("lib/filepicker", ["base", "runtime/client", "lib/file"], function(g, f, e) {
        var h = g.$;
        function d(i) {
            i = this.options = h.extend({}, d.options, i);
            i.container = h(i.id);
            if (!i.container.length) {
                throw new Error("按钮指定错误");
            }
            i.innerHTML = i.innerHTML || i.label || i.container.html() || "";
            i.button = h(i.button || document.createElement("div"));
            i.button.html(i.innerHTML);
            i.container.html(i.button);
            f.call(this, "FilePicker", true);
        }
        d.options = {
            button: null ,
            container: null ,
            label: null ,
            innerHTML: null ,
            multiple: true,
            accept: null ,
            name: "file"
        };
        g.inherits(f, {
            constructor: d,
            init: function() {
                var k = this
                  , j = k.options
                  , i = j.button;
                i.addClass("webuploader-pick");
                k.on("all", function(l) {
                    var m;
                    switch (l) {
                    case "mouseenter":
                        i.addClass("webuploader-pick-hover");
                        break;
                    case "mouseleave":
                        i.removeClass("webuploader-pick-hover");
                        break;
                    case "change":
                        m = k.exec("getFiles");
                        k.trigger("select", h.map(m, function(n) {
                            n = new e(k.getRuid(),n);
                            n._refer = j.container;
                            return n;
                        }), j.container);
                        break;
                    }
                });
                k.connectRuntime(j, function() {
                    k.refresh();
                    k.exec("init", j);
                    k.trigger("ready");
                });
                this._resizeHandler = g.bindFn(this.refresh, this);
                h(b).on("resize", this._resizeHandler);
            },
            refresh: function() {
                var j = this.getRuntime().getContainer()
                  , k = this.options.button
                  , l = k.outerWidth ? k.outerWidth() : k.width()
                  , i = k.outerHeight ? k.outerHeight() : k.height()
                  , m = k.offset();
                l && i && j.css({
                    bottom: "auto",
                    right: "auto",
                    width: l + "px",
                    height: i + "px"
                }).offset(m);
            },
            enable: function() {
                var i = this.options.button;
                i.removeClass("webuploader-pick-disable");
                this.refresh();
            },
            disable: function() {
                var i = this.options.button;
                this.getRuntime().getContainer().css({
                    top: "-99999px"
                });
                i.addClass("webuploader-pick-disable");
            },
            destroy: function() {
                var i = this.options.button;
                h(b).off("resize", this._resizeHandler);
                i.removeClass("webuploader-pick-disable webuploader-pick-hover " + "webuploader-pick");
            }
        });
        return d;
    });
    c("widgets/filepicker", ["base", "uploader", "lib/filepicker", "widgets/widget"], function(e, g, d) {
        var f = e.$;
        f.extend(g.options, {
            pick: null ,
            accept: null 
        });
        return g.register({
            name: "picker",
            init: function(h) {
                this.pickers = [];
                return h.pick && this.addBtn(h.pick);
            },
            refresh: function() {
                f.each(this.pickers, function() {
                    this.refresh();
                });
            },
            addBtn: function(j) {
                var l = this
                  , k = l.options
                  , i = k.accept
                  , h = [];
                if (!j) {
                    return;
                }
                f.isPlainObject(j) || (j = {
                    id: j
                });
                f(j.id).each(function() {
                    var o, n, m;
                    m = e.Deferred();
                    o = f.extend({}, j, {
                        accept: f.isPlainObject(i) ? [i] : i,
                        swf: k.swf,
                        runtimeOrder: k.runtimeOrder,
                        id: this
                    });
                    n = new d(o);
                    n.once("ready", m.resolve);
                    n.on("select", function(p) {
                        l.owner.request("add-file", [p]);
                    });
                    n.init();
                    l.pickers.push(n);
                    h.push(m.promise());
                });
                return e.when.apply(e, h);
            },
            disable: function() {
                f.each(this.pickers, function() {
                    this.disable();
                });
            },
            enable: function() {
                f.each(this.pickers, function() {
                    this.enable();
                });
            },
            destroy: function() {
                f.each(this.pickers, function() {
                    this.destroy();
                });
                this.pickers = null ;
            }
        });
    });
    c("lib/image", ["base", "runtime/client", "lib/blob"], function(f, e, h) {
        var g = f.$;
        function d(i) {
            this.options = g.extend({}, d.options, i);
            e.call(this, "Image");
            this.on("load", function() {
                this._info = this.exec("info");
                this._meta = this.exec("meta");
            });
        }
        d.options = {
            quality: 90,
            crop: false,
            preserveHeaders: false,
            allowMagnify: false
        };
        f.inherits(e, {
            constructor: d,
            info: function(i) {
                if (i) {
                    this._info = i;
                    return this;
                }
                return this._info;
            },
            meta: function(i) {
                if (i) {
                    this._meta = i;
                    return this;
                }
                return this._meta;
            },
            loadFromBlob: function(i) {
                var k = this
                  , j = i.getRuid();
                this.connectRuntime(j, function() {
                    k.exec("init", k.options);
                    k.exec("loadFromBlob", i);
                });
            },
            resize: function() {
                var i = f.slice(arguments);
                return this.exec.apply(this, ["resize"].concat(i));
            },
            crop: function() {
                var i = f.slice(arguments);
                return this.exec.apply(this, ["crop"].concat(i));
            },
            getAsDataUrl: function(i) {
                return this.exec("getAsDataUrl", i);
            },
            getAsBlob: function(j) {
                var i = this.exec("getAsBlob", j);
                return new h(this.getRuid(),i);
            }
        });
        return d;
    });
    c("widgets/image", ["base", "uploader", "lib/image", "widgets/widget"], function(e, h, d) {
        var g = e.$, f;
        f = (function(i) {
            var j = 0
              , l = []
              , k = function() {
                var m;
                while (l.length && j < i) {
                    m = l.shift();
                    j += m[0];
                    m[1]();
                }
            }
            ;
            return function(o, n, m) {
                l.push([n, m]);
                o.once("destroy", function() {
                    j -= n;
                    setTimeout(k, 1);
                });
                setTimeout(k, 1);
            }
            ;
        })(5 * 1024 * 1024);
        g.extend(h.options, {
            thumb: {
                width: 110,
                height: 110,
                quality: 70,
                allowMagnify: true,
                crop: true,
                preserveHeaders: false,
                type: "image/jpeg"
            },
            compress: {
                width: 1600,
                height: 1600,
                quality: 90,
                allowMagnify: false,
                crop: false,
                preserveHeaders: true
            }
        });
        return h.register({
            name: "image",
            makeThumb: function(k, j, l, i) {
                var m, n;
                k = this.request("get-file", k);
                if (!k.type.match(/^image/)) {
                    j(true);
                    return;
                }
                m = g.extend({}, this.options.thumb);
                if (g.isPlainObject(l)) {
                    m = g.extend(m, l);
                    l = null ;
                }
                l = l || m.width;
                i = i || m.height;
                n = new d(m);
                n.once("load", function() {
                    k._info = k._info || n.info();
                    k._meta = k._meta || n.meta();
                    if (l <= 1 && l > 0) {
                        l = k._info.width * l;
                    }
                    if (i <= 1 && i > 0) {
                        i = k._info.height * i;
                    }
                    n.resize(l, i);
                });
                n.once("complete", function() {
                    j(false, n.getAsDataUrl(m.type));
                    n.destroy();
                });
                n.once("error", function(o) {
                    j(o || true);
                    n.destroy();
                });
                f(n, k.source.size, function() {
                    k._info && n.info(k._info);
                    k._meta && n.meta(k._meta);
                    n.loadFromBlob(k.source);
                });
            },
            beforeSendFile: function(k) {
                var m = this.options.compress || this.options.resize, j = m && m.compressSize || 0, l = m && m.noCompressIfLarger || false, n, i;
                k = this.request("get-file", k);
                if (!m || !~"image/jpeg,image/jpg".indexOf(k.type) || k.size < j || k._compressed) {
                    return;
                }
                m = g.extend({}, m);
                i = e.Deferred();
                n = new d(m);
                i.always(function() {
                    n.destroy();
                    n = null ;
                });
                n.once("error", i.reject);
                n.once("load", function() {
                    var p = m.width
                      , o = m.height;
                    k._info = k._info || n.info();
                    k._meta = k._meta || n.meta();
                    if (p <= 1 && p > 0) {
                        p = k._info.width * p;
                    }
                    if (o <= 1 && o > 0) {
                        o = k._info.height * o;
                    }
                    n.resize(p, o);
                });
                n.once("complete", function() {
                    var o, p;
                    try {
                        o = n.getAsBlob(m.type);
                        p = k.size;
                        if (!l || o.size < p) {
                            k.source = o;
                            k.size = o.size;
                            k.trigger("resize", o.size, p);
                        }
                        k._compressed = true;
                        i.resolve();
                    } catch (q) {
                        i.resolve();
                    }
                });
                k._info && n.info(k._info);
                k._meta && n.meta(k._meta);
                n.loadFromBlob(k.source);
                return i.promise();
            }
        });
    });
    c("file", ["base", "mediator"], function(h, k) {
        var f = h.$
          , d = "WU_FILE_"
          , g = 0
          , i = /\.([^.]+)$/
          , e = {};
        function j() {
            return d + g++;
        }
        function l(m) {
            this.name = m.name || "Untitled";
            this.size = m.size || 0;
            this.type = m.type || "application/octet-stream";
            this.lastModifiedDate = m.lastModifiedDate || (new Date() * 1);
            this.id = j();
            this.ext = i.exec(this.name) ? RegExp.$1 : "";
            this.statusText = "";
            e[this.id] = l.Status.INITED;
            this.source = m;
            this.loaded = 0;
            this.on("error", function(n) {
                this.setStatus(l.Status.ERROR, n);
            });
        }
        f.extend(l.prototype, {
            setStatus: function(n, o) {
                var m = e[this.id];
                typeof o !== "undefined" && (this.statusText = o);
                if (n !== m) {
                    e[this.id] = n;
                    this.trigger("statuschange", n, m);
                }
            },
            getStatus: function() {
                return e[this.id];
            },
            getSource: function() {
                return this.source;
            },
            destroy: function() {
                this.off();
                delete e[this.id];
            }
        });
        k.installTo(l.prototype);
        l.Status = {
            INITED: "inited",
            QUEUED: "queued",
            PROGRESS: "progress",
            ERROR: "error",
            COMPLETE: "complete",
            CANCELLED: "cancelled",
            INTERRUPT: "interrupt",
            INVALID: "invalid"
        };
        return l;
    });
    c("queue", ["base", "mediator", "file"], function(e, i, h) {
        var g = e.$
          , d = h.Status;
        function f() {
            this.stats = {
                numOfQueue: 0,
                numOfSuccess: 0,
                numOfCancel: 0,
                numOfProgress: 0,
                numOfUploadFailed: 0,
                numOfInvalid: 0,
                numofDeleted: 0,
                numofInterrupt: 0
            };
            this._queue = [];
            this._map = {};
        }
        g.extend(f.prototype, {
            append: function(j) {
                this._queue.push(j);
                this._fileAdded(j);
                return this;
            },
            prepend: function(j) {
                this._queue.unshift(j);
                this._fileAdded(j);
                return this;
            },
            getFile: function(j) {
                if (typeof j !== "string") {
                    return j;
                }
                return this._map[j];
            },
            fetch: function(k) {
                var j = this._queue.length, m, l;
                k = k || d.QUEUED;
                for (m = 0; m < j; m++) {
                    l = this._queue[m];
                    if (k === l.getStatus()) {
                        return l;
                    }
                }
                return null ;
            },
            sort: function(j) {
                if (typeof j === "function") {
                    this._queue.sort(j);
                }
            },
            getFiles: function() {
                var n = [].slice.call(arguments, 0), k = [], m = 0, j = this._queue.length, l;
                for (; m < j; m++) {
                    l = this._queue[m];
                    if (n.length && !~g.inArray(l.getStatus(), n)) {
                        continue;
                    }
                    k.push(l);
                }
                return k;
            },
            removeFile: function(j) {
                var l = this
                  , k = this._map[j.id];
                if (k) {
                    delete this._map[j.id];
                    j.destroy();
                    this.stats.numofDeleted++;
                }
            },
            _fileAdded: function(j) {
                var l = this
                  , k = this._map[j.id];
                if (!k) {
                    this._map[j.id] = j;
                    j.on("statuschange", function(n, m) {
                        l._onFileStatusChange(n, m);
                    });
                }
            },
            _onFileStatusChange: function(j, k) {
                var l = this.stats;
                switch (k) {
                case d.PROGRESS:
                    l.numOfProgress--;
                    break;
                case d.QUEUED:
                    l.numOfQueue--;
                    break;
                case d.ERROR:
                    l.numOfUploadFailed--;
                    break;
                case d.INVALID:
                    l.numOfInvalid--;
                    break;
                case d.INTERRUPT:
                    l.numofInterrupt--;
                    break;
                }
                switch (j) {
                case d.QUEUED:
                    l.numOfQueue++;
                    break;
                case d.PROGRESS:
                    l.numOfProgress++;
                    break;
                case d.ERROR:
                    l.numOfUploadFailed++;
                    break;
                case d.COMPLETE:
                    l.numOfSuccess++;
                    break;
                case d.CANCELLED:
                    l.numOfCancel++;
                    break;
                case d.INVALID:
                    l.numOfInvalid++;
                    break;
                case d.INTERRUPT:
                    l.numofInterrupt++;
                    break;
                }
            }
        });
        i.installTo(f.prototype);
        return f;
    });
    c("widgets/queue", ["base", "uploader", "queue", "file", "lib/file", "runtime/client", "widgets/widget"], function(g, d, e, l, i, k) {
        var f = g.$
          , h = /\.\w+$/
          , j = l.Status;
        return d.register({
            name: "queue",
            init: function(m) {
                var s = this, u, r, p, t, q, n, o;
                if (f.isPlainObject(m.accept)) {
                    m.accept = [m.accept];
                }
                if (m.accept) {
                    q = [];
                    for (p = 0,
                    r = m.accept.length; p < r; p++) {
                        t = m.accept[p].extensions;
                        t && q.push(t);
                    }
                    if (q.length) {
                        n = "\\." + q.join(",").replace(/,/g, "$|\\.").replace(/\*/g, ".*") + "$";
                    }
                    s.accept = new RegExp(n,"i");
                }
                s.queue = new e();
                s.stats = s.queue.stats;
                if (this.request("predict-runtime-type") !== "html5") {
                    return;
                }
                u = g.Deferred();
                this.placeholder = o = new k("Placeholder");
                o.connectRuntime({
                    runtimeOrder: "html5"
                }, function() {
                    s._ruid = o.getRuid();
                    u.resolve();
                });
                return u.promise();
            },
            _wrapFile: function(m) {
                if (!(m instanceof l)) {
                    if (!(m instanceof i)) {
                        if (!this._ruid) {
                            throw new Error("Can't add external files.");
                        }
                        m = new i(this._ruid,m);
                    }
                    m = new l(m);
                }
                return m;
            },
            acceptFile: function(m) {
                var n = !m || !m.size || this.accept && h.exec(m.name) && !this.accept.test(m.name);
                return !n;
            },
            _addFile: function(m) {
                var n = this;
                m = n._wrapFile(m);
                if (!n.owner.trigger("beforeFileQueued", m)) {
                    return;
                }
                if (!n.acceptFile(m)) {
                    n.owner.trigger("error", "Q_TYPE_DENIED", m);
                    return;
                }
                n.queue.append(m);
                n.owner.trigger("fileQueued", m);
                return m;
            },
            getFile: function(m) {
                return this.queue.getFile(m);
            },
            addFile: function(n) {
                var m = this;
                if (!n.length) {
                    n = [n];
                }
                n = f.map(n, function(o) {
                    return m._addFile(o);
                });
                m.owner.trigger("filesQueued", n);
                if (m.options.auto) {
                    setTimeout(function() {
                        m.request("start-upload");
                    }, 20);
                }
            },
            getStats: function() {
                return this.stats;
            },
            removeFile: function(n, m) {
                var o = this;
                n = n.id ? n : o.queue.getFile(n);
                this.request("cancel-file", n);
                if (m) {
                    this.queue.removeFile(n);
                }
            },
            getFiles: function() {
                return this.queue.getFiles.apply(this.queue, arguments);
            },
            fetchFile: function() {
                return this.queue.fetch.apply(this.queue, arguments);
            },
            retry: function(p, n) {
                var r = this, q, o, m;
                if (p) {
                    p = p.id ? p : r.queue.getFile(p);
                    p.setStatus(j.QUEUED);
                    n || r.request("start-upload");
                    return;
                }
                q = r.queue.getFiles(j.ERROR);
                o = 0;
                m = q.length;
                for (; o < m; o++) {
                    p = q[o];
                    p.setStatus(j.QUEUED);
                }
                r.request("start-upload");
            },
            sortFiles: function() {
                return this.queue.sort.apply(this.queue, arguments);
            },
            reset: function() {
                this.owner.trigger("reset");
                this.queue = new e();
                this.stats = this.queue.stats;
            },
            destroy: function() {
                this.reset();
                this.placeholder && this.placeholder.destroy();
            }
        });
    });
    c("widgets/runtime", ["uploader", "runtime/runtime", "widgets/widget"], function(e, d) {
        e.support = function() {
            return d.hasRuntime.apply(d, arguments);
        }
        ;
        return e.register({
            name: "runtime",
            init: function() {
                if (!this.predictRuntimeType()) {
                    throw Error("Runtime Error");
                }
            },
            predictRuntimeType: function() {
                var j = this.options.runtimeOrder || d.orders, h = this.type, g, f;
                if (!h) {
                    j = j.split(/\s*,\s*/g);
                    for (g = 0,
                    f = j.length; g < f; g++) {
                        if (d.hasRuntime(j[g])) {
                            this.type = h = j[g];
                            break;
                        }
                    }
                }
                return h;
            }
        });
    });
    c("lib/transport", ["base", "runtime/client", "mediator"], function(e, d, g) {
        var f = e.$;
        function h(j) {
            var i = this;
            j = i.options = f.extend(true, {}, h.options, j || {});
            d.call(this, "Transport");
            this._blob = null ;
            this._formData = j.formData || {};
            this._headers = j.headers || {};
            this.on("progress", this._timeout);
            this.on("load error", function() {
                i.trigger("progress", 1);
                clearTimeout(i._timer);
            });
        }
        h.options = {
            server: "",
            method: "POST",
            withCredentials: false,
            fileVal: "file",
            timeout: 2 * 60 * 1000,
            formData: {},
            headers: {},
            sendAsBinary: false
        };
        f.extend(h.prototype, {
            appendBlob: function(k, j, i) {
                var m = this
                  , l = m.options;
                if (m.getRuid()) {
                    m.disconnectRuntime();
                }
                m.connectRuntime(j.ruid, function() {
                    m.exec("init");
                });
                m._blob = j;
                l.fileVal = k || l.fileVal;
                l.filename = i || l.filename;
            },
            append: function(i, j) {
                if (typeof i === "object") {
                    f.extend(this._formData, i);
                } else {
                    this._formData[i] = j;
                }
            },
            setRequestHeader: function(i, j) {
                if (typeof i === "object") {
                    f.extend(this._headers, i);
                } else {
                    this._headers[i] = j;
                }
            },
            send: function(i) {
                this.exec("send", i);
                this._timeout();
            },
            abort: function() {
                clearTimeout(this._timer);
                return this.exec("abort");
            },
            destroy: function() {
                this.trigger("destroy");
                this.off();
                this.exec("destroy");
                this.disconnectRuntime();
            },
            getResponse: function() {
                return this.exec("getResponse");
            },
            getResponseAsJson: function() {
                return this.exec("getResponseAsJson");
            },
            getStatus: function() {
                return this.exec("getStatus");
            },
            _timeout: function() {
                var i = this
                  , j = i.options.timeout;
                if (!j) {
                    return;
                }
                clearTimeout(i._timer);
                i._timer = setTimeout(function() {
                    i.abort();
                    i.trigger("error", "timeout");
                }, j);
            }
        });
        g.installTo(h.prototype);
        return h;
    });
    c("widgets/upload", ["base", "uploader", "file", "lib/transport", "widgets/widget"], function(f, j, i, k) {
        var h = f.$
          , e = f.isPromise
          , d = i.Status;
        h.extend(j.options, {
            prepareNextFile: false,
            chunked: false,
            chunkSize: 5 * 1024 * 1024,
            chunkRetry: 2,
            threads: 3,
            formData: {}
        });
        function g(o, p) {
            var n = [], l = o.source, u = l.size, q = p ? Math.ceil(u / p) : 1, m = 0, t = 0, s, r;
            r = {
                file: o,
                has: function() {
                    return !!n.length;
                },
                shift: function() {
                    return n.shift();
                },
                unshift: function(v) {
                    n.unshift(v);
                }
            };
            while (t < q) {
                s = Math.min(p, u - m);
                n.push({
                    file: o,
                    start: m,
                    end: p ? (m + s) : u,
                    total: u,
                    chunks: q,
                    chunk: t++,
                    cuted: r
                });
                m += s;
            }
            o.blocks = n.concat();
            o.remaning = n.length;
            return r;
        }
        j.register({
            name: "upload",
            init: function() {
                var l = this.owner
                  , m = this;
                this.runing = false;
                this.progress = false;
                l.on("startUpload", function() {
                    m.progress = true;
                }).on("uploadFinished", function() {
                    m.progress = false;
                });
                this.pool = [];
                this.stack = [];
                this.pending = [];
                this.remaning = 0;
                this.__tick = f.bindFn(this._tick, this);
                l.on("uploadComplete", function(n) {
                    n.blocks && h.each(n.blocks, function(p, o) {
                        o.transport && (o.transport.abort(),
                        o.transport.destroy());
                        delete o.transport;
                    });
                    delete n.blocks;
                    delete n.remaning;
                });
            },
            reset: function() {
                this.request("stop-upload", true);
                this.runing = false;
                this.pool = [];
                this.stack = [];
                this.pending = [];
                this.remaning = 0;
                this._trigged = false;
                this._promise = null ;
            },
            startUpload: function(l) {
                var n = this;
                h.each(n.request("get-files", d.INVALID), function() {
                    n.request("remove-file", this);
                });
                if (l) {
                    l = l.id ? l : n.request("get-file", l);
                    if (l.getStatus() === d.INTERRUPT) {
                        h.each(n.pool, function(p, o) {
                            if (o.file !== l) {
                                return;
                            }
                            o.transport && o.transport.send();
                        });
                        l.setStatus(d.QUEUED);
                    } else {
                        if (l.getStatus() === d.PROGRESS) {
                            return;
                        } else {
                            l.setStatus(d.QUEUED);
                        }
                    }
                } else {
                    h.each(n.request("get-files", [d.INITED]), function() {
                        this.setStatus(d.QUEUED);
                    });
                }
                if (n.runing) {
                    return;
                }
                n.runing = true;
                var m = [];
                h.each(n.pool, function(p, o) {
                    var q = o.file;
                    if (q.getStatus() === d.INTERRUPT) {
                        m.push(q);
                        n._trigged = false;
                        o.transport && o.transport.send();
                    }
                });
                var l;
                while ((l = m.shift()) ) {
                    l.setStatus(d.PROGRESS);
                }
                l || h.each(n.request("get-files", d.INTERRUPT), function() {
                    this.setStatus(d.PROGRESS);
                });
                n._trigged = false;
                f.nextTick(n.__tick);
                n.owner.trigger("startUpload");
            },
            stopUpload: function(l, n) {
                var m = this;
                if (l === true) {
                    n = l;
                    l = null ;
                }
                if (m.runing === false) {
                    return;
                }
                if (l) {
                    l = l.id ? l : m.request("get-file", l);
                    if (l.getStatus() !== d.PROGRESS && l.getStatus() !== d.QUEUED) {
                        return;
                    }
                    l.setStatus(d.INTERRUPT);
                    h.each(m.pool, function(p, o) {
                        if (o.file !== l) {
                            return;
                        }
                        o.transport && o.transport.abort();
                        m._putback(o);
                        m._popBlock(o);
                    });
                    return f.nextTick(m.__tick);
                }
                m.runing = false;
                if (this._promise && this._promise.file) {
                    this._promise.file.setStatus(d.INTERRUPT);
                }
                n && h.each(m.pool, function(p, o) {
                    o.transport && o.transport.abort();
                    o.file.setStatus(d.INTERRUPT);
                });
                m.owner.trigger("stopUpload");
            },
            cancelFile: function(l) {
                l = l.id ? l : this.request("get-file", l);
                l.blocks && h.each(l.blocks, function(o, n) {
                    var m = n.transport;
                    if (m) {
                        m.abort();
                        m.destroy();
                        delete n.transport;
                    }
                });
                l.setStatus(d.CANCELLED);
                this.owner.trigger("fileDequeued", l);
            },
            isInProgress: function() {
                return !!this.progress;
            },
            _getStats: function() {
                return this.request("get-stats");
            },
            skipFile: function(m, l) {
                m = m.id ? m : this.request("get-file", m);
                m.setStatus(l || d.COMPLETE);
                m.skipped = true;
                m.blocks && h.each(m.blocks, function(p, o) {
                    var n = o.transport;
                    if (n) {
                        n.abort();
                        n.destroy();
                        delete o.transport;
                    }
                });
                this.owner.trigger("uploadSkip", m);
            },
            _tick: function() {
                var n = this, m = n.options, l, o;
                if (n._promise) {
                    return n._promise.always(n.__tick);
                }
                if (n.pool.length < m.threads && (o = n._nextBlock())) {
                    n._trigged = false;
                    l = function(p) {
                        n._promise = null ;
                        p && p.file && n._startSend(p);
                        f.nextTick(n.__tick);
                    }
                    ;
                    n._promise = e(o) ? o.always(l) : l(o);
                } else {
                    if (!n.remaning && !n._getStats().numOfQueue && !n._getStats().numofInterrupt) {
                        n.runing = false;
                        n._trigged || f.nextTick(function() {
                            n.owner.trigger("uploadFinished");
                        });
                        n._trigged = true;
                    }
                }
            },
            _putback: function(m) {
                var l;
                m.cuted.unshift(m);
                l = this.stack.indexOf(m.cuted);
                if (!~l) {
                    this.stack.unshift(m.cuted);
                }
            },
            _getStack: function() {
                var m = 0, l;
                while ((l = this.stack[m++]) ) {
                    if (l.has() && l.file.getStatus() === d.PROGRESS) {
                        return l;
                    } else {
                        if (!l.has() || l.file.getStatus() !== d.PROGRESS && l.file.getStatus() !== d.INTERRUPT) {
                            this.stack.splice(--m, 1);
                        }
                    }
                }
                return null ;
            },
            _nextBlock: function() {
                var q = this, p = q.options, m, o, l, n;
                if ((m = this._getStack()) ) {
                    if (p.prepareNextFile && !q.pending.length) {
                        q._prepareNextFile();
                    }
                    return m.shift();
                } else {
                    if (q.runing) {
                        if (!q.pending.length && q._getStats().numOfQueue) {
                            q._prepareNextFile();
                        }
                        o = q.pending.shift();
                        l = function(r) {
                            if (!r) {
                                return null ;
                            }
                            m = g(r, p.chunked ? p.chunkSize : 0);
                            q.stack.push(m);
                            return m.shift();
                        }
                        ;
                        if (e(o)) {
                            n = o.file;
                            o = o[o.pipe ? "pipe" : "then"](l);
                            o.file = n;
                            return o;
                        }
                        return l(o);
                    }
                }
            },
            _prepareNextFile: function() {
                var m = this, l = m.request("fetch-file"), o = m.pending, n;
                if (l) {
                    n = m.request("before-send-file", l, function() {
                        if (l.getStatus() === d.PROGRESS || l.getStatus() === d.INTERRUPT) {
                            return l;
                        }
                        return m._finishFile(l);
                    });
                    m.owner.trigger("uploadStart", l);
                    l.setStatus(d.PROGRESS);
                    n.file = l;
                    n.done(function() {
                        var p = h.inArray(n, o);
                        ~p && o.splice(p, 1, l);
                    });
                    n.fail(function(p) {
                        l.setStatus(d.ERROR, p);
                        m.owner.trigger("uploadError", l, p);
                        m.owner.trigger("uploadComplete", l);
                    });
                    o.push(n);
                }
            },
            _popBlock: function(m) {
                var l = h.inArray(m, this.pool);
                this.pool.splice(l, 1);
                m.file.remaning--;
                this.remaning--;
            },
            _startSend: function(o) {
                var m = this, l = o.file, n;
                if (l.getStatus() !== d.PROGRESS) {
                    if (l.getStatus() === d.INTERRUPT) {
                        m._putback(o);
                    }
                    return;
                }
                m.pool.push(o);
                m.remaning++;
                o.blob = o.chunks === 1 ? l.source : l.source.slice(o.start, o.end);
                n = m.request("before-send", o, function() {
                    if (l.getStatus() === d.PROGRESS) {
                        m._doSend(o);
                    } else {
                        m._popBlock(o);
                        f.nextTick(m.__tick);
                    }
                });
                n.fail(function() {
                    if (l.remaning === 1) {
                        m._finishFile(l).always(function() {
                            o.percentage = 1;
                            m._popBlock(o);
                            m.owner.trigger("uploadComplete", l);
                            f.nextTick(m.__tick);
                        });
                    } else {
                        o.percentage = 1;
                        m.updateFileProgress(l);
                        m._popBlock(o);
                        f.nextTick(m.__tick);
                    }
                });
            },
            _doSend: function(p) {
                var t = this, m = t.owner, l = t.options, o = p.file, s = new k(l), q = h.extend({}, l.formData), n = h.extend({}, l.headers), u, r;
                p.transport = s;
                s.on("destroy", function() {
                    delete p.transport;
                    t._popBlock(p);
                    f.nextTick(t.__tick);
                });
                s.on("progress", function(v) {
                    p.percentage = v;
                    t.updateFileProgress(o);
                });
                u = function(w) {
                    var v;
                    r = s.getResponseAsJson() || {};
                    r._raw = s.getResponse();
                    v = function(x) {
                        w = x;
                    }
                    ;
                    if (!m.trigger("uploadAccept", p, r, v)) {
                        w = w || "server";
                    }
                    return w;
                }
                ;
                s.on("error", function(w, v) {
                    p.retried = p.retried || 0;
                    if (p.chunks > 1 && ~"http,abort".indexOf(w) && p.retried < l.chunkRetry) {
                        p.retried++;
                        s.send();
                    } else {
                        if (!v && w === "server") {
                            w = u(w);
                        }
                        o.setStatus(d.ERROR, w);
                        m.trigger("uploadError", o, w);
                        m.trigger("uploadComplete", o);
                    }
                });
                s.on("load", function() {
                    var v;
                    if ((v = u()) ) {
                        s.trigger("error", v, true);
                        return;
                    }
                    if (o.remaning === 1) {
                        t._finishFile(o, r);
                    } else {
                        s.destroy();
                    }
                });
                q = h.extend(q, {
                    id: o.id,
                    name: o.name,
                    type: o.type,
                    lastModifiedDate: o.lastModifiedDate,
                    size: o.size
                });
                p.chunks > 1 && h.extend(q, {
                    chunks: p.chunks,
                    chunk: p.chunk
                });
                m.trigger("uploadBeforeSend", p, q, n);
                s.appendBlob(l.fileVal, p.blob, o.name);
                s.append(q);
                s.setRequestHeader(n);
                s.send();
            },
            _finishFile: function(n, m, o) {
                var l = this.owner;
                return l.request("after-send-file", arguments, function() {
                    n.setStatus(d.COMPLETE);
                    l.trigger("uploadSuccess", n, m, o);
                }).fail(function(p) {
                    if (n.getStatus() === d.PROGRESS) {
                        n.setStatus(d.ERROR, p);
                    }
                    l.trigger("uploadError", n, p);
                }).always(function() {
                    l.trigger("uploadComplete", n);
                });
            },
            updateFileProgress: function(n) {
                var m = 0
                  , l = 0;
                if (!n.blocks) {
                    return;
                }
                h.each(n.blocks, function(p, o) {
                    l += (o.percentage || 0) * (o.end - o.start);
                });
                m = l / n.size;
                this.owner.trigger("uploadProgress", n, m || 0);
            }
        });
    });
    c("widgets/validator", ["base", "uploader", "file", "widgets/widget"], function(e, i, h) {
        var g = e.$, d = {}, f;
        f = {
            addValidator: function(k, j) {
                d[k] = j;
            },
            removeValidator: function(j) {
                delete d[j];
            }
        };
        i.register({
            name: "validator",
            init: function() {
                var j = this;
                e.nextTick(function() {
                    g.each(d, function() {
                        this.call(j.owner);
                    });
                });
            }
        });
        f.addValidator("fileNumLimit", function() {
            var n = this
              , m = n.options
              , l = 0
              , j = parseInt(m.fileNumLimit, 10)
              , k = true;
            if (!j) {
                return;
            }
            n.on("beforeFileQueued", function(o) {
                if (l >= j && k) {
                    k = false;
                    this.trigger("error", "Q_EXCEED_NUM_LIMIT", j, o);
                    setTimeout(function() {
                        k = true;
                    }, 1);
                }
                return l >= j ? false : true;
            });
            n.on("fileQueued", function() {
                l++;
            });
            n.on("fileDequeued", function() {
                l--;
            });
            n.on("reset", function() {
                l = 0;
            });
        });
        f.addValidator("fileSizeLimit", function() {
            var n = this
              , m = n.options
              , l = 0
              , j = parseInt(m.fileSizeLimit, 10)
              , k = true;
            if (!j) {
                return;
            }
            n.on("beforeFileQueued", function(o) {
                var p = l + o.size > j;
                if (p && k) {
                    k = false;
                    this.trigger("error", "Q_EXCEED_SIZE_LIMIT", j, o);
                    setTimeout(function() {
                        k = true;
                    }, 1);
                }
                return p ? false : true;
            });
            n.on("fileQueued", function(o) {
                l += o.size;
            });
            n.on("fileDequeued", function(o) {
                l -= o.size;
            });
            n.on("reset", function() {
                l = 0;
            });
        });
        f.addValidator("fileSingleSizeLimit", function() {
            var l = this
              , k = l.options
              , j = k.fileSingleSizeLimit;
            if (!j) {
                return;
            }
            l.on("beforeFileQueued", function(m) {
                if (m.size > j) {
                    m.setStatus(h.Status.INVALID, "exceed_size");
                    this.trigger("error", "F_EXCEED_SIZE", j, m);
                    return false;
                }
            });
        });
        f.addValidator("duplicate", function() {
            var m = this
              , k = m.options
              , j = {};
            if (k.duplicate) {
                return;
            }
            function l(r) {
                var q = 0, p = 0, n = r.length, o;
                for (; p < n; p++) {
                    o = r.charCodeAt(p);
                    q = o + (q << 6) + (q << 16) - q;
                }
                return q;
            }
            m.on("beforeFileQueued", function(n) {
                var o = n.__hash || (n.__hash = l(n.name + n.size + n.lastModifiedDate));
                if (j[o]) {
                    this.trigger("error", "F_DUPLICATE", n);
                    return false;
                }
            });
            m.on("fileQueued", function(n) {
                var o = n.__hash;
                o && (j[o] = true);
            });
            m.on("fileDequeued", function(n) {
                var o = n.__hash;
                o && (delete j[o]);
            });
            m.on("reset", function() {
                j = {};
            });
        });
        return f;
    });
    c("lib/md5", ["runtime/client", "mediator"], function(e, f) {
        function d() {
            e.call(this, "Md5");
        }
        f.installTo(d.prototype);
        d.prototype.loadFromBlob = function(g) {
            var h = this;
            if (h.getRuid()) {
                h.disconnectRuntime();
            }
            h.connectRuntime(g.ruid, function() {
                h.exec("init");
                h.exec("loadFromBlob", g);
            });
        }
        ;
        d.prototype.getResult = function() {
            return this.exec("getResult");
        }
        ;
        return d;
    });
    c("widgets/md5", ["base", "uploader", "lib/md5", "lib/blob", "widgets/widget"], function(e, f, d, g) {
        return f.register({
            name: "md5",
            md5File: function(k, m, h) {
                var l = new d()
                  , j = e.Deferred()
                  , i = (k instanceof g) ? k : this.request("get-file", k).source;
                l.on("progress load", function(n) {
                    n = n || {};
                    j.notify(n.total ? n.loaded / n.total : 1);
                });
                l.on("complete", function() {
                    j.resolve(l.getResult());
                });
                l.on("error", function(n) {
                    j.reject(n);
                });
                if (arguments.length > 1) {
                    m = m || 0;
                    h = h || 0;
                    m < 0 && (m = i.size + m);
                    h < 0 && (h = i.size + h);
                    h = Math.min(h, i.size);
                    i = i.slice(m, h);
                }
                l.loadFromBlob(i);
                return j.promise();
            }
        });
    });
    c("runtime/compbase", [], function() {
        function d(e, f) {
            this.owner = e;
            this.options = e.options;
            this.getRuntime = function() {
                return f;
            }
            ;
            this.getRuid = function() {
                return f.uid;
            }
            ;
            this.trigger = function() {
                return e.trigger.apply(e, arguments);
            }
            ;
        }
        return d;
    });
    c("runtime/html5/runtime", ["base", "runtime/runtime", "runtime/compbase"], function(e, d, i) {
        var f = "html5"
          , g = {};
        function h() {
            var k = {}
              , l = this
              , j = this.destroy;
            d.apply(l, arguments);
            l.type = f;
            l.exec = function(o, r) {
                var n = this, q = n.uid, p = e.slice(arguments, 2), m;
                if (g[o]) {
                    m = k[q] = k[q] || new g[o](n,l);
                    if (m[r]) {
                        return m[r].apply(m, p);
                    }
                }
            }
            ;
            l.destroy = function() {
                return j && j.apply(this, arguments);
            }
            ;
        }
        e.inherits(d, {
            constructor: h,
            init: function() {
                var j = this;
                setTimeout(function() {
                    j.trigger("ready");
                }, 1);
            }
        });
        h.register = function(l, k) {
            var j = g[l] = e.inherits(i, k);
            return j;
        }
        ;
        if (b.Blob && b.FileReader && b.DataView) {
            d.addRuntime(f, h);
        }
        return h;
    });
    c("runtime/html5/blob", ["runtime/html5/runtime", "lib/blob"], function(e, d) {
        return e.register("Blob", {
            slice: function(i, f) {
                var g = this.owner.source
                  , h = g.slice || g.webkitSlice || g.mozSlice;
                g = h.call(g, i, f);
                return new d(this.getRuid(),g);
            }
        });
    });
    c("runtime/html5/dnd", ["base", "runtime/html5/runtime", "lib/file"], function(e, h, d) {
        var g = e.$
          , f = "webuploader-dnd-";
        return h.register("DragAndDrop", {
            init: function() {
                var i = this.elem = this.options.container;
                this.dragEnterHandler = e.bindFn(this._dragEnterHandler, this);
                this.dragOverHandler = e.bindFn(this._dragOverHandler, this);
                this.dragLeaveHandler = e.bindFn(this._dragLeaveHandler, this);
                this.dropHandler = e.bindFn(this._dropHandler, this);
                this.dndOver = false;
                i.on("dragenter", this.dragEnterHandler);
                i.on("dragover", this.dragOverHandler);
                i.on("dragleave", this.dragLeaveHandler);
                i.on("drop", this.dropHandler);
                if (this.options.disableGlobalDnd) {
                    g(document).on("dragover", this.dragOverHandler);
                    g(document).on("drop", this.dropHandler);
                }
            },
            _dragEnterHandler: function(l) {
                var k = this, j = k._denied || false, i;
                l = l.originalEvent || l;
                if (!k.dndOver) {
                    k.dndOver = true;
                    i = l.dataTransfer.items;
                    if (i && i.length) {
                        k._denied = j = !k.trigger("accept", i);
                    }
                    k.elem.addClass(f + "over");
                    k.elem[j ? "addClass" : "removeClass"](f + "denied");
                }
                l.dataTransfer.dropEffect = j ? "none" : "copy";
                return false;
            },
            _dragOverHandler: function(j) {
                var i = this.elem.parent().get(0);
                if (i && !g.contains(i, j.currentTarget)) {
                    return false;
                }
                clearTimeout(this._leaveTimer);
                this._dragEnterHandler.call(this, j);
                return false;
            },
            _dragLeaveHandler: function() {
                var j = this, i;
                i = function() {
                    j.dndOver = false;
                    j.elem.removeClass(f + "over " + f + "denied");
                }
                ;
                clearTimeout(j._leaveTimer);
                j._leaveTimer = setTimeout(i, 100);
                return false;
            },
            _dropHandler: function(o) {
                var l = this, j = l.getRuid(), i = l.elem.parent().get(0), n, m;
                if (i && !g.contains(i, o.currentTarget)) {
                    return false;
                }
                o = o.originalEvent || o;
                n = o.dataTransfer;
                try {
                    m = n.getData("text/html");
                } catch (k) {}
                if (m) {
                    return;
                }
                l._getTansferFiles(n, function(p) {
                    l.trigger("drop", g.map(p, function(q) {
                        return new d(j,q);
                    }));
                });
                l.dndOver = false;
                l.elem.removeClass(f + "over");
                return false;
            },
            _getTansferFiles: function(q, r) {
                var m = [], p = [], o, j, k, s, l, n, t;
                o = q.items;
                j = q.files;
                t = !!(o && o[0].webkitGetAsEntry);
                for (l = 0,
                n = j.length; l < n; l++) {
                    k = j[l];
                    s = o && o[l];
                    if (t && s.webkitGetAsEntry().isDirectory) {
                        p.push(this._traverseDirectoryTree(s.webkitGetAsEntry(), m));
                    } else {
                        m.push(k);
                    }
                }
                e.when.apply(e, p).done(function() {
                    if (!m.length) {
                        return;
                    }
                    r(m);
                });
            },
            _traverseDirectoryTree: function(l, j) {
                var i = e.Deferred()
                  , k = this;
                if (l.isFile) {
                    l.file(function(m) {
                        j.push(m);
                        i.resolve();
                    });
                } else {
                    if (l.isDirectory) {
                        l.createReader().readEntries(function(o) {
                            var n = o.length, q = [], m = [], p;
                            for (p = 0; p < n; p++) {
                                q.push(k._traverseDirectoryTree(o[p], m));
                            }
                            e.when.apply(e, q).then(function() {
                                j.push.apply(j, m);
                                i.resolve();
                            }, i.reject);
                        });
                    }
                }
                return i.promise();
            },
            destroy: function() {
                var i = this.elem;
                if (!i) {
                    return;
                }
                i.off("dragenter", this.dragEnterHandler);
                i.off("dragover", this.dragOverHandler);
                i.off("dragleave", this.dragLeaveHandler);
                i.off("drop", this.dropHandler);
                if (this.options.disableGlobalDnd) {
                    g(document).off("dragover", this.dragOverHandler);
                    g(document).off("drop", this.dropHandler);
                }
            }
        });
    });
    c("runtime/html5/filepaste", ["base", "runtime/html5/runtime", "lib/file"], function(e, f, d) {
        return f.register("FilePaste", {
            init: function() {
                var n = this.options, m = this.elem = n.container, k = ".*", h, j, g, l;
                if (n.accept) {
                    h = [];
                    for (j = 0,
                    g = n.accept.length; j < g; j++) {
                        l = n.accept[j].mimeTypes;
                        l && h.push(l);
                    }
                    if (h.length) {
                        k = h.join(",");
                        k = k.replace(/,/g, "|").replace(/\*/g, ".*");
                    }
                }
                this.accept = k = new RegExp(k,"i");
                this.hander = e.bindFn(this._pasteHander, this);
                m.on("paste", this.hander);
            },
            _pasteHander: function(n) {
                var o = [], k = this.getRuid(), j, m, h, l, g;
                n = n.originalEvent || n;
                j = n.clipboardData.items;
                for (l = 0,
                g = j.length; l < g; l++) {
                    m = j[l];
                    if (m.kind !== "file" || !(h = m.getAsFile())) {
                        continue;
                    }
                    o.push(new d(k,h));
                }
                if (o.length) {
                    n.preventDefault();
                    n.stopPropagation();
                    this.trigger("paste", o);
                }
            },
            destroy: function() {
                this.elem.off("paste", this.hander);
            }
        });
    });
    c("runtime/html5/filepicker", ["base", "runtime/html5/runtime"], function(d, f) {
        var e = d.$;
        return f.register("FilePicker", {
            init: function() {
                var h = this.getRuntime().getContainer(), n = this, j = n.owner, g = n.options, p = this.label = e(document.createElement("label")), q = this.input = e(document.createElement("input")), l, k, m, o;
                q.attr("type", "file");
                q.attr("name", g.name);
                q.addClass("webuploader-element-invisible");
                p.on("click", function() {
                    q.trigger("click");
                });
                p.css({
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    cursor: "pointer",
                    background: "#ffffff"
                });
                if (g.multiple) {
                    q.attr("multiple", "multiple");
                }
                if (g.accept && g.accept.length > 0) {
                    l = [];
                    for (k = 0,
                    m = g.accept.length; k < m; k++) {
                        l.push(g.accept[k].mimeTypes);
                    }
                    q.attr("accept", l.join(","));
                }
                h.append(q);
                h.append(p);
                o = function(i) {
                    j.trigger(i.type);
                }
                ;
                q.on("change", function(r) {
                    var i = arguments.callee, s;
                    n.files = r.target.files;
                    s = this.cloneNode(true);
                    s.value = null ;
                    this.parentNode.replaceChild(s, this);
                    q.off();
                    q = e(s).on("change", i).on("mouseenter mouseleave", o);
                    j.trigger("change");
                });
                p.on("mouseenter mouseleave", o);
            },
            getFiles: function() {
                return this.files;
            },
            destroy: function() {
                this.input.off();
                this.label.off();
            }
        });
    });
    c("runtime/html5/util", ["base"], function(e) {
        var f = b.createObjectURL && b || b.URL && URL.revokeObjectURL && URL || b.webkitURL
          , g = e.noop
          , d = g;
        if (f) {
            g = function() {
                return f.createObjectURL.apply(f, arguments);
            }
            ;
            d = function() {
                return f.revokeObjectURL.apply(f, arguments);
            }
            ;
        }
        return {
            createObjectURL: g,
            revokeObjectURL: d,
            dataURL2Blob: function(j) {
                var m, o, l, k, h, n;
                n = j.split(",");
                if (~n[0].indexOf("base64")) {
                    m = atob(n[1]);
                } else {
                    m = decodeURIComponent(n[1]);
                }
                l = new ArrayBuffer(m.length);
                o = new Uint8Array(l);
                for (k = 0; k < m.length; k++) {
                    o[k] = m.charCodeAt(k);
                }
                h = n[0].split(":")[1].split(";")[0];
                return this.arrayBufferToBlob(l, h);
            },
            dataURL2ArrayBuffer: function(h) {
                var k, m, j, l;
                l = h.split(",");
                if (~l[0].indexOf("base64")) {
                    k = atob(l[1]);
                } else {
                    k = decodeURIComponent(l[1]);
                }
                m = new Uint8Array(k.length);
                for (j = 0; 
                j < k.length; j++) {
                    m[j] = k.charCodeAt(j);
                }
                return m.buffer;
            },
            arrayBufferToBlob: function(h, j) {
                var i = b.BlobBuilder || b.WebKitBlobBuilder, k;
                if (i) {
                    k = new i();
                    k.append(h);
                    return k.getBlob(j);
                }
                return new Blob([h],j ? {
                    type: j
                } : {});
            },
            canvasToDataUrl: function(h, i, j) {
                return h.toDataURL(i, j / 100);
            },
            parseMeta: function(h, i) {
                i(false, {});
            },
            updateImageHead: function(h) {
                return h;
            }
        };
    });
    c("runtime/html5/imagemeta", ["runtime/html5/util"], function(e) {
        var d;
        d = {
            parsers: {
                65505: []
            },
            maxMetaDataSize: 262144,
            parse: function(h, f) {
                var i = this
                  , g = new FileReader();
                g.onload = function() {
                    f(false, i._parse(this.result));
                    g = g.onload = g.onerror = null ;
                }
                ;
                g.onerror = function(j) {
                    f(j.message);
                    g = g.onload = g.onerror = null ;
                }
                ;
                h = h.slice(0, i.maxMetaDataSize);
                g.readAsArrayBuffer(h.getSource());
            },
            _parse: function(k, p) {
                if (k.byteLength < 6) {
                    return;
                }
                var m = new DataView(k), j = 2, g = m.byteLength - 4, n = j, o = {}, f, h, q, l;
                if (m.getUint16(0) === 65496) {
                    while (j < g) {
                        f = m.getUint16(j);
                        if (f >= 65504 && f <= 65519 || f === 65534) {
                            h = m.getUint16(j + 2) + 2;
                            if (j + h > m.byteLength) {
                                break;
                            }
                            q = d.parsers[f];
                            if (!p && q) {
                                for (l = 0; l < q.length; l += 1) {
                                    q[l].call(d, m, j, h, o);
                                }
                            }
                            j += h;
                            n = j;
                        } else {
                            break;
                        }
                    }
                    if (n > 6) {
                        if (k.slice) {
                            o.imageHead = k.slice(2, n);
                        } else {
                            o.imageHead = new Uint8Array(k).subarray(2, n);
                        }
                    }
                }
                return o;
            },
            updateImageHead: function(f, g) {
                var i = this._parse(f, true), j, h, k;
                k = 2;
                if (i.imageHead) {
                    k = 2 + i.imageHead.byteLength;
                }
                if (f.slice) {
                    h = f.slice(k);
                } else {
                    h = new Uint8Array(f).subarray(k);
                }
                j = new Uint8Array(g.byteLength + 2 + h.byteLength);
                j[0] = 255;
                j[1] = 216;
                j.set(new Uint8Array(g), 2);
                j.set(new Uint8Array(h), g.byteLength + 2);
                return j.buffer;
            }
        };
        e.parseMeta = function() {
            return d.parse.apply(d, arguments);
        }
        ;
        e.updateImageHead = function() {
            return d.updateImageHead.apply(d, arguments);
        }
        ;
        return d;
    });
    c("runtime/html5/imagemeta/exif", ["base", "runtime/html5/imagemeta"], function(f, e) {
        var d = {};
        d.ExifMap = function() {
            return this;
        }
        ;
        d.ExifMap.prototype.map = {
            "Orientation": 274
        };
        d.ExifMap.prototype.get = function(g) {
            return this[g] || this[this.map[g]];
        }
        ;
        d.exifTagTypes = {
            1: {
                getValue: function(h, g) {
                    return h.getUint8(g);
                },
                size: 1
            },
            2: {
                getValue: function(h, g) {
                    return String.fromCharCode(h.getUint8(g));
                },
                size: 1,
                ascii: true
            },
            3: {
                getValue: function(i, g, h) {
                    return i.getUint16(g, h);
                },
                size: 2
            },
            4: {
                getValue: function(i, g, h) {
                    return i.getUint32(g, h);
                },
                size: 4
            },
            5: {
                getValue: function(i, g, h) {
                    return i.getUint32(g, h) / i.getUint32(g + 4, h);
                },
                size: 8
            },
            9: {
                getValue: function(i, g, h) {
                    return i.getInt32(g, h);
                },
                size: 4
            },
            10: {
                getValue: function(i, g, h) {
                    return i.getInt32(g, h) / i.getInt32(g + 4, h);
                },
                size: 8
            }
        };
        d.exifTagTypes[7] = d.exifTagTypes[1];
        d.getExifValue = function(r, q, l, p, j, g) {
            var s = d.exifTagTypes[p], h, k, t, m, o, n;
            if (!s) {
                f.log("Invalid Exif data: Invalid tag type.");
                return;
            }
            h = s.size * j;
            k = h > 4 ? q + r.getUint32(l + 8, g) : (l + 8);
            if (k + h > r.byteLength) {
                f.log("Invalid Exif data: Invalid data offset.");
                return;
            }
            if (j === 1) {
                return s.getValue(r, k, g);
            }
            t = [];
            for (m = 0; m < j; m += 1) {
                t[m] = s.getValue(r, k + m * s.size, g);
            }
            if (s.ascii) {
                o = "";
                for (m = 0; m < t.length; m += 1) {
                    n = t[m];
                    if (n === "\u0000") {
                        break;
                    }
                    o += n;
                }
                return o;
            }
            return t;
        }
        ;
        d.parseExifTag = function(l, h, k, j, i) {
            var g = l.getUint16(k, j);
            i.exif[g] = d.getExifValue(l, h, k, l.getUint16(k + 2, j), l.getUint32(k + 4, j), j);
        }
        ;
        d.parseExifTags = function(n, k, h, m, l) {
            var o, g, j;
            if (h + 6 > n.byteLength) {
                f.log("Invalid Exif data: Invalid directory offset.");
                return;
            }
            o = n.getUint16(h, m);
            g = h + 2 + 12 * o;
            if (g + 4 > n.byteLength) {
                f.log("Invalid Exif data: Invalid directory size.");
                return;
            }
            for (j = 0; j < o; j += 1) {
                this.parseExifTag(n, k, h + 2 + 12 * j, m, l);
            }
            return n.getUint32(g, m);
        }
        ;
        d.parseExifData = function(m, l, i, j) {
            var h = l + 10, k, g;
            if (m.getUint32(l + 4) !== 1165519206) {
                return;
            }
            if (h + 8 > m.byteLength) {
                f.log("Invalid Exif data: Invalid segment size.");
                return;
            }
            if (m.getUint16(l + 8) !== 0) {
                f.log("Invalid Exif data: Missing byte alignment offset.");
                return;
            }
            switch (m.getUint16(h)) {
            case 18761:
                k = true;
                break;
            case 19789:
                k = false;
                break;
            default:
                f.log("Invalid Exif data: Invalid byte alignment marker.");
                return;
            }
            if (m.getUint16(h + 2, k) !== 42) {
                f.log("Invalid Exif data: Missing TIFF marker.");
                return;
            }
            g = m.getUint32(h + 4, k);
            j.exif = new d.ExifMap();
            g = d.parseExifTags(m, h, h + g, k, j);
        }
        ;
        e.parsers[65505].push(d.parseExifData);
        return d;
    });
    c("runtime/html5/jpegencoder", [], function(e, d, f) {
        function g(r) {
            var t = this;
            var J = Math.round;
            var R = Math.floor;
            var n = new Array(64);
            var Q = new Array(64);
            var X = new Array(64);
            var ae = new Array(64);
            var H;
            var o;
            var x;
            var aa;
            var P = new Array(65535);
            var s = new Array(65535);
            var V = new Array(64);
            var Y = new Array(64);
            var p = [];
            var I = 0;
            var h = 7;
            var K = new Array(64);
            var k = new Array(64);
            var ab = new Array(64);
            var l = new Array(256);
            var L = new Array(2048);
            var G;
            var U = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
            var m = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
            var i = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var F = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
            var z = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250];
            var E = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
            var af = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var u = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
            var B = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
            function S(an) {
                var am = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
                for (var al = 0; al < 64; al++) {
                    var aq = R((am[al] * an + 50) / 100);
                    if (aq < 1) {
                        aq = 1;
                    } else {
                        if (aq > 255) {
                            aq = 255;
                        }
                    }
                    n[U[al]] = aq;
                }
                var ao = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
                for (var ak = 0; ak < 64; ak++) {
                    var ap = R((ao[ak] * an + 50) / 100);
                    if (ap < 1) {
                        ap = 1;
                    } else {
                        if (ap > 255) {
                            ap = 255;
                        }
                    }
                    Q[U[ak]] = ap;
                }
                var aj = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379];
                var ai = 0;
                for (var ar = 0; ar < 8; ar++) {
                    for (var ah = 0; ah < 8; ah++) {
                        X[ai] = (1 / (n[U[ai]] * aj[ar] * aj[ah] * 8));
                        ae[ai] = (1 / (Q[U[ai]] * aj[ar] * aj[ah] * 8));
                        ai++;
                    }
                }
            }
            function O(al, am) {
                var ak = 0;
                var an = 0;
                var aj = new Array();
                for (var ah = 1; 
                ah <= 16; ah++) {
                    for (var ai = 1; ai <= al[ah]; ai++) {
                        aj[am[an]] = [];
                        aj[am[an]][0] = ak;
                        aj[am[an]][1] = ah;
                        an++;
                        ak++;
                    }
                    ak *= 2;
                }
                return aj;
            }
            function ad() {
                H = O(m, i);
                o = O(E, af);
                x = O(F, z);
                aa = O(u, B);
            }
            function C() {
                var ai = 1;
                var ak = 2;
                for (var ah = 1; ah <= 15; ah++) {
                    for (var aj = ai; aj < ak; aj++) {
                        s[32767 + aj] = ah;
                        P[32767 + aj] = [];
                        P[32767 + aj][1] = ah;
                        P[32767 + aj][0] = aj;
                    }
                    for (var al = -(ak - 1); al <= -ai; al++) {
                        s[32767 + al] = ah;
                        P[32767 + al] = [];
                        P[32767 + al][1] = ah;
                        P[32767 + al][0] = ak - 1 + al;
                    }
                    ai <<= 1;
                    ak <<= 1;
                }
            }
            function ac() {
                for (var ah = 0; ah < 256; ah++) {
                    L[ah] = 19595 * ah;
                    L[(ah + 256) >> 0] = 38470 * ah;
                    L[(ah + 512) >> 0] = 7471 * ah + 32768;
                    L[(ah + 768) >> 0] = -11059 * ah;
                    L[(ah + 1024) >> 0] = -21709 * ah;
                    L[(ah + 1280) >> 0] = 32768 * ah + 8421375;
                    L[(ah + 1536) >> 0] = -27439 * ah;
                    L[(ah + 1792) >> 0] = -5329 * ah;
                }
            }
            function ag(ai) {
                var aj = ai[0];
                var ah = ai[1] - 1;
                while (ah >= 0) {
                    if (aj & (1 << ah)) {
                        I |= (1 << h);
                    }
                    ah--;
                    h--;
                    if (h < 0) {
                        if (I == 255) {
                            y(255);
                            y(0);
                        } else {
                            y(I);
                        }
                        h = 7;
                        I = 0;
                    }
                }
            }
            function y(ah) {
                p.push(l[ah]);
            }
            function N(ah) {
                y((ah >> 8) & 255);
                y((ah) & 255);
            }
            function T(a5, aC) {
                var aT, aS, aR, aQ, aP, aN, aM, aK;
                var aW = 0;
                var aY;
                var aB = 8;
                var av = 64;
                for (aY = 0; aY < aB; ++aY) {
                    aT = a5[aW];
                    aS = a5[aW + 1];
                    aR = a5[aW + 2];
                    aQ = a5[aW + 3];
                    aP = a5[aW + 4];
                    aN = a5[aW + 5];
                    aM = a5[aW + 6];
                    aK = a5[aW + 7];
                    var a6 = aT + aK;
                    var aV = aT - aK;
                    var a4 = aS + aM;
                    var aX = aS - aM;
                    var a3 = aR + aN;
                    var aZ = aR - aN;
                    var a2 = aQ + aP;
                    var a0 = aQ - aP;
                    var az = a6 + a2;
                    var aw = a6 - a2;
                    var ay = a4 + a3;
                    var ax = a4 - a3;
                    a5[aW] = az + ay;
                    a5[aW + 4] = az - ay;
                    var aH = (ax + aw) * 0.707106781;
                    a5[aW + 2] = aw + aH;
                    a5[aW + 6] = aw - aH;
                    az = a0 + aZ;
                    ay = aZ + aX;
                    ax = aX + aV;
                    var aD = (az - ax) * 0.382683433;
                    var aG = 0.5411961 * az + aD;
                    var aE = 1.306562965 * ax + aD;
                    var aF = ay * 0.707106781;
                    var ar = aV + aF;
                    var aq = aV - aF;
                    a5[aW + 5] = aq + aG;
                    a5[aW + 3] = aq - aG;
                    a5[aW + 1] = ar + aE;
                    a5[aW + 7] = ar - aE;
                    aW += 8;
                }
                aW = 0;
                for (aY = 0; aY < aB; ++aY) {
                    aT = a5[aW];
                    aS = a5[aW + 8];
                    aR = a5[aW + 16];
                    aQ = a5[aW + 24];
                    aP = a5[aW + 32];
                    aN = a5[aW + 40];
                    aM = a5[aW + 48];
                    aK = a5[aW + 56];
                    var au = aT + aK;
                    var aA = aT - aK;
                    var ao = aS + aM;
                    var aI = aS - aM;
                    var al = aR + aN;
                    var aL = aR - aN;
                    var ai = aQ + aP;
                    var a1 = aQ - aP;
                    var at = au + ai;
                    var ah = au - ai;
                    var an = ao + al;
                    var ak = ao - al;
                    a5[aW] = at + an;
                    a5[aW + 32] = at - an;
                    var ap = (ak + ah) * 0.707106781;
                    a5[aW + 16] = ah + ap;
                    a5[aW + 48] = ah - ap;
                    at = a1 + aL;
                    an = aL + aI;
                    ak = aI + aA;
                    var aU = (at - ak) * 0.382683433;
                    var am = 0.5411961 * at + aU;
                    var a8 = 1.306562965 * ak + aU;
                    var aj = an * 0.707106781;
                    var a7 = aA + aj;
                    var aJ = aA - aj;
                    a5[aW + 40] = aJ + am;
                    a5[aW + 24] = aJ - am;
                    a5[aW + 8] = a7 + a8;
                    a5[aW + 56] = a7 - a8;
                    aW++;
                }
                var aO;
                for (aY = 0; aY < av; ++aY) {
                    aO = a5[aY] * aC[aY];
                    V[aY] = (aO > 0) ? ((aO + 0.5) | 0) : ((aO - 0.5) | 0);
                }
                return V;
            }
            function Z() {
                N(65504);
                N(16);
                y(74);
                y(70);
                y(73);
                y(70);
                y(0);
                y(1);
                y(1);
                y(0);
                N(1);
                N(1);
                y(0);
                y(0);
            }
            function M(ai, ah) {
                N(65472);
                N(17);
                y(8);
                N(ah);
                N(ai);
                y(3);
                y(1);
                y(17);
                y(0);
                y(2);
                y(17);
                y(1);
                y(3);
                y(17);
                y(1);
            }
            function A() {
                N(65499);
                N(132);
                y(0);
                for (var ai = 0; ai < 64; ai++) {
                    y(n[ai]);
                }
                y(1);
                for (var ah = 0; ah < 64; ah++) {
                    y(Q[ah]);
                }
            }
            function w() {
                N(65476);
                N(418);
                y(0);
                for (var al = 0; al < 16; al++) {
                    y(m[al + 1]);
                }
                for (var ak = 0; ak <= 11; ak++) {
                    y(i[ak]);
                }
                y(16);
                for (var aj = 0; aj < 16; aj++) {
                    y(F[aj + 1]);
                }
                for (var ai = 0; ai <= 161; ai++) {
                    y(z[ai]);
                }
                y(1);
                for (var ah = 0; ah < 16; ah++) {
                    y(E[ah + 1]);
                }
                for (var ao = 0; ao <= 11; ao++) {
                    y(af[ao]);
                }
                y(17);
                for (var an = 0; an < 16; an++) {
                    y(u[an + 1]);
                }
                for (var am = 0; am <= 161; am++) {
                    y(B[am]);
                }
            }
            function v() {
                N(65498);
                N(12);
                y(3);
                y(1);
                y(0);
                y(2);
                y(17);
                y(3);
                y(17);
                y(0);
                y(63);
                y(0);
            }
            function q(al, ah, ar, ax, aw) {
                var an = aw[0];
                var aj = aw[240];
                var ak;
                var ay = 16;
                var ao = 63;
                var am = 64;
                var az = T(al, ah);
                for (var at = 0; at < am; ++at) {
                    Y[U[at]] = az[at];
                }
                var av = Y[0] - ar;
                ar = Y[0];
                if (av == 0) {
                    ag(ax[0]);
                } else {
                    ak = 32767 + av;
                    ag(ax[s[ak]]);
                    ag(P[ak]);
                }
                var ai = 63;
                for (; (ai > 0) && (Y[ai] == 0); ai--) {}
                if (ai == 0) {
                    ag(an);
                    return ar;
                }
                var au = 1;
                var aB;
                while (au <= ai) {
                    var aq = au;
                    for (; (Y[au] == 0) && (au <= ai); ++au) {}
                    var ap = au - aq;
                    if (ap >= ay) {
                        aB = ap >> 4;
                        for (var aA = 1; aA <= aB; ++aA) {
                            ag(aj);
                        }
                        ap = ap & 15;
                    }
                    ak = 32767 + Y[au];
                    ag(aw[(ap << 4) + s[ak]]);
                    ag(P[ak]);
                    au++;
                }
                if (ai != ao) {
                    ag(an);
                }
                return ar;
            }
            function D() {
                var ai = String.fromCharCode;
                for (var ah = 0; ah < 256; ah++) {
                    l[ah] = ai(ah);
                }
            }
            this.encode = function(av, ap) {
                if (ap) {
                    j(ap);
                }
                p = new Array();
                I = 0;
                h = 7;
                N(65496);
                Z();
                A();
                M(av.width, av.height);
                w();
                v();
                var aq = 0;
                var aw = 0;
                var au = 0;
                I = 0;
                h = 7;
                this.encode.displayName = "_encode_";
                var aC = av.data;
                var az = av.width;
                var at = av.height;
                var ay = az * 4;
                var ah = az * 3;
                var ao, an = 0;
                var ar, aB, aD;
                var ai, ax, ak, am, al;
                while (an < at) {
                    ao = 0;
                    while (ao < ay) {
                        ai = ay * an + ao;
                        ax = ai;
                        ak = -1;
                        am = 0;
                        for (al = 0; al < 64; al++) {
                            am = al >> 3;
                            ak = (al & 7) * 4;
                            ax = ai + (am * ay) + ak;
                            if (an + am >= at) {
                                ax -= (ay * (an + 1 + am - at));
                            }
                            if (ao + ak >= ay) {
                                ax -= ((ao + ak) - ay + 4);
                            }
                            ar = aC[ax++];
                            aB = aC[ax++];
                            aD = aC[ax++];
                            K[al] = ((L[ar] + L[(aB + 256) >> 0] + L[(aD + 512) >> 0]) >> 16) - 128;
                            k[al] = ((L[(ar + 768) >> 0] + L[(aB + 1024) >> 0] + L[(aD + 1280) >> 0]) >> 16) - 128;
                            ab[al] = ((L[(ar + 1280) >> 0] + L[(aB + 1536) >> 0] + L[(aD + 1792) >> 0]) >> 16) - 128;
                        }
                        aq = q(K, X, aq, H, x);
                        aw = q(k, ae, aw, o, aa);
                        au = q(ab, ae, au, o, aa);
                        ao += 32;
                    }
                    an += 8;
                }
                if (h >= 0) {
                    var aA = [];
                    aA[1] = h + 1;
                    aA[0] = (1 << (h + 1)) - 1;
                    ag(aA);
                }
                N(65497);
                var aj = "data:image/jpeg;base64," + btoa(p.join(""));
                p = [];
                return aj;
            }
            ;
            function j(ai) {
                if (ai <= 0) {
                    ai = 1;
                }
                if (ai > 100) {
                    ai = 100;
                }
                if (G == ai) {
                    return;
                }
                var ah = 0;
                if (ai < 50) {
                    ah = Math.floor(5000 / ai);
                } else {
                    ah = Math.floor(200 - ai * 2);
                }
                S(ah);
                G = ai;
            }
            function W() {
                if (!r) {
                    r = 50;
                }
                D();
                ad();
                C();
                ac();
                j(r);
            }
            W();
        }
        g.encode = function(i, j) {
            var h = new g(j);
            return h.encode(i);
        }
        ;
        return g;
    });
    c("runtime/html5/androidpatch", ["runtime/html5/util", "runtime/html5/jpegencoder", "base"], function(h, g, f) {
        var d = h.canvasToDataUrl, e;
        h.canvasToDataUrl = function(k, m, p) {
            var j, i, l, n, o;
            if (!f.os.android) {
                return d.apply(null , arguments);
            }
            if (m === "image/jpeg" && typeof e === "undefined") {
                n = d.apply(null , arguments);
                o = n.split(",");
                if (~o[0].indexOf("base64")) {
                    n = atob(o[1]);
                } else {
                    n = decodeURIComponent(o[1]);
                }
                n = n.substring(0, 2);
                e = n.charCodeAt(0) === 255 && n.charCodeAt(1) === 216;
            }
            if (m === "image/jpeg" && !e) {
                i = k.width;
                l = k.height;
                j = k.getContext("2d");
                return g.encode(j.getImageData(0, 0, i, l), p);
            }
            return d.apply(null , arguments);
        }
        ;
    });
    c("runtime/html5/image", ["base", "runtime/html5/runtime", "runtime/html5/util"], function(d, g, e) {
        var f = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
        return g.register("Image", {
            modified: false,
            init: function() {
                var i = this
                  , h = new Image();
                h.onload = function() {
                    i._info = {
                        type: i.type,
                        width: this.width,
                        height: this.height
                    };
                    if (!i._metas && "image/jpeg" === i.type) {
                        e.parseMeta(i._blob, function(k, j) {
                            i._metas = j;
                            i.owner.trigger("load");
                        });
                    } else {
                        i.owner.trigger("load");
                    }
                }
                ;
                h.onerror = function() {
                    i.owner.trigger("error");
                }
                ;
                i._img = h;
            },
            loadFromBlob: function(i) {
                var j = this
                  , h = j._img;
                j._blob = i;
                j.type = i.type;
                h.src = e.createObjectURL(i.getSource());
                j.owner.once("load", function() {
                    e.revokeObjectURL(h.src);
                });
            },
            resize: function(j, h) {
                var i = this._canvas || (this._canvas = document.createElement("canvas"));
                this._resize(this._img, i, j, h);
                this._blob = null ;
                this.modified = true;
                this.owner.trigger("complete", "resize");
            },
            crop: function(p, o, q, n, t) {
                var m = this._canvas || (this._canvas = document.createElement("canvas"))
                  , i = this.options
                  , l = this._img
                  , k = l.naturalWidth
                  , r = l.naturalHeight
                  , j = this.getOrientation();
                t = t || 1;
                m.width = q;
                m.height = n;
                i.preserveHeaders || this._rotate2Orientaion(m, j);
                this._renderImageToCanvas(m, l, -p, -o, k * t, r * t);
                this._blob = null ;
                this.modified = true;
                this.owner.trigger("complete", "crop");
            },
            getAsBlob: function(j) {
                var h = this._blob, k = this.options, i;
                j = j || this.type;
                if (this.modified || this.type !== j) {
                    i = this._canvas;
                    if (j === "image/jpeg") {
                        h = e.canvasToDataUrl(i, j, k.quality);
                        if (k.preserveHeaders && this._metas && this._metas.imageHead) {
                            h = e.dataURL2ArrayBuffer(h);
                            h = e.updateImageHead(h, this._metas.imageHead);
                            h = e.arrayBufferToBlob(h, j);
                            return h;
                        }
                    } else {
                        h = e.canvasToDataUrl(i, j);
                    }
                    h = e.dataURL2Blob(h);
                }
                return h;
            },
            getAsDataUrl: function(h) {
                var i = this.options;
                h = h || this.type;
                if (h === "image/jpeg") {
                    return e.canvasToDataUrl(this._canvas, h, i.quality);
                } else {
                    return this._canvas.toDataURL(h);
                }
            },
            getOrientation: function() {
                return this._metas && this._metas.exif && this._metas.exif.get("Orientation") || 1;
            },
            info: function(h) {
                if (h) {
                    this._info = h;
                    return this;
                }
                return this._info;
            },
            meta: function(h) {
                if (h) {
                    this._meta = h;
                    return this;
                }
                return this._meta;
            },
            destroy: function() {
                var h = this._canvas;
                this._img.onload = null ;
                if (h) {
                    h.getContext("2d").clearRect(0, 0, h.width, h.height);
                    h.width = h.height = 0;
                    this._canvas = null ;
                }
                this._img.src = f;
                this._img = this._blob = null ;
            },
            _resize: function(m, o, j, u) {
                var i = this.options, p = m.width, t = m.height, k = this.getOrientation(), l, s, n, r, q;
                if (~[5, 6, 7, 8].indexOf(k)) {
                    j ^= u;
                    u ^= j;
                    j ^= u;
                }
                l = Math[i.crop ? "max" : "min"](j / p, u / t);
                i.allowMagnify || (l = Math.min(1, l));
                s = p * l;
                n = t * l;
                if (i.crop) {
                    o.width = j;
                    o.height = u;
                } else {
                    o.width = s;
                    o.height = n;
                }
                r = (o.width - s) / 2;
                q = (o.height - n) / 2;
                i.preserveHeaders || this._rotate2Orientaion(o, k);
                this._renderImageToCanvas(o, m, r, q, s, n);
            },
            _rotate2Orientaion: function(k, j) {
                var l = k.width
                  , h = k.height
                  , i = k.getContext("2d");
                switch (j) {
                case 5:
                case 6:
                case 7:
                case 8:
                    k.width = h;
                    k.height = l;
                    break;
                }
                switch (j) {
                case 2:
                    i.translate(l, 0);
                    i.scale(-1, 1);
                    break;
                case 3:
                    i.translate(l, h);
                    i.rotate(Math.PI);
                    break;
                case 4:
                    i.translate(0, h);
                    i.scale(1, -1);
                    break;
                case 5:
                    i.rotate(0.5 * Math.PI);
                    i.scale(1, -1);
                    break;
                case 6:
                    i.rotate(0.5 * Math.PI);
                    i.translate(0, -h);
                    break;
                case 7:
                    i.rotate(0.5 * Math.PI);
                    i.translate(l, -h);
                    i.scale(-1, 1);
                    break;
                case 8:
                    i.rotate(-0.5 * Math.PI);
                    i.translate(-l, 0);
                    break;
                }
            },
            _renderImageToCanvas: (function() {
                if (!d.os.ios) {
                    return function(l) {
                        var k = d.slice(arguments, 1)
                          , j = l.getContext("2d");
                        j.drawImage.apply(j, k);
                    }
                    ;
                }
                function i(n, k, s) {
                    var j = document.createElement("canvas"), t = j.getContext("2d"), q = 0, o = s, r = s, m, l, p;
                    j.width = 1;
                    j.height = s;
                    t.drawImage(n, 0, 0);
                    m = t.getImageData(0, 0, 1, s).data;
                    while (r > q) {
                        l = m[(r - 1) * 4 + 3];
                        if (l === 0) {
                            o = r;
                        } else {
                            q = r;
                        }
                        r = (o + q) >> 1;
                    }
                    p = (r / s);
                    return (p === 0) ? 1 : p;
                }
                if (d.os.ios >= 7) {
                    return function(j, l, p, o, q, m) {
                        var k = l.naturalWidth
                          , r = l.naturalHeight
                          , n = i(l, k, r);
                        return j.getContext("2d").drawImage(l, 0, 0, k * n, r * n, p, o, q, m);
                    }
                    ;
                }
                function h(l) {
                    var k = l.naturalWidth, n = l.naturalHeight, m, j;
                    if (k * n > 1024 * 1024) {
                        m = document.createElement("canvas");
                        m.width = m.height = 1;
                        j = m.getContext("2d");
                        j.drawImage(l, -k + 1, 0);
                        return j.getImageData(0, 0, 1, 1).data[3] === 0;
                    } else {
                        return false;
                    }
                }
                return function(m, F, q, p, A, z) {
                    var o = F.naturalWidth, u = F.naturalHeight, B = m.getContext("2d"), l = h(F), j = this.type === "image/jpeg", E = 1024, v = 0, r = 0, k, n, C, t, D, w, s;
                    if (l) {
                        o /= 2;
                        u /= 2;
                    }
                    B.save();
                    k = document.createElement("canvas");
                    k.width = k.height = E;
                    n = k.getContext("2d");
                    C = j ? i(F, o, u) : 1;
                    t = Math.ceil(E * A / o);
                    D = Math.ceil(E * z / u / C);
                    while (v < u) {
                        w = 0;
                        s = 0;
                        while (w < o) {
                            n.clearRect(0, 0, E, E);
                            n.drawImage(F, -w, -v);
                            B.drawImage(k, 0, 0, E, E, q + s, p + r, t, D);
                            w += E;
                            s += t;
                        }
                        v += E;
                        r += D;
                    }
                    B.restore();
                    k = n = null ;
                }
                ;
            })()
        });
    });
    c("runtime/html5/transport", ["base", "runtime/html5/runtime"], function(d, g) {
        var e = d.noop
          , f = d.$;
        return g.register("Transport", {
            init: function() {
                this._status = 0;
                this._response = null ;
            },
            send: function() {
                var j = this.owner, h = this.options, t = this._initAjax(), i = j._blob, n = h.server, l, q, r;
                if (h.sendAsBinary) {
                    n += (/\?/.test(n) ? "&" : "?") + f.param(j._formData);
                    q = i.getSource();
                } else {
                    var o = [];
                    o.push('{"data":{},');
                    var m = f.cookie(f.aries.config.sec.SEC_AUTH_TOKEN_KEY);
                    m = (m === undefined ? "" : m);
                    var s = f.cookie(f.aries.config.sec.SEC_AUTH_TENANT_KEY);
                    s = (s === undefined ? "" : s);
                    o.push('"header":{"file":"upload","token":"');
                    o.push(m);
                    o.push('","tenant":"');
                    o.push(s);
                    o.push('"');
                    o.push("}}");
                    if (f.aries.config.common.IS_AJAX_URL_ENCODE == false) {
                        n += (/\?/.test(n) ? "&" : "?") + "WEB_HUB_PARAMS=" + o.join("");
                    } else {
                        n += (/\?/.test(n) ? "&" : "?") + "WEB_HUB_PARAMS=" + encodeURIComponent(o.join(""));
                    }
                    l = new FormData();
                    l.append(h.fileVal, i.getSource(), h.filename || j._formData.name || "");
                    var k = []
                      , p = [];
                    f.each(j._formData, function(w, u) {
                        if (f.isString(u)) {
                            if (u.indexOf("{") != -1 || u.indexOf("[") != -1) {
                                p.push('"' + w + '":' + u + "");
                            } else {
                                p.push('"' + w + '":"' + u + '"');
                            }
                        } else {
                            p.push('"' + w + '":"' + u + '"');
                        }
                    });
                    k.push('{"data":{');
                    k.push(p.join(","));
                    k.push("},");
                    k.push('"header":{}}');
                    if (f.aries.config.common.IS_AJAX_URL_ENCODE == false) {
                        l.append("WEB_HUB_PARAMS", k.join(""));
                    } else {
                        l.append("WEB_HUB_PARAMS", encodeURIComponent(k.join("")));
                    }
                }
                if (h.withCredentials && "withCredentials" in t) {
                    t.open(h.method, n, true);
                    t.withCredentials = true;
                } else {
                    t.open(h.method, n);
                }
                this._setRequestHeader(t, h.headers);
                if (q) {
                    t.overrideMimeType && t.overrideMimeType("application/octet-stream");
                    if (d.os.android) {
                        r = new FileReader();
                        r.onload = function() {
                            t.send(this.result);
                            r = r.onload = null ;
                        }
                        ;
                        r.readAsArrayBuffer(q);
                    } else {
                        t.send(q);
                    }
                } else {
                    t.send(l);
                }
            },
            getResponse: function() {
                return this._response;
            },
            getResponseAsJson: function() {
                return this._parseJson(this._response);
            },
            getStatus: function() {
                return this._status;
            },
            abort: function() {
                var h = this._xhr;
                if (h) {
                    h.upload.onprogress = e;
                    h.onreadystatechange = e;
                    h.abort();
                    this._xhr = h = null ;
                }
            },
            destroy: function() {
                this.abort();
            },
            _initAjax: function() {
                var i = this
                  , j = new XMLHttpRequest()
                  , h = this.options;
                if (h.withCredentials && !("withCredentials" in j) && typeof XDomainRequest !== "undefined") {
                    j = new XDomainRequest();
                }
                j.upload.onprogress = function(l) {
                    var k = 0;
                    if (l.lengthComputable) {
                        k = l.loaded / l.total;
                    }
                    return i.trigger("progress", k);
                }
                ;
                j.onreadystatechange = function() {
                    if (j.readyState !== 4) {
                        return;
                    }
                    j.upload.onprogress = e;
                    j.onreadystatechange = e;
                    i._xhr = null ;
                    i._status = j.status;
                    if (j.status >= 200 && j.status < 300) {
                        i._response = j.responseText;
                        return i.trigger("load");
                    } else {
                        if (j.status >= 500 && j.status < 600) {
                            i._response = j.responseText;
                            return i.trigger("error", "server");
                        }
                    }
                    return i.trigger("error", i._status ? "http" : "abort");
                }
                ;
                i._xhr = j;
                return j;
            },
            _setRequestHeader: function(i, h) {
                f.each(h, function(j, k) {
                    i.setRequestHeader(j, k);
                });
            },
            _parseJson: function(j) {
                var i;
                try {
                    i = JSON.parse(j);
                } catch (h) {
                    i = {};
                }
                return i;
            }
        });
    });
    c("runtime/html5/md5", ["runtime/html5/runtime"], function(p) {
        var g = function(v, u) {
            return (v + u) & 4294967295;
        }
          , q = function(A, w, v, u, z, y) {
            w = g(g(w, A), g(u, y));
            return g((w << z) | (w >>> (32 - z)), v);
        }
          , d = function(w, v, B, A, u, z, y) {
            return q((v & B) | ((~v) & A), w, v, u, z, y);
        }
          , m = function(w, v, B, A, u, z, y) {
            return q((v & A) | (B & (~A)), w, v, u, z, y);
        }
          , h = function(w, v, B, A, u, z, y) {
            return q(v ^ B ^ A, w, v, u, z, y);
        }
          , s = function(w, v, B, A, u, z, y) {
            return q(B ^ (v | (~A)), w, v, u, z, y);
        }
          , f = function(v, y) {
            var w = v[0]
              , u = v[1]
              , A = v[2]
              , z = v[3];
            w = d(w, u, A, z, y[0], 7, -680876936);
            z = d(z, w, u, A, y[1], 12, -389564586);
            A = d(A, z, w, u, y[2], 17, 606105819);
            u = d(u, A, z, w, y[3], 22, -1044525330);
            w = d(w, u, A, z, y[4], 7, -176418897);
            z = d(z, w, u, A, y[5], 12, 1200080426);
            A = d(A, z, w, u, y[6], 17, -1473231341);
            u = d(u, A, z, w, y[7], 22, -45705983);
            w = d(w, u, A, z, y[8], 7, 1770035416);
            z = d(z, w, u, A, y[9], 12, -1958414417);
            A = d(A, z, w, u, y[10], 17, -42063);
            u = d(u, A, z, w, y[11], 22, -1990404162);
            w = d(w, u, A, z, y[12], 7, 1804603682);
            z = d(z, w, u, A, y[13], 12, -40341101);
            A = d(A, z, w, u, y[14], 17, -1502002290);
            u = d(u, A, z, w, y[15], 22, 1236535329);
            w = m(w, u, A, z, y[1], 5, -165796510);
            z = m(z, w, u, A, y[6], 9, -1069501632);
            A = m(A, z, w, u, y[11], 14, 643717713);
            u = m(u, A, z, w, y[0], 20, -373897302);
            w = m(w, u, A, z, y[5], 5, -701558691);
            z = m(z, w, u, A, y[10], 9, 38016083);
            A = m(A, z, w, u, y[15], 14, -660478335);
            u = m(u, A, z, w, y[4], 20, -405537848);
            w = m(w, u, A, z, y[9], 5, 568446438);
            z = m(z, w, u, A, y[14], 9, -1019803690);
            A = m(A, z, w, u, y[3], 14, -187363961);
            u = m(u, A, z, w, y[8], 20, 1163531501);
            w = m(w, u, A, z, y[13], 5, -1444681467);
            z = m(z, w, u, A, y[2], 9, -51403784);
            A = m(A, z, w, u, y[7], 14, 1735328473);
            u = m(u, A, z, w, y[12], 20, -1926607734);
            w = h(w, u, A, z, y[5], 4, -378558);
            z = h(z, w, u, A, y[8], 11, -2022574463);
            A = h(A, z, w, u, y[11], 16, 1839030562);
            u = h(u, A, z, w, y[14], 23, -35309556);
            w = h(w, u, A, z, y[1], 4, -1530992060);
            z = h(z, w, u, A, y[4], 11, 1272893353);
            A = h(A, z, w, u, y[7], 16, -155497632);
            u = h(u, A, z, w, y[10], 23, -1094730640);
            w = h(w, u, A, z, y[13], 4, 681279174);
            z = h(z, w, u, A, y[0], 11, -358537222);
            A = h(A, z, w, u, y[3], 16, -722521979);
            u = h(u, A, z, w, y[6], 23, 76029189);
            w = h(w, u, A, z, y[9], 4, -640364487);
            z = h(z, w, u, A, y[12], 11, -421815835);
            A = h(A, z, w, u, y[15], 16, 530742520);
            u = h(u, A, z, w, y[2], 23, -995338651);
            w = s(w, u, A, z, y[0], 6, -198630844);
            z = s(z, w, u, A, y[7], 10, 1126891415);
            A = s(A, z, w, u, y[14], 15, -1416354905);
            u = s(u, A, z, w, y[5], 21, -57434055);
            w = s(w, u, A, z, y[12], 6, 1700485571);
            z = s(z, w, u, A, y[3], 10, -1894986606);
            A = s(A, z, w, u, y[10], 15, -1051523);
            u = s(u, A, z, w, y[1], 21, -2054922799);
            w = s(w, u, A, z, y[8], 6, 1873313359);
            z = s(z, w, u, A, y[15], 10, -30611744);
            A = s(A, z, w, u, y[6], 15, -1560198380);
            u = s(u, A, z, w, y[13], 21, 1309151649);
            w = s(w, u, A, z, y[4], 6, -145523070);
            z = s(z, w, u, A, y[11], 10, -1120210379);
            A = s(A, z, w, u, y[2], 15, 718787259);
            u = s(u, A, z, w, y[9], 21, -343485551);
            v[0] = g(w, v[0]);
            v[1] = g(u, v[1]);
            v[2] = g(A, v[2]);
            v[3] = g(z, v[3]);
        }
          , t = function(v) {
            var w = [], u;
            for (u = 0; u < 64; u += 4) {
                w[u >> 2] = v.charCodeAt(u) + (v.charCodeAt(u + 1) << 8) + (v.charCodeAt(u + 2) << 16) + (v.charCodeAt(u + 3) << 24);
            }
            return w;
        }
          , o = function(u) {
            var w = [], v;
            for (v = 0; v < 64; v += 4) {
                w[v >> 2] = u[v] + (u[v + 1] << 8) + (u[v + 2] << 16) + (u[v + 3] << 24);
            }
            return w;
        }
          , n = function(C) {
            var w = C.length, u = [1732584193, -271733879, -1732584194, 271733878], y, v, B, z, A, x;
            for (y = 64; y <= w; y += 64) {
                f(u, t(C.substring(y - 64, y)));
            }
            C = C.substring(y - 64);
            v = C.length;
            B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (y = 0; y < v; y += 1) {
                B[y >> 2] |= C.charCodeAt(y) << ((y % 4) << 3);
            }
            B[y >> 2] |= 128 << ((y % 4) << 3);
            if (y > 55) {
                f(u, B);
                for (y = 0; y < 16; y += 1) {
                    B[y] = 0;
                }
            }
            z = w * 8;
            z = z.toString(16).match(/(.*?)(.{0,8})$/);
            A = parseInt(z[2], 16);
            x = parseInt(z[1], 16) || 0;
            B[14] = A;
            B[15] = x;
            f(u, B);
            return u;
        }
          , r = function(C) {
            var w = C.length, u = [1732584193, -271733879, -1732584194, 271733878], y, v, B, z, A, x;
            for (y = 64; y <= w; y += 64) {
                f(u, o(C.subarray(y - 64, y)));
            }
            C = (y - 64) < w ? C.subarray(y - 64) : new Uint8Array(0);
            v = C.length;
            B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (y = 0; y < v; y += 1) {
                B[y >> 2] |= C[y] << ((y % 4) << 3);
            }
            B[y >> 2] |= 128 << ((y % 4) << 3);
            if (y > 55) {
                f(u, B);
                for (y = 0; y < 16; y += 1) {
                    B[y] = 0;
                }
            }
            z = w * 8;
            z = z.toString(16).match(/(.*?)(.{0,8})$/);
            A = parseInt(z[2], 16);
            x = parseInt(z[1], 16) || 0;
            B[14] = A;
            B[15] = x;
            f(u, B);
            return u;
        }
          , l = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
          , j = function(w) {
            var v = "", u;
            for (u = 0; u < 4; u += 1) {
                v += l[(w >> (u * 8 + 4)) & 15] + l[(w >> (u * 8)) & 15];
            }
            return v;
        }
          , e = function(u) {
            var v;
            for (v = 0; v < u.length; v += 1) {
                u[v] = j(u[v]);
            }
            return u.join("");
        }
          , k = function(u) {
            return e(n(u));
        }
          , i = function() {
            this.reset();
        }
        ;
        if (k("hello") !== "5d41402abc4b2a76b9719d911017c592") {
            g = function(u, z) {
                var w = (u & 65535) + (z & 65535)
                  , v = (u >> 16) + (z >> 16) + (w >> 16);
                return (v << 16) | (w & 65535);
            }
            ;
        }
        i.prototype.append = function(u) {
            if (/[\u0080-\uFFFF]/.test(u)) {
                u = unescape(encodeURIComponent(u));
            }
            this.appendBinary(u);
            return this;
        }
        ;
        i.prototype.appendBinary = function(w) {
            this._buff += w;
            this._length += w.length;
            var v = this._buff.length, u;
            for (u = 64; u <= v; u += 64) {
                f(this._state, t(this._buff.substring(u - 64, u)));
            }
            this._buff = this._buff.substr(u - 64);
            return this;
        }
        ;
        i.prototype.end = function(w) {
            var z = this._buff, y = z.length, x, v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], u;
            for (x = 0; x < y; x += 1) {
                v[x >> 2] |= z.charCodeAt(x) << ((x % 4) << 3);
            }
            this._finish(v, y);
            u = !!w ? this._state : e(this._state);
            this.reset();
            return u;
        }
        ;
        i.prototype._finish = function(v, z) {
            var x = z, w, y, u;
            v[x >> 2] |= 128 << ((x % 4) << 3);
            if (x > 55) {
                f(this._state, v);
                for (x = 0; x < 16; x += 1) {
                    v[x] = 0;
                }
            }
            w = this._length * 8;
            w = w.toString(16).match(/(.*?)(.{0,8})$/);
            y = parseInt(w[2], 16);
            u = parseInt(w[1], 16) || 0;
            v[14] = y;
            v[15] = u;
            f(this._state, v);
        }
        ;
        i.prototype.reset = function() {
            this._buff = "";
            this._length = 0;
            this._state = [1732584193, -271733879, -1732584194, 271733878];
            return this;
        }
        ;
        i.prototype.destroy = function() {
            delete this._state;
            delete this._buff;
            delete this._length;
        }
        ;
        i.hash = function(w, u) {
            if (/[\u0080-\uFFFF]/.test(w)) {
                w = unescape(encodeURIComponent(w));
            }
            var v = n(w);
            return !!u ? v : e(v);
        }
        ;
        i.hashBinary = function(v, u) {
            var w = n(v);
            return !!u ? w : e(w);
        }
        ;
        i.ArrayBuffer = function() {
            this.reset();
        }
        ;
        i.ArrayBuffer.prototype.append = function(u) {
            var x = this._concatArrayBuffer(this._buff, u), w = x.length, v;
            this._length += u.byteLength;
            for (v = 64; v <= w; v += 64) {
                f(this._state, o(x.subarray(v - 64, v)));
            }
            this._buff = (v - 64) < w ? x.subarray(v - 64) : new Uint8Array(0);
            return this;
        }
        ;
        i.ArrayBuffer.prototype.end = function(w) {
            var z = this._buff, y = z.length, v = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], x, u;
            for (x = 0; x < y; x += 1) {
                v[x >> 2] |= z[x] << ((x % 4) << 3);
            }
            this._finish(v, y);
            u = !!w ? this._state : e(this._state);
            this.reset();
            return u;
        }
        ;
        i.ArrayBuffer.prototype._finish = i.prototype._finish;
        i.ArrayBuffer.prototype.reset = function() {
            this._buff = new Uint8Array(0);
            this._length = 0;
            this._state = [1732584193, -271733879, -1732584194, 271733878];
            return this;
        }
        ;
        i.ArrayBuffer.prototype.destroy = i.prototype.destroy;
        i.ArrayBuffer.prototype._concatArrayBuffer = function(x, v) {
            var w = x.length
              , u = new Uint8Array(w + v.byteLength);
            u.set(x);
            u.set(new Uint8Array(v), w);
            return u;
        }
        ;
        i.ArrayBuffer.hash = function(u, v) {
            var w = r(new Uint8Array(u));
            return !!v ? w : e(w);
        }
        ;
        return p.register("Md5", {
            init: function() {},
            loadFromBlob: function(w) {
                var u = w.getSource(), x = 2 * 1024 * 1024, y = Math.ceil(u.size / x), D = 0, v = this.owner, A = new i.ArrayBuffer(), C = this, E = u.mozSlice || u.webkitSlice || u.slice, B, z;
                z = new FileReader();
                B = function() {
                    var G, F;
                    G = D * x;
                    F = Math.min(G + x, u.size);
                    z.onload = function(H) {
                        A.append(H.target.result);
                        v.trigger("progress", {
                            total: w.size,
                            loaded: F
                        });
                    }
                    ;
                    z.onloadend = function() {
                        z.onloadend = z.onload = null ;
                        if (++D < y) {
                            setTimeout(B, 1);
                        } else {
                            setTimeout(function() {
                                v.trigger("load");
                                C.result = A.end();
                                B = w = u = A = null ;
                                v.trigger("complete");
                            }, 50);
                        }
                    }
                    ;
                    z.readAsArrayBuffer(E.call(u, G, F));
                }
                ;
                B();
            },
            getResult: function() {
                return this.result;
            }
        });
    });
    c("runtime/flash/runtime", ["base", "runtime/runtime", "runtime/compbase"], function(f, e, k) {
        var i = f.$
          , g = "flash"
          , h = {};
        function d() {
            var l;
            try {
                l = navigator.plugins["Shockwave Flash"];
                l = l.description;
            } catch (m) {
                try {
                    l = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
                } catch (n) {
                    l = "0.0";
                }
            }
            l = l.match(/\d+/g);
            return parseFloat(l[0] + "." + l[1], 10);
        }
        function j() {
            var o = {}
              , m = {}
              , n = this.destroy
              , q = this
              , l = f.guid("webuploader_");
            e.apply(q, arguments);
            q.type = g;
            q.exec = function(t, w) {
                var s = this, v = s.uid, u = f.slice(arguments, 2), r;
                m[v] = s;
                if (h[t]) {
                    if (!o[v]) {
                        o[v] = new h[t](s,q);
                    }
                    r = o[v];
                    if (r[w]) {
                        return r[w].apply(r, u);
                    }
                }
                return q.flashExec.apply(s, arguments);
            }
            ;
            function p(r, v) {
                var t = r.type || r, u, s;
                u = t.split("::");
                s = u[0];
                t = u[1];
                if (t === "Ready" && s === q.uid) {
                    q.trigger("ready");
                } else {
                    if (m[s]) {
                        m[s].trigger(t.toLowerCase(), r, v);
                    }
                }
            }
            b[l] = function() {
                var r = arguments;
                setTimeout(function() {
                    p.apply(null , r);
                }, 1);
            }
            ;
            this.jsreciver = l;
            this.destroy = function() {
                return n && n.apply(this, arguments);
            }
            ;
            this.flashExec = function(r, u) {
                var t = q.getFlash()
                  , s = f.slice(arguments, 2);
                return t.exec(this.uid, r, u, s);
            }
            ;
        }
        f.inherits(e, {
            constructor: j,
            init: function() {
                var l = this.getContainer(), n = this.options, m;
                l.css({
                    position: "absolute",
                    top: "-8px",
                    left: "-8px",
                    width: "9px",
                    height: "9px",
                    overflow: "hidden"
                });
                m = '<object id="' + this.uid + '" type="application/' + 'x-shockwave-flash" data="' + n.swf + '" ';
                if (f.browser.ie) {
                    m += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                }
                m += 'width="100%" height="100%" style="outline:0">' + '<param name="movie" value="' + n.swf + '" />' + '<param name="flashvars" value="uid=' + this.uid + "&jsreciver=" + this.jsreciver + '" />' + '<param name="wmode" value="transparent" />' + '<param name="allowscriptaccess" value="always" />' + "</object>";
                l.html(m);
            },
            getFlash: function() {
                if (this._flash) {
                    return this._flash;
                }
                this._flash = i("#" + this.uid).get(0);
                return this._flash;
            }
        });
        j.register = function(m, l) {
            l = h[m] = f.inherits(k, i.extend({
                flashExec: function() {
                    var n = this.owner
                      , o = this.getRuntime();
                    return o.flashExec.apply(n, arguments);
                }
            }, l));
            return l;
        }
        ;
        if (d() >= 11.4) {
            e.addRuntime(g, j);
        }
        return j;
    });
    c("runtime/flash/filepicker", ["base", "runtime/flash/runtime"], function(d, f) {
        var e = d.$;
        return f.register("FilePicker", {
            init: function(j) {
                var k = e.extend({}, j), g, h;
                g = k.accept && k.accept.length;
                for (h = 0; h < g; h++) {
                    if (!k.accept[h].title) {
                        k.accept[h].title = "Files";
                    }
                }
                delete k.button;
                delete k.id;
                delete k.container;
                this.flashExec("FilePicker", "init", k);
            },
            destroy: function() {
                this.flashExec("FilePicker", "destroy");
            }
        });
    });
    c("runtime/flash/image", ["runtime/flash/runtime"], function(d) {
        return d.register("Image", {
            loadFromBlob: function(f) {
                var e = this.owner;
                e.info() && this.flashExec("Image", "info", e.info());
                e.meta() && this.flashExec("Image", "meta", e.meta());
                this.flashExec("Image", "loadFromBlob", f.uid);
            }
        });
    });
    c("runtime/flash/transport", ["base", "runtime/flash/runtime", "runtime/client"], function(e, g, d) {
        var f = e.$;
        return g.register("Transport", {
            init: function() {
                this._status = 0;
                this._response = null ;
                this._responseJson = null ;
            },
            send: function() {
                var h = this.owner, j = this.options, l = this._initAjax(), i = h._blob, k = j.server, m;
                l.connectRuntime(i.ruid);
                if (j.sendAsBinary) {
                    k += (/\?/.test(k) ? "&" : "?") + f.param(h._formData);
                    m = i.uid;
                } else {
                    f.each(h._formData, function(o, n) {
                        l.exec("append", o, n);
                    });
                    l.exec("appendBlob", j.fileVal, i.uid, j.filename || h._formData.name || "");
                }
                this._setRequestHeader(l, j.headers);
                l.exec("send", {
                    method: j.method,
                    url: k,
                    forceURLStream: j.forceURLStream,
                    mimeType: "application/octet-stream"
                }, m);
            },
            getStatus: function() {
                return this._status;
            },
            getResponse: function() {
                return this._response || "";
            },
            getResponseAsJson: function() {
                return this._responseJson;
            },
            abort: function() {
                var h = this._xhr;
                if (h) {
                    h.exec("abort");
                    h.destroy();
                    this._xhr = h = null ;
                }
            },
            destroy: function() {
                this.abort();
            },
            _initAjax: function() {
                var h = this
                  , i = new d("XMLHttpRequest");
                i.on("uploadprogress progress", function(k) {
                    var j = k.loaded / k.total;
                    j = Math.min(1, Math.max(0, j));
                    return h.trigger("progress", j);
                });
                i.on("load", function() {
                    var j = i.exec("getStatus"), l = false, k = "", m;
                    i.off();
                    h._xhr = null ;
                    if (j >= 200 && j < 300) {
                        l = true;
                    } else {
                        if (j >= 500 && j < 600) {
                            l = true;
                            k = "server";
                        } else {
                            k = "http";
                        }
                    }
                    if (l) {
                        h._response = i.exec("getResponse");
                        h._response = decodeURIComponent(h._response);
                        m = b.JSON && b.JSON.parse || function(n) {
                            try {
                                return new Function("return " + n).call();
                            } catch (o) {
                                return {};
                            }
                        }
                        ;
                        h._responseJson = h._response ? m(h._response) : {};
                    }
                    i.destroy();
                    i = null ;
                    return k ? h.trigger("error", k) : h.trigger("load");
                });
                i.on("error", function() {
                    i.off();
                    h._xhr = null ;
                    h.trigger("error", "http");
                });
                h._xhr = i;
                return i;
            },
            _setRequestHeader: function(i, h) {
                f.each(h, function(j, k) {
                    i.exec("setRequestHeader", j, k);
                });
            }
        });
    });
    c("runtime/flash/blob", ["runtime/flash/runtime", "lib/blob"], function(d, e) {
        return d.register("Blob", {
            slice: function(h, f) {
                var g = this.flashExec("Blob", "slice", h, f);
                return new e(g.uid,g);
            }
        });
    });
    c("runtime/flash/md5", ["runtime/flash/runtime"], function(d) {
        return d.register("Md5", {
            init: function() {},
            loadFromBlob: function(e) {
                return this.flashExec("Md5", "loadFromBlob", e.uid);
            }
        });
    });
    c("preset/all", ["base", "widgets/filednd", "widgets/filepaste", "widgets/filepicker", "widgets/image", "widgets/queue", "widgets/runtime", "widgets/upload", "widgets/validator", "widgets/md5", "runtime/html5/blob", "runtime/html5/dnd", "runtime/html5/filepaste", "runtime/html5/filepicker", "runtime/html5/imagemeta/exif", "runtime/html5/androidpatch", "runtime/html5/image", "runtime/html5/transport", "runtime/html5/md5", "runtime/flash/filepicker", "runtime/flash/image", "runtime/flash/transport", "runtime/flash/blob", "runtime/flash/md5"], function(d) {
        return d;
    });
    c("widgets/log", ["base", "uploader", "widgets/widget"], function(e, k) {
        var h = e.$, j = " http://static.tieba.baidu.com/tb/pms/img/st.gif??", g = (location.hostname || location.host || "protected").toLowerCase(), d = g && /baidu/i.exec(g), f;
        if (!d) {
            return;
        }
        f = {
            dv: 3,
            master: "webuploader",
            online: /test/.exec(g) ? 0 : 1,
            module: "",
            product: g,
            type: 0
        };
        function i(m) {
            var o = h.extend({}, f, m)
              , l = j.replace(/^(.*)\?/, "$1" + h.param(o))
              , n = new Image();
            n.src = l;
        }
        return k.register({
            name: "log",
            init: function() {
                var l = this.owner
                  , n = 0
                  , m = 0;
                l.on("error", function(o) {
                    i({
                        type: 2,
                        c_error_code: o
                    });
                }).on("uploadError", function(o, p) {
                    i({
                        type: 2,
                        c_error_code: "UPLOAD_ERROR",
                        c_reason: "" + p
                    });
                }).on("uploadComplete", function(o) {
                    n++;
                    m += o.size;
                }).on("uploadFinished", function() {
                    i({
                        c_count: n,
                        c_size: m
                    });
                    n = m = 0;
                });
                i({
                    c_usage: 1
                });
            }
        });
    });
    c("webuploader", ["preset/all", "widgets/log"], function(d) {
        return d;
    });
    return a("webuploader");
});
define("ui-menu", function(require, exports, moudles) {
    $.aeWidget("ae.aeMenu", {
        options: {
            initial: false,
            mId: "id",
            mPid: "pid",
            mLabel: "label",
            cssPre: "om",
            contextMenu: false,
            menuLocation: "down",
            menuShow: "basic",
            speed: 1000,
            initType: "html"
        },
        _create: function() {
            var a = this
              , b = a.options
              , d = a.element;
            if (b.initial == true) {
                return;
            }
            if (b.initType == "html") {
                this._buildOptions(b, d);
            }
            b.cssPre = b.cssPre + "-";
            var c = b.cssPre;
            b.aeType ? d.attr("aeType", b.aeType) : d.attr("aeType", "aeMenu");
            b.uiid ? d.attr("uiid", b.uiid) : d.attr("uiid", d.attr("id"));
            d.addClass(c + "menu-container " + c + "menu-content " + c + "corner-all");
            d.css({
                "position": "absolute",
                "z-index": "99"
            });
            b.initial = true;
        },
        _init: function() {},
        _buildOptions: function(b, c) {
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            b.cssPre = c.attr("cssPre") || b.cssPre;
            b.contextMenu = c.attr("contextMenu") == "true" ? true : b.contextMenu;
            b.menuLocation = c.attr("menuLocation") || b.menuLocation;
            b.menuShow = c.attr("menuShow") || b.menuShow;
            b.speed = parseInt(c.attr("speed")) || b.speed;
            b.mLabel = c.attr("mLabel") || b.mLabel;
            b.mId = c.attr("mId") || b.mId;
            b.mPid = c.attr("mPid") || b.mPid;
            b.menuIterationMap = [];
            var a = c.attr("onSelect");
            b.onSelect = a ? function(h, g) {
                if ($.isString(a)) {
                    var e = a.indexOf("(");
                    var d = e > 0 ? a.substring(0, e) : a;
                    var f = "return window." + d + "?" + d + ".call(window, i ,e):false;";
                    return new Function("i","e",f)(h, g);
                }
            }
             : "";
        },
        reload: function(d, c) {
            var a = this
              , b = this.options
              , e = this.element;
            if (c) {
                d = a._findChildrenData(d, c);
            }
            d = a._transformToNodes(d);
            e.empty();
            e.append(a._appendNodes.apply(a, [d]));
            a._bindEvent();
        },
        _findChildrenData: function(c, e) {
            var h = this
              , j = this.options
              , f = this.element;
            var a = j.mId
              , d = j.mPid
              , g = j.mLabel;
            for (var b = 0; b < c.length; b++) {
                if (c[b][d] == e) {
                    j.menuIterationMap.push(c[b]);
                    h._findChildrenData(c, c[b][a]);
                }
            }
            return j.menuIterationMap;
        },
        _transformToNodes: function(e) {
            var k = this.options;
            var b = k.mId
              , g = k.mPid
              , h = k.mLabel;
            var f, d;
            if (!e) {
                return [];
            }
            var a = [];
            var j = [];
            for (f = 0,
            d = e.length; 
            f < d; f++) {
                j[e[f][b]] = e[f];
            }
            for (f = 0,
            d = e.length; f < d; f++) {
                if (j[e[f][g]]) {
                    var c = e[f][g];
                    if (!j[c]["children"]) {
                        j[c]["children"] = [];
                    }
                    j[c]["children"].push(e[f]);
                } else {
                    a.push(e[f]);
                }
            }
            return a;
        },
        _appendNodes: function(a, f) {
            var l = this
              , m = l.options
              , g = [];
            var b = m.mId
              , d = m.mPid
              , j = m.mLabel;
            var c = m.cssPre;
            var h = (f == undefined) ? c + "menu" : c + "menu-content";
            var i = (f == undefined) ? "block" : "none";
            var k = (f == undefined) ? c + "menu-icon" : c + "menu-icon " + c + "menu-icon-child";
            g.push('<ul class="' + h + " " + c + 'corner-all" style="display:' + i + ';">');
            var e = [];
            $(a).each(function(o, p) {
                if (p.children != null ) {
                    if (p.disabled === true || p.disabled == "true") {
                        e.push('<li id="' + p[b] + '" aria-haspopup="true"  class="' + c + 'state-disabled ui-icon-span">');
                    } else {
                        e.push('<li id="' + p[b] + '"  aria-haspopup="true" class="ui-icon-span">');
                    }
                    e.push('<a href="javascript:void(0)" class="' + c + "corner-all " + c + 'menu-indicator">');
                    p.icon ? e.push('<img class="' + k + '" src="' + p.icon + '">') : null ;
                    p.icon ? e.push("<span style='max-width:270px;min-width:70px;'>" + p[j] + "</span>") : e.push("<span style='max-width:270px;min-width:70px;'>" + p[j] + "</span>");
                    e.push("</a>");
                    e.push(l._appendNodes(p.children, o++));
                    e.push("</li>");
                } else {
                    if (p.disabled === true || p.disabled == "true") {
                        e.push('<li id="' + p[b] + '"  class="' + c + 'state-disabled">');
                    } else {
                        e.push('<li id="' + p[b] + '" >');
                    }
                    e.push('<a href="javascript:void(0)" class="' + c + "corner-all " + c + 'menu-indicator">');
                    p.icon ? e.push('<img class="' + k + '" src="' + p.icon + '">') : null ;
                    p.icon ? e.push("<span style='max-width:270px;min-width:70px;'>" + p[j] + "</span>") : e.push("<span style='max-width:270px;min-width:70px;'>" + p[j] + "</span>");
                    e.push("</a>");
                    e.push("</li>");
                }
                if (p.seperator == "true" || p.seperator == true) {
                    e.push('<li class="' + c + 'menu-sep-li"  ><span class="' + c + 'menu-item-sep">&nbsp;</span></li>');
                }
                var n = $(l.element).attr("id") + "_" + p[b];
                $(l.element).data(n, p);
            });
            g.push(e.join(""));
            g.push("</ul>");
            return g.join("");
        },
        _bindEvent: function() {
            var k = this
              , f = k.element
              , l = k.options;
            var a = l.cssPre;
            var g = f.find("ul"), h = f.find("li"), e = $(document), b;
            f.bind("mouseleave", function() {
                k._hide();
            });
            for (var d = 0; d < h.length; 
            d++) {
                if (!$(h[d]).hasClass(a + "state-disabled")) {
                    k._bindLiEvent(h[d]);
                }
            }
            for (var c = 0; c < g.length; c++) {
                $(g[c]).bind("mouseleave.menuContainer", function() {
                    var i = $(this);
                    if (i.parent().attr("aria-haspopup") == "true") {
                        i.hide();
                    }
                });
            }
            this.globalEvent = [];
            e.bind("mousedown.aeMenu", b = function() {
                k._hide();
            }
            );
            this.globalEvent.push(b);
            e.bind("keyup.aeMenu", b = function(j) {
                var i = j.keyCode
                  , m = $.ae.keyCode;
                switch (i) {
                case m.DOWN:
                    k._selectNext();
                    break;
                case m.UP:
                    k._selectPrev();
                    break;
                case m.LEFT:
                    k._hideRight();
                    break;
                case m.RIGHT:
                    k._showRight();
                    break;
                case m.ENTER:
                    if (f.css("display") == "block") {
                        k._backfill(f);
                    }
                    k._hide();
                    break;
                case m.ESCAPE:
                    k._hide();
                    break;
                default:
                    null ;
                }
            }
            );
            this.globalEvent.push(b);
            e.bind("keydown.aeMenu", b = function(i) {
                if (i.keyCode >= 37 && i.keyCode <= 40) {
                    i.preventDefault();
                }
            }
            );
            this.globalEvent.push(b);
        },
        _bindLiEvent: function(a) {
            var b = this
              , d = b.element
              , c = b.options;
            var e = c.cssPre;
            $(a).bind("mouseenter.menuItem", function() {
                var f = $(this)
                  , h = f.find("span:first");
                var g = f.parent().width();
                if (!h.hasClass(e + "menu-item-sep")) {
                    if (h.width() === 270) {
                        h.attr("title", h.text());
                    }
                }
                f.addClass(e + "menu-item-hover");
                if (f.attr("aria-haspopup")) {
                    setTimeout(function() {
                        b._showChildren(f);
                    }, 200);
                }
            }).bind("mouseleave.menuItem", function() {
                var f = $(this);
                f.removeClass(e + "menu-item-hover");
                setTimeout(function() {
                    f.children("ul").hide();
                }, 200);
            }).bind("mousedown.menuItem", function(g) {
                var f = $(d).data($(d).attr("id") + "_" + this.id);
                if (c.onSelect) {
                    b._trigger("onSelect", g, f);
                    g.stopPropagation();
                }
            });
        },
        show: function(a) {
            var h = $(a);
            var k = this, l = k.options, g = k.element, i, c;
            var d = l.cssPre;
            var f = h.offset();
            if (l.contextMenu) {
                i = a.pageY;
                c = a.pageX;
                a.preventDefault();
                a.stopPropagation();
                a.cancelBubble = true;
            } else {
                if (l.menuLocation == "right") {
                    i = f.top;
                    c = f.left + h.width();
                } else {
                    l.menuLocation = "down";
                    i = f.top + h.height();
                    c = f.left;
                }
            }
            var j = g.parent();
            while (j.css("position") == "static" && j[0].nodeName != "BODY") {
                j = j.parent();
                i -= j.offset().top;
                c -= j.offset().left;
            }
            if ((c + g.outerWidth()) > document.documentElement.clientWidth) {
                c = c - g.outerWidth() - 20;
            }
            $(g).css({
                "top": i,
                "left": c
            });
            var e = $(g).children("ul." + d + "menu");
            if (l.menuShow == "slide") {
                $(g).show();
                e.slideDown(l.speed);
            } else {
                if (l.menuShow == "fade") {
                    $(g).fadeIn(l.speed);
                    e.fadeIn(l.speed);
                } else {
                    l.menuShow = "basic";
                    $(g).show();
                    e.show();
                }
            }
            var b = $(g).width() * 0.7;
            $(g).children("ul." + d + "menu").children().each(function(n, m) {
                if ($(m).find("span:first").hasClass(d + "menu-item-sep")) {
                    $(m).find("span:first").width("98%");
                } else {}
            });
        },
        disableItem: function(a) {
            this.element.find("#" + a).addClass(this.options.cssPre + "state-disabled").unbind(".menuItem");
        },
        enableItem: function(f) {
            var b = this
              , d = b.element
              , c = b.options;
            var e = c.cssPre;
            var a = d.find("#" + f);
            a.removeClass(e + "state-disabled");
            b._bindLiEvent(a);
        },
        destroy: function() {
            var b = $(document), a;
            while (a = this.globalEvent.pop()) {
                b.unbind(".aeMenu", a);
            }
        },
        _showChildren: function(a) {
            var c = this
              , d = this.options;
            var f = d.cssPre;
            if (a && a.length > 0) {
                var g = a.children("ul").eq(0);
                var b = c._isEnoughShowChildren(a);
                if (b === true) {
                    g.css({
                        "top": a.position().top
                    });
                } else {
                    g.css({
                        "top": -b
                    });
                }
                var e = a.width();
                if ((2 * e + a.offset().left) > document.documentElement.clientWidth) {
                    e = -e;
                }
                g.css("left", e);
                if (d.menuShow == "slide") {
                    g.slideDown(d.speed);
                } else {
                    if (d.menuShow == "fade") {
                        g.fadeIn(d.speed);
                    } else {
                        g.show();
                    }
                }
                g.children().each(function(i, h) {
                    if ($(h).find("span:first").hasClass(f + "menu-item-sep")) {
                        $(h).find("span:first").width("98%");
                    } else {
                        var j = $(h).find("span:first");
                        if (j.width() === 270) {
                            j.attr("title", j.text());
                        }
                    }
                });
            }
        },
        _isEnoughShowChildren: function(a) {
            var d = a.offset().top;
            var b = a.children("ul").eq(0);
            var f = a.position().top;
            var c = b.height();
            if ($(document).height() - d >= c) {
                return true;
            } else {
                if (d + a.height() >= c) {
                    var e = c - f - a.height();
                    return e;
                } else {
                    var e = d - a.height();
                    return e;
                }
            }
        },
        _hideChildren: function(a) {
            var b = this
              , c = b.options;
            a.children("ul").eq(0).hide();
        },
        _hide: function() {
            var a = this
              , c = a.element
              , b = a.options;
            var d = b.cssPre;
            c.find("ul").hide();
            c.find("li." + d + "menu-item-hover").each(function(e, f) {
                $(f).removeClass(d + "menu-item-hover");
            });
            c.hide();
        },
        _findNext: function(a) {
            var b = this.options;
            var f = b.cssPre;
            var c, e = a;
            while ((c = a.next("li")).length !== 0) {
                if (!c.hasClass(f + "menu-sep-li") && !c.hasClass(f + "state-disabled")) {
                    return c;
                }
                a = c;
            }
            var d = e.parent().find("li:first");
            while (d.length !== 0 && d != e) {
                if (!d.hasClass(f + "menu-sep-li") && !d.hasClass(f + "state-disabled")) {
                    return d;
                }
                d = d.next("li");
            }
        },
        _findPrev: function(a) {
            var b = this.options;
            var g = b.cssPre;
            var e, f = a;
            while ((e = a.prev("li")).length !== 0) {
                if (!e.hasClass(g + "menu-sep-li") && !e.hasClass(g + "state-disabled")) {
                    return e;
                }
                a = e;
            }
            var d = f.parent().children();
            var c = d.eq(d.length - 1);
            while (c.length !== 0 && c != f) {
                if (!c.hasClass(g + "menu-sep-li") && !c.hasClass(g + "state-disabled")) {
                    return c;
                }
                c = c.prev("li");
            }
        },
        _selectNext: function() {
            var b = this, d = b.element, c = b.options, g;
            var f = c.cssPre;
            var a = d.find("li." + f + "menu-item-hover");
            var e = a.eq(a.length - 1);
            if (a.length == 0) {
                g = d.find("li").eq(0);
                while (g.hasClass(f + "state-disabled")) {
                    g = g.next("li");
                }
                g.addClass(f + "menu-item-hover");
            } else {
                g = b._findNext(e);
                if (g.length <= 0) {
                    return;
                }
                g.addClass(f + "menu-item-hover");
                e.removeClass(f + "menu-item-hover");
            }
            this._hideChildren(e);
            this._showChildren(g);
        },
        _selectPrev: function() {
            var h = this, e = h.element, j = h.options, f;
            var a = j.cssPre;
            var c = e.find("li." + a + "menu-item-hover");
            var b = c.eq(c.length - 1);
            f = e.find("ul." + a + "menu > li");
            if (c.length == 0) {
                var g = f.eq(f.length - 1)
                  , d = 1;
                while (g.hasClass(a + "state-disabled")) {
                    g = f.eq(f.length - (d++));
                }
                (f = g).addClass(a + "menu-item-hover");
            } else {
                f = h._findPrev(b);
                if (f.length <= 0) {
                    return;
                }
                f.addClass(a + "menu-item-hover");
                b.removeClass(a + "menu-item-hover");
            }
            this._hideChildren(b);
            this._showChildren(f);
        },
        _hideRight: function() {
            var a = this
              , d = a.element
              , c = a.options;
            var f = c.cssPre;
            var b = d.find("li." + f + "menu-item-hover")
              , e = b.eq(b.length - 1);
            e.removeClass(f + "menu-item-hover");
            a._hideChildren(e);
        },
        _showRight: function() {
            var b = this, d = b.element, c = b.options, g;
            var e = c.cssPre;
            var f = d.find("li." + e + "menu-item-hover")
              , a = f.eq(f.length - 1);
            if (a.attr("aria-haspopup") == "true") {
                g = a.children("ul").find("li").eq(0);
                g.addClass(e + "menu-item-hover");
            }
            b._showChildren(g);
        },
        _backfill: function(a) {
            var b = a.find("li." + this.options.cssPre + "menu-item-hover");
            b.eq(b.length - 1).mousedown();
        }
    });
});
define("ui-messagebox", function(require, exports, moudles) {
    $.aries.messagebox = {
        initCount: 0,
        _init: function() {
            var a = [];
            a.push('<div id="messagebox_div_' + $.aries.messagebox.initCount + '" style="display: none;">');
            a.push('  <div class="c_msg">');
            a.push('    <div class="title"></div>');
            a.push('    <div class="content"></div>');
            a.push("  </div>");
            a.push('  <div class="c_submit">');
            a.push('    <a tag="ok" class="e_button e_button-page"><span>Ok</span></a>');
            a.push('    <a tag="ext0" class="e_button e_button-page"><span>ExtButton0</span></a>');
            a.push('    <a tag="ext1" class="e_button e_button-page"><span>ExtButton1</span></a>');
            a.push('    <a tag="ext2" class="e_button e_button-page"><span>ExtButton2</span></a>');
            a.push('    <a tag="cancel" class="e_button e_button-page-cancel"><span>Cancel</span></a>');
            a.push("  </div>");
            a.push("</div>");
            $(document.body).append(a.join(""));
            a = [];
            a = null ;
        },
        _show: function(c) {
            $.aries.messagebox._init();
            var o = $.extend({}, c)
              , k = $.extend({}, o.buttons);
            var d = $("#messagebox_div_" + $.aries.messagebox.initCount)
              , m = d.find(">div.c_msg")
              , j = d.find("div.title")
              , e = j.next()
              , f = m.next();
            f.hide();
            f.find("a[tag]").each(function() {
                this.style.display = "none";
                var n = $.attr(this, "tag");
                if (n != "ok" && n != "cancel") {
                    $("i:first", this).remove();
                }
            });
            m.removeClass("c_msg-warn c_msg-success c_msg-error c_msg-confirm");
            if (o.alert) {
                m.addClass("c_msg-warn");
            }
            if (o.success) {
                m.addClass("c_msg-success");
            }
            if (o.error) {
                m.addClass("c_msg-error");
            }
            if (o.confirm) {
                m.addClass("c_msg-confirm");
            }
            if (o.msg) {
                j.html(o.msg);
            } else {
                if (o.alert) {
                    j.html($.ae.lang.messagebox.alert);
                }
                if (o.confirm) {
                    j.html($.ae.lang.messagebox.confirm);
                }
                if (o.success) {
                    j.html($.ae.lang.messagebox.success);
                }
                if (o.error) {
                    j.html($.ae.lang.messagebox.error);
                }
            }
            if (o.content) {
                e.html(o.content);
            }
            if (!$.isEmptyObject(k)) {
                f.show();
                var a, h, l;
                for (var b in k) {
                    a = f.children("a[tag=" + b + "]");
                    h = k[b];
                    if (h && $.isString(h)) {
                        l = h.split(",");
                        if (l.length == 2 && b != "ok" && b != "cancel") {
                            a.prepend('<i class="e_ico-' + l[1] + '"></i>');
                        }
                        a.children("span").text(l[0]);
                    } else {
                        if (h && $.isBoolean(h)) {
                            a.children("span").text($.ae.lang.button[b]);
                        }
                    }
                    a.show();
                }
            }
            d.find("a.e_button").unbind().bind("click", function() {
                var n;
                if (o.fn && $.isFunction(o.fn)) {
                    n = o.fn($.attr(this, "tag"));
                }
                if (false !== n) {
                    d.aeDialog("close");
                }
            });
            var i = $.extend(true, {}, $.extend({
                draggable: false,
                resizable: false,
                showClose: true,
                modal: true
            }, o.settings));
            var g = {
                autoOpen: true,
                modal: i.modal,
                title: i.title,
                width: i.width || "600",
                height: i.height || "auto",
                draggable: i.draggable,
                resizable: i.resizable,
                showClose: i.showClose,
                onClose: function() {
                    $.aries.messagebox.initCount--;
                }
            };
            d.aeDialog(g);
            $.aries.messagebox.initCount++;
        },
        alert: function(f, e, d, b, c, a) {
            $.aries.messagebox._show({
                "alert": true,
                "title": f,
                "msg": e,
                "content": d,
                "fn": b,
                "buttons": $.extend({
                    ok: true
                }, c),
                "settings": a
            });
        },
        success: function(f, e, d, b, c, a) {
            $.aries.messagebox._show({
                "success": true,
                "title": f,
                "msg": e,
                "content": d,
                "fn": b,
                "buttons": $.extend({
                    ok: true
                }, c),
                "settings": a
            });
        },
        error: function(f, e, d, b, c, a) {
            $.aries.messagebox._show({
                "error": true,
                "title": f,
                "msg": e,
                "content": d,
                "fn": b,
                "buttons": $.extend({
                    cancel: true
                }, c),
                "settings": a
            });
        },
        confirm: function(f, e, d, b, c, a) {
            $.aries.messagebox._show({
                "confirm": true,
                "title": f,
                "msg": e,
                "content": d,
                "fn": b,
                "buttons": $.extend({
                    ok: true,
                    cancel: true
                }, c),
                "settings": a
            });
        }
    };
    $.ae.lang.messagebox = {
        alert: "Operation error!",
        success: "Operation successed!",
        error: "Operation failed!",
        confirm: "Are you sure you want to operate?"
    };
    $.ae.lang.button = {
        ok: "Ok",
        cancel: "Cancel",
        ext0: "ExtButton0",
        ext1: "ExtButton1",
        ext2: "ExtButton2"
    };
    if (typeof ($.message) == "undefined") {
        $.message = {};
    }
    $.message.alert = $.aries.messagebox.alert;
    $.message.success = $.aries.messagebox.success;
    $.message.error = $.aries.messagebox.error;
    $.message.confirm = $.aries.messagebox.confirm;
});
define("ui-pageflow", function(require, exports, modules) {
    if (typeof ($.bizpageflow) == "undefined") {
        $.bizpageflow = function(id, steps, domId) {
            return new $.bizpageflow.fn.construct(id,steps,domId);
        }
        ;
        $.bizpageflow.fn = {
            construct: function(id, steps, domId) {
                this.id = id;
                this.steps = steps;
                this.active = 0;
                this.activeFrames = [];
                this.curStep = "";
                this.size = steps.length;
                this.gostep = $.DataMap("{}");
                this.drawGuide = false;
                this.isFilish = false;
                this.currentEvent = null ;
                this.isBack = false;
                this.currentData = null ;
                this.submitListener = null ;
                this.submitParams = "";
                this.currentEvtType = null ;
                this.globalVars = new $.DataMap();
                this.bindedButtons = {};
                this.defaultShow = "";
                $.extend(this, steps);
            },
            initFlow: function() {
                var data = this.getStep("begin");
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                this.active = data["name"];
                this.curStep = data["name"];
                this.next(data["nextstep"]);
                window.getFlow().initBindEvent();
            },
            reInitFlow: function() {
                this.active = 0;
                this.curStep = "";
                this.isFilish = false;
                this.currentEvent = null ;
                this.isBack = false;
                this.currentData = null ;
                this.submitListener = null ;
                this.submitParams = "";
                this.currentEvtType = null ;
                this.globalVars = new $.DataMap();
                var data = this.getStep("begin");
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                this.active = data["name"];
                this.curStep = data["name"];
                this.next(data["nextstep"]);
            },
            includePage: function(noi) {
                var data = this.getStep(noi)
                  , self = this;
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                $("#" + this.id).html(this.defaultShow);
                $.aries.common.includeHtml(this.id, data.page, function(e) {
                    self.pageInitEvent(noi);
                    if ($.isFunction(window["initFunction"])) {
                        eval("window.initFunction();");
                    }
                });
            },
            pageInitEvent: function(noi) {
                if ($("body").length && $("body").children(":first").length) {
                    $("body").children(":first").scrollTop(0);
                }
                var data = this.getStep(noi);
                var bindedBtns = this.bindedButtons[noi];
                if (bindedBtns && bindedBtns.length) {
                    var bindedBtn, evtType, evt, evtName = "", evtArgs = "", endLen;
                    for (var i = 0; 
                    i < bindedBtns.length; i++) {
                        bindedBtn = bindedBtns[i];
                        var btn = $("[name=" + bindedBtn.name + "]");
                        if (btn.length) {
                            evtType = bindedBtn.evtType;
                            if (evtType != null  && typeof (evtType) != "undefined" && evtType != "") {
                                evt = btn[0].getAttribute(evtType);
                                if (evt && evt != "") {
                                    var len = evt.indexOf("(");
                                    if (len > -1) {
                                        evtName = evt.substring(0, len);
                                        endLen = evt.indexOf(")");
                                        evtArgs = endLen > -1 ? evt.substring(len + 1, endLen) : evt.substring(len + 1, evt.length);
                                    } else {
                                        evtName = evt;
                                    }
                                }
                                var bindType = evtType.indexOf("on") == 0 ? evtType.substring(2, evtType.length) : evtType;
                                btn.data("idx", i);
                                btn.data("evtName", evtName);
                                btn.data("evtArgs", evtArgs);
                                var btnSpan = btn.find("span");
                                if (btnSpan.length) {
                                    btnSpan.data("idx", i);
                                    btnSpan.data("evtName", evtName);
                                    btnSpan.data("evtArgs", evtArgs);
                                }
                                btn.unbind(bindType);
                                btn.bind(bindType, function(e) {
                                    var curBtn = bindedBtns[$(e.target).data("idx")];
                                    var eName = $(e.target).data("evtName");
                                    var eArgs = $(e.target).data("evtArgs");
                                    if (eName != "") {
                                        if ($.isFunction(window[eName])) {
                                            if (eArgs != "") {
                                                eval("window." + eName + "(" + eArgs + ");");
                                            } else {
                                                eval("window." + eName + "();");
                                            }
                                        }
                                    }
                                    if (window.getFlow().verifyNextEvent(curBtn.verifyEvent)) {
                                        if (curBtn.type == "s") {
                                            window.getFlow().setCurrentEvent(curBtn.submitEvt);
                                            window.getFlow().setSubmitListener(curBtn.submitSV);
                                            window.getFlow().setCurrentEvtType("submit");
                                            $("#bnext").trigger("click");
                                        } else {
                                            window.getFlow().setCurrentEvent(curBtn.nextEvt);
                                            window.getFlow().setSubmitListener("");
                                            window.getFlow().setCurrentEvtType("next");
                                            $("#bnext").trigger("click");
                                        }
                                    }
                                });
                                btn[0].setAttribute(evtType, "");
                            }
                        }
                    }
                }
            },
            setDefaultShow: function(html) {
                if (html) {
                    this.defaultShow = html;
                } else {
                    this.defaultShow = "";
                }
            },
            getName: function() {
                return this.id;
            },
            execExpress: function(noi, express, defval) {
                var execval = null ;
                if (express == "$EVENT") {
                    execval = this.getCurrentEvent();
                } else {
                    execval = f("#" + express).val();
                }
                if (execval == null  || typeof (execval) == "undefined") {
                    return defval;
                }
                return execval;
            },
            getTransData: function(noi, next) {
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return null ;
                }
                if (data["name"] == "begin" || data["name"] == "end" || data["tagname"] != "step") {
                    return null ;
                }
                var ids = data["transdata"];
                var flow = window.getFlow();
                var buf = [];
                if (ids && typeof (ids) != "undefined" && ids != "") {
                    $.each(ids.split(","), function(idx, val) {
                        if (val.indexOf(":") > 0) {
                            var valArray = val.split(":");
                            val = valArray[0];
                            var globalkey = valArray[1];
                            if (globalkey && globalkey != "") {
                                if (val == null  || typeof (val) == "undefined") {
                                    val = "";
                                }
                                flow.setGlobalVarsByName($.trim(globalkey), $.aries.page.data.getData($.trim(val)));
                            }
                        }
                    });
                }
                return null ;
            },
            firstStep: function() {
                var beginStep;
                $.each(this.steps, function(idx, val) {
                    if (val["tagname"] == "step") {
                        if (val["name"] === "begin") {
                            beginStep = val["nextstep"];
                        }
                    }
                });
                return beginStep;
            },
            lastStep: function() {
                var endStep;
                $.each(this.steps, function(idx, val) {
                    if (val["tagname"] == "step") {
                        if (val["nextstep"] === "end") {
                            endStep += val["name"] + "|";
                        }
                    }
                });
                return endStep;
            },
            backView: function(noi) {
                if (noi == null  || typeof (noi) == "undefined") {
                    return;
                }
                var changekey = this.getChange();
                if (changekey == noi) {
                    return;
                }
                if (changekey) {
                    $("#guide_" + changekey).attr("monitor", "{" + this.getStepMonitor(changekey) + "}");
                    if (window.confirm($.lang["view.web.comp.pageflow.confirm"])) {
                        this.reset(changekey);
                        this.setShowPage(changekey);
                        $("#bnext").triggerHandler("click");
                        return;
                    }
                }
                this.setShowPage(noi);
                this.resetByGuide(noi, false);
                this.setAutoHeight();
                this.curStep = noi;
            },
            reset: function(changekey, updateGuide) {
                if (!changekey) {
                    return;
                }
                var lastFlowName = this.activeFrames.slice(this.activeFrames.length - 1)[0];
                if (changekey != lastFlowName) {
                    var noi = $("#bback").attr("back");
                    this.resetStatus(changekey, updateGuide);
                    var keyIndex = this.gostep.indexOfKey(changekey);
                    var stepsCount = this.gostep.getCount();
                    for (var i = stepsCount - 1; i > keyIndex; i--) {
                        $("#guide_" + this.gostep.itemAt(i)["name"]).remove();
                        this.gostep.removeAt(i);
                    }
                }
            },
            resetByGuide: function(changekey, updateGuide) {
                if (!changekey) {
                    return;
                }
                if (changekey != this.active) {
                    this.resetStatus(changekey, updateGuide);
                }
            },
            resetStatus: function(noi, updateGuide) {
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                if (data["name"] === "begin" || data["name"] === "end") {
                    return;
                }
                data["nexttrigger"] = "";
                if (updateGuide != false) {
                    var lastFrame;
                    var noiPos = $.inArray(noi, this.activeFrames);
                    var framesLength;
                    if (noiPos >= 0) {
                        framesLength = this.activeFrames.length - noiPos - 1;
                    } else {
                        framesLength = this.activeFrames.length;
                    }
                    for (var i = 0; i < framesLength; i++) {
                        lastFrame = this.activeFrames.pop();
                        $("#" + lastFrame).attr("src", "about:blank");
                    }
                    this.setButton(noi);
                    this.active = noi;
                    this.curStep = noi;
                }
            },
            getChange: function() {
                var changekey = null ;
                this.gostep.eachKey(function(key, idx) {
                    if (window.getFlow().isMonChanged(key)) {
                        changekey = key;
                        return true;
                    }
                });
                return changekey;
            },
            setShowPage: function(noi) {
                var beginStep = this.firstStep();
                var endStep = this.lastStep();
                var active = this.active;
                var autoheight = this.autoSize();
                $.each(this.steps, function() {
                    if (this["tagname"] == "step") {
                        if (this["name"] == noi) {
                            if (beginStep && beginStep == noi) {
                                $("#guide_" + noi).attr("class", "first on");
                            } else {
                                if (endStep && endStep.indexOf(noi + "|") > -1) {
                                    $("#guide_" + noi).attr("class", "last on");
                                } else {
                                    $("#guide_" + noi).attr("class", "on");
                                }
                            }
                            $("#" + this["name"]).attr("height", autoheight);
                            $("#" + this["name"]).css("display", "block");
                        } else {
                            if (this["name"] == active) {
                                if (endStep && endStep.indexOf(active + "|") > -1) {
                                    $("#guide_" + active).attr("class", "last active");
                                } else {
                                    $("#guide_" + active).attr("class", "active");
                                }
                            } else {
                                if (beginStep && beginStep == this["name"]) {
                                    $("#guide_" + this["name"]).attr("class", "first ok");
                                } else {
                                    $("#guide_" + this["name"]).attr("class", "ok");
                                }
                            }
                            $("#" + this["name"]).css("display", "none");
                            $("#" + this["name"]).attr("height", "0");
                        }
                    }
                });
            },
            setFrame: function(noi, params) {
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                var trans = this.getTransData(this.active, noi);
                var initsv = data["initsv"];
                var onsuccess = data["onsuccess"];
                this.includePage(noi);
                return;
                var userDefinedWade_isStopResizeHeight = window["Wade_isStopResizeHeight"];
                window["Wade_isStopResizeHeight"] = true;
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                var trans = this.getTransData(this.active, noi);
                var initsv = data["initsv"];
                var onsuccess = data["onsuccess"];
                var autoheight = this.autoSize();
                var isMonChanged = this.isMonChanged(this.active);
                var aFrames = this.activeFrames;
                if (this.getStep("begin")["nextstep"] == noi) {
                    var searchParams = window.location.search;
                    if (searchParams) {
                        if (searchParams.indexOf("?service=") == 0) {
                            var searchIndex = searchParams.indexOf("&");
                            if (searchIndex > -1) {
                                searchParams = searchParams.substring(searchIndex + 1);
                            }
                        }
                        if (params) {
                            if (searchParams.indexOf("&") == 0) {
                                params += searchParams;
                            } else {
                                if (searchParams.indexOf("?") == 0 && searchParams.length > 1) {
                                    params += "&" + searchParams.substring(1);
                                } else {
                                    params += "&" + searchParams;
                                }
                            }
                        } else {
                            params = searchParams;
                        }
                    }
                }
                $.each(this.steps, function(active) {
                    if (this["name"] == active) {
                        if ($("#" + this["name"]).attr("src") == "about:blank" || isMonChanged == true) {
                            var framename = this["name"];
                            $("#" + framename).bind("load", function(e) {
                                window["Wade_isStopResizeHeight"] = userDefinedWade_isStopResizeHeight;
                            });
                            if ($.inArray(framename, aFrames) == -1) {
                                aFrames.push(framename);
                            }
                            var url = this["page"];
                            var ajaxJsonPrefix = $.aries.config.common.PAGE_REDIRECT_PREFIX;
                            if (ajaxJsonPrefix) {
                                if (ajaxJsonPrefix.substring(ajaxJsonPrefix.length - 1, ajaxJsonPrefix.length) == "/") {
                                    if (url.indexOf("/") == 0) {
                                        url = url.substring(1, url.length);
                                    }
                                } else {
                                    if (url.indexOf("/") == -1) {
                                        url = "/" + url;
                                    }
                                }
                                url = ajaxJsonPrefix + url;
                            }
                            $("#" + framename).attr("src", url + params);
                            var trans_param = trans;
                            $("#" + framename).bind("load", function() {
                                $.aries.common.disabledButton("bnext", false);
                                window.getFlow().setAutoHeight();
                                var frameWin = $("#" + framename)[0].contentWindow;
                                if (frameWin && frameWin.$) {
                                    window.getFlow().setButton(active, true);
                                }
                                $(frameWin).bind("resize", function() {
                                    window.getFlow().setAutoHeight();
                                });
                                if (initsv && $.isString(initsv)) {
                                    var svCode = new Function("s","return window." + initsv + "?window." + initsv + ':"";')();
                                    if (svCode) {
                                        var param = "param=" + trans_param + "";
                                        $.aries.ajax.post(svCode, param, function(data) {
                                            if (data && onsuccess && $.isString(onsuccess)) {
                                                var i = onsuccess.indexOf("(");
                                                var actName = i > 0 ? onsuccess.substring(0, i) : onsuccess;
                                                var win = $("#" + framename)[0].contentWindow;
                                                if ($.isFunction(win[actName])) {
                                                    win[actName](data);
                                                }
                                            }
                                        }, function(errorCode, info) {
                                            alert("error:" + errorCode);
                                        });
                                    }
                                }
                            });
                            trans = null ;
                        } else {
                            window["Wade_isStopResizeHeight"] = userDefinedWade_isStopResizeHeight;
                            var framename = this["name"];
                            var frameWin = $("#" + framename)[0].contentWindow;
                            if (frameWin && frameWin.$) {
                                window.getFlow().setButton(active, true);
                            }
                        }
                        $("#" + this["name"]).attr("height", autoheight);
                        $("#" + this["name"]).css("display", "");
                    } else {
                        $("#" + this["name"]).attr("height", "0");
                        $("#" + this["name"]).css("display", "none");
                    }
                }, [data["name"]]);
            },
            setFlow: function(noi) {},
            setButton: function(noi, isDisabled) {
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                if (isDisabled) {
                    $("#bnext").attr("disabled", "disabled");
                }
                if (data["nextstep"] == "end") {
                    $("#bnext").attr("class", "finish");
                    $("#bnext").attr("active", noi);
                    $("#bnext").attr("uuid", noi);
                    $("#bnext").html("Finish");
                    $("#bnext").attr("next", data["nextstep"]);
                    $("#bnext").unbind("click");
                    $("#bnext").bind("click", function() {
                        window.getFlow().submit();
                    });
                    this.isFilish = true;
                } else {
                    $("#bnext").attr("class", "");
                    $("#bnext").attr("active", noi);
                    $("#bnext").attr("uuid", "step");
                    $("#bnext").attr("next", data["nextstep"]);
                    $("#bnext").unbind("click");
                    $("#bnext").bind("click", function() {
                        window.getFlow().next(data["nextstep"]);
                    });
                    this.isFilish = false;
                }
                if (isDisabled) {
                    $.aries.common.disabledButton("bnext", true);
                } else {
                    $.aries.common.disabledButton("bnext", false);
                }
                var firstStepName = this.getStep("begin")["nextstep"];
                if (firstStepName != noi) {
                    $("#bback").css("visibility", "visible");
                    var back = null ;
                    this.gostep.eachKey(function(key, idx) {
                        if (key == data["name"]) {
                            return;
                        }
                        back = key;
                    });
                    $("#bback").attr("active", noi);
                    $("#bback").attr("back", back);
                    $("#bback").unbind("click");
                    $("#bback").bind("click", function() {
                        window.getFlow().back(back);
                    });
                } else {
                    $("#bback").css("visibility", "hidden");
                    $("#bback").unbind("click");
                }
            },
            toSwitch: function(noi, ignoreMonitor, notTriggerNextButton) {
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                var pdata = this.getActive();
                var execval = this.execExpress(pdata["name"], data["expression"], data["default"]);
                pdata = null ;
                var caseval = null ;
                $.each(data["cases"], function(val) {
                    if (this["value"] == val) {
                        caseval = val;
                        return true;
                    }
                }, [execval]);
                var next = null ;
                try {
                    if (caseval == null ) {
                        next = data["cases"][data["default"]]["nextstep"];
                    } else {
                        next = data["cases"][caseval]["nextstep"];
                    }
                } catch (e) {
                    alert("bad switch config,at " + noi);
                    return -1;
                }
                if (next == null  || typeof (next) == "undefined") {
                    alert("bad switch config,at " + noi);
                    return -1;
                }
                this.next(next, ignoreMonitor, notTriggerNextButton);
            },
            getActive: function() {
                var data = this.getStep(this.active);
                if (data == null  || typeof (data) == "undefined") {
                    alert("the flow has stopped");
                    return null ;
                }
                return data;
            },
            getStep: function(noi) {
                if (noi && typeof (noi) == "string") {
                    var step = null ;
                    $.each(this.steps, function(_value) {
                        if (this["name"] == _value) {
                            step = this;
                            return true;
                        }
                    }, [noi]);
                    return step;
                } else {
                    return this.steps[noi];
                }
            },
            getStepFrame: function(name) {},
            autoSize: function() {
                return document.body.offsetHeight - $("#guideBtns")[0].offsetHeight - 3;
            },
            setAutoHeight: function() {
                var h = this.autoSize();
                $.each(this.steps, function(idx, val) {
                    var name = val["name"];
                    if (name != "begin" || name != "end") {
                        var el = $("#" + name);
                        if (el.length > 0 && el.attr("src") && el.attr("src") != "" && el.attr("height") && el.attr("height") != "0") {
                            el.css("height", h);
                        }
                    }
                });
            },
            getBackStep: function() {
                return this.getStep($("#bback").attr("back"));
            },
            clear: function() {
                this.id = null ;
                this.steps = null ;
                this.active = 0;
                this.activeFrames = [];
                this.curStep = "";
                this.size = -1;
                this.gostep = null ;
                this.drawGuide = false;
                this.isFilish = false;
                this.currentEvent = null ;
                this.isBack = false;
                this.currentData = null ;
                this.submitListener = null ;
                this.submitParams = "";
                this.currentEvtType = null ;
                this.globalVars = null ;
                this.bindedButtons = null ;
                this.defaultShow = "";
            },
            next: function(noi, ignoreMonitor, notTriggerNextButton) {
                if (!noi) {
                    noi = $("#bnext").attr("next");
                }
                if (window.getFlow().getCurrentEvtType() == "submit") {
                    window.getFlow().submit();
                    return;
                }
                var active = this.getActive();
                var params = "";
                if (notTriggerNextButton != true) {}
                this.setShowPage(this.active);
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                if (data["tagname"] == "switch") {
                    this.toSwitch(noi, ignoreMonitor, notTriggerNextButton);
                    return;
                }
                this.gostep.put(data["name"], data);
                if ($("#" + data["name"]).attr("src") != "about:blank") {
                    this.setButton(noi);
                } else {
                    this.setButton(noi, true);
                }
                $.bizpageflow.fn.displayNextButton(this.active, "none");
                $.bizpageflow.fn.displayNextButton(noi, "inline-block");
                this.setFrame(noi, params);
                this.active = noi;
                this.curStep = noi;
            },
            back: function(noi, notTriggerNextButton) {
                if (!noi) {
                    noi = $("#bback").attr("back");
                }
                var data = this.getStep(noi);
                if (data == null  || typeof (data) == "undefined") {
                    return;
                }
                if (data["name"] === "begin" || data["name"] === "end") {
                    return;
                }
                var active = this.getActive();
                if (notTriggerNextButton != true) {
                    var f = this.getStepFrame(this.active);
                    if (f != null  && active["backbutton"] && active["backbutton"] != "") {
                        var bback = f("#" + active["backbutton"]);
                        if (bback.length > 0) {
                            var value = bback.triggerHandler("click");
                            if (value == false) {
                                return;
                            }
                        }
                    }
                    f == null ;
                }
                data["nexttrigger"] = "";
                this.gostep.removeKey(this.active);
                this.setButton(noi);
                this.setFrame(noi, "");
                this.active = noi;
                this.curStep = noi;
                this.setAutoHeight();
            },
            cancel: function() {
                alert("close the window!");
            },
            submit: function() {
                var curListener = window.getFlow().getSubmitListener();
                if (curListener == null  || curListener == "") {
                    return;
                }
                $.aries.common.disabledButton("bnext", true);
                var data = this.getActive();
                this.getTransData(data["name"]);
                var submitdata;
                if (this.submitParams) {
                    var paramAry = this.submitParams.split(",");
                    var buf = [];
                    for (var i = 0; i < paramAry.length; i++) {
                        var param = paramAry[i];
                        buf.push(param + "=" + this.getGlobalValue(param));
                    }
                    submitdata = buf.join("&");
                    $.aries.ajax.post(curListener, submitdata, function(data) {
                        $.aries.common.disabledButton("bnext", false);
                        $.aries.messagebox.success("Submit Successfully!");
                    }, function(i, e) {
                        $.aries.common.disabledButton("bnext", false);
                    });
                }
            },
            stepChange: function(ignoreMonitor) {
                var changekey = this.getChange();
                var lastFlowName = this.activeFrames.slice(this.activeFrames.length - 1)[0];
                if (ignoreMonitor != true) {
                    if (changekey && changekey != lastFlowName) {
                        $("#guide_" + changekey).attr("monitor", "{" + this.getStepMonitor(changekey) + "}");
                        if (window.confirm($.lang["view.web.comp.pageflow.confirm"])) {
                            this.reset(changekey);
                            this.setShowPage(changekey);
                            $("#bnext").triggerHandler("click");
                            return false;
                        }
                    }
                } else {
                    if (changekey && changekey != lastFlowName && changekey == this.curStep) {
                        $("#guide_" + this.curStep).attr("monitor", "{" + this.getStepMonitor(this.curStep) + "}");
                    }
                }
                return true;
            },
            isFilishStep: function() {
                return this.isFilish;
            },
            setCurrentEvent: function(evt) {
                this.currentEvent = evt;
            },
            getCurrentEvent: function() {
                return this.currentEvent;
            },
            setCurrentEvtType: function(evtType) {
                this.currentEvtType = evtType;
            },
            getCurrentEvtType: function() {
                return this.currentEvtType;
            },
            initNextButton: function(evt, page, text, verifyEvent) {
                var subFrame = $("#" + page);
                if (subFrame == null  || typeof (subFrame) == "undefined") {
                    return;
                }
                var btnHtml = '<a href="#nogo" id="' + evt + '" name="' + evt + '" page="' + page + '" style="display:none;">' + text + "</a>\n";
                $("#guideBtns").append(btnHtml);
                var btn = $("#" + evt + "[page=" + page + "]");
                var pf = this;
                if (btn != undefined && btn[0] != undefined) {
                    btn.bind("click", function(e) {
                        if (pf.verifyNextEvent(verifyEvent)) {
                            pf.setCurrentEvent(evt);
                            pf.setSubmitListener("");
                            pf.setCurrentEvtType("next");
                            $("#bnext").trigger("click");
                        }
                    });
                }
                if (page == this.active) {
                    this.displayNextButton(page, "inline-block");
                }
            },
            displayNextButton: function(page, state) {
                var btns = $("#guideBtns").children("a[page=" + page + "]");
                if (btns && btns.length) {
                    btns.css("display", state);
                    $("#guideBtns").show();
                }
            },
            bindNextEvent: function(page, nextEvt, source, evtType, evtName, verifyEvent) {
                if (page == null  || typeof (page) == "undefined" || page == "") {
                    return;
                }
                if (evtName == null  || typeof (evtName) == "undefined" || evtName == "") {
                    evtName = "Next";
                }
                if (nextEvt == null  || typeof (nextEvt) == "undefined" || nextEvt == "") {
                    window.getFlow().initNextButton("defBtn_" + page, page, evtName, verifyEvent);
                    return;
                }
                if (source == null  || typeof (source) == "undefined" || source == "") {
                    window.getFlow().initNextButton(nextEvt, page, evtName, verifyEvent);
                    return;
                }
                if (typeof (this.bindedButtons[page]) == "undefined" || this.bindedButtons[page] == null ) {
                    this.bindedButtons[page] = [];
                }
                var bindedBtn = {};
                bindedBtn.name = source;
                bindedBtn.type = "n";
                bindedBtn.evtType = evtType;
                bindedBtn.nextEvt = nextEvt;
                bindedBtn.verifyEvent = verifyEvent;
                this.bindedButtons[page].push(bindedBtn);
                return;
                var subFrame = $("#" + page);
                if (subFrame) {
                    subFrame.bind("load", function(e) {
                        var btn = $("[name=" + source + "]", this.contentDocument);
                        var frame = this.contentWindow;
                        if (btn == undefined || btn[0] == undefined) {
                            return;
                        }
                        if (evtType != null  && typeof (evtType) != "undefined" && evtType != "") {
                            var evt = btn[0].getAttribute(evtType);
                            var evtName = ""
                              , evtArgs = "";
                            if (evt && evt != "") {
                                var len = evt.indexOf("(");
                                if (len > -1) {
                                    evtName = evt.substring(0, len);
                                    var endLen = evt.indexOf(")");
                                    evtArgs = endLen > -1 ? evt.substring(len + 1, endLen) : evt.substring(len + 1, evt.length);
                                } else {
                                    evtName = evt;
                                }
                            }
                            var bindType = evtType.indexOf("on") == 0 ? evtType.substring(2, evtType.length) : evtType;
                            btn.unbind(bindType);
                            btn.bind(bindType, function(e) {
                                if (evtName != "") {
                                    if ($.isFunction(frame.window[evtName])) {
                                        if (evtArgs != "") {
                                            eval("frame.window." + evtName + "(" + evtArgs + ");");
                                        } else {
                                            eval("frame.window." + evtName + "();");
                                        }
                                    }
                                }
                                if (window.getFlow().verifyNextEvent(verifyEvent)) {
                                    window.getFlow().setCurrentEvent(nextEvt);
                                    window.getFlow().setSubmitListener("");
                                    window.getFlow().setCurrentEvtType("next");
                                    $("#bnext").trigger("click");
                                }
                            });
                            btn[0].setAttribute(evtType, "");
                        }
                    });
                }
            },
            verifyNextEvent: function(verifyEvent) {
                var rtnFlag = true;
                if (verifyEvent && typeof (verifyEvent) != "undefined" && verifyEvent != "") {
                    var errorTitle = "不能执行操作";
                    var evtName, evtArgs = "", len = -1;
                    len = verifyEvent.indexOf("(");
                    if (len > -1) {
                        evtName = verifyEvent.substring(0, len);
                        var endLen = verifyEvent.indexOf(")");
                        evtArgs = endLen > -1 ? verifyEvent.substring(len + 1, endLen) : verifyEvent.substring(len + 1, verifyEvent.length);
                    } else {
                        evtName = verifyEvent;
                    }
                    var rtn, rtnMsg = "";
                    if (evtArgs != "") {
                        rtn = eval("window." + evtName + "(" + evtArgs + ");");
                    } else {
                        rtn = eval("window." + evtName + "();");
                    }
                    if (rtn && $.isArray(rtn) && rtn.length > 0) {
                        rtnFlag = rtn[0];
                        if (rtn.length > 1) {
                            rtnMsg = rtn[1];
                        }
                    } else {
                        rtnFlag = rtn;
                    }
                    if (rtnFlag == undefined || rtnFlag == "false" || rtnFlag == false) {
                        rtnFlag = false;
                    } else {
                        rtnFlag = true;
                    }
                    if (!rtnFlag) {
                        $.aries.messagebox.error(errorTitle, rtnMsg ? rtnMsg : "");
                        window.getFlow().setCurrentEvent(null );
                        window.getFlow().setSubmitListener(null );
                    }
                }
                return rtnFlag;
            },
            bindSubmitEvent: function(page, submitEvt, source, evtType, evtName, submitSV, params, verifyEvent, afterSubmit) {
                if (page == null  || typeof (page) == "undefined" || page == "") {
                    return;
                }
                if (evtName == null  || typeof (evtName) == "undefined" || evtName == "") {
                    evtName = "Submit";
                }
                if (submitEvt == null  || typeof (submitEvt) == "undefined" || submitEvt == "") {
                    window.getFlow().initSubmitButton("defBtn_" + page, page, evtName, submitSV, verifyEvent);
                    return;
                }
                if (source == null  || typeof (source) == "undefined" || source == "") {
                    window.getFlow().initSubmitButton(submitEvt, page, evtName, submitSV, verifyEvent);
                    return;
                }
                if (typeof (this.bindedButtons[page]) == "undefined" || this.bindedButtons[page] == null ) {
                    this.bindedButtons[page] = [];
                }
                var bindedBtn = {};
                bindedBtn.name = source;
                bindedBtn.type = "s";
                bindedBtn.submitEvt = submitEvt;
                bindedBtn.evtType = evtType;
                bindedBtn.evtName = evtName;
                bindedBtn.submitSV = submitSV;
                bindedBtn.verifyEvent = verifyEvent;
                this.bindedButtons[page].push(bindedBtn);
                if (params) {
                    this.submitParams = params;
                } else {
                    this.submitParams = "";
                }
                return;
                var subFrame = $("#" + page);
                if (subFrame) {
                    subFrame.bind("load", function(e) {
                        var btn = $("[name=" + source + "]", this.contentDocument);
                        var frame = this.contentWindow;
                        if (btn == undefined || btn[0] == undefined) {
                            return;
                        }
                        if (evtType != null  && typeof (evtType) != "undefined" && evtType != "") {
                            var evt = btn[0].getAttribute(evtType);
                            var evtName = ""
                              , evtArgs = "";
                            if (evt && evt != "") {
                                var len = evt.indexOf("(");
                                if (len > -1) {
                                    evtName = evt.substring(0, len);
                                    var endLen = evt.indexOf(")");
                                    evtArgs = endLen > -1 ? evt.substring(len + 1, endLen) : evt.substring(len + 1, evt.length);
                                } else {
                                    evtName = evt;
                                }
                            }
                            var bindType = evtType.indexOf("on") == 0 ? evtType.substring(2, evtType.length) : evtType;
                            btn.unbind(bindType);
                            btn.bind(bindType, function(e) {
                                if (evtName != "") {
                                    if (evtArgs != "") {
                                        eval("frame.window." + evtName + "(" + evtArgs + ");");
                                    } else {
                                        eval("frame.window." + evtName + "();");
                                    }
                                }
                                if (window.getFlow().verifyNextEvent(verifyEvent)) {
                                    window.getFlow().setCurrentEvent(submitEvt);
                                    window.getFlow().setSubmitListener(submitSV);
                                    window.getFlow().setCurrentEvtType("submit");
                                    $("#bnext").trigger("click");
                                }
                            });
                            btn[0].setAttribute(evtType, "");
                        }
                    });
                }
            },
            initSubmitButton: function(evt, page, text, submitSV, verifyEvent) {
                var subFrame = $("#" + page);
                if (subFrame == null  || typeof (subFrame) == "undefined") {
                    return;
                }
                var btnHtml = '<a href="#nogo" id="' + evt + '" name="' + evt + '" class="finish" page="' + page + '" style="display:none;">' + text + "</a>\n";
                $("#guideBtns").append(btnHtml);
                var btn = $("#" + evt + "[page=" + page + "]");
                var pf = this;
                if (btn != undefined && btn[0] != undefined) {
                    btn.bind("click", function(e) {
                        if (pf.verifyNextEvent(verifyEvent)) {
                            pf.setCurrentEvent(evt);
                            pf.setSubmitListener(submitSV);
                            pf.setCurrentEvtType("submit");
                            $("#bnext").trigger("click");
                        }
                    });
                }
                if (page == this.active) {
                    this.displayNextButton(page, "inline-block");
                }
            },
            setSubmitListener: function(ltr) {
                this.submitListener = ltr;
            },
            getSubmitListener: function() {
                return this.submitListener;
            },
            getGlobalVarsByName: function(key) {
                if (key && key != "" && this.globalVars.containsKey(key)) {
                    return this.globalVars.get(key);
                }
                return "";
            },
            setGlobalVarsByName: function(key, value) {
                if (key && key != "") {
                    if (value == undefined || value == null ) {
                        value = "";
                    }
                    if (this.globalVars.containsKey(key)) {
                        this.globalVars.removeKey(key);
                        this.globalVars.put(key, value);
                    } else {
                        this.globalVars.put(key, value);
                    }
                }
            },
            clearGlobalVars: function() {
                this.globalVars.clear();
            },
            getGlobalVarsList: function() {
                return this.globalVars;
            },
            bindTransValue: function(page, uiid) {
                if (page == null  || page == undefined || page == "") {
                    return;
                }
                if (uiid == null  || uiid == undefined || uiid == "") {
                    return;
                }
                var toFrame = $("#" + page);
                if (toFrame) {
                    toFrame.bind("load", function(e) {
                        var toItem = $("[uiid=" + uiid + "]", this.contentDocument);
                        if (toItem == undefined || toItem[0] == undefined) {
                            return;
                        }
                        if ($.nodeName(toItem[0], "input") || $.nodeName(toItem[0], "select") || $.nodeName(toItem[0], "textarea")) {
                            var p = $.params.load(toFrame[0].src);
                            toItem.val(p.get(uiid) + "");
                        }
                    });
                }
            },
            getGlobalValue: function(key) {
                var result = "";
                if (!key || key == "" || !this.globalVars.containsKey(key)) {
                    return "";
                }
                return this.globalVars.get(key);
            }
        };
        $.bizpageflow.fn.construct.prototype = $.bizpageflow.fn;
    }
});
define("ui-popup", function(require, exports, moudles) {
    $.aries.popup = {
        _popupSettings: function(a, c, d, b) {
            return cfg = {
                autoOpen: true,
                modal: b.modal,
                width: c || "600",
                height: d || "auto",
                title: a || "",
                popupType: b.popupType || "",
                draggable: b.draggable,
                resizable: b.resizable,
                showFlush: b.showFlush,
                showClose: b.showClose,
                showMinMax: b.showMinMax,
                partId: b.partId,
                onBeforeClose: $.aries.popup._buildEvent(b.onBeforeClose),
                onClose: $.aries.popup._buildEvent(b.onClose)
            };
        },
        _buildEvent: function(b) {
            var a = b ? function() {
                var d = b.indexOf("(");
                var c = d > 0 ? b.substring(0, d) : b;
                var e = "return window." + c + "?" + c + ".call(window):false;";
                return new Function(e)();
            }
             : "";
            return a;
        },
        openPage: function(e, b, f, g, d) {
            var c = $.extend(true, {}, $.extend({
                modal: true,
                draggable: false,
                resizable: false,
                showFlush: false,
                showClose: true,
                showMinMax: false,
                cache: false
            }, d));
            if (e) {
                var a = $.aries.popup._popupSettings(b, f, g, c);
                $.ajax(e, {
                    cache: c.cache,
                    success: function(i, k, h) {
                        var j = c.partId ? $("#" + c.partId) : document.body;
                        $('<div id="ae_popup_div"></div>').appendTo(j);
                        $("#ae_popup_div").html(i);
                        $("#ae_popup_div").aeDialog(a);
                        $.aries.common.globalInit("ae_popup_div");
                    },
                    error: function(h, j, i) {}
                });
            }
        },
        openDiv: function(k, f, j, h, b) {
            var l = $.extend(true, {}, $.extend({
                modal: true,
                draggable: false,
                resizable: false,
                showFlush: false,
                showClose: true,
                showMinMax: false,
                popupType: "div"
            }, b));
            if (k) {
                var g = $.aries.popup._popupSettings(f, j, h, l);
                if (l.initAfterAction) {
                    var c = $("#" + k).find("[aeInit=false]");
                    if (c) {
                        $(c).each(function(i, m) {
                            $(m).attr("aeInit", "true");
                        });
                        $.aries.common.globalInit(k);
                        var e = l.initAfterAction.indexOf("(");
                        var d = e > 0 ? l.initAfterAction.substring(0, e) : l.initAfterAction;
                        var a = "return window." + d + "?" + d + ".call(window):false;";
                        new Function(a)();
                    }
                }
                $("#" + k).aeDialog(g);
            }
        },
        closePage: function(a, d, e) {
            $("#ae_popup_div").aeDialog("close");
            var g = $("#" + a).attr("afterAction");
            if (e != true && d) {
                if (g) {
                    var c = g.indexOf("(");
                    var b = c > 0 ? g.substring(0, c) : g;
                    var f = "return window." + b + "?" + b + ".call(window,j):false;";
                    new Function("j",f)(d);
                }
            }
        },
        closeDiv: function(a, d, e) {
            $("#" + a).aeDialog("close");
            var g = $("#" + a).attr("afterAction");
            if (e != true && d) {
                if (g) {
                    var c = g.indexOf("(");
                    var b = c > 0 ? g.substring(0, c) : g;
                    var f = "return window." + b + "?" + b + ".call(window,j):false;";
                    new Function("j",f)(d);
                }
            }
        }
    };
    $.openPopupPage = $.aries.popup.openPage;
    $.closePopupPage = $.aries.popup.closePage;
    $.openPopupDiv = $.aries.popup.openDiv;
    $.closePopupDiv = $.aries.popup.closeDiv;
});
define("ui-progressbar", function(require, exports, moudles) {
    $.aeWidget("ae.aeProgressbar", {
        options: {
            value: 0,
            text: "{value}%",
            width: "auto",
            max: 100,
            large: false,
            initType: "html"
        },
        min: 0,
        _create: function() {
            var b = this.element
              , a = this.options;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            a.aeType ? b.attr("aeType", a.aeType) : b.attr("aeType", "aeProgressbar");
            a.uiid ? b.attr("uiid", a.uiid) : b.attr("uiid", b.attr("id"));
            b.addClass("e_progress");
            this.valueDiv = $('<span class="e_progressBar"></span>').appendTo(b);
            this.textDiv = $('<span class="e_progressValue"></span>').appendTo(b);
        },
        _init: function() {
            var c = this.element
              , a = this.options
              , b = c.width();
            if (typeof (a.width) == "number") {
                b = a.width;
                c.width(b);
            }
            if (a.large) {
                c.addClass("e_progress-big");
            }
            this.oldValue = this._value();
            this._refreshValue();
        },
        _buildOptions: function(b, c) {
            b.value = parseInt(c.attr("value")) || b.value;
            b.width = parseInt(c.attr("width")) || b.width;
            b.large = c.attr("large") == "true" ? true : b.large;
            b.aeType = c.attr("aeType");
            b.uiid = c.attr("uiid");
            var d = c.attr("text") || b.text;
            b.text = d && d.indexOf("(") > 0 ? function(h) {
                if ($.isString(d)) {
                    var f = d.indexOf("(");
                    var e = f > 0 ? d.substring(0, f) : d;
                    var g = "return window." + e + "?" + e + ".call(window,v):false;";
                    return new Function("v",g)(h);
                }
            }
             : d;
            var a = c.attr("onChange");
            b.onChange = a ? function(k, e, j) {
                if ($.isString(a)) {
                    var g = a.indexOf("(");
                    var f = g > 0 ? a.substring(0, g) : a;
                    var h = "return window." + f + "?" + f + ".call(window, n ,o , e):false;";
                    return new Function("n","o","e",h)(k, e, j);
                }
            }
             : b.onChange;
        },
        setValue: function(a) {
            this.options.value = a;
            this._refreshValue();
        },
        getValue: function() {
            return this._value();
        },
        _value: function() {
            var a = this.options.value;
            if (typeof a !== "number") {
                a = 0;
            }
            return Math.min(this.options.max, Math.max(this.min, a));
        },
        _percentage: function() {
            return 100 * this._value() / this.options.max;
        },
        _refreshValue: function() {
            var c = this
              , e = c.getValue()
              , b = c.options.onChange;
            var a = c._percentage();
            var f = c.options.text
              , d = "";
            c.valueDiv.toggle(e >= c.min).width(a.toFixed(0) + "%");
            if (typeof (f) == "function") {
                d = f.call(e, e);
            } else {
                if (typeof (f) == "string") {
                    d = f.replace("{value}", e);
                }
            }
            c.textDiv.html(d);
            if (c.oldValue !== e) {
                b && c._trigger("onChange", null , e, c.oldValue);
                c.oldValue = e;
            }
        }
    });
});
define("ui-slider", function(require, exports, moudles) {
    $.aeWidget("ae.aeSlider", {
        options: {
            cssPre: "c_",
            width: "500px",
            height: "400px",
            autoPlay: true,
            autoPlayTime: 3000,
            animSpeed: 400,
            delayTime: 200,
            pauseOnHover: true,
            isDirectionIcon: true,
            isNavigation: true,
            navigationType: "num",
            isNavigationInimg: true,
            animEffect: "fade",
            onBeforeSlide: function(a) {},
            onAfterSlide: function(a) {},
            initType: "html"
        },
        _create: function() {
            var a = this
              , b = this.options
              , d = this.element;
            var c = {
                startSlide: 0,
                nowSlide: 0,
                totalSlides: 0,
                running: false,
                paused: false,
                stop: false,
                selectedNavStyle: "nav-selected"
            };
            b.vars = c;
            c.pre = b.cssPre;
            if (b.initType == "html") {
                a._buildOptions(b, d);
            }
            var e = d.children();
            c.totalSlides = e.length;
            c.width = d.attr("width");
            c.height = d.attr("height");
            if (c.width == undefined || c.height == undefined) {
                d.find("img").each(function(f, g) {
                    if ($(g).attr("src")) {
                        var h = $(g).attr("src");
                        $(g).attr("src", h).load(function() {
                            c.width = this.width;
                            c.height = this.height;
                        });
                    }
                });
            }
            b.width = c.width ? c.width : b.width;
            b.height = c.height ? c.height : b.height;
            d.width(b.width).height(b.height);
            b.thumbW = parseInt(b.width) / 10 + "px";
            b.thumbH = parseInt(b.height) / 10 + "px";
            if ($('img[name="thumbImgs"]')) {
                $('img[name="thumbImgs"]').each(function(f, g) {
                    $(g).attr({
                        "width": b.thumbW,
                        "height": b.thumbH
                    });
                });
            }
            d.addClass(c.pre + "slider");
            if (b.diyNavigationId !== undefined || $("#" + b.diyNavigationId) !== undefined) {
                $("#" + b.diyNavigationId).wrap('<div class="temp"></div>');
                b.vars.diyNavHtml = $(".temp").html();
                $(".temp").remove();
            }
            d.children().wrapAll('<ul class="' + c.pre + 'slider-content"></ul>').wrap('<li class="' + c.pre + 'slider-item"></li>');
            if (b.animEffect == "slide-y" || b.animEffect == "slide-x") {
                d.find("." + c.pre + "slider-content").addClass(c.pre + "slider-effect-" + b.animEffect);
            }
        },
        _init: function() {
            var h = this
              , i = this.options
              , c = this.element
              , d = i.vars;
            var a = 0;
            var g = c.find("ul." + d.pre + "slider-content:first")
              , f = g.children()
              , e = 0
              , b = 0;
            if (i.isNavigation == true) {
                h._initNavigation(c);
            }
            if (i.animEffect == "slide-x") {
                f.each(function(j) {
                    if (j == 0) {
                        return false;
                    }
                    b -= $(this).width();
                });
                setTimeout(function() {
                    g.css({
                        left: b,
                        top: e
                    });
                }, 0);
            } else {
                if (i.animEffect == "slide-y") {
                    f.each(function(j) {
                        if (j == 0) {
                            return false;
                        }
                        e -= $(this).height();
                    });
                    setTimeout(function() {
                        g.css({
                            left: b,
                            top: e
                        });
                    }, 0);
                } else {
                    g.children().eq(0).show();
                }
            }
            if (d.navigationStyle) {
                h._toggleNavigationStyle(c, 0);
            }
            if (i.autoPlay) {
                d.autoPlayTimer = a = setInterval(function() {
                    h._next(c);
                }, i.autoPlayTime);
            }
            if (i.pauseOnHover) {
                c.hover(function() {
                    d.paused = true;
                    clearInterval(a);
                }, function() {
                    d.paused = false;
                    if (i.autoPlay) {
                        d.autoPlayTimer = a = setInterval(function() {
                            h._next(c);
                        }, i.autoPlayTime);
                    }
                });
            }
            if (i.isDirectionIcon == true) {
                h._initDirectionIcon(c);
            }
        },
        _buildOptions: function(b, c) {
            b.autoPlay = c.attr("isAutoPlay") == "false" ? false : b.autoPlay;
            b.autoPlayTime = c.attr("autoPlayTime") || b.autoPlayTime;
            b.animSpeed = c.attr("animSpeed") || b.animSpeed;
            b.delayTime = c.attr("delayTime") || b.delayTime;
            b.pauseOnHover = c.attr("pauseOnHover") == "false" ? false : b.pauseOnHover;
            b.isDirectionIcon = c.attr("isDirectionIcon") == "false" ? false : b.isDirectionIcon;
            b.isNavigation = c.attr("isNavigation") == "false" ? false : b.isNavigation;
            b.navigationType = c.attr("navigationType") || b.navigationType;
            b.isNavigationInimg = c.attr("isNavigationInimg") == "false" ? false : b.isNavigationInimg;
            b.animEffect = c.attr("animEffect") || b.animEffect;
            if (b.isNavigation == true && b.navigationType == "diy") {
                b.diyNavigationId = c.attr("diyNavigationId");
            }
            var a = c.attr("onBeforeSlide");
            b.onBeforeSlide = a ? function(e, j) {
                if ($.isString(a)) {
                    var g = a.indexOf("(");
                    var f = g > 0 ? a.substring(0, g) : a;
                    var h = "return window." + f + "?" + f + ".call(window,i,e):false;";
                    return new Function("i","e",h)(e, j);
                }
            }
             : b.onBeforeSlide;
            var d = c.attr("onAfterSlide");
            b.onAfterSlide = d ? function(e, j) {
                if ($.isString(d)) {
                    var g = d.indexOf("(");
                    var f = g > 0 ? d.substring(0, g) : d;
                    var h = "return window." + f + "?" + f + ".call(window,i,e):false;";
                    return new Function("i","e",h)(e, j);
                }
            }
             : b.onAfterSlide;
        },
        _initNavigation: function(f) {
            var o = this, p = this.options, g = p.vars, b;
            if (p.navigationType === "num") {
                var i = $('<ul class="' + g.pre + 'slider-nav-classical"></ul>');
                g.navigationStyle = "." + g.pre + "slider-nav-classical";
                for (b = 0; b < g.totalSlides; b++) {
                    var a = $("<li>" + (b + 1) + "</li>");
                    a.data("sid", b);
                    var l = 0;
                    a.click(function() {
                        o._slideTo(f, $(this).data("sid"));
                    });
                    a.hover(function() {
                        if (g.running || g.stop) {
                            return false;
                        }
                        var h = $(this);
                        if (h.hasClass(g.selectedNavStyle)) {
                            return false;
                        }
                        g.slideTimer = l = setTimeout(function() {
                            o._slideTo(f, h.data("sid"));
                        }, p.delayTime);
                    }, function() {
                        clearTimeout(l);
                    });
                    i.append(a);
                }
                f.append(i);
                if (p.isNavigationInimg == false) {
                    i.css({
                        bottom: "-50px"
                    });
                }
            } else {
                if (p.navigationType === "dot") {
                    var i = $('<div class="' + g.pre + 'slider-nav-dot"></div>');
                    g.navigationStyle = "." + g.pre + "slider-nav-dot";
                    for (b = 0; b < g.totalSlides; b++) {
                        var a = $('<a href="javascript:void(0)">' + (b + 1) + "</a>");
                        a.data("sid", b);
                        var l = 0;
                        a.click(function() {
                            o._slideTo(f, $(this).data("sid"));
                        });
                        a.hover(function() {
                            if (g.running || g.stop) {
                                return false;
                            }
                            var h = $(this);
                            if (h.hasClass(g.selectedNavStyle)) {
                                return false;
                            }
                            g.slideTimer = l = setTimeout(function() {
                                o._slideTo(f, h.data("sid"));
                            }, p.delayTime);
                        }, function() {
                            clearTimeout(l);
                        });
                        i.append(a);
                    }
                    i.appendTo(f).css({
                        marginLeft: -1 * i.width() / 2
                    });
                    if (p.isNavigationInimg == false) {
                        i.css({
                            bottom: "-50px"
                        });
                    }
                } else {
                    if (p.navigationType == "thumb") {
                        var m = f.find("ul." + g.pre + "slider-content:first")
                          , k = m.children(":first");
                        var i = $('<ul class="' + g.pre + 'slider-nav-thumb"></ul>');
                        g.navigationStyle = "." + g.pre + "slider-nav-thumb";
                        for (b = 0; b < g.totalSlides; b++) {
                            $imgItem = k.find("img");
                            var e = $imgItem.attr("src");
                            var j = p.thumbW || "60px"
                              , d = p.thumbH || "40px";
                            var a = $('<li><img name="thumbImgs" width="' + j + '" height="' + d + '" src="' + e + '"/></li>');
                            a.data("sid", b);
                            var l = 0;
                            a.click(function() {
                                o._slideTo(f, $(this).data("sid"));
                            });
                            a.hover(function() {
                                if (g.running || g.stop) {
                                    return false;
                                }
                                var h = $(this);
                                if (h.hasClass(g.selectedNavStyle)) {
                                    return false;
                                }
                                g.slideTimer = l = setTimeout(function() {
                                    o._slideTo(f, h.data("sid"));
                                }, p.delayTime);
                            }, function() {
                                clearTimeout(l);
                            });
                            i.append(a);
                            k = k.next();
                        }
                        f.append(i);
                        if (p.isNavigationInimg == false) {
                            i.css({
                                bottom: "-50px"
                            });
                        }
                    } else {
                        if (p.navigationType == "diy" || g.diyNavHtml) {
                            var c = p.diyNavigationId;
                            f.append(g.diyNavHtml);
                            g.navigationStyle = "." + $("#" + c).attr("class");
                            var i = $("#" + c)
                              , a = i.children(":first");
                            for (b = 0; b < g.totalSlides; b++) {
                                a.data("sid", b);
                                var l = 0;
                                a.click(function() {
                                    o._slideTo(f, $(this).data("sid"));
                                });
                                a.hover(function() {
                                    if (g.running || g.stop) {
                                        return false;
                                    }
                                    var h = $(this);
                                    if (h.hasClass(g.selectedNavStyle)) {
                                        return false;
                                    }
                                    g.slideTimer = l = setTimeout(function() {
                                        o._slideTo(f, h.data("sid"));
                                    }, p.delayTime);
                                }, function() {
                                    clearTimeout(l);
                                });
                                a = a.next();
                            }
                        }
                    }
                }
            }
        },
        _toggleNavigationStyle: function(e, c) {
            var b = this.options
              , d = b.vars;
            var a = e.find(d.navigationStyle).children();
            a.each(function(f) {
                $(this).toggleClass(d.selectedNavStyle, f == c);
            });
        },
        _initDirectionIcon: function(e) {
            var a = this
              , b = this.options
              , d = b.vars;
            var c = $('<div class="' + d.pre + 'slider-directionNav">').appendTo(e);
            $('<a class="' + d.pre + 'slider-prevNav"></a>').appendTo(c).click(function() {
                if (d.running) {
                    return false;
                }
                a._prev(e);
            });
            $('<a class="' + d.pre + 'slider-nextNav"></a>').appendTo(c).click(function() {
                if (d.running) {
                    return false;
                }
                a._next(e);
            });
            e.hover(function() {
                c.show();
            }, function() {
                c.hide();
            });
        },
        _slideTo: function(f, c) {
            var a = this
              , b = this.options
              , d = b.vars;
            var e = f.find("ul." + d.pre + "slider-content:first");
            if (isNaN(c) || c < 0 || c >= d.totalSlides) {
                return;
            }
            if (this._trigger("onBeforeSlide", null , c) === false) {
                return false;
            }
            if (b.animEffect == "slide-x" || b.animEffect == "slide-y") {
                a._runSlideEffect(f, c);
            }
            if (b.animEffect == "fade") {
                a._runFadeEffect(f, c);
            }
            if (d.navigationStyle) {
                a._toggleNavigationStyle(f, c);
            }
            d.nowSlide = c;
            return f;
        },
        _runSlideEffect: function(d, c, i) {
            var g = this
              , l = this.options
              , f = l.vars;
            var k = d.find("ul." + f.pre + "slider-content:first")
              , j = k.children()
              , h = 0
              , b = 0;
            var e = i ? i : l.animEffect;
            k.stop();
            if (e == "slide-y" || e == "slide-x") {
                var a = (e == "slide-y");
                j.each(function(m) {
                    if (m == c) {
                        return false;
                    }
                    a ? h -= $(this).height() : b -= $(this).width();
                });
            } else {
                return false;
            }
            f.running = true;
            k.animate({
                top: h,
                left: b
            }, l.animSpeed, function() {
                f.running = false;
                g._trigger("onAfterSlide", null , c);
            });
        },
        _runFadeEffect: function(f, d) {
            var a = this
              , c = this.options
              , e = c.vars;
            var b = f.find("ul." + e.pre + "slider-content:first").children();
            b.each(function(h) {
                var g = $(this);
                if (h == d) {
                    e.running = true;
                    g.fadeIn(c.animSpeed, function() {
                        e.running = false;
                        a._trigger("onAfterSlide", null , d);
                    });
                } else {
                    if (h == e.nowSlide) {
                        g.fadeOut(c.animSpeed);
                    }
                }
            });
        },
        _next: function(d) {
            var a = this.options
              , c = a.vars
              , b = 0;
            if (c.nowSlide + 2 <= c.totalSlides) {
                b = c.nowSlide + 1;
            }
            return this._slideTo(d, b);
        },
        _prev: function(d) {
            var b = this.options
              , c = b.vars
              , a = c.totalSlides - 1;
            if (c.nowSlide != 0) {
                a = c.nowSlide - 1;
            }
            return this._slideTo(d, a);
        },
        slideTo: function(a) {
            options = this.options;
            this._slideTo(this.element, a);
        },
        next: function() {
            options = this.options;
            this._next(this.element);
        },
        prev: function() {
            options = this.options;
            this._prev(this.element);
        },
        destroy: function() {
            var c = this.element
              , a = this.options
              , b = a.vars;
            clearTimeout(b.slideTimer);
            clearInterval(b.autoPlayTimer);
        }
    });
});
define("ui-tips", function(require, exports, moudles) {
    $.aeWidget("ae.aeTips", {
        options: {
            showLink: true,
            showClose: true,
            showIcon: true,
            showType: "alert",
            initType: "html"
        },
        _create: function() {
            var a = this.options
              , b = this.element;
            if (a.initType == "html") {
                this._buildOptions(a, b);
            }
            b.addClass("c_tip c_tip_yellow_img");
            $('<div class="fn"><a class="delete"></a><a class="close"></a></div>').appendTo(b);
            $('<div class="content"></div>').appendTo(b);
        },
        _init: function() {
            var b = this
              , c = b.options
              , d = b.element
              , a = d.find(">div.fn a.delete");
            if (c.content) {
                d.find(">div.content").html(c.content);
            }
            if (!c.showClose) {
                a.next().hide();
            }
            if (!c.showLink) {
                a.hide();
            }
            if (c.showType === "success") {
                d.addClass("c_tip_green c_tip_green_img");
            }
            if (c.showType === "error") {
                d.addClass("c_tip_red c_tip_red_img");
            }
            if (c.showType === "confirm") {
                d.addClass("c_tip_blue c_tip_blue_img");
            }
            if (!c.showIcon) {
                d.removeClass("c_tip_yellow_img c_tip_green_img c_tip_red_img c_tip_blue_img");
            }
            a.html(c.linkVal);
            a.next().unbind().bind("click", function() {
                d.hide();
            });
        },
        _buildOptions: function(a, b) {
            a.content = $.evalI18nString(b.attr("content"));
            a.showLink = b.attr("showLink") == "false" ? false : a.showLink;
            a.showClose = b.attr("showClose") == "false" ? false : a.showClose;
            a.showIcon = b.attr("showIcon") == "false" ? false : a.showIcon;
            a.linkVal = $.evalI18nString(b.attr("linkVal")) || "Not show again!";
            a.showType = b.attr("showType") || a.showType;
        },
        setContent: function(a) {
            if (a) {
                this.element.show().find(">div.content").html(a);
            }
        }
    });
});
define("ui-tpl", function(require, exports, moudles) {
    $.aeWidget("ae.aeTpl", {
        options: {
            initial: false,
            isHide: false,
            sourceId: "",
            dataField: "",
            onAfterReload: function() {},
            initType: "html"
        },
        _create: function() {
            var options = this.options
              , $ele = this.element;
            if (options.initial == true) {
                return;
            }
            if (options.initType == "html") {
                this._buildOptions(options, $ele);
            }
            options.aeType ? $ele.attr("aeType", options.aeType) : $ele.attr("aeType", "aeTpl");
            options.uiid ? $ele.attr("uiid", options.uiid) : $ele.attr("uiid", $ele.attr("id"));
            if (options.sourceId != "") {
                options.tpl = $("#" + options.sourceId).html();
            }
            options.template = Handlebars.compile(options.tpl);
            options.initial = true;
        },
        _init: function() {
            var self = this
              , options = self.options
              , $ele = self.element;
            var str = $ele.html();
            var regex = /{{.*?[}]?}}/g;
            var newHtml = str.replace(regex, "");
            if (options.isHide) {
                $ele.empty();
            } else {
                $ele.html(newHtml);
                $ele.removeClass("ae_tpl");
                $ele.show();
            }
        },
        _buildOptions: function(options, element) {
            options.tpl = element.html();
            options.dataField = element.attr("dataField") || options.dataField;
            options.isHide = element.attr("isHide") == "true" ? true : options.isHide;
            options.sourceId = element.attr("sourceId") || options.sourceId;
            options.aeType = element.attr("aeType");
            options.uiid = element.attr("uiid");
            var onAfterReload = element.attr("onAfterReload");
            options.onAfterReload = onAfterReload ? function(event) {
                if ($.isString(onAfterReload)) {
                    var i = onAfterReload.indexOf("(");
                    var actName = i > 0 ? onAfterReload.substring(0, i) : onAfterReload;
                    var func = "return window." + actName + "?" + actName + ".call(window,e):false;";
                    return new Function("e",func)(event);
                }
            }
             : "";
        },
        _reload: function(data, obj) {
            var options = this.options
              , $ele = this.element;
            var template = options.template;
            if (obj) {
                obj.html(template(data));
            } else {
                $ele.html(template(data));
            }
        },
        _getInitFunction: function(data, obj) {
            var $ele = this.element, options = this.options, initFuncs, aeTypes, initFuncArray = [];
            if (obj) {
                initFuncs = obj.find("[initFunction]");
                aeTypes = obj.find("*[aeType]");
            } else {
                initFuncs = $ele.find("[initFunction]");
                aeTypes = $ele.find("*[aeType]");
            }
            if (initFuncs && initFuncs.length) {
                $.each(initFuncs, function(index, item) {
                    var initFunction = $(item).attr("initFunction");
                    if (initFunction.length) {
                        var i = initFunction.indexOf("(");
                        funcName = i > 0 ? initFunction.substring(0, i) : initFunction;
                        if (funcName == "$" || funcName.indexOf(".") > 0) {
                            initFuncArray.push(initFunction);
                        } else {
                            var func = "return window." + funcName + "?" + funcName + ".call(window):false";
                            func = new Function(func)();
                            if (func == false) {
                                initFuncArray.push(initFunction);
                            }
                        }
                    }
                });
                if (initFuncArray.length > 0) {
                    var str = initFuncArray.join(";");
                    eval(str);
                }
            }
            if (aeTypes.length) {
                $.each(aeTypes, function(index, item) {
                    if ($(item).attr("initFunction")) {
                        return;
                    }
                    var aeInit = $(item).attr("aeInit");
                    if (aeInit && aeInit == "true") {
                        var initId = $(item).attr("id");
                        var aeType = $(item).attr("aeType");
                        var initStr = '$("#' + initId + '").' + aeType + "();";
                        var rdata = $.aries.common.getDataByDatafield(data, $(item).attr("dataField"));
                        var reloadStr = '$("#' + initId + '").' + aeType + "('reload'," + JSON.stringify(rdata) + ");";
                        eval(initStr);
                        eval(reloadStr);
                    }
                });
            }
        },
        reload: function(data, obj) {
            var options = this.options
              , $ele = this.element;
            if (data) {
                this._reload(data, obj);
                this._getInitFunction(data, obj);
                if (!options.isHide) {
                    $ele.removeClass("ae_tpl");
                    $ele.show();
                }
            }
            options.onAfterReload && this._trigger("onAfterReload");
        },
        getData: function(object) {
            var options = this.options
              , $ele = this.element
              , obj = {};
            var keyValueObj = $ele.find("*[dataField]");
            if (keyValueObj) {
                $.each(keyValueObj, function(index, item) {
                    var dataField = $(item).attr("dataField");
                    if ($(item).attr("value")) {
                        var value = $(item).attr("value");
                        obj = $.aries.common.buildUiidData(obj, dataField, value);
                    } else {
                        if ($(item).text()) {
                            var value = $(item).text();
                            obj = $.aries.common.buildUiidData(obj, dataField, value);
                        }
                    }
                });
            }
            if (object == undefined) {
                if (options.dataField) {
                    var objw = {};
                    obj = $.aries.common.buildUiidData(objw, options.dataField, obj);
                }
                return obj;
            } else {
                object = $.aries.common.buildUiidData(object, options.dataField, obj);
                return object;
            }
        }
    });
});
define("ui-tree", function(require, exports, moudles) {
    var b = {
        open: "open",
        closed: "closed",
        expandable: "expandable",
        expandableHitarea: "expandable-hitarea",
        lastExpandableHitarea: "lastExpandable-hitarea",
        collapsable: "collapsable",
        collapsableHitarea: "collapsable-hitarea",
        lastCollapsableHitarea: "lastCollapsable-hitarea",
        lastCollapsable: "lastCollapsable",
        lastExpandable: "lastExpandable",
        last: "last",
        hitarea: "hitarea",
        folderIco: "folder_ico"
    };
    var a = {
        nolinesMinus: "nolines_minus",
        nolinesPlus: "nolines_plus",
        join: "join",
        joinBottom: "join_bottom",
        plus: "plus",
        plusBottom: "plus_bottom",
        minus: "minus",
        minusBottom: "minus_bottom",
        minusTop: "minus_top",
        plusTop: "plus_top",
        black: "black",
        line: "line"
    };
    $.aeWidget("ae.aeTree", {
        _swapClass: function(f, e, d) {
            var c = f.filter("." + e);
            f.filter("." + d).removeClass(d).addClass(e);
            c.removeClass(e).addClass(d);
        },
        _getParentNode: function(d) {
            if (d) {
                var c = $(d).parent().parent();
                if (c && c.hasClass("om-tree-node")) {
                    return c;
                }
            }
            return null ;
        },
        _setParentCheckbox: function(e) {
            var h = this._getParentNode(e);
            if (h) {
                var g = h.find(">ul >li >div.tree-checkbox");
                var c = g.length;
                var i = g.filter(".checkbox_full").length;
                var d = g.filter(".checkbox_part").length;
                var f = h.find(">div.tree-checkbox");
                f.removeClass("checkbox_full checkbox_part");
                if (i == c) {
                    f.addClass("checkbox_full");
                } else {
                    if (i > 0 || d > 0) {
                        f.addClass("checkbox_part");
                    }
                }
                this._setParentCheckbox(h);
            }
        },
        _setChildCheckbox: function(d, c) {
            var e = d.find(">ul").find(".tree-checkbox");
            e.removeClass("checkbox_part checkbox_full");
            if (c) {
                e.addClass("checkbox_full");
            }
        },
        _applyEvents: function(i) {
            var m = this
              , n = m.options
              , k = n.onClick
              , f = n.onDblClick
              , l = n.onRightClick
              , h = n.onDrag
              , j = n.onSelect
              , e = n.onDrop
              , g = n.isAsync
              , d = n.dataSource
              , c = n.dataSource;
            i.find("span").unbind(".aeTree").bind("click.aeTree", function(q) {
                var p = m.element.data("nodes")[$(this).parent().attr("id")];
                if (!c && !$(this).hasClass("folder_ico")) {
                    $(this).addClass("selected");
                    var r = m.element.data("selected");
                    var o = $("#" + p["nid"]).attr("id");
                    if (r != "" && !(r == o)) {
                        $("#" + r + " >span").removeClass("selected");
                    }
                    m.element.data("selected", o);
                }
                k && m._trigger("onClick", q, p);
                m.selectNode(p);
                return false;
            }).bind("dblclick.aeTree", function(s) {
                var q = $(this).parent();
                var r = m.element.data("nodes")[q.attr("id")];
                var o = (typeof r.aeNodePId === "undefined");
                if (q.hasClass("hasChildren")) {
                    q.find("span.folder").removeClass("folder").addClass("placeholder");
                }
                if (q.find("ul").length > 0 && $(s.target, this)) {
                    m.toggler(q);
                }
                if (g && !o) {
                    var p = $.data(m.element, "cache");
                    if (!p) {
                        f && m._trigger("onDblClick", null , r);
                    } else {
                        if (!p[r.nid]) {
                            f && m._trigger("onDblClick", null , r);
                        }
                    }
                }
                q.find("span.placeholder").removeClass("placeholder").addClass("folder");
            }).bind("contextmenu.aeTree", function(p) {
                var o = m.element.data("nodes")[$(this).parent().attr("id")];
                l && m._trigger("onRightClick", p, o);
            }).bind("mouseover.aeTree mouseout.aeTree", function(o) {
                return false;
            });
            m._bindHitEvent(i);
            i.find("div.tree-checkbox").click(function(q) {
                var p = $(this).parent();
                var o = $("#" + p.attr("id")).find(">div.tree-checkbox").hasClass("checkbox_full");
                m._toggleCheck(p, o);
            });
            if (m.options.draggable) {}
            i.bind("mousedown", function(o) {
                o.stopPropagation();
            });
        },
        _bindHitEvent: function(d) {
            var c = this;
            d.find("span.folder_ico").click(function() {
                var e = $(this).parent();
                if (e.hasClass("hasChildren")) {
                    e.find("span.folder").removeClass("folder").addClass("placeholder");
                }
                c.toggler(e);
                e.find("span.placeholder").removeClass("placeholder").addClass("folder");
            });
        },
        options: {
            initExpandLevel: 0,
            lineHover: false,
            showIcon: true,
            showLine: true,
            showCheckbox: false,
            cascadeCheck: true,
            draggable: false,
            filter: null ,
            nodeCount: 0,
            isAsync: false,
            initType: "html"
        },
        _create: function() {
            var d = this.element
              , c = this.options;
            if (c.initType == "html") {
                this._buildOptions(c, d);
            }
            d.data("nodes", []).data("selected", "").data("init_dataSource", []).addClass("om-tree om-widget");
        },
        _buildOptions: function(c, d) {
            c.cascadeCheck = d.attr("cascadeCheck") == "false" ? false : c.cascadeCheck;
            c.draggable = d.attr("draggable") == "true" ? true : c.draggable;
            c.showCheckbox = d.attr("showCheckbox") == "true" ? true : c.showCheckbox;
            c.showIcon = d.attr("showIcon") == "false" ? false : c.showIcon;
            c.showLine = d.attr("showLine") == "false" ? false : c.showLine;
            c.isAsync = d.attr("isAsync") == "true" ? true : c.isAsync;
            c.idField = d.attr("idField");
            c.pIdField = d.attr("pIdField");
            c.labelField = d.attr("labelField");
            c.valueField = d.attr("valueField");
            c.sortField = d.attr("sortField");
            c.rootId = d.attr("rootId");
            this._buildOptionEvent(c, "onBeforeCollapse", d.attr("onBeforeCollapse"), true);
            this._buildOptionEvent(c, "onBeforeExpand", d.attr("onBeforeExpand"), true);
            this._buildOptionEvent(c, "onBeforeSelect", d.attr("onBeforeSelect"), true);
            this._buildOptionEvent(c, "onCheck", d.attr("onCheck"), true);
            this._buildOptionEvent(c, "onCollapse", d.attr("onCollapse"), true);
            this._buildOptionEvent(c, "onExpand", d.attr("onExpand"), true);
            this._buildOptionEvent(c, "onSelect", d.attr("onSelect"), true);
            this._buildOptionEvent(c, "onClick", d.attr("onClick"), false);
            this._buildOptionEvent(c, "onDblClick", d.attr("onDblClick"), false);
            this._buildOptionEvent(c, "onDrag", d.attr("onDrag"), false);
            this._buildOptionEvent(c, "onDrop", d.attr("onDrop"), false);
            this._buildOptionEvent(c, "onRightClick", d.attr("onRightClick"), false);
        },
        _buildOptionEvent: function(d, f, e, c) {
            if (c) {
                d[f] = e ? function(g) {
                    if ($.isString(e)) {
                        var j = e.indexOf("(");
                        var h = j > 0 ? e.substring(0, j) : e;
                        var k = "return window." + h + "?" + h + ".call(window,n):false;";
                        return new Function("n",k)(g);
                    }
                }
                 : d[f];
            } else {
                d[f] = e ? function(g, l) {
                    if ($.isString(e)) {
                        var j = e.indexOf("(");
                        var h = j > 0 ? e.substring(0, j) : e;
                        var k = "return window." + h + "?" + h + ".call(window,n,e):false;";
                        return new Function("n","e",k)(g, l);
                    }
                }
                 : d[f];
            }
        },
        updateNode: function(f) {
            var d = this
              , e = d.options;
            var c = f.find("li");
            d._applyEvents(c);
            if (e.control) {
                d._treeController(d, e.control);
            }
        },
        toggler: function(f) {
            var l = this
              , m = l.options
              , h = m.showLine;
            var c = f.attr("id");
            var d = l.findByNId(c);
            var e = f.hasClass(b.expandable);
            if (e) {
                var j = m.onBeforeExpand;
                if (j && false === l._trigger("onBeforeExpand", null , d)) {
                    return l;
                }
            } else {
                var g = m.onBeforeCollapse;
                if (g && false === l._trigger("onBeforeCollapse", null , d)) {
                    return l;
                }
            }
            l._swapClass(f, b.collapsable, b.expandable);
            l._swapClass(f, b.lastCollapsable, b.lastExpandable);
            f.find(">ul").each(function() {
                if (e) {
                    $(this).show();
                    var o = m.onExpand;
                    o && l._trigger("onExpand", null , d);
                } else {
                    $(this).hide();
                    var n = m.onCollapse;
                    n && l._trigger("onCollapse", null , d);
                }
            });
            var i = f.find(">span." + b.folderIco)
              , k = "";
            if (d) {
                k = (typeof d.aeNodePId === "undefined");
            }
            if (k) {
                h ? l._swapClass(i, a.minusTop, a.plusTop) : l._swapClass(i, a.nolinesMinus, a.nolinesPlus);
            } else {
                if (m.isAsync || d && d.aeChildren && d.aeChildren.length > 0) {
                    if (h) {
                        l._swapClass(i, a.plusBottom, a.minusBottom);
                        l._swapClass(i, a.plus, a.minus);
                    } else {
                        l._swapClass(i, a.nolinesPlus, a.nolinesMinus);
                    }
                }
            }
            if (h) {
                if (!f.hasClass(b.lastCollapsable) && !f.hasClass(b.lastExpandable) && !f.hasClass(b.last)) {
                    f.find(">ul >li").each(function() {
                        $(this).addClass(a.line);
                    });
                }
            }
        },
        _init: function() {
            var c = this
              , d = c.options
              , f = c.element
              , e = d.dataSource;
            f.empty();
        },
        reload: function(h, j) {
            if (!h) {
                return;
            }
            var d = this
              , e = this.options
              , i = d.element
              , g = e.isAsync;
            h = $.aries.common.buildTreeData(h, e);
            if (g) {
                if (j) {
                    var c = $.data(i, "cache") || {
                        ___keys: []
                    };
                    c[j] = h;
                    c.___keys.push(j);
                    $.data(i, "cache", c);
                    var f = d.findByNId(j);
                    d._appendNodesToAsync.apply(d, [f.nid, h, f]);
                } else {
                    d._appendNodesToAsync.apply(d, [i, h]);
                }
                d._initDataSource();
            } else {
                i.data("init_dataSource", h);
                d._appendNodes.apply(d, [i, h]);
            }
            d.updateNode(i);
        },
        _initDataSource: function() {
            var f = this.element
              , c = f.data("nodes")
              , e = [];
            if (c != null ) {
                for (key in c) {
                    if (key.indexOf("aeNodePId") < 0) {
                        if (c[key]["aeChildren"]) {
                            c[key]["aeChildren"] = null ;
                        }
                        e.push(c[key]);
                    }
                }
            }
            var d = $.aries.common.buildTreeData(e, this.options);
            f.data("init_dataSource", d);
        },
        checkNode: function(d) {
            var c = this.findNodeById(d);
            if (c) {
                this._toggleCheck($("#" + c.nid), false);
            }
        },
        uncheck: function(d) {
            var c = this.findNodeById(d);
            if (c) {
                this._toggleCheck($("#" + c.nid), true);
            }
        },
        _toggleCheck: function(h, f) {
            var g = h.find(">div.tree-checkbox")
              , c = this
              , d = c.options
              , e = d.onCheck;
            if (f) {
                g.removeClass("checkbox_part checkbox_full");
            } else {
                g.removeClass("checkbox_part").addClass("checkbox_full");
            }
            if (c.options.cascadeCheck) {
                c._setChildCheckbox(h, !f);
                c._setParentCheckbox(h);
            }
            e && c._trigger("onCheck", null , c.findByNId(h.attr("id")));
        },
        checkAll: function(c) {
            if (c) {
                this.element.find(".tree-checkbox").removeClass("checkbox_part").addClass("checkbox_full");
            } else {
                this.element.find(".tree-checkbox").removeClass("checkbox_part checkbox_full");
            }
        },
        isCheckNode: function(d) {
            var c = this.findNodeById(d);
            if (c) {
                return $("#" + c.nid).find(">div.tree-checkbox").hasClass("checkbox_full");
            }
        },
        getChecked: function(f) {
            var d = this
              , c = [];
            var e = f ? ".checkbox_full" : ":not(.checkbox_full)";
            this.element.find(".tree-checkbox").filter(e).each(function(h, g) {
                c.push(d.element.data("nodes")[$(this).parent().attr("id")]);
            });
            return c;
        },
        selectNode: function(c) {
            var j = this
              , k = this.options
              , i = k.onBeforeSelect
              , f = k.onSelect
              , e = j.findNodeById(c);
            if (e) {
                if (i && false === j._trigger("onBeforeSelect", null , e)) {
                    return j;
                }
                var d = $("#" + e.nid);
                $(" >span", d).addClass("selected");
                var g = j.element.data("selected");
                var h = d.attr("id");
                if (g != "" && !(g == h)) {
                    $("#" + g + " >span").removeClass("selected");
                }
                j.element.data("selected", h);
                f && j._trigger("onSelect", null , e);
            }
        },
        unselect: function(h) {
            var d = this
              , f = d.findNodeById(h);
            if (f) {
                var e = $("#" + f.nid);
                $(" >span", e).removeClass("selected");
                var g = d.element.data("selected");
                var c = e.attr("id");
                if (g == c) {
                    d.element.data("selected", "");
                }
            }
        },
        getSelected: function() {
            var c = this.element.data("selected");
            return c ? this.element.data("nodes")[c] : null ;
        },
        findNodesByAttr: function(h, k, g, e) {
            var d = [], c;
            var j = g ? g.aeChildren : this.element.data("init_dataSource");
            e = (e != false) ? true : e;
            if (j && (c = j.length) > 0) {
                for (var f = 0; f < c; f++) {
                    d = this._searchNode.apply(j[f], [h, k, this._searchNode, d, false, e]);
                }
            }
            return d.length > 0 ? d : null ;
        },
        findNodeByAttr: function(h, k, g, d) {
            var f, c, j = g ? g.aeChildren : this.element.data("init_dataSource");
            d = (d != false) ? true : d;
            if (j && (c = j.length) > 0) {
                for (var e = 0; 
                e < c; e++) {
                    f = this._searchNode.apply(j[e], [h, k, this._searchNode, [], true, d]);
                    if (f != null ) {
                        return f;
                    }
                }
            }
            return null ;
        },
        findNodeById: function(g) {
            var e, c, f = this.element.data("init_dataSource");
            if (f && (c = f.length) > 0) {
                for (var d = 0; d < c; d++) {
                    e = this._searchNode.apply(f[d], ["aeNodeId", g, this._searchNode, [], true, true]);
                    if (e != null ) {
                        return e;
                    }
                }
            }
            return null ;
        },
        findByNId: function(c) {
            return this.element.data("nodes")[c] || null ;
        },
        findNodesByFn: function(h, g, d) {
            var f, j = g ? g.aeChildren : this.element.data("init_dataSource");
            d = (d != false) ? true : d;
            var c = [];
            if (j && (len = j.length) > 0) {
                for (var e = 0; e < len; e++) {
                    if (h.call(j[e], j[e]) === true) {
                        c.push(j[e]);
                    }
                    if (d && j[e].aeChildren) {
                        f = this.findNodesByFn(h, j[e], d);
                        if (f) {
                            c = c.concat(f);
                        }
                    }
                }
            }
            return c.length > 0 ? c : null ;
        },
        findNodeByFn: function(h, g, d) {
            var f, j = g ? g.aeChildren : this.element.data("init_dataSource");
            d = (d != false) ? true : d;
            if (j && (c = j.length) > 0) {
                for (var e = 0, c = j.length; e < c; e++) {
                    if (h.call(j[e], j[e]) === true) {
                        return j[e];
                    }
                    if (d) {
                        f = this.findNodeByFn(h, j[e], d);
                        if (f != null ) {
                            return f;
                        }
                    }
                }
            }
            return null ;
        },
        findNodesByText: function(j, g, e) {
            var d = [], c;
            var h = g ? g.aeChildren : this.element.data("init_dataSource");
            e = (e != false) ? true : e;
            if (h && (c = h.length) > 0) {
                for (var f = 0; f < c; f++) {
                    d = this._searchNode.apply(h[f], ["aeNodeLabel", j, this._searchNode, d, false, e]);
                }
            }
            return d.length > 0 ? d : null ;
        },
        _searchNode: function(h, k, f, c, j, d) {
            if (j) {
                if (this[h] == k) {
                    return this;
                }
                if (this.aeChildren && this.aeChildren.length && d) {
                    for (var g in this.aeChildren) {
                        var e = f.apply(this.aeChildren[g], [h, k, f, [], true, d]);
                        if (e) {
                            return e;
                        }
                    }
                }
            } else {
                if (this[h] == k) {
                    c.push(this);
                }
                if (this.aeChildren && this.aeChildren.length && d) {
                    $.each(this.aeChildren, f, [h, k, f, c, false, d]);
                }
                return c;
            }
        },
        getParent: function(e) {
            var d = this.findNodeById(e);
            if (d) {
                var c = this.element.data("nodes")["aeNodePId" + d.nid];
                return c ? this.findByNId(c) : null ;
            }
        },
        getChildren: function(d) {
            var c = this.findNodeById(d);
            if (c) {
                return c.aeChildren;
            }
        },
        setData: function(c) {
            this.options.dataSource = c;
        },
        expandNode: function(g) {
            var f = this.findNodeById(g);
            if (f && f.nid) {
                var d = b.expandable
                  , e = $("#" + f.nid);
                var c = $(">span." + b.folderIco, e).filter(function() {
                    return d ? $(this).parent("." + d).length : true;
                }).parent().parentsUntil(this.element).andSelf().filter(function() {
                    return $(this).filter("li").hasClass(d);
                });
                this.toggler(c);
            }
        },
        collapseNode: function(d) {
            var c = this.findNodeById(d);
            if (c && c.nid) {
                this._collapseHandler(b.collapsable, $("#" + c.nid));
            }
        },
        expandAll: function() {
            this._collapseHandler(b.expandable, this.element, true);
        },
        collapseAll: function() {
            this._collapseHandler(b.collapsable, this.element, true);
        },
        _collapseHandler: function(e, g, d) {
            var c = this;
            var h = (d ? "" : ">") + "span." + b.folderIco;
            var f = $(h, g).filter(function() {
                return e ? $(this).parent("." + e).length : true;
            }).parent();
            f.each(function(i, j) {
                c.toggler($(j));
            });
        },
        refresh: function(g, h) {
            var f = this
              , d = f.element;
            if (!h) {
                d.empty();
                f.reload(g);
            } else {
                var c = $("#" + h.nid).next();
                var e = d.data("nodes")["aeNodePId" + h.nid];
                f.remove(h);
                f.insert(h, f.findByNId(e), f.findByNId(c.attr("id")));
            }
        },
        _appendNodes: function(w, n, e, f) {
            var j = this
              , u = []
              , g = j.options.showCheckbox
              , v = j.options.showLine;
            var c = j.element.attr("id") ? j.element.attr("id") : ("treeId" + parseInt(Math.random() * 1000));
            j.element.attr("id", c);
            for (var r = 0, p = n.length; r < p; r++) {
                var o = n[r]
                  , k = (r == (n.length - 1))
                  , m = (typeof o.aeNodePId === "undefined");
                var x = "om-tree-node " + (g ? "treenode-checkable " : "") + (o.hasChildren ? "hasChildren " : "");
                var h = c + "_" + (++j.options.nodeCount);
                o.nid = h;
                var d = j.element.data("nodes");
                d[o.nid] = o;
                if (typeof w == "string") {
                    d["aeNodePId" + o.nid] = w;
                    if (k) {
                        w = null ;
                    }
                } else {
                    d["aeNodePId" + o.nid] = w.parent("li").attr("id");
                }
                var t = [];
                if (o.aeChildren && o.aeChildren.length > 0) {
                    t.push((j._appendNodes(o.nid, o.aeChildren)).join(""));
                }
                var s = 0;
                if (o.aeChildren && (s = o.aeChildren.length) > 0 || o.hasChildren) {
                    if (o.expanded) {
                        x = x + "open " + b.collapsable + " " + (k ? b.lastCollapsable : "");
                    } else {
                        x = x + b.expandable + " " + (k ? b.lastExpandable : "");
                    }
                } else {
                    x = x + (k ? b.last : "");
                }
                u.push("<li id='", o.nid, "' class='", x, "'>");
                if (o.hasChildren || s > 0) {
                    if (o.expanded) {
                        if (m) {
                            v ? u.push("<span class='folder_ico " + a.minusTop + "'/>") : u.push("<span class='folder_ico " + a.nolinesMinus + "'/>");
                        } else {
                            if (v) {
                                k ? u.push("<span class='folder_ico " + a.minusBottom + "'/>") : u.push("<span class='folder_ico " + a.minus + "'/>");
                            } else {
                                u.push("<span class='folder_ico " + a.nolinesMinus + "'/>");
                            }
                        }
                    } else {
                        if (m) {
                            v ? u.push("<span class='folder_ico " + a.plusTop + "'/>") : u.push("<span class='folder_ico " + a.nolinesPlus + "'/>");
                        } else {
                            if (v) {
                                k ? u.push("<span class='folder_ico " + a.plusBottom + "'/>") : u.push("<span class='folder_ico " + a.plus + "'/>");
                            } else {
                                u.push("<span class='folder_ico " + a.nolinesPlus + "'/>");
                            }
                        }
                    }
                } else {
                    if (v) {
                        k ? u.push("<span class='folder_ico " + a.joinBottom + "'/>") : u.push("<span class='folder_ico " + a.join + "'/>");
                    } else {
                        u.push("<span class='folder_ico " + a.black + "'/>");
                    }
                }
                if (g) {
                    u.push("<div class='tree-checkbox'/>");
                }
                var q = (o.classes ? o.classes : "");
                if (j.options.showIcon) {
                    if (o.hasChildren || o.aeChildren && o.aeChildren.length > 0) {
                        q = q + " folder ";
                    } else {
                        q = q + " file ";
                    }
                }
                u.push("<span class='", q, "'>", "<a title='" + o.aeNodeLabel + "'>", o.aeNodeLabel, "</a></span>");
                if (o.hasChildren || s > 0) {
                    u.push("<ul", " style='display:", (o.expanded ? "block" : "none"), "'>");
                    u.push(t.join(""));
                    u.push("</ul>");
                }
                u.push("</li>");
            }
            if (e) {
                if (f) {
                    $("#" + e.nid).after(u.join(""));
                } else {
                    $("#" + e.nid).before(u.join(""));
                }
            } else {
                if (w) {
                    w.append(u.join(""));
                }
            }
            return u;
        },
        _appendNodesToAsync: function(y, n, c) {
            var k = this
              , v = []
              , f = k.options.showCheckbox
              , x = k.options.showLine;
            var d = k.element.attr("id") ? k.element.attr("id") : ("treeId" + parseInt(Math.random() * 1000));
            k.element.attr("id", d);
            for (var t = 0, q = n.length; t < q; t++) {
                var p = n[t]
                  , m = (t == (n.length - 1));
                var z = "om-tree-node " + (f ? "treenode-checkable " : "") + (p.hasChildren ? "hasChildren " : "");
                var g = d + "_" + (++k.options.nodeCount);
                p.nid = g;
                var e = k.element.data("nodes");
                e[p.nid] = p;
                if (typeof y == "string") {
                    e["aeNodePId" + p.nid] = y;
                    if (m) {
                        y = null ;
                    }
                } else {
                    e["aeNodePId" + p.nid] = y.parent("li").attr("id");
                }
                var w = [];
                if (p.aeChildren && p.aeChildren.length > 0) {
                    w.push((k._appendNodesToAsync(p.nid, p.aeChildren)).join(""));
                }
                var u = 0;
                if (p.aeChildren && (u = p.aeChildren.length) > 0 || p.hasChildren) {
                    if (p.expanded) {
                        z = z + "open " + b.collapsable + " " + (m ? b.lastCollapsable : "");
                    } else {
                        z = z + b.expandable + " " + (m ? b.lastExpandable : "");
                    }
                } else {
                    z = z + (m ? b.last : "");
                }
                v.push("<li id='", p.nid, "' class='", z, "'>");
                if (p.hasChildren || u > 0) {
                    if (p.expanded) {
                        x ? v.push("<span class='folder_ico " + a.minusTop + "'/>") : v.push("<span class='folder_ico " + a.nolinesMinus + "'/>");
                    } else {
                        x ? v.push("<span class='folder_ico " + a.plusTop + "'/>") : v.push("<span class='folder_ico " + a.nolinesPlus + "'/>");
                    }
                } else {
                    if (x) {
                        m ? v.push("<span class='folder_ico " + a.joinBottom + "'/>") : v.push("<span class='folder_ico " + a.join + "'/>");
                    } else {
                        v.push("<span class='folder_ico " + a.black + "'/>");
                    }
                }
                if (f) {
                    v.push("<div class='tree-checkbox'/>");
                }
                var s = (p.classes ? p.classes : "");
                if (k.options.showIcon) {
                    if (p.hasChildren || p.aeChildren && p.aeChildren.length > 0) {
                        s = s + " folder ";
                    } else {
                        s = s + " file ";
                    }
                }
                v.push("<span class='", s, "'>", "<a title='" + p.aeNodeLabel + "'>", p.aeNodeLabel, "</a></span>");
                if (p.hasChildren || u > 0) {
                    v.push("<ul", " style='display:", (p.expanded ? "block" : "none"), "'>");
                    v.push(w.join(""));
                    v.push("</ul>");
                }
                v.push("</li>");
            }
            if (n.length > 0 && c) {
                var h = $("#" + c.nid)
                  , o = [];
                h.find("ul").remove();
                o.push("<ul", " style='display:block'>");
                o.push(v.join(""));
                o.push("</ul>");
                h.append(o.join(""));
                var j = h.find(">ul >li")
                  , r = h.find(">span." + b.folderIco);
                if (j.length > 0) {
                    h.find(">span.file").removeClass("file").addClass("folder");
                    if (x && !h.hasClass(b.last)) {
                        j.each(function() {
                            $(this).addClass(a.line);
                        });
                    }
                }
                h.addClass(b.collapsable);
                k._swapClass(r, a.join, a.minus);
                k._swapClass(r, a.joinBottom, a.minusBottom);
                k._swapClass(r, a.black, a.nolinesMinus);
            } else {
                if ($.isObject(y)) {
                    y.append(v.join(""));
                }
            }
            return v;
        },
        remove: function(j, l) {
            var k, m = this, f = l ? l.aeChildren : m.element.data("init_dataSource");
            for (var g in f) {
                if (f[g] == j) {
                    var c = [];
                    c = m._findChildrenId(j, c);
                    c.push(j.nid);
                    for (var d = 0, h = c.length; d < h; d++) {
                        delete m.element.data("nodes")[c[d]];
                        delete m.element.data("nodes")["aeNodePId" + c[d]];
                    }
                    if (j.nid == m.element.data("selected")) {
                        this.element.data("selected", null );
                    }
                    var e = $("#" + j.nid).prev();
                    if ($("#" + j.nid).next().length < 1 && e.length > 0) {
                        if (e.hasClass(b.collapsable)) {
                            e.addClass(b.lastCollapsable);
                            e.find("div.hitarea").first().addClass(b.lastCollapsableHitarea);
                        } else {
                            if (e.hasClass(b.expandable)) {
                                e.addClass(b.lastExpandable);
                                e.find("div.hitarea").first().addClass(b.lastExpandableHitarea);
                            } else {
                                e.addClass(b.last);
                            }
                        }
                    }
                    $("#" + j.nid).remove();
                    f.splice(g, 1);
                    if (l && l.nid && f.length < 1) {
                        m._changeToFolderOrFile(l, false);
                    }
                    return true;
                } else {
                    if (f[g].aeChildren) {
                        k = m.remove(j, f[g]);
                        if (k) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        _findChildrenId: function(g, f) {
            if (g.children) {
                for (var e = 0, d = g.aeChildren, c = d.length; e < c; e++) {
                    f.push(d[e].nid);
                    if (d[e].aeChildren) {
                        this._findChildrenId(d[e], f);
                    }
                }
            }
            return f;
        },
        insert: function(j, o, c, l) {
            if (!j) {
                return;
            }
            var p = this, d = [], n, h, k = $.isArray(j);
            if (k) {
                d = j;
            } else {
                d.push(j);
            }
            if (c) {
                o = o || p.findByNId(p.element.data("nodes")["aeNodePId" + c.nid]);
            }
            var i, g = o ? o.aeChildren : p.element.data("init_dataSource");
            if (o && (!o.aeChildren || o.aeChildren.length < 1)) {
                if (!o.hasChildren) {
                    p._changeToFolderOrFile(o, true);
                    p._bindHitEvent($("#" + o.nid));
                }
                g = o.aeChildren = [];
            }
            n = o ? $("#" + o.nid).children("ul").first() : p.element;
            h = n.find("li");
            if (c && ((i = $.inArray(c, g)) >= 0)) {
                p._appendNodes(n, d, c, l);
                g.splice(i, 0, j);
            } else {
                p._appendNodes(n, d, c, l);
                if (k) {
                    $.merge(g, j);
                } else {
                    g.push(j);
                }
            }
            var f = n.find("li").filter("." + b.last + ",." + b.lastCollapsable + ",." + b.lastExpandable).not(n.find("li").filter(":last-child:not(ul)"));
            f.removeClass(b.last + " " + b.lastCollapsable + " " + b.lastExpandable);
            f.find(" >div").removeClass(b.lastCollapsableHitarea + " " + b.lastExpandableHitarea);
            var e = n.find("li").not(h);
            p._applyEvents(e);
        },
        _changeToFolderOrFile: function(g, h) {
            var f = $("#" + g.nid)
              , d = this;
            if (h) {
                var e = $("<ul/>").css("display", "block").appendTo(f);
                f.addClass("open " + b.collapsable);
                d._swapClass(f, b.last, b.lastCollapsable);
                g.aeChildren = [];
            } else {
                f.find("ul").remove();
                f.find("div." + b.hitarea).remove();
                f.filter("." + b.lastCollapsable + ",." + b.lastExpandable).removeClass(b.lastCollapsable + " " + b.lastExpandable).addClass(b.last);
                f.removeClass("open " + b.collapsable + " " + b.expandable);
            }
            if (d.options.showIcon) {
                d._swapClass(f.children("span"), "file", "folder");
            }
            var c = f.filter(":has(>ul)").prepend('<div class="' + b.hitarea + '"/>').find("div." + b.hitarea);
            c.each(function() {
                var i = "";
                $.each($(this).parent().attr("class").split(" "), function() {
                    i += this + "-hitarea ";
                });
                $(this).addClass(i);
            });
        },
        modify: function(h, f, e) {
            if (h && f) {
                var d = this, c = $("#" + h.nid).next(), g;
                e = e || this.findByNId(d.element.data("nodes")["aeNodePId" + h.nid]);
                if (c.is("ul") || c.is("li")) {
                    g = d.findByNId(c.attr("id"));
                }
                d.remove(h, e);
                d.insert(f, e, g);
            }
        },
        disable: function() {},
        enable: function() {}
    });
});
define("ui-validate", function(require, exports, moudles) {
    $.extend($.fn, {
        validate: function(a) {
            if (!this.length) {
                a && a.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
                return;
            }
            var b = $.data(this, "validator");
            if (b) {
                return b;
            }
            b = new $.validator(a,this);
            $.data(this, "validator", b);
            if (b.form()) {
                return true;
            } else {
                b.focusInvalid();
                return false;
            }
        }
    });
    $.validator = function(a, b) {
        this.settings = $.extend(true, {}, $.validator.defaults, a);
        this.currentForm = b.find("input[datafield],textarea[datafield]");
        this.init();
    }
    ;
    $.validator.format = function(a, b) {
        if (arguments.length == 1) {
            return function() {
                var c = $.makeArray(arguments);
                c.unshift(a);
                return $.validator.format.apply(this, c);
            }
            ;
        }
        if (arguments.length > 2 && b.constructor != Array) {
            b = $.makeArray(arguments).slice(1);
        }
        if (b.constructor != Array) {
            b = [b];
        }
        $.each(b, function(c, d) {
            a = a.replace(new RegExp("\\{" + c + "\\}","g"), d);
        });
        return a;
    }
    ;
    $.extend($.validator, {
        defaults: {
            messages: {},
            rules: {},
            focusInvalid: true,
            onfocusin: function(c) {
                this.lastActive = c;
                var b = $(document.body).find("div.c_toolTip");
                if (!this.checkable(c) && (c.attr("dataField") in this.submitted || !this.optional(c))) {
                    c = this.clean(c);
                    this.lastElement = c;
                    this.prepareElement(c);
                    this.currentElements = $(c);
                    var a = this.check(c);
                    if (a) {
                        delete this.invalid[$(c).attr("dataField")];
                    } else {
                        this.invalid[$(c).attr("dataField")] = true;
                    }
                    if (!this.numberOfInvalids()) {
                        this.toHide = this.toHide.add(this.containers);
                    }
                    if (this.errorList.length > 0) {
                        b.show().find("div.c_toolTipContent").html(this.errorList[0].message);
                        var e = $(c).parent()
                          , d = e.offset();
                        b.css({
                            "left": d.left,
                            "top": d.top + e.outerHeight(),
                            "width": e.parent().outerWidth()
                        });
                    }
                } else {
                    if (b.length > 0) {
                        b.hide();
                    }
                }
            },
            onfocusout: function(a) {
                if (this.settings.validateOnEmpty) {
                    if (!this.checkable(a) || (a.name in this.submitted)) {
                        this.element(a);
                    }
                } else {
                    if (!this.checkable(a) && (a.attr("dataField") in this.submitted || !this.optional(a))) {
                        this.element(a);
                    }
                }
            },
            onkeyup: function(a) {
                if (a.attr("dataField") in this.submitted || this.clean(a) == this.lastElement) {
                    this.element(a);
                }
            }
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        prototype: {
            init: function() {
                this.submitted = {};
                this.invalid = {};
                var c = this.settings.rules;
                $.each(c, function(d, e) {
                    c[d] = $.validator.normalizeRule(e);
                });
                var a = this;
                function b(e) {
                    var d = "on" + e.type.replace(/^validate/, "");
                    (a.settings)[d] && (a.settings)[d].call(a, this);
                }
                this.currentForm.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", b).validateDelegate(":radio, :checkbox, select, option", "click", b);
            },
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                this.showErrors();
                return this.valid();
            },
            element: function(b) {
                b = this.clean(b);
                this.lastElement = b;
                this.prepareElement(b);
                this.currentElements = $(b);
                var a = this.check(b);
                if (a) {
                    delete this.invalid[b.name];
                } else {
                    this.invalid[b.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return a;
            },
            showErrors: function(c) {
                if (c) {
                    $.extend(this.errorMap, c);
                    this.errorList = [];
                    for (var a in c) {
                        this.errorList.push({
                            message: c[a],
                            element: this.findByName(a)[0]
                        });
                    }
                    this.successList = $.grep(this.successList, function(d) {
                        return !(d.name in c);
                    });
                }
                if (this.errorList && this.errorList.length > 0) {
                    this.defaultShowErrors();
                    $.each(this.errorList, function(d, f) {
                        var e = $(f.element);
                        e.parents(".e_elements").removeClass("e_elements-success e_elements_focus").addClass("e_elements-error e_elements_focus-error");
                    });
                } else {
                    var b = $(this.currentElements);
                    $.each(b, function(e, f) {
                        if ($(f).attr("require")) {
                            $(f).parents(".e_elements").removeClass("e_elements-error e_elements_focus-error").addClass("e_elements-success e_elements_focus");
                            var d = $(document.body).find("div.c_toolTip");
                            if (d.length > 0) {
                                d.hide();
                            }
                        }
                    });
                }
            },
            defaultShowErrors: function() {
                var a = [];
                a.push('<div class="c_toolTip">');
                a.push('  <div class="c_toolTipTop"><div></div></div>');
                a.push('  <div class="c_toolTipContent">');
                a.push("  </div>");
                a.push('  <div class="c_toolTipBottom"><div></div></div>');
                a.push('  <div class="c_toolTipPointer"></div>');
                a.push("</div>");
                $(a.join("")).css({
                    position: "absolute",
                    zIndex: 1999
                }).appendTo($(document.body)).hide();
            },
            checkForm: function() {
                this.prepareForm();
                for (var a = 0, b = (this.currentElements = this.currentForm); b[a]; a++) {
                    this.check(b[a]);
                }
                return this.valid();
            },
            clean: function(a) {
                return $(a)[0];
            },
            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },
            prepareForm: function() {
                this.reset();
            },
            prepareElement: function(a) {
                this.reset();
            },
            check: function(b) {
                var g = "";
                if (this.settings.rules) {
                    g = (this.settings.rules)[$(b).attr("dataField")];
                }
                var c = false;
                for (var h in g) {
                    var f = {
                        method: h,
                        parameters: g[h]
                    };
                    try {
                        var a = $.validator.methods[h].call(this, b.value.replace(/\r/g, ""), b, f.parameters);
                        if (a == "dependency-mismatch") {
                            c = true;
                            continue;
                        }
                        c = false;
                        if (a == "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(b));
                            return;
                        }
                        if (!a) {
                            this.formatAndAdd(b, f);
                            return false;
                        }
                    } catch (d) {
                        this.settings.debug && window.console && console.log("exception occured when checking element " + b.id + ", check the '" + f.method + "' method", d);
                        throw d;
                    }
                }
                if (c) {
                    return;
                }
                if (this.objectLength(g)) {
                    this.successList.push(b);
                }
                return true;
            },
            customMetaMessage: function(a, c) {
                if (!$.metadata) {
                    return;
                }
                var b = this.settings.meta ? $(a).metadata()[this.settings.meta] : $(a).metadata();
                return b && b.messages && b.messages[c];
            },
            customMessage: function(b, c) {
                var a = this.settings.messages[b];
                return a && (a.constructor == String ? a : a[c]);
            },
            findDefined: function() {
                for (var a = 0; a < arguments.length; a++) {
                    if (arguments[a] !== undefined) {
                        return arguments[a];
                    }
                }
                return undefined;
            },
            defaultMessage: function(a, b) {
                return this.findDefined(this.customMessage($(a).attr("dataField"), b), this.customMetaMessage(a, b), !this.settings.ignoreTitle && a.title || undefined, $.validator.messages[b], "<strong>Warning: No message defined for " + $(a).attr("dataField") + "</strong>");
            },
            formatAndAdd: function(b, d) {
                var c = this.defaultMessage(b, d.method)
                  , a = /\$?\{(\d+)\}/g;
                if (typeof c == "function") {
                    c = c.call(this, d.parameters, b);
                } else {
                    if (a.test(c)) {
                        c = jQuery.format(c.replace(a, "{$1}"), d.parameters);
                    }
                }
                this.errorList.push({
                    message: c,
                    element: b
                });
                this.errorMap[$(b).attr("dataField")] = c;
                this.submitted[$(b).attr("dataField")] = c;
            },
            checkable: function(a) {
                return /radio|checkbox/i.test(a.type);
            },
            getLength: function(b, a) {
                switch (a.nodeName.toLowerCase()) {
                case "select":
                    return $("option:selected", a).length;
                case "input":
                    if (this.checkable(a)) {
                        return this.findByName(a.name).filter(":checked").length;
                    }
                }
                return b.length;
            },
            depend: function(b, a) {
                return this.dependTypes[typeof b] ? this.dependTypes[typeof b](b, a) : true;
            },
            dependTypes: {
                "boolean": function(b, a) {
                    return b;
                },
                "string": function(b, a) {
                    return !!$(b, a.form).length;
                },
                "function": function(b, a) {
                    return b(a);
                }
            },
            optional: function(a) {
                return !$.validator.methods.required.call(this, $.trim(a.value), a) && "dependency-mismatch";
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(c) {
                var b = 0;
                for (var a in c) {
                    b++;
                }
                return b;
            },
            valid: function() {
                return this.size() == 0;
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
                        var a = $(document.body).find("div.c_toolTip");
                        a.show().find("div.c_toolTipContent").html(this.errorList[0].message);
                        var c = $(this.errorList[0].element).parent()
                          , b = c.offset();
                        a.css({
                            "left": b.left,
                            "top": b.top + c.outerHeight(),
                            "width": c.parent().outerWidth()
                        });
                    } catch (d) {}
                }
            },
            findLastActive: function() {
                var a = this.lastActive;
                return a && $.grep(this.errorList, function(b) {
                    return b.element.name == a.name;
                }).length == 1 && a;
            }
        },
        normalizeRule: function(b) {
            if (typeof b == "string") {
                var a = {};
                $.each(b.split(/\s/), function() {
                    a[this] = true;
                });
                b = a;
            }
            return b;
        },
        methods: {
            required: function(b, a, d) {
                if (!this.depend(d, a)) {
                    return "dependency-mismatch";
                }
                switch (a.nodeName) {
                case "SELECT":
                    var c = $(a).val();
                    return c && c.length > 0;
                case "INPUT":
                    if (this.checkable(a)) {
                        return this.getLength(b, a) > 0;
                    }
                default:
                    return $.trim(b).length > 0;
                }
            },
            remote: function(e, b, f) {
                if (this.optional(b)) {
                    return "dependency-mismatch";
                }
                var c = this.previousValue(b);
                if (!this.settings.messages[b.name]) {
                    this.settings.messages[b.name] = {};
                }
                c.originalMessage = this.settings.messages[b.name].remote;
                this.settings.messages[b.name].remote = c.message;
                f = typeof f == "string" && {
                    url: f
                } || f;
                if (this.pending[b.name]) {
                    return "pending";
                }
                if (c.old === e) {
                    return c.valid;
                }
                c.old = e;
                var a = this;
                this.startRequest(b);
                var d = {};
                d[b.name] = e;
                $.ajax($.extend(true, {
                    url: f,
                    mode: "abort",
                    port: "validate" + b.name,
                    dataType: "json",
                    data: d,
                    success: function(h) {
                        a.settings.messages[b.name].remote = c.originalMessage;
                        var j = h === true;
                        if (j) {
                            var g = a.formSubmitted;
                            a.prepareElement(b);
                            a.formSubmitted = g;
                            a.successList.push(b);
                            a.showErrors();
                        } else {
                            var k = {};
                            var i = h || a.defaultMessage(b, "remote");
                            k[b.name] = c.message = $.isFunction(i) ? i(e) : i;
                            a.showErrors(k);
                        }
                        c.valid = j;
                        a.stopRequest(b, j);
                    }
                }, f));
                return "pending";
            },
            minlength: function(b, a, c) {
                return this.optional(a) || this.getLength($.trim(b), a) >= c;
            },
            maxlength: function(b, a, c) {
                return this.optional(a) || this.getLength($.trim(b), a) <= c;
            },
            rangelength: function(c, a, d) {
                var b = this.getLength($.trim(c), a);
                return this.optional(a) || (b >= d[0] && b <= d[1]);
            },
            min: function(b, a, c) {
                return this.optional(a) || b >= c;
            },
            max: function(b, a, c) {
                return this.optional(a) || b <= c;
            },
            range: function(b, a, c) {
                return this.optional(a) || (b >= c[0] && b <= c[1]);
            },
            email: function(b, a) {
                return this.optional(a) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(b);
            },
            url: function(b, a) {
                return this.optional(a) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(b);
            },
            date: function(b, a) {
                return this.optional(a) || !/Invalid|NaN/.test(new Date(Date.parse(b.replace(/-/g, "/"))));
            },
            number: function(b, a) {
                return this.optional(a) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(b);
            },
            digits: function(b, a) {
                return this.optional(a) || /^\d+$/.test(b);
            },
            accept: function(b, a, c) {
                c = typeof c == "string" ? c.replace(/,/g, "|") : "png|jpe?g|gif";
                return this.optional(a) || b.match(new RegExp(".(" + c + ")$","i"));
            },
            equalTo: function(b, a, d) {
                var c = $(d).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    $(a).valid();
                });
                return b == c.val();
            }
        }
    });
});
(function(a) {
    a.extend(a.fn, {
        validateDelegate: function(d, c, b) {
            return this.bind(c, function(e) {
                var f = a(e.target);
                if (f.is(d)) {
                    return b.apply(f, arguments);
                }
            });
        }
    });
})(jQuery);
