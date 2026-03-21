(() => {
    var e, t, n, r, a, o, i, c = {
        86123: (e, t, n) => {
            "use strict";
            n.d(t, {J: () => By});
            n(81274), n(79185), n(48089), n(5125), n(74144), n(86748), n(56934), n(78056), n(5718), n(18285);
            var r = n(861), a = n.n(r),
                o = (n(25680), n(65539), n(93803), n(57123), n(30470), n(35082), n(85905), n(85325), n(47638), n(7258), n(23233), n(61117), n(37874), n(17201), n(73893), n(22544), n(97497), n(94906), n(55387), n(28915), n(76852), n(73807), n(59489), n(97731), n(68556), n(83513), n(8649), n(61250), n(31483), n(47963), n(24677), n(18033), n(50997), n(43456), n(92898), n(10205), n(73232), n(98963), n(37412), n(53615), n(34151), n(35184), n(67294)),
                i = {
                    ArrowLeft: 37,
                    ArrowUp: 38,
                    ArrowRight: 39,
                    ArrowDown: 40,
                    Shift: 16,
                    Ctrl: 17,
                    Command: 91,
                    Space: 32,
                    Enter: 13,
                    Escape: 27,
                    Backspace: 8,
                    Delete: 46,
                    Plus: 187,
                    Minus: 189,
                    Num_0: 48,
                    Num_1: 49,
                    Num_2: 50,
                    Num_3: 51,
                    Num_4: 52,
                    Num_5: 53,
                    Num_6: 54,
                    Num_7: 55,
                    Num_8: 56,
                    Num_9: 57,
                    Numpad_0: 96,
                    Numpad_1: 97,
                    Numpad_2: 98,
                    Numpad_3: 99,
                    Numpad_4: 100,
                    Numpad_5: 101,
                    Numpad_6: 102,
                    Numpad_7: 103,
                    Numpad_8: 104,
                    Numpad_9: 105,
                    Char_A: 65,
                    Char_B: 66,
                    Char_C: 67,
                    Char_H: 72,
                    Char_L: 76,
                    Char_M: 77,
                    Char_R: 82,
                    Char_S: 83,
                    Char_T: 84,
                    Char_V: 86,
                    Char_Y: 89,
                    Char_Z: 90
                }, c = n(93497);

            function u() {
                c.ZP.captureException.apply(c.ZP, arguments)
            }

            function l(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return s(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return s(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function s(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            var p = function (e) {
                var t = e.renderFn, n = e.deps, r = void 0 === n ? [] : n;
                return (0, o.useMemo)((function () {
                    if (t) {
                        var e = t();
                        if (e) return e
                    }
                    return null
                }), r)
            };

            function f() {
                return {width: window.innerWidth, height: window.innerHeight}
            }

            function d(e) {
                return e.ctrlKey || e.metaKey
            }

            function m(e) {
                return e.altKey
            }

            function v(e) {
                return e.shiftKey
            }

            function h() {
                return "ontouchstart" in document.documentElement
            }

            function g(e, t) {
                if ("function" != typeof e) return e;
                try {
                    return e()
                } catch (n) {
                    return t
                }
            }

            y = new Set, A = !1, b = function () {
                A = !1;
                var e = a()(y);
                y.clear();
                var t, n = l(e);
                try {
                    for (n.s(); !(t = n.n()).done;) (0, t.value)()
                } catch (r) {
                    n.e(r)
                } finally {
                    n.f()
                }
            }, E = Promise.resolve();
            var y, A, b, E, C = function () {
                var e = new Set, t = !1, n = function () {
                    t = !1;
                    var n = a()(e);
                    e.clear();
                    var r, o = l(n);
                    try {
                        for (o.s(); !(r = o.n()).done;) {
                            (0, r.value)()
                        }
                    } catch (i) {
                        o.e(i)
                    } finally {
                        o.f()
                    }
                }, r = function () {
                    var e;
                    e = n, requestAnimationFrame((function () {
                        return requestAnimationFrame(e)
                    }))
                };
                return function (n) {
                    e.add(n), t || (t = !0, r())
                }
            }(), O = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2, n = t, r = !0;
                return function () {
                    if (r) return e.apply(void 0, arguments), void (r = !1);
                    (n -= 1) <= 0 && (n = t, e.apply(void 0, arguments))
                }
            }, w = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
                return String(e).padStart(t, "0")
            }, k = function (e, t, n) {
                return Math.min(Math.max(e, t), n)
            };
            var x = function () {
                    var e = Array.from(crypto.getRandomValues(new Uint32Array(10))).map((function (e) {
                        return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[e % 62]
                    })).join("");
                    return /^[0-9]*$/.test(e[0]) ? "a".concat(e.slice(1)) : e
                }, S = function (e) {
                    return e && "function" == typeof e.then
                }, T = function () {
                    var e = localStorage.getItem("setting-color");
                    return {
                        isSystem: "0" === localStorage.getItem("setting-mode"),
                        isDark: "2" === localStorage.getItem("setting-mode"),
                        lineColor1: "var(--line-".concat(Number(e) + 1, "-color-1)"),
                        lineColor2: "var(--line-".concat(Number(e) + 1, "-color-2)"),
                        isEdgeArrow: "1" === localStorage.getItem("setting-arrow"),
                        isLine90: "0" === localStorage.getItem("setting-line"),
                        isLine90Radius: "1" === localStorage.getItem("setting-line")
                    }
                }, D = n(20745), P = n(27484), R = n.n(P), B = (n(33852), n(27424)), I = n.n(B), j = (n(76010), n(42238)),
                N = n.n(j), L = n(55853), Q = n(95187), M = (n(32564), n(84842), n(45697)), Z = n.n(M),
                V = (n(96007), n(85495), n(64599), n(17733), n(38416)), H = n.n(V), F = n(56690), G = n.n(F),
                Y = n(89728), z = n.n(Y),
                U = (n(64898), n(7699), n(41509), n(40368), n(962), n(46564), n(86602), n(96486)), q = n.n(U),
                X = n(41588), K = n.n(X), W = n(61655), J = n.n(W), _ = n(94993), $ = n.n(_), ee = n(73808),
                te = n.n(ee), ne = (n(33864), n(95143), "device"), re = "time", ae = "flow", oe = "logic", ie = "other",
                ce = "var",
                ue = H()(H()(H()(H()(H()(H()({}, ne, "设备"), re, "时间"), ae, "流程"), oe, "逻辑"), ie, "其他"), ce, "变量"),
                le = "error", se = "success", pe = 400, fe = 150, de = {
                    action: "action",
                    event: "event",
                    propertyGet: "propertyGet",
                    propertySet: "propertySet",
                    propertyNotify: "propertyNotify",
                    property: "property"
                }, me = {
                    int: "int",
                    float: "float",
                    string: "string",
                    boolean: "boolean",
                    valueRange: "valueRange",
                    valueList: "valueList"
                }, ve = 60, he = 16, ge = 14, ye = 8, Ae = 20, be = 14, Ee = 120, Ce = 240, Oe = 470, we = 52, ke = 32,
                xe = 40, Se = 20, Te = 30, De = 10, Pe = 20, Re = 170, Be = 4,
                Ie = {getLeft: 48, getRight: 76, include: 288}, je = {
                    equal: "=",
                    unEqual: "!=",
                    moreEqual: ">=",
                    lessEqual: "<=",
                    more: ">",
                    less: "<",
                    between: "between",
                    include: "include"
                }, Ne = {
                    equal: "等于",
                    unEqual: "不等于",
                    moreEqual: "大于等于",
                    lessEqual: "小于等于",
                    more: "大于",
                    less: "小于",
                    between: "介于"
                }, Le = function () {
                    var e = {};
                    return Object.keys(je).forEach((function (t) {
                        Ne[t] && (e[je[t]] = Ne[t])
                    })), e
                }(), Qe = {input: "input", output: "output", event: "event", status: "status", both: "both", log: "log"},
                Me = "start", Ze = "move", Ve = "end", He = "reset", Fe = n(37815), Ge = n(90512), Ye = n(13012),
                ze = n.n(Ye), Ue = n(10434), qe = n.n(Ue), Xe = n(70215), Ke = n.n(Xe), We = (n(40854), n(16165)),
                Je = n(7934), _e = n(13293), $e = n(75297), et = n(85811), tt = n(15953), nt = n(4380), rt = n(34189),
                at = n(91258), ot = n(41176), it = n(70712), ct = n(72982), ut = n(31404), lt = n(47427), st = n(51612),
                pt = n(37340), ft = n(83804), dt = n(28432), mt = n(54306), vt = n(36926), ht = n(56273), gt = n(66877),
                yt = n(23995), At = n(39829), bt = n(16722), Et = n(56297), Ct = n(96933), Ot = n(41242), wt = n(56013),
                kt = n(9504), xt = n(22831), St = n(89533), Tt = n(18421), Dt = n(65335), Pt = n(61056), Rt = n(60646),
                Bt = n(44905), It = n(84757), jt = n(2568), Nt = n(58275), Lt = n(58498), Qt = n(41825), Mt = n(12048),
                Zt = n(50196), Vt = n(79161), Ht = n(81283), Ft = n(59575), Gt = n(3291), Yt = n(60763), zt = n(34424),
                Ut = n(83652), qt = n(30229), Xt = n(19908), Kt = ["style"], Wt = ["style"], Jt = ["style"],
                _t = ["style"], $t = ["style"], en = ["style"], tn = ["style"], nn = ["style"], rn = ["style"],
                an = ["style"], on = ["style"], cn = ["style"], un = ["style"], ln = ["style"], sn = ["style"],
                pn = ["style"], fn = ["style"], dn = ["style"], mn = ["style"], vn = ["style"], hn = ["style"],
                gn = ["style"], yn = ["style"], An = ["opacity", "style"], bn = ["opacity", "style"], En = ["style"],
                Cn = ["style"];

            function On(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function wn(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? On(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : On(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            const kn = {
                Success: function (e) {
                    var t = e.style, n = Ke()(e, Kt);
                    return o.createElement(We.Z, qe()({
                        component: tt.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Warning: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: nt.Z, className: "icon-square"}, t))
                }, Info: function (e) {
                    var t = e.style, n = Ke()(e, Wt);
                    return o.createElement(We.Z, qe()({
                        component: rt.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Error: function (e) {
                    var t = e.style, n = Ke()(e, Jt);
                    return o.createElement(We.Z, qe()({
                        component: at.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Loading: function (e) {
                    var t = e.style, n = Ke()(e, _t);
                    return o.createElement(We.Z, qe()({
                        component: ot.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, BakFile: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Je.Z, className: "icon-square"}, t))
                }, Close: function (e) {
                    var t = e.style, n = Ke()(e, $t);
                    return o.createElement(We.Z, qe()({
                        component: it.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Close2: function (e) {
                    var t = e.style, n = Ke()(e, en);
                    return o.createElement(We.Z, qe()({
                        component: ct.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Add: function (e) {
                    var t = e.style, n = Ke()(e, tn);
                    return o.createElement(We.Z, qe()({
                        component: ut.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Del: function (e) {
                    var t = e.style, n = Ke()(e, nn);
                    return o.createElement(We.Z, qe()({
                        component: lt.Z,
                        className: "icon-square",
                        style: wn({fontSize: 20}, t)
                    }, n))
                }, Down: function (e) {
                    var t = e.style, n = void 0 === t ? {} : t, r = Ke()(e, rn), a = n.fontSize,
                        i = void 0 === a ? 20 : a, c = n.color, u = void 0 === c ? "rgba(0,0,0,0.4)" : c;
                    return o.createElement(We.Z, qe()({}, r, {
                        component: st.Z,
                        className: "icon-grey",
                        style: {fontSize: i, color: u}
                    }))
                }, Down2: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({}, t, {component: pt.Z}))
                }, Down3: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({}, t, {component: ft.Z}))
                }, Right: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({}, t, {component: dt.Z}))
                }, Right2: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({}, t, {component: mt.Z}))
                }, RichTextBold: function (e) {
                    var t = e.style, n = Ke()(e, an);
                    return o.createElement(We.Z, qe()({component: gt.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextList: function (e) {
                    var t = e.style, n = Ke()(e, on);
                    return o.createElement(We.Z, qe()({component: vt.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextAlign: function (e) {
                    var t = e.style, n = Ke()(e, cn);
                    return o.createElement(We.Z, qe()({component: ht.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextAlignLeft: function (e) {
                    var t = e.style, n = Ke()(e, un);
                    return o.createElement(We.Z, qe()({component: yt.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextAlignMiddle: function (e) {
                    var t = e.style, n = Ke()(e, ln);
                    return o.createElement(We.Z, qe()({component: At.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextAlignRight: function (e) {
                    var t = e.style, n = Ke()(e, sn);
                    return o.createElement(We.Z, qe()({component: bt.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextH1: function (e) {
                    var t = e.style, n = Ke()(e, pn);
                    return o.createElement(We.Z, qe()({component: Et.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextH2: function (e) {
                    var t = e.style, n = Ke()(e, fn);
                    return o.createElement(We.Z, qe()({component: Ct.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextH3: function (e) {
                    var t = e.style, n = Ke()(e, dn);
                    return o.createElement(We.Z, qe()({component: Ot.Z, style: wn({fontSize: 20}, t)}, n))
                }, RichTextT: function (e) {
                    var t = e.style, n = Ke()(e, mn);
                    return o.createElement(We.Z, qe()({component: wt.Z, style: wn({fontSize: 20}, t)}, n))
                }, ToolBarText: function (e) {
                    var t = e.style, n = Ke()(e, vn);
                    return o.createElement(We.Z, qe()({component: kt.Z, style: wn({}, t)}, n))
                }, ToolBarLog: function (e) {
                    var t = e.style, n = Ke()(e, hn);
                    return o.createElement(We.Z, qe()({component: xt.Z, style: wn({}, t)}, n))
                }, ToolBarInfo: function (e) {
                    var t = e.style, n = Ke()(e, gn);
                    return o.createElement(We.Z, qe()({component: St.Z, style: wn({}, t)}, n))
                }, ToolBarScreenShot: function (e) {
                    var t = e.style, n = Ke()(e, yn);
                    return o.createElement(We.Z, qe()({component: Tt.Z, style: wn({}, t)}, n))
                }, ToolBarForward: function (e) {
                    var t = e.opacity, n = e.style, r = Ke()(e, An);
                    return o.createElement(We.Z, qe()({component: Vt.Z, style: wn({opacity: t}, n)}, r))
                }, ToolBarBackward: function (e) {
                    var t = e.opacity, n = e.style, r = Ke()(e, bn);
                    return o.createElement(We.Z, qe()({component: Ht.Z, style: wn({opacity: t}, n)}, r))
                }, Search: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Dt.Z}, t))
                }, Refresh: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: _e.Z}, t))
                }, LogLeft: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: $e.Z}, t))
                }, LogRight: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: et.Z}, t))
                }, CopyPaste: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({
                        component: Pt.Z,
                        className: "icon-grey",
                        style: {fontSize: 20}
                    }, t))
                }, Delete: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({
                        component: Rt.Z,
                        className: "icon-grey",
                        style: {fontSize: 20}
                    }, t))
                }, AlignLeft: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Bt.Z}, t))
                }, AlignCenter: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: It.Z}, t))
                }, AlignRight: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: jt.Z}, t))
                }, AlignTop: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Nt.Z}, t))
                }, AlignMiddle: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Lt.Z}, t))
                }, AlignBottom: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Qt.Z}, t))
                }, AlignVerticalEq: function (e) {
                    e.style;
                    var t = Ke()(e, En);
                    return o.createElement(We.Z, qe()({component: Mt.Z}, t))
                }, AlignHorizontalEq: function (e) {
                    e.style;
                    var t = Ke()(e, Cn);
                    return o.createElement(We.Z, qe()({component: Zt.Z}, t))
                }, Vars: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Ft.Z}, t))
                }, Expr: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Gt.Z}, t))
                }, Edit: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Yt.Z}, t))
                }, Vector: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: zt.Z}, t))
                }, VectorBlue: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Ut.Z}, t))
                }, DebugLeft: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: Xt.Z}, t))
                }, DebugRight: function (e) {
                    var t = Object.assign({}, (ze()(e), e));
                    return o.createElement(We.Z, qe()({component: qt.Z}, t))
                }
            };
            var xn = n(1635), Sn = ["children", "onChange"];

            function Tn(e) {
                var t = e.children, n = e.onChange, r = Ke()(e, Sn);
                return o.createElement(Ro, {onChange: n}, (function (e) {
                    return o.createElement(xn.Z, qe()({
                        onChange: e,
                        onDropdownVisibleChange: Jd.lockScroll
                    }, r, {suffixIcon: o.createElement(Nc, null)}), t)
                }))
            }

            Tn.Option = xn.Z.Option, Tn.OptGroup = xn.Z.OptGroup;
            const Dn = Tn;
            n(9215);
            var Pn = n(28764), Rn = ["value", "onChange", "children", "options"];
            const Bn = function (e) {
                var t = e.value, n = e.onChange, r = e.children, i = e.options, c = void 0 === i ? [] : i,
                    u = Ke()(e, Rn);
                return o.createElement(Ro, {onChange: n}, (function (e) {
                    return o.createElement(fo, qe()({}, u, {
                        menu: {
                            items: c.map((function (n) {
                                return {
                                    key: n.key, label: o.createElement("div", {
                                        onClick: function (e) {
                                            e.stopPropagation()
                                        }
                                    }, o.createElement(Pn.Z, {
                                        checked: t.includes(n.key), onChange: function () {
                                            var r = a()(t);
                                            t.includes(n.key) ? r.splice(r.indexOf(n.key), 1) : r.push(n.key), e(r)
                                        }
                                    }, n.label))
                                }
                            }))
                        }
                    }), r)
                }))
            };
            var In = n(73935), jn = n(21865), Nn = function () {
                    return {
                        PRIMARY: "#0d84ff",
                        PRIMARY_ACTIVE: "#0075ed",
                        SUCCESS: T().lineColor1,
                        ERROR: "#ff0000",
                        WARNING: "#ff8a00",
                        PURPLE: T().lineColor2,
                        TEXT1: "#000000",
                        TEXT2: "rgba(0 0 0 / 80%)",
                        TEXT3: "rgba(0 0 0 / 60%)",
                        TEXT4: "rgba(0 0 0 / 40%)",
                        TEXT5: "rgba(0 0 0 / 30%)",
                        BORDER: "#e0e0e0",
                        BORDER_SECONDARY: "#d5dae0",
                        BACKGROUND1: "rgba(0 0 0 / 12%)",
                        BACKGROUND2: "rgba(0 0 0 / 10%)",
                        BACKGROUND3: "rgba(0 0 0 / 8%)",
                        BACKGROUND4: "rgba(0 0 0 / 4%)",
                        BACKGROUND5: "rgba(0 0 0 / 2%)",
                        BACKGROUND_BLUE1: "rgba(13 132 255 / 16%)",
                        BACKGROUND_BLUE2: "rgba(13 132 255 / 8%)",
                        BACKGROUND_BLUE3: "rgba(13 132 255 / 4%)",
                        BACKGROUND_DROPDOWN: "#f0f0f0",
                        TRANSPARENT: "transparent"
                    }
                }, Ln = function () {
                    return {
                        active: Nn().PRIMARY,
                        event: Nn().PURPLE,
                        status: Nn().SUCCESS,
                        default: Nn().BACKGROUND_DROPDOWN,
                        log: Nn().SUCCESS
                    }
                }, Qn = {NOP_CARD: 1, ACTIVE_LINE_CARD: 2, ACTIVE_LINE: 3, ACTIVE_CARD: 4}, Mn = {
                    NONE: "none",
                    COLOR: "color",
                    BOLD: "bold",
                    LIST: "list",
                    ALIGN: "align",
                    HEADER: "header",
                    SHOW: "show"
                }, Zn = {LEFT: "left", CENTER: "center", RIGHT: "right"}, Vn = 1, Hn = 2, Fn = 3, Gn = 0, Yn = "bullet",
                zn = {
                    element: "element",
                    mask: "mask",
                    card: "card",
                    control: "control",
                    connect: "connect",
                    connect2: "connect2",
                    connect3: "connect3",
                    connectLineArrow: "connectLineArrow",
                    select: "select",
                    canvas: "canvas",
                    removeAction: "removeAction",
                    addAction: "addAction",
                    addMode: "addMode",
                    removeMode: "removeMode",
                    delete: "delete",
                    copy: "copy",
                    paste: "paste",
                    copyAndPaste: "copyAndPaste",
                    replace: "replace",
                    emptyCard: "emptyCard",
                    scrollBarX: "scrollBarX",
                    scrollBarY: "scrollBarY",
                    default: "default",
                    header: "header",
                    richText: "richText",
                    cardBox: "cardBox",
                    toolbox: "toolbox",
                    toolbar: "toolbar",
                    multiSelectMenu: "multiSelectMenu",
                    multiSelectPointer: "multiSelectPointer",
                    multiSelectPointerLine: "multiSelectPointerLine",
                    form: "form",
                    body: "body",
                    simplify: "simplify"
                }, Un = "canvas-root", qn = "test", Xn = {ms: "ms", s: "s", min: "min", hour: "hour"},
                Kn = H()(H()(H()(H()({}, Xn.ms, "毫秒"), Xn.s, "秒"), Xn.min, "分钟"), Xn.hour, "小时"),
                Wn = "MM/DD HH:mm:ss", Jn = "YYYY-MM-DD", _n = "HH:mm:ss", $n = {left: 200, top: 96}, er = 24, tr = {
                    position: "absolute",
                    lineHeight: "".concat(er, "px"),
                    height: er,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 500
                }, nr = {animateRate: "1.4s"},
                rr = {NAME: "name", LAST_UPDATE: "lastUpdate", ENABLED: "enabled", DISABLED: "disabled"},
                ar = H()(H()(H()(H()({}, rr.NAME, "名称排序"), rr.LAST_UPDATE, "最后编辑在前"), rr.ENABLED, "启用在前"), rr.DISABLED, "停用在前");

            function or(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], n = (0, o.useRef)(e);
                return (0, o.useEffect)((function () {
                    n.current = e
                }), [e].concat(a()(t))), (0, o.useCallback)((function () {
                    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                    null == n.current || n.current.apply(n, t)
                }), [n])
            }

            n(78086), n(1899);
            var ir = new WeakMap;

            function cr(e, t, n) {
                if (!e || !t || !n) return function () {
                };
                var r = ir.get(e);
                r || (r = new Map, ir.set(e, r));
                var o = r.get(t);
                return o || ((o = function (t) {
                    var n = t.stopImmediatePropagation, r = 0;
                    t.stopImmediatePropagation = function () {
                        r = 1, n.call(t)
                    };
                    for (var i = a()(o.value), c = 0; c < i.length && (i[c].call(e, t), 1 !== r); c += 1) ;
                }).value = new Set, r.set(t, o), e.addEventListener(t, o)), o.value.add(n), function () {
                    return ur(e, t, n)
                }
            }

            function ur(e, t, n) {
                if (e && t && n) {
                    var r = ir.get(e);
                    if (r) {
                        var a = r.get(t);
                        a && (a.value.delete(n), 0 === a.value.size && (e.removeEventListener(t, a), r.delete(t)), 0 === r.size && ir.delete(e))
                    }
                }
            }

            function lr(e) {
                e.preventDefault()
            }

            var sr = ["pointerdown"];
            n(73999);

            function pr(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function fr(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? pr(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pr(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var dr = function (e, t) {
                for (var n = [], r = e; r < t; r += 1) n.push("0".concat(r).slice(-2));
                return n
            }, mr = {h: "时", m: "分", s: "秒"}, vr = 200, hr = 34;
            const gr = function (e) {
                var t = e.type, n = e.value, r = e.onChange, a = (0, o.useRef)(), i = (0, o.useRef)(!1),
                    c = (0, o.useRef)(0), u = (0, o.useRef)(null), l = (0, o.useRef)(0), s = (0, o.useState)(vr),
                    p = I()(s, 2), f = p[0], d = p[1], m = (0, o.useState)(0), v = I()(m, 2), h = v[0], g = v[1],
                    y = (0, o.useRef)(0), A = (0, o.useCallback)((function (e) {
                        g(e), y.current = e
                    }), []), b = (0, o.useMemo)((function () {
                        return dr(0, "h" === t ? 24 : 60)
                    }), [t]), E = (0, o.useMemo)((function () {
                        return b.length
                    }), [b]), C = (0, o.useMemo)((function () {
                        return b.findIndex((function (e) {
                            return Number(e) === n
                        }))
                    }), [b, n]);
                (0, o.useEffect)((function () {
                    A(-C * hr)
                }), [C, A]);
                var O = (0, o.useRef)({
                    startX: 0,
                    startY: 0,
                    deltaX: 0,
                    deltaY: 0,
                    offsetX: 0,
                    offsetY: 0,
                    direction: ""
                }), w = (0, o.useCallback)((function () {
                    O.current = fr(fr({}, O.current), {}, {
                        startOffset: 0,
                        deltaX: 0,
                        deltaY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        direction: ""
                    })
                }), []), x = (0, o.useCallback)((function (e) {
                    var n = -(e = k(e, 0, E)) * hr, a = function () {
                        e !== C && r(t, Number(b[e]))
                    };
                    i.current && n !== y.current ? u.current = a : a(), A(n)
                }), [E, A, C, r, t, b]), S = (0, o.useCallback)((function (e) {
                    return k(Math.round(-e / hr), 0, E - 1)
                }), [E]), T = (0, o.useCallback)((function (e, t) {
                    var n = Math.abs(e / t);
                    e = y.current + n / .003 * (e < 0 ? -1 : 1);
                    var r = S(e);
                    d(600), x(r)
                }), [S, x]), D = (0, o.useCallback)((function () {
                    i.current = !1, d(0), u.current && (u.current(), u.current = null)
                }), []), P = (0, o.useCallback)((function (e) {
                    var t, n;
                    O.current.deltaX = e.clientX - O.current.startX, O.current.deltaY = e.clientY - O.current.startY, O.current.offsetX = Math.abs(O.current.deltaX), O.current.offsetY = Math.abs(O.current.deltaY), O.current.direction = O.current.direction || (t = O.current.offsetX, n = O.current.offsetY, t > n && t > 10 ? "horizontal" : n > t && n > 10 ? "vertical" : ""), "vertical" === O.current.direction && (i.current = !0, e.preventDefault(), e.stopPropagation());
                    var r = k(O.current.startOffset + O.current.deltaY, -E * hr, hr);
                    A(r);
                    var a = Date.now();
                    a - c.current > 300 && (c.current = a, l.current = r)
                }), [E, A]), R = (0, o.useCallback)((function () {
                    ur(document, "pointermove", P), ur(document, "pointerup", R), ur(document, "pointercancel", R);
                    var e = y.current - l.current, t = Date.now() - c.current;
                    if (t < 300 && Math.abs(e) > 15) T(e, t); else {
                        var n = S(y.current);
                        d(vr), x(n), setTimeout((function () {
                            i.current = !1
                        }), 0)
                    }
                }), [S, T, P, x]), B = (0, o.useCallback)((function (e) {
                    if (cr(document, "pointermove", P), cr(document, "pointerup", R), cr(document, "pointercancel", R), w(), O.current.startX = e.clientX, O.current.startY = e.clientY, i.current) {
                        var t = function (e) {
                            var t = window.getComputedStyle(e).transform, n = t.slice(7, t.length - 1).split(", ")[5];
                            return Number(n)
                        }(a.current), n = Math.min(0, t - 34);
                        A(n), O.current.startOffset = n
                    } else O.current.startOffset = h;
                    d(0), i.current = !1, u.current = null, c.current = Date.now(), l.current = O.current.startOffset
                }), [w, P, R, A, h]), j = (0, o.useCallback)((function (e) {
                    i.current || (d(vr), x(e))
                }), [x]), N = (0, o.useMemo)((function () {
                    return {
                        transform: "translate3d(0, ".concat(h + 34, "px, 0)"),
                        transitionDuration: "".concat(f, "ms"),
                        transitionProperty: f ? "all" : "none"
                    }
                }), [f, h]), L = (0, o.useRef)(), Q = (0, o.useCallback)((function (e) {
                    e.stopPropagation();
                    var t = k(y.current - e.deltaY, -E * hr, hr);
                    A(t), i.current = !0, clearTimeout(L.current), L.current = setTimeout((function () {
                        var e = S(y.current);
                        d(vr), x(e)
                    }), 30)
                }), [E, S, x, A]);
                return o.createElement("div", {
                    className: (0, Ge.Z)(["mi-picker-view-column", {moving: i.current}]),
                    onPointerDown: B,
                    onWheel: Q
                }, o.createElement("div", {
                    className: "mi-picker-view-column-wrapper",
                    ref: a,
                    style: N,
                    onTransitionEnd: D
                }, b.map((function (e, t) {
                    return o.createElement("div", {
                        key: e,
                        className: (0, Ge.Z)(["mi-picker-view-column-item", {selected: Number(e) === n}]),
                        onClick: function () {
                            return j(t)
                        }
                    }, o.createElement("span", null, e))
                }))), o.createElement("div", {className: "mi-picker-view-column-tag"}, mr[t]))
            };
            var yr = ["style", "value", "format", "showNow", "onChange", "onOpenChange", "suffixIcon"];

            function Ar(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function br(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ar(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ar(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Er = ["h", "m", "s"], Cr = (0, o.memo)((0, o.forwardRef)((function (e, t) {
                var n = e.style, r = e.value, a = e.showNow, i = e.onChange, c = function (e) {
                    return {h: e.hour(), m: e.minute(), s: e.second()}
                }(r), u = function (e, t) {
                    i && i(br(br({}, c), {}, H()({}, e, t)))
                };
                return o.createElement("div", {
                    className: "mi-picker-dropdown",
                    style: n,
                    ref: t
                }, o.createElement("div", {className: "mi-picker-panel"}, Er.map((function (e) {
                    return o.createElement(gr, {key: e, type: e, value: c[e], onChange: u})
                }))), a && o.createElement("div", {className: "mi-picker-footer"}, o.createElement("span", {
                    className: "mi-picker-now-btn",
                    onClick: function () {
                        var e = new Date, t = e.getHours(), n = e.getMinutes(), a = e.getSeconds(), o = R()(r);
                        o.hour() === t && o.minute() === n && o.second() === a || i && i({h: t, m: n, s: a})
                    }
                }, "此刻")))
            }))), Or = function (e) {
                var t = e.style, n = e.value, r = e.format, a = e.showNow, i = e.onChange, c = e.onOpenChange,
                    u = e.suffixIcon, l = Ke()(e, yr), s = (0, o.useState)(!1), p = I()(s, 2), f = p[0], d = p[1],
                    m = (0, o.useRef)(f), v = (0, o.useRef)(), h = (0, o.useRef)(), g = (0, o.useMemo)((function () {
                        return [v, h]
                    }), []), y = (0, o.useState)({}), A = I()(y, 2), b = A[0], E = A[1], C = or(i), O = or(c);
                (0, o.useEffect)((function () {
                    f !== m.current && O(f), m.current = f
                }), [f]), function (e, t, n) {
                    var r = (0, o.useRef)(t);
                    (0, o.useEffect)((function () {
                        r.current = t
                    }), [t]), (0, o.useEffect)((function () {
                        var t = function (t) {
                            !e.some((function (e) {
                                var n;
                                return null == (n = e.current) ? void 0 : n.contains(t.target)
                            })) && r.current(t)
                        };
                        if (n) {
                            var a = sr.map((function (e) {
                                return cr(document, e, t)
                            }));
                            return function () {
                                return a.forEach((function (e) {
                                    return e()
                                }))
                            }
                        }
                    }), [e, n])
                }(g, (function () {
                    d(!1)
                }), f);
                var w = (0, o.useCallback)((function () {
                    v.current && (E((function (e) {
                        return br(br({}, e), {}, {visibility: "hidden"})
                    })), d((function (e) {
                        return !e
                    })), setTimeout((function () {
                        if (h.current) {
                            var e = h.current.getBoundingClientRect(), t = v.current.getBoundingClientRect(),
                                n = window.innerWidth - t.right, r = t.bottom + 8, a = window.innerHeight - t.top + 8,
                                o = r + e.height > window.innerHeight;
                            E(br({
                                visibility: "visible",
                                right: "".concat(n, "px")
                            }, o ? {bottom: "".concat(a, "px")} : {top: "".concat(r, "px")}))
                        }
                    }), 0))
                }), []), k = R()(n).format(r);
                return o.createElement("div", {
                    className: "mi-time-picker",
                    style: t,
                    ref: v,
                    "data-target": 1,
                    "data-id": zn.form
                }, o.createElement("div", {
                    className: "mi-time-picker-input",
                    onPointerDown: w
                }, o.createElement(jn.Z, qe()({}, l, {
                    readOnly: !0, value: k, suffix: u, onKeyDown: function (e) {
                        return e.stopPropagation()
                    }
                }))), f ? (0, In.createPortal)(o.createElement(Cr, {
                    value: n,
                    showNow: a,
                    ref: h,
                    style: b,
                    onChange: function (e) {
                        var t = e.h, n = e.m, r = e.s;
                        C(R()().set("hour", t).set("minute", n).set("second", r), k)
                    }
                }), document.body) : null)
            };
            Or.propTypes = {
                showNow: Z().bool,
                style: Z().any,
                format: Z().string,
                onChange: Z().func.isRequired,
                onOpenChange: Z().func,
                value: Z().instanceOf(R()().constructor).isRequired
            }, Or.defaultProps = {
                showNow: !0, style: null, format: _n, onOpenChange: function () {
                }
            };
            const wr = (0, o.memo)(Or);
            var kr = ["onChange"];
            const xr = function (e) {
                var t = e.onChange, n = Ke()(e, kr);
                return o.createElement(Ro, {onChange: t}, (function (e) {
                    return o.createElement(wr, qe()({}, n, {
                        allowClear: !1,
                        suffixIcon: o.createElement(Nc, null),
                        onChange: e,
                        onOpenChange: Jd.lockScroll
                    }))
                }))
            };
            var Sr = ["onChange"];
            const Tr = function (e) {
                var t = e.onChange, n = Ke()(e, Sr);
                return o.createElement(Ro, {onChange: t, delay: 800}, (function (e) {
                    return o.createElement(jn.Z, qe()({}, n, {
                        onChange: e, onFocus: function () {
                            null == window.update || window.update()
                        }, onKeyDown: function (e) {
                            return e.stopPropagation()
                        }
                    }))
                }))
            };

            function Dr() {
                return Dr = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Dr.apply(this, arguments)
            }

            const Pr = e => o.createElement("svg", Dr({
                width: "1em",
                height: "1em",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M12.843 4.8a.8.8 0 1 0-1.6 0v6.443H4.8a.8.8 0 1 0 0 1.6h6.443V19.2a.8.8 0 0 0 1.6 0v-6.357H19.2a.8.8 0 0 0 0-1.6h-6.357V4.8Z"
            }));
            var Rr = ["style", "iconSize", "children"];

            function Br(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ir(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Br(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Br(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var jr = function (e) {
                var t = e.style, n = e.iconSize, r = void 0 === n ? 20 : n, a = e.children, i = Ke()(e, Rr);
                return o.createElement(Q.ZP, qe()({
                    type: "primary",
                    className: "ant-btn-with-icon",
                    style: Ir({fontSize: 16}, t),
                    icon: o.createElement(We.Z, {
                        component: Pr,
                        style: {fontSize: r, lineHeight: "".concat(r, "px"), height: r}
                    })
                }, i), a)
            };
            const Nr = o.memo(jr);
            var Lr = n(22382), Qr = ["onChange"];
            const Mr = function (e) {
                var t = e.onChange, n = Ke()(e, Qr);
                return o.createElement(Ro, {onChange: t, delay: 800}, (function (e) {
                    return o.createElement(Lr.Z, qe()({}, n, {
                        onFocus: function () {
                            null == window.update || window.update()
                        }, onChange: e, onKeyDown: function (e) {
                            return e.stopPropagation()
                        }
                    }))
                }))
            };
            var Zr = n(85492);
            const Vr = function (e) {
                return o.createElement(Zr.Z, qe()({inputReadOnly: !0}, e, {
                    allowClear: !1,
                    suffixIcon: o.createElement(kn.Down, null),
                    onOpenChange: Jd.lockScroll,
                    onKeyDown: function (e) {
                        return e.stopPropagation()
                    }
                }))
            };
            var Hr = n(17156), Fr = n.n(Hr), Gr = n(64687), Yr = n.n(Gr);
            n(74615);

            function zr(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ur(e, t) {
                if (t) return (e || []).find((function (e) {
                    return e.id === t
                }))
            }

            function qr(e, t) {
                var n = t.x, r = t.y, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {x: 0, y: 0};
                if (e) {
                    var o = a.x, i = a.y;
                    e.cfg.pos.x = n - o, e.cfg.pos.y = r - i, e.cfg = function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? zr(Object(n), !0).forEach((function (t) {
                                H()(e, t, n[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zr(Object(n)).forEach((function (t) {
                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                            }))
                        }
                        return e
                    }({}, e.cfg)
                }
            }

            function Xr(e, t, n) {
                var r = t.reduce((function (e, t) {
                    return e[t] = !0, e
                }), {});
                e.forEach((function (e) {
                    r[e.id] && (e.cfg.pos.x += n.x, e.cfg.pos.y += n.y)
                }))
            }

            var Kr = function () {
                function e(t) {
                    G()(this, e), this.parent = t.parent
                }

                return z()(e, [{
                    key: "getElementById", value: function (e) {
                        return Ur(this.parent.data, e)
                    }
                }, {
                    key: "getStore", value: function () {
                        var e = this.parent.graphTool, t = e.copyData;
                        if (!t) return null;
                        var n = this.parent.data;
                        return t.graphId !== e.id && (n = e.getGraph(t.graphId)), n
                    }
                }, {
                    key: "update", value: function (e) {
                        window.update && window.update(e)
                    }
                }]), e
            }();
            const Wr = Kr;
            var Jr = n(68608);

            function _r(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function $r(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? _r(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _r(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function ea(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var ta = "onClose", na = "onSecureSessionError", ra = "onSecureSessionEstablish", aa = "loading",
                oa = "success", ia = "error", ca = function (e) {
                    J()(o, e);
                    var t, n, r, a = ea(o);

                    function o(e) {
                        var t;
                        return G()(this, o), (t = a.call(this, e)).data = {
                            devList: [],
                            modalVisible: !1,
                            urnMap: {},
                            deviceType: "",
                            pos: {x: 0, y: 0}
                        }, t
                    }

                    return z()(o, [{
                        key: "showModal", value: function (e) {
                            var t = e.type, n = e.x, r = e.y;
                            this.data.modalVisible = !0, this.data.deviceType = t, this.data.pos = {x: n, y: r}
                        }
                    }, {
                        key: "hideModal", value: function () {
                            this.data.modalVisible = !1, this.data.deviceType = "", this.data.pos = {x: 0, y: 0}
                        }
                    }, {
                        key: "init", value: function (e) {
                            var t = this;
                            (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).onCloseCallback;
                            return Jr.kd.deinit(), new Promise((function (n, r) {
                                try {
                                    var a = window.location, o = new Jr.G4({protocols: ["passcode"], location: a});
                                    o.onRequestPasscode = function () {
                                        o.setPasscode(e)
                                    }, o.onClose = (0, U.throttle)((function () {
                                        to.pin(), oo.error("连接断开，请检查网络后重试"), r(new Error(ta))
                                    }), 3e3, {trailing: !1}), o.onSecureSessionError = function () {
                                        oo.error("登录码错误，请重新获取登录码"), t.server = void 0, r(new Error(na))
                                    }, o.onSecureSessionEstablish = Fr()(Yr().mark((function e() {
                                        return Yr().wrap((function (e) {
                                            for (; ;) switch (e.prev = e.next) {
                                                case 0:
                                                    return e.prev = 0, e.next = 3, Promise.all([Jr.kd.init(o), Jr.ut.init()]);
                                                case 3:
                                                    return e.next = 5, t.getDevList();
                                                case 5:
                                                    n(), e.next = 12;
                                                    break;
                                                case 8:
                                                    e.prev = 8, e.t0 = e.catch(0), oo.error("获取设备列表失败，请检查网络后重试"), r(new Error(ra));
                                                case 12:
                                                case"end":
                                                    return e.stop()
                                            }
                                        }), e, null, [[0, 8]])
                                    }))), t.server = o
                                } catch (_a) {
                                    oo.error("建立连接失败，请检查网络后重试"), r(_a)
                                }
                            }))
                        }
                    }, {
                        key: "getDevList", value: (r = Fr()(Yr().mark((function e(t) {
                            var n, r;
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        if (n = null, !t) {
                                            e.next = 5;
                                            break
                                        }
                                        n = {
                                            123456: {
                                                deviceType: "mock",
                                                deviceTypeDescription: "mock-device",
                                                model: "mock.a.b",
                                                modelName: "模拟设备",
                                                name: "模拟设备",
                                                online: !0,
                                                pushAvailable: !0,
                                                roomId: "989001360021",
                                                roomName: "模拟房间",
                                                specV2Access: !0,
                                                urn: t
                                            }
                                        }, e.next = 8;
                                        break;
                                    case 5:
                                        return e.next = 7, Jr.kd.getDevList();
                                    case 7:
                                        n = e.sent;
                                    case 8:
                                        return r = n, Object.keys(r).forEach((function (e) {
                                            r[e].did = e
                                        })), this.data.devList = Object.values(r).filter((function (e) {
                                            return e.specV2Access
                                        })), this.data.devList.map((function (e) {
                                            var t = Jr.ut.getDeviceType(e.urn), n = t.deviceType,
                                                r = t.deviceTypeDescription;
                                            return e.deviceTypeDescription = r, e.deviceType = n, e
                                        })), e.abrupt("return", this.data.devList);
                                    case 14:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, this)
                        }))), function (e) {
                            return r.apply(this, arguments)
                        })
                    }, {
                        key: "callAPI", value: function (e, t, n) {
                            this.server.callAPI(e, t, 5e3).then(n)
                        }
                    }, {
                        key: "getAllDeviceDetail", value: function (e, t) {
                            var n = [];
                            this.data.devList.forEach((function (e) {
                                -1 === n.indexOf(e.urn) && n.push(e.urn)
                            }));
                            var r = n.map((function (e) {
                                return {urn: e, times: 3}
                            }));
                            this.getDeviceByUrnQueue(r, e, t)
                        }
                    }, {
                        key: "getDeviceByUrnQueue", value: function (e, t, n) {
                            var r = this, a = 0, o = e.length, i = [];
                            if (0 !== e.length) {
                                var c = function (e, t) {
                                    var n = r.data.devList.find((function (t) {
                                        return t.urn === e.urn
                                    }));
                                    "".concat(n.roomName, "的").concat(n.name);
                                    t || e.times
                                };
                                e.forEach((function (e) {
                                    r.getDeviceDetail(e.urn).then((function () {
                                        a++, c(e, !0), a === o && t()
                                    })).catch((function () {
                                        a++, e.times--, c(e, !1), e.times > 0 && i.push(e), e.times <= 0 && (r.data.devList = r.data.devList.filter((function (t) {
                                            return t.urn !== e.urn
                                        }))), a === o && (i.length > 0 ? r.getDeviceByUrnQueue(i, t, n) : t())
                                    }))
                                }))
                            } else t()
                        }
                    }, {
                        key: "getDeviceDetailByUrn", value: (n = Fr()(Yr().mark((function e(t) {
                            var n;
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, Jr.ut.parse(t);
                                    case 2:
                                        return (n = e.sent).action = n.action.map((function (e) {
                                            return e.keyType = de.action, e
                                        })), n.event = n.event.map((function (e) {
                                            return e.keyType = de.event, e
                                        })), n.propertySet = n.propertySet.map((function (e) {
                                            return e.keyType = de.property, e
                                        })), n.propertyNotify = n.propertyNotify.map((function (e) {
                                            return e.keyType = de.property, e
                                        })), n.propertyGet = n.propertyGet.map((function (e) {
                                            return e.keyType = de.property, e
                                        })), this.data.devList = this.data.devList.map((function (e) {
                                            return e.urn === t && (e.deviceType = n.deviceType, e.deviceTypeDescription = n.deviceTypeDescription), e
                                        })), this.data.urnMap[t] = $r($r({}, n), {}, {netStatus: oa}), e.abrupt("return", n);
                                    case 11:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, this)
                        }))), function (e) {
                            return n.apply(this, arguments)
                        })
                    }, {
                        key: "getDeviceDetail", value: (t = Fr()(Yr().mark((function e(t) {
                            var n;
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return this.data.urnMap[t] = {netStatus: aa}, e.prev = 1, e.next = 4, this.getDeviceDetailByUrn(t);
                                    case 4:
                                        return n = e.sent, window.update && update(), e.abrupt("return", n);
                                    case 9:
                                        throw e.prev = 9, e.t0 = e.catch(1), this.data.urnMap[t] = {netStatus: ia}, window.update && update(), new Error("netStatus");
                                    case 14:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, this, [[1, 9]])
                        }))), function (e) {
                            return t.apply(this, arguments)
                        })
                    }, {
                        key: "getGivenData", value: function () {
                            var e = this, t = this.data.devList.filter((function (e) {
                                return e.specV2Access && e.online
                            })), n = function (t) {
                                var n = e.parent.gateway.data.urnMap[t.urn];
                                return n && n.netStatus === oa ? n : $r({
                                    propertyNotify: [],
                                    event: [],
                                    propertySet: [],
                                    action: [],
                                    propertyGet: []
                                }, n)
                            }, r = [], a = [], o = [], i = this.data.deviceType;
                            [ip.deviceInput, ip.deviceInputSetVar].includes(i) && (r = t.filter((function (e) {
                                var t = n(e), r = t.netStatus, a = t.propertyNotify, o = t.event.slice(0);
                                return i === ip.deviceInputSetVar && (o = o.filter((function (e) {
                                    var t;
                                    return (null == (t = e.arguments) ? void 0 : t.length) > 0
                                }))), r === oa && e.pushAvailable && a.length + o.length > 0
                            }))), i === ip.deviceOutput && (r = t.filter((function (e) {
                                var t = n(e);
                                return t.netStatus === oa && t.propertySet.length + t.action.length > 0
                            }))), [ip.deviceGet, ip.deviceGetSetVar].includes(i) && (r = t.filter((function (e) {
                                var t = n(e);
                                return t.netStatus === oa && t.propertyGet.length > 0
                            })));
                            var c = [], u = [];
                            r.forEach((function (e) {
                                -1 === c.indexOf(e.deviceType) && (a.push({
                                    key: e.deviceType,
                                    label: e.deviceTypeDescription
                                }), c.push(e.deviceType)), -1 === u.indexOf(e.roomId) && (o.push({
                                    key: e.roomId,
                                    label: e.roomName
                                }), u.push(e.roomId))
                            }));
                            var l = function (e) {
                                return e.sort((function (e, t) {
                                    return e.label.localeCompare(t.label)
                                }))
                            };
                            return window.devices = r, {devices: r, roomTags: l(o), typeTags: l(a)}
                        }
                    }, {
                        key: "deviceType", get: function () {
                            var e = [], t = [];
                            return this.data.devList.forEach((function (n) {
                                -1 === e.indexOf(n.deviceType) && (t.push({
                                    deviceType: n.deviceType,
                                    deviceTypeDescription: n.deviceTypeDescription
                                }), e.push(n.deviceType))
                            })), t
                        }
                    }, {
                        key: "room", get: function () {
                            var e = [], t = [];
                            return this.data.devList.forEach((function (n) {
                                -1 === e.indexOf(n.roomId) && (t.push({
                                    roomId: n.roomId,
                                    roomName: n.roomName
                                }), e.push(n.roomId))
                            })), t
                        }
                    }]), o
                }(Wr);
            const ua = ca;
            n(91589);

            function la(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return sa(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return sa(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function sa(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function pa(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function fa(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? pa(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pa(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var da, ma, va = Jr.kd.varManager, ha = va.SCOPE_GLOBAL, ga = "__virtual", ya = "const", Aa = "var",
                ba = function (e) {
                    return e === ha
                }, Ea = {string: "string", number: "number"}, Ca = function () {
                    return "".concat("V").concat(x())
                }, Oa = function (e) {
                    return !(null == e || !e[ga])
                }, wa = function (e) {
                    return [Ea.string, Ea.number].includes(e)
                }, ka = function (e) {
                    return [me.int, me.float, me.boolean].includes(e) ? Ea.number : me.string === e ? Ea.string : e
                }, xa = {
                    store: new Map, removeCache: function (e) {
                        this.store.delete(e)
                    }, setCache: function (e, t) {
                        this.store.set(e, t)
                    }, getCache: function (e) {
                        var t = this.store.get(e);
                        if (t) return t
                    }, clear: function () {
                        this.store.clear()
                    }
                }, Sa = {
                    store: null, setCache: function (e) {
                        this.store = e
                    }, getCache: function () {
                        return this.store
                    }, removeCache: function () {
                        this.store = null
                    }
                }, Ta = function () {
                    Sa.removeCache(), xa.clear()
                }, Da = (da = new Map, ma = {
                    mountStore: function (e) {
                        e && !e._virtual_store && (e._virtual_store = da)
                    }, createVar: function (e) {
                        var t = e.scope, n = e.type, r = e.name, a = void 0 === r ? "" : r, o = e.value, i = e.id;
                        if (!t) throw new Error("SCOPE不能为空");
                        if (ba(t)) throw new Error("虚拟变量SCOPE不能为全局");
                        if (o = o || (n === Ea.number ? 0 : ""), !wa(n) || typeof o !== n) throw new Error("变量类型与变量值类型不匹配");
                        if (a.trim().length < 1) throw new Error("变量名称不能为空");
                        da.has(t) || da.set(t, {});
                        var c = da.get(t), u = i || Ca();
                        return c[u] = H()(H()(H()(H()({}, ga, !0), "type", n), "value", o), "userData", {name: a}), (0, U.cloneDeep)(fa(fa({}, c[u]), {}, {
                            id: u,
                            scope: t
                        }))
                    }, clearScopeVars: function (e) {
                        var t = da.get(e) || {}, n = Object.keys(t).reduce((function (n, r) {
                            return n.push(fa(fa({}, t[r]), {}, {id: r, scope: e})), n
                        }), []);
                        return da.delete(e), n
                    }, deleteVar: function (e) {
                        var t = e.id, n = e.scope, r = da.get(n);
                        r && (delete r[t], Object.keys(r).length < 1 && da.delete(n))
                    }, deleteVarByName: function (e) {
                        var t = e.scope, n = e.name, r = da.get(t);
                        r && Object.keys(r).filter((function (e) {
                            var t;
                            return (null == (t = r[e].userData) ? void 0 : t.name) === n
                        })).forEach((function (e) {
                            ma.deleteVar({id: e, scope: t})
                        }))
                    }, updateVar: function (e) {
                        var t = e.scope, n = e.id, r = e.name, a = void 0 === r ? "" : r, o = e.value, i = da.get(t);
                        if (i) {
                            var c = i[n];
                            if (c) return c.userData = fa(fa({}, c.userData), {}, {name: a.trim()}), typeof o == typeof c.value && (c.value = o), (0, U.cloneDeep)(fa(fa({}, c), {}, {scope: t}))
                        }
                    }, listVar: function (e) {
                        var t = da.get(e);
                        return t ? Object.keys(t).map((function (n) {
                            return fa(fa({}, t[n]), {}, {scope: e, id: n})
                        })).filter((function (e) {
                            return wa(e.type)
                        })) : []
                    }, getVarConfig: function (e) {
                        var t = e.scope, n = e.id, r = da.get(t);
                        if (r) {
                            var a = r[n];
                            if (a) return {type: a.type, userData: a.userData}
                        }
                    }, getVarValue: function (e) {
                        var t = e.scope, n = e.id, r = da.get(t);
                        if (r) {
                            var a = r[n];
                            if (a) return {value: a.value}
                        }
                    }, clear: function (e) {
                        da.delete(e)
                    }, saveToGateway: function (e) {
                        var t = arguments;
                        return Fr()(Yr().mark((function n() {
                            var r, a, o, i;
                            return Yr().wrap((function (n) {
                                for (; ;) switch (n.prev = n.next) {
                                    case 0:
                                        r = t.length > 1 && void 0 !== t[1] ? t[1] : [], a = da.get(e), n.t0 = Yr().keys(a);
                                    case 3:
                                        if ((n.t1 = n.t0()).done) {
                                            n.next = 18;
                                            break
                                        }
                                        if (o = n.t1.value, i = Object.assign({}, (ze()(a[o]), a[o])), n.prev = 6, !r.includes(o)) {
                                            n.next = 11;
                                            break
                                        }
                                        return n.next = 10, va.createVar(fa(fa({}, i), {}, {
                                            scope: e,
                                            id: o
                                        })).then((function () {
                                            xa.removeCache(e), Sa.removeCache()
                                        }));
                                    case 10:
                                        ma.deleteVar({id: o, scope: e});
                                    case 11:
                                        n.next = 16;
                                        break;
                                    case 13:
                                        n.prev = 13, n.t2 = n.catch(6), u(n.t2);
                                    case 16:
                                        n.next = 3;
                                        break;
                                    case 18:
                                    case"end":
                                        return n.stop()
                                }
                            }), n, null, [[6, 13]])
                        })))()
                    }
                }, ma);

            function Pa() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.scope,
                    n = void 0 === t ? ha : t, r = e.type, a = e.name, o = void 0 === a ? "" : a, i = e.value,
                    c = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                if ((o = o.trim()).length < 1) throw new Error("变量名称不能为空");
                if (i = i || (r === Ea.number ? 0 : ""), c && !ba(n)) return Da.createVar({
                    scope: n,
                    type: r,
                    name: o,
                    value: i
                });
                var u = {scope: n, id: Ca(), type: r, userData: {name: o.trim()}};
                return va.createVar(fa(fa({}, u), {}, {value: i})).then((function () {
                    return xa.removeCache(n), Sa.removeCache(), (0, U.cloneDeep)(u)
                }))
            }

            function Ra(e) {
                return Ba.apply(this, arguments)
            }

            function Ba() {
                return Ba = Fr()(Yr().mark((function e(t) {
                    var n, r, a, o, i, c, u = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (n = t.id, r = t.scope, a = void 0 === r ? ha : r, o = t[ga], i = u.length > 1 && void 0 !== u[1] && u[1], c = {
                                    id: n,
                                    scope: a
                                }, !o && !i) {
                                    e.next = 5;
                                    break
                                }
                                return e.abrupt("return", Da.deleteVar(c));
                            case 5:
                                return e.abrupt("return", va.deleteVar(c).then((function (e) {
                                    return xa.removeCache(a), Sa.removeCache(), e
                                })));
                            case 6:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Ba.apply(this, arguments)
            }

            function Ia() {
                return Ia = Fr()(Yr().mark((function e(t) {
                    var n, r, a, o, i, c, u, l, s = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (n = t.name, r = t.scope, a = void 0 === r ? ha : r, o = t[ga], i = s.length > 1 && void 0 !== s[1] && s[1], c = {
                                    name: n,
                                    scope: a
                                }, !o && !i) {
                                    e.next = 5;
                                    break
                                }
                                return e.abrupt("return", Da.deleteVarByName(c));
                            case 5:
                                return e.next = 7, Ma(a);
                            case 7:
                                if (u = e.sent, !(l = Object.keys(u).find((function (e) {
                                    var t;
                                    return (null == (t = u[e].userData) ? void 0 : t.name) === n
                                })))) {
                                    e.next = 11;
                                    break
                                }
                                return e.abrupt("return", Ra({id: l, scope: a}));
                            case 11:
                                return e.abrupt("return", null);
                            case 12:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Ia.apply(this, arguments)
            }

            function ja(e) {
                return Na.apply(this, arguments)
            }

            function Na() {
                return (Na = Fr()(Yr().mark((function e(t) {
                    var n, r, a, o;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                return n = [], r = [], a = [], o = t.map((function (e) {
                                    var t = Object.assign({}, (ze()(e), e)), o = t.id, i = t.scope;
                                    return n.push(i), va.deleteVar({id: o, scope: i}).then((function () {
                                        return r.push(t), !0
                                    })).catch((function () {
                                        return a.push(t), !1
                                    }))
                                })), e.abrupt("return", Promise.all(o).then((function () {
                                    return n.forEach((function (e) {
                                        xa.removeCache(e)
                                    })), Sa.removeCache(), [r, a]
                                })));
                            case 5:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                })))).apply(this, arguments)
            }

            function La(e) {
                var t = e.scope, n = e.id, r = e.name, a = void 0 === r ? "" : r, o = e.value,
                    i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, c = i.isVirtual,
                    u = void 0 !== c && c, l = i.rawData, s = void 0 === l ? {} : l;
                if (u) return Da.updateVar({scope: t, id: n, name: a, value: o});
                return Promise.all([function () {
                    if (s.varName !== a) return va.setVarConfig({
                        scope: t,
                        id: n,
                        userData: {name: a.trim()}
                    }).then((function () {
                        return xa.removeCache(t), {scope: t, id: n, userData: {name: a.trim()}}
                    }))
                }(), function () {
                    if (wa(typeof o) && s.varValue !== o) return va.setVarValue({
                        scope: t,
                        id: n,
                        value: o
                    }).then((function () {
                        return {value: o}
                    }))
                }()]).then((function (e) {
                    var t = I()(e, 2), n = t[0], r = t[1];
                    return fa(fa({}, n), r)
                }))
            }

            function Qa() {
                var e = Sa.getCache();
                if (e) return Promise.resolve(e);
                var t = va.listScope();
                return Sa.setCache(t), t.then((function (e) {
                    return Sa.setCache(e), e
                })).catch((function () {
                    var e = Sa.getCache();
                    return S(e) && Sa.removeCache(), Sa.getCache() || {}
                }))
            }

            function Ma(e) {
                return Za.apply(this, arguments)
            }

            function Za() {
                return Za = Fr()(Yr().mark((function e(t) {
                    var n, r;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (!(n = xa.getCache(t))) {
                                    e.next = 3;
                                    break
                                }
                                return e.abrupt("return", Promise.resolve(n));
                            case 3:
                                return e.next = 5, Qa();
                            case 5:
                                if (e.sent.includes(t)) {
                                    e.next = 8;
                                    break
                                }
                                throw new Error("".concat(t, " not found"));
                            case 8:
                                return r = va.listVar(t), xa.setCache(t, r), e.abrupt("return", r.then((function (e) {
                                    return xa.setCache(t, e), e
                                })).catch((function (e) {
                                    var n = xa.getCache(t);
                                    throw S(n) && xa.removeCache(t), e
                                })));
                            case 11:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Za.apply(this, arguments)
            }

            function Va() {
                return Ha.apply(this, arguments)
            }

            function Ha() {
                return Ha = Fr()(Yr().mark((function e() {
                    var t, n, r, a = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                return t = a.length > 0 && void 0 !== a[0] ? a[0] : ha, n = a.length > 1 && void 0 !== a[1] && a[1], e.next = 4, Ma(t).then((function (e) {
                                    return Object.keys(e).map((function (n) {
                                        return fa(fa({}, e[n]), {}, {scope: t, id: n})
                                    })).filter((function (e) {
                                        return wa(e.type)
                                    }))
                                })).catch((function () {
                                    return []
                                }));
                            case 4:
                                if (r = e.sent, !n || ba(t)) {
                                    e.next = 11;
                                    break
                                }
                                return e.t0 = r, e.next = 9, Da.listVar(t);
                            case 9:
                                return e.t1 = e.sent, e.abrupt("return", e.t0.concat.call(e.t0, e.t1));
                            case 11:
                                return e.abrupt("return", r);
                            case 12:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Ha.apply(this, arguments)
            }

            function Fa(e) {
                if (e || (e = Jd.graphTool.id), e) return "".concat("R").concat(e)
            }

            function Ga(e) {
                return Ya.apply(this, arguments)
            }

            function Ya() {
                return Ya = Fr()(Yr().mark((function e(t) {
                    var n, r, a, o, i, c, u, l, s = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (n = t.id, r = t.scope, !(s.length > 1 && void 0 !== s[1] && s[1])) {
                                    e.next = 6;
                                    break
                                }
                                if (!(a = Da.getVarConfig({id: n, scope: r}))) {
                                    e.next = 6;
                                    break
                                }
                                return e.abrupt("return", a);
                            case 6:
                                if (!(o = xa.getCache(r))) {
                                    e.next = 14;
                                    break
                                }
                                return e.next = 10, o;
                            case 10:
                                if (!(i = e.sent)[n]) {
                                    e.next = 14;
                                    break
                                }
                                return c = i[n], u = c.type, l = c.userData, e.abrupt("return", {type: u, userData: l});
                            case 14:
                                return e.abrupt("return", va.getVarConfig({id: n, scope: r}).catch((function () {
                                })));
                            case 15:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Ya.apply(this, arguments)
            }

            function za() {
                return za = Fr()(Yr().mark((function e(t) {
                    var n, r, a, o = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (n = t.id, r = t.scope, !(o.length > 1 && void 0 !== o[1] && o[1])) {
                                    e.next = 6;
                                    break
                                }
                                if (!(a = Da.getVarValue({id: n, scope: r}))) {
                                    e.next = 6;
                                    break
                                }
                                return e.abrupt("return", a);
                            case 6:
                                return e.abrupt("return", va.getVarValue({id: n, scope: r}).catch((function () {
                                })));
                            case 7:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), za.apply(this, arguments)
            }

            function Ua() {
                return Ua = Fr()(Yr().mark((function e(t) {
                    var n, r = arguments;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (n = !(r.length > 1 && void 0 !== r[1]) || r[1], !ba(t)) {
                                    e.next = 4;
                                    break
                                }
                                return e.abrupt("return", []);
                            case 4:
                                if (!n) {
                                    e.next = 6;
                                    break
                                }
                                return e.abrupt("return", Promise.all([Va(t, !0), Va()]).then((function (e) {
                                    var t = I()(e, 2);
                                    return [t[0], t[1]]
                                })));
                            case 6:
                                return e.abrupt("return", Va(t, !0).then((function (e) {
                                    return [e]
                                })));
                            case 7:
                            case"end":
                                return e.stop()
                        }
                    }), e)
                }))), Ua.apply(this, arguments)
            }

            function qa(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
                return (t = t.trim()) ? Va(e, !0).then((function (e) {
                    var r, a = la(e);
                    try {
                        for (a.s(); !(r = a.n()).done;) {
                            var o, i = r.value;
                            if (!n.includes(i.id) && (null == (o = i.userData) ? void 0 : o.name) === t) return !0
                        }
                    } catch (c) {
                        a.e(c)
                    } finally {
                        a.f()
                    }
                    return !1
                })) : Promise.resolve(!1)
            }

            function Xa() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ha,
                    t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = (0, o.useState)([]),
                    r = I()(n, 2), a = r[0], i = r[1], c = (0, o.useState)(!1), u = I()(c, 2), l = u[0], s = u[1],
                    p = (0, o.useCallback)(Fr()(Yr().mark((function n() {
                        var r;
                        return Yr().wrap((function (n) {
                            for (; ;) switch (n.prev = n.next) {
                                case 0:
                                    if (e) {
                                        n.next = 2;
                                        break
                                    }
                                    return n.abrupt("return");
                                case 2:
                                    return n.prev = 2, s(!0), n.next = 6, Va(e, t);
                                case 6:
                                    r = n.sent, i(r), n.next = 14;
                                    break;
                                case 10:
                                    n.prev = 10, n.t0 = n.catch(2), i([]), oo.error("获取变量列表失败");
                                case 14:
                                    return n.prev = 14, s(!1), n.finish(14);
                                case 17:
                                case"end":
                                    return n.stop()
                            }
                        }), n, null, [[2, 10, 14, 17]])
                    }))), [e, t]);
                return (0, o.useEffect)((function () {
                    p()
                }), [p]), {varList: a, loading: l, fetch: p}
            }

            var Ka = ["children"];

            function Wa(e) {
                var t = e.children, n = Ke()(e, Ka);
                return o.createElement(L.Z, qe()({
                    closeIcon: o.createElement(We.Z, {
                        component: it.Z,
                        className: "icon-square",
                        style: {fontSize: 20}
                    }), placement: "right"
                }, n), t)
            }

            var Ja = L.Z.info, _a = L.Z.error, $a = L.Z.confirm, eo = null;
            Object.assign(Wa, {
                error: _a, info: Ja, confirm: $a, pin: function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ta;
                    if (window._isMounted) {
                        var t = o.createElement(xo, {
                            errMsg: e, cb: function () {
                                Ta(), eo.destroy(), eo = null
                            }
                        });
                        return eo ? eo.update({content: t}) : eo = L.Z.info({
                            icon: null,
                            title: null,
                            content: t,
                            closeIcon: o.createElement(We.Z, {
                                component: it.Z,
                                className: "icon-square",
                                style: {fontSize: 20}
                            }),
                            okButtonProps: null,
                            className: "pin-modal",
                            zIndex: 9999
                        }), eo
                    }
                }
            });
            const to = Wa;
            var no = n(1642);

            function ro(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ao(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ro(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ro(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            no.ZP.config({maxCount: 3});
            const oo = {
                success: function (e, t) {
                    return no.ZP.success(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Success, {style: {fontSize: 16}})
                    }, t))
                }, error: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return no.ZP.error(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Error, {style: {fontSize: 16}})
                    }, t))
                }, info: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return no.ZP.info(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Info, {style: {fontSize: 16}})
                    }, t))
                }, warning: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return no.ZP.info(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Warning, {style: {fontSize: 16}})
                    }, t))
                }, warn: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return no.ZP.info(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Warning, {style: {fontSize: 16}})
                    }, t))
                }, loading: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return no.ZP.info(ao({
                        duration: 3,
                        content: e,
                        icon: o.createElement(kn.Loading, {className: "icon-rotate"})
                    }, t))
                }, destroy: function (e) {
                    no.ZP.destroy(e)
                }
            };
            var io = n(36214), co = ["children", "options", "value", "onChange"];

            function uo(e) {
                e.children;
                var t = e.options, n = e.value, r = void 0 === n ? [] : n, i = e.onChange, c = Ke()(e, co);
                return o.createElement(Ro, {onChange: i}, (function (e) {
                    return o.createElement(xn.Z, qe()({
                        mode: "multiple",
                        showSearch: !1,
                        value: r,
                        className: "ant-select-custom",
                        maxTagCount: "responsive"
                    }, c, {
                        onDropdownVisibleChange: Jd.lockScroll, options: t, dropdownRender: function () {
                            return o.createElement("div", {
                                className: "ant-select-dropdown-custommenu",
                                onMouseDown: function (e) {
                                    e.preventDefault(), e.stopPropagation()
                                }
                            }, t.map((function (t) {
                                return o.createElement("div", {
                                    key: t.value,
                                    className: "ant-select-dropdown-custommenu-item"
                                }, o.createElement(Pn.Z, {
                                    checked: r.includes(t.value), onChange: function () {
                                        var n = a()(r);
                                        r.includes(t.value) ? n.splice(n.indexOf(t.value), 1) : n.push(t.value), e(n)
                                    }
                                }, t.label))
                            })))
                        }, suffixIcon: o.createElement(Nc, null), tagRender: function (t) {
                            var n = t.label, i = t.closable, c = t.value;
                            return o.createElement(io.Z, {
                                onMouseDown: function (e) {
                                    e.preventDefault(), e.stopPropagation()
                                }, closable: i, onClose: function () {
                                    var t = a()(r);
                                    r.includes(c) && t.splice(t.indexOf(c), 1), e(t)
                                }, closeIcon: o.createElement(jc, {style: {marginTop: 4}}), style: {marginRight: 3}
                            }, n)
                        }
                    }))
                }))
            }

            uo.Option = xn.Z.Option, uo.OptGroup = xn.Z.OptGroup;
            const lo = uo;
            var so = n(70321), po = ["trigger", "children"];
            const fo = function (e) {
                var t = e.trigger, n = e.children, r = Ke()(e, po), a = h();
                return o.createElement(so.Z, qe()({
                    "data-target": 1,
                    "data-id": zn.form,
                    trigger: t || (a ? "click" : "hover")
                }, r), n)
            };
            var mo = n(53807), vo = ["color", "overlayClassName", "hideWhenTouch", "destroyTooltipOnHide"];
            const ho = o.forwardRef((function (e, t) {
                var n = h(), r = e.color, a = void 0 === r ? "var(--bg)" : r, i = e.overlayClassName,
                    c = e.hideWhenTouch, u = void 0 !== c && c, l = e.destroyTooltipOnHide, s = void 0 === l || l,
                    p = Ke()(e, vo), f = ["mi-tip", i].filter(Boolean).join(" ");
                return n && u ? e.children : o.createElement(mo.Z, qe()({
                    ref: t,
                    overlayClassName: f,
                    color: a,
                    destroyTooltipOnHide: s
                }, p))
            }));
            var go = n(23279), yo = n.n(go), Ao = ["onChange", "onKeyDown", "wait"];
            const bo = o.memo((function (e) {
                var t = e.onChange, n = e.onKeyDown, r = e.wait, a = void 0 === r ? 100 : r, i = Ke()(e, Ao),
                    c = (0, o.useRef)(!1), u = (0, o.useMemo)((function () {
                        return yo()(t, a)
                    }), [t, a]), l = function (e) {
                        "compositionend" === e.type ? (c.current = !1, u(e.target.value)) : c.current = !0
                    }, s = (0, o.useCallback)((function (e) {
                        n ? n(e) : e.stopPropagation()
                    }), [n]);
                return o.createElement(jn.Z, qe()({
                    onCompositionStart: l, onCompositionEnd: l, onChange: function (e) {
                        c.current || u(e.target.value)
                    }
                }, i, {onKeyDown: s}))
            }));

            function Eo() {
                return Eo = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Eo.apply(this, arguments)
            }

            const Co = e => o.createElement("svg", Eo({
                width: "1em",
                height: "1em",
                viewBox: "0 0 14 14",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M10.195 4.606a.8.8 0 0 0-1.131 0L5.972 7.698 4.936 6.66a.8.8 0 0 0-1.131 1.132l1.6 1.601a.8.8 0 0 0 1.134 0l3.656-3.656a.8.8 0 0 0 0-1.132Z"
            }));

            function Oo(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function wo(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Oo(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Oo(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            const ko = function (e) {
                var t = e.checked, n = e.style, r = void 0 === n ? {} : n;
                return t ? o.createElement(We.Z, {
                    component: Co,
                    className: "icon-square",
                    style: wo({fontSize: 20, color: "white", background: "var(--primary-color)"}, r)
                }) : o.createElement(We.Z, {
                    component: Co,
                    className: T().isDark ? "icon-square-dark" : "icon-square",
                    style: wo({
                        fontSize: 20,
                        background: "rgba(0,0,0)",
                        opacity: T().isDark ? "1" : "0.08",
                        border: T().isDark ? "1px solid var(--border-color)" : ""
                    }, r)
                })
            };
            const xo = function (e) {
                var t = e.errMsg, n = e.cb, r = (0, o.useRef)(), a = (0, o.useState)([]), c = I()(a, 2), u = c[0],
                    l = c[1], s = (0, o.useMemo)((function () {
                        return u.length < 6
                    }), [u]), p = (0, o.useState)(!1), f = I()(p, 2), d = f[0], m = f[1], v = (0, o.useState)(!1),
                    h = I()(v, 2), g = h[0], y = h[1], A = (0, o.useRef)(""), b = (0, o.useCallback)((function (e) {
                        A.current = e, l(e)
                    }), []), E = (0, o.useState)(t), C = I()(E, 2), O = C[0], w = C[1];
                (0, o.useEffect)((function () {
                    w(t)
                }), [t]);
                var k = (0, o.useCallback)(Fr()(Yr().mark((function e() {
                    var t;
                    return Yr().wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                return e.prev = 0, m(!0), e.next = 4, Jd.gateway.init(A.current);
                            case 4:
                                m(!1), n(), e.next = 14;
                                break;
                            case 8:
                                e.prev = 8, e.t0 = e.catch(0), b(""), m(!1), null == (t = r.current) || t.focus(), w(e.t0.message);
                            case 14:
                            case"end":
                                return e.stop()
                        }
                    }), e, null, [[0, 8]])
                }))), [n, b]), x = (0, o.useCallback)((function (e) {
                    var t = e.target.value.replace(/[^\d]/g, "");
                    b(t), 6 === t.length && k()
                }), [k, b]), S = (0, o.useCallback)((function (e) {
                    [i.ArrowLeft, i.ArrowRight].includes(e.keyCode) && e.preventDefault()
                }), []);
                return o.createElement("div", {className: "pin-code"}, o.createElement("div", {className: "pin-tip"}, d ? o.createElement("span", null, o.createElement(kn.Loading, {className: "icon-rotate"}), " 登录码验证中") : O === ta ? o.createElement("span", null, "中枢连接断开，请输入 ", 6, " 位数字登录码") : o.createElement("span", null, o.createElement(kn.Error, {style: {fontSize: 16}}), " 中枢连接失败，请重新获取登录码")), o.createElement("div", {
                    className: "pin-form",
                    onClick: function () {
                        var e;
                        null == (e = r.current) || e.focus()
                    }
                }, o.createElement("input", {
                    ref: r,
                    maxLength: 6,
                    value: u,
                    inputMode: "tel",
                    type: "tel",
                    onFocus: function () {
                        return y(!0)
                    },
                    onBlur: function () {
                        return y(!1)
                    },
                    onChange: x,
                    onKeyDown: S,
                    disabled: !s,
                    className: "pin-code-input"
                }), Array(6).fill().map((function (e, t) {
                    return o.createElement("span", {
                        className: (0, Ge.Z)("code-input", {cursor: g && u.length === t}),
                        key: t
                    }, u[t])
                }))))
            };
            var So = function (e) {
                var t = e.onSearch, n = e.onInputKeyDown, r = e.placeholder, a = e.style, i = e.value, c = e.extra;
                return o.createElement("div", {
                    className: "common-filter",
                    style: a
                }, o.createElement(bo, {
                    className: "common-filter-left",
                    placeholder: r,
                    defaultValue: i,
                    prefix: o.createElement(We.Z, {className: "icon-search", component: Dt.Z}),
                    onChange: t,
                    onKeyDown: n
                }), c ? o.createElement("div", {className: "common-filter-right"}, c) : o.createElement(o.Fragment, null))
            };
            So.propTypes = {
                onSearch: Z().func.isRequired,
                onInputKeyDown: Z().func,
                placeholder: Z().string,
                value: Z().string,
                style: Z().object,
                extra: Z().element
            };
            const To = So;
            var Do = ["onChange", "children", "delay", "markForm"];
            var Po = function (e) {
                var t = e.onChange, n = e.children, r = e.delay, a = void 0 === r ? 0 : r, i = e.markForm,
                    c = void 0 === i || i, u = Ke()(e, Do), l = function () {
                        var e = (0, o.useRef)(null), t = (0, o.useState)(""), n = I()(t, 2), r = n[0], a = n[1];
                        return (0, o.useEffect)((function () {
                            if (e.current) {
                                var t = e.current.closest("[data-type=card]");
                                t && a(t.dataset.id)
                            }
                        }), []), [e, r]
                    }(), s = I()(l, 2), p = s[0], f = s[1], d = (0, o.useRef)(null), m = (0, o.useRef)(null),
                    v = (0, o.useCallback)((function () {
                        f ? (d.current && clearTimeout(d.current), null == m.current && (m.current = (0, U.cloneDeep)(Ur(Jd.data, f))), (0, U.isFunction)(t) && t.apply(void 0, arguments), d.current = setTimeout((function () {
                            var e = (0, U.cloneDeep)(Ur(Jd.data, f));
                            (m.current || e) && (Jd.actionManager.pushCardPropsUpdateAction(m.current, (0, U.cloneDeep)(Ur(Jd.data, f))), m.current = null)
                        }), a)) : (0, U.isFunction)(t) && t.apply(void 0, arguments)
                    }), [t, f, a]);
                return o.createElement("div", qe()({ref: p}, u, c ? {"data-target": 1, "data-id": zn.form} : {}), n(v))
            };
            const Ro = (0, o.memo)(Po);
            var Bo = n(97573), Io = ["onChange"];
            const jo = function (e) {
                var t = e.onChange, n = Ke()(e, Io);
                return o.createElement(Ro, {onChange: t}, (function (e) {
                    return o.createElement(Bo.Z, qe()({}, n, {onChange: e}))
                }))
            };
            n(60207);
            var No = new Map, Lo = function (e, t) {
                var n = No.get(e);
                return n || (n = new Set, No.set(e, n)), n.add(t), function () {
                    n.delete(t), 0 === n.size && No.delete(e)
                }
            }, Qo = function (e) {
                var t = No.get(e);
                t && t.forEach((function (e) {
                    return e()
                }))
            }, Mo = "refreshVars", Zo = ["desc"], Vo = "var", Ho = "expr", Fo = {
                abs: {argc: 1, desc: "取绝对值"},
                pow: {argc: 2, desc: "x的y次方"},
                log: {argc: 2, desc: "以x为底y的对数"},
                sin: {argc: 1, desc: "正弦（单位为弧度）"},
                cos: {argc: 1, desc: "余弦（单位为弧度）"},
                tan: {argc: 1, desc: "正切（单位为弧度）"},
                asin: {argc: 1, desc: "反正弦（单位为弧度）"},
                acos: {argc: 1, desc: "反余弦（单位为弧度）"},
                atan: {argc: 1, desc: "反正切（单位为弧度）"},
                max: {minArgc: 1, desc: "取最大值"},
                min: {minArgc: 1, desc: "取最小值"},
                round: {argc: 1, desc: "四舍五入取整"},
                floor: {argc: 1, desc: "向下取整"},
                ceil: {argc: 1, desc: "向上取整"},
                rand: {argc: 0, desc: "随机数 0-1"},
                now: {argc: 0, desc: "此刻时间戳,ms"},
                year: {argc: 0, desc: "当前年"},
                month: {argc: 0, desc: "当前月 1-12"},
                date: {argc: 0, desc: "当前日期 从1开始"},
                day: {argc: 0, desc: "当前星期 0-6对应周日到周六"},
                hours: {argc: 0, desc: "当前小时 0-23"},
                minutes: {argc: 0, desc: "当前分钟 0-59"},
                seconds: {argc: 0, desc: "当前秒 0-59"},
                e: {argc: 0, desc: "自然常数"},
                pi: {argc: 0, desc: "圆周率"},
                randint: {argc: 2, desc: "随机整数 x-y"}
            }, Go = ["x", "y", "z"], Yo = function (e, t) {
                var n = t.argc, r = t.minArgc;
                return (0, U.isNumber)(n) ? "".concat(e, "(").concat(Go.slice(0, n).join(","), ")") : (0, U.isNumber)(r) ? "".concat(e, "(x0,x1,...)") : "".concat(e, "()")
            }, zo = function () {
                return e = Fo, t = [], Object.keys(e).forEach((function (n) {
                    var r = e[n], a = r.desc, o = Ke()(r, Zo);
                    t.push({
                        id: n,
                        expr: "".concat(n, "()"),
                        label: Yo(n, o),
                        desc: a,
                        hasArg: (0, U.isNumber)(o.argc) && o.argc > 0 || (0, U.isNumber)(o.minArgc)
                    })
                })), t;
                var e, t
            }, Uo = function (e) {
                return (0, U.isObject)(e) && "id" in e && "scope" in e
            }, qo = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = t[e];
                return n ? {label: n.label, scope: n.scope, id: e} : t.loading ? {
                    loading: !0,
                    label: "加载中...",
                    id: e
                } : {lost: !0, label: "变量已丢失", id: e}
            };

            function Xo(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ko(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Xo(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xo(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Wo(e) {
                var t = (0, o.useState)(""), n = I()(t, 2), r = n[0], i = n[1], c = (0, o.useState)([]), u = I()(c, 2),
                    l = u[0], s = u[1], p = (0, o.useState)([]), f = I()(p, 2), d = f[0], m = f[1],
                    v = (0, o.useState)(!0), h = I()(v, 2), g = h[0], y = h[1], A = (0, o.useCallback)((function () {
                        return y(!0), Jd.varTool.getGraphRawAvailVars(Jd.graphTool.id, !0).then((function (e) {
                            var t = I()(e, 2), n = t[0], r = t[1];
                            s(n), m(r)
                        })).finally((function () {
                            y(!1)
                        }))
                    }), [Jd.graphTool.id]);
                (0, o.useEffect)((function () {
                    A()
                }), [A]), (0, o.useEffect)((function () {
                    return Lo(Mo, A)
                }), [A]);
                var b = (0, o.useCallback)((function (t) {
                    return !e || t.type === e
                }), [e]), E = (0, o.useCallback)((function (e) {
                    var t;
                    return !(null == (t = e.userData) || !t.name) && e.userData.name.toLowerCase().includes(r.trim().toLowerCase())
                }), [r]), C = (0, o.useMemo)((function () {
                    return d.filter(b)
                }), [d, b]), O = (0, o.useMemo)((function () {
                    return l.filter(b)
                }), [l, b]), w = (0, o.useMemo)((function () {
                    return [C.filter(E), O.filter(E)]
                }), [C, O, E]), k = I()(w, 2), x = k[0], S = k[1], T = (0, o.useMemo)((function () {
                    return Jd.varTool.makeVarOptions([].concat(a()(C), a()(O)))
                }), [C, O]), D = (0, o.useMemo)((function () {
                    return Ko(Ko({}, Jd.varTool.makeVarMap(T)), {}, {loading: g})
                }), [T, g]);
                return {
                    fetch: A,
                    displayedGlobalVars: x,
                    displayedLocalRuleVars: S,
                    varOptions: T,
                    varMap: D,
                    keyword: r,
                    loading: g,
                    setKeyword: i
                }
            }

            function Jo() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
                    n = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0,
                    a = (0, o.useState)(e), c = I()(a, 2), u = c[0], l = c[1], s = (0, o.useRef)(!1),
                    p = (0, o.useRef)(), f = (0, o.useRef)(e), d = (0, o.useRef)(r);
                (0, o.useEffect)((function () {
                    f.current = u
                }), [u]), (0, o.useEffect)((function () {
                    d.current = r
                }), [r]);
                var m = or((function (e) {
                    var n = (0, U.isFunction)(e) ? e(u) : e;
                    l(n = (n % t + t) % t)
                }), [u, t]), v = (0, o.useCallback)((function () {
                    return s.current
                })), h = or(n);
                return (0, o.useEffect)((function () {
                    m(e)
                }), [e, t]), (0, o.useEffect)((function () {
                    return cr(document, "keydown", (function (e) {
                        if (!d.current) {
                            var t = e.keyCode;
                            [i.ArrowUp, i.ArrowDown].includes(t) && (p.current && clearTimeout(p.current), s.current = !0, p.current = setTimeout((function () {
                                s.current = !1, p.current = null
                            }), 50)), t === i.ArrowUp ? m((function (e) {
                                return e - 1
                            })) : t === i.ArrowDown ? m((function (e) {
                                return e + 1
                            })) : t === i.Enter && (null == h || h(f.current))
                        }
                    }))
                }), []), {index: u, setIndex: m, isKeyActive: v}
            }

            const _o = function (e) {
                var t = (0, o.useState)(.04), n = I()(t, 2), r = n[0], a = n[1];
                return o.createElement("svg", qe()({
                    className: "icon-circle cursor-pointer icon-grey",
                    width: "20",
                    height: "20"
                }, e, {
                    viewBox: "0 0 21 20", xmlns: "http://www.w3.org/2000/svg", onMouseEnter: function () {
                        a(.08)
                    }, onMouseLeave: function () {
                        a(.04)
                    }
                }), o.createElement("path", {
                    d: "M10.3636 19C15.3342 19 19.3636 14.9706 19.3636 10C19.3636 5.02944 15.3342 1 10.3636 1C5.39309 1 1.36365 5.02944 1.36365 10C1.36365 14.9706 5.39309 19 10.3636 19Z",
                    fillOpacity: r,
                    fill: "currentColor"
                }), o.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M10.3636 14C9.92181 14 9.56364 13.6418 9.56364 13.2L9.56364 10.8H7.16365C6.72182 10.8 6.36365 10.4418 6.36365 10C6.36365 9.55817 6.72182 9.2 7.16365 9.2L9.56364 9.2L9.56364 6.8C9.56364 6.35817 9.92181 6 10.3636 6C10.8055 6 11.1636 6.35817 11.1636 6.8L11.1636 9.2L13.5636 9.2C14.0055 9.2 14.3636 9.55817 14.3636 10C14.3636 10.4418 14.0055 10.8 13.5636 10.8H11.1636L11.1636 13.2C11.1636 13.6418 10.8055 14 10.3636 14Z",
                    fillOpacity: .4,
                    fill: "currentColor"
                }))
            };
            var $o = function (e) {
                var t = e.globalVars, n = e.localRuleVars, r = e.value, a = e.varType, c = e.onSelect, u = e.onSearch,
                    l = e.onFinish, s = e.keyword, p = e.showAddVars, f = void 0 !== p && p, d = e.showSearch,
                    m = void 0 === d || d, v = (0, o.useRef)(), h = Fa(), g = (0, o.useState)(!1), y = I()(g, 2),
                    A = y[0], b = y[1], E = (0, o.useMemo)((function () {
                        return n.concat(t)
                    }), [n, t]), C = (0, o.useCallback)((function (e) {
                        var t = E[e];
                        t && (null == c || c(t))
                    }), [E]), O = Jo((0, o.useMemo)((function () {
                        if (!r) return 0;
                        var e = E.findIndex((function (e) {
                            return e.id === r
                        }));
                        return Math.max(0, e)
                    })), E.length, C, A), w = O.index, k = O.setIndex, x = O.isKeyActive;
                (0, o.useEffect)((function () {
                    var e = v.current;
                    if (e) {
                        var t = e.querySelectorAll(".var-selector-item")[w];
                        null == t || t.scrollIntoView({block: w < 1 ? "end" : "nearest", inline: "nearest"})
                    }
                }), [w]);
                var S = (0, o.useCallback)((function (e) {
                    var t = e.startIdx;
                    return e.varList.map((function (e, n) {
                        var r;
                        return o.createElement("div", {
                            className: (0, Ge.Z)("var-selector-item", {
                                selected: w === t + n,
                                disabled: a && e.type !== a
                            }), key: e.id, onClick: function () {
                                a && e.type !== a || (null == c || c(e), k(t + n))
                            }, onMouseEnter: function () {
                                x() || k(t + n)
                            }
                        }, (null == (r = e.userData) ? void 0 : r.name) || "")
                    }))
                }), [w, a, c, x]), T = (0, o.useCallback)((function (e) {
                    [i.ArrowDown, i.ArrowUp, i.Enter].includes(e.keyCode) ? e.preventDefault() : e.stopPropagation()
                }), []), D = (0, o.useCallback)((function (e) {
                    b(e)
                }));
                return o.createElement("div", {
                    ref: v, onPointerDown: function (e) {
                        e.stopPropagation()
                    }
                }, m && o.createElement(To, {
                    placeholder: "查找",
                    value: s,
                    onSearch: u,
                    onInputKeyDown: T,
                    extra: f ? o.createElement(Tc, {
                        title: "创建变量",
                        virtual: !0,
                        defaultName: s,
                        defaultType: a,
                        typeFixed: !0,
                        scopeSelectable: !0,
                        scope: h,
                        onFinish: l,
                        onVisibleChange: D,
                        slot: function (e) {
                            var t = e.open;
                            return o.createElement(_o, {
                                className: "icon-square nohover",
                                style: {marginRight: 8},
                                onClick: function () {
                                    t()
                                }
                            })
                        }
                    }) : null
                }), o.createElement("div", {className: "var-selector-dropdown-list"}, o.createElement("div", {className: "var-selector-title"}, "本规则变量"), o.createElement("div", {className: "var-selector-item-list"}, S({
                    varList: n,
                    startIdx: 0
                })), o.createElement("div", {className: "var-selector-title"}, "全局变量"), o.createElement("div", {className: "var-selector-item-list"}, S({
                    varList: t,
                    startIdx: n.length
                }))))
            };
            const ei = (0, o.memo)($o);
            var ti = function (e) {
                var t = e.options, n = e.onSelect, r = (0, o.useRef)(), a = (0, o.useCallback)((function (e) {
                    var r = t[e];
                    r && (null == n || n(r))
                }), [t]), i = Jo(0, t.length, a), c = i.index, u = i.setIndex, l = i.isKeyActive;
                return (0, o.useEffect)((function () {
                    var e = r.current;
                    if (e) {
                        var t = e.querySelectorAll(".expr-selector-item")[c];
                        null == t || t.scrollIntoView({block: "nearest", inline: "nearest"})
                    }
                }), [c]), o.createElement("div", {
                    className: "var-expr-dropdown-list",
                    ref: r
                }, t.length > 0 ? t.map((function (e, t) {
                    return o.createElement("div", {
                        className: (0, Ge.Z)("expr-selector-item", {active: c === t}),
                        key: e.id,
                        onClick: function () {
                            null == n || n(e), u(t)
                        },
                        onMouseEnter: function () {
                            l() || u(t)
                        }
                    }, o.createElement("span", {className: "expr-label"}, e.label), o.createElement("span", {className: "expr-desc"}, e.desc))
                })) : o.createElement("div", {className: "expr-selector-no-match-item"}, "无匹配选项"))
            };
            ti.propTypes = {options: Z().array.isRequired, onSelect: Z().func};
            const ni = (0, o.memo)(ti);
            n(18706), n(84441);

            function ri(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var ai = null, oi = 0, ii = 0, ci = !1, ui = !1, li = 0, si = 0, pi = 1, fi = 0, di = 0, mi = 0, vi = 0,
                hi = 0, gi = 0, yi = 0, Ai = 0, bi = -1, Ei = 0, Ci = {
                    left: 1,
                    right: 2,
                    left_right: 3,
                    middle: 4,
                    left_middle: 5,
                    middle_right: 6,
                    left_middle_right: 7
                }, Oi = 1, wi = 2, ki = "down", xi = "move", Si = "up", Ti = {
                    POSITION: "position",
                    CONTAINER_SIZE_UPDATE: "containerSizeUpdate",
                    RIGHT_KEY_MENU: "rightKeyMenu",
                    CONNECTING_LINE: "connectingLine",
                    GLOBAL_STATUS_UPDATE: "globalStatusUpdate",
                    MASK_UPDATE: "maskUpdate",
                    RESTORE_SUCCESS: "restoreSuccess",
                    ADD_TAB: "addTab",
                    UPDATE_TAB: "updateTab",
                    REMOVE_TAB: "removeTab",
                    ADD_CHANGED_TAB: "addChangedTab",
                    REMOVE_CHANGED_TAB: "removeChangedTab",
                    TOGGLE_CREATE_VISIBLE: "toggleCreateVisible",
                    TOGGLE_HELP_VISIBLE: "toggleHelpVisible",
                    TOGGLE_LOG_VISIBLE: "toggleLogVisible",
                    LOG_BAR_UPDATE: "logBarUpdate",
                    LOG_BAR_CLICK: "logBarClick",
                    LOG_DATA_UPDATE: "logDataUpdate",
                    TOGGLE_SETTING_VISIBLE: "toggleSettingVisible"
                }, Di = new Map;

            function Pi(e, t) {
                if (!Object.values(Ti).includes(e)) return function () {
                };
                var n = Di.get(e) || [];
                n.push(t), Di.set(e, n);
                var r = n.length - 1;
                return function () {
                    var t = Di.get(e);
                    t && t.splice(r, 1)
                }
            }

            function Ri(e) {
                for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
                Object.values(Ti).includes(e) && (Di.get(e) || []).forEach((function (e) {
                    return e.apply(void 0, n)
                }))
            }

            function Bi(e, t) {
                if (Array.isArray(e)) {
                    for (var n = 0, r = 0, a = 0; a < e.length; a++) {
                        if ((0, U.isNumber)(e[a]) && (0, U.isNumber)(t[a])) n += e[a] - t[a], r++
                    }
                    return 0 === r ? 0 : n / r
                }
                return e - t
            }

            const Ii = function (e) {
                J()(n, e);
                var t = ri(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "keyWorkLoop", value: function (e, t) {
                        var n = e.keyCode;
                        t === ki && (bi = n, n === i.Space && this.parent.rootCursor("grabbing")), t === Si && (bi = -1, this.parent.rootCursor())
                    }
                }, {
                    key: "middleMouseWorkLoop", value: function (e, t) {
                        if (this.checkMouse(e, t)) {
                            var n = this.parent.target.type, r = this.parent.coordinateTool.standard(e);
                            this[n] && this[n](e, r), update()
                        }
                    }
                }, {
                    key: "checkMouse", value: function (e, t) {
                        if (!this.parent.target.type) return !1;
                        var n = (new Date).getTime();
                        return e.constructor === window.TouchEvent && (Ei = n), !(e.constructor === MouseEvent && n - Ei < 5e3)
                    }
                }, {
                    key: "setLongTapTimer", value: function (e) {
                        var t = this;
                        this.clearLongTapTimer();
                        var n = this.parent, r = n.settings, a = n.target;
                        r.contentEditable === a.id || a.id.startsWith(zn.toolbox) || d(e) || (ai = setTimeout((function () {
                            t.parent.events.rightKeyDown.run(e, t.parent.coordinateTool.standard(e))
                        }), 600))
                    }
                }, {
                    key: "clearLongTapTimer", value: function () {
                        ai && clearTimeout(ai), ai = null
                    }
                }, {
                    key: "onRealMove", value: function () {
                        this.clearLongTapTimer(), Ri(Ti.RIGHT_KEY_MENU, !1)
                    }
                }, {
                    key: "workLoop", value: function (e, t) {
                        if (this.checkMouse(e, t)) {
                            var n = this.parent.target.type, r = this.parent.coordinateTool.standard(e);
                            if (this.startCollectBehaviorData(e, t), t === ki) {
                                if (n === zn.element && this.parent.lockScroll(!0), this.parent.eventManagerTool.isPc(e) && [Ci.left_right, Ci.left_middle, Ci.left_middle_right].includes(e.buttons)) return this.parent.events.mouseUp[n] && this.parent.events.mouseUp[n](e, r), void update();
                                if (this.parent.eventManagerTool.isPc(e) && e.buttons === Ci.right) return void this.parent.events.rightKeyDown.run(e);
                                if (this.parent.eventManagerTool.isPc(e) && e.buttons === Ci.middle) return void this.parent.events.middleKeyDown.run(e)
                            }
                            if (t === xi) {
                                if (this.parent.eventManagerTool.isPc(e) && e.buttons === Ci.middle) return void this.parent.events.middleKeyMove.run(e);
                                if (this.parent.eventManagerTool.isPc(e) && e.buttons === Ci.right) return void this.parent.events.rightKeyMove.run(e)
                            }
                            if (t === Si) {
                                if (n === zn.element && this.parent.lockScroll(!1), this.parent.eventManagerTool.isPc(e) && e.button === Oi) return void this.parent.events.middleKeyUp.run(e, r);
                                if (this.parent.eventManagerTool.isPc(e) && e.button === wi) return void this.parent.events.rightKeyUp.run(e, r)
                            }
                            Ri(Ti.POSITION, e, t, r);
                            var a = this.getKeyBehavior().currentDownKeyCode,
                                o = [i.Shift, i.Ctrl, i.Command].includes(a);
                            this[n] && (e && (e.isMultipleSelect = o), this[n](e, r), update())
                        } else this.clearLongTapTimer()
                    }
                }, {
                    key: "setTwiceTime", value: function (e) {
                        ii = (new Date).getTime()
                    }
                }, {
                    key: "checkTwiceClick", value: function (e) {
                        return !!ii && ((new Date).getTime() - ii < 200 && (ii = 0, !0))
                    }
                }, {
                    key: "startCollectBehaviorData", value: function (e, t) {
                        var n = this.parent.coordinateTool.getOriPosition(e);
                        t === ki && (this.parent.target.type !== zn.form && (document.activeElement.classList.contains("ql-editor") || document.activeElement.blur()), oi = (new Date).getTime(), this.setLongTapTimer(e), mi = n.x, vi = n.y, fi = 0, di = 0, hi = yi = n.x, gi = Ai = n.y);
                        if (t === xi) {
                            if (li = Bi(n.x, hi), si = Bi(n.y, gi), (Math.abs(Bi(n.x, yi)) >= 5 || Math.abs(Bi(n.y, Ai)) >= 5) && this.onRealMove(), n.x.length > 1) {
                                var r = Math.pow(Math.pow(hi[1] - hi[0], 2) + Math.pow(gi[1] - gi[0], 2), .5),
                                    a = Math.pow(Math.pow(n.x[1] - n.x[0], 2) + Math.pow(n.y[1] - n.y[0], 2), .5);
                                pi = a / r;
                                var o = (hi[0] - n.x[0]) * (hi[1] - n.x[1]) > 0,
                                    i = (gi[0] - n.y[0]) * (gi[1] - n.y[1]) > 0;
                                ui = !(!o && !i)
                            }
                            hi = n.x, gi = n.y
                        }
                        t === Si && (this.clearLongTapTimer(), fi = Bi(n.x, mi), di = Bi(n.y, vi), mi = 0, vi = 0, hi = gi = yi = Ai = 0, li = 0, si = 0, pi = 1, ci = !1, ui = !1, oi || (ci = !0), (new Date).getTime() - oi < 200 && (ci = !0))
                    }
                }, {
                    key: "getBehavior", value: function () {
                        return {
                            dx: li,
                            dy: si,
                            ds: pi,
                            isClick: ci,
                            isTwoFingerMove: ui,
                            prePointX: hi,
                            prePointY: gi,
                            disX: fi,
                            disY: di
                        }
                    }
                }, {
                    key: "getKeyBehavior", value: function () {
                        return {currentDownKeyCode: bi}
                    }
                }]), n
            }(Wr);
            var ji = ["tooltip", "simple", "data", "maxCount", "responsive", "style", "className", "extraGap"];

            function Ni(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Li(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ni(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ni(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Qi = Be, Mi = function (e) {
                var t = e.tooltip, n = void 0 !== t && t, r = e.simple, a = void 0 === r || r, i = e.data,
                    c = e.maxCount, u = void 0 === c ? 0 : c, l = e.responsive, s = void 0 === l ? 0 : l, p = e.style,
                    f = e.className, d = e.extraGap, m = void 0 === d ? 0 : d, v = Ke()(e, ji), h = (0, o.useRef)(),
                    g = (0, o.useState)({}), y = I()(g, 2), A = y[0], b = y[1];
                if ((0, o.useEffect)((function () {
                    var e = h.current;
                    if (!(s <= 0 || !i || i.loading) && e) {
                        var t = getComputedStyle(e).fontSize, n = s * parseFloat(t), r = e.offsetWidth,
                            a = e.scrollWidth;
                        r < n && b({maxWidth: Math.min(n, a), flexShrink: 0})
                    }
                }), [i, s]), !i) return o.createElement("span", {ref: h});
                var E = ba(i.scope), C = i.lost || !i.label, O = C ? i.label || "变量已丢失" : i.label,
                    w = Li(Li(Li(Li({maxWidth: "calc(100% - ".concat(2 * Qi + m, "px)")}, a ? {
                        paddingLeft: Qi,
                        paddingRight: Qi
                    } : {}), A), p), u > 0 ? {maxWidth: "".concat(u, "em")} : {}), k = o.createElement("span", qe()({
                        ref: h,
                        "data-id": i.id,
                        className: (0, Ge.Z)("common-var-tag", H()(H()(H()({}, f, f), "lost", C), "global", E)),
                        style: w
                    }, v), O);
                return n && !C ? o.createElement(ho, {
                    hideWhenTouch: !0,
                    title: o.createElement(o.Fragment, null, O, i.scope && (ba(i.scope) ? "（全局变量）" : "（本规则变量）")),
                    placement: "top"
                }, k) : k
            };
            Mi.propTypes = {
                data: Z().object,
                maxCount: Z().number,
                responsive: Z().number,
                tooltip: Z().bool,
                simple: Z().bool,
                className: Z().string,
                style: Z().any
            };
            const Zi = (0, o.memo)(Mi);
            var Vi = "$", Hi = "(", Fi = "+-*/%".split(""), Gi = /[a-zA-Z]/, Yi = function (e) {
                var t = [], n = [], r = function () {
                    n.length > 0 && (t.push({type: ya, value: n.join("")}), n.length = 0)
                };
                return e.forEach((function (e) {
                    (0, U.isString)(e) ? n.push(e) : (r(), t.push(e))
                })), r(), t
            }, zi = function (e, t) {
                return {idx: t, value: e}
            }, Ui = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                return e.map((function (e) {
                    return (0, U.isString)(e) ? e : t ? Vi : "Ũ"
                })).join("")
            }, qi = function (e, t) {
                return e - t
            }, Xi = (0, o.forwardRef)((function (e, t) {
                var n = e.value, r = void 0 === n ? [] : n, i = e.onHistoryChange, c = e.loading, u = void 0 !== c && c,
                    l = e.varMap, s = e.status, p = e.style, f = e.disabled, d = e.placeholder,
                    m = void 0 === d ? "请输入内容" : d, v = e.onTriggerVarPopup, h = e.onTriggerExprPopup,
                    g = e.onKeyDown, y = e.onHeightChange, A = (0, o.useRef)(null), b = (0, o.useRef)(null),
                    E = (0, o.useRef)(null), C = (0, o.useState)(-1), O = I()(C, 2), w = O[0], k = O[1],
                    x = (0, o.useState)(-1), S = I()(x, 2), T = S[0], D = S[1], P = (0, o.useState)(!1), R = I()(P, 2),
                    B = R[0], j = R[1], N = (0, o.useMemo)((function () {
                        return T > w
                    }), [w, T]), L = (0, o.useMemo)((function () {
                        return !N && B
                    }), [N, B]), Q = (0, o.useMemo)((function () {
                        return !!h
                    }), [h]), M = (0, o.useRef)(0), Z = or(y);
                (0, o.useEffect)((function () {
                    if (!u && A.current) {
                        var e = A.current.scrollHeight;
                        M.current !== e && (M.current = e, Z(e))
                    }
                }), [r, u]);
                var V = (0, o.useMemo)((function () {
                    return r.reduce((function (e, t) {
                        return t.type === ya ? e.concat(t.value.split("")) : t.type === Aa ? e.concat(t) : e
                    }), [])
                }), [r]), F = (0, o.useMemo)((function () {
                    return function (e, t) {
                        if (!t) return e.map((function (e, t) {
                            return zi(e, t)
                        }));
                        var n = [], r = [], a = function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            r.length > 0 && (e || n.push.apply(n, r), r.length = 0)
                        }, o = function () {
                            r.length > 0 && (n.push(r.slice(0)), a(!0))
                        };
                        return e.forEach((function (t, i) {
                            if (Gi.test(t)) r.push(zi(t, i)); else {
                                if (r.length > 0 && Hi === t && r[r.length - 1].value !== Hi) return r.push(zi(t, i)), void (")" !== e[i + 1] && o());
                                if (r.length > 0 && ")" === t && r[r.length - 1].value === Hi) return r.push(zi(t, i)), void o();
                                a(), n.push(zi(t, i))
                            }
                        })), o(), n
                    }(V, Q)
                }), [V, Q]), G = (0, o.useCallback)((function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;
                    k(e), D(t)
                }), []), Y = (0, o.useRef)((function () {
                    var e = b.current;
                    return {input: e, curCursorStart: e.selectionStart, curCursorEnd: e.selectionEnd}
                })), z = (0, o.useCallback)((function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;
                    G(e, t);
                    var n = b.current;
                    n.selectionStart = e, n.selectionEnd = t, n.focus()
                }), [G]), q = (0, o.useMemo)((function () {
                    return Ui(V)
                }), [V]);
                (0, o.useEffect)((function () {
                    b.current.value = q
                }), [q]);
                var X = (0, o.useRef)((function () {
                    var e = Y.current(), t = e.input, n = e.curCursorStart, r = e.curCursorEnd, a = t.value,
                        o = a.slice(0, r), i = o.lastIndexOf("Ũ"), c = o.lastIndexOf(" "), u = o.lastIndexOf(Vi),
                        l = Fi.reduce((function (e, t) {
                            return Math.max(e, o.lastIndexOf(t))
                        }), -1);
                    return u <= Math.max(i, c, l) ? {
                        symbolIndex: -1,
                        charsAfterSymbol: "",
                        curCursorStart: n,
                        curCursorEnd: r
                    } : {symbolIndex: u, charsAfterSymbol: a.slice(u + 1, r), curCursorStart: n, curCursorEnd: r}
                })), K = (0, o.useRef)((function () {
                    var e = Y.current(), t = e.input, n = e.curCursorStart, r = e.curCursorEnd, a = t.value,
                        o = a.charAt(n - 1);
                    if (Gi.test(o)) {
                        for (var i = n - 1, c = a.slice(0, n), u = c.length - 1; u >= 0; u -= 1) {
                            if (!Gi.test(c[u])) {
                                i = u + 1;
                                break
                            }
                            i = u
                        }
                        return {exprIndex: i, matchedChars: a.slice(i, n), curCursorStart: n, curCursorEnd: r}
                    }
                    return {exprIndex: -1, matchedChars: "", curCursorStart: n, curCursorEnd: r}
                })), W = (0, o.useCallback)((function (e) {
                    var t = Y.current(), n = t.input, r = t.curCursorStart, a = t.curCursorEnd, o = n.value;
                    if (r === a) {
                        var i = o.charAt(r - 1);
                        if (i === Vi) return void (null == v || v({
                            value: o,
                            start: r - 1,
                            end: r,
                            query: "",
                            visible: !0
                        }));
                        if (" " === i || Fi.includes(i)) return void (null == v || v({value: o, visible: !1}));
                        var c = X.current(), u = c.symbolIndex, l = c.charsAfterSymbol;
                        if (u > -1) return void (null == v || v({value: o, start: u, end: r, query: l, visible: !0}));
                        K.current().exprIndex < 0 && !e && v({value: o, visible: !1})
                    }
                }), [v]), J = (0, o.useCallback)((function () {
                    var e = Y.current(), t = e.input, n = e.curCursorStart, r = e.curCursorEnd, a = t.value;
                    if (n === r) {
                        var o = a.charAt(n - 1);
                        if (X.current().symbolIndex < 0) {
                            if (o === Hi) return;
                            if (Gi.test(o)) {
                                var i = K.current(), c = i.exprIndex, u = i.matchedChars;
                                null == h || h({value: a, start: c, end: n, query: u, visible: !0})
                            } else null == h || h({value: a, start: n, end: n, query: "", visible: !1})
                        }
                    }
                }), [h]), _ = (0, o.useRef)((function () {
                }));
                (0, o.useEffect)((function () {
                    _.current = function () {
                        var e = w, t = T, n = Y.current(), r = n.input, o = n.curCursorStart, c = n.curCursorEnd,
                            u = r.value;
                        if (W(Q), Q && J(), u.includes("Ũ")) {
                            if (e !== t || o !== c) if (e < t && o === c) {
                                if (e === o) {
                                    var l = V.slice(0, o), s = c - u.length, p = s < 0 ? V.slice(s) : [];
                                    i(Yi([].concat(a()(l), a()(p))))
                                } else if (e < o) {
                                    var f = V.slice(0, e), d = u.slice(e, o).split(""), m = V.slice(t);
                                    i(Yi([].concat(a()(f), a()(d), a()(m))))
                                }
                            } else ; else if (e > o) {
                                var v = V.slice(0, o), h = V.slice(e);
                                i(Yi([].concat(a()(v), a()(h))))
                            } else if (e === c && V.length > u.length) {
                                var g = V.slice(0, o), y = c - u.length, A = y < 0 ? V.slice(y) : [];
                                i(Yi([].concat(a()(g), a()(A))))
                            } else if (e < o) {
                                var b = V.slice(0, e), E = u.slice(e, o).split(""), C = V.slice(e);
                                i(Yi([].concat(a()(b), a()(E), a()(C))))
                            }
                        } else i(u.length > 0 ? [{type: ya, value: u}] : [])
                    }
                }), [i, V, w, T, h, W, J]);
                var $ = (0, o.useRef)(!1), ee = (0, o.useCallback)((function (e) {
                    "compositionend" === e.type ? ($.current = !1, _.current(i), ne.current()) : $.current = !0
                }), [i]), te = (0, o.useCallback)((function () {
                    $.current || _.current(i)
                }), [i]), ne = (0, o.useRef)((function () {
                })), re = (0, o.useRef)(w);
                (0, o.useEffect)((function () {
                    ne.current = function () {
                        var e = Y.current(), t = e.curCursorStart, n = e.curCursorEnd, r = re.current !== t ? t : n;
                        re.current = t, G(t, n);
                        var a = E.current.querySelector("span:nth-child(".concat(r + 1, ")"));
                        null == a || a.scrollIntoView({block: "nearest", inline: "nearest"}), W()
                    }
                }), [G, W]);
                var ae = (0, o.useCallback)((function () {
                    $.current || ne.current()
                }), []), oe = (0, o.useCallback)((function (e, t) {
                    var n = X.current(), r = n.symbolIndex, o = n.curCursorEnd;
                    if (!(r < 0)) {
                        var c = V.slice(0, r), u = V.slice(o);
                        i(Yi([].concat(a()(c), [{
                            type: Aa,
                            id: e.id,
                            scope: e.scope
                        }], a()(u)))), setTimeout((function () {
                            z(r + 1), t && t()
                        }), 0)
                    }
                }), [V, z, i]), ie = (0, o.useCallback)((function (e, t) {
                    var n = K.current(), r = n.exprIndex, o = n.curCursorStart, c = n.curCursorEnd, u = r > -1 ? r : o,
                        l = V.slice(0, u), s = V.slice(c);
                    i(Yi([].concat(a()(l), a()(e.expr.split("")), a()(s)))), setTimeout((function () {
                        z(u + e.expr.length - (e.hasArg ? 1 : 0)), t && t()
                    }), 0)
                }), [V, z, i]), ce = (0, o.useCallback)((function (e) {
                    var t = Y.current(), n = t.curCursorStart, r = t.curCursorEnd, o = V.slice(0, n), c = V.slice(r);
                    i(Yi([].concat(a()(o), [Vi], a()(c)))), setTimeout((function () {
                        z(n + 1), null == v || v({query: "", visible: !0}), e && e()
                    }), 0)
                }), [i]);
                (0, o.useImperativeHandle)(t, (function () {
                    return {insertSymbol: ce, insertOneVar: oe, insertOneFunc: ie}
                }), [ce, oe, ie]);
                var ue = (0, o.useCallback)((function (e) {
                    e.preventDefault();
                    var t = e.target;
                    t.setPointerCapture(e.pointerId);
                    var n = E.current, r = Y.current().curCursorStart, o = function () {
                        i(), c(), u(), t.releasePointerCapture(e.pointerId)
                    }, i = cr(t, "pointermove", (function (t) {
                        var o = t.clientY - e.clientY, i = a()(n.querySelectorAll(".char")).map((function (e) {
                            return e.getBoundingClientRect()
                        }));
                        if (o < 0) {
                            var c = r;
                            if (t.clientY < i[0].top) c = 0; else for (var u = 0; u < i.length; u += 1) if (t.clientY >= i[u].top && t.clientY <= i[u].bottom && t.clientX < i[u].left + i[u].width / 2) {
                                c = u;
                                break
                            }
                            z.apply(void 0, a()([r, c].sort(qi)))
                        } else {
                            var l = r;
                            if (t.clientY > i[i.length - 1].bottom) l = i.length; else for (var s = i.length - 1; s >= 0; s -= 1) if (t.clientY >= i[s].top && t.clientY <= i[s].bottom && t.clientX > i[s].left + i[s].width / 2) {
                                l = s + 1;
                                break
                            }
                            z.apply(void 0, a()([r, l].sort(qi)))
                        }
                    })), c = cr(t, "pointerup", o), u = cr(t, "pointercancel", o)
                }), [z]), le = or((function (e) {
                    e.preventDefault();
                    var t = Y.current(), n = t.curCursorStart, r = t.curCursorEnd, o = Ui(V.slice(n, r), !0);
                    if (e.clipboardData.setData("text", o), o.includes(Vi) && oo.warn("复制的内容暂不支持包含变量"), "cut" === e.type) {
                        var c = V.slice(0, n), u = V.slice(r);
                        i(Yi([].concat(a()(c), a()(u)))), setTimeout((function () {
                            z(n)
                        }), 0)
                    }
                }), [V, z, i]), se = (0, o.useMemo)((function () {
                    var e = function e(t, n) {
                        return Array.isArray(t) ? o.createElement("span", {
                            key: n,
                            className: "func"
                        }, t.map((function (t, n) {
                            return e(t, n)
                        }))) : o.createElement("span", {
                            key: n,
                            onPointerDown: function (e) {
                                if (e.isPrimary && e.buttons === Ci.left) {
                                    e.preventDefault();
                                    var n = e.target.getBoundingClientRect(),
                                        r = e.clientX - n.left > n.width / 2 ? 1 : 0, a = t.idx + r;
                                    if (e.shiftKey) {
                                        var o = Y.current(), i = o.curCursorStart, c = o.curCursorEnd;
                                        a >= i && a <= c && (a >= i + (c - i) / 2 ? z(i, a) : z(a, c)), a > c && z(i, a), a < i && z(a, c)
                                    } else z(a)
                                }
                            },
                            className: (0, Ge.Z)(["char", N ? {selected: t.idx >= w && t.idx < T} : {cursor: L && w === t.idx}])
                        }, (0, U.isString)(t.value) ? t.value : o.createElement(Zi, {
                            maxCount: 5,
                            tooltip: !0,
                            data: qo(t.value.id, l),
                            simple: !1
                        }))
                    };
                    return F.map((function (t, n) {
                        return e(t, n)
                    }))
                }), [F, z, N, w, T, L, l]);
                return o.createElement("div", {
                    ref: A,
                    style: p,
                    "data-target": 1,
                    "data-type": zn.form,
                    className: (0, Ge.Z)(["var-expr-input", H()({}, s, s)]),
                    onPointerDown: function (e) {
                        e.isPrimary && e.buttons === Ci.left && (e.preventDefault(), E.current.contains(e.target) && E.current !== e.target || z(q.length))
                    }
                }, o.createElement("input", {
                    ref: b, defaultValue: q, disabled: f, onFocus: function () {
                        j(!0)
                    }, onBlur: function () {
                        j(!1)
                    }, onCompositionStart: function (e) {
                        return ee(e)
                    }, onCompositionEnd: function (e) {
                        return ee(e)
                    }, onChange: function (e) {
                        return te(e)
                    }, onSelect: ae, onKeyDown: function (e) {
                        return null == g ? void 0 : g(e)
                    }, onCut: le, onCopy: le, className: "var-expr-input-hidden"
                }), o.createElement("div", {
                    ref: E, className: "var-expr-input-label", onWheel: function (e) {
                        !e.ctrlKey && Math.abs(e.deltaX) > 0 && e.stopPropagation()
                    }, onPointerDown: function (e) {
                        e.isPrimary && e.buttons === Ci.left && setTimeout((function () {
                            ue(e)
                        }), 0)
                    }
                }, se.concat(o.createElement("span", {
                    key: V.length,
                    className: (0, Ge.Z)(["tailer", {cursor: L && w === V.length}])
                }, "|")), 0 === V.length && o.createElement("span", {className: "expr-input-placeholder"}, m)))
            }));
            Xi.propTypes = {
                value: Z().array.isRequired,
                onHistoryChange: Z().func.isRequired,
                varMap: Z().object.isRequired,
                loading: Z().bool,
                style: Z().any,
                status: Z().string,
                disabled: Z().bool,
                placeholder: Z().string,
                onTriggerVarPopup: Z().func,
                onTriggerExprPopup: Z().func,
                onKeyDown: Z().func,
                onHeightChange: Z().func
            };
            const Ki = (0, o.memo)(Xi);
            var Wi = function (e) {
                var t = e.value, n = void 0 === t ? [] : t, r = e.onChange, a = e.style, c = e.disabled,
                    u = void 0 !== c && c, l = e.status, s = e.varType, p = e.showExpr, f = void 0 !== p && p,
                    m = e.onHeightChange, v = (0, o.useRef)(null), h = (0, o.useState)(!1), g = I()(h, 2), y = g[0],
                    A = g[1], b = (0, o.useState)(!1), E = I()(b, 2), C = E[0], O = E[1], w = (0, o.useState)(!1),
                    k = I()(w, 2), x = k[0], S = k[1], T = (0, o.useCallback)((function (e, t) {
                        var n = e === Vo, r = function (e) {
                            e && (A(n), O(!n))
                        };
                        S((function (e) {
                            if ((0, U.isBoolean)(t)) return r(t), t;
                            if (y && n || C && !n) return r(!e), !e;
                            return r(true), true
                        }))
                    }), [y, C]), D = Wo(s), P = D.displayedGlobalVars, R = D.displayedLocalRuleVars, B = D.varMap,
                    j = D.setKeyword, N = D.fetch, L = D.loading, Q = function () {
                        var e = (0, o.useState)(zo()), t = I()(e, 1)[0], n = (0, o.useState)(""), r = I()(n, 2), a = r[0],
                            i = r[1];
                        return {
                            displayedFuncOptions: (0, o.useMemo)((function () {
                                return t.filter((function (e) {
                                    return e.id.toLowerCase().includes((a || "").toLowerCase())
                                }))
                            }), [a]), keyword: a, setKeyword: i
                        }
                    }(), M = Q.displayedFuncOptions, Z = Q.setKeyword;
                (0, o.useEffect)((function () {
                    Jd.lockScroll(x)
                }), [x]);
                var V = (0, o.useRef)(null), H = (0, o.useRef)(null);
                (0, o.useEffect)((function () {
                    if (y || x) return N(), cr(document, "pointerdown", (function (e) {
                        [V.current, H.current].includes(e.target) || S(!1)
                    }))
                }), [y, x]);
                var F = (0, o.useCallback)((function (e) {
                    v.current.insertOneVar(e, (function () {
                        T(Vo, !1)
                    }))
                }), [T]), G = (0, o.useCallback)((function (e) {
                    v.current.insertOneFunc(e, (function () {
                        T(Ho, !1)
                    }))
                }), [T]), Y = (0, o.useCallback)((function (e) {
                    var t = e.query, n = void 0 === t ? "" : t, r = e.visible;
                    T(Vo, r), r && j(n)
                }), [T]), z = (0, o.useCallback)((function (e) {
                    var t = e.query, n = void 0 === t ? "" : t, r = e.visible;
                    T(Ho, r), r && Z(n)
                }), [T]);
                return o.createElement(Ro, {
                    className: "var-expr-input-wrap",
                    delay: 800,
                    onChange: r,
                    markForm: !1
                }, (function (e) {
                    return o.createElement(o.Fragment, null, o.createElement(so.Z, {
                        open: x,
                        destroyPopupOnHide: !0,
                        overlayClassName: "var-selector-dropdown",
                        dropdownRender: function () {
                            return o.createElement("div", {
                                className: "var-selector-dropdown-panel",
                                onPointerDown: function (e) {
                                    e.stopPropagation(), e.preventDefault()
                                }
                            }, y ? o.createElement(ei, {
                                showSearch: !1,
                                globalVars: P,
                                localRuleVars: R,
                                varType: s,
                                onSelect: function (t) {
                                    return F(t, e)
                                },
                                onSearch: j,
                                onFetch: N
                            }) : C && o.createElement(ni, {
                                options: M, onSelect: function (t) {
                                    return G(t, e)
                                }
                            }))
                        }
                    }, o.createElement(Ki, qe()({
                        ref: v,
                        "data-target": 1,
                        "data-type": zn.form,
                        style: a,
                        disabled: u,
                        status: l,
                        varMap: B,
                        value: n,
                        loading: L,
                        onKeyDown: function (e) {
                            d(e) && [i.Char_Z, i.Char_Y].includes(e.keyCode) || x && [i.ArrowDown, i.ArrowUp, i.Enter].includes(e.keyCode) ? e.preventDefault() : e.stopPropagation()
                        },
                        onHistoryChange: e,
                        onTriggerVarPopup: Y
                    }, f ? {onTriggerExprPopup: z} : {}, {onHeightChange: m}))), o.createElement(kn.Vars, {
                        "data-target": 1,
                        "data-type": zn.form,
                        className: (0, Ge.Z)(["var-expr-input-action", {active: x && y}]),
                        onPointerDown: function (e) {
                            e.preventDefault(), v.current.insertSymbol()
                        }
                    }), f && o.createElement(kn.Expr, {
                        "data-target": 1,
                        "data-type": zn.form,
                        className: (0, Ge.Z)(["var-expr-input-action", {active: x && C}]),
                        onPointerDown: function (e) {
                            e.preventDefault(), H.current = e.target, x || Z(""), T(Ho)
                        }
                    }))
                }))
            };
            Wi.propTypes = {
                value: Z().array.isRequired,
                onChange: Z().func,
                disabled: Z().bool,
                varType: Z().string,
                style: Z().any,
                status: Z().string,
                showExpr: Z().bool,
                onHeightChange: Z().func
            };
            const Ji = (0, o.memo)(Wi);
            var _i = function (e) {
                var t = e.data, n = void 0 === t ? {} : t, r = e.name, a = void 0 === r ? "" : r, i = e.children;
                return a ? o.createElement(ho, {
                    hideWhenTouch: !0,
                    title: o.createElement(o.Fragment, null, a, n.scope && (ba(n.scope) ? "（全局变量）" : "（本规则变量）")),
                    placement: "top"
                }, i) : i
            };
            const $i = (0, o.memo)(_i);

            function ec(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function tc(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ec(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ec(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var nc = function (e) {
                return tc(tc({}, e), {}, {isVar: !0})
            }, rc = {id: "", scope: "", type: ""}, ac = function (e) {
                var t = e.onChange, n = e.valueRange, r = e.supportInput, a = void 0 !== r && r, i = e.iconInset,
                    c = void 0 !== i && i, u = e.value, l = void 0 === u ? null : u, s = e.varType, p = e.style,
                    f = e.status, d = e.showAddVars, m = void 0 !== d && d, v = e.autofillAfterAddVar,
                    h = void 0 === v || v, g = (0, o.useState)(!1), y = I()(g, 2), A = y[0], b = y[1],
                    E = (0, o.useRef)(), C = or(t), O = (0, o.useCallback)((function () {
                        return b((function (e) {
                            return !e
                        }))
                    }), []), w = (0, o.useMemo)((function () {
                        return (0, U.isObject)(l) ? Uo(l) ? tc(tc({}, l), {}, {isVar: !0}) : a ? {value: l.value || ""} : nc(tc({}, rc)) : a ? {value: ""} : nc(tc({}, rc))
                    }), [l]), k = (0, o.useMemo)((function () {
                        return !!(A || Uo(w) && "" !== w.id)
                    }), [A, w]), x = Wo(s), S = x.displayedGlobalVars, T = x.displayedLocalRuleVars, D = x.varOptions,
                    P = x.keyword, R = x.setKeyword, B = x.fetch;
                (0, o.useEffect)((function () {
                    Jd.lockScroll(A)
                }), [A]), (0, o.useEffect)((function () {
                    if (A) return B(), cr(document, "pointerdown", (function (e) {
                        e.target !== E.current && b(!1)
                    }))
                }), [A]);
                var j = (0, o.useMemo)((function () {
                    if (Uo(w)) return D.find((function (e) {
                        return e.value === w.id && e.scope === w.scope
                    }))
                }), [w, D]), N = (0, o.useMemo)((function () {
                    return Uo(w) && w.id && !j
                }), [w, j]), L = (0, o.useCallback)((function (e) {
                    C(nc(arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? tc({}, rc) : {
                        id: e.id,
                        scope: e.scope,
                        type: e.type
                    })), b(!1)
                }), [C, w]), Q = (0, o.useCallback)((function (e) {
                    C({value: e})
                }), [C]), M = function (e) {
                    e.preventDefault(), e.stopPropagation()
                }, Z = (0, o.useCallback)((function (e, t) {
                    B().then((function () {
                        if (h && e) {
                            var n = e.id, r = e.scope, a = e.type;
                            t(nc({id: n, scope: r, type: a})), b(!1)
                        }
                    }))
                }), [B, h]);
                return o.createElement(Ro, {
                    className: (0, Ge.Z)("var-selector-wrap", {inset: c}),
                    onChange: L
                }, (function (e) {
                    return o.createElement(o.Fragment, null, o.createElement(so.Z, {
                        open: A,
                        destroyPopupOnHide: !0,
                        overlayClassName: "var-selector-dropdown",
                        dropdownRender: function () {
                            return o.createElement("div", {className: "var-selector-dropdown-panel"}, o.createElement(ei, {
                                showAddVars: m,
                                globalVars: S,
                                localRuleVars: T,
                                value: w.id,
                                keyword: P,
                                varType: s,
                                onSelect: e,
                                onSearch: R,
                                onFinish: function (t) {
                                    return Z(t, e)
                                }
                            }))
                        }
                    }, k || !a ? o.createElement("div", {
                        className: (0, Ge.Z)("var-select-input", H()({}, f, f)),
                        style: p,
                        onPointerDown: function (e) {
                            E.current = e.target, O()
                        }
                    }, j || N ? o.createElement(io.Z, {
                        closable: !0,
                        className: (0, Ge.Z)({"global-var": ba(null == j ? void 0 : j.scope)}),
                        onClose: function () {
                            e(null, !0)
                        },
                        closeIcon: o.createElement(kn.Close2, {
                            onMouseDown: M,
                            onPointerDown: M,
                            style: {position: "relative", top: 3}
                        })
                    }, o.createElement($i, {
                        data: j,
                        name: null == j ? void 0 : j.label
                    }, o.createElement("span", {className: (0, Ge.Z)("var-select-input-label", {lost: N})}, N ? "变量已丢失" : j.label))) : o.createElement("span", {className: "var-select-placeholder"}, "请选择变量")) : "number" === s ? o.createElement(Mr, qe()({}, n, {
                        placeholder: n ? "".concat(n.min, "~").concat(n.max) : "请输入",
                        status: f,
                        style: p,
                        defaultValue: w.value,
                        onChange: function (e) {
                            Q(e)
                        }
                    })) : o.createElement(Tr, {
                        placeholder: "请输入",
                        status: f,
                        defaultValue: w.value,
                        style: p,
                        onChange: function (e) {
                            Q(e.target.value.trim())
                        }
                    })), o.createElement(kn.Vars, {
                        className: (0, Ge.Z)("var-selector-action", {active: A}),
                        onPointerDown: function (e) {
                            E.current = e.target, O()
                        }
                    }))
                }))
            };
            ac.propTypes = {
                onChange: Z().func,
                valueRange: Z().object,
                supportInput: Z().bool,
                iconInset: Z().bool,
                value: Z().object,
                varType: Z().string,
                style: Z().any,
                status: Z().string,
                showAddVars: Z().bool,
                autofillAfterAddVar: Z().bool
            };
            const oc = (0, o.memo)(ac),
                ic = "data:image/png;base64,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";
            var cc = ["title", "content", "okText", "cancelText"];

            function uc(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function lc(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? uc(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : uc(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function sc(e) {
                var t = e.title, n = void 0 === t ? "提示" : t, r = e.content, a = e.okText,
                    o = void 0 === a ? "确定" : a, i = e.cancelText, c = void 0 === i ? "取消" : i, u = Ke()(e, cc);
                return new Promise((function (e, t) {
                    L.Z.confirm(lc(lc({
                        icon: null,
                        title: n,
                        content: r,
                        okText: o,
                        cancelText: c
                    }, u), {}, {
                        onOk: function () {
                            e()
                        }, onCancel: function () {
                            t()
                        }
                    }))
                }))
            }

            function pc() {
                return pc = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, pc.apply(this, arguments)
            }

            const fc = e => o.createElement("svg", pc({
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {d: "M11 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM11 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"}));
            var dc = "delete", mc = "edit", vc = function (e) {
                var t, n, r = e.data, a = e.onEdit, i = e.onDelete, c = (0, o.useMemo)((function () {
                    return !!i
                }), [i]), u = (0, o.useCallback)((function (e) {
                    e !== mc ? e === dc && i && i(r) : a && a(r)
                }), [a, i]);
                return o.createElement("div", {className: "common-var-cell"}, o.createElement("h5", {
                    className: "var-name",
                    title: null == (t = r.userData) ? void 0 : t.name
                }, null == (n = r.userData) ? void 0 : n.name), o.createElement("div", {className: "var-action"}, c ? o.createElement(fo, {
                    placement: "bottomLeft",
                    menu: {
                        onClick: function (e) {
                            return u(e.key)
                        },
                        items: [{key: mc, label: o.createElement("div", null, "编辑")}, {
                            key: dc,
                            label: o.createElement("div", null, "删除")
                        }]
                    }
                }, o.createElement(We.Z, {
                    component: fc,
                    className: "icon-square",
                    style: {fontSize: 20, color: "var(--text-color-level2)"}
                })) : o.createElement(kn.Edit, {
                    className: "icon-square",
                    style: {fontSize: 20, color: "var(--text-color-level2)"},
                    onClick: function () {
                        return u(mc)
                    }
                })))
            };
            const hc = (0, o.memo)(vc);

            function gc(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function yc(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? gc(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : gc(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Ac = function (e) {
                var t = e.data, n = e.onRefresh, r = e.openEditModal, a = e.canDelete, i = void 0 !== a && a,
                    c = e.terse, u = void 0 !== c && c, l = (0, o.useMemo)((function () {
                        var e = [], n = [];
                        return t.forEach((function (t) {
                            t.type === Ea.string ? n.push(t) : t.type === Ea.number && e.push(t)
                        })), [e, n]
                    }), [t]), s = I()(l, 2), p = s[0], f = s[1],
                    d = (0, o.useState)(H()(H()({}, Ea.string, !0), Ea.number, !0)), m = I()(d, 2), v = m[0], h = m[1],
                    g = function (e) {
                        h((function (t) {
                            return yc(yc({}, t), {}, H()({}, e, !t[e]))
                        }))
                    }, y = function (e) {
                        r(e)
                    }, A = function () {
                        var e = Fr()(Yr().mark((function e(t) {
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, sc({
                                            title: "提醒",
                                            content: "删除后，你将无法使用该变量，且该操作不可撤销。确认删除吗？"
                                        });
                                    case 2:
                                        return e.prev = 2, e.next = 5, Ra(t);
                                    case 5:
                                        n(), e.next = 11;
                                        break;
                                    case 8:
                                        e.prev = 8, e.t0 = e.catch(2), oo.error("删除变量失败");
                                    case 11:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, null, [[2, 8]])
                        })));
                        return function (t) {
                            return e.apply(this, arguments)
                        }
                    }();
                return o.createElement("div", {className: "var-list-wrap"}, p.length > 0 && o.createElement("div", {className: "var-list-item"}, o.createElement("h5", {
                    className: "var-title",
                    onClick: function () {
                        return g(Ea.number)
                    }
                }, o.createElement(kn.Right2, {className: (0, Ge.Z)("icon", {open: v[Ea.number]})}), o.createElement("span", {className: "label"}, "数值变量")), v[Ea.number] ? o.createElement("div", {className: (0, Ge.Z)("var-list", {terse: u})}, p.map((function (e) {
                    return o.createElement(hc, qe()({key: e.id, data: e, onEdit: y}, i ? {onDelete: A} : {}))
                }))) : null), f.length > 0 && o.createElement("div", {className: "var-list-item"}, o.createElement("h5", {
                    className: "var-title",
                    onClick: function () {
                        return g(Ea.string)
                    }
                }, o.createElement(kn.Right2, {className: (0, Ge.Z)("icon", {open: v[Ea.string]})}), o.createElement("span", {className: "label"}, "文本变量")), v[Ea.string] ? o.createElement("div", {className: (0, Ge.Z)("var-list", {terse: u})}, f.map((function (e) {
                    return o.createElement(hc, qe()({key: e.id, data: e, onEdit: y}, i ? {onDelete: A} : {}))
                }))) : null))
            };
            const bc = (0, o.memo)(Ac);
            var Ec = n(73923);

            function Cc(e, t) {
                var n = (0, o.useRef)(), r = (0, o.useState)(), a = I()(r, 2), i = a[0], c = a[1];
                (0, o.useEffect)((function () {
                    n.current = t, c(null == t ? void 0 : t.value)
                }), [t]);
                var u = (0, o.useRef)((function () {
                    if (!n.current) return Promise.resolve(!1);
                    var e = n.current;
                    return function (e) {
                        return za.apply(this, arguments)
                    }({id: e.id, scope: e.scope}, !0).then((function () {
                        return c((arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).value), !0
                    })).catch((function () {
                        return !1
                    }))
                }));
                return (0, o.useEffect)((function () {
                    e && setTimeout((function () {
                        u.current()
                    }), 0)
                }), [e]), {
                    value: i, fetch: (0, o.useCallback)((function () {
                        return u.current()
                    }), [])
                }
            }

            var Oc = ["title", "virtual", "onFinish", "defaultName", "defaultType", "scope", "slot", "scopeSelectable", "typeFixed", "zIndex", "onVisibleChange"],
                wc = [{label: "数值", value: Ea.number}, {label: "文本", value: Ea.string}], kc = function (e) {
                    return null == e || "" === e || "0" === e || 0 === e || /([1-9]\d*\.?\d*)|(0\.\d*[1-9])/.test(e) && (e > -Math.pow(2, 64) || e < Math.pow(2, 64) - 1) ? Promise.resolve() : Promise.reject()
                }, xc = function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "value",
                        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "label", r = {};
                    return e.forEach((function (e) {
                        r[e[t]] = e[n]
                    })), r
                }(wc), Sc = function (e) {
                    var t = e.title, n = e.virtual, r = void 0 !== n && n, a = e.onFinish, i = e.defaultName,
                        c = void 0 === i ? "" : i, l = e.defaultType, s = e.scope, p = void 0 === s ? ha : s, f = e.slot,
                        d = e.scopeSelectable, m = void 0 !== d && d, v = e.typeFixed, h = void 0 !== v && v, g = e.zIndex,
                        y = void 0 === g ? 1050 : g, A = e.onVisibleChange, b = Ke()(e, Oc), E = (0, o.useState)(!1),
                        C = I()(E, 2), O = C[0], w = C[1], k = (0, o.useState)(null), x = I()(k, 2), S = x[0], T = x[1],
                        D = (0, o.useMemo)((function () {
                            return [{label: "全局", value: ha}, {label: "本规则", value: Fa()}]
                        }), []), P = Ec.Z.useForm(), R = I()(P, 1)[0], B = or(A);
                    (0, o.useEffect)((function () {
                        null == B || B(O)
                    }), [O]);
                    var j = Cc(O, S), N = j.value, Q = j.fetch, M = (0, o.useMemo)((function () {
                        if (!S) {
                            var e = l || wc[0].value;
                            return {varName: c.trim(), varType: e, varScope: p, varValue: e === Ea.number ? 0 : ""}
                        }
                        var t = S.type, n = S.value, r = S.scope, a = S.userData;
                        return {varName: (void 0 === a ? {} : a).name, varType: t, varScope: r, varValue: null != N ? N : n}
                    }), [S, l, c, p, N]);
                    (0, o.useEffect)((function () {
                        O && setTimeout((function () {
                            R.resetFields()
                        }), 0)
                    }), [M, O]);
                    var Z = function () {
                        return w(!1)
                    }, V = Boolean(S), H = t || "".concat(V ? "编辑" : "创建").concat(ba(p) ? "全局变量" : "本规则变量");
                    return o.createElement(o.Fragment, null, f && f({
                        open: function (e) {
                            T(e), w(!0)
                        }, close: Z
                    }), o.createElement(L.Z, qe()({
                        className: "ant-small-modal",
                        closable: !1,
                        destroyOnClose: !0,
                        maskClosable: !1,
                        open: O,
                        title: H,
                        onCancel: Z,
                        onOk: function () {
                            R.validateFields().then(function () {
                                var e = Fr()(Yr().mark((function e(t) {
                                    var n, o, i, c, l;
                                    return Yr().wrap((function (e) {
                                        for (; ;) switch (e.prev = e.next) {
                                            case 0:
                                                if (n = t.varName, o = t.varType, i = t.varScope, c = t.varValue, e.prev = 1, !V) {
                                                    e.next = 14;
                                                    break
                                                }
                                                if (!Oa(S)) {
                                                    e.next = 9;
                                                    break
                                                }
                                                return e.next = 6, La({
                                                    scope: i || p,
                                                    id: S.id,
                                                    name: n,
                                                    value: o === Ea.number ? Number(c) : c
                                                }, {isVirtual: r, rawData: {}});
                                            case 6:
                                                l = e.sent, e.next = 12;
                                                break;
                                            case 9:
                                                return e.next = 11, La({
                                                    scope: i || p,
                                                    id: S.id,
                                                    name: n,
                                                    value: o === Ea.number ? Number(c) : c
                                                }, Oa(S));
                                            case 11:
                                                l = e.sent;
                                            case 12:
                                                e.next = 17;
                                                break;
                                            case 14:
                                                return e.next = 16, Pa({
                                                    scope: i || p,
                                                    type: o,
                                                    name: n,
                                                    value: o === Ea.number ? Number(c) : c
                                                }, r);
                                            case 16:
                                                l = e.sent;
                                            case 17:
                                                Z(), a && a(l), e.next = 25;
                                                break;
                                            case 21:
                                                e.prev = 21, e.t0 = e.catch(1), u(e.t0), oo.error(e.t0.message || (V ? "修改变量失败" : "创建变量失败"));
                                            case 25:
                                            case"end":
                                                return e.stop()
                                        }
                                    }), e, null, [[1, 21]])
                                })));
                                return function (t) {
                                    return e.apply(this, arguments)
                                }
                            }())
                        },
                        zIndex: y
                    }, b), o.createElement(Ec.Z, {
                        form: R,
                        labelCol: {span: 6},
                        wrapperCol: {span: 18},
                        colon: !1,
                        initialValues: M,
                        autocomplete: "off"
                    }, o.createElement(Ec.Z.Item, {
                        label: "变量名称",
                        name: "varName",
                        rules: [{required: !0, message: "请输入变量名称"}, {
                            validator: function (e, t) {
                                return Fr()(Yr().mark((function e() {
                                    return Yr().wrap((function (e) {
                                        for (; ;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, qa(p, t, V ? [S.id] : []);
                                            case 2:
                                                if (!e.sent) {
                                                    e.next = 5;
                                                    break
                                                }
                                                throw new Error("变量名称已存在");
                                            case 5:
                                            case"end":
                                                return e.stop()
                                        }
                                    }), e)
                                })))()
                            }
                        }]
                    }, o.createElement(jn.Z, {placeholder: "请输入变量名称"})), o.createElement(Ec.Z.Item, {
                        label: "变量类型",
                        name: "varType",
                        rules: [{required: !0, message: "请选择变量类型"}]
                    }, V ? o.createElement("div", {className: "vars-modal-input-label"}, xc[S.type]) : o.createElement(xn.Z, {
                        onChange: function (e) {
                            var t = e === Ea.number ? 0 : "";
                            R.setFieldsValue({varValue: t})
                        }, disabled: h, placeholder: "请选择变量类型", options: wc, suffixIcon: o.createElement(Nc, null)
                    })), m && o.createElement(Ec.Z.Item, {
                        label: "作用范围",
                        name: "varScope"
                    }, o.createElement(xn.Z, {
                        placeholder: "请选择作用范围",
                        options: D,
                        suffixIcon: o.createElement(Nc, null)
                    })), V ? o.createElement(Ec.Z.Item, {label: "当前值"}, o.createElement("div", {className: "var-modal-input-wrap"}, o.createElement(Ec.Z.Item, {
                        noStyle: !0,
                        name: "varValue",
                        rules: [{required: !0, message: "请输入新的值"}, {
                            validator: function (e, t) {
                                return M.varType === Ea.string ? Promise.resolve() : kc(t)
                            }, message: "请输入数字"
                        }]
                    }, M.varType === Ea.string ? o.createElement(jn.Z, {
                        placeholder: "请输入新的值",
                        style: {paddingRight: 24}
                    }) : o.createElement(jn.Z, {
                        style: {width: "100%", paddingRight: 24},
                        controls: !1,
                        placeholder: "请输入新的值"
                    })), o.createElement(kn.Refresh, {
                        className: "refresh-act-btn", onClick: function () {
                            Q().then((function (e) {
                                e && (R.setFieldsValue({varValue: M.varValue}), oo.success("已刷新"))
                            }))
                        }
                    })), o.createElement("div", {className: "var-modal-input-tips"}, "修改当前值将触发“变量值更新”卡片")) : o.createElement(Ec.Z.Item, {
                        noStyle: !0,
                        shouldUpdate: function (e, t) {
                            return e.varType !== t.varType
                        }
                    }, (function (e) {
                        var t = e.getFieldValue;
                        return o.createElement(Ec.Z.Item, {
                            label: "初始值",
                            name: "varValue",
                            rules: [{
                                validator: function (e, n) {
                                    return t("varType") === Ea.string ? Promise.resolve() : kc(n)
                                }, message: "请输入数字"
                            }]
                        }, t("varType") === Ea.string ? o.createElement(jn.Z, {
                            placeholder: "请输入初始值",
                            maxLength: 512
                        }) : o.createElement(jn.Z, {style: {width: "100%"}, placeholder: "请输入初始值"}))
                    })))))
                };
            const Tc = (0, o.memo)(Sc);

            function Dc(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Pc(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Dc(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Dc(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Rc = function (e) {
                var t = e.slot, n = Fa(), r = Xa(n, !0), a = r.varList, i = r.fetch, c = (0, o.useState)({keyword: ""}),
                    u = I()(c, 2), l = u[0], s = u[1], p = (0, o.useState)(!1), f = I()(p, 2), d = f[0], m = f[1],
                    v = (0, o.useCallback)((function () {
                        Jd.eventsDisable = !0, m(!0)
                    }), []), h = (0, o.useCallback)((function () {
                        Jd.eventsDisable = !1, m(!1)
                    }), []), g = (0, o.useCallback)((function (e, t) {
                        s((function (n) {
                            return Pc(Pc({}, n), {}, H()({}, e, t))
                        }))
                    }), []);
                (0, o.useEffect)((function () {
                    d && i()
                }), [d]);
                var y = (0, o.useMemo)((function () {
                    return a.filter((function (e) {
                        var t, n;
                        return (0, U.isString)(null == (t = e.userData) ? void 0 : t.name) && (null == (n = e.userData) ? void 0 : n.name.toLowerCase().includes(l.keyword.trim().toLowerCase()))
                    }))
                }), [l, a]);
                return o.createElement(o.Fragment, null, t && t({
                    open: v,
                    close: h,
                    visible: d
                }), o.createElement(to, {
                    className: "vars-modal",
                    footer: null,
                    open: d,
                    title: "本规则变量",
                    onCancel: h,
                    placement: "right",
                    width: 968
                }, o.createElement(Tc, {
                    virtual: !0, onFinish: function () {
                        i(), Qo(Mo)
                    }, scope: n, slot: function (e) {
                        var t = e.open;
                        return o.createElement(o.Fragment, null, o.createElement(To, {
                            style: {padding: 0},
                            placeholder: "输入想找的变量",
                            value: l.keyword,
                            onSearch: function (e) {
                                g("keyword", e)
                            },
                            extra: o.createElement(Nr, {
                                onClick: function () {
                                    return t()
                                }
                            }, "创建变量")
                        }), o.createElement("div", {className: "vars-modal-content"}, y.length > 0 ? o.createElement(bc, {
                            terse: !0,
                            data: y,
                            onRefresh: function () {
                                i(), Qo(Mo)
                            },
                            openEditModal: t
                        }) : o.createElement("div", {className: "vars-modal-no-content"}, a.length > 0 ? o.createElement(o.Fragment, null, o.createElement("img", {src: ic}), o.createElement("p", null, "没有查找到相关的本规则变量，请重新输入")) : o.createElement(o.Fragment, null, o.createElement("img", {src: ic}), o.createElement("p", null, "暂无已创建的本规则变量")))))
                    }
                })))
            };
            const Bc = (0, o.memo)(Rc);
            kn.Add, kn.Success, kn.Info, kn.Error, kn.Warning;
            var Ic = kn.Warning, jc = kn.Close, Nc = (kn.Loading, kn.Down), Lc = (n(13145), "日一二三四五六");

            function Qc(e) {
                var t, n = a()(new Set(e.filter((function (e) {
                    return Number.isInteger(e) && e >= 0 && e <= 6
                })))).sort();
                if (n.length < 1) return "";
                if (7 === n.length) return "周一~周日";
                if (!((t = n).length < 2) && 1 === t.filter((function (e) {
                    return !t.includes((e + 7 - 1) % 7)
                })).length) {
                    var r = n.find((function (e) {
                        return !n.includes((e + 7 - 1) % 7)
                    })), o = n.find((function (e) {
                        return !n.includes((e + 1) % 7)
                    }));
                    return "周".concat(Lc[r], "~周").concat(Lc[o])
                }
                return "周".concat(n.map((function (e) {
                    return Lc[e]
                })).join(""))
            }

            var Mc = {everyday: "everyday", workday: "workday", holiday: "holiday", custom: "custom"},
                Zc = {everyday: "每天", workday: "法定工作日", holiday: "法定节假日", custom: "自定义"};

            function Vc(e) {
                var t = e.props.filter;
                return t ? 0 === Object.keys(t).length ? Mc.everyday : "inHoliday" in t ? t.inHoliday ? Mc.holiday : Mc.workday : "day" in t ? Mc.custom : void 0 : ""
            }

            function Hc(e) {
                return Zc[e] || ""
            }

            var Fc = {periodicAlarm: "periodicAlarm", sunrise: "sunrise", sunset: "sunset"},
                Gc = {periodicAlarm: "指定时刻", sunrise: "日出", sunset: "日落"},
                Yc = {now: "now", before: "before", after: "after"},
                zc = {before: "发生前", now: "正发生时", after: "发生后"};

            function Uc(e) {
                var t = e.props.type, n = e.props.isSunset;
                return t === Fc.sunset ? n ? Fc.sunset : Fc.sunrise : t === Fc.periodicAlarm ? Fc.periodicAlarm : ""
            }

            function qc(e) {
                return Gc[e] || ""
            }

            function Xc(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Kc(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Xc(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xc(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Wc = function (e) {
                return function () {
                    return e
                }
            }, Jc = function (e) {
                var t;
                return e === sp.signalOr.type ? Wc("事件或") : e === sp.logicOr.type ? Wc("状态或") : e === sp.logicAnd.type ? Wc("状态与") : e === sp.logicNot.type ? Wc("状态非") : e === sp.onLoad.type ? Wc("本规则启用时") : e === sp.register.type ? Wc("自定义状态") : e === sp.modeSwitch.type ? Wc("切换模式") : e === sp.condition.type ? Wc("当-如果-就") : e === sp.loop.type ? function (e) {
                    var t = e.cfg, n = t.value, r = t.unit;
                    return "每".concat(n).concat(Kn[r] || r, "一次")
                } : e === sp.counter.type ? function (e) {
                    var t = e.props.n;
                    return "达到".concat(t, "次时")
                } : e === sp.onlyNTimes.type ? function (e) {
                    var t = e.props.n;
                    return "最多触发".concat(t, "次")
                } : e === sp.eventSequence.type ? function (e) {
                    var t = e.cfg, n = t.value, r = t.unit;
                    return "在".concat(n).concat(Kn[r] || r, "内发生")
                } : e === sp.statusLast.type ? function (e) {
                    var t = e.cfg, n = t.value, r = t.unit;
                    return "状态维持".concat(n).concat(Kn[r] || r)
                } : e === sp.delay.type ? function (e) {
                    var t = e.cfg, n = t.value, r = t.unit;
                    return "延时".concat(n).concat(Kn[r] || r)
                } : e === sp.alarmClock.type ? function (e) {
                    var t = Vc(e), n = function (e) {
                        var t = Uc(e);
                        if (t === Fc.periodicAlarm) {
                            var n = e.props, r = n.hour, a = n.minute;
                            return "".concat(r, ":").concat(w(a))
                        }
                        var o = e.props.offset,
                            i = 0 === o ? "时" : "".concat(o > 0 ? "后" : "前").concat(Math.abs(o), "分钟");
                        return qc(t) + i
                    }(e);
                    return t === Mc.custom ? "".concat(Qc(e.props.filter.day), " ").concat(n) : "".concat(Hc(t), " ").concat(n)
                } : e === sp.timeRange.type ? function (e) {
                    var t, n, r, a = Vc(e),
                        o = (t = e.props, n = t.start, r = t.end, "".concat(n.hour, ":").concat(w(n.minute), "-").concat(r.hour, ":").concat(w(r.minute)));
                    return a === Mc.custom ? "".concat(Qc(e.props.filter.day), " ").concat(o) : "".concat(Hc(a), " ").concat(o)
                } : Wc(null == (t = sp[e]) ? void 0 : t.label)
            }, _c = function (e) {
                var t = function () {
                    return Kc({left: 0, right: 0}, arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {})
                }, n = (sp[e] || {}).connector;
                if (!n || !(0, U.isObject)(n)) return t();
                var r = n.inputs, o = void 0 === r ? [] : r, i = n.outputs, c = void 0 === i ? [] : i,
                    u = Math.max.apply(Math, a()(o.map((function (e) {
                        return (e.simplifiedExtra || "").length
                    })))), l = Math.max.apply(Math, a()(c.map((function (e) {
                        return (e.simplifiedExtra || "").length
                    }))));
                return t({left: u > 0 ? u * ge + 12 : 0, right: l > 0 ? l * ge + 12 : 0})
            }, $c = function (e, t) {
                var n = Se, r = 190, o = Be;
                if (Jd.isDeviceCard(e.type)) {
                    var i = e.cfg.urn, c = Jd.gateway.data.devList.find((function (e) {
                        return e.urn === i
                    }));
                    if (!c) return r;
                    return k(Math.max(Math.max(Jd.measureText(c.name, 14, 400), Jd.measureText(au(c), 14, 400)) + 48, function () {
                        var n = ou(e.type) + tu(e), r = Jd.measureText(n, 16, 500) + 20,
                            i = pu(e, t).map((function (e) {
                                return function e(t) {
                                    return (0, U.isArray)(t) ? t.reduce((function (t, n) {
                                        return e(n) + t
                                    }), 0) + t.length * o : lu(t) ? Jd.measureText(t.label, 14, 400) + 2 * o : Jd.measureText(t.label || t, 14, 400)
                                }(e)
                            })), c = Math.max.apply(Math, a()(i));
                        return Math.max(r, c)
                    }()) + 2 * n, r, 360)
                }
                if ([sp.varChange.type, sp.varGet.type].includes(e.type)) {
                    var u = ou(e.type), l = qo(e.props.id, t),
                        s = Jd.measureText(u, 16, 500) + Jd.measureText(l.label, 14, 400) + 2 * o + 20,
                        p = iu(e.props, {}), f = Jd.measureText(p, 14, 400);
                    return k(Math.max(s, f) + 2 * n, r, 360)
                }
                if ([sp.varSetNumber.type, sp.varSetString.type].includes(e.type)) {
                    var d = e.props, m = d.id, v = d.elements, h = qo(m, t),
                        g = Jd.measureText(h.label, 14, 400) + 2 * o, y = De + 2 * o, A = v.reduce((function (e, n) {
                            if (n.type === ya) return Jd.measureText(n.value, 14, 400) + e;
                            if (n.type === Aa) {
                                var r = qo(n.id, t);
                                return Jd.measureText(r.label, 14, 400) + 2 * o + e
                            }
                            return e
                        }), 0);
                    return k(g + y + A + 2 * n, r, 360)
                }
                var b = Jc(e.type)(e);
                return Jd.measureText(b, 16, 500) + 2 * n
            }, eu = function (e, t) {
                var n = Jd.connectTool.run(e), r = Math.max(n.inputs.length, n.outputs.length);
                if (Jd.isDeviceCard(e.type)) {
                    var a = 21 + pu(e, t).reduce((function (e, t) {
                        return ((0, U.isArray)(t) && t.some((function (e) {
                            return lu(e)
                        })) ? 27 : 23) + e
                    }), 0) + 32;
                    return 72 + Math.max(36 * r, a)
                }
                return 36 * r + 20 + (1 === r ? 5 : 0)
            }, tu = function (e) {
                var t = e.type, n = e.cfg.urn, r = e.props, o = r.siid, i = r.piid, c = r.eiid, u = r.aiid, l = [];
                (function (e) {
                    return {
                        deviceGet: [de.propertyGet],
                        deviceInput: [de.event, de.propertyNotify],
                        deviceOutput: [de.action, de.propertySet],
                        deviceInputSetVar: [de.event, de.propertyNotify],
                        deviceGetSetVar: [de.propertyGet]
                    }[e]
                }(t) || []).forEach((function (e) {
                    var t;
                    l.push.apply(l, a()((null == (t = Jd.gateway.data.urnMap[n]) ? void 0 : t[e]) || []))
                }));
                var s = l.find((function (e) {
                    return e.siid === o && e.piid === i && e.eiid === c && e.aiid === u
                }));
                return s ? "".concat(s.sDescription, "-").concat(s.description) : ""
            }, nu = function (e) {
                var t,
                    n = ((null == (t = Jd.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.event) || []).find((function (t) {
                        return t.eiid === e.props.eiid && t.siid === e.props.siid
                    }));
                return (null == n ? void 0 : n.arguments) || []
            }, ru = function (e, t) {
                var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                    r = (0, U.isArray)(e.v1) ? e.v1 : [e.v1], a = [];
                r.forEach((function (e) {
                    var n = t.valueList.find((function (t) {
                        return t.value === e
                    }));
                    n && a.push(n.description)
                }));
                var o = "".concat(e.dtype === me.boolean ? "为" : "包含", "：");
                return "".concat(n ? o : "").concat(a.join("、"))
            }, au = function (e) {
                return "".concat(e.roomName || "未分配").concat(e.deviceTypeDescription ? " | ".concat(e.deviceTypeDescription) : "")
            }, ou = function (e) {
                return H()(H()(H()(H()(H()(H()(H()({}, sp.deviceGet.type, "查询"), sp.deviceInput.type, "上报"), sp.deviceOutput.type, "执行"), sp.deviceInputSetVar.type, "上报"), sp.deviceGetSetVar.type, "查询"), sp.varChange.type, "更新"), sp.varGet.type, "查询")[e]
            }, iu = function (e, t) {
                var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                return "".concat(Le[e.operator]).concat(n ? "：" : "").concat(e.v1).concat(t.unit || "").concat("between" === e.operator ? "-".concat(e.v2).concat(t.unit || "") : "")
            }, cu = function (e) {
                return Jd.varTool.isVarValue(e)
            }, uu = "var", lu = function (e) {
                return !!(0, U.isObject)(e) && e.type === uu
            }, su = function (e, t) {
                var n, r, a = e.type, o = e.props;
                if (a === sp.deviceGet.type) {
                    var i = (n = e, ((null == (r = Jd.gateway.data.urnMap[n.cfg.urn]) ? void 0 : r.propertyGet) || []).find((function (e) {
                        return e.piid === n.props.piid && e.siid === n.props.siid
                    })) || {});
                    return me.valueList in i ? ru(o, i) : i.dtype === me.int || i.dtype === me.float ? iu(o, i) : o.v1
                }
                if (a === sp.deviceOutput.type) {
                    var c = function (e, t) {
                        if (me.valueList in e) {
                            var n = e.valueList.find((function (e) {
                                return e.value === t
                            }));
                            return (null == n ? void 0 : n.description) || ""
                        }
                        return t + (e.unit || "")
                    };
                    if ((0, U.isNumber)(o.aiid)) {
                        var u = function (e) {
                            var t,
                                n = ((null == (t = Jd.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.action) || []).find((function (t) {
                                    return t.aiid === e.props.aiid && t.siid === e.props.siid
                                }));
                            return n ? n.in : []
                        }(e);
                        return u.map((function (e, n) {
                            var r = o.ins[n];
                            return cu(r) ? [e.description, Kc({
                                type: uu,
                                id: r.id,
                                scope: r.scope
                            }, qo(r.id, t))] : "".concat(e.description, "：").concat(c(e, r.value))
                        }))
                    }
                    if ((0, U.isNumber)(o.piid)) {
                        var l = function (e) {
                            var t;
                            return ((null == (t = Jd.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.propertySet) || []).find((function (t) {
                                return t.piid === e.props.piid && t.siid === e.props.siid
                            })) || {}
                        }(e);
                        return cu(o) ? [Kc({type: uu, id: o.id, scope: o.scope}, qo(o.id, t))] : c(l, o.value)
                    }
                }
                if (a === sp.deviceInput.type) {
                    if ((0, U.isNumber)(o.piid)) {
                        var s = function (e) {
                            var t;
                            return ((null == (t = Jd.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.propertyNotify) || []).find((function (t) {
                                return t.piid === e.props.piid && t.siid === e.props.siid
                            })) || {}
                        }(e);
                        return me.valueList in s ? ru(o, s) : s.dtype === me.int || s.dtype === me.float ? iu(o, s) : o.v1
                    }
                    if ((0, U.isNumber)(o.eiid)) {
                        var p = nu(e);
                        return o.arguments.map((function (e) {
                            var t = p.find((function (t) {
                                return t.piid === e.piid
                            }));
                            return t ? "".concat(t.description, "：").concat(function (e, t) {
                                return e ? me.valueList in e ? ru(t, e, !1) : e.dtype === me.int || e.dtype === me.float ? iu(t, e, !1) : t.v1 : null
                            }(t, e)) : ""
                        }))
                    }
                }
                if (a === sp.deviceInputSetVar.type) {
                    if ((0, U.isNumber)(o.piid)) return [["赋值给", Kc({
                        type: uu,
                        id: o.id,
                        scope: o.scope
                    }, qo(o.id, t))]];
                    if ((0, U.isNumber)(o.eiid)) {
                        var f = nu(e);
                        return o.arguments.map((function (e) {
                            var n = f.find((function (t) {
                                return t.piid === e.piid
                            }));
                            return n ? ["".concat(n.description, " 赋值给"), Kc({
                                type: uu,
                                id: e.id,
                                scope: e.scope
                            }, qo(e.id, t))] : ""
                        }))
                    }
                }
                if (a === sp.deviceGetSetVar.type) return [["赋值给", Kc({
                    type: uu,
                    id: o.id,
                    scope: o.scope
                }, qo(o.id, t))]]
            }, pu = function (e, t) {
                var n = su(e, t);
                return (0, U.isArray)(n) ? n : n ? [n] : []
            };
            const fu = "data:image/png;base64,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";
            var du = function (e, t) {
                var n, r, a = Jd.gateway, i = e.type;
                if (Jd.isDeviceCard(i)) {
                    var c = a.data.devList.find((function (t) {
                        return e.props.did ? t.did === e.props.did : t.urn === e.cfg.urn
                    })) || {name: "设备丢失", roomName: "未知", error: !0}, u = pu(e, t);
                    return {
                        content: o.createElement("div", {className: "simple-device-card"}, o.createElement("div", {className: "device-cell"}, o.createElement(Fe.Z, {
                            rootClassName: "device-thumb",
                            draggable: !1,
                            src: c.icon || fu,
                            preview: !1,
                            fallback: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        }), o.createElement("div", {className: "device-desc"}, c.error ? o.createElement("h5", {className: "device-name error"}, c.name) : o.createElement("h5", {
                            className: "device-name",
                            title: c.name
                        }, c.name), o.createElement("p", {
                            className: "device-meta",
                            title: au(c)
                        }, au(c)))), o.createElement("div", {className: "device-action-cell"}, o.createElement("div", {className: "simple-action-title"}, o.createElement("span", null, ou(i)), o.createElement(kn.LogRight, {className: "icon-middle text-color-level4"}), o.createElement("span", null, tu(e))), o.createElement("div", {className: "spec-item"}, (n = u, r = function e(t) {
                            var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            return (0, U.isArray)(t) ? t.map((function (t, n) {
                                return o.createElement(o.Fragment, {key: n}, e(t, !0))
                            })) : lu(t) ? o.createElement(Zi, {
                                className: "var-tag",
                                data: t
                            }) : o.createElement("span", {className: (0, Ge.Z)("text", {shrink: n})}, t.label || t)
                        }, n.map((function (e, t) {
                            return o.createElement("p", {key: t, className: "spec-item-para"}, r(e))
                        }))))))
                    }
                }
                if ([sp.varChange.type, sp.varGet.type].includes(i)) {
                    var l = e.props.id, s = qo(l, t);
                    return {
                        content: o.createElement("div", {className: "var-action-cell"}, o.createElement("div", {className: "simple-action-title"}, o.createElement("span", null, ou(i)), o.createElement(kn.LogRight, {className: "icon-middle text-color-level4"}), o.createElement(Zi, {
                            data: s,
                            extraGap: 55
                        })), o.createElement("div", {className: "var-spec-item"}, iu(e.props, {})))
                    }
                }
                if ([sp.varSetNumber.type, sp.varSetString.type].includes(i)) {
                    var p = e.props.id, f = qo(p, t);
                    return {
                        content: o.createElement("div", {className: "var-expr-cell"}, o.createElement(Zi, {
                            responsive: 5,
                            data: f
                        }), o.createElement("span", {className: "expr-operator-eq"}, "="), o.createElement("span", {className: "expr-content"}, function () {
                            return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).map((function (e, n) {
                                return e.type === Aa ? o.createElement(Zi, {
                                    className: "var-tag",
                                    key: n,
                                    data: qo(e.id, t)
                                }) : e.type === ya ? o.createElement("span", {
                                    key: n,
                                    className: "text"
                                }, e.value) : o.createElement(o.Fragment, null)
                            }))
                        }(e.props.elements)))
                    }
                }
                return {content: Jc(i)(e, t), offset: _c(i)}
            };

            function mu(e) {
                var t = e.data, n = Wo().varMap, r = du(t, n), a = r.content, i = r.offset, c = void 0 === i ? {} : i;
                return o.createElement("div", {className: "simple-card"}, o.createElement("div", {
                    className: "simple-card-content",
                    style: {paddingLeft: c.left, paddingRight: c.right}
                }, a))
            }

            function vu(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const hu = function (e) {
                J()(n, e);
                var t = vu(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e, t) {
                        var n = e.cfg.pos.height, r = sp[e.type];
                        return e.cfg.simplified ? o.createElement(mu, {data: e}) : o.createElement("div", {className: "card"}, o.createElement("div", {className: "card-head"}, o.createElement("h5", {className: "card-title"}, r.label), r.headExtra ? o.createElement("div", {className: "card-head-extra"}, r.headExtra) : null), o.createElement("div", {
                            className: "card-content",
                            style: {height: n - ve}
                        }, t))
                    }
                }]), n
            }(Wr), gu = {
                type: "alarmClock",
                label: "定时",
                tip: "例如：每天8:00",
                cfg: {happenType: Yc.now, tempOffset: 0},
                inputs: {},
                outputs: {output: []},
                props: {type: "periodicAlarm", isSunset: !1, hour: 0, minute: 0, second: 0, filter: {}},
                connector: {inputs: [], outputs: [{key: "output", type: Qe.event}]}
            }, yu = {
                type: "condition",
                label: "当-如果-就",
                tip: "例如：当门外开门时，如果温度大于26度，就开空调",
                props: {},
                cfg: {},
                inputs: {trigger: null, condition: null},
                outputs: {met: [], unmet: []},
                connector: {
                    inputs: [{
                        key: "trigger",
                        extra: "当事件发生时",
                        simplifiedExtra: "当",
                        type: Qe.event
                    }, {key: "condition", extra: "如果满足条件", simplifiedExtra: "如果", type: Qe.status}],
                    outputs: [{key: "met", extra: "就", simplifiedExtra: "就", type: Qe.event}, {
                        key: "unmet",
                        extra: "否则",
                        simplifiedExtra: "否则",
                        type: Qe.event
                    }]
                },
                render: function (e) {
                    return o.createElement("div", {
                        style: {
                            marginLeft: 92,
                            height: e.cfg.pos.height - ve
                        }
                    }, o.createElement("svg", {
                        width: "132",
                        height: "54",
                        viewBox: "0 0 132 54",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, o.createElement("g", {
                        id: "purpleGroup",
                        fill: Ln().event
                    }, o.createElement("path", {d: "M66.75 21C66.75 20.5858 66.4142 20.25 66 20.25C65.5858 20.25 65.25 20.5858 65.25 21L66.75 21ZM66.0001 40L65.2501 40L66.0001 40ZM65.25 21L65.2501 40L66.7501 40L66.75 21L65.25 21ZM76.0001 50.75H129V49.25H76.0001V50.75ZM65.2501 40C65.2501 45.9371 70.063 50.75 76.0001 50.75V49.25C70.8914 49.25 66.7501 45.1087 66.7501 40L65.2501 40Z"}), o.createElement("path", {d: "M82 9.25C81.5858 9.25 81.25 9.58579 81.25 10C81.25 10.4142 81.5858 10.75 82 10.75L82 9.25ZM82 10.75L129 10.75L129 9.25L82 9.25L82 10.75Z"}), o.createElement("path", {d: "M132 10L126 6.5359L126 13.4641L132 10ZM125 10.6L126.6 10.6L126.6 9.4L125 9.4L125 10.6Z"}), o.createElement("path", {d: "M132 50L126 46.5359L126 53.4641L132 50ZM125 50.6L126.6 50.6L126.6 49.4L125 49.4L125 50.6Z"}), o.createElement("path", {d: "M1 9.25C0.585786 9.25 0.25 9.58579 0.25 10C0.25 10.4142 0.585786 10.75 1 10.75L1 9.25ZM1 10.75L48 10.75L48 9.25L1 9.25L1 10.75Z"}), o.createElement("path", {d: "M51 10L45 6.5359L45 13.4641L51 10ZM44 10.6L45.6 10.6L45.6 9.4L44 9.4L44 10.6Z"})), o.createElement("g", {
                        id: "greenGroup",
                        fill: Ln().status
                    }, o.createElement("path", {d: "M1 50.75C0.585786 50.75 0.25 50.4142 0.25 50C0.25 49.5858 0.585786 49.25 1 49.25V50.75ZM2.6875 49.25C3.10171 49.25 3.4375 49.5858 3.4375 50C3.4375 50.4142 3.10171 50.75 2.6875 50.75V49.25ZM6.0625 50.75C5.64829 50.75 5.3125 50.4142 5.3125 50C5.3125 49.5858 5.64829 49.25 6.0625 49.25V50.75ZM9.4375 49.25C9.85171 49.25 10.1875 49.5858 10.1875 50C10.1875 50.4142 9.85171 50.75 9.4375 50.75V49.25ZM12.8125 50.75C12.3983 50.75 12.0625 50.4142 12.0625 50C12.0625 49.5858 12.3983 49.25 12.8125 49.25V50.75ZM15.7091 49.1718C16.1198 49.1182 16.4962 49.4077 16.5498 49.8185C16.6034 50.2292 16.3138 50.6056 15.9031 50.6592L15.7091 49.1718ZM18.6152 49.934C18.2325 50.0927 17.7938 49.9111 17.6351 49.5285C17.4764 49.1459 17.658 48.7071 18.0406 48.5484L18.6152 49.934ZM20.1308 47.3393C20.4593 47.0869 20.9301 47.1486 21.1825 47.477C21.4349 47.8054 21.3733 48.2763 21.0448 48.5287L20.1308 47.3393ZM23.0287 46.5448C22.7763 46.8733 22.3054 46.9349 21.977 46.6825C21.6486 46.4301 21.5869 45.9593 21.8393 45.6308L23.0287 46.5448ZM23.0484 43.5406C23.2071 43.158 23.6459 42.9764 24.0285 43.1351C24.4111 43.2937 24.5927 43.7325 24.434 44.1152L23.0484 43.5406ZM25.1592 41.4031C25.1056 41.8138 24.7292 42.1034 24.3185 42.0498C23.9077 41.9962 23.6182 41.6198 23.6718 41.2091L25.1592 41.4031ZM23.75 38.3333C23.75 37.9191 24.0858 37.5833 24.5 37.5833C24.9142 37.5833 25.25 37.9191 25.25 38.3333H23.75ZM25.25 35C25.25 35.4142 24.9142 35.75 24.5 35.75C24.0858 35.75 23.75 35.4142 23.75 35H25.25ZM23.75 31.6667C23.75 31.2525 24.0858 30.9167 24.5 30.9167C24.9142 30.9167 25.25 31.2525 25.25 31.6667H23.75ZM25.25 28.3333C25.25 28.7475 24.9142 29.0833 24.5 29.0833C24.0858 29.0833 23.75 28.7475 23.75 28.3333H25.25ZM23.75 25C23.75 24.5858 24.0858 24.25 24.5 24.25C24.9142 24.25 25.25 24.5858 25.25 25H23.75ZM25.25 21.6667C25.25 22.0809 24.9142 22.4167 24.5 22.4167C24.0858 22.4167 23.75 22.0809 23.75 21.6667H25.25ZM23.8408 18.5969C23.8944 18.1862 24.2708 17.8966 24.6815 17.9502C25.0923 18.0038 25.3818 18.3802 25.3282 18.7909L23.8408 18.5969ZM25.9516 16.4594C25.7929 16.842 25.3541 17.0236 24.9715 16.8649C24.5889 16.7062 24.4073 16.2675 24.566 15.8848L25.9516 16.4594ZM25.9713 13.4552C26.2237 13.1267 26.6946 13.0651 27.023 13.3175C27.3514 13.5699 27.4131 14.0407 27.1607 14.3692L25.9713 13.4552ZM28.8692 12.6607C28.5407 12.9131 28.0699 12.8514 27.8175 12.523C27.5651 12.1946 27.6267 11.7237 27.9552 11.4713L28.8692 12.6607ZM30.3848 10.066C30.7675 9.90734 31.2063 10.0889 31.3649 10.4715C31.5236 10.8541 31.342 11.2929 30.9594 11.4516L30.3848 10.066ZM33.2909 10.8282C32.8802 10.8818 32.5038 10.5923 32.4502 10.1815C32.3966 9.7708 32.6862 9.3944 33.0969 9.34082L33.2909 10.8282ZM36.0008 9.25C36.4151 9.25 36.7508 9.58578 36.7508 10C36.7508 10.4142 36.4151 10.75 36.0008 10.75V9.25ZM39.0025 10.75C38.5883 10.75 38.2525 10.4142 38.2525 10C38.2525 9.58578 38.5883 9.25 39.0025 9.25V10.75ZM42.0042 9.25C42.4184 9.25 42.7542 9.58578 42.7542 10C42.7542 10.4142 42.4184 10.75 42.0042 10.75V9.25ZM45.0059 10.75C44.5917 10.75 44.2559 10.4142 44.2559 10C44.2559 9.58578 44.5917 9.25 45.0059 9.25V10.75ZM46.8801 9.25C47.2943 9.25 47.6301 9.58578 47.6301 10C47.6301 10.4142 47.2943 10.75 46.8801 10.75V9.25ZM47.6267 10.75C47.2125 10.75 46.8767 10.4142 46.8767 10C46.8767 9.58578 47.2125 9.25 47.6267 9.25V10.75ZM1 49.25H2.6875V50.75H1V49.25ZM6.0625 49.25H9.4375V50.75H6.0625V49.25ZM12.8125 49.25H14.5V50.75H12.8125V49.25ZM14.5 49.25C14.9101 49.25 15.3137 49.2234 15.7091 49.1718L15.9031 50.6592C15.4436 50.7191 14.9752 50.75 14.5 50.75V49.25ZM18.0406 48.5484C18.7922 48.2367 19.4941 47.8286 20.1308 47.3393L21.0448 48.5287C20.3053 49.097 19.4895 49.5714 18.6152 49.934L18.0406 48.5484ZM21.8393 45.6308C22.3286 44.9941 22.7367 44.2922 23.0484 43.5406L24.434 44.1152C24.0714 44.9895 23.597 45.8053 23.0287 46.5448L21.8393 45.6308ZM23.6718 41.2091C23.7234 40.8137 23.75 40.4101 23.75 40H25.25C25.25 40.4752 25.2191 40.9436 25.1592 41.4031L23.6718 41.2091ZM23.75 40V38.3333H25.25V40H23.75ZM23.75 35V31.6667H25.25V35H23.75ZM23.75 28.3333V25H25.25V28.3333H23.75ZM23.75 21.6667V20H25.25V21.6667H23.75ZM23.75 20C23.75 19.5248 23.7809 19.0564 23.8408 18.5969L25.3282 18.7909C25.2766 19.1863 25.25 19.5899 25.25 20H23.75ZM24.566 15.8848C24.9286 15.0105 25.403 14.1947 25.9713 13.4552L27.1607 14.3692C26.6714 15.0059 26.2633 15.7078 25.9516 16.4594L24.566 15.8848ZM27.9552 11.4713C28.6947 10.903 29.5105 10.4286 30.3848 10.066L30.9594 11.4516C30.2078 11.7633 29.5059 12.1714 28.8692 12.6607L27.9552 11.4713ZM33.0969 9.34082C33.5564 9.28088 34.0248 9.25 34.5 9.25V10.75C34.0899 10.75 33.6863 10.7766 33.2909 10.8282L33.0969 9.34082ZM34.5 9.25H36.0008V10.75H34.5V9.25ZM39.0025 9.25H42.0042V10.75H39.0025V9.25ZM45.0059 9.25H46.5068V10.75H45.0059V9.25ZM46.5068 9.25H46.8801V10.75H46.5068V9.25ZM47.6267 9.25H48V10.75H47.6267V9.25Z"}), o.createElement("path", {d: "M65.4918 2.86265C65.8155 2.66106 66.2256 2.66106 66.5492 2.86265L76.6786 9.17201C77.307 9.56342 77.307 10.4782 76.6786 10.8696L66.5492 17.179C66.2256 17.3806 65.8154 17.3806 65.4918 17.179L55.3624 10.8696C54.734 10.4782 54.734 9.56342 55.3624 9.17201L65.4918 2.86265Z"}))))
                },
                size: {width: 300, height: 140, simplifiedWidth: 197}
            }, Au = {
                type: "counter",
                label: "达到指定次数时",
                tip: "例如：按无线开关超过三次，再按就小爱语音播报",
                cfg: {},
                props: {n: 10},
                inputs: {input: null, zero: null},
                outputs: {output: []},
                connector: {
                    inputs: [{
                        key: "input",
                        extra: "计数",
                        type: Qe.event,
                        simplifiedExtra: "计数"
                    }, {key: "zero", extra: "从零开始", type: Qe.event, simplifiedExtra: "清零"}],
                    outputs: [{key: "output", extra: "次时", type: Qe.both}]
                },
                size: {width: 328, height: 140},
                render: {type: "number", config: {left: "达到", key: "n"}}
            }, bu = {
                type: "delay",
                label: "延时",
                tip: "例如：门内开门1分钟之后关玄关灯",
                cfg: {unit: Xn.s, value: 10},
                props: {timeout: 1e4},
                inputs: {input: null},
                outputs: {output: []},
                connector: {inputs: [{key: "input", type: Qe.event}], outputs: [{key: "output", type: Qe.event}]},
                render: {type: "time", config: {placeholder: "延迟时间", key: "timeout"}},
                size: {width: 288, height: 112}
            };
            var Eu = {
                extra1: "查询",
                extra1Size: 28,
                extra2: "满足条件",
                extra2Size: 56,
                extra3: "否则",
                extra3Size: 28
            };
            const Cu = {
                type: "deviceGet",
                label: "查询当前状态",
                tip: "例如：查询温湿度计当前的温度",
                cfg: {urn: ""},
                config: Eu,
                inputs: {input: null},
                outputs: {output: [], output2: []},
                props: {},
                connector: {
                    inputs: [{key: "input", type: Qe.event, extra: Eu.extra1}],
                    outputs: [{key: "output", extra: Eu.extra2, type: Qe.event}, {
                        key: "output2",
                        extra: Eu.extra3,
                        type: Qe.event
                    }]
                }
            }, Ou = {
                type: "deviceInput",
                label: "事件发生或状态更新",
                tip: "例如：无线开关被单击、温湿度计的温度大于26度",
                cfg: {urn: ""},
                inputs: {},
                outputs: {output: []},
                props: {},
                connector: function (e) {
                    var t;
                    return e.props.siid || (t = []), e.props.eiid && (t = [{
                        key: "output",
                        type: Qe.event
                    }]), e.props.piid && (t = [{key: "output", type: Qe.both}]), {inputs: [], outputs: t}
                }
            };

            function wu(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            var ku = {inputs: [{key: "trigger", type: Qe.event}], outputs: [{key: "output", type: Qe.event}]};
            const xu = function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? wu(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wu(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }({
                type: "deviceOutput",
                label: "执行操作",
                tip: "例如：打开灯",
                cfg: {urn: ""},
                props: {},
                connector: ku
            }, up(ku)), Su = {
                type: "eventSequence",
                label: "事件先后发生",
                tip: "例如：先是客厅有人移动，然后过道有人移动，就打开房间的灯",
                cfg: {unit: Xn.s, value: 10},
                props: {timeout: 1e4},
                inputs: {input1: null, input2: null},
                outputs: {output: []},
                connector: {
                    inputs: [{
                        key: "input1",
                        extra: "第一事件",
                        type: Qe.event,
                        simplifiedExtra: "先"
                    }, {key: "input2", extra: "第二事件", type: Qe.event, simplifiedExtra: "后"}],
                    outputs: [{key: "output", extra: "先后发生", type: Qe.event}]
                },
                render: {type: "time", config: {left: "在", key: "timeout", right: "内", marginLeft: 76, height: 58}},
                size: {width: 524, height: 140}
            }, Tu = {
                type: "logicAnd",
                label: "满足全部条件",
                tip: "例如：两分钟无人移动且灯开着",
                cfg: {},
                props: {},
                inputs: {input0: null, input1: null},
                outputs: {output: []},
                connector: {
                    inputsLoopConfig: {name: "条件", key: "input", type: Qe.status},
                    outputs: [{key: "output", type: Qe.both, extra: null}]
                },
                size: {width: 160, simplifiedWidth: 88}
            }, Du = {
                type: "logicOr",
                label: "满足任一条件",
                tip: "例如：温度高于26度或湿度大于50%",
                cfg: {},
                props: {},
                inputs: {input0: null, input1: null},
                outputs: {output: []},
                connector: {
                    inputsLoopConfig: {name: "条件", key: "input", type: Qe.status},
                    outputs: [{key: "output", type: Qe.both, extra: null}]
                },
                size: {width: 160, simplifiedWidth: 88}
            }, Pu = {
                type: "loop",
                label: "循环",
                tip: "例如：每10分钟检查一次窗户是否关着",
                cfg: {unit: Xn.s, value: 10},
                props: {interval: 1e4},
                inputs: {start: null, stop: null},
                outputs: {output: []},
                connector: {
                    inputs: [{
                        key: "start",
                        extra: "开始循环",
                        type: Qe.event,
                        simplifiedExtra: "开始"
                    }, {key: "stop", extra: "停止循环", type: Qe.event, simplifiedExtra: "结束"}],
                    outputs: [{key: "output", extra: "每次", type: Qe.event}]
                },
                render: {
                    type: "time",
                    config: {
                        left: "每",
                        key: "interval",
                        placeholder: "循环时间",
                        right: "一次",
                        marginLeft: 76,
                        height: 58
                    }
                },
                size: {width: 510, height: 140}
            }, Ru = {
                type: "modeSwitch",
                label: "模式切换",
                tip: "例如：单击开关打开吸顶灯，再单击打开筒灯，再单击全关闭",
                cfg: {},
                props: {},
                inputs: {input: null},
                outputs: {output0: [], output1: []},
                connector: {
                    inputs: [{key: "input", type: Qe.event}],
                    outputsLoopConfig: {key: "output", name: "模式", type: Qe.event, action: "Mode"}
                },
                size: {width: 160, simplifiedWidth: 104}
            }, Bu = {
                type: "onLoad",
                label: "本自动化启用时",
                tip: "例如：自动化启用时就开始循环",
                cfg: {},
                props: {},
                inputs: {},
                outputs: {output: []},
                connector: {
                    inputs: [],
                    outputs: [{key: "output", type: Qe.event, extra: "启用时", simplifiedExtra: ""}]
                },
                size: {width: 160, height: 98, simplifiedWidth: 136}
            }, Iu = {
                type: "onlyNTimes",
                label: "最多触发指定次数",
                tip: "例如：每天只执行一次开门亮灯",
                cfg: {},
                props: {n: 10},
                inputs: {input: null, zero: null},
                outputs: {output: []},
                connector: {
                    inputs: [{
                        key: "input",
                        extra: "计数",
                        type: Qe.event,
                        simplifiedExtra: "计数"
                    }, {key: "zero", extra: "从零开始", type: Qe.event, simplifiedExtra: "清零"}],
                    outputs: [{key: "output", extra: "每次", type: Qe.event}]
                },
                render: {type: "number", config: {left: "最多", key: "n", right: "次"}},
                size: {width: 382, height: 140}
            }, ju = {
                type: "register",
                label: "自定义状态",
                tip: "例如：门锁反锁定义为家里无人状态，门外开锁定义为家里有人状态",
                cfg: {},
                props: {},
                inputs: {setTrue: null, setFalse: null},
                outputs: {output: []},
                connector: {
                    inputs: [{
                        key: "setTrue",
                        type: Qe.event,
                        extra: "状态为真",
                        simplifiedExtra: "真"
                    }, {key: "setFalse", extra: "状态为假", type: Qe.event, simplifiedExtra: "假"}],
                    outputs: [{key: "output", type: Qe.both}]
                },
                size: {width: 160, height: 140, simplifiedWidth: 146}
            }, Nu = {
                type: "signalOr",
                label: "当任一事件发生",
                tip: "例如：开门时或感应到有人移动时",
                cfg: {},
                props: {},
                inputs: {input0: null, input1: null},
                outputs: {output: []},
                connector: {
                    inputsLoopConfig: {name: "事件", key: "input", type: Qe.event},
                    outputs: [{key: "output", type: Qe.event, extra: null}]
                },
                size: {width: 160, simplifiedWidth: 88}
            }, Lu = {
                type: "statusLast",
                label: "状态维持了一段时间",
                tip: "例如：门窗传感器处于开着持续了5分钟",
                cfg: {unit: Xn.s, value: 10},
                props: {timeout: 1e4},
                inputs: {input: null},
                outputs: {output: []},
                connector: {inputs: [{key: "input", type: Qe.status}], outputs: [{key: "output", type: Qe.both}]},
                render: {type: "time", config: {placeholder: "持续时间", key: "timeout"}},
                size: {width: 288, height: 119}
            }, Qu = {
                type: "timeRange",
                label: "时间段",
                tip: "例如：处于工作日19:00～24:00",
                cfg: {},
                props: {start: {hour: 0, minute: 0, second: 0}, end: {hour: 0, minute: 0, second: 0}, filter: {}},
                inputs: {},
                outputs: {output: []},
                connector: {inputs: [], outputs: [{key: "output", type: Qe.both}]}
            }, Mu = {
                type: "nop",
                label: "文本",
                tip: "这是个文本",
                cfg: {contents: [], background: "#80CAFF"},
                props: {},
                inputs: {},
                outputs: {output: []},
                connector: {inputs: [], outputs: []},
                size: {width: 320, height: 60},
                resize: !0
            };

            function Zu(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Vu(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Zu(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zu(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Hu = {inputs: [{key: "input", type: Qe.status}], outputs: [{key: "output", type: Qe.both}]};
            const Fu = Vu(Vu({
                type: "logicNot",
                label: "状态取反",
                tip: "例如：温度不高于26度",
                cfg: {},
                props: {},
                connector: Hu
            }, up(Hu)), {}, {size: {width: 160, simplifiedWidth: 88}});

            function Gu(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            var Yu = {inputs: [], outputs: [{key: "output", type: Qe.event}]};
            const zu = function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Gu(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gu(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }({
                type: "deviceInputSetVar",
                label: "设备触发赋值",
                tip: "例如：当温度计的温度变化时，把温度赋值给指定变量",
                cfg: {urn: ""},
                props: {},
                connector: Yu
            }, up(Yu));

            function Uu(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            var qu = {extra1: "查询", extra1Size: 28}, Xu = {
                inputs: [{key: "input", type: Qe.event, extra: qu.extra1}],
                outputs: [{key: "output", type: Qe.event}]
            };
            const Ku = function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Uu(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Uu(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }({
                type: "deviceGetSetVar",
                label: "查询设备并赋值",
                tip: "例如：查询温度计当前的温度并赋值给指定变量",
                cfg: {urn: ""},
                config: qu,
                props: {},
                connector: Xu
            }, up(Xu));

            function Wu(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ju(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Wu(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wu(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var _u = {inputs: [], outputs: [{key: "output", type: Qe.both}]};
            const $u = Ju(Ju({
                type: "varChange",
                label: "变量值更新",
                tip: "变量发生变化时，更新输出状态的值",
                cfg: {},
                props: {preload: !1},
                connector: _u
            }, up(_u)), {}, {size: {simplifiedHeight: 90}});

            function el(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function tl(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? el(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : el(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var nl = {
                inputs: [{key: "input", type: Qe.event}],
                outputs: [{key: "output", extra: "满足条件", type: Qe.event}, {
                    key: "output2",
                    extra: "否则",
                    type: Qe.event
                }]
            };
            const rl = tl(tl({
                type: "varGet",
                label: "查询变量值",
                tip: "查询变量此刻的值",
                cfg: {},
                props: {},
                connector: nl
            }, up(nl)), {}, {size: {simplifiedHeight: 90}});

            function al(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ol(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? al(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : al(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var il = {inputs: [{key: "input", type: Qe.event}], outputs: [{key: "output", type: Qe.event}]};
            const cl = ol(ol({
                type: "varSetNumber",
                label: "数值运算",
                tip: "把运算式的结果赋值给指定变量",
                cfg: {},
                props: {},
                connector: il
            }, up(il)), {}, {headExtra: lp(), size: {simplifiedHeight: 61}});

            function ul(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ll(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ul(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ul(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var sl = {inputs: [{key: "input", type: Qe.event}], outputs: [{key: "output", type: Qe.event}]};
            const pl = ll(ll({
                type: "varSetString",
                label: "文本拼接",
                tip: "把填入的所有文本拼接起来并赋值给指定变量",
                cfg: {},
                props: {},
                connector: sl
            }, up(sl)), {}, {headExtra: lp(), size: {simplifiedHeight: 61}});
            n(43307);
            var fl = ".";

            function dl(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                    n = "".concat(fl).concat(e, ".").concat(t), r = Object.keys(zn).reduce((function (e, t) {
                        return e[t] = function () {
                            return "".concat(zn[t]).concat(n)
                        }, e
                    }), {});
                return r.connect3 = function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "0";
                    return "".concat(zn.connect3).concat(n, ".").concat(e)
                }, r
            }

            function ml(e) {
                var t = e.split(fl);
                return {type: t[0], element: t[1], connect: t[2]}
            }

            function vl(e) {
                var t = e.id, n = e.key;
                return "".concat(t).concat(fl).concat(n)
            }

            function hl(e) {
                var t = e.split(fl);
                return {id: t[0], key: t[1]}
            }

            function gl(e) {
                var t = "".concat(e.keyType, "-").concat(e.siid, "-"), n = "";
                return e.keyType === de.event && (n = e.eiid), e.keyType === de.action && (n = e.aiid), e.keyType === de.property && (n = e.piid), t + n
            }

            function yl(e) {
                return e.split("-").filter(Boolean)[0]
            }

            function Al(e) {
                return (0, U.isNumber)(e.piid) ? "".concat(de.property, "-").concat(e.siid, "-").concat(e.piid) : (0, U.isNumber)(e.aiid) ? "".concat(de.action, "-").concat(e.siid, "-").concat(e.aiid) : (0, U.isNumber)(e.eiid) ? "".concat(de.event, "-").concat(e.siid, "-").concat(e.eiid) : void 0
            }

            function bl(e) {
                var t = (0, o.useState)(.04), n = I()(t, 2), r = n[0], a = n[1];
                return o.createElement("svg", qe()({
                    className: "icon-circle cursor-pointer",
                    width: "20",
                    height: "20"
                }, e, {
                    viewBox: "0 0 21 20", xmlns: "http://www.w3.org/2000/svg", onMouseEnter: function () {
                        a(.08)
                    }, onMouseLeave: function () {
                        a(.04)
                    }
                }), o.createElement("path", {
                    d: "M10.7273 19C15.6979 19 19.7273 14.9706 19.7273 10C19.7273 5.02944 15.6979 1 10.7273 1C5.75673 1 1.72729 5.02944 1.72729 10C1.72729 14.9706 5.75673 19 10.7273 19Z",
                    fillOpacity: r,
                    fill: "currentColor"
                }), o.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M13.9273 10.8C14.3691 10.8 14.7273 10.4418 14.7273 10C14.7273 9.55817 14.3691 9.2 13.9273 9.2L7.52729 9.2C7.96912 9.2 7.69214 9.2 7.52729 9.2C7.08547 9.2 6.72729 9.55817 6.72729 10C6.72729 10.4418 7.08547 10.8 7.52729 10.8L13.9273 10.8Z",
                    fillOpacity: .4,
                    fill: "currentColor"
                }))
            }

            n(18073);
            var El = n(41568);

            function Cl(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return Ol(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Ol(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function Ol(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function wl(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function kl(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? wl(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wl(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function xl(e, t) {
                var n = function (e) {
                    var t = e.split(fl);
                    return {
                        type: t[0],
                        fromElement: t[1],
                        fromConnect: t[2],
                        from: "".concat(t[1]).concat(fl).concat(t[2]),
                        to: "".concat(t[3]).concat(fl).concat(t[4]),
                        toElement: t[3],
                        toConnect: t[4]
                    }
                }(t), r = n.fromElement, a = n.fromConnect, o = n.toElement, i = n.toConnect, c = e.find((function (e) {
                    return e.id === r
                }));
                if (c) {
                    var u, l = (0, U.cloneDeep)(c), s = null == (u = c.outputs) ? void 0 : u[a];
                    return s && (c.outputs[a] = s.filter((function (e) {
                        return e !== vl({id: o, key: i})
                    }))), [l, (0, U.cloneDeep)(c)]
                }
                return []
            }

            function Sl(e, t) {
                !function (e, t) {
                    e.forEach((function (e) {
                        Object.keys(e.outputs).forEach((function (n) {
                            var r = [];
                            e.outputs[n].forEach((function (e) {
                                e.includes(t) || r.push(e)
                            })), e.outputs[n] = r
                        }))
                    }))
                }(e, t), function (e, t) {
                    e.forEach((function (e) {
                        e.id === t && Object.keys(e.outputs).forEach((function (t) {
                            e.outputs[t] = []
                        }))
                    }))
                }(e, t)
            }

            function Tl(e, t) {
                var n = e.find((function (e) {
                    return e.id === t
                }));
                return Object.keys(n.inputs).map((function (n) {
                    var r = vl({id: t, key: n}), a = "", o = -1, i = null;
                    return e.forEach((function (e) {
                        var t = null;
                        return Object.keys(e.outputs).forEach((function (n) {
                            var c = e.outputs[n].indexOf(r);
                            -1 !== c && (a = n, i = e, o = c, t = {key: n, index: c, item: e})
                        })), t
                    })), {inputKey: n, outputKey: a, index: o, item: i}
                })).filter((function (e) {
                    return e.item
                }))
            }

            function Dl(e, t) {
                return T().isEdgeArrow ? "M".concat(e - 11, " ").concat(t + 4, "L").concat(e - 3, " ").concat(t, "L").concat(e - 11, " ").concat(t - 4) : "M".concat(e + 0, " ").concat(t, " L").concat(e - 8, " ").concat(t - 5, " L").concat(e - 8, " ").concat(t + 5)
            }

            var Pl = 16;

            function Rl(e, t, n) {
                var r = e.x1, a = e.x2, o = e.y1, i = e.y2, c = {x: parseFloat(r), y: parseFloat(o)},
                    u = {x: parseFloat(a), y: parseFloat(i)}, l = t.cfg.pos,
                    s = n ? n.cfg.pos : {x: u.x, y: u.y - Pl, width: 2 * Pl, height: 2 * Pl}, p = function (e) {
                        var t = e.src, n = e.dst, r = 16, a = null, o = "M ".concat(t.x, " ").concat(t.y);

                        function i(e) {
                            var t = e.src, n = e.dst, a = n.x - t.x;
                            if (T().isLine90) if (a > 0) o += " L ".concat(t.x + a / 2, " ").concat(t.y, "  ").concat(n.x - a / 2, " ").concat(n.y, " ").concat(n.x, " ").concat(n.y); else {
                                var i = (t.bottomY + n.topY) / 2;
                                o += " L ".concat(t.x + r, " ").concat(t.y, "  \n        ").concat(t.x + r, " ").concat(i, " \n        ").concat(n.x - r, " ").concat(i, " \n        ").concat(n.x - r, " ").concat(n.y, " \n        ").concat(n.x, " ").concat(n.y, " ")
                            } else if (T().isLine90Radius && Math.abs(n.y - t.y) > 13) if (a > 0) {
                                var c = t.y < n.y ? 1 : -1;
                                o += " H ".concat(t.x + a / 2 - 8, " \n        C ").concat(t.x + a / 2 - 8, " ").concat(t.y, " ").concat(t.x + a / 2, " ").concat(t.y, " ").concat(t.x + a / 2, " ").concat(t.y + 8 * c, " \n        L ").concat(t.x + a / 2, " ").concat(t.y + 8 * c, " ").concat(t.x + a / 2, " ").concat(n.y - 8 * c, "  \n        C ").concat(t.x + a / 2, " ").concat(n.y - 8 * c, "   ").concat(t.x + a / 2, " ").concat(n.y, "  ").concat(t.x + a / 2 + 8, " ").concat(n.y, " \n        L ").concat(n.x, " ").concat(n.y)
                            } else {
                                var u = (t.bottomY + n.topY) / 2;
                                o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y + r, " "), o += " V ".concat(u - r, " "), o += " Q ".concat(t.x + r, "  ").concat(u, "  ").concat(t.x, "  ").concat(u, " "), o += " H ".concat(n.x, " ");
                                var l = n.y - u;
                                l < 32 ? (o += " H ".concat(n.x - 8, " "), o += " Q ".concat(n.x - l / 2, "  ").concat(u, "  ").concat(n.x - l / 2, "  ").concat(u + l / 2, " "), o += " Q ".concat(n.x - l / 2, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " ")) : (o += " Q ".concat(n.x - r, "  ").concat(u, "  ").concat(n.x - r, "  ").concat(u + r, " "), o += " V ".concat(n.y - r, " "), o += " Q ".concat(n.x - r, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " "))
                            } else if (a > 0) {
                                var s = n.x - t.x;
                                o += " C ".concat(t.x + s / 4, " ").concat(t.y, "  ").concat(n.x - s / 4, " ").concat(n.y, " ").concat(Math.max(t.x, n.x - 8), " ").concat(n.y, " ")
                            } else {
                                var p = (t.bottomY + n.topY) / 2;
                                o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y + r, " "), o += " V ".concat(p - r, " "), o += " Q ".concat(t.x + r, "  ").concat(p, "  ").concat(t.x, "  ").concat(p, " "), o += " H ".concat(n.x, " ");
                                var f = n.y - p;
                                f < 32 ? (o += " H ".concat(n.x - 8, " "), o += " Q ".concat(n.x - f / 2, "  ").concat(p, "  ").concat(n.x - f / 2, "  ").concat(p + f / 2, " "), o += " Q ".concat(n.x - f / 2, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " ")) : (o += " Q ".concat(n.x - r, "  ").concat(p, "  ").concat(n.x - r, "  ").concat(p + r, " "), o += " V ".concat(n.y - r, " "), o += " Q ".concat(n.x - r, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " "))
                            }
                        }

                        if (!0 === e.isSameCard && n.x - t.x > 40) t.y - t.topY + (n.y - n.topY) < t.bottomY - t.y + (n.bottomY - n.y) ? (o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y - r, " "), o += " V ".concat(t.topY, " "), o += " Q ".concat(t.x + r, "  ").concat(t.topY - r, "  ").concat(t.x, "  ").concat(t.topY - r, " "), o += " H ".concat(n.x, " "), o += " Q ".concat(n.x - r, "  ").concat(t.topY - r, "  ").concat(n.x - r, "  ").concat(t.topY, " "), o += " V ".concat(n.y - r, " "), o += " Q ".concat(n.x - r, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " "), a = {
                            minX: n.x - r,
                            minY: t.topY - r,
                            maxX: t.x + r,
                            maxY: Math.max(n.y, t.y)
                        }) : (o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y + r, " "), o += " V ".concat(t.bottomY, " "), o += " Q ".concat(t.x + r, "  ").concat(t.bottomY + r, "  ").concat(t.x, "  ").concat(t.bottomY + r, " "), o += " H ".concat(n.x, " "), o += " Q ".concat(n.x - r, "  ").concat(t.bottomY + r, "  ").concat(n.x - r, "  ").concat(t.bottomY, " "), o += " V ".concat(n.y + r, " "), o += " Q ".concat(n.x - r, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " "), a = {
                            minX: n.x - r,
                            minY: Math.min(n.y, t.y),
                            maxX: t.x + r,
                            maxY: t.bottomY + r
                        }); else if (n.x > t.x) i({src: t, dst: n}), a = {
                            minX: t.x,
                            minY: Math.min(n.y, t.y),
                            maxX: n.x,
                            maxY: Math.max(n.y, t.y)
                        }; else if (t.bottomY < n.topY) i({src: t, dst: n}), a = {
                            minX: n.x - r,
                            minY: t.y,
                            maxX: t.x + r,
                            maxY: n.y
                        }; else if (t.y < n.y) {
                            var c = Math.min(t.leftX - n.x, 0), u = Math.min(t.topY, n.topY);
                            T().isLine90 ? o += " L ".concat(t.x + r, "  ").concat(t.y, "  \n        ").concat(t.x + r, "  ").concat(u - r, "  \n        ").concat(n.x + c - r, " ").concat(u - r, " \n        ").concat(n.x + c - r, " ").concat(n.y, "\n        ").concat(n.x, " ").concat(n.y, " ") : (o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y - r, " "), o += " V ".concat(u, " "), o += " Q ".concat(t.x + r, "  ").concat(u - r, "  ").concat(t.x, "  ").concat(u - r, " "), o += " H ".concat(n.x + c, " "), o += " Q ".concat(n.x + c - r, "  ").concat(u - r, "  ").concat(n.x + c - r, "  ").concat(u, " "), o += " V ".concat(n.y - r, " "), o += " Q ".concat(n.x + c - r, "  ").concat(n.y, "  ").concat(n.x + c - 8, "  ").concat(n.y, " "), 0 !== c && (o += " H ".concat(n.x - 8, " "))), a = {
                                minX: n.x + c - r,
                                minY: u - r,
                                maxX: t.x + r,
                                maxY: n.y
                            }
                        } else if (t.topY < n.bottomY) {
                            var l = Math.min(t.leftX - n.x, 0), s = Math.max(t.bottomY, n.bottomY);
                            T().isLine90 ? o += " L ".concat(t.x + r, "  ").concat(t.y, "  \n        ").concat(t.x + r, "  ").concat(s + r, "  \n        ").concat(n.x + l - r, " ").concat(s + r, " \n        ").concat(n.x + l - r, " ").concat(n.y, "\n        ").concat(n.x, " ").concat(n.y, " ") : (o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y + r, " "), o += " V ".concat(s, " "), o += " Q ".concat(t.x + r, "  ").concat(s + r, "  ").concat(t.x, "  ").concat(s + r, " "), o += " H ".concat(n.x + l, " "), o += " Q ".concat(n.x + l - r, "  ").concat(s + r, "  ").concat(n.x + l - r, "  ").concat(s, " "), o += " V ".concat(n.y + r, " "), o += " Q ".concat(n.x + l - r, "  ").concat(n.y, "  ").concat(n.x + l - 8, "  ").concat(n.y, " "), 0 !== l && (o += " H ".concat(n.x - 8, " "))), a = {
                                minX: n.x + l - r,
                                minY: n.y,
                                maxX: t.x + r,
                                maxY: s + r
                            }
                        } else {
                            var p = (n.bottomY + t.topY) / 2;
                            if (n.y, T().isLine90) o += " L ".concat(t.x + r, "  ").concat(t.y, "   \n        ").concat(t.x + r, "  ").concat(p, "\n        ").concat(n.x - r, "  ").concat(p, "\n        ").concat(n.x - r, "  ").concat(n.y, "\n        ").concat(n.x, "  ").concat(n.y, "\n        "); else {
                                o += " Q ".concat(t.x + r, "  ").concat(t.y, "  ").concat(t.x + r, "  ").concat(t.y - r, " "), o += " V ".concat(p + r, " "), o += " Q ".concat(t.x + r, "  ").concat(p, "  ").concat(t.x, "  ").concat(p, " "), o += " H ".concat(n.x, " ");
                                var f = p - n.y;
                                f < 32 ? (o += " H ".concat(n.x - 8, " "), o += " Q ".concat(n.x - f / 2, "  ").concat(p, "  ").concat(n.x - f / 2, "  ").concat(p - f / 2, " "), o += " Q ".concat(n.x - f / 2, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " ")) : (o += " Q ".concat(n.x - r, "  ").concat(p, "  ").concat(n.x - r, "  ").concat(p - r, " "), o += " V ".concat(n.y + r, " "), o += " Q ".concat(n.x - r, "  ").concat(n.y, "  ").concat(n.x - 8, "  ").concat(n.y, " "))
                            }
                            a = {minX: n.x - r, minY: n.y, maxX: t.x + r, maxY: t.y}
                        }
                        return {linePath: o, boundaryRect: a}
                    }({
                        src: kl(kl({}, c), {}, {leftX: l.x, topY: l.y, bottomY: l.y + l.height}),
                        dst: kl(kl({}, u), {}, {leftX: u.x, topY: s.y, bottomY: s.y + s.height}),
                        isSameCard: t.id === (null == n ? void 0 : n.id)
                    }), f = p.linePath, d = p.boundaryRect;
                return kl({linePath: f, triPath: Dl(u.x, u.y)}, d)
            }

            function Bl(e, t) {
                if ((0, El.Z)(e)) return {
                    connectedLineList: [],
                    normalConnectedLineList: [],
                    activeLineList: [],
                    activeLineCardIdMap: {}
                };
                var n = [], r = [], a = {}, o = Jd.selectTool.data, i = o.selectedCards, c = o.selectedLines,
                    u = e.reduce((function (o, u) {
                        return Object.keys(u.outputs).forEach((function (l) {
                            var s = u.outputs[l];
                            "string" != typeof s && s.forEach((function (s) {
                                var p, f = ml((p = s, "".concat(zn.connect).concat(fl).concat(p))),
                                    d = kl(kl({}, f), {}, {
                                        cardType: e.find((function (e) {
                                            return e.id === f.element
                                        })).type
                                    }), m = kl(kl({}, ml(dl(u.id, l).connect())), {}, {cardType: u.type}),
                                    v = Ur(e, u.id), h = Ur(e, d.element), g = Object.keys(v.outputs).indexOf(l),
                                    y = Object.keys(h.inputs).indexOf(d.connect);
                                if (!(!v || !h || g < 0 || y < 0)) {
                                    var A = Jd.connectTool.getIOPosition(v, "outputs"),
                                        b = Jd.connectTool.getIOPosition(h, "inputs"), E = v.cfg.pos, C = h.cfg.pos,
                                        O = E.width + E.x, w = E.y + A[g], k = C.x, x = C.y + b[y],
                                        S = Jd.connectTool.getIOType(h, "inputs", y),
                                        T = Rl({x1: O, x2: k, y1: w, y2: x}, v, h), D = T.linePath, P = T.triPath,
                                        R = T.minX, B = T.minY, I = T.maxX, j = T.maxY, N = {
                                            key: m.element + m.connect + d.element + d.connect,
                                            dataId: dl(m.element, m.connect).connect3("".concat(d.element, ".").concat(d.connect)),
                                            elementFrom: v,
                                            elementTo: h,
                                            fromDetail: m,
                                            toDetail: d,
                                            toType: S,
                                            x1: O,
                                            y1: w,
                                            x2: k,
                                            y2: x,
                                            linePath: D,
                                            triPath: P,
                                            minX: R,
                                            minY: B,
                                            maxX: I,
                                            maxY: j
                                        }, L = c.includes(N.dataId), Q = function (e) {
                                            var t = e.fromDetail, n = e.toDetail, r = e.currentFrame;
                                            if (!r) return !1;
                                            var a = {
                                                srcNodeId: t.element,
                                                srcName: t.connect,
                                                dstNodeId: n.element,
                                                dstName: n.connect
                                            }, o = Jr.kd.getLogAnimationCalculatorLogId(a), i = r.status[o];
                                            return !(r.new !== o || !i)
                                        }({fromDetail: m, toDetail: d, currentFrame: t});
                                    if (L || Q || i.includes(v.id) || i.includes(h.id)) return r.push(kl(kl({}, N), {}, {
                                        active: L,
                                        isLogActive: Q
                                    })), a[v.id] = !0, void (a[h.id] = !0);
                                    n.push(N), o.push(N)
                                }
                            }))
                        })), o
                    }), []);
                return {connectedLineList: u, normalConnectedLineList: n, activeLineList: r, activeLineCardIdMap: a}
            }

            function Il() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, t = Jd.target.id;
                if (!document.getElementById(t)) return {};
                var n = document.getElementById(t).dataset, r = n.x, a = n.y;
                r = parseInt(r);
                var o = a = parseInt(a), i = ml(t);
                return {
                    from: t,
                    x2: r + e,
                    y2: o,
                    x1: r,
                    y1: a,
                    type: zn.connect,
                    id: dl(i.element, i.connect).connect2()
                }
            }

            function jl(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Nl(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? jl(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jl(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Ll(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Ql = function (e) {
                var t = e.data, n = e.onChange, r = e.setOpen;
                return o.createElement("div", {
                    className: "card-device-service-dropdown", onClick: function (e) {
                        return e.stopPropagation()
                    }
                }, t.map((function (e) {
                    return o.createElement("div", {
                        key: e.siid,
                        className: "card-device-service-dropdown-list"
                    }, o.createElement("div", {className: "card-device-service-dropdown-list-title"}, " ", e.sDescription), e.list.map((function (e) {
                        var t = gl(e);
                        return o.createElement("div", {
                            key: t,
                            className: "card-device-service-dropdown-list-content",
                            onClick: function (e) {
                                n(t), e.stopPropagation(), r(!1)
                            }
                        }, e.description.length > 10 ? o.createElement(ho, {
                            placement: "right",
                            title: o.createElement("div", null, e.sDescription, "-", e.description)
                        }, o.createElement("div", {className: "card-device-service-dropdown-list-content-text"}, e.description)) : o.createElement("div", {className: "card-device-service-dropdown-list-content-text"}, e.description))
                    })))
                })))
            };

            function Ml(e) {
                var t = e.standardGroups, n = e.unStandardGroups, r = e.onChange, i = e.specs, c = e.value,
                    u = e.status, l = e.onDropdownVisibleChange, s = (0, o.useState)(!1), p = I()(s, 2), f = p[0],
                    d = p[1], m = (0, o.useState)(!1), v = I()(m, 2), h = v[0], g = v[1], y = i.map((function (e) {
                        return {label: "".concat(e.sDescription, "-").concat(e.description), value: gl(e)}
                    })), A = c && y.every((function (e) {
                        return e.value !== c
                    })), b = {width: Ce};
                A && (b.color = "var(--warning-color)");
                var E = (0, o.useRef)(), C = or((function (e) {
                    d(e), l && l(!e)
                }), [l]);
                return (0, o.useEffect)((function () {
                    if (f) return cr(document, "pointerdown", (function (e) {
                        e.target !== E.current && C(!1)
                    }))
                }), [f]), o.createElement(Ro, {onChange: r}, (function (e) {
                    return o.createElement(Dn, {
                        open: f,
                        onPointerDown: function (e) {
                            E.current = e.target, d((function (e) {
                                return !e
                            }))
                        },
                        onDropdownVisibleChange: l,
                        status: u,
                        value: A ? "data-loss" : c,
                        placeholder: "请选择服务",
                        style: b,
                        options: A ? [{label: "原已选功能丢失", value: "data-loss"}].concat(a()(y)) : y,
                        dropdownRender: function () {
                            return o.createElement("div", {
                                style: {
                                    maxHeight: 400,
                                    overflowY: "auto",
                                    overflowX: "hidden"
                                }, onPointerDown: function (e) {
                                    e.stopPropagation()
                                }
                            }, o.createElement(Ql, {
                                data: t,
                                onChange: e,
                                setOpen: C
                            }), n.length > 0 ? o.createElement(o.Fragment, null, o.createElement("div", {
                                className: h ? "card-device-service-dropdown-open" : "card-device-service-dropdown-close",
                                onClick: function (e) {
                                    g(!h), e.stopPropagation()
                                }
                            }, h ? "非标准功能" : "显示非标准功能"), h ? o.createElement(Ql, {
                                setOpen: C,
                                data: n,
                                onChange: e
                            }) : null) : null)
                        }
                    })
                }))
            }

            var Zl = function (e) {
                J()(n, e);
                var t = Ll(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "isRightNumber", value: function (e, t) {
                        return e.dtype === me.int && (0, U.isInteger)(t) || e.dtype === me.float && (0, U.isNumber)(t)
                    }
                }, {
                    key: "isLoading", value: function (e) {
                        var t;
                        return (null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.netStatus) === aa
                    }
                }, {
                    key: "isError", value: function (e) {
                        var t;
                        return (null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.netStatus) === ia
                    }
                }, {
                    key: "getLoadingNode", value: function () {
                        return o.createElement("div", null, o.createElement(jn.Z, {
                            style: {width: Ce},
                            value: "加载中..."
                        }))
                    }
                }, {
                    key: "getErrorNode", value: function (e) {
                        var t = this;
                        return o.createElement("div", null, o.createElement(jn.Z, {
                            style: {width: Ce},
                            value: "功能加载失败",
                            className: "card-device-service-error",
                            suffix: o.createElement(kn.Refresh, {
                                style: {fontSize: 20}, onClick: function () {
                                    localStorage.removeItem(e.cfg.urn), t.parent.gateway.getDeviceDetail(e.cfg.urn), update()
                                }
                            })
                        }))
                    }
                }, {
                    key: "render", value: function (e, t) {
                        if (!e.cfg.urn) return K()(te()(n.prototype), "render", this).call(this, e, this.getErrorNode(e));
                        if (this.isLoading(e)) return K()(te()(n.prototype), "render", this).call(this, e, this.getLoadingNode(e));
                        if (this.isError(e)) return K()(te()(n.prototype), "render", this).call(this, e, this.getErrorNode(e));
                        var r = Jd.gateway.data.devList.find((function (t) {
                                return e.props.did ? t.did === e.props.did : t.urn === e.cfg.urn
                            })) || {name: "设备已丢失", roomName: "未知", error: !0}, a = this.parent.model[e.type],
                            i = function (t) {
                                return (((0, U.isFunction)(a.connector) ? a.connector(e) : a.connector)[t] || []).some((function (e) {
                                    return !!e.extra
                                }))
                            },
                            c = o.createElement(o.Fragment, null, o.createElement("div", {className: "".concat(i("inputs") ? "card-has-input-label" : "", " ").concat(i("outputs") ? "card-has-output-label" : "")}, o.createElement("div", {className: "card-content-header-device"}, o.createElement(Fe.Z, {
                                rootClassName: "card-content-header-device-thumb",
                                draggable: !1,
                                src: r.icon || fu,
                                preview: !1,
                                fallback: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                            }), o.createElement("div", {className: "card-content-header-device-desc"}, o.createElement("div", {className: (0, Ge.Z)("card-content-header-device-name", {error: r.error})}, r.name), o.createElement("div", {className: "card-content-header-device-meta"}, au(r)))), "function" == typeof t ? t(Jd) : t));
                        return K()(te()(n.prototype), "render", this).call(this, e, c)
                    }
                }, {
                    key: "getEmptyNode", value: function () {
                        return null
                    }
                }, {
                    key: "getActionData", value: function (e) {
                        var t = this.parent.gateway.data.urnMap[e.cfg.urn].action.find((function (t) {
                            return t.aiid === e.props.aiid && t.siid === e.props.siid
                        }));
                        return t ? t.in : []
                    }
                }, {
                    key: "getEventData", value: function (e) {
                        var t,
                            n = ((null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.event) || []).find((function (t) {
                                return t.eiid === e.props.eiid && t.siid === e.props.siid
                            }));
                        return (null == n ? void 0 : n.arguments) || []
                    }
                }, {
                    key: "getNotifyData", value: function (e) {
                        var t;
                        return ((null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.propertyNotify) || []).find((function (t) {
                            return t.piid === e.props.piid && t.siid === e.props.siid
                        })) || {}
                    }
                }, {
                    key: "getSetData", value: function (e) {
                        var t;
                        return ((null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.propertySet) || []).find((function (t) {
                            return t.piid === e.props.piid && t.siid === e.props.siid
                        })) || {}
                    }
                }, {
                    key: "getGetData", value: function (e) {
                        var t;
                        return ((null == (t = this.parent.gateway.data.urnMap[e.cfg.urn]) ? void 0 : t.propertyGet) || []).find((function (t) {
                            return t.piid === e.props.piid && t.siid === e.props.siid
                        })) || {}
                    }
                }, {
                    key: "isProperty", value: function (e) {
                        return [de.propertyGet, de.propertySet, de.propertyNotify].includes(e)
                    }
                }, {
                    key: "getStatusByText", value: function (e) {
                        return e ? le : se
                    }
                }, {
                    key: "getUnitWrapper", value: function (e, t) {
                        return t.unit ? o.createElement(ho, {
                            title: o.createElement("div", null, "单位：", t.unit),
                            key: t.piid
                        }, e) : e
                    }
                }, {
                    key: "filterValueListSpec", value: function (e) {
                        var t = [], n = function (e) {
                            return me.valueList in e && e.dtype !== me.boolean
                        };
                        return e.forEach((function (e) {
                            if ((0, U.isNumber)(e.eiid)) {
                                var r = e.arguments.filter((function (e) {
                                    return !n(e)
                                }));
                                if (r.length < 1) return;
                                t.push(Nl(Nl({}, e), {}, {arguments: r}))
                            } else (0, U.isNumber)(e.piid) && (n(e) || t.push(e))
                        })), t
                    }
                }, {
                    key: "renderService", value: function () {
                        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            n = t.value, r = t.item, a = t.specs, i = t.validateData, c = t.isInVarCard;

                        function u(e) {
                            var t = [], n = [];
                            return e.forEach((function (e) {
                                var r = 0;
                                n.includes(e.siid) ? (r = n.indexOf(e.siid), t[r].list.push(e)) : (n.push(e.siid), t.push({
                                    siid: e.siid,
                                    sDescription: e.sDescription,
                                    list: [e]
                                }))
                            })), t
                        }

                        var l = a.filter((function (e) {
                            return !e.proprietary
                        })), s = a.filter((function (e) {
                            return e.proprietary
                        })), p = u(l), f = u(s);
                        return o.createElement(Ec.Z, {layout: "inline"}, o.createElement(Ec.Z.Item, null, o.createElement(Ml, {
                            specs: a,
                            value: n,
                            status: this.getStatusByText(i.siid),
                            standardGroups: p,
                            unStandardGroups: f,
                            onChange: function (t) {
                                n && t && yl(n) !== yl(t) && Sl(e.parent.data, r.id);
                                var o = a.find((function (e) {
                                    return gl(e) === t
                                })), i = {did: r.props.did, siid: o.siid};
                                if (r.props = i, o.keyType === de.property && (i.piid = o.piid, [ip.deviceInput, ip.deviceInputSetVar].includes(r.type) && (i.preload = !1), c ? i.dtype = ka(o.dtype) : (i.dtype = o.dtype, i.operator = "")), o.keyType === de.event && (i.eiid = o.eiid, i.arguments = []), o.keyType === de.action) {
                                    i.aiid = o.aiid;
                                    var u = e.getActionData(r);
                                    i.ins = u.map((function (e) {
                                        return {piid: e.piid, value: ""}
                                    }))
                                }
                                e.parent.sizeTool.run(r), update()
                            },
                            onDropdownVisibleChange: function (e) {
                                Jd.lockScroll(!e)
                            }
                        })))
                    }
                }, {
                    key: "renderServiceItem", value: function () {
                        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            n = t.value, r = t.item, a = t.specs, i = t.validateData, c = t.isInVarCard;

                        function u(e) {
                            var t = [], n = [];
                            return e.forEach((function (e) {
                                var r = 0;
                                n.includes(e.siid) ? (r = n.indexOf(e.siid), t[r].list.push(e)) : (n.push(e.siid), t.push({
                                    siid: e.siid,
                                    sDescription: e.sDescription,
                                    list: [e]
                                }))
                            })), t
                        }

                        var l = a.filter((function (e) {
                            return !e.proprietary
                        })), s = a.filter((function (e) {
                            return e.proprietary
                        })), p = u(l), f = u(s);
                        return o.createElement(Ec.Z.Item, null, o.createElement(Ml, {
                            specs: a,
                            value: n,
                            status: this.getStatusByText(i.siid),
                            standardGroups: p,
                            unStandardGroups: f,
                            onChange: function (t) {
                                n && t && yl(n) !== yl(t) && Sl(e.parent.data, r.id);
                                var o = a.find((function (e) {
                                    return gl(e) === t
                                })), i = {did: r.props.did, siid: o.siid};
                                if (r.props = i, o.keyType === de.property && (i.piid = o.piid, [ip.deviceInput, ip.deviceInputSetVar].includes(r.type) && (i.preload = !1), c ? i.dtype = ka(o.dtype) : (i.dtype = o.dtype, i.operator = "")), o.keyType === de.event && (i.eiid = o.eiid, i.arguments = []), o.keyType === de.action) {
                                    i.aiid = o.aiid;
                                    var u = e.getActionData(r);
                                    i.ins = u.map((function (e) {
                                        return {piid: e.piid, value: ""}
                                    }))
                                }
                                e.parent.sizeTool.run(r), update()
                            },
                            onDropdownVisibleChange: function (e) {
                                Jd.lockScroll(!e)
                            }
                        }))
                    }
                }]), n
            }(hu);
            const Vl = Zl;

            function Hl(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Fl(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Hl(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Hl(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Gl(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Yl = Ec.Z.Item, zl = function (e) {
                J()(n, e);
                var t = Gl(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e) {
                        var t = this;
                        return K()(te()(n.prototype), "render", this).call(this, e, (function (r) {
                            var i = r.gateway.data.urnMap[e.cfg.urn], c = Al(e.props), u = r.nodeCheckTool.check(e);
                            return o.createElement(o.Fragment, null, o.createElement(Ec.Z, {layout: "inline"}, K()(te()(n.prototype), "renderServiceItem", t).call(t, {
                                value: c,
                                item: e,
                                specs: [].concat(a()(i.event), a()(i.propertyNotify)),
                                validateData: u
                            }), (0, U.isNumber)(e.props.piid) ? t.renderSpecItem(de.propertyNotify, e, 0, u) : null), (0, U.isNumber)(e.props.eiid) ? t.renderEvent(e, u) : null, (0, U.isNumber)(e.props.piid) ? o.createElement(Ec.Z, {
                                className: "card-device-switch-form",
                                layout: "inline"
                            }, o.createElement(Yl, {
                                label: "规则启用时查询一次",
                                colon: !1
                            }, o.createElement(jo, {
                                checked: e.props.preload, onChange: function (t) {
                                    e.props = Fl(Fl({}, e.props), {}, {preload: t}), update()
                                }
                            }))) : null)
                        }))
                    }
                }, {
                    key: "renderEventLine", value: function (e, t, n, r, i, c) {
                        var u = this;
                        return o.createElement(Ec.Z, {
                            key: r.key || r.piid,
                            layout: "inline",
                            style: {position: "relative"}
                        }, o.createElement(Yl, null, o.createElement(Dn, {
                            placeholder: "请选择",
                            status: this.getStatusByText(i.piid),
                            value: r.piid,
                            options: n.map((function (e) {
                                return {label: e.description, value: e.piid, disabled: c.includes(e.piid)}
                            })),
                            onChange: function (o) {
                                var i = n.find((function (e) {
                                    return e.piid === o
                                }));
                                r.key && delete r.key, r.piid = i.piid, r.dtype = i.dtype, r.operator = "", r.v1 = "", i.valueList && r.dtype !== me.boolean && (r.v1 = []), e.props.arguments[t] = Fl({}, r), e.props.arguments = a()(e.props.arguments), e.props = Fl({}, e.props), u.parent.sizeTool.run(e), update()
                            }
                        })), (0, U.isNumber)(r.piid) && this.renderSpecItem(de.event, e, t, i), o.createElement(bl, {
                            className: "card-device-event-delete-icon",
                            onClick: function () {
                                e.props.arguments.splice(t, 1), e.props.arguments = a()(e.props.arguments), e.props = Fl({}, e.props), u.parent.sizeTool.run(e), update()
                            }
                        }))
                    }
                }, {
                    key: "renderEvent", value: function (e, t) {
                        var n = this, r = this.getEventData(e);
                        if (0 === r.length) return null;
                        var a = e.props.arguments, i = a.map((function (e) {
                            return e.piid
                        })).filter(Boolean);
                        return o.createElement(o.Fragment, null, a.map((function (a, o) {
                            var c;
                            return n.renderEventLine(e, o, r, a, (null == (c = t.arguments) ? void 0 : c[o]) || {}, i)
                        })), a.length !== r.length ? o.createElement("div", {
                            className: "card-device-event-add-button",
                            "data-id": "1",
                            onClick: function () {
                                e.props.arguments.push({
                                    dtype: "int",
                                    key: (new Date).getTime()
                                }), e.props = Fl({}, e.props), n.parent.sizeTool.run(e), update()
                            }
                        }, o.createElement(_o, null), 0 === a.length ? o.createElement("span", {className: "card-device-event-add-button-text"}, "添加参数") : null) : null)
                    }
                }, {
                    key: "renderSpecItem", value: function (e, t, n, r) {
                        var a = this, i = je.equal, c = null, u = null, l = null;
                        if (this.isProperty(e)) c = e === de.propertyNotify ? this.getNotifyData(t) : this.getGetData(t), u = t.props, l = function () {
                            t.props = Fl({}, t.props)
                        }; else {
                            var s = this.getEventData(t);
                            u = t.props.arguments[n], c = s.find((function (e) {
                                return e.piid === u.piid
                            })), l = function () {
                                t.props.arguments[n] = Fl({}, u), t.props = Fl({}, t.props)
                            }
                        }
                        var p = r.v1, f = this.getStatusByText(p);
                        if (!c) return null;
                        if (me.valueList in c) return u.dtype === me.boolean ? o.createElement(Yl, {
                            label: "为",
                            colon: !1
                        }, o.createElement(Dn, {
                            placeholder: "请选择", status: f, value: u.v1, onChange: function (e) {
                                u.v1 = e, u.operator = i, l(), update()
                            }
                        }, c.valueList.map((function (e) {
                            return o.createElement(Dn.Option, {key: e.value, value: e.value}, e.description)
                        })))) : o.createElement(Yl, {
                            label: "包含",
                            colon: !1
                        }, o.createElement(lo, {
                            placeholder: "请选择",
                            status: f,
                            style: {width: Ie.include - 48},
                            value: u.operator === je.equal ? [u.v1] : u.v1,
                            options: c.valueList.map((function (e) {
                                return {value: e.value, label: e.description}
                            })),
                            onChange: function (e) {
                                u.v1 = e, u.operator = je.include, l(), update()
                            }
                        }));
                        if (c.dtype === me.string) return o.createElement(Yl, null, o.createElement(Tr, {
                            placeholder: "请输入",
                            status: f,
                            defaultValue: u.v1,
                            onChange: function (e) {
                                u.v1 = e.target.value, u.operator = i, a.parent.sizeTool.run(t), l(), update()
                            }
                        }));
                        if (c.dtype === me.int || c.dtype === me.float) {
                            var d = r.operator, m = this.getStatusByText(d), v = r.v2, h = this.getStatusByText(v),
                                g = H()(H()({}, me.int, {
                                    tags: [je.moreEqual, je.lessEqual, je.equal, je.unEqual, je.more, je.less, je.between],
                                    label: [Ne.moreEqual, Ne.lessEqual, Ne.equal, Ne.unEqual, Ne.more, Ne.less, Ne.between]
                                }), me.float, {
                                    tags: [je.more, je.less, je.between],
                                    label: [Ne.more, Ne.less, Ne.between]
                                })[c.dtype], y = g.tags, A = g.label,
                                b = me.valueRange in c ? o.createElement(Yl, null, this.getUnitWrapper(o.createElement(Mr, {
                                    status: f,
                                    min: c.valueRange.min,
                                    max: c.valueRange.max,
                                    step: c.valueRange.step,
                                    placeholder: "".concat(c.valueRange.min, "~").concat(c.valueRange.max),
                                    defaultValue: u.v1,
                                    onChange: function (e) {
                                        a.isRightNumber(c, e) && (u.v1 = e, l(), update())
                                    }
                                }), c)) : null,
                                E = me.valueRange in c ? o.createElement(Yl, null, this.getUnitWrapper(o.createElement(Mr, {
                                    status: h,
                                    min: c.valueRange.min,
                                    max: c.valueRange.max,
                                    placeholder: "".concat(c.valueRange.min, "~").concat(c.valueRange.max),
                                    step: c.valueRange.step,
                                    defaultValue: u.v2,
                                    onChange: function (e) {
                                        a.isRightNumber(c, e) && (u.v2 = e, l(), update())
                                    }
                                }), c)) : null;
                            return o.createElement(o.Fragment, null, o.createElement(Yl, null, o.createElement(Dn, {
                                placeholder: "请选择",
                                status: m,
                                value: u.operator || void 0,
                                onChange: function (e) {
                                    u.operator = e, u.operator !== je.between && delete u.v2, u.v1 = "", l(), a.parent.sizeTool[t.type](t), update()
                                }
                            }, y.map((function (e, t) {
                                return o.createElement(Dn.Option, {key: e, value: e}, A[t])
                            })))), u.operator === je.between && o.createElement(o.Fragment, null, b, o.createElement(Yl, {className: "card-input-between-text"}, "~"), E), u.operator !== je.between && b)
                        }
                    }
                }]), n
            }(Vl);
            const Ul = zl;
            var ql = ["id", "dtype", "scope", "value"];

            function Xl(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            function Kl(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Wl(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Kl(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Kl(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Jl = Ec.Z.Item, _l = function (e) {
                J()(n, e);
                var t = Xl(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e) {
                        var t = this;
                        return K()(te()(n.prototype), "render", this).call(this, e, (function (r) {
                            var i = r.gateway.data.urnMap[e.cfg.urn], c = Al(e.props), u = r.nodeCheckTool.check(e),
                                l = t.getSetData(e), s = [].concat(a()(i.action), a()(i.propertySet));
                            return o.createElement(Ec.Z, {layout: "inline"}, K()(te()(n.prototype), "renderServiceItem", t).call(t, {
                                value: c,
                                item: e,
                                specs: s,
                                validateData: u,
                                isInVarCard: !0
                            }), (0, U.isNumber)(e.props.piid) ? t.renderSpecItem(l, e.props, (function (t) {
                                e.props = t, update(!0)
                            }), u) : (0, U.isNumber)(e.props.aiid) && t.renderActionItem(e, u))
                        }))
                    }
                }, {
                    key: "hasVarInput", value: function (e) {
                        return !("valueList" in e) && ("valueRange" in e || e.dtype === me.string)
                    }
                }, {
                    key: "renderSpecItem", value: function (e, t, n, r) {
                        var a = this.getStatusByText(r.value), i = function () {
                            var e = function (e, t) {
                                var n = e.id, r = e.scope, a = e.type, o = e.isVar, i = e.value, c = e.min, u = e.max,
                                    l = e.step, s = (t.id, t.dtype, t.scope, t.value, Ke()(t, ql));
                                return o ? Wl(Wl({}, s), {}, {id: n, scope: r, dtype: a}, a === Ea.number ? {
                                    min: c,
                                    max: u,
                                    step: l
                                } : {}) : Wl(Wl({}, s), {}, {value: i})
                            }(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t);
                            n(e)
                        };
                        return "valueList" in e ? o.createElement(Jl, null, o.createElement(Dn, {
                            value: t.value,
                            status: a,
                            options: e.valueList.map((function (e) {
                                return {label: e.description, value: e.value}
                            })),
                            onChange: function (e) {
                                return i({value: e})
                            }
                        })) : "valueRange" in e ? o.createElement(Jl, null, this.getUnitWrapper(o.createElement(oc, {
                            status: a,
                            value: t,
                            supportInput: !0,
                            style: {width: Ce},
                            varType: ka(e.dtype),
                            valueRange: e.valueRange,
                            onChange: function (t) {
                                i(Wl(Wl({}, t), e.valueRange))
                            }
                        }), e)) : e.dtype === me.string ? o.createElement(Jl, null, o.createElement(oc, {
                            status: a,
                            value: t,
                            supportInput: !0,
                            style: {width: Ce},
                            varType: ka(e.dtype),
                            onChange: i
                        })) : o.createElement(Jl, null, o.createElement(Tr, {
                            status: a,
                            value: t.value,
                            onChange: function (e) {
                                return i({value: e.target.value})
                            }
                        }))
                    }
                }, {
                    key: "renderActionItem", value: function (e, t) {
                        var n = this, r = this.getActionData(e);
                        return 0 === r.length ? null : o.createElement(Jl, null, r.map((function (r, a) {
                            var i;
                            return o.createElement("div", {
                                className: "card-device-input-wrapper",
                                key: r.piid
                            }, o.createElement(Jl, null, o.createElement(Tr, {
                                style: {width: Ee},
                                disabled: !0,
                                value: r.description
                            })), n.renderSpecItem(r, e.props.ins[a], (function (t) {
                                e.props.ins[a] = t, e.props = Wl({}, e.props), update(!0)
                            }), (null == (i = t.ins) ? void 0 : i[a]) || {}))
                        })))
                    }
                }]), n
            }(Vl);
            const $l = _l;

            function es(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var ts = function (e) {
                J()(n, e);
                var t = es(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e) {
                        var t = this;
                        return K()(te()(n.prototype), "render", this).call(this, e, (function (r) {
                            var i = r.gateway.data.urnMap[e.cfg.urn], c = Al(e.props), u = r.nodeCheckTool.check(e);
                            return o.createElement(Ec.Z, {layout: "inline"}, K()(te()(n.prototype), "renderServiceItem", t).call(t, {
                                value: c,
                                item: e,
                                specs: a()(i.propertyGet),
                                validateData: u
                            }), (0, U.isNumber)(e.props.piid) && t.renderProperty(e, u))
                        }))
                    }
                }, {
                    key: "renderProperty", value: function (e, t) {
                        return Jd.elements.deviceInput.renderSpecItem(de.propertyGet, e, 0, t)
                    }
                }]), n
            }(Vl);
            const ns = ts;

            function rs(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function as(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? rs(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : rs(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function os(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const is = function (e) {
                J()(n, e);
                var t = os(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "isCustom", value: function (e) {
                        return Vc(e) === Mc.custom
                    }
                }, {
                    key: "renderFilter", value: function (e) {
                        var t = this, n = Object.keys(Mc);
                        return o.createElement(Ec.Z.Item, null, o.createElement(Dn, {
                            style: {width: Ee},
                            value: Vc(e),
                            options: n.map((function (e) {
                                return {label: Zc[e], value: e}
                            })),
                            onChange: function (n) {
                                var r = Mc[n];
                                r === Mc.everyday && (e.props.filter = {}), r === Mc.workday && (e.props.filter = {inHoliday: !1}), r === Mc.holiday && (e.props.filter = {inHoliday: !0}), r === Mc.custom && (e.props.filter = {day: []}), e.props = as({}, e.props), t.parent.sizeTool.run(e), update()
                            }
                        }))
                    }
                }, {
                    key: "renderWeekDay", value: function (e) {
                        if (Vc(e) === Mc.custom) {
                            var t = Qc(e.props.filter.day), n = "" === t;
                            return o.createElement(Bn, {
                                trigger: ["click"],
                                value: e.props.filter.day,
                                options: [{key: 1, label: "周一"}, {key: 2, label: "周二"}, {
                                    key: 3,
                                    label: "周三"
                                }, {key: 4, label: "周四"}, {key: 5, label: "周五"}, {key: 6, label: "周六"}, {
                                    key: 0,
                                    label: "周日"
                                }],
                                onChange: function (t) {
                                    e.props.filter = {day: t}, e.props = as({}, e.props), update()
                                }
                            }, o.createElement(Tr, {
                                className: n ? "card-time-noselect" : void 0,
                                status: n ? le : se,
                                style: {width: Ee, marginLeft: ye, caretColor: "transparent"},
                                value: t || "未选择",
                                suffix: o.createElement(Nc, null),
                                readOnly: !0
                            }))
                        }
                        return null
                    }
                }]), n
            }(hu);

            function cs(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function us(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? cs(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cs(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function ls(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const ss = function (e) {
                J()(n, e);
                var t = ls(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "isSunset", value: function (e) {
                        return e.props.type === Fc.sunset
                    }
                }, {
                    key: "renderType", value: function (e) {
                        var t = this, n = Object.keys(Fc);
                        return o.createElement(Ec.Z.Item, null, o.createElement(Dn, {
                            value: Uc(e),
                            status: "success",
                            onChange: function (n) {
                                var r = e.props.filter;
                                n === Fc.sunrise && (e.props = {
                                    type: Fc.sunset,
                                    isSunset: !1,
                                    offset: 0,
                                    latitude: 0,
                                    longitude: 0,
                                    filter: r
                                }), n === Fc.sunset && (e.props = {
                                    type: Fc.sunset,
                                    isSunset: !0,
                                    offset: 0,
                                    latitude: 0,
                                    longitude: 0,
                                    filter: r
                                }), n === Fc.periodicAlarm && (e.props = {
                                    type: Fc.periodicAlarm,
                                    isSunset: !1,
                                    hour: 0,
                                    minute: 0,
                                    second: 0,
                                    filter: r
                                }, e.cfg.happenType = Yc.now, e.cfg.tempOffset = 0, e.cfg = us({}, e.cfg)), e.props = us({}, e.props), t.parent.sizeTool.run(e), update()
                            }
                        }, n.map((function (e) {
                            return o.createElement(Dn.Option, {key: e, value: e}, qc(e))
                        }))))
                    }
                }, {
                    key: "renderTime", value: function (e) {
                        var t = this, n = e.props.type, r = new Date,
                            a = new Date(r.getFullYear(), r.getMonth(), r.getDay(), e.props.hour, e.props.minute, e.props.second);
                        if (n === Fc.periodicAlarm) return o.createElement(Ec.Z.Item, null, o.createElement(xr, {
                            onOpenChange: Jd.lockScroll,
                            value: R()(a),
                            onChange: function (t) {
                                e.props.hour = t.hour(), e.props.minute = t.minute(), e.props.second = t.second(), e.props = us({}, e.props), update()
                            }
                        }));
                        if (n === Fc.sunset) {
                            var i = Object.keys(Yc);
                            return o.createElement(Ec.Z.Item, null, o.createElement(Dn, {
                                value: e.cfg.happenType,
                                id: "".concat(e.id, ".time"),
                                onChange: function (n) {
                                    e.cfg.happenType = n, e.cfg.tempOffset = 0, e.props.offset = 0, e.cfg = us({}, e.cfg), e.props = us({}, e.props), t.parent.sizeTool.run(e), update()
                                }
                            }, i.map((function (e) {
                                return o.createElement(Dn.Option, {key: e, value: e}, zc[e] || "")
                            }))))
                        }
                        return null
                    }
                }, {
                    key: "renderPos", value: function (e) {
                        var t = this, n = this.isSunset(e), r = this.parent.nodeCheckTool[e.type](e);
                        return n ? o.createElement(Ec.Z, {
                            layout: "inline",
                            colon: !1
                        }, o.createElement(Ec.Z.Item, null, o.createElement(Q.ZP, {
                            type: "primary",
                            onClick: function () {
                                window.open("https://cnbj1.fds.api.xiaomi.com/mijia-tob/".concat("prod", "/ai-config/pos-v5/index.html"))
                            }
                        }, "获取经纬度")), o.createElement(Ec.Z.Item, {
                            label: "经度",
                            help: r.longitude
                        }, o.createElement(Mr, {
                            status: this.parent.nodeCheckTool.getStatusByText(r.longitude),
                            value: Number(e.props.longitude),
                            onChange: function (t) {
                                (0, U.isNumber)(t) && (e.props.longitude = t, e.props = us({}, e.props), update())
                            }
                        })), o.createElement(Ec.Z.Item, {
                            label: "纬度",
                            help: r.latitude
                        }, o.createElement(Mr, {
                            status: this.parent.nodeCheckTool.getStatusByText(r.latitude),
                            value: Number(e.props.latitude),
                            onChange: function (n) {
                                (0, U.isNumber)(n) && (e.props.latitude = n, e.props = us({}, e.props), t.parent.sizeTool.run(e), update())
                            }
                        }))) : null
                    }
                }, {
                    key: "renderOffset", value: function (e) {
                        var t = this, n = Uc(e);
                        if (n === Fc.sunset || n === Fc.sunrise) return o.createElement(Ec.Z.Item, null, o.createElement(Mr, {
                            value: e.cfg.tempOffset,
                            min: 1,
                            onChange: function (t) {
                                (0, U.isInteger)(t) && (e.cfg.tempOffset = t, e.cfg.happenType === Yc.before && (e.props.offset = -1 * Math.abs(e.cfg.tempOffset)), e.cfg.happenType === Yc.after && (e.props.offset = Math.abs(e.cfg.tempOffset)), e.props = us({}, e.props), e.cfg = us({}, e.cfg), update())
                            },
                            onBlur: function () {
                                e.props.offset || (e.cfg.happenType = Yc.now, t.parent.sizeTool.run(e), update())
                            },
                            addonAfter: "分钟"
                        }))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = o.createElement(o.Fragment, null, o.createElement(Ec.Z, {
                            layout: "inline",
                            colon: !1
                        }, this.renderFilter(e), this.renderWeekDay(e), this.renderType(e), this.renderTime(e), e.cfg.happenType !== Yc.now && this.renderOffset(e)), this.renderPos(e));
                        return K()(te()(n.prototype), "render", this).call(this, e, t)
                    }
                }]), n
            }(is);

            function ps(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function fs(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ps(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ps(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function ds(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            function ms(e, t) {
                function n(e) {
                    return 60 * e.hour * 60 + 60 * e.minute + e.second
                }

                return n(e) - n(t) > 0
            }

            const vs = function (e) {
                J()(n, e);
                var t = ds(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "renderRange", value: function (e) {
                        var t = new Date, n = t.getFullYear(), r = t.getMonth(), a = t.getDay(), i = e.props.start,
                            c = e.props.end, u = new Date(n, r, a, i.hour, i.minute, i.second),
                            l = new Date(n, r, a, c.hour, c.minute, c.second);
                        return o.createElement(o.Fragment, null, o.createElement(Ec.Z.Item, null, o.createElement(xr, {
                            onOpenChange: Jd.lockScroll,
                            placeholder: "请选择开始时间",
                            style: {width: Ee},
                            value: R()(u),
                            onChange: function (t) {
                                e.props.start = {
                                    hour: t.hour(),
                                    minute: t.minute(),
                                    second: t.second()
                                }, ms(e.props.start, e.props.end) ? e.props.mingTextShow = !0 : e.props.mingTextShow = !1, e.props = fs({}, e.props), update()
                            }
                        })), o.createElement(Ec.Z.Item, {className: "card-input-between-text"}, "~", o.createElement("div", {className: "text-ming"}, e.props.mingTextShow && "次日")), o.createElement(Ec.Z.Item, null, o.createElement(xr, {
                            onOpenChange: Jd.lockScroll,
                            placeholder: "请选择结束时间",
                            value: R()(l),
                            onChange: function (t) {
                                e.props.end = {
                                    hour: t.hour(),
                                    minute: t.minute(),
                                    second: t.second()
                                }, ms(e.props.start, e.props.end) ? e.props.mingTextShow = !0 : e.props.mingTextShow = !1, e.props = fs({}, e.props), update()
                            }
                        })))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = o.createElement(Ec.Z, {layout: "inline"}, this.renderFilter(e), this.renderWeekDay(e), this.renderRange(e));
                        return K()(te()(n.prototype), "render", this).call(this, e, t)
                    }
                }]), n
            }(is);

            function hs(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function gs(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? hs(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : hs(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function ys(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var As = Ec.Z.Item, bs = function (e) {
                J()(n, e);
                var t = ys(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "updateValue", value: function (e, t) {
                        var n = e.cfg, r = n.value, a = n.unit, o = t.key;
                        a === Xn.ms && (e.props[o] = r), a === Xn.s && (e.props[o] = 1e3 * r), a === Xn.min && (e.props[o] = 60 * r * 1e3), a === Xn.hour && (e.props[o] = 60 * r * 60 * 1e3), e.props = gs({}, e.props)
                    }
                }, {
                    key: "render", value: function (e, t) {
                        var r, a = this, i = t.left, c = t.right,
                            u = (i ? i.length * be + ye + Se : 0) + 2 * Ee + ye + (c ? c.length * be + ye + Se : 0) + 1,
                            l = {
                                borderLeft: i ? "1px solid var(--border-color)" : null,
                                borderRight: c ? "1px solid var(--border-color)" : null,
                                paddingLeft: i ? Se : 0,
                                width: u,
                                alignItems: "center",
                                marginLeft: t.marginLeft || 0,
                                height: t.height || ke
                            }, s = o.createElement(Ec.Z, {
                                layout: "inline",
                                style: l
                            }, i ? o.createElement(As, null, i) : null, o.createElement(As, null, o.createElement(Mr, {
                                placeholder: t.placeholder,
                                value: e.cfg.value,
                                step: 1,
                                min: 1,
                                onChange: function (n) {
                                    (0, U.isInteger)(n) && (e.cfg.value = n, e.cfg = gs({}, e.cfg), a.updateValue(e, t), update())
                                }
                            })), o.createElement(As, null, o.createElement(Dn, {
                                value: (null == (r = e.cfg) ? void 0 : r.unit) || "",
                                options: Object.values(Xn).map((function (e) {
                                    return {label: Kn[e], value: e}
                                })),
                                onChange: function (n) {
                                    e.cfg.unit = n, a.updateValue(e, t), update()
                                }
                            })), c ? o.createElement(As, null, c) : null);
                        return K()(te()(n.prototype), "render", this).call(this, e, s)
                    }
                }]), n
            }(hu);
            const Es = bs;

            function Cs(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Os(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var ws = Ec.Z.Item;
            const ks = function (e) {
                J()(n, e);
                var t = Os(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e, t) {
                        var r = t.left, a = t.key, i = t.right,
                            c = (r ? r.length * be + ye + Se : 0) + Ee + (i ? i.length * be + ye + Se : 0) + 1, u = {
                                borderLeft: r ? "1px solid var(--border-color)" : null,
                                borderRight: i ? "1px solid var(--border-color)" : null,
                                paddingLeft: r ? Se : 0,
                                width: c,
                                marginLeft: 76,
                                alignItems: "center",
                                height: 58
                            }, l = o.createElement(Ec.Z, {
                                layout: "inline",
                                style: u
                            }, r ? o.createElement(ws, null, r) : null, o.createElement(ws, null, o.createElement(Mr, {
                                value: e.props[a],
                                min: 1,
                                step: 1,
                                style: {width: Ee},
                                onChange: function (t) {
                                    (0, U.isInteger)(t) && (e.props[a] = t, e.props = function (e) {
                                        for (var t = 1; t < arguments.length; t++) {
                                            var n = null != arguments[t] ? arguments[t] : {};
                                            t % 2 ? Cs(Object(n), !0).forEach((function (t) {
                                                H()(e, t, n[t])
                                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Cs(Object(n)).forEach((function (t) {
                                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                            }))
                                        }
                                        return e
                                    }({}, e.props), update())
                                }
                            })), i ? o.createElement(ws, null, i) : null);
                        return K()(te()(n.prototype), "render", this).call(this, e, l)
                    }
                }]), n
            }(hu);

            function xs(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const Ss = function (e) {
                J()(n, e);
                var t = xs(n);

                function n(e) {
                    var r;
                    return G()(this, n), (r = t.call(this, e)).instance = {}, r.delayActiveId = 0, r.toolBar2 = Mn.NONE, r
                }

                return z()(n, [{
                    key: "setDelayActiveId", value: function (e) {
                        this.delayActiveId = e
                    }
                }, {
                    key: "active", value: function (e) {
                        Jd.settings.contentEditable = e, Jd.selectTool.set({selectedCards: []}), this.instance[e].enable(), update()
                    }
                }, {
                    key: "unActive", value: function () {
                        var e = this.instance[Jd.settings.contentEditable], t = Jd.target.id;
                        t !== Jd.settings.contentEditable && (t.startsWith(zn.toolbox) || (this.toolBar2 = Mn.NONE, e && (e.setSelection(0, 0), e.disable()), Jd.settings.contentEditable = ""))
                    }
                }, {
                    key: "format", value: function (e, t, n) {
                        var r = this.instance[n];
                        if (r) {
                            var a = g((function () {
                                return r.getFormat()
                            }), {});
                            g((function () {
                                return r.getSelection()
                            })) && (e === Mn.ALIGN && t === Zn.LEFT || e === Mn.LIST && a[e] === t || e === Mn.HEADER && parseInt(t) === Gn ? r.format(e, "") : r.format(e, t))
                        }
                    }
                }, {
                    key: "heightChange", value: function (e) {
                        var t, n, r = document.querySelector("#".concat(e.id, " .ql-editor"));
                        r && (r.style.height = "auto", t = function () {
                            e.cfg.pos.height = r.scrollHeight, update(!0)
                        }, n = function () {
                            r.style.height = ""
                        }, setTimeout((function () {
                            t(), setTimeout((function () {
                                t(), n && n()
                            }), 0)
                        }), 0))
                    }
                }]), n
            }(hu);

            function Ts(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ds(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ts(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ts(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Ps(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Rs = Ec.Z.Item, Bs = function (e) {
                J()(n, e);
                var t = Ps(n);

                function n() {
                    var e;
                    G()(this, n);
                    for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
                    return (e = t.call.apply(t, [this].concat(a))).propertyAssignLabel = "更新时，赋值给", e.eventEmitLabel = "发生时", e.eventAssignLabel = "赋值给", e
                }

                return z()(n, [{
                    key: "getAvailableSpecs", value: function (e) {
                        return e.filter((function (e) {
                            var t;
                            return !(0, U.isNumber)(e.eiid) || (null == (t = e.arguments) ? void 0 : t.length) > 0
                        }))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = this;
                        return K()(te()(n.prototype), "render", this).call(this, e, (function (r) {
                            var i = r.gateway.data.urnMap[e.cfg.urn], c = Al(e.props), u = r.nodeCheckTool.check(e),
                                l = t.getAvailableSpecs([].concat(a()(i.event), a()(i.propertyNotify)));
                            return o.createElement(o.Fragment, null, o.createElement(Ec.Z, {layout: "inline"}, K()(te()(n.prototype), "renderServiceItem", t).call(t, {
                                value: c,
                                item: e,
                                specs: l,
                                validateData: u,
                                isInVarCard: !0
                            }), (0, U.isNumber)(e.props.piid) ? t.renderProperty(e, u) : (0, U.isNumber)(e.props.eiid) ? o.createElement(Rs, null, t.eventEmitLabel) : null), (0, U.isNumber)(e.props.eiid) ? t.renderEvent(e, u) : null, (0, U.isNumber)(e.props.piid) ? o.createElement(Ec.Z, {
                                className: "card-device-switch-form",
                                layout: "inline"
                            }, o.createElement(Rs, {
                                label: "规则启用时查询一次",
                                colon: !1
                            }, o.createElement(jo, {
                                checked: e.props.preload, onChange: function (t) {
                                    e.props = Ds(Ds({}, e.props), {}, {preload: t}), update()
                                }
                            }))) : null)
                        }))
                    }
                }, {
                    key: "renderEventItem", value: function (e, t, n, r, i, c) {
                        var u = this;
                        return o.createElement(Ec.Z, {
                            layout: "inline",
                            key: r.key || r.piid,
                            style: {position: "relative"}
                        }, o.createElement(Rs, null, o.createElement(Dn, {
                            placeholder: "请选择",
                            status: this.getStatusByText(i.piid),
                            value: r.piid,
                            options: n.map((function (e) {
                                return {label: e.description, value: e.piid, disabled: c.includes(e.piid)}
                            })),
                            onChange: function (o) {
                                var i = n.find((function (e) {
                                    return e.piid === o
                                }));
                                r.key && delete r.key, e.props.arguments[t] = {
                                    piid: i.piid,
                                    dtype: ka(i.dtype)
                                }, e.props.arguments = a()(e.props.arguments), e.props = Ds({}, e.props), u.parent.sizeTool.run(e), update()
                            }
                        })), o.createElement(Rs, {
                            label: this.eventAssignLabel,
                            colon: !1
                        }, (0, U.isNumber)(r.piid) && this.renderVarSpecInput(de.event, e, t, i)), o.createElement(bl, {
                            className: "card-device-event-delete-icon icon-grey",
                            onClick: function () {
                                e.props.arguments.splice(t, 1), e.props.arguments = a()(e.props.arguments), e.props = Ds({}, e.props), u.parent.sizeTool.run(e), update()
                            }
                        }))
                    }
                }, {
                    key: "renderEvent", value: function (e, t) {
                        var n = this, r = this.getEventData(e);
                        if (0 === r.length) return null;
                        var a = e.props.arguments, i = a.map((function (e) {
                            return e.piid
                        })).filter(Boolean);
                        return o.createElement("div", {className: "card-device-event"}, a.map((function (a, o) {
                            var c;
                            return n.renderEventItem(e, o, r, a, (null == (c = t.arguments) ? void 0 : c[o]) || {}, i)
                        })), a.length !== r.length ? o.createElement("div", {
                            className: "card-device-event-add-button",
                            onClick: function () {
                                e.props.arguments.push({
                                    dtype: ka(me.int),
                                    key: (new Date).getTime()
                                }), e.props = Ds({}, e.props), n.parent.sizeTool.run(e), update()
                            }
                        }, o.createElement(_o, null), 0 === a.length ? o.createElement("span", {className: "card-device-event-add-button-text"}, "添加参数") : null) : null)
                    }
                }, {
                    key: "renderProperty", value: function (e, t) {
                        return o.createElement(Rs, {
                            label: this.propertyAssignLabel,
                            colon: !1
                        }, this.renderVarSpecInput(de.propertyNotify, e, 0, t))
                    }
                }, {
                    key: "renderVarSpecInput", value: function (e, t, n, r) {
                        var a = this, i = null, c = null, u = null;
                        if (this.isProperty(e)) i = e === de.propertyNotify ? this.getNotifyData(t) : this.getGetData(t), c = t.props, u = function () {
                            t.props = Ds({}, t.props)
                        }; else {
                            var l = this.getEventData(t);
                            c = t.props.arguments[n], i = l.find((function (e) {
                                return e.piid === c.piid
                            })), u = function () {
                                t.props.arguments[n] = Ds({}, c), t.props = Ds({}, t.props)
                            }
                        }
                        if (!i) return null;
                        var s = this.getStatusByText(r.var), p = c.id ? {id: c.id, scope: c.scope} : null;
                        return o.createElement(oc, {
                            status: s,
                            value: p,
                            showAddVars: !0,
                            varType: c.dtype,
                            onChange: function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = e.id,
                                    r = e.scope;
                                c.id = n, c.scope = r, a.parent.sizeTool.run(t), u(), update(!0)
                            }
                        })
                    }
                }]), n
            }(Vl);
            const Is = Bs;

            function js(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ns(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Ls = Ec.Z.Item, Qs = function (e) {
                J()(n, e);
                var t = Ns(n);

                function n() {
                    var e;
                    G()(this, n);
                    for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
                    return (e = t.call.apply(t, [this].concat(a))).assignLabel = "赋值给", e
                }

                return z()(n, [{
                    key: "render", value: function (e) {
                        var t = this;
                        return K()(te()(n.prototype), "render", this).call(this, e, (function (r) {
                            var i = r.gateway.data.urnMap[e.cfg.urn], c = Al(e.props), u = r.nodeCheckTool.check(e),
                                l = a()(i.propertyGet);
                            return o.createElement(Ec.Z, {layout: "inline"}, K()(te()(n.prototype), "renderServiceItem", t).call(t, {
                                value: c,
                                item: e,
                                specs: l,
                                validateData: u,
                                isInVarCard: !0
                            }), (0, U.isNumber)(e.props.piid) && t.renderVarSpecItem(e, u))
                        }))
                    }
                }, {
                    key: "renderVarSpecItem", value: function (e, t) {
                        var n = this, r = this.getGetData(e), a = e.props, i = function () {
                            e.props = function (e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? js(Object(n), !0).forEach((function (t) {
                                        H()(e, t, n[t])
                                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : js(Object(n)).forEach((function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    }))
                                }
                                return e
                            }({}, e.props)
                        };
                        if (!r) return null;
                        var c = this.getStatusByText(t.var), u = a.id ? {id: a.id, scope: a.scope} : null;
                        return o.createElement(Ls, {
                            label: this.assignLabel,
                            colon: !1
                        }, o.createElement(oc, {
                            showAddVars: !0,
                            status: c,
                            value: u,
                            varType: a.dtype,
                            onChange: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = t.id,
                                    o = t.scope;
                                t.isVar && (a.id = r, a.scope = o, n.parent.sizeTool.run(e), i(), update(!0))
                            }
                        }))
                    }
                }]), n
            }(Vl);
            const Ms = Qs;
            var Zs = ["v2"];

            function Vs(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Hs(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Vs(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vs(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Fs(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Gs = Ec.Z.Item,
                Ys = ["moreEqual", "lessEqual", "equal", "unEqual", "more", "less", "between"].map((function (e) {
                    return {label: Ne[e], value: je[e]}
                }));
            const zs = function (e) {
                J()(n, e);
                var t = Fs(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "getStatusByValidate", value: function (e) {
                        return e ? le : se
                    }
                }, {
                    key: "updateCard", value: function (e, t) {
                        this.parent.sizeTool.run(e), update(t)
                    }
                }, {
                    key: "renderVarService", value: function (e, t) {
                        var n = this, r = e.props, a = {id: r.id, scope: r.scope};
                        return o.createElement(Gs, null, o.createElement(oc, {
                            status: this.getStatusByValidate(t.var),
                            value: a,
                            onChange: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = t.id,
                                    a = t.scope, o = t.type;
                                e.props = {
                                    preload: e.props.preload,
                                    id: r,
                                    scope: a,
                                    varType: o,
                                    operator: o === Ea.string ? je.equal : ""
                                }, n.updateCard(e)
                            }
                        }))
                    }
                }, {
                    key: "renderOperatorItem", value: function (e, t) {
                        var n = this, r = e.props, a = r.operator === je.between;
                        return o.createElement(o.Fragment, null, o.createElement(Gs, null, o.createElement(Dn, {
                            placeholder: "请选择",
                            status: this.getStatusByValidate(t.operator),
                            value: r.operator || void 0,
                            options: Ys,
                            onChange: function (t) {
                                r.v2;
                                var o = Ke()(r, Zs);
                                e.props = Hs(Hs({}, o), {}, {operator: t, v1: ""}, a ? {v2: ""} : {}), n.updateCard(e)
                            }
                        })), o.createElement(Gs, null, o.createElement(Mr, {
                            placeholder: "请输入数字",
                            status: this.getStatusByValidate(t.v1),
                            value: r.v1,
                            onChange: function (t) {
                                e.props = Hs(Hs({}, r), {}, {v1: t}), n.updateCard(e)
                            }
                        })), a ? o.createElement(o.Fragment, null, o.createElement(Gs, {className: "card-input-between-text"}, "~"), o.createElement(Gs, null, o.createElement(Mr, {
                            placeholder: "请输入数字",
                            status: this.getStatusByValidate(t.v2),
                            defaultValue: r.v2,
                            onChange: function (t) {
                                e.props = Hs(Hs({}, r), {}, {v2: t}), n.updateCard(e)
                            }
                        }))) : o.createElement(o.Fragment, null))
                    }
                }, {
                    key: "renderStringInput", value: function (e, t) {
                        var n = this, r = e.props;
                        return o.createElement(Gs, null, o.createElement(Tr, {
                            placeholder: "请输入内容",
                            status: this.getStatusByValidate(t.v1),
                            value: r.v1,
                            onChange: function (t) {
                                e.props = Hs(Hs({}, r), {}, {v1: t.target.value.trim()}), n.updateCard(e, !0)
                            }
                        }))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = Jd.nodeCheckTool.check(e),
                            r = o.createElement(o.Fragment, null, o.createElement(Ec.Z, {layout: "inline"}, this.renderVarService(e, t), e.props.id && (e.props.varType === Ea.string ? this.renderStringInput(e, t) : this.renderOperatorItem(e, t))), o.createElement(Ec.Z, {
                                className: "card-device-switch-form",
                                layout: "inline"
                            }, o.createElement(Gs, {
                                label: "规则启用时查询一次",
                                colon: !1
                            }, o.createElement(jo, {
                                checked: e.props.preload, onChange: function (t) {
                                    e.props = Hs(Hs({}, e.props), {}, {preload: t}), update()
                                }
                            }))));
                        return K()(te()(n.prototype), "render", this).call(this, e, r)
                    }
                }]), n
            }(hu);

            function Us(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var qs = function (e) {
                J()(n, e);
                var t = Us(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "render", value: function (e) {
                        var t = Jd.nodeCheckTool.check(e), r = Jd.elements.varChange,
                            a = o.createElement(Ec.Z, {layout: "inline"}, r.renderVarService(e, t), e.props.id && (e.props.varType === Ea.string ? r.renderStringInput(e, t) : r.renderOperatorItem(e, t)));
                        return K()(te()(n.prototype), "render", this).call(this, e, a)
                    }
                }]), n
            }(hu);
            const Xs = qs;

            function Ks(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ws(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ks(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ks(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Js(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const _s = function (e) {
                J()(n, e);
                var t = Js(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "getStatusByValidate", value: function (e) {
                        return e ? le : se
                    }
                }, {
                    key: "renderVarService", value: function (e, t) {
                        var n = e.props, r = {id: n.id, scope: n.scope};
                        return o.createElement(Ec.Z.Item, null, o.createElement(oc, {
                            status: this.getStatusByValidate(t.var),
                            value: r,
                            showAddVars: !0,
                            style: {width: Ee},
                            varType: Ea.number,
                            onChange: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = t.id,
                                    a = t.scope;
                                e.props = {id: r, scope: a, elements: (n.elements || []).slice(0)}, update()
                            }
                        }))
                    }
                }, {
                    key: "renderExprService", value: function (e, t) {
                        var n = this.getStatusByValidate(t.elements), r = e.props.elements || [];
                        return o.createElement(Ec.Z.Item, null, o.createElement(Ji, {
                            style: {width: Oe},
                            showExpr: !0,
                            varType: "number",
                            status: n,
                            value: r,
                            onChange: function (t) {
                                e.props = Ws(Ws({}, e.props), {}, {elements: t}), update(!0)
                            },
                            onHeightChange: function (t) {
                                Jd.updateDataPos(e, (function (e) {
                                    return Ws(Ws({}, e), {}, {exprHeight: t})
                                })), update()
                            }
                        }))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = Jd.nodeCheckTool.check(e),
                            r = o.createElement("div", null, o.createElement(Ec.Z, {layout: "inline"}, this.renderVarService(e, t), o.createElement(Ec.Z.Item, {
                                style: {
                                    fontSize: 14,
                                    textAlign: "center",
                                    width: De
                                }
                            }, "="), this.renderExprService(e, t)));
                        return K()(te()(n.prototype), "render", this).call(this, e, r)
                    }
                }]), n
            }(hu);

            function $s(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ep(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? $s(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $s(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function tp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const np = function (e) {
                J()(n, e);
                var t = tp(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "getStatusByValidate", value: function (e) {
                        return e ? le : se
                    }
                }, {
                    key: "renderVarService", value: function (e, t) {
                        var n = e.props, r = {id: n.id, scope: n.scope};
                        return o.createElement(Ec.Z.Item, null, o.createElement(oc, {
                            status: this.getStatusByValidate(t.var),
                            value: r,
                            showAddVars: !0,
                            style: {width: Ee},
                            varType: Ea.string,
                            onChange: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = t.id,
                                    a = t.scope;
                                e.props = {id: r, scope: a, elements: (n.elements || []).slice(0)}, update()
                            }
                        }))
                    }
                }, {
                    key: "renderExprService", value: function (e, t) {
                        var n = this.getStatusByValidate(t.elements), r = e.props.elements || [];
                        return o.createElement(Ec.Z.Item, null, o.createElement(Ji, {
                            style: {width: Oe},
                            status: n,
                            value: r,
                            onChange: function (t) {
                                e.props = ep(ep({}, e.props), {}, {elements: t}), update(!0)
                            },
                            onHeightChange: function (t) {
                                Jd.updateDataPos(e, (function (e) {
                                    return ep(ep({}, e), {}, {exprHeight: t})
                                })), update()
                            }
                        }))
                    }
                }, {
                    key: "render", value: function (e) {
                        var t = Jd.nodeCheckTool.check(e),
                            r = o.createElement("div", null, o.createElement(Ec.Z, {layout: "inline"}, this.renderVarService(e, t), o.createElement(Ec.Z.Item, {
                                style: {
                                    fontSize: 14,
                                    textAlign: "center",
                                    width: De
                                }
                            }, "="), this.renderExprService(e, t)));
                        return K()(te()(n.prototype), "render", this).call(this, e, r)
                    }
                }]), n
            }(hu);
            var rp;

            function ap(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var op = {
                    alarmClock: gu,
                    condition: yu,
                    counter: Au,
                    delay: bu,
                    deviceGet: Cu,
                    deviceInput: Ou,
                    deviceOutput: xu,
                    eventSequence: Su,
                    logicAnd: Tu,
                    logicOr: Du,
                    loop: Pu,
                    modeSwitch: Ru,
                    onLoad: Bu,
                    onlyNTimes: Iu,
                    register: ju,
                    signalOr: Nu,
                    statusLast: Lu,
                    timeRange: Qu,
                    nop: Mu,
                    logicNot: Fu,
                    deviceInputSetVar: zu,
                    deviceGetSetVar: Ku,
                    varChange: $u,
                    varGet: rl,
                    varSetNumber: cl,
                    varSetString: pl
                }, ip = Object.values(op).reduce((function (e, t) {
                    return e[t.type] = t.type, e
                }), {}),
                cp = (rp = {}, H()(H()(H()(H()(H()(H()(H()(H()(H()(H()(rp, Ou.type, Ul), xu.type, $l), Cu.type, ns), zu.type, Is), Ku.type, Ms), $u.type, zs), rl.type, Xs), cl.type, _s), pl.type, np), gu.type, ss), H()(H()(rp, Qu.type, vs), Mu.type, Ss));

            function up(e) {
                var t = {inputs: {}, outputs: {}}, n = e.inputs, r = void 0 === n ? [] : n, a = e.outputs,
                    o = void 0 === a ? [] : a;
                return r.forEach((function (e) {
                    t.inputs[e.key] = null
                })), o.forEach((function (e) {
                    t.outputs[e.key] = []
                })), t
            }

            function lp() {
                return o.createElement("a", {
                    draggable: !1,
                    className: "card-head-extra-link",
                    href: "https://web.vip.miui.com/page/info/mio/mio/detail?postId=44320897",
                    target: "_blank",
                    rel: "noreferrer"
                }, "如何输入运算式")
            }

            const sp = op;

            function pp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const fp = function (e) {
                J()(n, e);
                var t = pp(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n)
            }(Wr);

            function dp(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return mp(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return mp(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function mp(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function vp(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function hp(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? vp(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : vp(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function gp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var yp = function (e) {
                J()(n, e);
                var t = gp(n);

                function n(e) {
                    var r;
                    return G()(this, n), (r = t.call(this, e)).data = {active: ""}, r
                }

                return z()(n, [{
                    key: "getConnector", value: function (e) {
                        var t = sp[e.type].connector;
                        return (0, U.isFunction)(t) ? t.call(this.parent, e) : t
                    }
                }, {
                    key: "getSimpleListByLoopConfig", value: function (e, t, n) {
                        return Object.keys(e[n]).map((function (e) {
                            return {key: e, type: t.type}
                        }))
                    }
                }, {
                    key: "getListByLoopConfig", value: function (e, t, n) {
                        if (e.cfg.simplified) return this.getSimpleListByLoopConfig(e, t, n);
                        var r = e.id, i = t.action || "Action", c = dl(r, t.key)["add".concat(i)](),
                            u = e.type === sp.modeSwitch.type;
                        return [].concat(a()(Object.keys(e[n]).map((function (e, n) {
                            var a = dl(r, e)["remove".concat(i)]();
                            return {
                                key: e,
                                type: t.type,
                                extra: o.createElement("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: u ? "row-reverse" : "row"
                                    }
                                }, o.createElement("span", null, t.name, n + 1), o.createElement("span", null, " "), n > 1 ? o.createElement(bl, {
                                    "data-target": 1,
                                    id: a,
                                    "data-id": a,
                                    "data-type": zn.removeAction
                                }) : null),
                                extraWidth: (t.name.length + 3) * ge
                            }
                        }))), [{
                            key: zn.addAction,
                            type: t.type,
                            disabled: !0,
                            extraWidth: 56,
                            extra: o.createElement("div", {
                                className: "card-io-action",
                                "data-target": 1,
                                id: c,
                                "data-id": c,
                                "data-type": zn.addAction
                            }, "添加")
                        }])
                    }
                }, {
                    key: "getIOTypeList", value: function (e) {
                        var t = this.getConnector(e), n = [], r = [], a = Object.values(e.inputs),
                            o = Object.values(e.outputs);
                        return t.inputs && t.inputs.length > 0 && (n = t.inputs.map((function (e) {
                            return e.type
                        }))), t.outputs && t.outputs.length > 0 && (r = t.outputs.map((function (e) {
                            return e.type
                        }))), t.inputsLoopConfig && (n = new Array(a.length).fill(t.inputsLoopConfig.type)), t.outputsLoopConfig && (r = new Array(o.length).fill(t.outputsLoopConfig.type)), {
                            inputs: n,
                            outputs: r
                        }
                    }
                }, {
                    key: "run", value: function (e) {
                        var t = this.getConnector(e), n = null, r = null;
                        return (0, U.isObject)(t) && (t.inputs && (n = t.inputs), t.inputsLoopConfig && (n = this.getListByLoopConfig(e, t.inputsLoopConfig, "inputs")), t.outputs && (r = t.outputs), t.outputsLoopConfig && (r = this.getListByLoopConfig(e, t.outputsLoopConfig, "outputs"))), {
                            inputs: n,
                            outputs: r
                        }
                    }
                }, {
                    key: "setNearConnector", value: function (e) {
                        var t = this, n = ml(e).connect, r = [];
                        this.parent.data.forEach((function (e) {
                            e.type !== t.parent.model.nop.type && [].concat(a()(Object.keys(e.inputs)), a()(Object.keys(e.outputs))).forEach((function (t) {
                                r.push("".concat(e.id, ".").concat(t))
                            }))
                        })), this.active = "", this.connectType = "default";
                        var o = [];
                        r.forEach((function (e) {
                            var t = "connect.".concat(e), r = document.getElementById(t);
                            r && o.push({
                                key: t,
                                x: parseFloat(r.dataset.x),
                                y: parseFloat(r.dataset.y),
                                connect: n,
                                type: r.dataset.type,
                                io: r.dataset.io
                            })
                        })), this.nearInputPoints = o
                    }
                }, {
                    key: "setActivePoint", value: function (e) {
                        var t = this.getActivePoint(e);
                        if (!t) return this.connectType = "default", void (this.active = "");
                        var n = this.nearInputPoints.find((function (e) {
                            return e.key === t
                        }));
                        this.connectType = n.type, this.active = n.key
                    }
                }, {
                    key: "getActivePoint", value: function (e) {
                        if (!this.nearInputPoints) return "";
                        var t = this.parent.isInPc ? 20 : 40, n = this.nearInputPoints.filter((function (n) {
                            return e.x > n.x - t && e.x < n.x + t && e.y > n.y - t && e.y < n.y + t
                        }));
                        return 0 === n.length ? "" : (n.sort((function (t, n) {
                            return Math.pow(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2), .5) > Math.pow(Math.pow(e.x - n.x, 2) + Math.pow(e.y - n.y, 2), .5) ? 1 : -1
                        })), n[0].key)
                    }
                }, {
                    key: "disconnect", value: function (e) {
                        var t = e.item, n = e.outputKey, r = e.id, a = e.outputId, o = (0, U.cloneDeep)(t);
                        t.outputs[n].splice(t.outputs[n].indexOf(a), 1), t.outputs = hp({}, t.outputs);
                        var i = dl(r, n).connect();
                        this.parent.target.setTargetById(i), this.setNearConnector(i), this.parent.actionManager.pushCardPropsUpdateAction(o, (0, U.cloneDeep)(t))
                    }
                }, {
                    key: "connect", value: function () {
                        var e = this.parent.target.id, t = this.active;
                        if (e && t) if (this.nearInputPoints.find((function (e) {
                            return e.key === t
                        })).io !== Qe.output) {
                            this.nearInputPoints = [], this.active = "", this.connectType = "default";
                            var n = ml(e), r = ml(t), o = this.getElementById(n.element),
                                i = this.getElementById(r.element), c = Object.keys(o.outputs).indexOf(n.connect),
                                u = Object.keys(i.inputs).indexOf(r.connect), l = this.getIOTypeList(o).outputs,
                                s = this.getIOTypeList(i).inputs, p = l[c], f = s[u];
                            if (p === Qe.both || p === f) {
                                var d, m = vl({id: r.element, key: r.connect}), v = !1, h = dp(this.parent.data);
                                try {
                                    for (h.s(); !(d = h.n()).done;) {
                                        var g = d.value;
                                        if (Object.values(g.outputs).reduce((function (e, t) {
                                            return t && (0, U.isArray)(t) && e.push.apply(e, a()(t)), e
                                        }), []).includes(m)) {
                                            v = !0;
                                            break
                                        }
                                    }
                                } catch (A) {
                                    h.e(A)
                                } finally {
                                    h.f()
                                }
                                if (v) oo.warn("一个输入节点只能连一条线。你可能需要使用逻辑卡片，请在卡片选择栏寻找合适的卡片。"); else if (-1 === o.outputs[n.connect].indexOf(m)) {
                                    var y = (0, U.cloneDeep)(o);
                                    o.outputs[n.connect].push(m), o.outputs = hp({}, o.outputs), this.parent.actionManager.pushCardPropsUpdateAction(y, (0, U.cloneDeep)(o))
                                }
                            } else oo.warn(Qe.input ? "不能这样连线。事件输出节点只能连接事件输入节点，不能连接状态输入节点。" : "不能这样连线。状态输出节点只能连接状态输入节点，不能连接事件输入节点。")
                        } else oo.warn("不能这样连线。卡片右侧的输出节点只能连接卡片左侧的输入节点。")
                    }
                }, {
                    key: "getSimplifiedIOPosition", value: function (e, t) {
                        var n = this.run(e)[t], r = e.cfg.pos.height, a = 0;
                        if (Jd.isDeviceCard(e.type)) {
                            var o = n.length > 1 ? 0 : 6;
                            a = 72 - o
                        }
                        var i = (r - a - he * n.length) / (n.length + 1), c = [];
                        return n.forEach((function (e, t) {
                            c[t] = a + i * (t + 1) + he / 2 * (2 * t + 1)
                        })), c
                    }
                }, {
                    key: "getIOPosition", value: function (e, t) {
                        if (e.cfg.simplified) return this.getSimplifiedIOPosition(e, t);
                        var n = this.run(e)[t], r = e.cfg.pos.height, a = ve, o = 20 * n.length + (n.length - 1) * Se,
                            i = r - ve - Se;
                        [ip.deviceOutput, ip.deviceInput, ip.deviceInputSetVar].includes(e.type) && (a += 52, i -= 52);
                        var c = a + he / 2 + (i - o) / 2;
                        return [ip.varSetNumber, ip.varSetString].includes(e.type) && (c = a + ke / 2), n.map((function (e, t) {
                            return t * Se * 2 + c
                        }))
                    }
                }, {
                    key: "getIOType", value: function (e, t, n) {
                        return this.run(e)[t][n].type
                    }
                }]), n
            }(fp);
            const Ap = yp;
            n(55574), n(60345);

            function bp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Ep = function (e) {
                J()(n, e);
                var t = bp(n);

                function n(e) {
                    var r;
                    G()(this, n), r = t.call(this, e);
                    var a = function () {
                        var e = r.parent.graphTool;
                        return e.getSelect(e.id)
                    };
                    return r.data = {
                        set selectedCards(e) {
                            var t = a();
                            Array.isArray(e) && (t.selectedCards = e.slice(0))
                        }, get selectedCards() {
                            return a().selectedCards
                        }, set selectedLogLines(e) {
                            var t = a();
                            Array.isArray(e) && (t.selectedLogLines = e.slice(0))
                        }, get selectedLogLines() {
                            return a().selectedLogLines
                        }, set multiple(e) {
                            a().multiple = e
                        }, get multiple() {
                            return a().multiple
                        }, set multipleLog(e) {
                            a().multipleLog = e
                        }, get multipleLog() {
                            return a().multipleLog
                        }, set selectedLines(e) {
                            var t = a();
                            Array.isArray(e) && (t.selectedLines = e.slice(0))
                        }, get selectedLines() {
                            return a().selectedLines
                        }
                    }, r
                }

                return z()(n, [{
                    key: "set", value: function (e) {
                        var t = e.selectedCards, n = e.selectedLines, r = e.multiple, o = e.selectedLogLines,
                            i = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                            c = a()(this.data.selectedCards);
                        if (this.data.selectedCards = t, this.data.selectedLines = n, this.data.selectedLogLines = o, "boolean" == typeof r && (this.data.multiple = r), this.data.multiple) {
                            var u = a()(t);
                            if (!i) return this.parent.actionManager.newCardSelectAction(c, u);
                            this.parent.actionManager.pushCardSelectAction(c, u)
                        }
                    }
                }, {
                    key: "clear", value: function () {
                        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                        return this.set({selectedCards: [], selectedLines: [], multiple: !1, multipleLog: !1}, e)
                    }
                }, {
                    key: "updateLayer", value: function () {
                        var e = this.data.selectedCards;
                        if (1 === e.length) {
                            var t = e[0];
                            this.parent.moveDataItemToEnd(t)
                        }
                    }
                }, {
                    key: "singleSelect", value: function (e) {
                        var t = e || this.parent.target.id;
                        t && (this.data.selectedCards.includes(t) || this.set({selectedCards: [t]}), this.updateLayer())
                    }
                }, {
                    key: "multiSelect", value: function (e) {
                        var t = e || this.parent.target.id;
                        if (t) {
                            var n = this.data.selectedCards.slice(0);
                            n.includes(t) ? this.set({selectedCards: []}) : (n.push(t), this.set({selectedCards: n}))
                        }
                    }
                }, {
                    key: "toggleMultiSelect", value: function (e) {
                        var t = e || this.parent.target.id;
                        if (t) {
                            var n = this.data.selectedCards.slice(0), r = n.indexOf(t);
                            r < 0 ? n.push(t) : n.splice(r, 1), this.set({selectedCards: n})
                        }
                    }
                }, {
                    key: "toggleMultiSelectArray", value: function (e) {
                        if (e) if (0 !== e.length) {
                            var t = Array.from(new Set([].concat(a()(this.data.selectedCards), a()(e))));
                            this.set({selectedCards: t})
                        } else this.set({selectedCards: []})
                    }
                }, {
                    key: "toggleMultiSelectLine", value: function (e) {
                        var t = e || this.parent.target.id;
                        if (t) {
                            var n = this.data.selectedLogLines.slice(0), r = n.indexOf(t);
                            r < 0 ? n.push(t) : n.splice(r, 1), this.set({selectedLogLines: n})
                        }
                    }
                }, {
                    key: "toggleMultiSelectLineArray", value: function (e) {
                        if (e) if (0 !== e.length) {
                            var t = Array.from(new Set([].concat(a()(this.data.selectedLogLines), a()(e.map((function (e) {
                                return e
                            }))))));
                            this.set({selectedLogLines: t})
                        } else this.set({selectedLogLines: []})
                    }
                }, {
                    key: "pasteBySelectedCard", value: function (e) {
                        var t = this.parent.graphTool, n = this.getStore();
                        if (n && t.copyData) {
                            var r = Ur(n, t.copyData.target);
                            if (r) {
                                var a = document.querySelector("#canvas-root").childNodes[0].style.transform.match(/^translate3d\((.*)px,(.*)px,.*$/);
                                Number.isNaN(Number(a[1])) ? a[1] = 0 : a[1] = Number(a[1]), Number.isNaN(Number(a[2])) ? a[2] = 0 : a[2] = Number(a[2]);
                                var o = Number(document.querySelector("#canvas-root").childNodes[0].style.transform.match(/scale\((.*)\)/)[1]);
                                window.editor.graphTool.id !== t.copyData.graphId ? this.parent.events.mouseUp.paste(e, {
                                    x: -a[1] + (t.copyData.edgeOffsets.left - $n.left) / o,
                                    y: -a[2] + (t.copyData.edgeOffsets.top - $n.top) / o
                                }) : this.parent.events.mouseUp.paste(e, {x: r.cfg.pos.x + 20, y: r.cfg.pos.y + 20})
                            }
                        }
                    }
                }]), n
            }(fp);
            const Cp = Ep;

            function Op(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            function wp(e) {
                e.cfg.name = e.type
            }

            const kp = function (e) {
                J()(n, e);
                var t = Op(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function () {
                        var e = this, t = [wp];
                        this.parent.data.forEach((function (n) {
                            var r = n.cfg.version, a = void 0 === r ? 0 : r, o = t.slice(a);
                            o.forEach((function (t) {
                                t.call(e.parent, n)
                            })), n.cfg.version = o.length
                        }));
                        var n = this.parent.graphTool.graphConfig.userData.version, r = [].slice(void 0 === n ? 0 : n);
                        r.forEach((function (t) {
                            t.call(e.parent)
                        })), this.parent.graphTool.graphConfig.userData.version = r.length
                    }
                }]), n
            }(fp);

            function xp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Sp = function (e) {
                J()(n, e);
                var t = xp(n);

                function n(e) {
                    var r;
                    return G()(this, n), (r = t.call(this, e)).data = {
                        minX: 1 / 0,
                        minY: 1 / 0,
                        maxX: -1 / 0,
                        maxY: -1 / 0,
                        width: 1 / 0,
                        height: 1 / 0
                    }, r
                }

                return z()(n, [{
                    key: "default", value: function (e) {
                        var t = e.cfg.pos, n = t.x, r = t.y;
                        return {minX: n, minY: r, maxX: n + t.width, maxY: r + t.height}
                    }
                }, {
                    key: "run", value: function (e) {
                        var t = this, n = function (e) {
                            if ((0, El.Z)(e)) return null;
                            var t = e.x1, n = e.y1, r = e.x2, a = e.y2;
                            return {
                                minX: Math.min(t, r),
                                minY: Math.min(n, a),
                                maxX: Math.max(t, r),
                                maxY: Math.max(n, a)
                            }
                        }(e);
                        if (n) {
                            var r, o = this.parent.data.filter((function (e) {
                                    var r;
                                    return function (e, t) {
                                        return !(!e || t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY)
                                    }(null == (r = t[e.type]) ? void 0 : r.call(t, e), n)
                                })), c = o.map((function (e) {
                                    return e.id
                                })), u = this.parent.selectTool.data, l = u.selectedCards, s = u.multiple,
                                p = this.parent.events.mouseDown.getKeyBehavior().currentDownKeyCode, f = function () {
                                    c.forEach((function (e) {
                                        l.includes(e) ? l.splice(l.indexOf(e), 1) : l.push(e)
                                    })), t.parent.selectTool.set({selectedCards: a()(l)})
                                };
                            r = p, [i.Ctrl, i.Command].includes(r) && f(), p === i.Shift && t.parent.selectTool.set({selectedCards: a()(new Set([].concat(a()(l), a()(c))))}), -1 === p && (s ? f() : t.parent.selectTool.set({selectedCards: c}))
                        }
                    }
                }, {
                    key: "getVisiblePos", value: function () {
                        var e = this.parent.transformTool.data, t = e.x, n = e.y, r = e.scale,
                            a = this.parent.graphTool.containerSize;
                        return {minX: -t / r, minY: -n / r, maxX: (a.width - t) / r, maxY: (a.height - n) / r}
                    }
                }, {
                    key: "updateBoundData", value: function () {
                        var e = this.parent.graphTool.containerSize;
                        if (!this.parent.hasData) return this.data = {
                            minX: e.width / 2,
                            minY: e.height / 2,
                            maxX: e.width / 2,
                            maxY: e.height / 2,
                            width: 0,
                            height: 0,
                            rx: 0,
                            ry: 0
                        }, this.data;
                        var t = {minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0}, n = t.minX, r = t.minY,
                            a = t.maxX, o = t.maxY;
                        this.parent.data.forEach((function (e) {
                            var t = e.cfg.pos, i = t.x, c = t.y, u = t.width, l = t.height;
                            i < n && (n = i), c < r && (r = c), i + u > a && (a = i + u), c + l > o && (o = c + l)
                        }));
                        var i = {minX: n, minY: r, maxX: a, maxY: o, width: a - n, height: o - r};
                        return i.rx = i.width / e.width, i.ry = i.height / e.height, this.data = i, this.data
                    }
                }]), n
            }(fp);
            const Tp = Sp;

            function Dp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            function Pp() {
                return ve + we + ke + Se
            }

            function Rp() {
                return Ce + 2 * Se
            }

            var Bp = function (e, t, n, r, o, i, c, u, l, s, p, f) {
                J()(v, e);
                var d, m = Dp(v);

                function v() {
                    return G()(this, v), m.apply(this, arguments)
                }

                return z()(v, [{
                    key: "getInputSpecItemWidth", value: function (e, t) {
                        if (!e || !e.dtype) return 0;
                        var n = e.dtype;
                        return t === je.between ? 3 * Ee + 4 * ye + be : n === me.boolean ? Ee + be + Ae + ye : me.valueList in e ? Ie.include + ye : n === me.int || n === me.float ? 2 * Ee + 2 * ye : Ce + ye
                    }
                }, {
                    key: t, value: function (e) {
                        if (!e.cfg.urn) return null;
                        var t = Ee + 2 * ye + Pe, n = e.props, r = n.eiid, o = n.piid;
                        if ((0, U.isNumber)(r)) {
                            var i = Jd.elements[e.type].getEventData(e), c = e.props.arguments,
                                u = be * Jd.elements[e.type].eventAssignLabel.length + Ae, l = c.map((function (e) {
                                    return 0 === i.length ? 0 : i.find((function (t) {
                                        return t.piid === e.piid
                                    })) ? Ee + u + t + Ae + Pe : 0
                                })), s = be * Jd.elements[e.type].eventEmitLabel.length + Ae;
                            e.cfg.pos.width = Math.max.apply(Math, a()(l).concat([Ce + s])) + 2 * Se;
                            var p = c.filter((function (e) {
                                return 0 !== Object.keys(e).length
                            })).length;
                            e.cfg.pos.height = Pp() + (p + (i.length === c.length ? 0 : 1)) * xe
                        } else if (e.cfg.pos.width = Rp(), e.cfg.pos.height = Pp(), (0, U.isNumber)(o)) {
                            var f = be * Jd.elements[e.type].propertyAssignLabel.length + Ae;
                            e.cfg.pos.width += f + t, e.cfg.pos.height += xe
                        }
                    }
                }, {
                    key: n, value: function (e) {
                        var t = this;
                        if (!e.cfg.urn) return null;
                        var n = e.props, r = n.eiid, o = n.piid;
                        if ((0, U.isNumber)(r)) {
                            var i = Jd.elements[e.type].getEventData(e), c = e.props.arguments;
                            if (c.length > 0) {
                                var u = c.map((function (e) {
                                    if (0 === i.length) return 0;
                                    var n = i.find((function (t) {
                                        return t.piid === e.piid
                                    }));
                                    return n ? Ee + ye + t.getInputSpecItemWidth(n, e.operator) + Pe : 0
                                }));
                                e.cfg.pos.width = Math.max.apply(Math, a()(u).concat([Ce])) + 2 * Se
                            } else e.cfg.pos.width = Rp();
                            var l = c.filter((function (e) {
                                return 0 !== Object.keys(e).length
                            })).length;
                            e.cfg.pos.height = ve + we + xe + (l + (i.length === c.length ? 0 : 1)) * xe + Se
                        } else {
                            var s = Jd.elements[e.type].getNotifyData(e);
                            e.cfg.pos.width = Rp() + this.getInputSpecItemWidth(s, e.props.operator) + ye, e.cfg.pos.height = ve + 2 * we + Se, o && (e.cfg.pos.height += 30)
                        }
                        e.cfg.pos.height -= ye
                    }
                }, {
                    key: r, value: function (e) {
                        if (!e.cfg.urn) return null;
                        var t = Jd.elements[e.type].getGetData(e);
                        e.cfg.pos.width = Ie.getLeft + 2 * Se + Rp() + this.getInputSpecItemWidth(t, e.props.operator) + Ie.getRight, e.cfg.pos.height = Pp()
                    }
                }, {
                    key: o, value: function (e) {
                        if (!e.cfg.urn) return null;
                        var t = e.props.piid, n = Ee + Pe + 2 * ye, r = be * Jd.elements[e.type].assignLabel.length;
                        e.cfg.pos.width = Ie.getLeft + 2 * Se + Ce + ((0, U.isNumber)(t) ? Ae + n + r : 0) + Se, e.cfg.pos.height = Pp()
                    }
                }, {
                    key: i, value: function (e) {
                        if (!e.cfg.urn) return null;
                        if ((0, U.isNumber)(e.props.aiid)) {
                            var t = 0, n = Jd.elements[e.type].getActionData(e);
                            if (n.length > 0) {
                                t = ye + Ee;
                                var r = n.map((function (t) {
                                    return ye + (t.dtype === me.string ? Ce : Ee) + (Jd.elements[e.type].hasVarInput(t) ? Pe + ye : 0)
                                }));
                                t += Math.max.apply(Math, a()(r))
                            }
                            return e.cfg.pos.width = Rp() + t, void (e.cfg.pos.height = Pp() + Math.max(n.length - 1, 0) * xe)
                        }
                        if ((0, U.isNumber)(e.props.piid)) {
                            var o = Jd.elements.deviceOutput.getSetData(e), i = Rp();
                            return i += ye + (o.dtype === me.string ? Ce : Ee), i += Jd.elements[e.type].hasVarInput(o) ? Pe + ye : 0, e.cfg.pos.width = i + 120, void (e.cfg.pos.height = Pp())
                        }
                        e.cfg.pos.width = Rp(), e.cfg.pos.height = Pp()
                    }
                }, {
                    key: c, value: function (e) {
                        var t = Ee + Pe + ye;
                        e.props.id && (e.props.varType === Ea.string ? t += Ce + ye : t += 2 * Ee + 2 * ye + (e.props.operator === je.between ? be + Ee + 2 * ye : 0)), e.cfg.pos.width = 2 * Se + Math.max(Re, t), e.cfg.pos.height = ve + 2 * xe - ye + Se
                    }
                }, {
                    key: u, value: function (e) {
                        var t = Ee + Pe + ye;
                        e.props.id && (t += Ae, e.props.varType === Ea.string ? t += Ce : t += 2 * Ee + ye + (e.props.operator === je.between ? Te + Ee : 0));
                        var n = Math.max.apply(Math, a()(sp[e.type].connector.outputs.map((function (e) {
                            return e.extra.length
                        })))) * be + Ae;
                        e.cfg.pos.width = 2 * Se + t + n, e.cfg.pos.height = ve + we + ye
                    }
                }, {
                    key: l, value: function (e) {
                        e.cfg.pos.width = 2 * Se + Ee + Pe + De + Oe + 2 * Pe + 5 * ye, e.cfg.pos.height = ve + Math.max(e.cfg.pos.exprHeight || 0, ke) + Se
                    }
                }, {
                    key: s, value: function (e) {
                        e.cfg.pos.width = 2 * Se + Ee + Pe + De + Oe + Pe + 4 * ye, e.cfg.pos.height = ve + Math.max(e.cfg.pos.exprHeight || 0, ke) + Se
                    }
                }, {
                    key: p, value: function (e) {
                        var t = ve + xe + Se, n = 3 * Ee + 2 * ye;
                        e.cfg.happenType !== Yc.now && (n += Ee + ye + 2 * be + ye), Jd.elements.alarmClock.isCustom(e) && (n += Ee + ye), Jd.elements.alarmClock.isSunset(e) && (t += xe, n = Math.max(n, 3 * Ee + 2 * ye + 2 * Se + 4 * be)), e.cfg.pos.width = 2 * Se + n, e.cfg.pos.height = t - ye
                    }
                }, {
                    key: f, value: function (e) {
                        var t = 3 * Ee + 3 * ye + be;
                        Jd.elements.timeRange.isCustom(e) && (t += Ee + ye), e.cfg.pos.width = 2 * Se + t, e.cfg.pos.height = ve + ke + Se
                    }
                }, {
                    key: "simplifiedRun", value: (d = Fr()(Yr().mark((function e(t, n) {
                        var r, a, o, i, c, u, l;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    null != (o = sp[t.type]) && null != (r = o.size) && r.simplifiedWidth ? t.cfg.pos.width = o.size.simplifiedWidth : (i = $c(t, n), c = _c(t.type), u = c.left, l = c.right, t.cfg.pos.width = i + u + l), null != o && null != (a = o.size) && a.simplifiedHeight ? t.cfg.pos.height = o.size.simplifiedHeight : t.cfg.pos.height = eu(t, n);
                                case 3:
                                case"end":
                                    return e.stop()
                            }
                        }), e)
                    }))), function (e, t) {
                        return d.apply(this, arguments)
                    })
                }, {
                    key: "run", value: function (e) {
                        var t, n, r = this;
                        if (e.type !== sp.nop.type) if (e.cfg.simplified) {
                            var a = Jd.varTool, o = Jd.graphTool;
                            a.isVarCard(e.type) ? a.listAvailVars(o.id, !0).then((function (t) {
                                var n = a.makeVarMap(a.makeVarOptions(t));
                                r.simplifiedRun(e, n)
                            })) : this.simplifiedRun(e)
                        } else if (this[e.type]) this[e.type](e); else {
                            var i = sp[e.type];
                            if (null != i && null != (t = i.size) && t.width && (e.cfg.pos.width = i.size.width), null != i && null != (n = i.size) && n.height) e.cfg.pos.height = i.size.height; else {
                                var c = Jd.connectTool.run(e), u = Math.max(c.inputs.length, c.outputs.length);
                                e.cfg.pos.height = 2 * u * 20 + ve
                            }
                        }
                    }
                }]), v
            }(fp, sp.deviceInputSetVar.type, sp.deviceInput.type, sp.deviceGet.type, sp.deviceGetSetVar.type, sp.deviceOutput.type, sp.varChange.type, sp.varGet.type, sp.varSetNumber.type, sp.varSetString.type, sp.alarmClock.type, sp.timeRange.type);
            const Ip = Bp;

            function jp(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Np(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Lp = .01, Qp = 9.99, Mp = {x: 0, y: 0, scale: 1, rotate: 0, temp: 1}, Zp = function (e) {
                J()(n, e);
                var t = Np(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "data", get: function () {
                        var e = this.parent.graphTool, t = e.graphConfig.userData.transform;
                        return 0 !== e.id && t ? t : function (e) {
                            for (var t = 1; t < arguments.length; t++) {
                                var n = null != arguments[t] ? arguments[t] : {};
                                t % 2 ? jp(Object(n), !0).forEach((function (t) {
                                    H()(e, t, n[t])
                                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jp(Object(n)).forEach((function (t) {
                                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                }))
                            }
                            return e
                        }({}, Mp)
                    }
                }, {
                    key: "getViewBox", value: function () {
                        var e = this.data, t = e.x, n = void 0 === t ? 0 : t, r = e.y, a = void 0 === r ? 0 : r,
                            o = e.scale, i = void 0 === o ? 1 : o, c = e.ax, u = void 0 === c ? 0 : c, l = e.ay,
                            s = void 0 === l ? 0 : l, p = this.parent.graphTool.containerSize, f = p.width / i,
                            d = -1 * n + u * (1 - 1 / i), m = p.height / i, v = -1 * a + s * (1 - 1 / i);
                        return {
                            startX: d,
                            startY: v,
                            width: f,
                            height: m,
                            viewBox: "".concat(d, " ").concat(v, " ").concat(f, " ").concat(m)
                        }
                    }
                }, {
                    key: "fitToBestPos", value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 50,
                            t = this.parent.boundaryTool.updateBoundData(), n = this.parent.graphTool.containerSize,
                            r = n.width / n.height, a = t.width / t.height, o = 1;
                        t.width <= n.width && t.height <= n.height && (o = 1), t.width > n.width && a >= r && (o = n.width / (t.width + e)), t.height > n.height && a <= r && (o = n.height / (t.height + e)), this.data.scale = o, this.data.x = (n.width - o * (t.maxX + t.minX)) / 2, this.data.y = (n.height - o * (t.maxY + t.minY)) / 2, update()
                    }
                }, {
                    key: "isElementVisible", value: function (e) {
                        var t = this.getElementById(e).cfg.pos, n = this.getViewBox(), r = n.startX, a = n.startY,
                            o = n.width, i = n.height;
                        return !(t.x < r) && (!(t.y < a) && (!(t.x + t.width > r + o) && (!(t.y + t.height > a + i) && !(t.y < a))))
                    }
                }, {
                    key: "moveElementToCenter", value: function (e) {
                        var t = this.parent.graphTool.containerSize, n = this.getElementById(e).cfg.pos;
                        this.data.x = t.width / 2 - n.x - n.width / 2, this.data.y = t.height / 2 - n.y - n.height / 2, this.data.scale = 1, update()
                    }
                }, {
                    key: "transform", value: function (e) {
                        var t = e.scale, n = e.x, r = e.y;
                        t && (t > Qp && (t = Qp), t < Lp && (t = Lp), this.data.scale = t), null != n && (this.data.x = n), null != r && (this.data.y = r), Ri(Ti.ADD_CHANGED_TAB, {isAutoBackup: !1}), update()
                    }
                }, {
                    key: "getLaterOffset", value: function (e, t, n) {
                        var r = this.data, a = r.x, o = r.y, i = r.scale, c = e.x - $n.left, u = e.y - $n.top,
                            l = i * t;
                        null != n && (l = n);
                        var s = k(l, Lp, Qp), p = s / i;
                        return {x: (a - c) * p + c, y: (o - u) * p + u, scale: s}
                    }
                }, {
                    key: "scaleCanvasAtPoint", value: function (e, t, n) {
                        var r = this.getLaterOffset(e, t, n);
                        this.transform(r)
                    }
                }, {
                    key: "run", value: function (e) {
                        if (!(0, El.Z)(this.parent.data)) {
                            var t = e.deltaX, n = e.deltaY, r = e.clientX, a = e.clientY;
                            if (d(e)) {
                                var o = Math.exp(3e-4 * -n), i = {x: r, y: a};
                                this.scaleCanvasAtPoint(i, o)
                            } else v(e) ? this.transform({x: this.data.x - (t || n)}) : this.transform({
                                x: this.data.x - t,
                                y: this.data.y - n
                            })
                        }
                    }
                }]), n
            }(fp);
            const Vp = Zp;
            var Hp = ["arguments"], Fp = ["ins"];

            function Gp(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Yp = "输入错误", zp = function (e) {
                return null == e || "" === e || (0, U.isArray)(e) && 0 === e.length
            };

            function Up(e, t, n) {
                if (zp(n.v1)) return e.v1 = "输入不能为空", e;
                if (t.dtype === me.int || t.dtype === me.float) {
                    if (!n.operator) return e.operator = "请选择对比方式", e;
                    if (n.operator === je.between && zp(n.v2)) return e.v2 = "输入不能为空", e
                }
                return e
            }

            var qp = function (e, t, n) {
                return zp(n.scope) || zp(n.id) ? (e.var = "必须选择变量", e) : ka(t.dtype) !== n.dtype ? (e.var = "变量类型不匹配", e) : e
            }, Xp = function (e) {
                J()(n, e);
                var t = Gp(n);

                function n(e) {
                    var r;
                    return G()(this, n), (r = t.call(this, e)).data = {}, r
                }

                return z()(n, [{
                    key: "getDep", value: function (e) {
                        return this.data[e] ? this.data[e] : {}
                    }
                }, {
                    key: "init", value: function (e) {
                        this.data[e.id] || (this.data[e.id] = {})
                    }
                }, {
                    key: "default", value: function () {
                        return {}
                    }
                }, {
                    key: "alarmClock", value: function (e) {
                        var t, n, r = {};
                        return "sunset" === e.props.type && ("latitude" in e.props && "number" == typeof e.props.latitude || (r.latitude = Yp), (e.props.latitude < -90 || e.props.latitude > 90) && (r.latitude = Yp), "longitude" in e.props && "number" == typeof e.props.longitude || (r.longitude = Yp), (e.props.longitude < -180 || e.props.longitude > 180) && (r.longitude = Yp), "offset" in e.props && Number.isInteger(e.props.offset) || (r.offset = Yp)), (0, U.isArray)(null == (t = e.props) || null == (n = t.filter) ? void 0 : n.day) && 0 === e.props.filter.day.length && (r.filter = Yp), r
                    }
                }, {
                    key: "timeRange", value: function (e) {
                        var t, n, r = {};
                        return "hour" in e.props.start && "minute" in e.props.start && "second" in e.props.start || (r.start = "请选择开始时间"), "hour" in e.props.end && "minute" in e.props.end && "second" in e.props.end || (r.start = "请选择开始时间"), (0, U.isArray)(null == (t = e.props) || null == (n = t.filter) ? void 0 : n.day) && 0 === e.props.filter.day.length && (r.filter = Yp), r
                    }
                }, {
                    key: "deviceInputSetVar", value: function (e) {
                        var t = e.props, n = {};
                        if (!(0, U.isNumber)(t.siid)) return n.siid = "请选择服务", n;
                        if ((0, U.isNumber)(t.piid)) {
                            var r = this.parent.elements[e.type].getNotifyData(e);
                            return qp(n, r, e.props)
                        }
                        if ((0, U.isNumber)(t.eiid)) {
                            var a = this.parent.elements[e.type].getEventData(e);
                            if (a.length < 1) return n;
                            var o = t.arguments.map((function (e) {
                                if (!e.piid) return {piid: "请选择属性"};
                                var t = a.find((function (t) {
                                    return t.piid === e.piid
                                }));
                                return qp({}, t, e)
                            }));
                            n.arguments = o
                        }
                        return n
                    }
                }, {
                    key: "deviceInput", value: function (e) {
                        var t = e.props, n = {};
                        if (!(0, U.isNumber)(t.siid)) return n.siid = "请选择服务", n;
                        if ((0, U.isNumber)(t.piid)) return Up(n, this.parent.elements[e.type].getNotifyData(e), e.props), n;
                        if ((0, U.isNumber)(t.eiid)) {
                            var r = this.parent.elements[e.type].getEventData(e);
                            if (0 === r.length) return n;
                            var a = e.props.arguments.map((function (e) {
                                return e.piid ? Up({}, r.find((function (t) {
                                    return t.piid === e.piid
                                })), e) : {piid: "请选择属性"}
                            }));
                            n.arguments = a
                        }
                        return n
                    }
                }, {
                    key: "deviceGetSetVar", value: function (e) {
                        var t = e.props, n = {};
                        if (!(0, U.isNumber)(t.siid)) return n.siid = "请选择服务", n;
                        var r = this.parent.elements[e.type].getGetData(e);
                        return qp(n, r, e.props)
                    }
                }, {
                    key: "deviceGet", value: function (e) {
                        var t = e.props, n = {};
                        return (0, U.isNumber)(t.siid) ? (Up(n, this.parent.elements[e.type].getGetData(e), e.props), n) : (n.siid = "请选择服务", n)
                    }
                }, {
                    key: "deviceOutput", value: function (e) {
                        var t = this.parent.varTool, n = {};

                        function r(e, n) {
                            return t.isVarValue(n) ? (zp(n.id) && (e.value = "变量不能为空"), e) : (zp(n.value) && (e.value = "输入不能为空"), e)
                        }

                        if (!(0, U.isNumber)(e.props.siid)) return n.siid = "请选择服务", n;
                        if ((0, U.isNumber)(e.props.piid) && r(n, e.props), (0, U.isNumber)(e.props.aiid)) {
                            var a = e.props.ins.map((function (e) {
                                return r({}, e)
                            }));
                            n.ins = a
                        }
                        return n
                    }
                }, {
                    key: "varChange", value: function (e) {
                        var t = e.props, n = {};
                        return zp(t.scope) || zp(t.id) || zp(t.varType) ? (n.var = "未选择变量", n) : zp(t.operator) ? (n.operator = "请选择对比方式", n) : zp(t.v1) ? (n.v1 = "输入不能为空", n) : t.operator === je.between && zp(t.v2) ? (n.v2 = "输入不能为空", n) : n
                    }
                }, {
                    key: "varGet", value: function (e) {
                        var t = e.props, n = {};
                        return zp(t.scope) || zp(t.id) || zp(t.varType) ? (n.var = "未选择变量", n) : zp(t.operator) ? (n.operator = "请选择对比方式", n) : zp(t.v1) ? (n.v1 = "输入不能为空", n) : t.operator === je.between && zp(t.v2) ? (n.v2 = "输入不能为空", n) : n
                    }
                }, {
                    key: "varSetNumber", value: function (e) {
                        var t = e.props, n = {};
                        return zp(t.scope) || zp(t.id) ? (n.var = "未选择变量", n) : t.elements && 0 !== t.elements.length ? (function (e) {
                            var t = e.map((function (e) {
                                return e.type === ya ? e.value : e.type === Aa ? "$" : ""
                            })).join("");
                            try {
                                return Jr.yg.check(t), !0
                            } catch (n) {
                                return !1
                            }
                        }(t.elements) || (n.elements = "运算式不合法"), n) : (n.elements = "未输入内容", n)
                    }
                }, {
                    key: "varSetString", value: function (e) {
                        var t = e.props, n = {};
                        return zp(t.scope) || zp(t.id) ? (n.var = "未选择变量", n) : (t.elements && 0 !== t.elements.length || (n.elements = "未输入内容"), n)
                    }
                }, {
                    key: "getStatusByText", value: function (e) {
                        return e ? le : se
                    }
                }, {
                    key: "getFirstErrorMessage", value: function (e) {
                        if (e) {
                            var t = ["arguments", "ins"];
                            t.forEach((function (t) {
                                e[t] && (e[t] = e[t].filter((function (e) {
                                    return !(0, U.isEmpty)(e)
                                })), (0, U.isEmpty)(e[t]) && delete e[t])
                            }));
                            var n = Object.keys(e);
                            if (!(0, U.isEmpty)(n)) {
                                var r = n[0], a = e[r];
                                return t.includes(r) ? this.getFirstErrorMessage(a[0]) : a
                            }
                        }
                    }
                }, {
                    key: "check", value: function (e) {
                        var t = this[e.type];
                        return t ? t.call(this, e) : {}
                    }
                }, {
                    key: "run", value: function (e) {
                        var t = this.check(e);
                        if ([ip.deviceInput, ip.deviceInputSetVar].includes(e.type) && e.props.eiid) {
                            var n = t.arguments, r = void 0 === n ? [] : n, a = Ke()(t, Hp),
                                o = !(0, U.isEmpty)(r.filter((function (e) {
                                    return !(0, U.isEmpty)(e)
                                }))), i = !(0, U.isEmpty)(a);
                            return o || i ? t : null
                        }
                        if (ip.deviceOutput === e.type && e.props.aiid) {
                            var c = t.ins, u = void 0 === c ? [] : c, l = Ke()(t, Fp),
                                s = !(0, U.isEmpty)(u.filter((function (e) {
                                    return !(0, U.isEmpty)(e)
                                }))), p = !(0, U.isEmpty)(l);
                            return s || p ? t : null
                        }
                        if (!(0, U.isEmpty)(t)) return t
                    }
                }]), n
            }(fp);
            const Kp = Xp;

            function Wp(e) {
                window.location.hash = e
            }

            function Jp(e) {
                Wp("/graph/".concat(e))
            }

            function _p(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                    n = arguments.length > 2 ? arguments[2] : void 0;
                if (!e || "object" != typeof e) return n;
                var r = e, a = t.length;
                try {
                    for (var o = 0; o < a; o += 1) {
                        if (void 0 === r[t[o]]) return n;
                        r = r[t[o]]
                    }
                } catch (i) {
                    return n
                }
                return r
            }

            function $p(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return ef(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ef(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function ef(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function tf(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function nf(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? tf(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : tf(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function rf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var af = {selectedLines: [], selectedCards: [], multiple: !1, selectedLogLines: []}, of = function (e) {
                J()(o, e);
                var t, n, r, a = rf(o);

                function o(e) {
                    var t;
                    return G()(this, o), (t = a.call(this, e))._graphMap = new Map, t._selectMap = new Map, t.id = 0, t.graph = null, t.copyData = null, t._moveCopyMarked = !1, t.containerSize = {
                        width: 0,
                        height: 0
                    }, t.containerOffset = $n, t.rules = [], t.tempRules = [], t.connectingInfo = {from: "", id: ""}, t
                }

                return z()(o, [{
                    key: "lockMoveCopy", value: function (e) {
                        if (null == e) return this._moveCopyMarked;
                        this._moveCopyMarked = e
                    }
                }, {
                    key: "addTempRule", value: function (e) {
                        this.tempRules.some((function (t) {
                            return t.id === e.id
                        })) || this.tempRules.push(e)
                    }
                }, {
                    key: "removeTempRule", value: function (e) {
                        var t = this.tempRules.findIndex((function (t) {
                            return t.id === e
                        }));
                        -1 !== t && this.tempRules.splice(t, 1)
                    }
                }, {
                    key: "setGraph", value: function (e, t) {
                        this._graphMap.set(e, t)
                    }
                }, {
                    key: "getGraph", value: function (e) {
                        return this._graphMap.get(e)
                    }
                }, {
                    key: "removeGraph", value: function (e) {
                        this._graphMap.delete(e)
                    }
                }, {
                    key: "setSelect", value: function (e, t) {
                        this._selectMap.set(e, t || (0, U.cloneDeep)(af))
                    }
                }, {
                    key: "hasSelect", value: function (e) {
                        return this._selectMap.has(e)
                    }
                }, {
                    key: "getSelect", value: function (e) {
                        return this._selectMap.get(e) || (0, U.cloneDeep)(af)
                    }
                }, {
                    key: "removeSelect", value: function (e) {
                        this._selectMap.delete(e)
                    }
                }, {
                    key: "updateContainerSize", value: function () {
                        var e = f();
                        this.containerSize = {
                            width: e.width - $n.left,
                            height: e.height - $n.top
                        }, Ri(Ti.CONTAINER_SIZE_UPDATE, nf(nf({}, this.containerSize), $n))
                    }
                }, {
                    key: "graphConfig", get: function () {
                        return this.graph || {userData: {transform: {x: 0, y: 0, scale: 1, rotate: 0}}, id: 0}
                    }
                }, {
                    key: "centerPoint", get: function () {
                        return {x: this.containerSize.width / 2, y: this.containerSize.height / 2}
                    }
                }, {
                    key: "appendTempGraph", value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], n = {
                            id: String((new Date).getTime()),
                            userData: {
                                name: e,
                                transform: {x: 0, y: 0, scale: 1, rotate: 0},
                                lastUpdateTime: (new Date).getTime()
                            },
                            uiType: qn,
                            enable: !0
                        };
                        this.setGraph(n.id, t), this.addTempRule(n), Ri(Ti.ADD_CHANGED_TAB, {id: n.id}), Jp(n.id)
                    }
                }, {
                    key: "appendBatGraph", value: function () {
                        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.id,
                            n = t === this.id, r = n ? this.graphConfig : this.rules.find((function (e) {
                                return e.id === t
                            }));
                        if (r) {
                            var a = {
                                uiType: qn,
                                enable: !0,
                                userData: nf(nf({}, r.userData), {}, {
                                    transform: nf({}, r.userData.transform),
                                    lastUpdateTime: (new Date).getTime(),
                                    name: "".concat(r.userData.name, "-副本")
                                }),
                                id: String((new Date).getTime())
                            };
                            this.tempRules.push(a), Ri(Ti.ADD_CHANGED_TAB, {id: a.id});
                            var o = function () {
                                Jd.varTool.copyCardsVars(r.id, a.id, e.getGraph(a.id)).then((function () {
                                    Jp(a.id)
                                }))
                            };
                            n ? (this.setGraph(a.id, (0, U.cloneDeep)(this.getGraph(r.id))), o()) : this.fetch(a, r).then(o)
                        }
                    }
                }, {
                    key: "removeCache", value: function (e) {
                        this.removeTempRule(e), this.removeGraph(e), Jd.actionManager.removeAction(e), this.removeSelect(e), this.id === e && (this.id = null, this.graph = null)
                    }
                }, {
                    key: "updateGraphConfig", value: function (e, t) {
                        this.id === e && (this.graph = t);
                        var n = this.tempRules.find((function (t) {
                            return t.id === e
                        }));
                        if (n > -1) this.tempRules.splice(n, 1, t); else {
                            var r = this.rules.find((function (t) {
                                return t.id === e
                            }));
                            r > -1 && this.rules.splice(r, 1, t)
                        }
                    }
                }, {
                    key: "setGraphConfig", value: (r = Fr()(Yr().mark((function e(t) {
                        var n;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (this.id !== t) {
                                        e.next = 3;
                                        break
                                    }
                                    return Ri(Ti.ADD_TAB, this.graph), e.abrupt("return");
                                case 3:
                                    if (this.id = t, n = this.tempRules.find((function (e) {
                                        return e.id === t
                                    })) || this.rules.find((function (e) {
                                        return e.id === t
                                    }))) {
                                        e.next = 7;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 7:
                                    return Ri(Ti.ADD_TAB, n), n.userData.transform || (n.userData.transform = {
                                        x: 0,
                                        y: 0,
                                        scale: 1,
                                        rotate: 0
                                    }), this.graph = n, (0, El.Z)(Jd.actionManager.getAction(t)) && Jd.actionManager.setAction(t), this.hasSelect(t) || this.setSelect(t), e.next = 14, this.fetch(n);
                                case 14:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this)
                    }))), function (e) {
                        return r.apply(this, arguments)
                    })
                }, {
                    key: "fetch", value: (n = Fr()(Yr().mark((function e(t, n) {
                        var r, a, o, i, c, l = this;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (t) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 2:
                                    if (r = Boolean(n), n = r ? n : t, a = this.getGraph(n.id), o = function (e) {
                                        return (0, El.Z)(e) ? Promise.resolve() : new Promise((function (t) {
                                            var n = {};
                                            e.forEach((function (e) {
                                                var t = _p(e, ["cfg", "urn"]);
                                                t && (n[t] ? n[t].push(e) : n[t] = [e])
                                            }));
                                            var r = Object.keys(n), a = r.length, o = 0, i = function () {
                                                ++o === a && t()
                                            };
                                            if ((0, El.Z)(r)) return t();
                                            r.forEach((function (e) {
                                                Jd.gateway.getDeviceDetail(e).then((function () {
                                                    n[e].forEach((function (e) {
                                                        Jd.sizeTool.run(e)
                                                    })), i()
                                                })).catch(i)
                                            }))
                                        }))
                                    }, i = function () {
                                        var e = Fr()(Yr().mark((function e(n, r) {
                                            return Yr().wrap((function (e) {
                                                for (; ;) switch (e.prev = e.next) {
                                                    case 0:
                                                        if (r) {
                                                            e.next = 3;
                                                            break
                                                        }
                                                        return e.next = 3, o(n);
                                                    case 3:
                                                        l.setGraph(t.id, n), Jd.resetData(), Jd.versionTool.run();
                                                    case 6:
                                                    case"end":
                                                        return e.stop()
                                                }
                                            }), e)
                                        })));
                                        return function (t, n) {
                                            return e.apply(this, arguments)
                                        }
                                    }(), !a) {
                                        e.next = 9;
                                        break
                                    }
                                    return e.abrupt("return", i(r ? (0, U.cloneDeep)(a) : a, !0));
                                case 9:
                                    return e.prev = 9, e.next = 12, Jr.kd.getRuleContent(n);
                                case 12:
                                    return c = e.sent, e.abrupt("return", i(c));
                                case 16:
                                    e.prev = 16, e.t0 = e.catch(9), u(e.t0);
                                case 19:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this, [[9, 16]])
                    }))), function (e, t) {
                        return n.apply(this, arguments)
                    })
                }, {
                    key: "save", value: (t = Fr()(Yr().mark((function e() {
                        var t, n, r, a, o, i, c, l, s, p, f, d, m, v, h, g, y, A, b, E, C, O;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (Ri(Ti.REMOVE_CHANGED_TAB, this.id), t = this.graphConfig.id, (n = nf(nf({}, this.graphConfig), {}, {id: t})).userData.lastUpdateTime = Date.now(), !this.connectingInfo.from && !this.connectingInfo.id) {
                                        e.next = 7;
                                        break
                                    }
                                    return oo.error("有未连接完成的线"), e.abrupt("return");
                                case 7:
                                    return r = Jd.varTool, a = Jd.nodeCheckTool, e.next = 10, r.listAvailVars(t);
                                case 10:
                                    o = e.sent, i = o.map((function (e) {
                                        return e.id
                                    })), c = "", l = "", s = "", p = "卡片配置有误", f = $p(Jd.data), e.prev = 17, f.s();
                                case 19:
                                    if ((d = f.n()).done) {
                                        e.next = 57;
                                        break
                                    }
                                    if (m = d.value, !(v = a.run(m))) {
                                        e.next = 28;
                                        break
                                    }
                                    return c = m.id, p = Jd.nodeCheckTool.getFirstErrorMessage(v), e.abrupt("break", 57);
                                case 28:
                                    if (!r.isVarCard(m.type)) {
                                        e.next = 55;
                                        break
                                    }
                                    h = r.getBeusedVarsFromCard(m, !0), g = $p(h), e.prev = 31, g.s();
                                case 33:
                                    if ((y = g.n()).done) {
                                        e.next = 45;
                                        break
                                    }
                                    if (A = y.value, ba(A.scope) || A.scope === Fa(t)) {
                                        e.next = 39;
                                        break
                                    }
                                    return c = m.id, s = A, e.abrupt("break", 45);
                                case 39:
                                    if (i.includes(A.id)) {
                                        e.next = 43;
                                        break
                                    }
                                    return c = m.id, l = A, e.abrupt("break", 45);
                                case 43:
                                    e.next = 33;
                                    break;
                                case 45:
                                    e.next = 50;
                                    break;
                                case 47:
                                    e.prev = 47, e.t0 = e.catch(31), g.e(e.t0);
                                case 50:
                                    return e.prev = 50, g.f(), e.finish(50);
                                case 53:
                                    if (!c) {
                                        e.next = 55;
                                        break
                                    }
                                    return e.abrupt("break", 57);
                                case 55:
                                    e.next = 19;
                                    break;
                                case 57:
                                    e.next = 62;
                                    break;
                                case 59:
                                    e.prev = 59, e.t1 = e.catch(17), f.e(e.t1);
                                case 62:
                                    return e.prev = 62, f.f(), e.finish(62);
                                case 65:
                                    if (!(b = c)) {
                                        e.next = 73;
                                        break
                                    }
                                    return Jd.selectTool.singleSelect(b), Jd.transformTool.moveElementToCenter(b), update(), E = s ? "卡片变量有误，请重新选择" : l ? "卡片变量丢失" : p, oo.error(E), e.abrupt("return");
                                case 73:
                                    return e.prev = 73, Jd.reset(), e.next = 77, r.saveAndClean(this.graphConfig.id);
                                case 77:
                                    return C = e.sent, (O = C.removedCount) > 0 && oo.warn("有".concat(O, "个未被使用的本规则变量，已将其删除")), e.next = 82, Jr.kd.saveRule(Jd.data, n);
                                case 82:
                                    update(), oo.success("保存成功"), e.next = 90;
                                    break;
                                case 86:
                                    e.prev = 86, e.t2 = e.catch(73), u(e.t2), oo.error("卡片配置有误");
                                case 90:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this, [[17, 59, 62, 65], [31, 47, 50, 53], [73, 86]])
                    }))), function () {
                        return t.apply(this, arguments)
                    })
                }]), o
            }(fp);
            const cf = of;
            var uf = n(10183), lf = n(93162);

            function sf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const pf = function (e) {
                J()(r, e);
                var t, n = sf(r);

                function r(e) {
                    var t;
                    return G()(this, r), (t = n.call(this, e)).show = !1, t
                }

                return z()(r, [{
                    key: "run", value: (t = Fr()(Yr().mark((function e() {
                        var t, n, r, a, i, c, l, s, p, f, d = this;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    t = "screen-shot", this.show = !0, oo.warn({
                                        content: "正在截图",
                                        duration: 0,
                                        key: t,
                                        icon: o.createElement(We.Z, {component: ot.Z, className: "icon-rotate"})
                                    }), n = this.parent.transformTool, r = q().cloneDeep(n.data), this.parent.transformTool.fitToBestPos(), a = this.parent.graphTool.containerSize, i = a.width, c = a.height, l = $n.left, s = $n.top, p = function (e) {
                                        return "scroll-bar" !== e.className
                                    }, f = this.parent.transformTool.data.scale, setTimeout(Fr()(Yr().mark((function e() {
                                        var a, o;
                                        return Yr().wrap((function (e) {
                                            for (; ;) switch (e.prev = e.next) {
                                                case 0:
                                                    return e.prev = 0, a = document.querySelector(".panel"), e.next = 4, (0, uf.YM)(a, {
                                                        width: i / f,
                                                        height: c / f,
                                                        filter: p,
                                                        style: {
                                                            transform: "translate(-".concat(l, "px, -").concat(s, "px) scale(").concat(1 / f, ")"),
                                                            transformOrigin: "0 0"
                                                        },
                                                        imagePlaceholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                                    });
                                                case 4:
                                                    o = e.sent, (0, lf.saveAs)(o, "".concat(d.parent.graphTool.graphConfig.userData.name, ".png")), oo.success({content: "截图完成"}), e.next = 13;
                                                    break;
                                                case 9:
                                                    e.prev = 9, e.t0 = e.catch(0), u(e.t0), oo.error(e.t0.message || "截图失败");
                                                case 13:
                                                    return e.prev = 13, oo.destroy(t), n.data.x = r.x, n.data.y = r.y, n.data.scale = r.scale, n.data.ax = r.ax, n.data.ay = r.ay, d.show = !1, update(), e.finish(13);
                                                case 23:
                                                case"end":
                                                    return e.stop()
                                            }
                                        }), e, null, [[0, 9, 13, 23]])
                                    }))), 1e3);
                                case 11:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this)
                    }))), function () {
                        return t.apply(this, arguments)
                    })
                }]), r
            }(fp);

            function ff(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var df = {x: 0, y: 0, id: null, type: null, element: null, name: ""};
            const mf = function (e) {
                J()(n, e);
                var t = ff(n);

                function n(e) {
                    var r;
                    return G()(this, n), (r = t.call(this, e)).reset(), r
                }

                return z()(n, [{
                    key: "set", value: function (e) {
                        var t = e.element, n = void 0 === t ? null : t, r = e.id, a = void 0 === r ? "" : r,
                            o = e.offset, i = void 0 === o ? {x: 0, y: 0} : o, c = e.type, u = void 0 === c ? null : c,
                            l = e.name, s = void 0 === l ? "" : l;
                        this.element = n, this.id = a, this.offset = i, this.type = u, this.name = s
                    }
                }, {
                    key: "reset", value: function () {
                        this.set(df)
                    }
                }, {
                    key: "getTarget", value: function (e) {
                        var t = e.target;
                        if ("HTML" === t.tagName) return null;
                        for (; "1" !== (null == (n = t) || null == (r = n.dataset) ? void 0 : r.target);) {
                            var n, r;
                            if (!t) return;
                            t = t.parentNode
                        }
                        return [document, document.body].includes(t) ? null : t
                    }
                }, {
                    key: "getParentTarget", value: function (e) {
                        for (e = e.parentNode; "1" !== (null == (t = e) || null == (n = t.dataset) ? void 0 : n.target);) {
                            var t, n;
                            if (!e) return;
                            e = e.parentNode
                        }
                        return [document, document.body].includes(e) ? null : e
                    }
                }, {
                    key: "run", value: function (e, t) {
                        var n = this.getTarget(e);
                        n || (n = {dataset: df});
                        var r = n.dataset, a = r.x, o = r.y, i = n.dataset.id;
                        i === zn.canvas && (a = t.x, o = t.y), this.set({
                            element: n,
                            id: i,
                            type: this.getType(i),
                            name: n.dataset.name,
                            offset: {x: a, y: o}
                        })
                    }
                }, {
                    key: "getType", value: function (e) {
                        return e ? e === df.id ? df.type : this.parent.data.some((function (t) {
                            return t.id === e
                        })) ? zn.element : ml(e).type : null
                    }
                }, {
                    key: "setTargetById", value: function (e) {
                        var t = document.getElementById(e);
                        this.set({element: t, id: e, type: this.getType(e), offset: {x: 0, y: 0}})
                    }
                }, {
                    key: "getTargetElement", value: function () {
                        var e = this.parent.target.id;
                        return this.getElementById(e)
                    }
                }, {
                    key: "getFirstSelectElement", value: function () {
                        var e = this.parent.selectTool.data.selectedCards[0];
                        return e ? this.getElementById(e) : null
                    }
                }, {
                    key: "getTargetCard", value: function () {
                        var e = this.type, t = this.id;
                        if (!t) return null;
                        if (e === zn.element) return this.getElementById(t);
                        var n = ml(t);
                        return this.getElementById(n.element)
                    }
                }]), n
            }(Wr);

            function vf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const hf = function (e) {
                J()(n, e);
                var t = vf(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "isPc", value: function (e) {
                        return !e.touches
                    }
                }, {
                    key: "mousedown", value: function (e) {
                        var t = O(Jd.events.mouseMove.run);
                        cr(document, "mousemove", t), cr(document, "mouseup", (function e(n) {
                            ur(document, "mousemove", t), ur(document, "mouseup", e), Jd.events.mouseUp.run(n)
                        })), Jd.events.mouseDown.run(e)
                    }
                }, {
                    key: "touchstart", value: function (e) {
                        var t = O(Jd.events.mouseMove.run), n = function e(n) {
                            ur(document, "touchmove", t), ur(document, "touchend", e), ur(document, "touchcancel", e), Jd.events.mouseUp.run(n)
                        };
                        cr(document, "touchmove", t), cr(document, "touchend", n), cr(document, "touchcancel", n), Jd.events.mouseDown.run(e)
                    }
                }, {
                    key: "bindEvent", value: function () {
                        cr(document, "touchstart", this.touchstart), cr(document, "mousedown", this.mousedown), window.addEventListener("wheel", Jd.events.wheel.run, {passive: !1}), cr(document, "keydown", Jd.events.keyDown.run), cr(document, "keyup", Jd.events.keyUp.run)
                    }
                }, {
                    key: "unBindEvent", value: function () {
                        ur(document, "touchstart", this.touchstart), ur(document, "mousedown", this.mousedown), window.removeEventListener("wheel", Jd.events.wheel.run), ur(document, "keydown", Jd.events.keyDown.run), ur(document, "keyup", Jd.events.keyUp.run)
                    }
                }]), n
            }(fp);

            function gf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var yf = function (e) {
                J()(n, e);
                var t = gf(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "standardPos", value: function (e, t) {
                        var n = this.parent.transformTool.data, r = n.x, a = n.y, o = n.scale;
                        return {
                            x: (e - $n.left - r) / o,
                            y: (t - $n.top - a) / o,
                            rawX: e - $n.left,
                            rawY: t - $n.top,
                            clientX: e,
                            clientY: t
                        }
                    }
                }, {
                    key: "standReversePos", value: function (e, t) {
                        var n = this.parent.transformTool.data, r = n.x, a = n.y, o = n.scale, i = e * o + r,
                            c = t * o + a;
                        return {rawX: i, rawY: c, clientX: i + $n.left, clientY: c + $n.top}
                    }
                }, {
                    key: "standard", value: function (e) {
                        if (e.type.startsWith("pointer")) return this.standardPos(e.clientX, e.clientY);
                        if (this.parent.eventManagerTool.isPc(e)) return this.standardPos(e.clientX, e.clientY);
                        var t = e.touches;
                        if (!t || 0 === t.length) {
                            var n = this.parent.events.mouseDown.getBehavior(), r = n.prePointX, a = n.prePointY;
                            return this.standardPos(r[0], a[0])
                        }
                        return this.standardPos(t[0].clientX, t[0].clientY)
                    }
                }, {
                    key: "getSinglePosition", value: function (e) {
                        if (this.parent.eventManagerTool.isPc(e)) return {x: e.clientX, y: e.clientY};
                        var t = (e.touches.length > 0 ? e.touches : e.changedTouches)[0] || {clientX: 0, clientY: 0};
                        return {x: t.clientX, y: t.clientY}
                    }
                }, {
                    key: "getOriPosition", value: function (e) {
                        if (this.parent.eventManagerTool.isPc(e)) return {x: e.clientX, y: e.clientY};
                        for (var t = [], n = [], r = e.touches.length > 0 ? e.touches : e.changedTouches, a = 0; a < r.length; a++) {
                            var o = r[a];
                            t.push(o.clientX), n.push(o.clientY)
                        }
                        return {x: t, y: n}
                    }
                }, {
                    key: "isTwoFinger", value: function (e) {
                        return !this.parent.eventManagerTool.isPc(e) && !(e.touches.length < 2)
                    }
                }]), n
            }(fp);
            const Af = yf;
            n(54578);

            function bf(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ef(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? bf(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : bf(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Cf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Of = "left", wf = "center", kf = "right", xf = "top", Sf = "middle", Tf = "bottom",
                Df = "hEquidistance", Pf = "vEquidistance", Rf = function (e, t, n, r, a, o, i, c, u) {
                    J()(s, e);
                    var l = Cf(s);

                    function s(e) {
                        return G()(this, s), l.call(this, e)
                    }

                    return z()(s, [{
                        key: t, value: function (e) {
                            var t = e[0].cfg.pos.x;
                            return e.slice(1).forEach((function (e) {
                                t = Math.min(e.cfg.pos.x, t)
                            })), this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {x: t})
                            }))
                        }
                    }, {
                        key: n, value: function (e) {
                            var t = e[0].cfg.pos, n = t.x, r = t.x + t.width;
                            e.slice(1).forEach((function (e) {
                                var t = e.cfg.pos, a = t.x, o = t.width;
                                n = Math.min(a, n), r = Math.max(a + o, r)
                            }));
                            var a = (n + r) / 2;
                            return this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {x: a - e.width / 2})
                            }))
                        }
                    }, {
                        key: r, value: function (e) {
                            var t = e[0].cfg.pos, n = t.x + t.width;
                            return e.slice(1).forEach((function (e) {
                                var t = e.cfg.pos, r = t.x, a = t.width;
                                n = Math.max(r + a, n)
                            })), this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {x: n - e.width})
                            }))
                        }
                    }, {
                        key: a, value: function (e) {
                            var t = e[0].cfg.pos.y;
                            return e.slice(1).forEach((function (e) {
                                t = Math.min(e.cfg.pos.y, t)
                            })), this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {y: t})
                            }))
                        }
                    }, {
                        key: o, value: function (e) {
                            var t = e[0].cfg.pos, n = t.y, r = t.y + t.height;
                            e.slice(1).forEach((function (e) {
                                var t = e.cfg.pos, a = t.y, o = t.height;
                                n = Math.min(a, n), r = Math.max(a + o, r)
                            }));
                            var a = (n + r) / 2;
                            return this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {y: a - e.height / 2})
                            }))
                        }
                    }, {
                        key: i, value: function (e) {
                            var t = e[0].cfg.pos, n = t.y + t.height;
                            return e.slice(1).forEach((function (e) {
                                var t = e.cfg.pos, r = t.y, a = t.height;
                                n = Math.max(r + a, n)
                            })), this.parent.batchUpdateDataPos(e, (function (e) {
                                return Ef(Ef({}, e), {}, {y: n - e.height})
                            }))
                        }
                    }, {
                        key: c, value: function (e) {
                            if (!(e.length < 3)) {
                                var t = e.slice(0).sort((function (e, t) {
                                    return e.cfg.pos.x - t.cfg.pos.x
                                })), n = t[0].cfg.pos, r = n.x, a = n.x + n.width, o = n.width;
                                t.slice(1).forEach((function (e) {
                                    var t = e.cfg.pos, n = t.x, r = t.width;
                                    a = Math.max(n + r, a), o += r
                                }));
                                var i = Number(((a - r - o) / (t.length - 1)).toFixed(1));
                                return this.parent.batchUpdateDataPos(t.slice(1), (function (e, n, r) {
                                    var a = t[r].cfg.pos, o = a.x, c = a.width;
                                    return Ef(Ef({}, e), {}, {x: o + c + i})
                                }))
                            }
                        }
                    }, {
                        key: u, value: function (e) {
                            if (!(e.length < 3)) {
                                var t = e.slice(0).sort((function (e, t) {
                                    return e.cfg.pos.y - t.cfg.pos.y
                                })), n = t[0].cfg.pos, r = n.y, a = n.y + n.height, o = n.height;
                                t.slice(1).forEach((function (e) {
                                    var t = e.cfg.pos, n = t.y, r = t.height;
                                    a = Math.max(n + r, a), o += r
                                }));
                                var i = Number(((a - r - o) / (t.length - 1)).toFixed(1));
                                return this.parent.batchUpdateDataPos(t.slice(1), (function (e, n, r) {
                                    var a = t[r].cfg.pos, o = a.y, c = a.height;
                                    return Ef(Ef({}, e), {}, {y: o + c + i})
                                }))
                            }
                        }
                    }, {
                        key: "execAlign", value: function (e, t) {
                            var n = this;
                            if (!(t.length < 2)) {
                                var r = this[e], a = this.parent.getDataItems(t);
                                if (a.length > 1 && r) {
                                    var o = r.call(this, a), i = I()(o, 2), c = i[0], u = i[1], l = c.map((function (e, t) {
                                        return n.parent.actionManager.newCardPropsUpdateAction(e, u[t])
                                    }));
                                    this.parent.actionManager.pushGroupAction(l), update()
                                }
                            }
                        }
                    }]), s
                }(fp, Of, wf, kf, xf, Sf, Tf, Df, Pf), Bf = n(66115), If = n.n(Bf);

            function jf(e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = function (e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return Nf(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if ("Map" === n || "Set" === n) return Array.from(e);
                        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Nf(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                        n && (e = n);
                        var r = 0, a = function () {
                        };
                        return {
                            s: a, n: function () {
                                return r >= e.length ? {done: !0} : {done: !1, value: e[r++]}
                            }, e: function (e) {
                                throw e
                            }, f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, i = !0, c = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    }, n: function () {
                        var e = n.next();
                        return i = e.done, e
                    }, e: function (e) {
                        c = !0, o = e
                    }, f: function () {
                        try {
                            i || null == n.return || n.return()
                        } finally {
                            if (c) throw o
                        }
                    }
                }
            }

            function Nf(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                return r
            }

            function Lf(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Qf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Mf = function (e) {
                return null == e || "" === e
            }, Zf = function (e) {
                return (0, U.uniqWith)(e, U.isEqual)
            }, Vf = function (e) {
                return !Mf(e.id) && !Mf(e.scope)
            }, Hf = function (e) {
                J()(i, e);
                var t, n, r, a, o = Qf(i);

                function i(e) {
                    var t;
                    return G()(this, i), t = o.call(this, e), Da.mountStore(If()(t)), t
                }

                return z()(i, [{
                    key: "isVarValue", value: function (e) {
                        return (0, U.isObject)(e) && "id" in e && "scope" in e
                    }
                }, {
                    key: "clear", value: function (e) {
                        if (e) {
                            var t = Fa(e);
                            Da.clear(t)
                        }
                    }
                }, {
                    key: "isVarCard", value: function (e) {
                        return [ip.deviceInputSetVar, ip.deviceGetSetVar, ip.deviceOutput, ip.varChange, ip.varGet, ip.varSetNumber, ip.varSetString].includes(e)
                    }
                }, {
                    key: "walkCardVars", value: function (e, t) {
                        var n = e.props, r = e.type;
                        if (r === ip.deviceInputSetVar) {
                            if (Number.isInteger(n.piid) && Vf(n)) return void t(n, "props", e);
                            if (Number.isInteger(n.eiid) && Array.isArray(n.arguments)) return void n.arguments.forEach((function (n, r) {
                                Number.isInteger(n.piid) && Vf(n) && t(n, "props.arguments.".concat(r), e)
                            }))
                        }
                        if (r === ip.deviceGetSetVar && Number.isInteger(n.piid) && Vf(n)) t(n, "props", e); else {
                            if (r === ip.deviceOutput) {
                                if (Number.isInteger(n.piid) && Vf(n)) return void t(n, "props", e);
                                if (Number.isInteger(n.aiid) && Array.isArray(n.ins)) return void n.ins.forEach((function (n, r) {
                                    Number.isInteger(n.piid) && Vf(n) && t(n, "props.ins.".concat(r), e)
                                }))
                            }
                            if ([ip.varChange, ip.varGet].includes(r) && Vf(n)) t(n, "props", e); else if ([ip.varSetNumber, ip.varSetString].includes(r) && Vf(n)) {
                                t(n, "props", e);
                                var a = n.elements;
                                (void 0 === a ? [] : a).forEach((function (n, r) {
                                    n.type === Aa && Vf(n) && t(n, "props.elements.".concat(r), e)
                                }))
                            }
                        }
                    }
                }, {
                    key: "getBeusedVarsFromCard", value: function (e, t) {
                        var n = [];
                        return this.walkCardVars(e, (function (e) {
                            (function (e) {
                                return t || !ba(e.scope)
                            })(e) && n.push({id: e.id, scope: e.scope})
                        })), Zf(n)
                    }
                }, {
                    key: "getBeusedVarsFromCards", value: function () {
                        var e = this, t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                            n = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).reduce((function (n, r) {
                                return n.concat(e.getBeusedVarsFromCard(r, t))
                            }), []);
                        return Zf(n)
                    }
                }, {
                    key: "getBeusedVarsFromGraph", value: function (e) {
                        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                            n = Jd.graphTool.getGraph(e);
                        return this.getBeusedVarsFromCards(n, t)
                    }
                }, {
                    key: "getGraphRawAvailVars", value: function (e) {
                        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                        if (!e) return [];
                        var n = Fa(e);
                        return !n || ba(n) ? [] : function (e) {
                            return Ua.apply(this, arguments)
                        }(n, t)
                    }
                }, {
                    key: "listAvailVars", value: (a = Fr()(Yr().mark((function e(t) {
                        var n, r, a, o, i, c, u, l = arguments;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    return n = !(l.length > 1 && void 0 !== l[1]) || l[1], e.prev = 1, e.next = 4, this.getGraphRawAvailVars(t, n);
                                case 4:
                                    return r = e.sent, a = I()(r, 2), o = a[0], i = void 0 === o ? [] : o, c = a[1], u = void 0 === c ? [] : c, e.abrupt("return", i.concat(u));
                                case 13:
                                    return e.prev = 13, e.t0 = e.catch(1), e.abrupt("return", []);
                                case 16:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this, [[1, 13]])
                    }))), function (e) {
                        return a.apply(this, arguments)
                    })
                }, {
                    key: "makeVarOptions", value: function (e) {
                        return e.map((function (e) {
                            var t;
                            return {
                                scope: e.scope,
                                type: e.type,
                                label: (null == (t = e.userData) ? void 0 : t.name) || "---",
                                value: e.id
                            }
                        }))
                    }
                }, {
                    key: "makeVarMap", value: function (e) {
                        return e.reduce((function (e, t) {
                            return e[t.value] = t, e
                        }), {})
                    }
                }, {
                    key: "saveUsedVirtualVars", value: function (e) {
                        if (e) {
                            var t = Fa(e), n = this.getBeusedVarsFromGraph(e, !1).map((function (e) {
                                return e.id
                            }));
                            return Da.saveToGateway(t, n)
                        }
                    }
                }, {
                    key: "saveAndClean", value: (r = Fr()(Yr().mark((function e(t) {
                        var n, r, a, o, i, c, u, l;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (t) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 2:
                                    return n = Fa(t), r = this.getBeusedVarsFromGraph(t, !1).map((function (e) {
                                        return e.id
                                    })), e.next = 6, Da.saveToGateway(n, r);
                                case 6:
                                    return a = Da.clearScopeVars(n), e.next = 9, Va(n);
                                case 9:
                                    return o = e.sent, i = o.filter((function (e) {
                                        return !r.includes(e.id)
                                    })), e.next = 13, ja(i);
                                case 13:
                                    return c = e.sent, u = I()(c, 1), l = u[0], Jd.actionManager.pushVarCleanAction(a.concat(l)), e.abrupt("return", {
                                        removedVirtualVars: a,
                                        removedRemoteVars: l,
                                        removedCount: a.length + l.length
                                    });
                                case 18:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this)
                    }))), function (e) {
                        return r.apply(this, arguments)
                    })
                }, {
                    key: "copyVarToTargetGraph", value: (n = Fr()(Yr().mark((function e(t, n) {
                        var r, a, o, i, c, l, s, p, f, d, m;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (r = t.id, a = t.scope, !(Mf(r) || Mf(a) || Mf(n))) {
                                        e.next = 3;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 3:
                                    return o = Fa(n), e.prev = 4, e.next = 7, Ga({id: r, scope: a}, !0);
                                case 7:
                                    if (i = e.sent) {
                                        e.next = 10;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 10:
                                    if (c = i.type, l = i.userData, s = (void 0 === l ? {} : l).name) {
                                        e.next = 14;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 14:
                                    return e.next = 16, this.listAvailVars(n, !1);
                                case 16:
                                    for (p = e.sent, f = p.map((function (e) {
                                        var t;
                                        return null == (t = e.userData) ? void 0 : t.name
                                    })).filter(Boolean), d = s, m = 1; f.includes(d);) d = "".concat(s, "(").concat(m, ")"), m += 1;
                                    return e.abrupt("return", Da.createVar({scope: o, type: c, name: d, id: r}));
                                case 24:
                                    e.prev = 24, e.t0 = e.catch(4), u(e.t0);
                                case 27:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this, [[4, 24]])
                    }))), function (e, t) {
                        return n.apply(this, arguments)
                    })
                }, {
                    key: "updateCardsVarScope", value: function (e, t) {
                        var n = this;
                        e = Array.isArray(e) ? e : [e];
                        return e.forEach((function (e) {
                            n.walkCardVars(e, (function (e) {
                                (function (e) {
                                    return !ba(e.scope)
                                })(e) && (e.scope = t)
                            })), e.props = function (e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? Lf(Object(n), !0).forEach((function (t) {
                                        H()(e, t, n[t])
                                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Lf(Object(n)).forEach((function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    }))
                                }
                                return e
                            }({}, e.props)
                        })), e
                    }
                }, {
                    key: "copyCardsVars", value: (t = Fr()(Yr().mark((function e(t, n, r) {
                        var a, o, i, c, u, l, s, p;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (t !== n) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return", r);
                                case 2:
                                    return a = this.getBeusedVarsFromCards(r, !1), e.next = 5, this.listAvailVars(n, !1);
                                case 5:
                                    o = e.sent, i = o.reduce((function (e, t) {
                                        return e[t.id] = t, e
                                    }), {}), c = Fa(n), u = new Set, l = jf(a), e.prev = 10, l.s();
                                case 12:
                                    if ((s = l.n()).done) {
                                        e.next = 22;
                                        break
                                    }
                                    if (p = s.value, !u.has(p.id) && !i[p.id]) {
                                        e.next = 16;
                                        break
                                    }
                                    return e.abrupt("continue", 20);
                                case 16:
                                    return e.next = 18, this.copyVarToTargetGraph(p, n);
                                case 18:
                                    e.sent && u.add(p.id);
                                case 20:
                                    e.next = 12;
                                    break;
                                case 22:
                                    e.next = 27;
                                    break;
                                case 24:
                                    e.prev = 24, e.t0 = e.catch(10), l.e(e.t0);
                                case 27:
                                    return e.prev = 27, l.f(), e.finish(27);
                                case 30:
                                    return e.abrupt("return", this.updateCardsVarScope(r, c));
                                case 31:
                                case"end":
                                    return e.stop()
                            }
                        }), e, this, [[10, 24, 27, 30]])
                    }))), function (e, n, r) {
                        return t.apply(this, arguments)
                    })
                }]), i
            }(fp);
            n(67565), n(73508);

            function Ff(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Gf(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ff(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ff(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Yf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var zf = function (e) {
                J()(n, e);
                var t = Yf(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        this.parent.target.run(e, "mousedown"), this.parent.target.id && (this.parent.elements.nop.unActive(), this.workLoop(e, ki))
                    }
                }, {
                    key: "default", value: function () {
                        var e = this.parent.selectTool, t = e.data, n = t.multiple, r = t.multipleLog;
                        n || r || e.clear(), Ri(Ti.CONNECTING_LINE, He), update()
                    }
                }, {
                    key: "form", value: function () {
                        var e = this.parent.target.getParentTarget(this.parent.target.element),
                            t = this.getElementById(e.dataset.id);
                        t && (-1 === this.parent.selectTool.data.selectedCards.indexOf(t.id) && this.parent.selectTool.set({selectedCards: [t.id]}))
                    }
                }, {
                    key: "log", value: function (e) {
                        this.parent.rootCursor("pointer"), Ri(Ti.LOG_BAR_UPDATE, e), Ri(Ti.LOG_BAR_CLICK, !0)
                    }
                }, {
                    key: "multiSelectPointer", value: function () {
                        var e = ml(this.parent.target.id).element;
                        this.parent.selectTool.toggleMultiSelect(e), Ri(Ti.RIGHT_KEY_MENU, !1)
                    }
                }, {
                    key: "multiSelectPointerLine", value: function () {
                        var e = this.parent.target.id;
                        if (e.includes("multiSelectPointerLine")) {
                            var t = e.split("."), n = t.slice(1, t.length - 1).join(".");
                            this.parent.selectTool.toggleMultiSelectLine(n)
                        } else this.parent.selectTool.toggleMultiSelectLine(e)
                    }
                }, {
                    key: "element", value: function (e, t) {
                        var n = this.parent, r = n.graphTool, a = n.selectTool, o = n.target, i = n.settings,
                            c = o.offset, u = o.id;
                        a.data.selectedCards.includes(u) && this.setTwiceTime(e), i.contentEditable !== u && (e.isMultipleSelect ? a.multiSelect() : a.singleSelect(), Ri(Ti.RIGHT_KEY_MENU, !1), o.offset = {
                            x: t.x - c.x,
                            y: t.y - c.y
                        }, a.data.selectedLines = [], r.lockMoveCopy(!1), update())
                    }
                }, {
                    key: "toolbox", value: function (e, t) {
                        var n = ml(this.parent.target.id), r = n.connect, a = n.element,
                            o = this.parent.settings.contentEditable, i = this.parent.elements.nop.instance[o];
                        if (!i) return null;
                        var c = g((function () {
                            return i.getFormat()
                        }), {}), u = this.getElementById(o), l = this.parent.elements.nop.toolBar2;
                        switch (r) {
                            case Mn.BOLD:
                                this.parent.elements.nop.format(Mn.BOLD, !c.bold, o);
                                break;
                            case Mn.LIST:
                                this.parent.elements.nop.format(Mn.LIST, Yn, o);
                                break;
                            case Mn.COLOR:
                                var s = this.parent.updateDataCfg(u, (function (e) {
                                    return Gf(Gf({}, e), {}, {background: a})
                                })), p = I()(s, 2), f = p[0], d = p[1];
                                this.parent.actionManager.pushNopUpdateAction(f, d);
                                break;
                            case Mn.ALIGN:
                                e.stopPropagation(), this.parent.elements.nop.format(Mn.ALIGN, a, o);
                                break;
                            case Mn.HEADER:
                                this.parent.elements.nop.format(Mn.HEADER, a, o);
                                break;
                            case Mn.SHOW:
                                l === Mn.NONE || l !== a ? this.parent.elements.nop.toolBar2 = a : this.parent.elements.nop.toolBar2 = Mn.NONE
                        }
                    }
                }, {
                    key: "mask", value: function (e, t) {
                        Ri(Ti.RIGHT_KEY_MENU, !1);
                        var n = this.parent.events.mouseDown.getKeyBehavior().currentDownKeyCode;
                        this.parent.selectTool.data.multipleLog || this.parent.selectTool.data.multiple || -1 !== [i.Shift, i.Ctrl, i.Command].indexOf(n) || this.parent.selectTool.clear(), this.parent.elements.nop.unActive(), Ri(Ti.CONNECTING_LINE, He);
                        var r = t.x, a = t.y;
                        Ri(Ti.MASK_UPDATE, {x1: r, x2: r, y1: a, y2: a, visible: !1})
                    }
                }, {
                    key: "connect", value: function (e, t) {
                        var n, r = this.parent.target.id, a = this.parent.target.element, o = null;
                        if ("1" !== a.dataset.disabled) {
                            if (this.parent.data.forEach((function (e) {
                                Object.keys(e.outputs).forEach((function (t) {
                                    e.outputs[t].forEach((function (n) {
                                        r.endsWith(n) && (o = {outputKey: t, id: e.id, item: e, outputId: n})
                                    }))
                                }))
                            })), o) return this.parent.connectTool.disconnect(o, t), void (this.parent.selectTool.data.selectedLines = []);
                            (null == a || null == (n = a.dataset) ? void 0 : n.io) === Qe.output && Ri(Ti.CONNECTING_LINE, Me)
                        }
                    }
                }, {
                    key: "connect2", value: function (e, t) {
                        var n = this.parent.target, r = n.element, a = n.offset;
                        this.parent.target.offset = {x: t.x - a.x, y: t.y - a.y}, r.style.stroke = "blue"
                    }
                }, {
                    key: "connect3", value: function (e, t) {
                        this.parent.selectTool.set({selectedCards: [], selectedLines: [this.parent.target.id]})
                    }
                }, {
                    key: "scrollBarX", value: function (e, t) {
                        var n = this.parent.transformTool.getViewBox();
                        this.parent.target.offset.x = n.startX, this.parent.boundaryTool.updateBoundData()
                    }
                }, {
                    key: "scrollBarY", value: function (e, t) {
                        var n = this.parent.transformTool.getViewBox();
                        this.parent.target.offset.y = n.startY, this.parent.boundaryTool.updateBoundData()
                    }
                }]), n
            }(Ii);

            function Uf() {
                var e = Jd.graphTool.containerSize, t = Jd.boundaryTool.data, n = t.minX, r = t.maxX,
                    a = Jd.transformTool.data, o = a.scale, i = a.x;
                return {left: n * o + i, right: r * o + i - e.width}
            }

            function qf() {
                var e = Jd.graphTool.containerSize, t = Jd.boundaryTool.data, n = t.minY, r = t.maxY,
                    a = Jd.transformTool.data, o = a.scale, i = a.y;
                return {top: n * o + i, bottom: r * o + i - e.height}
            }

            function Xf(e, t, n, r) {
                var a, o, i = Jd.transformTool.data.scale;
                if (e > 0 && t < 0) return null;
                if (e < 0) if (t < 0) {
                    a = 1 - (o = r / (n * i + Math.abs(t)))
                } else {
                    var c = n * i;
                    a = -e / c, o = r / c
                } else if (e > 0) {
                    if (!(t > 0)) return null;
                    a = 0, o = r / (n * i + e)
                }
                return {barStart: a, barSize: o, startGap: e, endGap: t}
            }

            function Kf() {
                var e = Jd.boundaryTool.data.width, t = Jd.graphTool.containerSize.width, n = Uf();
                return Xf(n.left, n.right, e, t)
            }

            function Wf() {
                var e = Jd.boundaryTool.data.height, t = Jd.graphTool.containerSize.height, n = qf();
                return Xf(n.top, n.bottom, e, t)
            }

            function Jf(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var _f = function (e) {
                J()(n, e);
                var t = Jf(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        this.parent.target.type && this.workLoop(e, xi)
                    }
                }, {
                    key: "log", value: function (e) {
                        Ri(Ti.LOG_BAR_UPDATE, e)
                    }
                }, {
                    key: "element", value: function (e, t) {
                        var n = this.parent, r = n.selectTool, a = n.graphTool, o = n.transformTool, i = n.target,
                            c = n.events, u = n.boundaryTool;
                        if (0 !== r.data.selectedCards.length) {
                            if (d(e) && !a.lockMoveCopy()) {
                                a.lockMoveCopy(!0), i.id = dl(i.id).copy(), c.mouseUp.commonCopy();
                                var l = ml(i.id), s = Ur(this.parent.data, l.element);
                                c.mouseUp.paste(e, {x: s.cfg.pos.x, y: s.cfg.pos.y})
                            }
                            var p = this.getBehavior(), f = o.data.scale;
                            Xr(this.parent.data, r.data.selectedCards, {x: p.dx / f, y: p.dy / f}), u.updateBoundData()
                        }
                    }
                }, {
                    key: "mask", value: function (e, t) {
                        this.getKeyBehavior().currentDownKeyCode !== i.Space ? this.parent.eventManagerTool.isPc(e) ? e.buttons === Ci.left && Ri(Ti.MASK_UPDATE, {
                            x2: t.x,
                            y2: t.y,
                            visible: !0
                        }) : this.gestureCanvas(e, t) : this.moveCanvas(e)
                    }
                }, {
                    key: "moveCanvas", value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                            n = this.parent.transformTool, r = t || this.getBehavior(e);
                        this.parent.transformTool.transform({x: n.data.x + r.dx, y: n.data.y + r.dy})
                    }
                }, {
                    key: "gestureCanvas", value: function (e, t) {
                        var n = this.parent.transformTool, r = this.getBehavior(e);
                        if (1 !== e.touches.length) {
                            if (2 === e.touches.length) if (r.isTwoFingerMove) this.moveCanvas(e, r); else {
                                var a = e.touches[0], o = e.touches[1];
                                n.scaleCanvasAtPoint({
                                    x: (a.clientX + o.clientX) / 2,
                                    y: (a.clientY + o.clientY) / 2
                                }, r.ds)
                            }
                        } else this.moveCanvas(e, r)
                    }
                }, {
                    key: "connect", value: function (e, t) {
                        var n, r = this.parent.target.element;
                        "1" !== r.dataset.disabled && (null == r || null == (n = r.dataset) ? void 0 : n.io) === Qe.output && Ri(Ti.CONNECTING_LINE, Ve)
                    }
                }, {
                    key: "connect2", value: function (e, t) {
                        var n = this.parent.target.offset;
                        Ri(Ti.CONNECTING_LINE, Ze, {
                            x: t.x - n.x,
                            y: t.y - n.y
                        }), this.parent.connectTool.setActivePoint(t)
                    }
                }, {
                    key: "scrollBarX", value: function (e, t) {
                        var n, r = this.parent.transformTool, a = {left: (n = Uf()).left < 0, right: n.right > 0},
                            o = this.getBehavior(e);
                        if (o.dx > 0 && a.right || o.dx < 0 && a.left) {
                            var i = Kf(), c = i.barSize, u = i.startGap, l = i.endGap;
                            r.data.x -= o.dx / c * (u / l > 0 ? 1 / c : 1)
                        }
                    }
                }, {
                    key: "scrollBarY", value: function (e, t) {
                        var n, r = this.parent.transformTool, a = {top: (n = qf()).top < 0, bottom: n.bottom > 0},
                            o = this.getBehavior(e);
                        if (o.dy > 0 && a.bottom || o.dy < 0 && a.top) {
                            var i = Wf(), c = i.barSize, u = i.startGap, l = i.endGap;
                            r.data.y -= o.dy / c * (u / l > 0 ? 1 / c : 1)
                        }
                    }
                }]), n
            }(Ii);

            function $f(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ed(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? $f(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $f(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function td(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var nd = function (e) {
                J()(n, e);
                var t = td(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        Jd.buttons = -1, Jd.rootCursor(), this.workLoop(e, Si)
                    }
                }, {
                    key: "log", value: function () {
                        Ri(Ti.LOG_BAR_CLICK, !1)
                    }
                }, {
                    key: "commonCopy", value: function () {
                        var e = Jd.selectTool.data.selectedCards;
                        if (!(e.length < 1)) {
                            var t = ml(Jd.target.id).element, n = function (e) {
                                var t = e.getBoundingClientRect(),
                                    n = window.pageYOffset || document.documentElement.scrollTop,
                                    r = window.pageXOffset || document.documentElement.scrollLeft,
                                    a = document.documentElement.clientTop || 0,
                                    o = document.documentElement.clientLeft || 0;
                                return {top: t.top + n - a, left: t.left + r - o}
                            }(document.getElementById(t));
                            Jd.graphTool.copyData = {
                                graphId: Jd.graphTool.id,
                                target: t,
                                elements: a()(e),
                                edgeOffsets: n
                            }, Ri(Ti.RIGHT_KEY_MENU, !1)
                        }
                    }
                }, {
                    key: "copy", value: function () {
                        this.commonCopy(), oo.success("已复制")
                    }
                }, {
                    key: "paste", value: function (e, t) {
                        var n = Jd.rightKeyDownPos || t;
                        Ri(Ti.RIGHT_KEY_MENU, !1);
                        var r = [], a = [], o = [], i = Jd.graphTool, c = i.copyData, u = this.getStore();
                        if (u && c) {
                            var l = Ur(u, c.target);
                            if (l) {
                                var s = l.cfg.pos;
                                u.forEach((function (e, t) {
                                    if (c.elements.includes(e.id)) {
                                        var i = (0, U.cloneDeep)(sp[e.type]), u = function (e) {
                                            for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = !0, r = (new Date).getTime() + t; n;) {
                                                if (!Jd.data.some((function (t) {
                                                    return t.id === "".concat(e).concat(r)
                                                }))) {
                                                    n = !1;
                                                    break
                                                }
                                                r++
                                            }
                                            return "".concat(e).concat(r)
                                        }(e.type, t);
                                        a.push(e.id), o.push(u), c.target === e.id && Jd.target.set({
                                            element: document.getElementById(u),
                                            id: u,
                                            type: Jd.target.type,
                                            offset: Jd.target.offset
                                        }), r.push({
                                            id: u,
                                            cfg: ed(ed({}, e.cfg), {}, {
                                                pos: ed(ed({}, e.cfg.pos), {}, {
                                                    x: n.x + e.cfg.pos.x - s.x,
                                                    y: n.y + e.cfg.pos.y - s.y
                                                })
                                            }),
                                            type: i.type,
                                            inputs: (0, U.cloneDeep)(e.inputs),
                                            outputs: (0, U.cloneDeep)(e.outputs),
                                            props: (0, U.cloneDeep)(e.props)
                                        })
                                    }
                                })), r.forEach((function (e) {
                                    Object.keys(e.outputs).forEach((function (t) {
                                        e.outputs[t].forEach((function (n, r) {
                                            var i = n.replace(/\.\w+/, ""), c = a.indexOf(i);
                                            e.outputs[t][r] = -1 === c ? "" : e.outputs[t][r].replace(a[c], o[c])
                                        })), e.outputs[t] = e.outputs[t].filter(Boolean)
                                    }))
                                })), Jd.varTool.copyCardsVars(c.graphId, i.id, r).then((function (e) {
                                    Jd.appendDataItems(e), Jd.graphTool.copyData = null;
                                    var t = Jd.selectTool.set({
                                        selectedCards: e.map((function (e) {
                                            return e.id
                                        }))
                                    }, !1), n = e.map((function (e) {
                                        return Jd.actionManager.newCardAddAction(e)
                                    }));
                                    t && n.push(t), Jd.actionManager.pushGroupAction(n), Jd.selectTool.data.selectedCards = e.map((function (e) {
                                        return e.id
                                    })), update()
                                }))
                            }
                        }
                    }
                }, {
                    key: "copyAndPaste", value: function (e, t) {
                        var n = t.x, r = t.y, o = Jd.selectTool.data.selectedCards;
                        Jd.graphTool.copyData = {
                            graphId: Jd.graphTool.id,
                            target: o[0],
                            elements: a()(o)
                        }, Jd.selectTool.pasteBySelectedCard(e, {
                            x: n,
                            y: r
                        }), Jd.selectTool.data.multiple = !1, update()
                    }
                }, {
                    key: "multiSelectMenu", value: function (e, t) {
                        var n = Jd.selectTool.data.multiple;
                        Jd.selectTool.data.multiple = !n, Jd.selectTool.data.multiple && Jd.selectTool.data.multipleLog && (Jd.selectTool.data.multipleLog = !1, update()), Jd.actionManager.pushCardSelectMultipleAction(n, !n), Ri(Ti.RIGHT_KEY_MENU, !1)
                    }
                }, {
                    key: "delete", value: function () {
                        Jd.events.keyDown.deleteKeyDown(), Ri(Ti.RIGHT_KEY_MENU, !1)
                    }
                }, {
                    key: "align", value: function () {
                        var e = Jd.alignTool, t = Jd.target, n = Jd.selectTool, r = ml(t.id), a = n.data.selectedCards;
                        e.execAlign(r.element, a), Ri(Ti.RIGHT_KEY_MENU, !1), update()
                    }
                }, {
                    key: "simplify", value: function () {
                        var e = Jd.target.getTargetCard(), t = Jd.selectTool.data.selectedCards;
                        if (e && !(t.length < 1)) {
                            var n = Jd.getDataItems(t);
                            n = n.filter((function (e) {
                                return e.type !== sp.nop.type
                            }));
                            var r = e.cfg.simplified;
                            try {
                                r || n.forEach((function (e) {
                                    var t = Jd.nodeCheckTool.run(e);
                                    if (t) throw new Error(Jd.nodeCheckTool.getFirstErrorMessage(t) || "卡片配置有误")
                                }));
                                var a = Jd.batchUpdateDataCfg(n, (function (e) {
                                    return ed(ed({}, e), {}, {simplified: !r})
                                })), o = I()(a, 2), i = o[0], c = o[1], u = i.map((function (e, t) {
                                    return Jd.actionManager.newCardPropsUpdateAction(e, c[t])
                                }));
                                Jd.actionManager.pushGroupAction(u)
                            } catch (l) {
                                oo.error(l.message)
                            } finally {
                                Ri(Ti.RIGHT_KEY_MENU, !1), update()
                            }
                        }
                    }
                }, {
                    key: "element", value: function (e, t) {
                        var n = this.getBehavior(), r = this.getElementById(Jd.target.id);
                        if (n.isClick) {
                            var o;
                            this.checkTwiceClick(e) && (null == (o = Jd.data.find((function (e) {
                                return e.id === Jd.target.id
                            }))) ? void 0 : o.type) === sp.nop.type && Jd.elements.nop.active(Jd.target.id)
                        } else {
                            var i, c;
                            (null == r ? void 0 : r.id) && (i = r.id, c = [], Jd.data.forEach((function (e) {
                                Object.keys(e.outputs).forEach((function (t) {
                                    var n = e.outputs[t].find((function (e) {
                                        var t;
                                        return (null == e || null == (t = e.split(".")) ? void 0 : t[0]) === i
                                    }));
                                    if (n) {
                                        var r, a,
                                            o = "".concat(zn.connect).concat(fl).concat(e.id).concat(fl).concat(t),
                                            u = "".concat(zn.connect).concat(fl).concat(n),
                                            l = null == (r = document.getElementById(o)) ? void 0 : r.dataset,
                                            s = null == (a = document.getElementById(u)) ? void 0 : a.dataset;
                                        if (!l || !s) return;
                                        var p = parseFloat(l.y), f = parseFloat(s.y) - p;
                                        Math.abs(f) < 9 && c.push(f)
                                    }
                                })), Object.keys(r.outputs).forEach((function (t) {
                                    var n = r.outputs[t].find((function (t) {
                                        var n;
                                        return (null == t || null == (n = t.split(".")) ? void 0 : n[0]) === e.id
                                    }));
                                    if (n) {
                                        var a, o,
                                            i = "".concat(zn.connect).concat(fl).concat(r.id).concat(fl).concat(t),
                                            u = "".concat(zn.connect).concat(fl).concat(n),
                                            l = null == (a = document.getElementById(i)) ? void 0 : a.dataset,
                                            s = null == (o = document.getElementById(u)) ? void 0 : o.dataset;
                                        if (!l || !s) return;
                                        var p = parseFloat(l.y) - parseFloat(s.y);
                                        Math.abs(p) < 9 && c.push(p)
                                    }
                                }))
                            })), c.length > 0 && (r.cfg.pos.y -= Math.min.apply(Math, c)));
                            var u = Jd.selectTool.data.selectedCards;
                            Jd.data.forEach((function (e) {
                                u.includes(e.id) && (e.cfg.pos = ed({}, e.cfg.pos))
                            })), setTimeout((function () {
                                if (null != r && r.id && (0 !== n.disX || 0 !== n.disY)) {
                                    var e = Jd.transformTool.data.scale;
                                    Jd.actionManager.pushCardMoveAction({
                                        cards: a()(Jd.selectTool.data.selectedCards),
                                        dis: {x: n.disX / e, y: n.disY / e}
                                    })
                                }
                                update()
                            }), 0)
                        }
                    }
                }, {
                    key: "mask", value: function (e, t) {
                        if (Jd.eventManagerTool.isPc(e)) {
                            var n = t.x, r = t.y;
                            Ri(Ti.MASK_UPDATE, {x1: n, y1: r, x2: n, y2: r, visible: !1})
                        }
                    }
                }, {
                    key: "connect2", value: function (e, t) {
                        Ri(Ti.CONNECTING_LINE, He), Jd.connectTool.connect()
                    }
                }, {
                    key: "addAction", value: function (e) {
                        var t = ml(Jd.target.id);
                        Jd.selectTool.singleSelect(t.element);
                        var n = this.getElementById(t.element), r = (0, U.cloneDeep)(n),
                            o = Object.keys(n.inputs).map((function (e) {
                                return parseInt(e.replace("input", ""))
                            })), i = Math.max.apply(Math, a()(o));
                        n.inputs["".concat(t.connect).concat(i + 1)] = null, n.inputs = ed({}, n.inputs), Jd.sizeTool.run(n), Jd.actionManager.pushCardPropsUpdateAction(r, (0, U.cloneDeep)(n)), update()
                    }
                }, {
                    key: "removeAction", value: function (e) {
                        var t = ml(Jd.target.id);
                        Jd.selectTool.singleSelect(t.element);
                        var n, r, a, o = this.getElementById(t.element), i = o.inputs, c = function (e, t) {
                                var n, r = Cl(e);
                                try {
                                    for (r.s(); !(n = r.n()).done;) for (var a = n.value, o = Object.keys(a.outputs), i = 0, c = o; i < c.length; i++) {
                                        var u = c[i];
                                        if (a.outputs[u].includes("".concat(t.element, ".").concat(t.connect))) return a
                                    }
                                } catch (l) {
                                    r.e(l)
                                } finally {
                                    r.f()
                                }
                                return null
                            }(Jd.data, t), u = Jd.actionManager.newCardPropsUpdateAction(),
                            l = Jd.actionManager.newCardPropsUpdateAction();
                        l.setPrevCard((0, U.cloneDeep)(c)), u.setPrevCard((0, U.cloneDeep)(o)), Jd.actionManager.pushGroupAction([u, l]), n = Jd.data, r = t.element, a = t.connect, n.forEach((function (e) {
                            Object.keys(e.outputs).forEach((function (t) {
                                e.outputs[t] = e.outputs[t].filter((function (e) {
                                    return e !== vl({id: r, key: a})
                                }))
                            }))
                        })), delete i[t.connect], o.inputs = ed({}, o.inputs), Jd.sizeTool.run(o), o.props = ed({}, o.props), u.setNewCard((0, U.cloneDeep)(o)), l.setNewCard((0, U.cloneDeep)(c)), update(), setTimeout((function () {
                            update()
                        }), 0)
                    }
                }, {
                    key: "addMode", value: function (e) {
                        var t = ml(Jd.target.id);
                        Jd.selectTool.singleSelect(t.element);
                        var n = this.getElementById(t.element), r = (0, U.cloneDeep)(n),
                            a = Object.keys(n.outputs).length;
                        n.outputs["".concat(t.connect).concat(a)] = [], n.outputs = ed({}, n.outputs), Jd.sizeTool.run(n), Jd.actionManager.pushCardPropsUpdateAction(r, (0, U.cloneDeep)(n)), update()
                    }
                }, {
                    key: "replace", value: function () {
                        var e, t = Jd.target.getTargetCard(), n = Jd.gateway;
                        n.data.modalVisible = !0, n.data.deviceType = t.type, n.data.pos = {
                            x: t.cfg.pos.x,
                            y: t.cfg.pos.y
                        }, Jd.settings.replaceDeviceCardId = t.id, "替换设备" === (null == (e = Jd.target.element) ? void 0 : e.innerText) ? (Jd.gateway.data.isTiHuan = !0, Jd.gateway.data.targetCard = Jd.target.getTargetCard()) : (Jd.gateway.data.isTiHuan = !1, Jd.gateway.data.targetCard = null)
                    }
                }, {
                    key: "removeMode", value: function (e) {
                        var t = ml(Jd.target.id);
                        Jd.selectTool.singleSelect(t.element);
                        var n = this.getElementById(t.element), r = (0, U.cloneDeep)(n);
                        delete n.outputs[t.connect];
                        var o = 0;
                        n.outputs = Object.values(n.outputs).reduce((function (e, t) {
                            return e["output".concat(o++)] = a()(t), e
                        }), {}), Jd.sizeTool.run(n), Jd.actionManager.pushCardPropsUpdateAction(r, (0, U.cloneDeep)(n)), setTimeout((function () {
                            update()
                        }), 0)
                    }
                }, {
                    key: "control", value: function () {
                    }
                }]), n
            }(Ii);

            function rd(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var ad = [zn.cardBox, zn.toolbar];
            const od = function (e) {
                J()(n, e);
                var t = rd(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        var t;
                        d(e) && e.preventDefault();
                        var n = this.parent.target.getTarget(e),
                            r = null == n || null == (t = n.dataset) ? void 0 : t.id;
                        n && r && !ad.some((function (e) {
                            return r.startsWith(e)
                        })) && (this.parent.lockScroll() && !d(e) || this.parent.transformTool.run(e))
                    }
                }]), n
            }(Ii);

            function id(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var cd = function (e) {
                J()(n, e);
                var t = id(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e, t) {
                        if (!Jd.lockScroll() && !window.editor.eventsDisable) {
                            var n, r = e.keyCode;
                            this.keyWorkLoop(e, "down"), d(e) ? m(e) ? this.alignKeyDown(e, r) : this.ctrlKeyDown(e, r) : [i.ArrowDown, i.ArrowLeft, i.ArrowRight, i.ArrowUp].includes(r) ? this.dirKeyDown(e, r) : (n = r, [i.Delete, i.Backspace].includes(n) && document.activeElement === document.body && this.deleteKeyDown())
                        }
                    }
                }, {
                    key: "deleteKeyDown", value: function () {
                        var e = this, t = this.parent.selectTool.data, n = t.selectedCards, r = t.selectedLines,
                            a = this.parent.getDataItems(n);
                        if (a.length > 0) {
                            var o = [];
                            o.push(this.parent.actionManager.newCardRemoveAction(a)), o.push(this.parent.selectTool.clear(!1)), this.parent.actionManager.pushGroupAction(o), this.parent.removeDataItems(n)
                        }
                        if (r.length > 0) {
                            var i = [];
                            r.forEach((function (t) {
                                var n = xl(e.parent.data, t), r = I()(n, 2), a = r[0], o = r[1];
                                a && i.push(e.parent.actionManager.newCardPropsUpdateAction(a, o))
                            })), this.parent.selectTool.clear(!1), this.parent.actionManager.pushGroupAction(i)
                        }
                        update()
                    }
                }, {
                    key: "ctrlKeyDown", value: function (e, t) {
                        var n = this.parent, r = n.graphTool, a = n.transformTool;
                        if (t === i.Plus && (a.scaleCanvasAtPoint(r.centerPoint, 4 / 3), e.preventDefault()), t === i.Minus && (a.scaleCanvasAtPoint(r.centerPoint, 3 / 4), e.preventDefault()), t !== i.Num_0 && t !== i.Numpad_0 || (a.scaleCanvasAtPoint(r.centerPoint, 1, 1), e.preventDefault()), t === i.Char_A) {
                            if (window.editor.eventsDisable) return;
                            this.parent.selectTool.set({
                                selectedCards: this.parent.data.map((function (e) {
                                    return e.id
                                }))
                            }), update()
                        }
                        if (t === i.Char_C && !document.getSelection().toString()) {
                            var o = this.parent.selectTool.data.selectedCards;
                            if (0 === o.length) return;
                            this.parent.target.id = dl(o[0]).copy(), this.parent.events.mouseUp.copy(), e.preventDefault()
                        }
                        t === i.Char_S && (this.parent.graphTool.save(), e.preventDefault()), t === i.Char_V && (this.parent.selectTool.pasteBySelectedCard(), update()), t !== i.Char_Z || v(e) || (e.preventDefault(), this.parent.actionManager.runBackward()), (t === i.Char_Y || t === i.Char_Z && v(e)) && (e.preventDefault(), this.parent.actionManager.runForward())
                    }
                }, {
                    key: "dirKeyDown", value: function (e, t) {
                        var n = this, r = this.parent.selectTool.data.selectedCards;
                        if (0 !== r.length) {
                            e.preventDefault();
                            var a = function (e) {
                                var t = e.x, a = void 0 === t ? 0 : t, o = e.y, i = void 0 === o ? 0 : o;
                                r.forEach((function (e) {
                                    var t = n.getElementById(e);
                                    t && qr(t, {x: t.cfg.pos.x + a, y: t.cfg.pos.y + i})
                                }))
                            };
                            t === i.ArrowLeft && a({x: -3, y: 0}), t === i.ArrowUp && a({
                                x: 0,
                                y: -3
                            }), t === i.ArrowRight && a({x: 3, y: 0}), t === i.ArrowDown && a({
                                x: 0,
                                y: 3
                            }), update(), setTimeout((function () {
                                update()
                            }), 0)
                        }
                    }
                }, {
                    key: "alignKeyDown", value: function (e, t) {
                        if (d(e) && m(e)) {
                            e.preventDefault();
                            var n = this.parent, r = n.alignTool, a = n.selectTool.data.selectedCards,
                                o = H()(H()(H()(H()(H()(H()(H()(H()({}, i.Char_L, Of), i.Char_C, wf), i.Char_R, kf), i.Char_T, xf), i.Char_M, Sf), i.Char_B, Tf), i.Char_H, Df), i.Char_V, Pf);
                            r.execAlign(o[t], a)
                        }
                    }
                }]), n
            }(Ii);
            const ud = cd;

            function ld(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            const sd = function (e) {
                J()(n, e);
                var t = ld(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        this.keyWorkLoop(e, "up")
                    }
                }]), n
            }(Ii);

            function pd(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var fd = function (e) {
                J()(n, e);
                var t = pd(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        var t = Jd.target.type, n = Jd.coordinateTool.standard(e);
                        t && this[t] && (this[t](e, n), update())
                    }
                }, {
                    key: "element", value: function (e, t) {
                        if (Jd.selectTool.singleSelect(), !Jd.target.getTargetCard()) return null;
                        Ri(Ti.RIGHT_KEY_MENU, !0, zn.element, t)
                    }
                }, {
                    key: "mask", value: function (e, t) {
                        Ri(Ti.RIGHT_KEY_MENU, !0, zn.mask, t)
                    }
                }, {
                    key: "connect3", value: function (e, t) {
                        Jd.selectTool.set({
                            selectedLines: [Jd.target.id],
                            selectedCards: []
                        }), Jd.events.mouseDown.connect3(e, t), Ri(Ti.RIGHT_KEY_MENU, !0, zn.connect3, t)
                    }
                }]), n
            }(Ii);

            function dd(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var md = function (e) {
                J()(n, e);
                var t = dd(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e, t) {
                        var n = this.parent.target.type;
                        n && this[n] && this[n](e, t), update()
                    }
                }]), n
            }(Ii);

            function vd(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var hd = function (e) {
                J()(n, e);
                var t = vd(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e, t) {
                        var n = this.parent.target.type;
                        n && (this[n] && (n && this[n](e, t), update()), this.parent.events.mouseUp[n] && (this.parent.events.mouseUp[n](e, t), update()))
                    }
                }]), n
            }(Ii);

            function gd(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var yd = function (e) {
                J()(n, e);
                var t = gd(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        var t = this.parent.target.type, n = this.parent.coordinateTool.standard(e);
                        t && this[t] && this[t](e, n), update()
                    }
                }]), n
            }(Ii);

            function Ad(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var bd = function (e) {
                J()(n, e);
                var t = Ad(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e) {
                        var t = this.parent.target.type, n = this.parent.coordinateTool.standard(e);
                        t && this[t] && this[t](e, n), update()
                    }
                }, {
                    key: "mask", value: function (e, t) {
                        this.parent.events.mouseMove.moveCanvas(e)
                    }
                }]), n
            }(Ii);

            function Ed(e) {
                var t = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                        }))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = te()(e);
                    if (t) {
                        var a = te()(this).constructor;
                        n = Reflect.construct(r, arguments, a)
                    } else n = r.apply(this, arguments);
                    return $()(this, n)
                }
            }

            var Cd = function (e) {
                J()(n, e);
                var t = Ed(n);

                function n() {
                    return G()(this, n), t.apply(this, arguments)
                }

                return z()(n, [{
                    key: "run", value: function (e, t) {
                        var n = this.parent.target.type;
                        n && (this[n] && (n && this[n](e, t), update()), this.parent.events.mouseUp[n] && (this.parent.events.mouseUp[n](e, t), update()))
                    }
                }]), n
            }(Ii), Od = function () {
                function e(t) {
                    G()(this, e), this.root = null, this.list = t
                }

                return z()(e, [{
                    key: "run", value: function () {
                        this.list.forEach((function (e) {
                            e.run()
                        }))
                    }
                }, {
                    key: "runBack", value: function () {
                        this.list.forEach((function (e) {
                            e.runBack()
                        }))
                    }
                }]), e
            }();
            const wd = Od;
            const kd = function () {
                function e(t) {
                    G()(this, e), this.card = (0, U.cloneDeep)(t), this.root = null
                }

                return z()(e, [{
                    key: "run", value: function () {
                        var e;
                        null == (e = this.root) || e.appendDataItems(this.card)
                    }
                }, {
                    key: "runBack", value: function () {
                        var e;
                        null == (e = this.root) || e.removeDataItems([this.card.id])
                    }
                }]), e
            }();
            const xd = function () {
                function e(t) {
                    G()(this, e), this.root = null, this.cards = (0, U.cloneDeep)(t), this.relations = []
                }

                return z()(e, [{
                    key: "init", value: function () {
                        this.collectConnectRelations()
                    }
                }, {
                    key: "collectConnectRelations", value: function () {
                        if (this.root) {
                            var e = this.root.data, t = [];
                            this.cards.forEach((function (n) {
                                e.forEach((function (e) {
                                    Object.keys(e.outputs).forEach((function (r) {
                                        var a = e.outputs[r].find((function (e) {
                                            var t;
                                            return (null == e || null == (t = e.split(".")) ? void 0 : t[0]) === n.id
                                        }));
                                        a && t.push({outputKey: r, outputValue: a, parentCardId: e.id})
                                    }))
                                }))
                            })), this.relations = t
                        }
                    }
                }, {
                    key: "run", value: function () {
                        this.root && this.root.removeDataItems(this.cards.map((function (e) {
                            return e.id
                        })))
                    }
                }, {
                    key: "runBack", value: function () {
                        var e = this;
                        this.root && (this.root.appendDataItems(this.cards), this.relations.forEach((function (t) {
                            var n = e.root.data.find((function (e) {
                                return e.id === t.parentCardId
                            }));
                            -1 === n.outputs[t.outputKey].indexOf(t.outputValue) && n.outputs[t.outputKey].push(t.outputValue)
                        })))
                    }
                }]), e
            }();
            const Sd = function () {
                function e(t) {
                    var n = t.cards, r = t.dis;
                    G()(this, e), this.cards = n, this.dis = r, this.root = null
                }

                return z()(e, [{
                    key: "run", value: function () {
                        this.root && Xr(this.root.data, this.cards, this.dis)
                    }
                }, {
                    key: "runBack", value: function () {
                        this.root && Xr(this.root.data, this.cards, {x: -this.dis.x, y: -this.dis.y})
                    }
                }]), e
            }();
            const Td = function () {
                function e(t, n) {
                    G()(this, e), this.root = null, this.cardId = 0, this.setPrevCard(t), this.setNewCard(n)
                }

                return z()(e, [{
                    key: "card", get: function () {
                        return this.root ? this.root.getDataItems(this.cardId)[0] : null
                    }
                }, {
                    key: "run", value: function () {
                        this.newCard && (this.card.props = this.newCard.props, this.card.cfg = this.newCard.cfg, this.card.outputs = this.newCard.outputs, this.card.inputs = this.newCard.inputs)
                    }
                }, {
                    key: "runBack", value: function () {
                        this.prevCard && (this.card.props = this.prevCard.props, this.card.cfg = this.prevCard.cfg, this.card.outputs = this.prevCard.outputs, this.card.inputs = this.prevCard.inputs)
                    }
                }, {
                    key: "setPrevCard", value: function (e) {
                        e && (this.prevCard = e, this.cardId = e.id)
                    }
                }, {
                    key: "setNewCard", value: function (e) {
                        e && (this.newCard = e, this.cardId = e.id)
                    }
                }]), e
            }();
            const Dd = function () {
                function e() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                    G()(this, e), this.root = null, this.preCard = t, this.newCard = n, this.cardId = n.id
                }

                return z()(e, [{
                    key: "card", get: function () {
                        return this.root ? this.root.getDataItems(this.cardId)[0] : null
                    }
                }, {
                    key: "instance", get: function () {
                        return this.root ? this.root.elements.nop.instance[this.card.id] : null
                    }
                }, {
                    key: "run", value: function () {
                        if (this.instance && this.card) {
                            var e = this.newCard.cfg;
                            this.root.updateDataCfg(this.card, (function (t) {
                                return t.background = e.background, t.pos.width = e.pos.width, t.pos.height = e.pos.height, t
                            }))
                        }
                    }
                }, {
                    key: "runBack", value: function () {
                        if (this.instance && this.card) {
                            var e = this.preCard.cfg;
                            this.root.updateDataCfg(this.card, (function (t) {
                                return t.background = e.background, t.pos.width = e.pos.width, t.pos.height = e.pos.height, t
                            }))
                        }
                    }
                }]), e
            }();
            const Pd = function () {
                function e(t, n) {
                    G()(this, e), this.root = null, this.preSelect = t, this.newSelect = n
                }

                return z()(e, [{
                    key: "run", value: function () {
                        this.root && (this.root.selectTool.data.selectedCards = this.newSelect)
                    }
                }, {
                    key: "runBack", value: function () {
                        this.root && (this.root.selectTool.data.selectedCards = this.preSelect)
                    }
                }]), e
            }();
            var Rd = function () {
                function e(t, n) {
                    G()(this, e), this.root = null, this.preMultiple = t, this.curMultiple = n
                }

                return z()(e, [{
                    key: "run", value: function () {
                        this.root && (this.root.selectTool.data.multiple = this.curMultiple)
                    }
                }, {
                    key: "runBack", value: function () {
                        this.root && (this.root.selectTool.data.multiple = this.preMultiple)
                    }
                }]), e
            }();

            function Bd(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Id(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Bd(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bd(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var jd = function () {
                function e(t, n) {
                    if (G()(this, e), !t || !n) throw new Error("must have root and prevCard");
                    this.root = t, this.prevCard = n, this.collectConnectRelations()
                }

                return z()(e, [{
                    key: "setNewCard", value: function (e) {
                        e && (this.newCard = e)
                    }
                }, {
                    key: "collectConnectRelations", value: function () {
                        if (this.root && this.prevCard) {
                            var e = this.root.data, t = [], n = this.prevCard;
                            e.forEach((function (e) {
                                Object.keys(e.outputs).forEach((function (r) {
                                    var a = e.outputs[r].find((function (e) {
                                        var t;
                                        return (null == e || null == (t = e.split(".")) ? void 0 : t[0]) === n.id
                                    }));
                                    a && t.push({outputKey: r, outputValue: a, parentCardId: e.id})
                                }))
                            })), this.relations = t
                        }
                    }
                }, {
                    key: "run", value: function () {
                        var e = this;
                        this.root && this.newCard && (this.root.replaceDataItem(this.prevCard.id, this.newCard), this.relations.forEach((function (t) {
                            var n = e.root.data.find((function (e) {
                                return e.id === t.parentCardId
                            })).outputs[t.outputKey], r = n.indexOf(t.outputValue);
                            r > -1 && n.splice(r, 1);
                            var a = vl(Id(Id({}, hl(t.outputValue)), {}, {id: e.newCard.id}));
                            n.includes(a) || n.push(a)
                        })))
                    }
                }, {
                    key: "runBack", value: function () {
                        var e = this;
                        this.root && this.newCard && (this.root.replaceDataItem(this.newCard.id, this.prevCard), this.relations.forEach((function (t) {
                            var n = e.root.data.find((function (e) {
                                    return e.id === t.parentCardId
                                })).outputs[t.outputKey], r = vl(Id(Id({}, hl(t.outputValue)), {}, {id: e.newCard.id})),
                                a = n.indexOf(r);
                            a > -1 && n.splice(a, 1), n.includes(t.outputValue) || n.push(t.outputValue)
                        })))
                    }
                }]), e
            }();
            const Nd = jd;
            var Ld = ["id", "scope", "type", "value", "userData"];

            function Qd(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            var Md = function () {
                function e(t) {
                    G()(this, e), this.root = null, this.cleanedVars = t
                }

                return z()(e, [{
                    key: "run", value: function () {
                        if (this.root) {
                            var e = this.cleanedVars;
                            (void 0 === e ? [] : e).forEach((function (e) {
                                var t = e.id, n = e.scope;
                                Da.deleteVar({id: t, scope: n})
                            }))
                        }
                    }
                }, {
                    key: "runBack", value: function () {
                        if (this.root) {
                            var e = this.cleanedVars;
                            (void 0 === e ? [] : e).forEach((function (e) {
                                var t = e.id, n = e.scope, r = e.type, a = e.value, o = e.userData.name;
                                !function (e) {
                                    Ia.apply(this, arguments)
                                }(function (e) {
                                    for (var t = 1; t < arguments.length; t++) {
                                        var n = null != arguments[t] ? arguments[t] : {};
                                        t % 2 ? Qd(Object(n), !0).forEach((function (t) {
                                            H()(e, t, n[t])
                                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qd(Object(n)).forEach((function (t) {
                                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                        }))
                                    }
                                    return e
                                }({scope: n, name: o}, Ke()(e, Ld))), Da.createVar({
                                    id: t,
                                    scope: n,
                                    type: r,
                                    name: o,
                                    value: a
                                })
                            }))
                        }
                    }
                }]), e
            }();

            function Zd(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Vd(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Zd(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zd(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Hd = function () {
                function e(t) {
                    var n = t.parent;
                    G()(this, e), this._actionMap = new Map, this.parent = n
                }

                return z()(e, [{
                    key: "index", get: function () {
                        var e = this.parent.graphTool;
                        return this.getAction(e.id).index || 0
                    }, set: function (e) {
                        var t = this.parent.graphTool, n = e >= this.actions.length ? this.actions.length - 1 : e;
                        n = n < -1 ? -1 : n, this.setAction(t.id, Vd(Vd({}, this.getAction(t.id)), {}, {index: n}))
                    }
                }, {
                    key: "actions", get: function () {
                        var e = this.parent.graphTool;
                        return this.getAction(e.id).list || []
                    }, set: function (e) {
                        var t = this.parent.graphTool;
                        this.getAction(t.id).list = e || []
                    }
                }, {
                    key: "currentAction", get: function () {
                        return this.actions[this.index]
                    }
                }, {
                    key: "nextAction", get: function () {
                        return this.actions[this.index + 1]
                    }
                }, {
                    key: "setAction", value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {index: 0, list: []};
                        return e && this._actionMap.set(e, t), t
                    }
                }, {
                    key: "getAction", value: function (e) {
                        var t = this._actionMap.get(e);
                        return t || this.setAction(e)
                    }
                }, {
                    key: "removeAction", value: function (e) {
                        this._actionMap.delete(e)
                    }
                }, {
                    key: "pushCardSelectAction", value: function (e, t) {
                        var n = new Pd(e, t);
                        this.pushAction(n)
                    }
                }, {
                    key: "newCardSelectAction", value: function (e, t) {
                        return new Pd(e, t)
                    }
                }, {
                    key: "pushCardSelectMultipleAction", value: function (e, t) {
                        var n = new Rd(e, t);
                        this.pushAction(n)
                    }
                }, {
                    key: "_initAction", value: function (e) {
                        e && (e.root = this.parent, "function" == typeof e.init && e.init())
                    }
                }, {
                    key: "pushAction", value: function (e) {
                        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                        e && (this._initAction(e), this.actions = [].concat(a()(this.actions.slice(0, this.index + 1)), [e]), this.index = this.actions.length - 1, Ri(Ti.ADD_CHANGED_TAB, {isAutoBackup: t}))
                    }
                }, {
                    key: "pushCardMoveAction", value: function (e) {
                        var t = e.cards, n = e.dis, r = new Sd({cards: a()(t), dis: n});
                        this.pushAction(r, !1)
                    }
                }, {
                    key: "pushCardRemoveAction", value: function (e) {
                        var t = new xd(e.slice(0));
                        this.pushAction(t)
                    }
                }, {
                    key: "newCardRemoveAction", value: function (e) {
                        return new xd(e.slice(0))
                    }
                }, {
                    key: "pushCardAddAction", value: function (e) {
                        var t = new kd(e);
                        this.pushAction(t)
                    }
                }, {
                    key: "newCardAddAction", value: function (e) {
                        return new kd(e)
                    }
                }, {
                    key: "newCardReplaceAction", value: function (e, t) {
                        return new Nd(e, t)
                    }
                }, {
                    key: "pushCardPropsUpdateAction", value: function (e, t) {
                        var n = new Td(e, t);
                        return this.pushAction(n), n
                    }
                }, {
                    key: "newCardPropsUpdateAction", value: function (e, t) {
                        return new Td(e, t)
                    }
                }, {
                    key: "pushNopUpdateAction", value: function (e, t) {
                        var n = new Dd(e, t);
                        this.pushAction(n)
                    }
                }, {
                    key: "pushGroupAction", value: function (e) {
                        var t = this;
                        if (!((e = e.filter(Boolean)).length < 1)) {
                            e.forEach((function (e) {
                                t._initAction(e), e.root = t.parent
                            }));
                            var n = new wd(e);
                            this.pushAction(n)
                        }
                    }
                }, {
                    key: "clearActions", value: function () {
                        this.actions = [], this.index = -1
                    }
                }, {
                    key: "pushVarCleanAction", value: function (e) {
                        if (e && !(e.length < 1)) {
                            var t = this.currentAction;
                            if (t) if (t instanceof wd) {
                                var n = t.list.findIndex((function (e) {
                                    return e instanceof Md
                                }));
                                if (-1 === n) t.list = [new Md(e)].concat(t.list); else {
                                    var r = t.list[n], a = r.cleanedVars.reduce((function (e, t) {
                                        var n, r;
                                        null != (n = t.userData) && n.name && (e[null == (r = t.userData) ? void 0 : r.name] = !0);
                                        return e
                                    }), {}), o = e.filter((function (e) {
                                        var t, n;
                                        return (null == (t = e.userData) ? void 0 : t.name) && !a[null == (n = e.userData) ? void 0 : n.name]
                                    }));
                                    r.cleanedVars = r.cleanedVars.concat(o)
                                }
                            } else this.index--, this.pushGroupAction([new Md(e), t]); else this.clearActions()
                        }
                    }
                }, {
                    key: "runForward", value: function () {
                        if (this.nextAction) try {
                            this.nextAction.run(), this.index++, Ri(Ti.ADD_CHANGED_TAB), update()
                        } catch (e) {
                            u(e)
                        }
                    }
                }, {
                    key: "runBackward", value: function () {
                        if (this.currentAction) try {
                            this.currentAction.runBack(), this.index--, Ri(Ti.ADD_CHANGED_TAB), update()
                        } catch (e) {
                            u(e)
                        }
                    }
                }]), e
            }();
            const Fd = Hd;

            function Gd(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Yd(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Gd(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gd(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var zd = N()(), Ud = zd.browser, qd = zd.device, Xd = "desktop" === qd.type, Kd = function () {
                function e() {
                    var t = this;
                    G()(this, e), this.elements = {}, this.rightKeyDownPos = null, this.browser = Ud, this.deviceType = qd.type || "desktop", this.isInPc = Xd, function (e) {
                        Object.keys(cp).forEach((function (t) {
                            e.elements[t] = new cp[t]({parent: e})
                        })), Object.values(op).forEach((function (t) {
                            if (!e.elements[t.type]) {
                                var n = t.render, r = null, a = function (e) {
                                    J()(r, e);
                                    var n = ap(r);

                                    function r() {
                                        return G()(this, r), n.apply(this, arguments)
                                    }

                                    return z()(r, [{
                                        key: "render", value: function (e) {
                                            var n = null;
                                            return t.render && (0, U.isFunction)(t.render) && (n = t.render(e)), K()(te()(r.prototype), "render", this).call(this, e, n)
                                        }
                                    }]), r
                                }(hu);
                                if (r = a, n) {
                                    if ("time" === n.type) {
                                        var o = function (e) {
                                            J()(r, e);
                                            var t = ap(r);

                                            function r() {
                                                return G()(this, r), t.apply(this, arguments)
                                            }

                                            return z()(r, [{
                                                key: "render", value: function (e) {
                                                    return K()(te()(r.prototype), "render", this).call(this, e, n.config)
                                                }
                                            }]), r
                                        }(Es);
                                        r = o
                                    }
                                    if ("number" === n.type) {
                                        var i = function (e) {
                                            J()(r, e);
                                            var t = ap(r);

                                            function r() {
                                                return G()(this, r), t.apply(this, arguments)
                                            }

                                            return z()(r, [{
                                                key: "render", value: function (e) {
                                                    return K()(te()(r.prototype), "render", this).call(this, e, n.config)
                                                }
                                            }]), r
                                        }(ks);
                                        r = i
                                    }
                                }
                                e.elements[t.type] = new r({parent: e})
                            }
                        }))
                    }(this), this.model = sp, this.versionTool = new kp({parent: this}), this.connectTool = new Ap({parent: this}), this.selectTool = new Cp({parent: this}), this.boundaryTool = new Tp({parent: this}), this.sizeTool = new Ip({parent: this}), this.transformTool = new Vp({parent: this}), this.actionManager = new Fd({parent: this}), this.nodeCheckTool = new Kp({parent: this}), this.graphTool = new cf({parent: this}), this.screenTool = new pf({parent: this}), this.coordinateTool = new Af({parent: this}), this.alignTool = new Rf({parent: this}), this.varTool = new Hf({parent: this}), this.eventManagerTool = new hf({parent: this}), this.gateway = new ua({parent: this}), this.target = new mf({parent: this}), Object.values(ip).forEach((function (e) {
                        t.versionTool[e] = t.versionTool[e] || t.versionTool.default, t.connectTool[e] = t.connectTool[e] || t.connectTool.default, t.selectTool[e] = t.selectTool[e] || t.selectTool.default, t.boundaryTool[e] = t.boundaryTool[e] || t.boundaryTool.default, t.nodeCheckTool[e] = t.nodeCheckTool[e] || t.nodeCheckTool.default
                    })), this.resetData(), this.initEvent(), this.initFontMeasure(), this.root = null, this.app = document.getElementById("app"), this.app.classList.add(this.deviceType)
                }

                return z()(e, [{
                    key: "initFontMeasure", value: function () {
                        var e = document.createElement("canvas");
                        this.measure = e.getContext("2d")
                    }
                }, {
                    key: "measureText", value: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 12,
                            n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 400;
                        return this.measure.font = "".concat(n, " ").concat(t, "px MI Lan Pro"), this.measure.measureText(e).width
                    }
                }, {
                    key: "isDeviceCard", value: function (e) {
                        return [ip.deviceInput, ip.deviceOutput, ip.deviceGet, ip.deviceInputSetVar, ip.deviceGetSetVar].includes(e)
                    }
                }, {
                    key: "lockScroll", value: function (e) {
                        if (null == e) return Wd.settings.graphScrollLocked;
                        Wd.settings.graphScrollLocked = e
                    }
                }, {
                    key: "setRoot", value: function (e) {
                        this.root = document.getElementById(e)
                    }
                }, {
                    key: "rootCursor", value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "default";
                        this.root.style.cursor = e
                    }
                }, {
                    key: "reset", value: function () {
                        this.resetData(), this.target.reset()
                    }
                }, {
                    key: "_getCurrentData", value: function () {
                        var e = this.graphTool;
                        return e.getGraph(e.id) || []
                    }
                }, {
                    key: "data", get: function () {
                        return this._getCurrentData()
                    }
                }, {
                    key: "hasData", get: function () {
                        return this.data.length > 0
                    }
                }, {
                    key: "getDataItems", value: function (e) {
                        for (var t = this._getCurrentData(), n = new Set(Array.isArray(e) ? e : [e]), r = [], a = 0; a < t.length; a++) {
                            var o = t[a];
                            if (n.has(o.id) && (r.push(o), n.delete(o.id)), n.size < 1) break
                        }
                        return r
                    }
                }, {
                    key: "removeDataItems", value: function (e) {
                        var t = this._getCurrentData(), n = new Set(Array.isArray(e) ? e : [e]);
                        e.forEach((function (e) {
                            t.forEach((function (t) {
                                Object.keys(t.outputs).forEach((function (n) {
                                    t.outputs[n] = t.outputs[n].filter((function (t) {
                                        var n;
                                        return !((null == t || null == (n = t.split(".")) ? void 0 : n[0]) === e)
                                    }))
                                }))
                            }))
                        }));
                        var r = this.graphTool, a = this.boundaryTool;
                        r.setGraph(r.id, t.filter((function (e) {
                            return !n.has(e.id)
                        }))), a.updateBoundData()
                    }
                }, {
                    key: "appendDataItems", value: function (e) {
                        if (e) {
                            var t = this._getCurrentData(), n = this.graphTool, r = this.boundaryTool;
                            n.setGraph(n.id, t.concat(e)), r.updateBoundData()
                        }
                    }
                }, {
                    key: "moveDataItemToEnd", value: function (e) {
                        var t = this._getCurrentData(), n = t.findIndex((function (t) {
                            return t.id === e
                        }));
                        n !== t.length - 1 && n > -1 && t.push.apply(t, a()(t.splice(n, 1)))
                    }
                }, {
                    key: "replaceDataItem", value: function (e, t) {
                        var n = this.data.findIndex((function (t) {
                            return t.id === e
                        }));
                        n > -1 && this.data.splice(n, 1, t)
                    }
                }, {
                    key: "_setData", value: function (e, t, n) {
                        var r = (0, U.cloneDeep)((0, U.get)(e, t)), a = (0, U.cloneDeep)(e),
                            o = "function" == typeof n ? n(r, e) : n;
                        (0, U.set)(e, t, o);
                        var i = Wd.sizeTool.run(e);
                        S(i) && i.then((function () {
                            c.cfg.pos = Yd({}, e.cfg.pos)
                        }));
                        var c = (0, U.cloneDeep)(e);
                        return [a, c]
                    }
                }, {
                    key: "updateData", value: function (e, t, n) {
                        var r = this._setData(e, t, n), a = I()(r, 2);
                        return [a[0], a[1]]
                    }
                }, {
                    key: "batchUpdateData", value: function (e, t, n) {
                        var r = this, a = [], o = [];
                        return e.forEach((function (e, i) {
                            var c = r._setData(e, t, (function () {
                                for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                                return n.apply(void 0, t.concat([i]))
                            })), u = I()(c, 2), l = u[0], s = u[1];
                            a.push(l), o.push(s)
                        })), [a, o]
                    }
                }, {
                    key: "updateDataProps", value: function (e, t) {
                        return this.updateData(e, "props", t)
                    }
                }, {
                    key: "updateDataCfg", value: function (e, t, n) {
                        return this.updateData(e, "cfg", t, n)
                    }
                }, {
                    key: "batchUpdateDataCfg", value: function (e, t, n) {
                        return this.batchUpdateData(e, "cfg", t, n)
                    }
                }, {
                    key: "updateDataPos", value: function (e, t, n) {
                        return this.updateData(e, "cfg.pos", t, n)
                    }
                }, {
                    key: "batchUpdateDataPos", value: function (e, t, n) {
                        return this.batchUpdateData(e, "cfg.pos", t, n)
                    }
                }, {
                    key: "resetData", value: function () {
                        this.settings = {
                            active: [],
                            replaceDeviceCardId: "",
                            connectErrorTip: "",
                            graphScrollLocked: !1,
                            contentEditable: ""
                        }, this.rightKeyDownPos = null, this.boundaryTool.updateBoundData()
                    }
                }, {
                    key: "initEvent", value: function () {
                        var e = this;
                        this.events = {
                            mouseDown: new zf({parent: this}),
                            mouseMove: new _f({parent: this}),
                            mouseUp: new nd({parent: this}),
                            wheel: new od({parent: this}),
                            keyDown: new ud({parent: this}),
                            keyUp: new sd({parent: this}),
                            rightKeyDown: new fd({parent: this}),
                            rightKeyMove: new md({parent: this}),
                            rightKeyUp: new hd({parent: this}),
                            middleKeyDown: new yd({parent: this}),
                            middleKeyMove: new bd({parent: this}),
                            middleKeyUp: new Cd({parent: this})
                        }, this.eventsDisable = !1, Object.keys(this.events).forEach((function (t) {
                            var n = e.events[t], r = e.events[t].run;
                            n.run = function () {
                                for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a];
                                r.apply(n, t)
                            }
                        }))
                    }
                }, {
                    key: "appendInstance", value: function (e) {
                        var t, n, r = this, a = e.type, o = e.x, i = e.y, c = e.urn, u = void 0 === c ? "" : c,
                            l = e.did, s = void 0 === l ? "" : l, p = e.isTiHuan, f = (0, U.cloneDeep)(sp[a]);
                        if (f) {
                            f.id = x(), f.type = a, f.cfg.pos = {
                                x: o,
                                y: i,
                                width: (null == f || null == (t = f.size) ? void 0 : t.width) || pe,
                                height: (null == f || null == (n = f.size) ? void 0 : n.height) || fe
                            }, p && (f.props = Yd(Yd({}, f.props), p.props || {}), p.inputs && (f.inputs = p.inputs), p.outputs && (f.outputs = p.outputs));
                            var d = {
                                id: f.id,
                                type: a,
                                cfg: f.cfg,
                                inputs: f.inputs,
                                outputs: f.outputs,
                                props: f.props
                            };
                            u && (d.cfg.urn = u, d.props.did = s), a === sp.nop.type && this.elements.nop.setDelayActiveId(d.id);
                            var m = function () {
                                r.versionTool.run(d), r.sizeTool.run(d), r.selectTool.singleSelect(d.id)
                            }, v = this.settings.replaceDeviceCardId;
                            if (v) {
                                var h = this.data.find((function (e) {
                                    return e.id === v
                                }));
                                if (!h) return;
                                var g = this.actionManager.newCardReplaceAction(this, (0, U.cloneDeep)(h));
                                !function (e, t, n) {
                                    var r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                                        a = e.find((function (e) {
                                            return e.id === t
                                        }));
                                    Tl(e, t).forEach((function (e) {
                                        var t = e.outputKey, r = e.index, a = e.item, o = e.inputKey;
                                        a.outputs[t][r] = vl({id: n.id, key: o})
                                    })), r ? e.splice(e.indexOf(a), 1, kl(kl({}, n), {}, {props: kl(kl({}, a.props), n.props)})) : e.splice(e.indexOf(a), 1, n)
                                }(this.data, v, d, p.deviceType), this.settings.replaceDeviceCardId = "", m(), g.setNewCard((0, U.cloneDeep)(d)), this.actionManager.pushAction(g)
                            } else this.appendDataItems(d), m(), this.actionManager.pushCardAddAction(d);
                            return update(), d
                        }
                    }
                }, {
                    key: "append", value: function (e, t) {
                        var n = this.target.type;
                        if (this.isDeviceCard(n)) return this.gateway.showModal({type: n, x: e, y: t}), void update();
                        this.appendInstance({type: n, x: e, y: t})
                    }
                }]), e
            }(), Wd = new Kd;
            window.editor = Wd;
            const Jd = Wd;

            function _d(e) {
                var t = e.onSuccess, n = (0, o.useState)(""), r = I()(n, 2), a = r[0], c = r[1],
                    u = (0, o.useCallback)((function (e) {
                        Jd.gateway.init(e).then(t).catch((function () {
                            return c("")
                        }))
                    }), [t]), l = function (e) {
                        c((function (t) {
                            if (6 === t.length) return t;
                            var n = t + e;
                            return 6 === n.length && setTimeout((function () {
                                return u(n)
                            }), 0), n
                        }))
                    }, s = function () {
                        c((function (e) {
                            return e.slice(0, -1)
                        }))
                    };
                return (0, o.useEffect)((function () {
                    return cr(document, "paste", (function (e) {
                        var t, n = (e.clipboardData || window.clipboardData).getData("Text");
                        null == n || null == (t = n.split("")) || t.forEach((function (e) {
                            l(e)
                        }))
                    }))
                }), []), (0, o.useEffect)((function () {
                    return cr(document, "keydown", (function (e) {
                        switch (e.keyCode) {
                            case i.Backspace:
                                s();
                                break;
                            case i.Num_0:
                                l(0);
                                break;
                            case i.Num_1:
                                l(1);
                                break;
                            case i.Num_2:
                                l(2);
                                break;
                            case i.Num_3:
                                l(3);
                                break;
                            case i.Num_4:
                                l(4);
                                break;
                            case i.Num_5:
                                l(5);
                                break;
                            case i.Num_6:
                                l(6);
                                break;
                            case i.Num_7:
                                l(7);
                                break;
                            case i.Num_8:
                                l(8);
                                break;
                            case i.Num_9:
                                l(9);
                                break;
                            case i.Numpad_0:
                                l(0);
                                break;
                            case i.Numpad_1:
                                l(1);
                                break;
                            case i.Numpad_2:
                                l(2);
                                break;
                            case i.Numpad_3:
                                l(3);
                                break;
                            case i.Numpad_4:
                                l(4);
                                break;
                            case i.Numpad_5:
                                l(5);
                                break;
                            case i.Numpad_6:
                                l(6);
                                break;
                            case i.Numpad_7:
                                l(7);
                                break;
                            case i.Numpad_8:
                                l(8);
                                break;
                            case i.Numpad_9:
                                l(9)
                        }
                    }))
                }), []), o.createElement("div", {className: "pin-code-with-keyboard"}, o.createElement("div", {className: "pin-code-input"}, Array(a.length).fill("").map((function (e, t) {
                    return o.createElement("span", {className: "code-input-value", key: t}, a[t])
                })), a.length < 6 ? o.createElement("span", {className: "code-input-placeholder"}) : null), o.createElement("div", {className: "pin-keyboard"}, o.createElement("div", {
                    className: "pin-number bg-normal",
                    onClick: function () {
                        return l(1)
                    }
                }, "1"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(2)
                    }
                }, "2"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(3)
                    }
                }, "3"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(4)
                    }
                }, "4"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(5)
                    }
                }, "5"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(6)
                    }
                }, "6"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(7)
                    }
                }, "7"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(8)
                    }
                }, "8"), o.createElement("div", {
                    className: "pin-number bg-normal", onClick: function () {
                        return l(9)
                    }
                }, "9"), o.createElement("div", null), o.createElement("div", {
                    className: "pin-number bg-normal",
                    onClick: function () {
                        return l(0)
                    }
                }, "0"), o.createElement("div", {className: "pin-delete bg-normal", onClick: s}, "删除")))
            }

            _d.propTypes = {onSuccess: Z().func.isRequired};
            var $d = (0, o.createContext)({});
            var em = function () {
                return (0, o.useContext)($d)
            }, tm = n(84378), nm = n(97061), rm = n(79655), am = n(89250), om = n(84956);

            function im(e) {
                var t = function (e) {
                    if ((0, El.Z)(_p(e, ["list"]))) return [!0, !0];
                    var t = e.index, n = e.list;
                    return t < 0 ? [!0, !1] : t >= n.length - 1 ? [!1, !0] : [!1, !1]
                }(e.historyData), n = I()(t, 2), r = n[0], a = n[1];
                return o.createElement(o.Fragment, null, o.createElement(kn.ToolBarBackward, {
                    className: "graph-toolbar-action-item ".concat(r ? "disabled" : ""),
                    onClick: function () {
                        r || Jd.actionManager.runBackward()
                    }
                }), o.createElement(kn.ToolBarForward, {
                    className: "graph-toolbar-action-item ".concat(a ? "disabled" : ""),
                    onClick: function () {
                        a || Jd.actionManager.runForward()
                    }
                }), o.createElement("div", {className: "graph-toolbar-divider"}))
            }

            im.propTypes = {historyData: Z().object};
            const cm = (0, o.memo)((function () {
                return o.createElement(Bc, {
                    slot: function (e) {
                        var t = e.open, n = e.visible;
                        return o.createElement(ho, {
                            hideWhenTouch: !0,
                            title: o.createElement("div", null, "变量管理"),
                            placement: "bottom"
                        }, o.createElement(kn.Vars, {
                            className: "graph-toolbar-action-item".concat(n ? " active" : ""),
                            onClick: t
                        }))
                    }
                })
            }));
            var um = (0, o.memo)((function (e) {
                var t = e.name, n = e.enable, r = (0, o.useState)(t), a = I()(r, 2), i = a[0], c = a[1];
                (0, o.useEffect)((function () {
                    c(t)
                }), [t]);
                var u = (0, o.useState)(!1), l = I()(u, 2), s = l[0], p = l[1],
                    f = (0, o.useCallback)(yo()((function () {
                        p(!1)
                    }), 100), []);
                return o.createElement("div", {className: "graph-toolbar-name-wapper"}, o.createElement(jn.Z, {
                    className: "graph-toolbar-name",
                    value: i,
                    onMouseEnter: function () {
                        p(!0)
                    },
                    onMouseLeave: function () {
                        f()
                    },
                    style: s ? {flexGrow: 1} : {display: "inline-block", width: Jd.measureText(i, 14) + 30},
                    onChange: function (e) {
                        Jd.graphTool.graphConfig.userData.name = e.target.value, c(e.target.value), Ri(Ti.ADD_CHANGED_TAB)
                    },
                    onKeyDown: function (e) {
                        e.stopPropagation()
                    }
                }), n && !s && o.createElement("div", {
                    className: "graph-toolbare-status",
                    style: {display: "inline-block"}
                }, o.createElement("i", {className: "graph-toolbare-status-icon"}), "已启用"))
            }));
            const lm = um;
            um.propTypes = {name: Z().string};
            var sm = {
                left: [{label: "缩放画布", btn1: "ctrl", btn2: "鼠标滚轮", key: "left-mouse"}, {
                    label: "放大画布",
                    btn1: "ctrl",
                    btn2: "+",
                    key: "left-big",
                    rightWidth: 41
                }, {label: "缩小画布", btn1: "ctrl", btn2: "-", key: "left-small", rightWidth: 41}, {
                    label: "100%画布",
                    btn1: "ctrl",
                    btn2: "0",
                    key: "left-canvas-default",
                    rightWidth: 41
                }],
                middle: [{
                    label: "左右滑动画布",
                    btn1: "Shift",
                    btn2: "鼠标滚轮",
                    key: "middle-lr"
                }, {label: "上下滑动画布", btn1: "鼠标滚轮", key: "middle-ud"}],
                right: [{
                    label: "拖动画布",
                    btn1: "Space",
                    btn2: "鼠标左键",
                    key: "right-left"
                }, {label: new Array(8).fill(" "), btn1: "鼠标中键", btn1Left: 76, key: "right-right"}]
            }, pm = (0, o.memo)((function (e) {
                var t = e.label, n = e.btn1, r = e.btn2, a = e.rightWidth;
                return o.createElement(o.Fragment, null, o.createElement("div", {className: "help-modal-item-label"}, t), o.createElement("div", {className: "help-modal-item-btn"}, n), r ? o.createElement("div", {
                    className: "help-modal-item-btn",
                    style: {width: a || "auto"}
                }, r) : null)
            })), fm = (0, o.memo)((function (e) {
                return e.visible ? o.createElement("div", {className: "help-modal"}, o.createElement(kn.Close, {
                    className: "help-modal-close icon-square",
                    onClick: function () {
                        Ri(Ti.TOGGLE_HELP_VISIBLE, !1)
                    }
                }), o.createElement("div", {className: "help-modal-title"}, "快捷键指南"), o.createElement("div", {style: {padding: 24}}, o.createElement("div", {className: "help-modal-small-title"}, "缩放"), o.createElement("div", {className: "help-modal-left"}, sm.left.map((function (e) {
                    return o.createElement(pm, qe()({key: e.key}, e))
                }))), o.createElement("div", {className: "help-modal-small-title"}, "移动"), o.createElement("div", {className: "help-modal-middle"}, sm.middle.map((function (e) {
                    return o.createElement(pm, qe()({key: e.key}, e))
                }))), o.createElement("div", {className: "help-modal-right"}, sm.right.map((function (e) {
                    return o.createElement(pm, qe()({key: e.key}, e))
                }))))) : null
            }));
            const dm = fm;
            fm.propTypes = {visible: Z().bool.isRequired};
            var mm = "biggest", vm = "smallest", hm = .5, gm = 1, ym = 2, Am = "content", bm = [{
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.scaleCanvasAtPoint(Jd.graphTool.centerPoint, 4 / 3)
                    }
                }, "放大"), key: mm
            }, {
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.scaleCanvasAtPoint(Jd.graphTool.centerPoint, 3 / 4)
                    }
                }, "缩小"), key: vm
            }, {
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.fitToBestPos()
                    }
                }, "适应内容"), key: Am
            }, {
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.scaleCanvasAtPoint(Jd.graphTool.centerPoint, 1, .5)
                    }
                }, "50%"), key: hm
            }, {
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.scaleCanvasAtPoint(Jd.graphTool.centerPoint, 1, 1)
                    }
                }, "100%"), key: gm
            }, {
                label: o.createElement("div", {
                    onClick: function () {
                        Jd.transformTool.scaleCanvasAtPoint(Jd.graphTool.centerPoint, 1, 2)
                    }
                }, "200%"), key: ym
            }];

            function Em(e) {
                var t = e.logVisible, n = e.scale, r = (0, o.useState)(null), a = I()(r, 2), i = a[0], c = a[1],
                    u = (0, o.useState)(!1), l = I()(u, 2), s = l[0], p = l[1];
                return (0, o.useEffect)((function () {
                    var e = document.createElement("img");
                    return e.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAAA+BAMAAACM+FBcAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACRQTFRF////AAAAAAAAZsv/AAAAgICAVVVVAAAAQEBAAAAAMzMzAAAACW9ZCAAAAAx0Uk5TAQABgAICAwMEBAUFfFse0wAAAWNJREFUeJztlMFtwzAMABl1gY6gugsY6AgdwUDfBfrIAB4ihvwvWk8gkws41HKlXPRVffgSH7zEiU1T1IGSDXC5QIwDRAA5onyDnAY4AwMMIcYQwhkPILeChKAmye9Qo5Icn0AqhFpHcupxfuSyntfi8YwMUjI8/kZlrBSEyznVv/kBnl8sMsJDb4Umdr18HTV4v3S4l44RXnsrNBlh6q3QxPulw66Xr6MGu/2y6vXRW6GJe+lwLx12319zb4UmdtfRvTS4lw67z+PcW6GJXS+r+8uq19RboYnvLx3upcP3lw730mHXa+6t0MRuv6beCk3s9su9NLiXDvfSYfd9P/dWaGJ3Ha16Tb0Vmoxwfbt9fS/LRoVT3hET4kErceaMGQk5HUf9I8aVd+ZCB7NclkTEJSeJF0lE3rFIhGldMqOMwJIJD85ElCjdN0xyX+IyQIJbzUgJN0o7F0z8N/+yLJ+36/sPGph9xoQr/ZIAAAAASUVORK5CYII=", c(e), Pi(Ti.TOGGLE_HELP_VISIBLE, (function (e) {
                        p((function (t) {
                            return (0, El.Z)(e) && (e = !t), e && Ri(Ti.TOGGLE_LOG_VISIBLE, !1), Jd.lockScroll(e), e
                        }))
                    }))
                }), []), o.createElement(o.Fragment, null, o.createElement(ho, {
                    title: o.createElement("div", null, "截图"),
                    placement: "bottom"
                }, o.createElement(kn.ToolBarScreenShot, {
                    className: "graph-toolbar-action-item", onClick: function () {
                        Jd.screenTool.run()
                    }
                })), o.createElement(ho, {
                    title: o.createElement("div", null, "文本"),
                    placement: "bottom"
                }, o.createElement(kn.ToolBarText, {
                    "data-type": "nop", onDrag: function () {
                        return !1
                    }, draggable: !0, "data-target": 1, onDragStart: function (e) {
                        var t = {x: 10, y: 10};
                        return e.dataTransfer.setDragImage(i, t.x, t.y), Jd.target.offset = t, Jd.target.type = sp.nop.type, update(), !1
                    }, className: "graph-toolbar-action-item", onClick: function () {
                        var e = Jd.transformTool.getViewBox(), t = e.startX, n = e.startY, r = e.width, a = e.height,
                            o = sp.nop.size, i = t + r / 2 - o.width / 2, c = n + a / 2 - o.height / 2;
                        Jd.appendInstance({type: sp.nop.type, x: i, y: c})
                    }
                })), o.createElement(ho, {
                    title: o.createElement("div", null, "日志"),
                    placement: "bottom"
                }, o.createElement(kn.ToolBarLog, {
                    className: "graph-toolbar-action-item ".concat(t ? "active" : ""),
                    onClick: function () {
                        Ri(Ti.TOGGLE_LOG_VISIBLE)
                    }
                })), o.createElement(Q.ZP, {
                    className: "graph-toolbar-action-save-btn",
                    type: "primary",
                    onClick: function () {
                        Jd.graphTool.save()
                    }
                }, "保存"), o.createElement(fo, {
                    placement: "bottomRight",
                    menu: {items: bm},
                    overlayStyle: {width: 120}
                }, o.createElement("div", {className: "graph-toolbar-action-scale"}, o.createElement("span", {style: {width: 40}}, Math.round(100 * n), "%"), o.createElement(kn.Down, null))), o.createElement(dm, {visible: s}))
            }

            Em.propTypes = {scale: Z().number.isRequired, logVisible: Z().bool};
            var Cm = (0, o.memo)((function (e) {
                var t = e.logVisible, n = e.name, r = e.scale, a = e.historyData, i = e.enable;
                return o.createElement("div", {
                    className: "graph-toolbar",
                    "data-target": "1",
                    "data-id": zn.toolbar
                }, o.createElement(lm, {
                    name: n,
                    enable: i
                }), o.createElement("div", {className: "graph-toolbar-action"}, o.createElement(im, {historyData: a}), o.createElement(cm, null), o.createElement(Em, {
                    logVisible: t,
                    scale: r
                })))
            }));
            const Om = Cm;

            function wm(e) {
                var t = e.children;
                return o.createElement("div", {
                    id: Un,
                    className: "absolute-stretch",
                    "data-target": 1,
                    "data-id": zn.mask,
                    onDragEnter: function (e) {
                        return e.preventDefault(), !1
                    },
                    onDragOver: function (e) {
                        return e.preventDefault(), !1
                    },
                    onDragLeave: function (e) {
                        return e.preventDefault(), !1
                    },
                    onDrop: function (e) {
                        var t = Jd.coordinateTool.standard(e);
                        return Jd.append(t.x - Jd.target.offset.x, t.y - Jd.target.offset.y), Jd.target.type = "", e.preventDefault(), !1
                    }
                }, t)
            }

            function km(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function xm(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? km(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : km(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            Cm.propTypes = {
                scale: Z().number.isRequired,
                logVisible: Z().bool,
                name: Z().string,
                historyData: Z().object
            };
            var Sm = 20;

            function Tm(e) {
                var t = e.minX, n = e.minY, r = e.maxX, a = e.maxY, i = e.style, c = void 0 === i ? {} : i,
                    u = e.children, l = function (e) {
                        var t = e.minX, n = e.minY, r = e.maxX, a = e.maxY;
                        return {x: t - Sm, y: n - Sm, width: r - t + 2 * Sm, height: a - n + 2 * Sm}
                    }({minX: t, minY: n, maxX: r, maxY: a}), s = l.x, p = l.y, f = l.width, d = l.height;
                return o.createElement("svg", {
                    width: f,
                    height: d,
                    viewBox: "".concat(s, " ").concat(p, " ").concat(f, " ").concat(d),
                    style: xm({
                        position: "absolute",
                        left: 0,
                        top: 0,
                        pointerEvents: "none",
                        transform: "translate3d(".concat(s, "px, ").concat(p, "px, 0)")
                    }, c)
                }, u)
            }

            Tm.propTypes = {
                minX: Z().number.isRequired,
                minY: Z().number.isRequired,
                maxX: Z().number.isRequired,
                maxY: Z().number.isRequired,
                style: Z().object
            };
            var Dm = Jd.isInPc ? 6 : 40;

            function Pm(e) {
                var t = e.dataId, n = e.active, r = e.linePath, a = e.triPath, i = e.toType, c = e.isLogActive,
                    u = e.arrowId, l = (e.x2, e.y2, Ln()[i]), s = T().isEdgeArrow ? {
                        stroke: l,
                        strokeWidth: 2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        fill: "none"
                    } : {fill: l};
                return o.createElement("g", {
                    className: "line-drawer",
                    "data-id": t,
                    "data-target": "1",
                    stroke: l
                }, o.createElement("path", {
                    d: r,
                    strokeWidth: "2",
                    strokeDasharray: n ? "5 5" : 0,
                    fill: "none"
                }, c ? o.createElement("animate", {
                    attributeName: "opacity",
                    values: "1; 0; 1",
                    dur: nr.animateRate,
                    begin: "0",
                    repeatCount: "indefinite"
                }) : null), o.createElement("path", {
                    d: r,
                    strokeWidth: Dm,
                    fill: "none",
                    opacity: "0"
                }), o.createElement("path", qe()({"data-id": u, "data-target": u ? 1 : "", d: a}, s)))
            }

            Pm.propTypes = {
                dataId: Z().string.isRequired,
                arrowId: Z().string,
                active: Z().bool,
                linePath: Z().string.isRequired,
                triPath: Z().string.isRequired,
                toType: Z().string.isRequired,
                isLogActive: Z().bool
            };
            var Rm = (0, o.memo)((function (e) {
                var t = e.id, n = e.checked, r = e.style, a = e.isLogLine;
                return o.createElement("div", {
                    className: "card-multiple",
                    "data-target": 1,
                    "data-id": a ? dl(t).multiSelectPointerLine() : dl(t).multiSelectPointer(),
                    style: r
                }, o.createElement(ko, {style: {fontSize: 14}, checked: n}))
            }));
            const Bm = Rm;

            function Im(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function jm(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Im(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Im(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Nm(e, t) {
                e.element, e.type;
                var n = e.connect, r = e.cardType, a = sp[r].connector, o = null, i = null;
                return (0, U.isFunction)(a) ? o = (i = a(t)).inputs.find((function (e) {
                    return e.key === n
                })) : (i = a, o = {}.hasOwnProperty.call(i, "inputsLoopConfig") ? i.inputsLoopConfig : i.inputs.find((function (e) {
                    return e.key === n
                }))), Ln()[o.type]
            }

            Rm.propTypes = {id: Z().string.isRequired, checked: Z().bool.isRequired};
            var Lm = (0, o.memo)((function (e) {
                var t = e.fromDetail, n = e.toDetail, r = e.x2, a = e.y2, i = e.elementTo, c = e.currentFrame,
                    u = (0, o.useState)(!1), l = I()(u, 2), s = l[0], p = l[1],
                    f = Jr.kd.getLogAnimationCalculatorLogId({
                        srcNodeId: t.element,
                        srcName: t.connect,
                        dstNodeId: n.element,
                        dstName: n.connect
                    }), d = c.status[f];
                if (!d) return null;
                var m = Nm(n, i), v = "".concat(d.order, ": ").concat(d.info), h = 16;
                return s && (v += " ".concat(R()(d.timestamp).format(Wn)), h = 20), h += Jd.measureText(v), o.createElement("div", {
                    style: jm(jm({}, tr), {}, {
                        width: h,
                        color: m,
                        left: r - h - 8,
                        top: a - er - 1
                    }), onMouseEnter: function () {
                        p(!0)
                    }, onMouseLeave: function () {
                        p(!1)
                    }, className: "panel-log-relation"
                }, v)
            }));
            const Qm = Lm;

            function Mm(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Zm(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Mm(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Mm(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Vm(e) {
                var t = e.dataId, n = e.x2, r = e.y2, a = e.toDetail, i = e.elementTo, c = Jd.selectTool.data,
                    u = c.multipleLog, l = c.selectedLogLines, s = Nm(a, i), p = l.includes(t);
                return o.createElement(o.Fragment, null, u ? o.createElement("div", {
                    style: Zm(Zm({}, tr), {}, {
                        width: 20,
                        color: s,
                        left: n - 20 - 8 - 14,
                        top: r + 5
                    }), className: "panel-log-relation"
                }, o.createElement(Bm, {id: t, checked: p, style: {top: -4, right: -16}, isLogLine: !0})) : null)
            }

            function Hm(e) {
                var t = e.normalConnectedLineList, n = e.activeLineList;
                return o.createElement(o.Fragment, null, (0, El.Z)(t) ? null : o.createElement(o.Fragment, null, o.createElement(Tm, Jd.boundaryTool.data, t.map((function (e) {
                    return o.createElement(Pm, qe()({key: e.key}, e))
                }))), t.map((function (e) {
                    return o.createElement(Vm, qe()({key: e.key}, e))
                }))), (0, El.Z)(n) ? null : o.createElement(o.Fragment, null, o.createElement(Tm, qe()({}, Jd.boundaryTool.data, {style: {zIndex: Qn.ACTIVE_LINE}}), n.map((function (e) {
                    return o.createElement(Pm, qe()({key: e.key}, e))
                }))), n.map((function (e) {
                    return o.createElement(Vm, qe()({key: e.key}, e))
                }))))
            }

            Lm.propTypes = {
                elementTo: Z().object.isRequired,
                fromDetail: Z().object.isRequired,
                toDetail: Z().object.isRequired,
                x2: Z().number.isRequired,
                y2: Z().number.isRequired,
                currentFrame: Z().object.isRequired
            }, Vm.propTypes = {dataId: Z().string.isRequired}, Hm.propTypes = {
                normalConnectedLineList: Z().array.isRequired,
                activeLineList: Z().array.isRequired
            };
            var Fm = ["minX", "minY", "maxX", "maxY"];

            function Gm(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Ym(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Gm(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gm(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function zm(e) {
                var t = e.minX, n = e.minY, r = e.maxX, a = e.maxY, i = Ke()(e, Fm);
                return o.createElement(Tm, {
                    minX: t,
                    minY: n,
                    maxX: r,
                    maxY: a,
                    style: {zIndex: Qn.ACTIVE_LINE}
                }, o.createElement(Pm, i))
            }

            function Um(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function qm(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Um(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Um(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Xm(e) {
                var t = e.cardList, n = e.lineColor1, r = (0, o.useState)({}), a = I()(r, 2), i = a[0], c = a[1];
                if ((0, o.useEffect)((function () {
                    return Pi(Ti.CONNECTING_LINE, (function (e, t) {
                        if (e === Me) {
                            var n = Il();
                            return n.from && (Jd.target.set({
                                type: zn.connect,
                                id: n.from,
                                element: document.getElementById(n.from),
                                offset: {x: 0, y: 0}
                            }), Jd.connectTool.setNearConnector(n.from)), void c(n)
                        }
                        if (e === Ze && c((function (e) {
                            return qm(qm({}, e), {}, {x2: t.x, y2: t.y})
                        })), e !== Ve) e === He && c({}); else {
                            var r = Il(0);
                            r.id && (Jd.target.set({
                                type: zn.connect2,
                                id: r.id,
                                element: document.getElementById(r.id),
                                offset: {x: 0, y: 0}
                            }), c(r))
                        }
                    }))
                }), []), (0, o.useEffect)((function () {
                    Jd.graphTool.connectingInfo = i
                }), [i]), !i.from) return null;
                var u = ml(i.from), l = u.element, s = u.connect, p = Ur(t, l);
                if (!p) return null;
                var f = Jd.connectTool.active, d = dl(l, s).connect3("connector.0"), m = dl(l, s).connect2(),
                    v = parseFloat(i.x1), h = parseFloat(i.x2), g = parseFloat(i.y1), y = parseFloat(i.y2);
                if (Math.abs(v - h) < .1 && Math.abs(g - y) < .1) return null;
                var A = Rl({x1: v, x2: h, y1: g, y2: y}, p, f ? Ur(t, ml(f).element) : null), b = A.linePath, E = {
                    minX: A.minX,
                    minY: A.minY,
                    maxX: A.maxX,
                    maxY: A.maxY,
                    dataId: d,
                    arrowId: m,
                    linePath: b,
                    triPath: Dl(i.x2, i.y2),
                    toType: Jd.connectTool.connectType
                };
                return o.createElement(zm, qe()({}, E, {lineColor1: n}))
            }

            function Km(e) {
                var t = e.logVisible, n = e.lineList, r = e.currentFrame;
                if (t && r && !(0, El.Z)(n)) return n.map((function (e) {
                    return o.createElement(Qm, qe()({key: e.key}, e, {currentFrame: r}))
                }))
            }

            function Wm(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Jm(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Wm(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wm(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function _m(e) {
                var t = e.cardList, n = e.cardInfo, r = e.currentFrame, a = (0, o.useState)(!1), i = I()(a, 2),
                    c = i[0], u = i[1], l = Jr.kd.getLogAnimationCalculatorLogId({nodeId: n.id}), s = r.status[l];
                if (!s) return null;
                var p = Ur(t, n.id);
                if (!p) return null;
                var f = "".concat(s.order, ": ").concat(s.info, " ");
                return c && (f += R()(s.timestamp).format(Wn)), o.createElement("div", {
                    className: "panel-log-card",
                    onMouseEnter: function () {
                        u(!0)
                    },
                    onMouseLeave: function () {
                        u(!1)
                    },
                    style: Jm(Jm({}, tr), {}, {
                        color: Ln().active,
                        whiteSpace: "nowrap",
                        padding: "0 8px",
                        left: p.cfg.pos.x + 20,
                        top: p.cfg.pos.y - er - 2
                    })
                }, r.new === l ? o.createElement("div", {
                    className: "panel-log-card-blink",
                    style: {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        outline: "1px solid ".concat(Ln().active)
                    }
                }) : null, f)
            }

            function $m(e) {
                var t = e.logVisible, n = e.cardList, r = e.currentFrame;
                if (t && r) return n.map((function (e) {
                    var t = e.cfg.pos;
                    return o.createElement(p, {
                        key: "log-".concat(e.id), deps: [t.x, t.y, r], renderFn: function () {
                            return o.createElement(_m, {cardList: n, cardInfo: e, currentFrame: r})
                        }
                    })
                }))
            }

            function ev(e) {
                var t = e.x, n = e.y, r = e.scale, a = e.children;
                return o.createElement("div", {
                    style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                        transform: "translate3d(".concat(t, "px, ").concat(n, "px, 0) scale(").concat(r, ")")
                    }
                }, a)
            }

            zm.propTypes = Ym(Ym({}, Pm.propTypes), {}, {
                minX: Z().number.isRequired,
                minY: Z().number.isRequired,
                maxX: Z().number.isRequired,
                maxY: Z().number.isRequired
            }), Xm.propTypes = {cardList: Z().array.isRequired}, Km.propTypes = {
                lineList: Z().array.isRequired,
                currentFrame: Z().object
            }, _m.propTypes = {
                cardList: Z().array.isRequired,
                cardInfo: Z().object.isRequired,
                currentFrame: Z().object.isRequired
            }, $m.propTypes = {
                cardList: Z().array.isRequired,
                currentFrame: Z().object
            }, ev.propTypes = {x: Z().number.isRequired, y: Z().number.isRequired, scale: Z().number.isRequired};
            n(96732);
            var tv = function () {
                function e(t, n) {
                    G()(this, e), this.el = t || window, this.callback = n, this.timer = null, this.prevPosition = {}, this.isWaiting = !1, this._handleClick = this.handleClick.bind(this), this.el.addEventListener("click", this._handleClick, !0)
                }

                return z()(e, [{
                    key: "handleClick", value: function (e) {
                        var t = this;
                        if (this.timer && (clearTimeout(this.timer), this.timer = null), e.isTrusted) {
                            var n = e.pageX, r = e.pageY;
                            if (this.isWaiting) {
                                this.isWaiting = !1;
                                var a = Math.abs(n - this.prevPosition.pageX),
                                    o = Math.abs(r - this.prevPosition.pageY);
                                a <= 10 && o <= 10 && this.callback && this.callback(e)
                            } else this.prevPosition = {
                                pageX: n,
                                pageY: r
                            }, this.isWaiting = !0, this.timer = setTimeout((function () {
                                t.isWaiting = !1
                            }), 200)
                        }
                    }
                }, {
                    key: "remove", value: function () {
                        this.el.removeEventListener("click", this._handleClick, !0)
                    }
                }]), e
            }();

            function nv(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function rv(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? nv(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : nv(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var av = (0, o.memo)((function (e) {
                var t = e.id, n = e.rx, r = void 0 === n ? 8 : n, a = e.ry, i = void 0 === a ? 8 : a,
                    c = e.currentFrameSelected, u = dl(t).select();
                return o.createElement("div", {
                    className: c ? "selected-card-wrapper active" : " selected-card-wrapper",
                    style: {borderRadius: "".concat(r + 1, "px ").concat(i + 1, "px")},
                    id: u
                })
            }));
            const ov = av;

            function iv(e) {
                var t = e.cardInfo, n = t.cfg.pos, r = n.x, a = n.y, i = n.width, c = n.height;
                return o.createElement(o.Fragment, null, o.createElement(av, {
                    id: t.id,
                    rx: 9,
                    ry: 9
                }), o.createElement("div", {
                    className: "nop-size-dragger",
                    "data-x": r,
                    "data-y": a,
                    "data-width": i,
                    "data-height": c,
                    "data-target": 1,
                    style: {top: c / 2 - 10},
                    onPointerDown: function (e) {
                        Jd.rootCursor("e-resize");
                        var n = e.target;
                        n.setPointerCapture(e.pointerId);
                        var a = (0, U.cloneDeep)(t), o = function (e) {
                            var n = Jd.coordinateTool.standard(e), a = parseFloat(n.x) - parseFloat(r);
                            Jd.updateDataPos(t, (function (e) {
                                return rv(rv({}, e), {}, {width: Math.max(100, a)})
                            })), Jd.elements.nop.heightChange(t)
                        }, i = function e(r) {
                            ur(n, "pointermove", o), ur(n, "pointerup", e), ur(n, "pointercancel", e), n.releasePointerCapture(r.pointerId), Jd.actionManager.pushNopUpdateAction(a, (0, U.cloneDeep)(t))
                        };
                        cr(n, "pointermove", o), cr(n, "pointerup", i), cr(n, "pointercancel", i)
                    }
                }, o.createElement("div", {className: "nop-size-dragger-content"})))
            }

            function cv(e) {
                var t = e.active, n = e.cardInfo, r = e.dotInfo, a = e.isOutput, i = e.y, c = n.id, u = n.cfg,
                    l = u.pos, s = u.simplified, p = r.key, f = r.type, d = r.disabled, m = r.simplifiedExtra,
                    v = dl(c, p).connect(), h = l.x, g = l.width, y = s ? m : r.extra, A = a ? g : 0,
                    b = a ? Qe.output : Qe.input, E = f === Qe.both,
                    C = d ? {fill: Ln().default} : {fill: Ln()[f], stroke: Ln()[f]}, O = A + h, w = i + l.y,
                    k = t === v;
                return o.createElement(o.Fragment, null, y ? o.createElement("div", {
                    className: "card-dot-label",
                    style: H()({
                        top: i - he + he / 2,
                        height: he,
                        lineHeight: "".concat(he, "px")
                    }, a ? "right" : "left", 20)
                }, y) : null, o.createElement("svg", {
                    style: {
                        position: "absolute",
                        left: a ? A - he : A,
                        top: i - he,
                        width: he,
                        height: 2 * he,
                        cursor: d ? "not-allowed" : "pointer"
                    },
                    key: v,
                    id: v,
                    "data-target": 1,
                    "data-x": O,
                    "data-y": w,
                    "data-id": v,
                    "data-io": b,
                    "data-type": E ? "both" : f
                }, E ? o.createElement("g", {
                    transform: "translate(".concat(a ? he : 0, ",").concat(he, ")"),
                    style: C,
                    id: "".concat(v, "-active"),
                    opacity: d ? .5 : 1
                }, o.createElement("path", {
                    d: "M ".concat(0, " ", -he / 2, "  A ").concat(he / 2, " ").concat(he / 2, " 1 0 0 ").concat(-he / 2, " 0 L 0 0 z"),
                    fill: Ln().event
                }), o.createElement("path", {
                    d: "M ".concat(0, " ", he / 2, "  A ").concat(he / 2, " ").concat(he / 2, " 0 0 1 ").concat(-he / 2, " 0 L 0 0 z"),
                    fill: Ln().status
                })) : o.createElement("g", {
                    transform: "translate(".concat(a ? he : 0, ",").concat(he, ")"),
                    style: C,
                    className: "line-connector-svg"
                }, o.createElement("path", {
                    d: "M ".concat(0, " ", -he / 2, " A ").concat(he / 2, " ").concat(he / 2, " 0 0 ").concat(a ? 0 : 1, " ", 0, " ").concat(he / 2),
                    "data-disabled": d ? "1" : "0"
                }), k ? o.createElement("path", {
                    d: "M ".concat(0, " ", -he / 2, " A ").concat(he / 2, " ").concat(he / 2, " 0 0 ").concat(a ? 1 : 0, " ", 0, " ").concat(he / 2),
                    "data-type": f,
                    "data-disabled": d ? "1" : "0",
                    "data-io": b
                }) : null)))
            }

            function uv(e) {
                var t = e.cardInfo, n = e.active, r = Jd.connectTool.run(t), a = r.inputs, i = r.outputs,
                    c = Jd.connectTool.getIOPosition(t, "inputs"), u = Jd.connectTool.getIOPosition(t, "outputs");
                return o.createElement(o.Fragment, null, a.map((function (e, r) {
                    return o.createElement(cv, {key: e.key, active: n, cardInfo: t, dotInfo: e, isOutput: !1, y: c[r]})
                })), i.map((function (e, r) {
                    return o.createElement(cv, {key: e.key, active: n, cardInfo: t, dotInfo: e, isOutput: !0, y: u[r]})
                })))
            }

            av.propTypes = {
                id: Z().string.isRequired,
                rx: Z().number,
                ry: Z().number
            }, iv.propTypes = {cardInfo: Z().object.isRequired}, cv.propTypes = {
                cardInfo: Z().shape({
                    id: Z().string.isRequired,
                    cfg: Z().shape({
                        simplified: Z().bool,
                        pos: Z().shape({
                            x: Z().number.isRequired,
                            y: Z().number.isRequired,
                            width: Z().number.isRequired,
                            height: Z().number.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired,
                dotInfo: Z().shape({
                    key: Z().string.isRequired,
                    type: Z().string.isRequired,
                    disabled: Z().bool,
                    simplifiedExtra: Z().string,
                    extra: Z().node
                }).isRequired,
                isOutput: Z().bool.isRequired,
                y: Z().number.isRequired,
                active: Z().string
            }, uv.propTypes = {cardInfo: Z().object.isRequired, active: Z().string};
            var lv = 1.2;

            function sv(e, t, n) {
                var r = e.x, a = e.y, o = e.width, i = e.height, c = t.width, u = t.height, l = n.x, s = n.y,
                    p = n.scale;
                return r * p + l > c * lv || (a * p + s > u * lv || ((r + o) * p + l < -c * (lv - 1) || (a + i) * p + s < -u * (lv - 1)))
            }

            var pv = function (e) {
                var t, n = Jd.target.getTarget(e);
                (null == n || null == (t = n.dataset) ? void 0 : t.id) !== zn.form && Jd.events.mouseUp.simplify()
            };

            function fv(e) {
                var t = e.cardInfo, n = e.cardInfo, r = n.id, i = n.type, c = n.cfg, u = c.pos, l = c.name,
                    s = e.isActiveLineCard, f = e.deps, d = e.lineColor1, m = e.currentFrame, v = u.x, g = u.y,
                    y = u.width, A = u.height,
                    b = (0, o.useState)(!sv(u, Jd.graphTool.containerSize, Jd.transformTool.data)), E = I()(b, 2),
                    C = E[0], O = E[1], w = (0, o.useRef)(), k = h(), x = [v, g, y, A], S = Jd.connectTool.active,
                    T = Jd.selectTool.data, D = T.selectedCards, P = T.multiple, R = T.multipleLog;
                (0, o.useEffect)((function () {
                    if (C && k && w.current) {
                        var e = new tv(w.current, pv);
                        return function () {
                            e.remove()
                        }
                    }
                }), [C]);
                var B = Jd.elements[i];
                if (!B) return null;
                if (!C) {
                    if (sv(u, Jd.graphTool.containerSize, Jd.transformTool.data)) return null;
                    O(!0)
                }
                var j = D.includes(t.id), N = j ? Qn.ACTIVE_CARD : s ? Qn.ACTIVE_LINE_CARD : "initial";
                return o.createElement(p, {
                    deps: [].concat(x, a()(f), [j, S, N, P, R, j, d, m]), renderFn: function () {
                        var e, n, a, i;
                        return o.createElement("div", {
                            className: "card-wrapper",
                            style: {
                                position: "absolute",
                                width: y,
                                height: A,
                                transform: "translate3d(".concat(v, "px, ").concat(g, "px, 0)"),
                                zIndex: N,
                                cursor: j ? "move" : "pointer"
                            },
                            "data-x": v,
                            "data-y": g,
                            "data-target": 1,
                            "data-id": r,
                            "data-name": l,
                            "data-type": zn.card,
                            id: r
                        }, o.createElement("div", qe()({
                            ref: w,
                            className: "absolute-stretch"
                        }, k ? {} : {onDoubleClick: pv}), B.render(t)), j || (null == m || null == (e = m.new) || null == (n = e.split("node:")) ? void 0 : n[1]) === t.id ? o.createElement(ov, {
                            id: t.id,
                            currentFrameSelected: (null == m || null == (a = m.new) || null == (i = a.split("node:")) ? void 0 : i[1]) === t.id
                        }) : null, P || R ? o.createElement(Bm, {
                            id: t.id,
                            checked: j
                        }) : null, o.createElement(uv, {cardInfo: t, active: S}))
                    }
                })
            }

            fv.propTypes = {
                cardInfo: Z().shape({
                    id: Z().string.isRequired,
                    type: Z().string.isRequired,
                    cfg: Z().shape({
                        name: Z().string.isRequired,
                        pos: Z().shape({
                            x: Z().number.isRequired,
                            y: Z().number.isRequired,
                            width: Z().number.isRequired,
                            height: Z().number.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired, deps: Z().array.isRequired, isActiveLineCard: Z().bool
            };
            var dv = n(63498), mv = ["onWidthChange", "onChange", "value", "onMount", "onUnmount", "id", "style"];

            function vv(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function hv(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? vv(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : vv(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            const gv = function (e) {
                e.onWidthChange;
                var t = e.onChange, n = e.value, r = e.onMount, a = e.onUnmount, i = e.id, c = e.style, u = Ke()(e, mv),
                    l = "richtext-".concat(i);
                return (0, o.useEffect)((function () {
                    var e = new dv.Z("#".concat(l), {modules: {toolbar: null}, placeholder: "添加备注"});
                    return e.setContents(n), e.on("text-change", (function () {
                        var n = e.getContents().ops;
                        t(n, e)
                    })), e.clipboard.addMatcher(Node.ELEMENT_NODE, (function (e) {
                        var t = e.innerText;
                        return (new (dv.Z.import("delta"))).insert(t)
                    })), e.disable(), r(e), function () {
                        e.off("text-change"), a(e)
                    }
                }), []), o.createElement("div", qe()({
                    id: l, className: "nop-content", onKeyDown: function (e) {
                        e.stopPropagation()
                    }, style: hv({}, c)
                }, u))
            };
            var yv = Jd.elements.nop;

            function Av(e) {
                var t = e.cardInfo, n = "".concat(Jd.graphTool.id, "-").concat(t.id), r = t.cfg, a = r.pos, i = a.width,
                    c = a.height, u = r.background, l = r.contents;
                return o.createElement("div", {
                    className: "nop",
                    style: {height: c, width: i}
                }, o.createElement(gv, {
                    id: n, style: {height: c, background: u}, onChange: function (e) {
                        t.cfg.contents = e, yv.heightChange(t)
                    }, value: l, onMount: function (e) {
                        yv.instance[t.id] = e, yv.delayActiveId === t.id && (yv.active(t.id), yv.delayActiveId = 0)
                    }, onUnmount: function () {
                        delete yv.instance[t.id]
                    }
                }))
            }

            function bv(e) {
                var t = e.cardInfo, n = e.cardInfo, r = n.id, i = n.cfg, c = i.pos, u = i.name, l = e.deps, s = c.x,
                    f = c.y, d = c.width, m = c.height, v = [s, f, d, m], h = Jd.selectTool.data, g = h.selectedCards,
                    y = h.multiple, A = h.multipleLog, b = g.includes(r), E = b ? Qn.ACTIVE_CARD : Qn.NOP_CARD;
                return o.createElement(p, {
                    deps: [].concat(v, a()(l), [b, E, y, A]), renderFn: function () {
                        return o.createElement("div", {
                            className: "card-wrapper",
                            style: {
                                position: "absolute",
                                width: d,
                                height: m,
                                transform: "translate3d(".concat(s, "px, ").concat(f, "px, 0)"),
                                zIndex: E,
                                cursor: b ? "move" : "pointer"
                            },
                            "data-x": s,
                            "data-y": f,
                            "data-target": 1,
                            "data-id": r,
                            "data-name": u,
                            "data-type": zn.card,
                            id: r
                        }, o.createElement(p, {
                            deps: [].concat(v, a()(l)), renderFn: function () {
                                return o.createElement(Av, {cardInfo: t})
                            }
                        }), b ? o.createElement(iv, {cardInfo: t}) : null, y || A ? o.createElement(Bm, {
                            id: r,
                            checked: b,
                            multiple: y
                        }) : null)
                    }
                })
            }

            Av.propTypes = {cardInfo: Z().object.isRequired}, bv.propTypes = {
                cardInfo: Z().shape({
                    id: Z().string.isRequired,
                    cfg: Z().shape({
                        name: Z().string.isRequired,
                        pos: Z().shape({
                            x: Z().number.isRequired,
                            y: Z().number.isRequired,
                            width: Z().number.isRequired,
                            height: Z().number.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired, deps: Z().array.isRequired
            };
            var Ev = [sp.logicOr.type, sp.logicAnd.type, sp.signalOr.type];

            function Cv(e) {
                var t = e.cardList, n = e.activeLineCardIdMap, r = e.lineColor1, a = e.currentFrame,
                    i = Jd.settings.contentEditable;
                return t.map((function (e) {
                    if (e.type === sp.nop.type) {
                        var t = [Jd.graphTool.id, i, e.props, e.cfg.background, e.cfg.contents];
                        return o.createElement(bv, {key: "group-".concat(e.id), cardInfo: e, deps: t})
                    }
                    var c = [e.props, Jd.graphTool.id, e.cfg.simplified];
                    e.type === sp.alarmClock.type ? (c.push(e.cfg.happenType), c.push(e.cfg.tempOffset)) : e.type === sp.delay.type ? (c.push(e.cfg.unit), c.push(e.cfg.value)) : Ev.includes(e.type) ? c.push(e.inputs) : e.type === sp.modeSwitch.type && c.push(e.outputs), e.cfg.urn && c.push(Jd.gateway.data.urnMap[e.cfg.urn]);
                    var u = n[e.id];
                    return o.createElement(fv, {
                        key: "group-".concat(e.id),
                        cardInfo: e,
                        isActiveLineCard: u,
                        deps: c,
                        lineColor1: r,
                        currentFrame: a
                    })
                }))
            }

            function Ov(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function wv(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ov(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ov(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function kv() {
                var e = (0, o.useState)({x1: 0, x2: 0, y1: 0, y2: 0, visible: !1}), t = I()(e, 2), n = t[0], r = n.x1,
                    a = n.x2, i = n.y1, c = n.y2, u = n.visible, l = t[1];
                if ((0, o.useEffect)((function () {
                    return Pi(Ti.MASK_UPDATE, (function (e) {
                        l((function (t) {
                            return t.visible && !e.visible && Jd.boundaryTool.run(t), wv(wv({}, t), e)
                        }))
                    }))
                }), []), !u) return null;
                var s = Math.abs(a - r), f = Math.abs(c - i);
                if (s <= 0 || f <= 0) return null;
                var d = Math.min(r, a), m = Math.min(i, c);
                return o.createElement(p, {
                    renderFn: function () {
                        return o.createElement("div", {
                            id: "mask",
                            style: {
                                position: "absolute",
                                left: d,
                                top: m,
                                width: s,
                                height: f,
                                border: "1px solid #4d77ff",
                                backgroundColor: "rgba(71, 192, 219,0.5)",
                                transform: "translateZ(0)",
                                zIndex: "3"
                            }
                        })
                    }, deps: [u, r, a, i, c]
                })
            }

            Cv.propTypes = {cardList: Z().array.isRequired, activeLineCardIdMap: Z().object.isRequired};
            var xv = [{key: Of, label: "左对齐", Icon: kn.AlignLeft, activeCount: 2}, {
                key: wf,
                label: "水平居中",
                Icon: kn.AlignCenter,
                activeCount: 2
            }, {key: kf, label: "右对齐", Icon: kn.AlignRight, activeCount: 2}, {
                key: xf,
                label: "顶部对齐",
                Icon: kn.AlignTop,
                activeCount: 2
            }, {key: Sf, label: "垂直居中", Icon: kn.AlignMiddle, activeCount: 2}, {
                key: Tf,
                label: "底部对齐",
                Icon: kn.AlignBottom,
                activeCount: 2
            }, {key: Df, label: "水平等间距", Icon: kn.AlignHorizontalEq, activeCount: 3}, {
                key: Pf,
                label: "垂直等间距",
                Icon: kn.AlignVerticalEq,
                activeCount: 3
            }], Sv = {top: 0, left: 0};

            function Tv(e) {
                var t = e.selectedCards, n = (0, o.useState)(Sv), r = I()(n, 2), a = r[0], i = r[1],
                    c = (0, o.useRef)(null), u = (0, o.useRef)(null);
                return (0, o.useEffect)((function () {
                    return u.current = setTimeout((function () {
                        if (c.current) {
                            var e = c.current.getBoundingClientRect(),
                                t = document.documentElement.getBoundingClientRect(),
                                n = Math.min(t.height - e.bottom - 4, 0), r = Math.min(t.width - e.right - 4, 0);
                            i({top: n, left: r})
                        }
                    }), 0), function () {
                        clearTimeout(u.current), i(Sv)
                    }
                }), []), o.createElement("div", {
                    className: "align-submenu",
                    ref: c,
                    style: {marginTop: a.top, marginLeft: a.left}
                }, xv.map((function (e) {
                    return o.createElement("div", {
                        key: e.key,
                        className: "align-submenu-item ".concat(t.length < e.activeCount ? "disabled" : ""),
                        "data-target": 1,
                        "data-id": "align.".concat(e.key, ".0")
                    }, o.createElement(e.Icon, {style: {marginRight: 12}}), o.createElement("span", null, e.label))
                })))
            }

            Tv.propTypes = {selectedCards: Z().arrayOf(Z().string).isRequired};
            var Dv = 120, Pv = 32, Rv = 8, Bv = 3, Iv = {className: "right-menu-item", style: {width: Dv, height: Pv}},
                jv = function () {
                    return Jd.selectTool.data.selectedCards.length < 2 ? null : {
                        key: "align",
                        title: o.createElement(o.Fragment, null, o.createElement("span", null, "对齐"), o.createElement(kn.Right, {style: {fontSize: 14}}), o.createElement("div", {className: "right-submenu"}, o.createElement(Tv, {selectedCards: Jd.selectTool.data.selectedCards}))),
                        "data-target": 1
                    }
                };
            var Nv = ["key", "title"];

            function Lv(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Qv(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Lv(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Lv(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function Mv(e) {
                var t = e.cardList, n = (0, o.useState)(!1), r = I()(n, 2), a = r[0], i = r[1],
                    c = (0, o.useState)({x: 0, y: 0}), u = I()(c, 2), l = u[0], s = l.x, p = l.y, f = u[1],
                    d = (0, o.useState)(null), m = I()(d, 2), v = m[0], h = m[1];
                if ((0, o.useEffect)((function () {
                    return Pi(Ti.RIGHT_KEY_MENU, (function (e, t, n) {
                        i(e), e ? (Jd.rightKeyDownPos = n, f({x: n.rawX, y: n.rawY}), h(t)) : Jd.rightKeyDownPos = null
                    }))
                }), []), !a) return null;
                var g = function (e) {
                    var t = e.cardList, n = e.targetType, r = e.setVisible, a = Jd.target, o = Jd.selectTool,
                        i = Jd.graphTool;
                    if (n === zn.connect3) return [{
                        key: "delete",
                        title: "删除",
                        "data-id": dl(a.id).delete(),
                        "data-target": 1
                    }];
                    if (n === zn.element) {
                        var c = a.getTargetCard();
                        return c ? [{
                            key: "copy",
                            title: "复制",
                            "data-id": dl(c.id).copy(),
                            "data-target": 1
                        }, {
                            key: "delete",
                            title: "删除",
                            "data-id": dl(c.id).delete(),
                            "data-target": 1
                        }, {
                            key: "multiple-selected",
                            title: o.data.multiple ? "退出多选" : "多选",
                            "data-id": dl(c.id).multiSelectMenu(),
                            "data-target": 1
                        }, jv(), c.type === sp.nop.type ? null : {
                            key: "simplify",
                            title: c.cfg.simplified ? "编辑卡片" : "简化卡片",
                            "data-id": dl(c.id).simplify(),
                            "data-target": 1
                        }, 1 === o.data.selectedCards.length && Jd.isDeviceCard(c.type) ? {
                            key: "replace",
                            title: "替换设备",
                            "data-id": dl(c.id).replace(),
                            "data-target": 1
                        } : null].filter(Boolean) : []
                    }
                    if (n === zn.mask) {
                        var u, l = t.length > 0;
                        return [null != (u = i.copyData) && u.graphId ? {
                            key: "paste",
                            title: "粘贴",
                            "data-id": zn.paste,
                            "data-target": 1
                        } : null, l ? {
                            key: "save", title: "保存", onClick: function () {
                                i.save(), r(!1), update()
                            }
                        } : null, {
                            key: "help", title: "帮助", onClick: function () {
                                Ri(Ti.TOGGLE_HELP_VISIBLE, !0), r(!1)
                            }
                        }, l ? {
                            key: "bat", title: "创建副本", onClick: function () {
                                i.appendBatGraph(), r(!1)
                            }
                        } : null, l ? {
                            key: "multiple-selected",
                            title: o.data.multiple ? "退出多选" : "多选",
                            "data-id": dl(zn.mask).multiSelectMenu(),
                            "data-target": 1
                        } : null, jv()].filter(Boolean)
                    }
                    return []
                }({cardList: t, targetType: v, setVisible: i});
                if (0 === g.length) return null;
                var y = function (e, t, n) {
                    var r = Pv * e.length + Rv, a = Jd.graphTool.containerSize,
                        o = {x1: 1, y1: 1, x2: a.width - Dv - 1, y2: a.height - r - 1}, i = t + Bv, c = n + Bv;
                    return i < o.x1 && (i = o.x1), i > o.x2 && (i = o.x2), c < o.y1 && (c = o.y1), c > o.y2 && (c = o.y2), i <= o.x1 && c <= o.y1 && (i = t + 2 * Bv), {
                        left: i,
                        top: c,
                        paddingTop: Rv / 2,
                        paddingBottom: Rv / 2
                    }
                }(g, s, p);
                return o.createElement("div", {
                    id: "action-container",
                    style: {position: "absolute", left: 0, top: 0, width: 0, height: 0}
                }, o.createElement("div", {
                    className: "right-menu",
                    style: Qv({position: "absolute"}, y),
                    onContextMenu: function (e) {
                        return e.preventDefault(), !1
                    }
                }, g.map((function (e) {
                    var t = e.key, n = e.title, r = Ke()(e, Nv);
                    return o.createElement("div", qe()({key: t}, Iv, r), n)
                }))))
            }

            function Zv(e) {
                var t = e.dragging;
                return e.visible ? o.createElement("div", {className: "panel-empty absolute-stretch ".concat(t ? "panel-empty-active" : "")}, "拖拽左侧内容至这里开始创建") : null
            }

            Mv.propTypes = {cardList: Z().array.isRequired}, Zv.propTypes = {
                dragging: Z().bool.isRequired,
                visible: Z().bool.isRequired
            };
            var Vv = (0, o.memo)((function (e) {
                var t = e.loading, n = e.isEmpty, r = (0, o.useState)(!1), a = I()(r, 2), i = a[0], c = a[1],
                    u = (0, o.useState)(null), l = I()(u, 2), s = l[0], p = l[1], f = (0, o.useState)({x: 0, y: 0}),
                    d = I()(f, 2), m = d[0], v = m.x, h = m.y, g = d[1], y = (0, o.useState)(""), A = I()(y, 2),
                    b = A[0], E = A[1], C = (0, o.useRef)({});
                (0, o.useEffect)((function () {
                    return Pi(Ti.POSITION, (function (e, t, n) {
                        if (t !== ki) if (t !== xi) {
                            if (t === Si) {
                                if (s && p(null), !i) return;
                                c(!1), Jd.target.type = ml(Jd.target.id).element, Jd.append(n.x, n.y), e.preventDefault()
                            }
                        } else {
                            if (!s) return;
                            Jd.coordinateTool.getSinglePosition(e).x < $n.left ? c(!1) : (c(!0), g({
                                x: n.rawX,
                                y: n.rawY
                            }))
                        } else {
                            C.current && C.current[Jd.target.id] && E(C.current[Jd.target.id]);
                            var r = sp[ml(Jd.target.id).element];
                            r && p(r)
                        }
                    }))
                }), [s, i]);
                var O = !t && n;
                return (0, o.useEffect)((function () {
                    var e;
                    null == (e = document.querySelectorAll(".graph-ele-list .ele-item")) || e.forEach((function (e) {
                        (0, uf.YM)(e, {style: {}, skipFonts: !0, useCORS: !0}).then((function (t) {
                            C.current[e.getAttribute("data-id")] = t
                        }))
                    }))
                }), []), o.createElement(o.Fragment, null, s && i ? o.createElement("div", {
                    className: "dragging-card",
                    style: {
                        position: "absolute",
                        transform: "translate3d(".concat(v, "px, ").concat(h, "px, 0)"),
                        textAlign: "center"
                    }
                }, o.createElement("img", {
                    style: {
                        position: "absolute",
                        left: -20,
                        top: -10,
                        width: 152,
                        borderRadius: 8
                    }, src: b
                })) : null, o.createElement(Zv, {dragging: Boolean(s), visible: O}))
            }));
            const Hv = Vv;

            function Fv(e) {
                var t = e.type, n = e.cardModel, r = (0, o.useState)(!1), a = I()(r, 2), i = a[0], c = a[1];
                return o.createElement(ho, {
                    title: n.tip,
                    placement: "right",
                    open: i
                }, o.createElement("div", {
                    className: "ele-item",
                    "data-type": t,
                    "data-id": dl(t).cardBox(),
                    "data-target": 1,
                    onMouseEnter: function () {
                        return c(!0)
                    },
                    onMouseLeave: function () {
                        return c(!1)
                    }
                }, n.label))
            }

            function Gv() {
                var e = [{type: ne, list: [ip.deviceInput, ip.deviceGet, ip.deviceOutput]}, {
                    type: re,
                    list: [ip.alarmClock, ip.timeRange, ip.delay, ip.statusLast, ip.eventSequence]
                }, {type: ae, list: [ip.condition, ip.loop, ip.onlyNTimes, ip.counter, ip.modeSwitch]}, {
                    type: oe,
                    list: [ip.signalOr, ip.logicOr, ip.logicAnd, ip.logicNot]
                }, {type: ie, list: [ip.register, ip.onLoad]}, {
                    type: ce,
                    list: [ip.deviceInputSetVar, ip.deviceGetSetVar, ip.varChange, ip.varGet, ip.varSetNumber, ip.varSetString]
                }];
                return o.createElement("div", {
                    className: "graph-ele",
                    "data-target": "1",
                    "data-id": zn.cardBox
                }, o.createElement("div", {className: "graph-ele-list"}, e.map((function (e) {
                    return o.createElement("div", {
                        key: e.type,
                        className: "graph-ele-item graph-ele-condition"
                    }, o.createElement("div", {className: "ele-title"}, ue[e.type]), o.createElement("div", {className: "ele-list"}, e.list.map((function (e) {
                        return o.createElement(Fv, {key: e, type: e, cardModel: sp[e]})
                    }))))
                }))))
            }

            Vv.propTypes = {
                loading: Z().bool.isRequired,
                isEmpty: Z().bool.isRequired
            }, Fv.propTypes = {type: Z().string.isRequired, cardModel: Z().object.isRequired};
            const Yv = o.memo(Gv);

            function zv(e) {
                return e.loading ? o.createElement("div", {className: "panel-loading"}, o.createElement("img", {src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD4SURBVHgBrVPRDYJADK2ETxgABsAFGMABdAAcgAFkAOO/8V8WYAD5dwHivw4gA7iALXnHnccJJvKSF6DXvrbXQvQnFg5byMyYG2YE2wMsmc8xAQna4b02nBNmygwgUpEDkrVhFqjCRoSzBokGh1c4TKGAb5fEgzFnvr6VhhZWCCqNinuBJfNG1gUBEnRmHpl7JKpVG56R4U5uBKTvRD0lUTchn6bRMg9IMmjRN5ziEZGL9S1ishd9C+KwJvf4bEjpqS2gSst/ENiSXqgPSAVqkVzthKQXKVNGe5Uz0jshY1WTiZFAcCLjTlw/UwQR2Y0EthZBFcTnwxt/tS5oQsjoNQAAAABJRU5ErkJggg=="}), "自动化加载中") : null
            }

            zv.propTypes = {loading: Z().bool.isRequired};
            var Uv = 8, qv = ["#80CAFF", "#85E0A3", "#FFD966", "#D9B8FF", "#F0F0F0"];

            function Xv(e) {
                var t = e.toolBar2, n = e.contentEditable, r = e.cardItem, a = e.instance;
                if (t === Mn.NONE) return null;
                if (!n) return null;
                if (!r) return null;
                if (!a) return null;
                var i = g((function () {
                    return a.getFormat()
                }), {}), c = 0, u = 0, l = null;
                return t === Mn.COLOR && (c = 36 + Uv, l = qv.map((function (e) {
                    return o.createElement("div", {
                        key: e,
                        className: "nop-toolbar-menu-color-item",
                        "data-target": 1,
                        "data-id": dl(e, Mn.COLOR).toolbox(),
                        style: {borderColor: e === r.cfg.background ? e : "transparent"}
                    }, o.createElement("div", {
                        className: "nop-toolbar-menu-color-item-content",
                        style: {backgroundColor: e}
                    }))
                }))), t === Mn.ALIGN && (c = 36 + Uv, u = 140, l = Kv.map((function (e) {
                    var t = e.Icon, n = e.value;
                    return o.createElement(t, {
                        className: "nop-toolbar-menu-align-item icon-square ".concat(n === Zn.LEFT && !i.align || i.align === n ? "bg-active" : "text-color-level2"),
                        key: n,
                        "data-target": 1,
                        "data-id": dl(n, Mn.ALIGN).toolbox()
                    })
                }))), t === Mn.HEADER && (c = 120 + Uv, u = 167, l = o.createElement("div", {className: "nop-toolbar-menu-header-item-wrapper"}, Wv.map((function (e) {
                    var t = e.Icon, n = e.value, r = e.fontSize,
                        a = i.header && parseInt(i.header) === n || !i.header && 0 === n;
                    return o.createElement("div", {
                        key: n,
                        className: "nop-toolbar-menu-header-item ".concat(a ? "nop-toolbar-menu-header-item-active" : ""),
                        "data-id": dl(n, Mn.HEADER).toolbox(),
                        "data-target": 1
                    }, o.createElement(t, {className: "icon-square text-color-level2"}), o.createElement("span", {className: "text-color-level4 font-size-10"}, r))
                })))), o.createElement("div", {
                    className: "nop-toolbar-menu",
                    style: {left: u, top: -c},
                    onMouseDown: lr
                }, l)
            }

            Xv.propTypes = {
                toolBar2: Z().string.isRequired,
                contentEditable: Z().string.isRequired,
                cardItem: Z().object.isRequired,
                instance: Z().object.isRequired
            };
            var Kv = [{Icon: kn.RichTextAlignLeft, value: Zn.LEFT}, {
                Icon: kn.RichTextAlignMiddle,
                value: Zn.CENTER
            }, {Icon: kn.RichTextAlignRight, value: Zn.RIGHT}], Wv = [{Icon: kn.RichTextH1, value: Vn, fontSize: 18}, {
                Icon: kn.RichTextH2,
                value: Hn,
                fontSize: 16
            }, {Icon: kn.RichTextH3, value: Fn, fontSize: 14}, {Icon: kn.RichTextT, value: Gn, fontSize: 14}];

            function Jv(e) {
                var t = e.cardList, n = Jd.settings.contentEditable;
                if (!n) return null;
                var r = Ur(t, n);
                if (!r) return null;
                var a = Jd.elements.nop.instance[r.id];
                if (!a) return null;
                var i, c = g((function () {
                        return a.getFormat()
                    }), {}), u = r.cfg.pos, l = u.x, s = u.y, p = Jd.coordinateTool.standReversePos(l, s),
                    f = (i = c.header, i = parseInt(i), (Wv.find((function (e) {
                        return e.value === i
                    })) || {}).Icon || kn.RichTextT);
                return o.createElement("div", {
                    className: "nop-toolbar",
                    "data-target": 1,
                    style: {left: p.rawX, top: p.rawY - 46},
                    onMouseDown: lr
                }, o.createElement(Xv, {
                    toolBar2: Jd.elements.nop.toolBar2,
                    contentEditable: n,
                    cardItem: r,
                    instance: a
                }), o.createElement("div", {
                    className: "nop-toolbar-box-item",
                    "data-target": 1,
                    "data-id": dl(Mn.COLOR, Mn.SHOW).toolbox()
                }, o.createElement("div", {
                    className: "nop-toolbar-box-item-circle",
                    style: {background: r.cfg.background}
                }), o.createElement(kn.Down, {style: {fontSize: 14}})), o.createElement("div", {className: "nop-toolbar-box-border"}), o.createElement("div", {
                    "data-target": 1,
                    "data-id": dl(r.id, Mn.BOLD).toolbox(),
                    className: "nop-toolbar-box-item ".concat(c.bold ? "active" : "")
                }, o.createElement(kn.RichTextBold, null)), o.createElement("div", {
                    className: "nop-toolbar-box-item ".concat(c.list === Yn ? "active" : ""),
                    "data-target": 1,
                    "data-id": dl(r.id, Mn.LIST).toolbox()
                }, o.createElement(kn.RichTextList, null)), o.createElement("div", {className: "nop-toolbar-box-border"}), o.createElement("div", {
                    className: "nop-toolbar-box-item",
                    "data-target": 1,
                    "data-id": dl(Mn.ALIGN, Mn.SHOW).toolbox()
                }, Kv.map((function (e) {
                    var t = e.Icon, n = e.value;
                    return n === Zn.LEFT && !c.align || n === c.align ? o.createElement(t, {key: n}) : null
                })), o.createElement(kn.Down, {style: {fontSize: 14}})), o.createElement("div", {
                    className: "nop-toolbar-box-item",
                    "data-target": 1,
                    "data-id": dl(Mn.HEADER, Mn.SHOW).toolbox()
                }, o.createElement(f, null), o.createElement(kn.Down, {style: {fontSize: 14}})))
            }

            function _v() {
                var e = Kf();
                return e ? o.createElement("div", {className: "scroll-bar-x"}, o.createElement("div", {
                    className: "scroll-bar-x-box",
                    style: {width: "".concat(100 * e.barSize, "%"), left: "".concat(100 * e.barStart, "%")},
                    "data-target": "1",
                    "data-id": zn.scrollBarX,
                    "data-x": e.start
                }, o.createElement("div", {className: "scroll-bar-x-box-item"}))) : null
            }

            function $v() {
                var e = Wf();
                return e ? o.createElement("div", {className: "scroll-bar-y"}, o.createElement("div", {
                    className: "scroll-bar-y-box",
                    style: {height: "".concat(100 * e.barSize, "%"), top: "".concat(100 * e.barStart, "%")},
                    "data-target": "1",
                    "data-id": zn.scrollBarY,
                    "data-x": e.start
                }, o.createElement("div", {className: "scroll-bar-y-box-item"}))) : null
            }

            function eh() {
                return o.createElement("div", {className: "scroll-bar"}, o.createElement(_v, null), o.createElement($v, null))
            }

            function th(e, t) {
                var n = e.end - e.start;
                return k((t - e.start) / n, 0, 1)
            }

            function nh(e) {
                if (e < 0) return 0;
                var t = Jd.graphTool.containerSize;
                return e > t.width - 120 ? t.width - 120 : e
            }

            Jv.propTypes = {cardList: Z().array.isRequired};
            var rh = (0, o.memo)((function (e) {
                var t = e.frameRange, n = e.index, r = e.setIndex, a = e.getFrameByIndex, i = (0, o.useState)(0),
                    c = I()(i, 2), u = c[0], l = c[1], s = (0, o.useState)(!1), p = I()(s, 2), f = p[0], d = p[1],
                    m = (0, o.useState)(!1), v = I()(m, 2), h = v[0], g = v[1], y = (0, o.useState)(-1), A = I()(y, 2),
                    b = A[0], E = A[1], C = (0, o.useMemo)((function () {
                        var e = f ? b : h ? n : -1;
                        if (e < 0) return "";
                        var t = a(e);
                        return R()(t.timestamp).format(Wn)
                    }), [f, h, n, b]);
                (0, o.useEffect)((function () {
                    var e = Jd.graphTool.containerSize;
                    l(th(t, n) * e.width - 60)
                }), [t, n]), (0, o.useEffect)((function () {
                    return Pi(Ti.LOG_BAR_UPDATE, (function (e) {
                        var n, a = Jd.graphTool,
                            o = (((null == (n = e.touches) ? void 0 : n[0]) || e).clientX - $n.left) * (t.end - t.start) / a.containerSize.width,
                            i = t.start + Math.round(o);
                        i = (i = i < t.start ? t.start : i) > t.end ? t.end : i, r(i)
                    }))
                }), [t]), (0, o.useEffect)((function () {
                    return Pi(Ti.LOG_BAR_CLICK, g)
                }), []);
                var O = function (e) {
                    var n = Jd.graphTool.containerSize,
                        r = Math.round(t.start + (e.clientX - $n.left) * (t.end - t.start) / n.width);
                    l(e.clientX - $n.left - 60), E(r)
                }, w = "".concat(100 * th(t, n), "%");
                return o.createElement("div", {className: "panel-log-bar ".concat(f || h ? "panel-log-bar-active" : "")}, o.createElement("div", {
                    className: "panel-log-bar-hot absolute-stretch",
                    "data-id": "log.bar.0",
                    "data-target": 1,
                    onPointerEnter: function (e) {
                        d(!0), O(e)
                    },
                    onPointerMove: function (e) {
                        O(e)
                    },
                    onPointerLeave: function (e) {
                        d(!1)
                    }
                }), o.createElement("div", {className: "panel-log-bar-bg absolute-stretch"}), o.createElement("div", {
                    className: "panel-log-bar-fg",
                    style: {width: w}
                }), f || h ? o.createElement("div", {
                    className: "panel-log-step panel-log-time",
                    style: {left: nh(u)}
                }, C) : null)
            }));
            const ah = rh;

            function oh(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ih(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? oh(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : oh(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            rh.propTypes = {
                frameRange: Z().shape({
                    start: Z().number.isRequired,
                    end: Z().number.isRequired
                }).isRequired,
                index: Z().number.isRequired,
                setIndex: Z().func.isRequired,
                getFrameByIndex: Z().func.isRequired
            };
            var ch = (0, o.memo)((function (e) {
                var t = e.value, n = e.onChange, r = function (e) {
                    n(ih(ih({}, t), e))
                };
                return o.createElement(o.Fragment, null, o.createElement(Vr, {
                    className: "panel-log-date-picker",
                    onOpenChange: Jd.lockScroll,
                    value: R()(t.startDay),
                    onChange: function (e) {
                        r({startDay: R()(e).format(Jn)})
                    },
                    disabledDate: function (e) {
                        return !e || (e > R()().endOf("day") || e > R()(t.endDay, Jn).endOf("day"))
                    }
                }), o.createElement(xr, {
                    className: "panel-log-date-picker",
                    onOpenChange: Jd.lockScroll,
                    onChange: function (e) {
                        r({startTime: R()(e).format(_n)})
                    },
                    value: R()(t.startTime, _n)
                }), o.createElement("span", {className: "panel-log-date-picker-separator panel-log-time"}, "~"), o.createElement(Vr, {
                    className: "panel-log-date-picker",
                    value: R()(t.endDay),
                    onOpenChange: Jd.lockScroll,
                    onChange: function (e) {
                        r({endDay: R()(e).format(Jn)})
                    },
                    disabledDate: function (e) {
                        return !e || (e > R()().endOf("day") || e.valueOf() < R()(t.startDay, Jn).valueOf())
                    }
                }), o.createElement(xr, {
                    className: "panel-log-date-picker",
                    onOpenChange: Jd.lockScroll,
                    value: R()(t.endTime, _n),
                    onChange: function (e) {
                        r({endTime: R()(e).format(_n)})
                    }
                }))
            }));
            const uh = ch;

            function lh(e) {
                var t = e.timeFlag, n = e.frameRange, r = e.index, i = e.setIndex, c = e.setIndexHandle,
                    u = Jd.selectTool.data, l = u.selectedCards, s = u.selectedLogLines, p = u.multipleLog,
                    f = (0, o.useMemo)((function () {
                        return [].concat(a()(l), a()(s))
                    }), [l, s]), d = (0, o.useState)(p), m = I()(d, 2), v = m[0], h = m[1], g = (0, o.useState)(p),
                    y = I()(g, 2), A = y[0], b = y[1];
                return (0, o.useEffect)((function () {
                }), [p]), (0, o.useEffect)((function () {
                    var e;
                    return p && (h(p), b(p), e = setTimeout((function () {
                        h(!1), b(!1)
                    }), 5e3)), function () {
                        e && clearTimeout(e)
                    }
                }), [p]), o.createElement(o.Fragment, null, p && o.createElement(ho, {
                    placement: "top",
                    title: "回退至上一关注",
                    open: v
                }, o.createElement(kn.DebugLeft, {
                    className: "panel-log-header-go-left  icon-large icon-square ".concat(r <= n.start || 0 === f.length ? "disabled" : "icon-circle"),
                    style: {
                        fontSize: 12,
                        marginRight: -20,
                        display: "inline-block",
                        textAlign: "center",
                        lineHeight: "26px"
                    },
                    onClick: function () {
                        r <= n.start || c(r - 1, -1)
                    }
                })), o.createElement(kn.LogLeft, {
                    className: "panel-log-header-go-left  icon-large  icon-square ".concat(r <= n.start ? "disabled" : "icon-circle"),
                    onClick: function () {
                        r <= n.start || i(r - 1)
                    }
                }), o.createElement("div", {className: "panel-log-header-current panel-log-time"}, t), o.createElement(kn.LogRight, {
                    className: "panel-log-header-go-right icon-large  icon-square ".concat(r >= n.end ? "disabled" : "icon-circle"),
                    onClick: function () {
                        r >= n.end || i(r + 1)
                    }
                }), p && o.createElement(ho, {
                    placement: "top",
                    title: "跳跃至下一关注",
                    open: A
                }, o.createElement(kn.DebugRight, {
                    className: "panel-log-header-go-right icon-large icon-square ".concat(r >= n.end || 0 === f.length ? "disabled" : "icon-circle"),
                    style: {
                        fontSize: 12,
                        marginLeft: -20,
                        display: "inline-block",
                        textAlign: "center",
                        lineHeight: "26px"
                    },
                    onClick: function () {
                        r >= n.end || c(r + 1, 1)
                    }
                })))
            }

            ch.propTypes = {
                value: Z().shape({
                    startDay: Z().string.isRequired,
                    startTime: Z().string.isRequired,
                    endDay: Z().string.isRequired,
                    endTime: Z().string.isRequired
                }).isRequired, onChange: Z().func.isRequired
            }, lh.propTypes = {
                timeFlag: Z().string.isRequired,
                frameRange: Z().shape({start: Z().number.isRequired, end: Z().number.isRequired}).isRequired,
                index: Z().number.isRequired,
                setIndex: Z().func.isRequired
            };
            var sh = "loading-log";

            function ph() {
                return {
                    startDay: R()().add(-1, "days").format(Jn),
                    startTime: R()("00:00:00", _n).format(_n),
                    endDay: R()().format(Jn),
                    endTime: R()().format(_n)
                }
            }

            var fh = (0, o.memo)((function () {
                var e = (0, o.useState)(!1), t = I()(e, 2), n = t[0], r = t[1], a = (0, o.useState)(!1), i = I()(a, 2),
                    c = i[0], u = i[1], l = (0, o.useState)({start: 0, end: 0}), s = I()(l, 2), p = s[0], f = s[1],
                    d = (0, o.useState)(-1), m = I()(d, 2), v = m[0], h = m[1], g = (0, o.useState)(ph()),
                    y = I()(g, 2), A = y[0], b = y[1], E = (0, o.useRef)({}), C = Jd.selectTool.data,
                    O = C.selectedCards, w = C.selectedLogLines;

                function k(e) {
                    if (e < 0) return null;
                    if (!E.current) return null;
                    try {
                        return E.current.getStepStatus(e)
                    } catch (t) {
                        return null
                    }
                }

                var x = (0, o.useMemo)((function () {
                    return w.map((function (e) {
                        return e.split(".").slice(1).join(".")
                    }))
                }), [w]), S = (0, o.useCallback)((function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, n = k(e);
                    if (n) {
                        if (null != n && n.new && n.new.includes("link:")) {
                            var r = n.new.split("link:")[1].replace("->", ".");
                            x.includes(r) ? (Ri(Ti.LOG_DATA_UPDATE, {
                                frameRange: p,
                                indexParam: e,
                                currentFrame: n
                            }), h(e)) : S(e + t, t)
                        }
                        if (null != n && n.new && n.new.includes("node:")) {
                            var a = n.new.split("node:")[1];
                            O.includes(a) ? (Ri(Ti.LOG_DATA_UPDATE, {
                                frameRange: p,
                                indexParam: e,
                                currentFrame: n
                            }), h(e)) : S(e + t, t)
                        }
                    }
                }), [x, O]);
                (0, o.useEffect)((function () {
                    Ri(Ti.LOG_DATA_UPDATE, {frameRange: p, index: v, currentFrame: k(v)})
                }), [p, v]), (0, o.useEffect)((function () {
                    b(ph()), D(), f({start: 0, end: 0}), h(-1)
                }), []);
                var T = k(v), D = function () {
                    P().then((function () {
                        B()
                    }))
                }, P = function () {
                    var e = Fr()(Yr().mark((function e() {
                        var t, n, a, o;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (Jd.graphTool.id) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 2:
                                    return e.prev = 2, oo.loading("加载日志中...", {
                                        duration: 0,
                                        key: sh
                                    }), r(!0), u(!1), t = Jd.graphTool.graphConfig, n = (new Date).getTime(), e.next = 10, Jr.kd.parseLog(t);
                                case 10:
                                    return a = e.sent, e.next = 13, Jr.kd.getLogAnimationCalculator({
                                        ruleCfg: Jd.graphTool.graphConfig,
                                        log: a
                                    });
                                case 13:
                                    E.current = e.sent, o = (new Date).getTime(), setTimeout((function () {
                                        r(!1), oo.destroy(sh)
                                    }), o - n > 500 ? 0 : 500 - (o - n)), e.next = 24;
                                    break;
                                case 18:
                                    e.prev = 18, e.t0 = e.catch(2), oo.destroy(sh), r(!1), oo.warning("获取日志失败");
                                case 24:
                                case"end":
                                    return e.stop()
                            }
                        }), e, null, [[2, 18]])
                    })));
                    return function () {
                        return e.apply(this, arguments)
                    }
                }(), B = function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : A;
                    try {
                        var t = E.current.getStepRangeFromTimeRange({
                            start: R()("".concat(e.startDay, " ").concat(e.startTime)).valueOf(),
                            end: R()("".concat(e.endDay, " ").concat(e.endTime)).valueOf()
                        }), n = v;
                        v < t.start ? n = t.start : v > t.end && (n = t.end), f(t), h(n), u(!0), oo.destroy(sh), oo.success("获取日志成功")
                    } catch (r) {
                        oo.destroy(sh), u(!1), oo.warning("未获取到日志，请选择合适的时间段")
                    }
                }, j = T ? R()(T.timestamp).format(Wn) : "";
                return o.createElement("div", {className: "panel-log"}, T && void 0 === T.new ? o.createElement("div", {className: "panel-log-reload"}, "自动化重载") : null, c && o.createElement(ah, {
                    frameRange: p,
                    index: v,
                    setIndex: h,
                    getFrameByIndex: k
                }), o.createElement("div", {className: "panel-log-header"}, o.createElement("div", {className: "panel-log-header-left"}, o.createElement(kn.Refresh, {
                    className: "panel-log-header-refresh icon-square icon-large ".concat(n ? "icon-rotate" : ""),
                    style: {color: "rgba(0,0,0,0.6)"},
                    onClick: D
                }), o.createElement(uh, {
                    value: A, onChange: function (e) {
                        b(e), B(e)
                    }
                }), c ? o.createElement(lh, {
                    timeFlag: j,
                    frameRange: p,
                    index: v,
                    setIndex: h,
                    setIndexHandle: S
                }) : null)))
            }));
            const dh = fh;
            var mh = (0, o.memo)((function (e) {
                var t = e.multiple, n = e.selectedCards;
                return t ? o.createElement("div", {className: "graph-select-toolbox"}, o.createElement("div", {
                    className: "graph-select-toolbox-hotpot",
                    "data-target": 1
                }, o.createElement(kn.AlignLeft, {
                    className: "icon-grey",
                    style: {fontSize: 20}
                }), o.createElement(kn.Down, {style: {fontSize: 14}}), o.createElement("div", {className: "select-toolbox-submenu"}, o.createElement(Tv, {selectedCards: n}))), o.createElement("div", {
                    className: "graph-select-toolbox-hotpot",
                    "data-target": 1,
                    "data-id": dl(zn.default).copyAndPaste()
                }, o.createElement(kn.CopyPaste, null)), o.createElement("div", {
                    className: "graph-select-toolbox-hotpot",
                    "data-target": 1,
                    "data-id": dl(zn.default).delete()
                }, o.createElement(kn.Delete, null)), o.createElement("div", {className: "graph-select-toolbox-sep"}), o.createElement("div", {
                    className: "graph-select-toolbox-hotpot",
                    "data-target": 1,
                    "data-id": dl(zn.default).multiSelectMenu()
                }, o.createElement(kn.Close, null))) : null
            }));
            const vh = mh;
            mh.propTypes = {selectedCards: Z().arrayOf(Z().string).isRequired, multiple: Z().bool.isRequired};
            var hh = (0, o.memo)((function () {
                var e = (0, o.useState)(!1), t = I()(e, 2), n = t[0], r = t[1], a = function () {
                    return o.createElement("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            padding: "0 12px"
                        }, onKeyDown: function (e) {
                            return e.stopPropagation()
                        }, onKeyUp: function (e) {
                            return e.stopPropagation()
                        }, onClick: function (e) {
                            e.stopPropagation(), n || (Jd.selectTool.data.multipleLog = !0, Jd.selectTool.data.multiple = !1, r(!0), window.update())
                        }
                    }, o.createElement(kn.Vector, {
                        className: "icon-square",
                        style: {fontSize: 14}
                    }), o.createElement("span", {
                        className: "graph-select-log-toolbox-text",
                        style: {color: "var(--text-color-level2)"}
                    }, "标记关注"), n ? o.createElement(o.Fragment, null, o.createElement(kn.Down, {className: "icon-square"}), o.createElement("span", {className: "graph-select-log-toolbox-line"}), o.createElement(kn.Close, {
                        className: "icon-square",
                        style: {marginRight: -4},
                        onClick: function () {
                            Jd.selectTool.data.multipleLog = !1, Jd.selectTool.toggleMultiSelectArray([]), Jd.selectTool.toggleMultiSelectLineArray([]), r(!1), window.update()
                        }
                    })) : null)
                };
                return (0, o.useEffect)((function () {
                    Jd.selectTool.data.multiple && r(!1)
                }), [Jd.selectTool.data.multiple]), o.createElement("div", {
                    className: "graph-select-log-toolbox",
                    style: {right: Jd.selectTool.data.multiple ? 200 : 18}
                }, n ? o.createElement(fo, {
                    placement: "bottomRight",
                    menu: {
                        items: [{
                            key: "all", label: o.createElement("div", {
                                onClick: function (e) {
                                    e.preventDefault(), Jd.selectTool.toggleMultiSelectArray(Jd.data.map((function (e) {
                                        return e.id
                                    }))), Jd.selectTool.toggleMultiSelectLineArray(Jd.lineData.map((function (e) {
                                        return e.dataId
                                    }))), window.update()
                                }
                            }, "全选")
                        }, {
                            key: "no", label: o.createElement("div", {
                                onClick: function (e) {
                                    e.preventDefault(), Jd.selectTool.toggleMultiSelectArray([]), Jd.selectTool.toggleMultiSelectLineArray([]), window.update()
                                }
                            }, "全不选")
                        }]
                    }
                }, a()) : a())
            }));
            const gh = hh;
            hh.propTypes = {};
            n(21674), n(66479), n(77994);
            var yh = n(42507);

            function Ah(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function bh(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ah(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ah(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Eh = "room", Ch = "device", Oh = "ALL", wh = {key: Oh, label: "全部"}, kh = function (e) {
                var t = e.roomTags, n = e.deviceTypeTags, r = e.checkedRoomIds, a = e.checkedDeviceTypes,
                    i = e.roomTagKey, c = void 0 === i ? "roomIds" : i, u = e.deviceTypeTagKey,
                    l = void 0 === u ? "deviceTypes" : u, s = e.onFilter,
                    p = (0, o.useState)(H()(H()({}, Eh, !0), Ch, !0)), f = I()(p, 2), d = f[0], m = f[1],
                    v = function (e) {
                        m((function (t) {
                            return bh(bh({}, t), {}, H()({}, e, !t[e]))
                        }))
                    }, h = (0, o.useRef)(s);
                (0, o.useEffect)((function () {
                    h.current = s
                }), [s]);
                var g = (0, o.useCallback)((function (e) {
                    if (e !== Oh) {
                        var t = r.slice(0), n = t.indexOf(e);
                        n > -1 ? t.splice(n, 1) : t.push(e), h.current && h.current(c, t)
                    } else h.current && h.current(c, [])
                }), [r, c]), y = (0, o.useCallback)((function (e) {
                    if (e !== Oh) {
                        var t = a.slice(0), n = t.indexOf(e);
                        n > -1 ? t.splice(n, 1) : t.push(e), h.current && h.current(l, t)
                    } else h.current && h.current(l, [])
                }), [a, l]);
                return o.createElement("div", {className: "device-tag-filter"}, o.createElement("div", {className: "device-tag-filter-item"}, o.createElement("div", {
                    className: "item-title",
                    onClick: function () {
                        return v(Eh)
                    }
                }, o.createElement(kn.Right2, {className: "icon ".concat(d[Eh] ? "open" : "")}), " ", o.createElement("span", {className: "label"}, "房间")), d[Eh] ? o.createElement("div", {className: "tag-list"}, [wh].concat(t).map((function (e) {
                    return o.createElement("div", {
                        className: "tag-cell ".concat(e.key === Oh && 0 === r.length || r.includes(e.key) ? "bg-active" : ""),
                        key: e.key,
                        onClick: function () {
                            return g(e.key)
                        }
                    }, e.label)
                }))) : null), o.createElement("div", {className: "device-tag-filter-item"}, o.createElement("div", {
                    className: "item-title",
                    onClick: function () {
                        return v(Ch)
                    }
                }, o.createElement(kn.Right2, {className: (0, Ge.Z)("icon", {open: d[Ch]})}), " ", o.createElement("span", {className: "label"}, "品类")), d[Ch] ? o.createElement("div", {className: "tag-list"}, [wh].concat(n).map((function (e) {
                    return o.createElement("div", {
                        className: "tag-cell ".concat(e.key === Oh && 0 === a.length || a.includes(e.key) ? "bg-active" : ""),
                        key: e.key,
                        onClick: function () {
                            return y(e.key)
                        }
                    }, e.label)
                }))) : null))
            };
            const xh = o.memo(kh);
            var Sh = n(63754);
            const Th = o.memo((function () {
                return o.createElement(Sh.Z, {
                    trigger: "click",
                    placement: "bottomRight",
                    content: o.createElement("dl", {className: "not-found-device-hint"}, o.createElement("dt", null, "中枢无法探测到设备"), o.createElement("dd", null, "虚拟设备无法被探测"), o.createElement("dd", null, "老设备组无法被探测"), o.createElement("dt", null, "不支持标准协议的设备"), o.createElement("dt", null, "设备不在线"), o.createElement("dt", null, "设备没有相应能力"), o.createElement("dd", null, "没有上报的属性/设备不支持上报"), o.createElement("dd", null, "没有可以控制的功能"), o.createElement("dd", null, "没有可以获取的信息"))
                }, o.createElement("a", null, "找不到设备?"))
            }));
            var Dh = o.memo((function (e) {
                var t = e.data, n = e.onClick;
                return o.createElement("div", {
                    className: (0, Ge.Z)("common-device-cell", T().isDark ? "common-device-cell-filter" : "", {clickable: !!n}),
                    onClick: function () {
                        n && n(t)
                    },
                    "aria-hidden": "false"
                }, o.createElement(Fe.Z, {
                    rootClassName: "device-thumb",
                    src: t.icon,
                    preview: !1,
                    fallback: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                }), o.createElement("div", {className: "device-desc"}, o.createElement("h5", {
                    className: "device-name",
                    title: t.name
                }, t.name), o.createElement("p", {
                    className: "device-meta",
                    title: "".concat(t.roomName || "未分配", " | ").concat(t.deviceTypeDescription)
                }, t.roomName || "未分配", o.createElement("span", {className: "meta-divider"}), t.deviceTypeDescription)))
            }));
            const Ph = Dh;

            function Rh(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Bh(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Rh(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rh(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Ih = function (e) {
                var t, n, r, a = e.visible, i = e.setVisible, c = e.data, u = void 0 === c ? {} : c, l = e.clearTiHuan,
                    s = (null == u ? void 0 : u.same) || [];
                return o.createElement(to, {
                    footer: null,
                    className: "device-modal",
                    open: a,
                    title: o.createElement("div", {className: "device-modal-child-modal-title"}, o.createElement("div", {className: "device-modal-child-modal-icon"}, o.createElement("img", {src: null == u || null == (t = u.record) ? void 0 : t.icon})), o.createElement("section", {className: "device-modal-child-modal-title-wrapper"}, o.createElement("div", null, null == u || null == (n = u.record) ? void 0 : n.modelName), o.createElement("span", {className: "device-modal-child-modal-subtitle"}, null == u || null == (r = u.record) ? void 0 : r.deviceTypeDescription))),
                    onCancel: function () {
                        i(!1)
                    },
                    placement: "right",
                    width: 480
                }, o.createElement("div", {className: "device-modal-child-modal-select-title"}, "选择替换功能"), null == s ? void 0 : s.map((function (e) {
                    return o.createElement("div", {
                        key: e.sDescription + e.description,
                        className: "device-modal-child-modal-item",
                        onClick: function () {
                            var t, n, r, a, o, c, s, p = Jd.gateway.data, f = p.pos, d = f.x, m = f.y, v = p.deviceType;
                            Jd.appendInstance({
                                x: d,
                                y: m,
                                type: v,
                                urn: null == u || null == (t = u.record) ? void 0 : t.urn,
                                did: null == u || null == (n = u.record) ? void 0 : n.did,
                                isTiHuan: {
                                    inputs: null == u || null == (r = u.targetCard) ? void 0 : r.inputs,
                                    outputs: null == u || null == (a = u.targetCard) ? void 0 : a.outputs,
                                    deviceType: v,
                                    props: Bh(Bh({}, null == u || null == (o = u.targetCard) ? void 0 : o.props), {}, {
                                        did: null == u || null == (c = u.record) ? void 0 : c.did,
                                        siid: null == e ? void 0 : e.siid,
                                        eiid: null == e ? void 0 : e.eiid,
                                        piid: null == e ? void 0 : e.piid
                                    })
                                }
                            }), Jd.gateway.hideModal(), Jd.gateway.getDeviceDetail(null == u || null == (s = u.record) ? void 0 : s.urn), i(!1), l(), update()
                        }
                    }, e.sDescription, "-", e.description)
                })))
            };
            const jh = o.memo(Ih);

            function Nh(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Lh(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Nh(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Nh(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Qh = (new Date).getTime(), Mh = function (e) {
                var t = e.visible, n = (0, o.useRef)(),
                    r = (0, o.useState)({keyword: "", roomIds: [], deviceTypes: []}), i = I()(r, 2), c = i[0], u = i[1],
                    l = (0, o.useState)(!0), s = I()(l, 2), p = s[0], f = s[1], d = (0, o.useState)(!1), m = I()(d, 2),
                    v = m[0], h = m[1], g = Jd.gateway.getGivenData(), y = g.devices, A = g.roomTags, b = g.typeTags,
                    E = (0, o.useRef)(y), C = (0, o.useMemo)((function () {
                        return (0, U.isEqual)(E.current, y) || (E.current = y), E.current
                    }), [y]), O = function (e, t) {
                        return parseInt(e.roomId) - parseInt(t.roomId)
                    }, w = (0, o.useState)(), k = I()(w, 2), x = k[0], S = k[1];
                (0, o.useEffect)((function () {
                    var e;
                    if (!0 === t && Jd.gateway.data.isTiHuan) {
                        var n = function (e) {
                            var t, n;
                            return Object.keys(e).forEach((function (t) {
                                void 0 === e[t] && delete e[t]
                            })), Jr.q3.findSimilarDevice(i, null == r || null == (t = r.cfg) ? void 0 : t.urn, e, null == (n = o[r.type]) ? void 0 : n.usage).then((function (e) {
                                var t = {};
                                return e.forEach((function (e) {
                                    var n = i[e.did], r = Jd.gateway.data.urnMap[n.urn];
                                    t[n.urn] || (t[n.urn] = Lh(Lh({}, r), {}, {same: []}));
                                    var o = [].concat(a()(r.propertyGet), a()(r.propertyNotify), a()(r.propertySet), a()(r.action), a()(r.event)).find((function (t) {
                                        return Object.keys(e).filter((function (e) {
                                            return "did" !== e
                                        })).every((function (n) {
                                            return t[n] === e[n]
                                        }))
                                    }));
                                    t[n.urn].same.push(Lh(Lh({}, e), o))
                                })), t
                            }))
                        }, r = Jd.gateway.data.targetCard, o = {
                            deviceInput: {
                                usage: "notify", getCapability: function (e) {
                                    return [].concat(a()((null == e ? void 0 : e.propertyNotify) || []), a()((null == e ? void 0 : e.event) || []))
                                }
                            }, deviceGet: {
                                usage: "get", getCapability: function (e) {
                                    return a()((null == e ? void 0 : e.propertyGet) || [])
                                }
                            }, deviceOutput: {
                                usage: "set", getCapability: function (e) {
                                    return [].concat(a()((null == e ? void 0 : e.propertySet) || []), a()((null == e ? void 0 : e.action) || []))
                                }
                            }, deviceInputSetVar: {
                                usage: "notify", getCapability: function (e) {
                                    return [].concat(a()((null == e ? void 0 : e.propertyNotify) || []), a()((null == e ? void 0 : e.event) || []))
                                }
                            }, deviceGetSetVar: {
                                usage: "get", getCapability: function (e) {
                                    return a()((null == e ? void 0 : e.propertyGet) || [])
                                }
                            }
                        }, i = y.reduce((function (e, t) {
                            return e[t.did] = t, e
                        }), {});
                        if (!r.props.siid) {
                            var c = Jd.gateway.data.urnMap[r.cfg.urn], u = o[r.type].getCapability(c);
                            return void Promise.all(u.map((function (e) {
                                return n(e)
                            }))).then((function (t) {
                                t && (e = {
                                    did: r.props.did,
                                    serviceSiid: r.props.siid,
                                    similarUrn: Array.from(new Set(t.map((function (e) {
                                        return Object.keys(e)
                                    })).flat()))
                                }, S(e))
                            }))
                        }
                        n(r.props).then((function (t) {
                            e = {did: r.props.did, serviceSiid: r.props.siid, similarUrnMap: Object.entries(t)}, S(e)
                        }))
                    }
                }), [t, C]);
                var T = (0, o.useMemo)((function () {
                    return y.filter((function (e) {
                        return !x || (x.serviceSiid ? x.similarUrnMap.map((function (e) {
                            return e[0]
                        })).includes(e.urn) : x.similarUrn.includes(e.urn))
                    })).filter((function (e) {
                        return e.name.toLowerCase().includes(c.keyword.trim().toLowerCase()) && (!(c.deviceTypes.length > 0) || c.deviceTypes.includes(e.deviceType)) && (!(c.roomIds.length > 0) || c.roomIds.includes(e.roomId))
                    })).sort(O)
                }), [y, c, x]), D = (0, o.useCallback)((function (e, t) {
                    u((function (n) {
                        return Lh(Lh({}, n), {}, H()({}, e, t))
                    }))
                }), []);

                function P() {
                    S(null), Jd.gateway.data.isTiHuan = !1, Jd.gateway.data.targetCard = null
                }

                return (0, o.useEffect)((function () {
                    Jd.lockScroll(t), t ? (f(!0), Jd.gateway.getAllDeviceDetail((function () {
                        f(!1)
                    }), (function () {
                        f(!1)
                    })), Qh = (new Date).getTime()) : u({keyword: "", roomIds: [], deviceTypes: []})
                }), [t]), o.createElement(to, {
                    footer: null,
                    className: "device-modal",
                    open: t,
                    title: "选择执行设备",
                    onCancel: function () {
                        (new Date).getTime() - Qh < 500 || (Jd.gateway.hideModal(), Jd.settings.replaceDeviceCardId = "", P(), update())
                    },
                    placement: "right",
                    width: 960
                }, o.createElement(yh.Z, {spinning: p}, o.createElement(To, {
                    style: {padding: 0},
                    placeholder: "输入想找的设备",
                    value: c.keyword,
                    onSearch: function (e) {
                        D("keyword", e)
                    },
                    extra: o.createElement(Th, null)
                }), o.createElement("div", {className: "device-modal-content"}, o.createElement("div", {className: "device-modal-filter-wrap"}, o.createElement(xh, {
                    roomTags: A,
                    deviceTypeTags: b,
                    checkedRoomIds: c.roomIds,
                    checkedDeviceTypes: c.deviceTypes,
                    onFilter: D
                })), o.createElement("div", {className: "device-filter-list"}, T.map((function (e) {
                    return o.createElement(Ph, {
                        key: e.did, data: e, onClick: Fr()(Yr().mark((function t() {
                            var r, a, o, i, c, u, l, s, p, f, d, m, v, g, y, A, b, E, C, O, w, k, S, T, D, R, B, I, j,
                                N, L, Q, M;
                            return Yr().wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        if (n.current = (null == x || null == (r = x.similarUrnMap) || null == (a = r.filter((function (t) {
                                            return t[0] === e.urn
                                        }))) || null == (o = a[0]) ? void 0 : o[1]) || {}, n.current.record = e, n.current.targetCard = (0, U.cloneDeep)(null == (i = Jd.gateway) || null == (c = i.data) ? void 0 : c.targetCard), window.tiHuanDetail = n.current, !(x && x.serviceSiid && null != (u = n.current) && null != (l = u.same) && l.length)) {
                                            t.next = 13;
                                            break
                                        }
                                        if (!((g = null == (m = n.current) || null == (v = m.same) ? void 0 : v.filter((function (t) {
                                            return t.did === e.did
                                        }))).length > 1)) {
                                            t.next = 12;
                                            break
                                        }
                                        return h(!0), update(), t.abrupt("return");
                                    case 12:
                                        1 === g.length && (S = Jd.gateway.data, T = S.pos, D = T.x, R = T.y, B = S.deviceType, I = g[0], Jd.appendInstance({
                                            x: D,
                                            y: R,
                                            type: B,
                                            urn: e.urn,
                                            did: e.did,
                                            isTiHuan: {
                                                inputs: null == (y = n.current) || null == (A = y.targetCard) ? void 0 : A.inputs,
                                                outputs: null == (b = n.current) || null == (E = b.targetCard) ? void 0 : E.outputs,
                                                deviceType: B,
                                                props: Lh(Lh({}, null == (C = n.current) || null == (O = C.targetCard) ? void 0 : O.props), {}, {
                                                    did: null == (w = n.current) || null == (k = w.record) ? void 0 : k.did,
                                                    siid: null == I ? void 0 : I.siid,
                                                    eiid: null == I ? void 0 : I.eiid,
                                                    piid: null == I ? void 0 : I.piid
                                                })
                                            }
                                        }), Jd.gateway.hideModal(), Jd.gateway.getDeviceDetail(e.urn), P(), update());
                                    case 13:
                                        j = Jd.gateway.data, N = j.pos, L = N.x, Q = N.y, M = j.deviceType, Jd.appendInstance({
                                            x: L,
                                            y: Q,
                                            type: M,
                                            urn: e.urn,
                                            did: e.did,
                                            isTiHuan: {
                                                inputs: null == (s = n.current) || null == (p = s.targetCard) ? void 0 : p.inputs,
                                                outputs: null == (f = n.current) || null == (d = f.targetCard) ? void 0 : d.outputs,
                                                deviceType: M
                                            }
                                        }), Jd.gateway.hideModal(), Jd.gateway.getDeviceDetail(e.urn), P(), update();
                                    case 19:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))
                    })
                })))), o.createElement(jh, {visible: v, data: Lh({}, n.current), setVisible: h, clearTiHuan: P})))
            };
            const Zh = o.memo(Mh);
            var Vh = Jd.graphTool;
            const Hh = function () {
                var e = (0, am.UO)().id, t = Jd.selectTool.data, n = t.multiple, r = t.multipleLog, i = t.selectedCards,
                    c = t.selectedLogLines, u = (0, om.Z)(), l = (0, o.useState)(0), s = I()(l, 2)[1],
                    p = (0, o.useState)(!1), f = I()(p, 2), d = f[0], m = f[1], v = (0, o.useState)(!1), h = I()(v, 2),
                    g = h[0], y = h[1], A = (0, o.useState)(null), b = I()(A, 2), E = b[0], O = b[1],
                    w = (0, o.useRef)((function () {
                        u() && s((function (e) {
                            return e + 1
                        }))
                    })), k = (0, o.useCallback)((function () {
                        arguments.length > 0 && void 0 !== arguments[0] && arguments[0] ? w.current() : C(w.current)
                    }), []);
                Jd.update = window.update = k, (0, o.useEffect)((function () {
                    Jd.reset(), Jd.eventManagerTool.bindEvent();
                    var e = Pi(Ti.TOGGLE_LOG_VISIBLE, (function (e) {
                        y((function (t) {
                            return (0, El.Z)(e) && (e = !t), e && Ri(Ti.TOGGLE_HELP_VISIBLE, !1), e
                        }))
                    })), t = Pi(Ti.LOG_DATA_UPDATE, (function (e) {
                        O(e.currentFrame)
                    }));
                    return function () {
                        Jd.eventManagerTool.unBindEvent(), e(), t()
                    }
                }), []), (0, o.useEffect)((function () {
                    var e = function () {
                        Vh.updateContainerSize(), k()
                    };
                    return Jd.setRoot(Un), setTimeout((function () {
                        e()
                    }), 0), cr(window, "resize", (function () {
                        setTimeout(e, 350)
                    }))
                }), []), (0, o.useEffect)((function () {
                    m(!0), Vh.setGraphConfig(e).then((function () {
                        m(!1), k()
                    }))
                }), [e]);
                var x = e === Vh.id, S = x ? Jd.data : [], D = Bl(S, E), P = D.connectedLineList,
                    R = D.normalConnectedLineList, B = D.activeLineList, j = D.activeLineCardIdMap;
                null === E && (Jd.lineData = P);
                var N = Jd.transformTool.data, L = N.x, Q = N.y, M = N.scale;
                return o.createElement("div", {
                    className: "graph",
                    "data-target": 1,
                    "data-id": zn.default
                }, o.createElement("div", {
                    className: "panel", onContextMenu: function (e) {
                        return e.preventDefault(), !1
                    }
                }, o.createElement(Zh, {visible: Jd.gateway.data.modalVisible}), o.createElement(wm, null, o.createElement(ev, {
                    x: L,
                    y: Q,
                    scale: M
                }, o.createElement(Hm, {
                    activeLineList: B,
                    normalConnectedLineList: R,
                    selectedLogLines: c
                }), o.createElement(Cv, {
                    cardList: S,
                    activeLineCardIdMap: j,
                    lineColor1: T().lineColor1,
                    currentFrame: E
                }), o.createElement(Km, {
                    logVisible: g,
                    lineList: [].concat(a()(P), a()(B)),
                    currentFrame: E
                }), o.createElement($m, {
                    cardList: S,
                    logVisible: g,
                    currentFrame: E
                }), o.createElement(Xm, {
                    cardList: S,
                    lineColor1: T().lineColor1
                }), o.createElement(kv, null)), o.createElement(Hv, {
                    loading: d || !x,
                    isEmpty: (0, El.Z)(S)
                })), o.createElement(Mv, {cardList: S}), o.createElement(eh, null), g ? o.createElement(dh, {
                    selectedCards: i,
                    selectedLogLines: c,
                    multipleLog: r
                }) : null, o.createElement(vh, {multiple: n, selectedCards: i}), g ? o.createElement(gh, {
                    multiple: n,
                    selectedCards: i
                }) : null, o.createElement(Jv, {cardList: S})), o.createElement(Yv, null), o.createElement(zv, {loading: d}), o.createElement(Om, {
                    historyData: Jd.actionManager.getAction(Vh.id),
                    logVisible: g,
                    name: Vh.graphConfig.userData.name,
                    scale: M,
                    enable: Vh.graphConfig.enable
                }))
            };
            var Fh = n(68562);

            function Gh() {
                return Gh = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Gh.apply(this, arguments)
            }

            const Yh = e => o.createElement("svg", Gh({
                width: "1em",
                height: "1em",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M3 3.2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11.7v-1.4H2.9a.5.5 0 0 1-.5-.5V5.1a.5.5 0 0 1 .5-.5h15.6a.5.5 0 0 1 .5.5v3.975h1.4V10.4h-3.155a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H20.4V5.2a2 2 0 0 0-2-2H3Zm17.4 8.6v3.405V11.8Zm0 0h-2.755V19h4.2v-7.2H20.4ZM6.7 19.7a.7.7 0 0 1 .7-.7H14a.7.7 0 1 1 0 1.4H7.4a.7.7 0 0 1-.7-.7Z"
            }));

            function zh() {
                return zh = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, zh.apply(this, arguments)
            }

            const Uh = e => o.createElement("svg", zh({
                width: "1em",
                height: "1em",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M20.696 9.722V8.303c0-1.662-1.297-3.01-2.898-3.01H13.5a.029.029 0 0 1-.022-.01l-1.384-1.66A1.712 1.712 0 0 0 10.78 3H4.898C3.298 3 2 4.348 2 6.01v11.98C2 19.652 3.297 21 4.898 21h12.9c1.447 0 2.646-1.101 2.863-2.54l1.253-5.404a3.219 3.219 0 0 0-1.218-3.334Zm-1.449-.553v-.866c0-.831-.648-1.505-1.448-1.505H13.5c-.429 0-.836-.193-1.117-.53L11 4.608a.285.285 0 0 0-.22-.103H4.899c-.8 0-1.449.674-1.449 1.505v8.265l.626-2.699c.329-1.42 1.552-2.42 2.958-2.42h11.923c.098 0 .196.004.291.013ZM3.84 19.02c.264.293.64.476 1.058.476h12.9c.627 0 1.16-.413 1.363-.99l1.344-5.802c.242-1.041-.518-2.043-1.55-2.043H7.034c-.737 0-1.377.524-1.55 1.268l-1.643 7.09Z"
            }));

            function qh() {
                return qh = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, qh.apply(this, arguments)
            }

            const Xh = e => o.createElement("svg", qh({
                xmlns: "http://www.w3.org/2000/svg",
                width: "1em",
                height: "1em",
                viewBox: "0 0 24 24",
                fill: "none"
            }, e), o.createElement("path", {
                d: "M19.8 5.914H4.2m15.6 6H4.2m8.743 6H4.2",
                stroke: "currentColor",
                strokeOpacity: .8,
                strokeWidth: 1.543,
                strokeLinecap: "round"
            }));
            const Kh = function () {
                var e = (0, Fh.H)(), t = I()(e, 1)[0].slice(1), n = t.startsWith(Sy.GRAPH), r = (0, o.useState)(!1),
                    a = I()(r, 2), i = a[0], c = a[1];
                return (0, o.useEffect)((function () {
                    if (!n) return cr(window, "resize", (function (e) {
                        e.target.innerWidth < 800 && !i && c(!0), e.target.innerWidth > 1400 && i && c(!1)
                    }))
                }), [n, i]), n ? null : o.createElement("div", {className: "sider ".concat(i ? "sider-collapsed" : "")}, o.createElement("div", {className: "sider-toggle-menu"}, o.createElement(We.Z, {
                    className: "icon-menu",
                    component: Xh,
                    onClick: function () {
                        c(!i)
                    }
                })), o.createElement("div", {
                    className: "sider-item ".concat(t === Sy.RULE ? "bg-active" : "bg-normal"),
                    onClick: function () {
                        Wp("/")
                    }
                }, o.createElement(We.Z, {
                    className: "sider-item-icon",
                    component: Uh
                }), o.createElement("div", {className: "sider-item-title"}, "自动化列表")), o.createElement("div", {
                    className: "sider-item ".concat(t === Sy.DEVICE ? "bg-active" : "bg-normal"),
                    onClick: function () {
                        Wp("/device")
                    }
                }, o.createElement(We.Z, {
                    className: "sider-item-icon",
                    component: Yh
                }), o.createElement("div", {className: "sider-item-title"}, "设备列表")), o.createElement("div", {
                    className: "sider-item ".concat(t === Sy.VAR ? "bg-active" : "bg-normal"),
                    onClick: function () {
                        Wp("/vars")
                    }
                }, o.createElement(We.Z, {
                    className: "sider-item-icon",
                    component: Ft.Z
                }), o.createElement("div", {className: "sider-item-title"}, "全局变量列表")))
            };

            function Wh() {
                var e = Ec.Z.useForm(), t = I()(e, 1)[0], n = (0, o.useState)(!1), r = I()(n, 2), a = r[0], i = r[1];
                (0, o.useEffect)((function () {
                    return Pi(Ti.TOGGLE_CREATE_VISIBLE, (function (e) {
                        i((function (t) {
                            return (0, El.Z)(e) && (e = !t), e
                        }))
                    }))
                }), []);
                var c = function () {
                    t.validateFields().then((function (e) {
                        Jd.graphTool.appendTempGraph(e.sceneName), u()
                    }))
                }, u = function () {
                    i(!1), t.resetFields()
                };
                return o.createElement(L.Z, {
                    title: "新增自动化",
                    className: "ant-small-modal",
                    closable: !1,
                    open: a,
                    onOk: c,
                    onCancel: u
                }, o.createElement(Ec.Z, {layout: "inline", form: t}, o.createElement(Ec.Z.Item, {
                    label: "自动化名称",
                    name: "sceneName",
                    style: {width: "100%"},
                    rules: [{required: !0, message: "请输入自动化名称"}, {
                        validator: function (e, t) {
                            return " " === t ? Promise.reject(!1) : Promise.resolve(!0)
                        }, message: "请输入正确的名称"
                    }]
                }, o.createElement(jn.Z, {placeholder: "请输入自动化名称", autoFocus: !0, onPressEnter: c}))))
            }

            function Jh() {
                return Jh = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Jh.apply(this, arguments)
            }

            const _h = e => o.createElement("svg", Jh({
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {d: "M13.536 7.596a.8.8 0 1 0-1.132-1.132L10 8.87 7.596 6.464a.8.8 0 1 0-1.132 1.132L8.87 10l-2.405 2.404a.8.8 0 1 0 1.132 1.132L10 11.13l2.404 2.405a.8.8 0 1 0 1.132-1.132L11.13 10l2.405-2.404Z"}));

            function $h() {
                return $h = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, $h.apply(this, arguments)
            }

            const eg = e => o.createElement("svg", $h({
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {d: "M10.8 5.8a.8.8 0 0 0-1.6 0v3.4H5.8a.8.8 0 1 0 0 1.6h3.4v3.4a.8.8 0 0 0 1.6 0v-3.4h3.4a.8.8 0 0 0 0-1.6h-3.4V5.8Z"}));

            function tg() {
                return tg = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, tg.apply(this, arguments)
            }

            const ng = e => o.createElement("svg", tg({
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                clipRule: "evenodd",
                d: "m15.961 5.795-5.299-3.026a1.37 1.37 0 0 0-1.36 0L4.003 5.795a1.37 1.37 0 0 0-.69 1.19v6.027c0 .492.263.947.69 1.19l5.3 3.027c.42.24.938.24 1.359 0l5.3-3.026c.426-.244.69-.699.69-1.19V6.984a1.37 1.37 0 0 0-.69-1.19ZM6.993 8.953a.633.633 0 0 1 .633-1.096l2.287 1.32 2.287-1.32a.633.633 0 1 1 .633 1.096l-2.291 1.323c.013.05.02.104.02.16v2.16a.633.633 0 1 1-1.265 0v-2.16c0-.05.005-.098.016-.143l-2.32-1.34Z"
            }));
            var rg = 20;

            function ag(e) {
                var t = (f().width - 172) / e;
                return t > 220 && (t = 220), t
            }

            function og() {
                var e = (0, o.useState)(null), t = I()(e, 2), n = t[0], r = t[1], i = (0, o.useState)([]),
                    c = I()(i, 2), u = c[0], l = c[1], s = (0, o.useState)(new Set), p = I()(s, 2), f = p[0], d = p[1],
                    m = (0, o.useState)(new Set), v = I()(m, 2), h = (v[0], v[1]), g = (0, o.useState)(ag(u.length)),
                    y = I()(g, 2), A = y[0], b = y[1], E = u.findIndex((function (e) {
                        return e.id === n
                    }));
                (0, o.useEffect)((function () {
                    return cr(window, "beforeunload", (function (e) {
                        if (f.size > 0) {
                            e.preventDefault();
                            var t = "请先保存您编辑的内容,否则您修改的信息会丢失。";
                            return e.returnValue = t, t
                        }
                    }))
                }), [f]), (0, o.useEffect)((function () {
                    var e = function (e) {
                        d((function (t) {
                            if (!t.has(e)) return t;
                            var n = new Set(a()(t));
                            return n.delete(e), n
                        }))
                    }, t = function (t) {
                        if (e(t), n === t) {
                            var a = u.map((function (e) {
                                return e.id
                            })), o = a.indexOf(t), i = a[0 === o ? o + 1 : o - 1];
                            a.includes(i) ? (r(i), Jp(i)) : Wp("/")
                        }
                        Jd.graphTool.removeCache(t)
                    }, o = Pi(Ti.ADD_TAB, (function (e) {
                        if (e && r(e.id), !u.some((function (t) {
                            return t.id === e.id
                        }))) {
                            var n = u.slice();
                            if (n.push(e), n.length > rg) {
                                oo.info("最多支持打开 ".concat(rg, " 个自动化标签页，超出的老标签页已自动关闭"));
                                for (var a = 0; a < n.length - rg; a++) t(u[a].id);
                                return n.slice(-rg)
                            }
                            l(n)
                        }
                    })), i = Pi(Ti.UPDATE_TAB, (function (e) {
                        l((function (t) {
                            Jd.graphTool.updateGraphConfig(e.id, e);
                            var n = t.findIndex((function (t) {
                                return t.id === e.id
                            }));
                            if (-1 === n) return t;
                            var r = t.slice();
                            return r[n] = e, r
                        }))
                    })), c = Pi(Ti.REMOVE_TAB, (function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n,
                            r = u.findIndex((function (t) {
                                return t.id === e
                            }));
                        if (-1 !== r) {
                            var a = u.slice();
                            a.splice(r, 1), l(a), t(e)
                        }
                    })), s = Pi(Ti.ADD_CHANGED_TAB, (function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.id,
                            r = void 0 === t ? n : t, o = e.isAutoBackup;
                        (void 0 === o || o) && h((function (e) {
                            var t = new Set(a()(e));
                            return t.add(r), t
                        })), d((function (e) {
                            var t = new Set(a()(e));
                            return t.add(r), t
                        }))
                    })), p = Pi(Ti.REMOVE_CHANGED_TAB, e);
                    return function () {
                        o(), i(), c(), s(), p()
                    }
                }), [u, n]), (0, o.useEffect)((function () {
                    b(ag(u.length));
                    var e = Pi(Ti.CONTAINER_SIZE_UPDATE, (function () {
                        b(ag(u.length))
                    })), t = Pi(Ti.RESTORE_SUCCESS, (function () {
                        u.forEach((function (e) {
                            Jd.graphTool.removeCache(e.id)
                        })), l([]), r(null), d(new Set), Wp("/")
                    }));
                    return function () {
                        e(), t()
                    }
                }), [u]);
                return o.createElement("div", {className: "app-header-menu"}, o.createElement("div", {
                    className: "app-header-menu-item app-header-menu-left ".concat(-1 === E ? "app-header-menu-item-selected" : ""),
                    onClick: function () {
                        r(null), Wp("/")
                    }
                }, o.createElement(We.Z, {className: "icon-logo", component: ng})), u.map((function (e) {
                    var t = n === e.id, a = f.has(e.id), i = A > 100 || t;
                    return o.createElement("div", {
                        className: "app-header-menu-item ".concat(t ? "app-header-menu-item-selected" : ""),
                        key: e.id,
                        onClick: function () {
                            return function (e) {
                                r(e.id), Jp(e.id)
                            }(e)
                        },
                        style: {width: A}
                    }, o.createElement("div", {className: "app-header-menu-item-border"}), o.createElement("label", {style: {maxWidth: i ? A - 50 : A}}, a ? o.createElement("span", null, "*") : null, e.userData.name), i ? o.createElement("div", {
                        className: "app-header-menu-item-action",
                        onClick: function (t) {
                            return function (e, t) {
                                var n = function () {
                                    Ri(Ti.REMOVE_TAB, t.id)
                                };
                                if (e.stopPropagation(), f.has(t.id)) return L.Z.destroyAll(), void L.Z.confirm({
                                    icon: null,
                                    title: "未保存内容可能丢失，确认关闭？",
                                    onOk: n
                                });
                                n()
                            }(t, e)
                        }
                    }, o.createElement(We.Z, {component: _h})) : null)
                })), u.length ? o.createElement("div", {
                    className: "app-header-menu-item app-header-menu-add",
                    onClick: function () {
                        return Ri(Ti.TOGGLE_CREATE_VISIBLE, !0)
                    }
                }, o.createElement("div", {className: "app-header-menu-item-border"}), o.createElement(We.Z, {component: eg})) : null)
            }

            const ig = JSON.parse('{"KZ":"v1.6.1","vP":[{"version":"v1.6.1","date":"v1.6.1 - 2025年11月13日","list":["新增「备份至云端」和「自动备份」功能"]},{"version":"v1.6.0","date":"v1.6.0 - 2024年10月24日","list":["新增样式选择：可以选择深色/浅色模式、折线/曲线等样式。","新增替换设备功能：可以在画布中右键设备卡片，通过替换设备功能把具备相同功能的设备替换到此处。","新增在日志查看时标记关注：在日志页面可以标记关注的连线和卡片，并且可以在进度栏快进和回退到关注的连线和卡片","一些展示优化：在编辑界面也可以查看当前自动化是否处于启用状态；时间段卡片如果涉及跨天，会显示“次日”"]},{"version":"v1.5.0","date":"v1.5.0 - 2024年1月25日","list":["新增了变量系统。可以在自动化规则里使用变量啦！","新增了“状态取反”卡片","优化了卡片配置错误时的提示","优化了设备丢失时简化卡片的样式","架构设计上做了一些优化重构"]},{"version":"v1.4.0","date":"v1.4.0 - 2023年10月18日","list":["新增了通过右键菜单对多个卡片进行对齐的功能","新增了撤销和取消撤销功能","新增了通过右键菜单或双击，对完成编辑的卡片进行简化显示的功能","对登录失败时的错误提示进行了分类","优化了编辑器性能"]},{"version":"v1.3.1","date":"v1.3.1 - 2023年8月2日","list":["修复了备注卡片不能调整宽度","修复了iOS手机Safari提示需要下载Chrome","修复了卡片被操作后，tab栏没有展示代表未保存的星号提示","修复了鼠标悬停在卡片选择栏时没有出现提示","修复了一些其他问题"]},{"version":"v1.3.0","date":"v1.3.0 - 2023年7月3日","list":["交互适配了触屏设备","优化了设备列表的显示样式"]},{"version":"v1.2.0","date":"v1.2.0 - 2023年3月16日","list":["新增备注功能，可以在画布里添加备注了","在设备卡片中，开放了设备的非标准功能定义作为可选项","含有选项的设备功能支持多选","优化了日志进度条的交互体验","优化了部分组件的视觉效果","优化页面打开速度，提高页面稳定性"]},{"version":"v1.1.0","date":"v1.1.0 - 2022年12月27日","list":["新增标签功能，可以给自动化打标签了","新增了截图功能，在自动化编辑页面可以一键截出一张包含完整内容的图片了","新增了缩放比例适应内容功能","设备列表新增刷新按钮，新绑定的设备可以通过刷新加入列表","新增更新日志查看功能"]}]}');

            function cg() {
                var e = (0, o.useState)(!1), t = I()(e, 2), n = t[0], r = t[1];
                return (0, o.useEffect)((function () {
                    Jd.lockScroll(n)
                }), [n]), o.createElement(o.Fragment, null, o.createElement("div", {
                    onClick: function () {
                        return r(!0)
                    }
                }, "更新日志"), o.createElement(to, {
                    className: "app-header-log-modal",
                    width: 416,
                    title: "更新日志",
                    footer: null,
                    open: n,
                    onCancel: function () {
                        return r(!1)
                    }
                }, o.createElement(We.Z, {
                    className: "app-header-log-icon",
                    component: ng
                }), o.createElement("div", {className: "app-header-log-version"}, "当前版本： ", ig.KZ), o.createElement("div", {className: "app-header-log-list"}, ig.vP.map((function (e) {
                    return o.createElement("div", {
                        className: "app-header-log-item",
                        key: e.date
                    }, o.createElement("div", {className: "app-header-log-item-title"}, e.date), e.list.map((function (e, t) {
                        return o.createElement("div", {
                            className: "app-header-log-item-content",
                            key: e
                        }, t + 1, ". ", e)
                    })))
                })))))
            }

            var ug = n(21006);
            const lg = n.p + "img/line-1.35413c.png", sg = n.p + "img/line-1-dark.5304ab.png",
                pg = n.p + "img/line-2.798362.png", fg = n.p + "img/line-2-dark.b9755b.png",
                dg = n.p + "img/line-3.ce591b.png", mg = n.p + "img/line-3-dark.9f9a8f.png",
                vg = n.p + "img/arrow-1.775e94.png", hg = n.p + "img/arrow-1-dark.5bcdc9.png",
                gg = n.p + "img/arrow-2-dark.061531.png";
            var yg = n(79860);

            function Ag(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function bg(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Ag(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ag(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Eg = [{
                title: "自动备份",
                description: "当退出极客版时，如果规则发生了内容变化，自动生成一份备份文件存储到云端",
                key: "autoBackup",
                setFunc: function (e) {
                    return Jr.kd.backupManager.setBackupConfig(e)
                },
                getFunc: function () {
                    return Jr.kd.backupManager.getBackupConfig({from: "fds"}).then((function (e) {
                        return e.autoBackup
                    }))
                },
                defaultValue: !1
            }];
            const Cg = function () {
                var e = (0, o.useState)((function () {
                    return Eg.reduce((function (e, t) {
                        return bg(bg({}, e), {}, H()({}, t.key, t.defaultValue))
                    }), {})
                })), t = I()(e, 2), n = t[0], r = t[1], a = (0, o.useState)((function () {
                    return Eg.reduce((function (e, t) {
                        return bg(bg({}, e), {}, H()({}, t.key, !1))
                    }), {})
                })), i = I()(a, 2), c = i[0], u = i[1];
                (0, o.useEffect)((function () {
                    Eg.forEach((function (e) {
                        u((function (t) {
                            return bg(bg({}, t), {}, H()({}, e.key, !0))
                        })), e.getFunc().then((function (t) {
                            r((function (n) {
                                return bg(bg({}, n), {}, H()({}, e.key, t))
                            }))
                        })).catch((function () {
                            no.ZP.error("获取自动备份配置失败")
                        })).finally((function () {
                            u((function (t) {
                                return bg(bg({}, t), {}, H()({}, e.key, !1))
                            }))
                        }))
                    }))
                }), []);
                return o.createElement("div", {className: "auto-backup-setting"}, o.createElement(yg.Z, {
                    itemLayout: "horizontal",
                    dataSource: Eg,
                    renderItem: function (e) {
                        return o.createElement(yg.Z.Item, null, o.createElement(yg.Z.Item.Meta, {
                            title: e.title,
                            description: e.description
                        }), o.createElement(Bo.Z, {
                            checked: n[e.key], loading: c[e.key], onChange: function (t) {
                                return a = t, o = (n = e).key, i = n.setFunc, u((function (e) {
                                    return bg(bg({}, e), {}, H()({}, o, !0))
                                })), void i({from: "fds", params: {autoBackup: a}}).then((function () {
                                    r((function (e) {
                                        return bg(bg({}, e), {}, H()({}, o, a))
                                    }))
                                })).catch((function () {
                                    no.ZP.error("设置自动备份失败")
                                })).finally((function () {
                                    u((function (e) {
                                        return bg(bg({}, e), {}, H()({}, o, !1))
                                    }))
                                }));
                                var n, a, o, i
                            }
                        }))
                    }
                }))
            };

            function Og(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function wg(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Og(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Og(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var kg = [{
                label: "展示模式",
                key: "setting-mode",
                defaultValue: "1",
                imgs: ["data:image/png;base64,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", "data:image/png;base64,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", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACgCAYAAACsRLHsAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWRSURBVHgB7d1tbhvXFYDhM6Q+qNpSiBYCBPQPkw3E7QLaNCtwu4EsoVlB62QDdXaQ7KDdQJPswF2B9FNIEJiV5IoUP25naMtIHDk2YnMOR3keSPZIpGzAGL88944GquI1DWuDweB+RO+PpZR7EdWoqsowgF+0Uqpx/etJVVWPIpZfTSaTf41rr/O11auecHR0NKr/go/rp34kOMDrqT6vY/TJ6enpyU8+62UPNBPP7u7e36sqPg6An6GU+Md0evnpyyaiGwPUTD31Q1/Wh6MAeDPHdYo+vGka6r34icPD394TH+Aterduyr8PDw/vvfjADyYgkw+wRj+ahJ5PQM2ej/gAa7SahJ625qnnAWo2nEN8gPV6t27N364/WC3Bni29jgNg/Ur99l6zFHs2AVUPAqAdVSnVX1cHw+FoOBhMHwdAS0qJx9Pp5Xu9wWByPwBaVFWxurWrXoJVHwRAu5r95z/06rXY+wHQsro995pN6FEAtG/Uc4c7kKHZB+oFQBIBAtIIEJBGgIA0W3FLlFJiPp/HYrGo35cBbL5bEaAmPpeXk9XvQHfciiWY+EA3dT5AzbJLfKCbOh+gq6t5AN3U+QCVYsMZuspleCCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkObW/Gz4rtjd3YnBYBB7e4PY2vLPz5u7uprFbDaLs7PzWCwW0SX+B7Skqnrxzjv7cffunYC3aWdne/V+586v4vz8og7RRWd+Xp4lWAua+Bwe/kZ8WLv9/burc60557pAgFrQTD7NKxS0oTnXDg7uRhcI0Jr1+32TD61rJqFmv3HTCdCaHRzsB2RoLnZsOgFas52dzX8V4nba29uLTSdAa7a97UIjOba2+rHpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCBKQRICCNAAFpBAhII0BAGgEC0ggQkEaAgDQCtGbz+SIgw2w2i00nQGs2mUwCMlxdCdAv3uXlZUCGs7Pz2HQCtGbT6VVcXDwJaNP5+UUsFpu//BegFjSvRF1Yj3M7NOfa2dlFdIEAtWC5XMa3335nEmLtmsnnm2++i1KW0QVbQSuaCI3H/12dIAcH+7Gzsx3b29sBb2o+n9d7jZPVBY9myd8lAtSyZl3++PE4AEswIJEAAWkECEgjQEAaAQLSCBCQRoCANAIEpBEgII0AAWkECEgjQECaXimVOyOBDONmAjoJgJZVVZz0qmr5nwBoWSnlUTMBfRUA7Sr129fVcDga7u5eHVdVGUYHPXnyvwA6p/T71a974/FJvQldvgiA1pTPx7XVZfh6+nkYAO0os1nv0+ZgFaDT09OTUuKzAFizUqrPJpPxSXP8/BsRp9PdB+GSPLBex1tb8cn1B88D9Gwv6E8hQsB6HM9m1YfN3s/1J35wK0azFFssen8OEQLeruPlsvrL9dLrWnXTM4+Ojkb1Q1/Wh6PYcC7Dw8ZbTT4vxqdx482ozSQ0mez+zsY08CbqDeeH/X71+5vi06he9Qc8nYbiQf3Uj2IDmYBg44xLKV/M572HLwvPtVcG6NqwNhgM7teHH9RVe7/+0tEmfPe0AEG6OjhxUvfgUb2o+rrfj39+f6P5p/wf7px3KQL15qUAAAAASUVORK5CYII="],
                imgStyle: {width: 144, height: 80},
                desc: ["跟随系统", "浅色", "深色"]
            }, {
                label: "卡片主题",
                key: "setting-color",
                defaultValue: "0",
                imgs: T().isDark ? ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAEICAYAAACj9mr/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA2lSURBVHgB7d1NbFzVGYfx1/bYSWxTu1XiOCmKE+qgBBGDKCioIqhNu6hUWHXRSEjdsGdbVUIqC6RKXbLvkoo9ZVGJopYgtRGgUohIBIHEASXBcaldMY4/Jp7e/x0G2yRv4nM9nplz7vOTrIkCq1Hy5Jz3nntvz/j4vroBwK3qvQYADgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuCqGlqjvrNjq2LCt7s1+RnZaPfvJP7Pftx2Vxuc6PYs1s6Wa9c4v5r/uyT71694vvrLema8a/71E+vuHbGTkkI2OHrKhXWM2OJT9DI7lvz+Q/ehzvZWVqi1nPwsLM/mvF6ozVr0xY3NzF21+/mL+e9i6nvHxfXVDMP2Frx3ebTcnRu3mgdE8CK3UDEVles56L8/l8UiJ/sLv33fc9ux50HbvftCGshi00tx8IxTXZ8/a7PWzVs1CgmB1AhEgj8KxcavdvzuPQjv1ZZHof/9a1LFQFCYmTjbCkEWhnRSK6ctvEIswBGIzFIPlEwfbHgVP5aNZq3xwLf+MgVYIDxw91fYoeK5cPWOXpt+wq9kn7ohAeJqrheXH7m359qFVNLfYcfpSHotu01wtTP7g6ZZvH1pF84sPz79i01kscFsE4nZWsigsP3HwlsFit+q2UExOPm0PHDl1y2CxWxEKF4FYT1uIxaeOdO2K4W46HQptJR794XNdu2K4G0JxCwIhCsLSzybz4WMKFIiBLBTtGmbqcuRDU8/mw8cUaJh57twrDDMJhFltatyWfjoZzXZis9q1mtCc4aFjz0azndgsVhO58gZCQdCcQfOGlPW//bkNvHWp5QevFISj2ZWJw9kQMmUff/Jqvpoo6cGrcgZCW4qFZx6OdtYQSquJXS+/17Ith7YUT554MdpZQyitJt48/XwZtxz1vuHhe16wEtFR6Bu/fsTqwwNWGrpkm81XKpfnrKe6bFsxOnLIfvLjP9jOnd+1sshPfe4/brOzZ21xac7KpFSB0Lzhxq+msileCe9R04yltmqVT7+0ojRveOJHv7O+vhLF9WuKxH2Hfm4LN2byI9xlUZqbtTRr0JWKstI2Q7OIonS2QcPIsnv0keesvzJkF7LZRBmU4p/SssdBNIMoOqgkDhvpku5k4sPZpuQDkV/GLHkctnImonkZExspEvpuUpd0IDSQXPzFESszbS363/ncitBAUktq3J6+G31HKUs2ELqEeeOX3XH3YCfpsFSRrYUuZT7++G8Nd5b65d4kA6FDUGU65+Dpm54rdJJSE/synXPYiuZ3ldpJ0qYkA5HfiVnyOMiO185bETohSRw2T6stfWcpSi4QK8fGkz8+vRkVPX2qwGBy4sDJ5I9Pbwd9ZykOLZMKhFYNevITrNCZh5T/JWwHXe1JbeWVVCAUB7YWxVcPesgLW4viNIeYmkrrknAygci3FtkPstVDgcua2lqU4br+duvEA3m3UzKBYGvRoCsXemR+KLYWraOnaqUiiUBo5cDWoqG/wGVNrR7YWrSOZjmpHMVOIhCsHhp0arLIuQdWD62nx/yncDYi+kCwelij7UUoVg/bI3/s/4H4ZzrRB4LVw5p+Vg9d5fBk/NuMqAOhpySxemjQ9kKv5wuhiTurh+2jWUTsVzTiDgSXNb9RdHuB7RX7Ci3aQGjlkMp7LFoh9D2d+tdNz1nE9tIKIuZhZbSBqHXJi3S7Rd9nYSuIlA7zdLuYV2rxBmKK7UWTthehz3zg1GT7xLxSizIQ2l7cZAXxjd6ZsJOTKQzPYhLzNiPKQLC92Ch0QEkc2i/W95ZGGYjVCQKxHvOH7rdnT5zfeZSBuDk2bGjQ7CF0/jAymvaDVrtRrFGOLhB63qSeVo2G0Ds3tRdO/UnM3UhznxjnENEFYpXVwwahA8oR4tAxMYY5vkCwetggdHvB6qFzYoxzfIHg3osNQrcYg9x70TExfvfxzSAIxAY9S2ErCG7O6pwYv/soh5RYExqI/oE0X/ASg8EhArHt2GJ8S+AMYnAXK4hOGeAqRhvsYAWxXujj7QdYQXQMlznbgC3G1qT6DskYEAgASSEQAFwEAoArukCEnhxMXehMZmWlauiMGL/7+FYQSwRivXrgVZ3lZQLRKQSiDVhBbM1KjUB0SrU6Y7GJLhBFXmufstCj5wsR/iFNBSuINughEBuEniytLhCITonxu2cFEbvAIeUCgeiYGL/7+AIReHtz6kIfvzc/f9HQGTF+9/EFYoZArFcfDdtizBGIjonxu4/yKgZziDWhj+DToCzGaXrsFAeGlG1S5EW1qcof4hs4qLw+e9bQXrFu7eIMxGUCsV7oKmKWQLRdrFGOMhCVj8PeZJ26m4EvErpy9YyhvWavE4i20RyCVcSa0Cd9ay/MNqN9rmdxiPX8SbR3c1Y+YhXRpBcZh960deUKq4h2mf7sDYtVvIH44JphTegcYvpyvH9oYxPr9kKiDQTbjI1q9+8O+v/ZZrSHVmoxH2+P+oExA6cvGRpqx8Yt1Llzrxi2V8zbC4k6EFpBcGiqQTMIzSJCaAXBzVvbR/dexD7rif6RcwNvf25oCN1myIULrxq2x4fn41+hRR8IDSt5iEyDthmhVzM0rOQxdK2n1cP0dPyD4OgDoTgMvHXJ8PU243D4sJJZROulsHqQJJ5q3Z9tM5hFNKxMhQ8rP/7kVWYRLZTK6kGSeez9zj+fNzQOTYUOK+Xdd18ytEYqqwdJJhC6osHpyoblEwctlK5ocI/G1mmmk8rqQZJ6cc6O1y8wsLTGKqLIW9D//f4fGVhugbYWqc1zkgqE5hCKBMyWnjpiofQHXJFAMdpapDbLSe7Ve7rs2c/ZiMKzCC2RORsRTt9ZSluLpiTfzanLnlzVKDaLkBT/JdxOWnmlNJhcL8lAaA4x+PJ7pZ9HFF1FaA7x5unnmUdsguKQ8neV7Nu9tYLY9af3rOwWs1lE6OlKaf7Bx53945+/T3q11Tc8fM8Llqie6nL+op0i9ygkQ3Go9Frl0y8t1OLSXB6K/fuPG271zrsv2Rcz/7KUJR0I0Xs0epZqdvO+71lZrX7/O/k5kSJvJdPTmGvZ8nnv3kcMa97PrvZ8eukvlrrkAyF9V/5X+kjowbb9urGttmqhvvzvR0RiHcVBx9PLoBSBEEWi1NuNLWw1RJFgu9HYVpRh5dBUmkCItht6ZH5NK4kCg7uY6YrOjr9eyOcyRWm7cfXqmXwlMdA/ZGWiqxR/+/tvkp85fFvP+Pi+upVMfWSnLTzzcP5ZBvkVneyyb6vejD44OGZPnnjRhrLPMmhe0Snh2ZB6KQMhuvS3/MRBW3nsXkuZTpXmB8dafCakP1tBPHDklE1OPm0p0wlJHYIq6ZmQ8gaiaeXYeH7iMLXVRL6leO38tt/hOnHgpB09eiq51YSCoHlDye9wJRCiOOSriQIPW+lGisLA6xdatqW4G205tJqYmDhpKVAUdKWC4+YEYoPYVxOaNejBOZ16X0jsqwnNGrRq4H0h3yAQtxNbKJrP5eyWu1hjC0XzuZxlOdsQgEDcSbeHQisGPfa/W5/s3e2h0IpBUdBt2tyYdlsEYjN0uEqPlO+WQ1Z903P5iiGWVw/u33c8n0/osxvobdvnsisTbCXuikCE0EqidmA0j4WOLreToqBDXjG/B0TDzD27H8xjoc92UhSuXDvDaiEMgSiqGYtVPXNh77Ct7g17u/bd9Mwt5iuE/GG8WRhSe7ZFMxb6GRk5ZKOjh6yVqtUZm/3P2UYYsqsSRKEQAtEqOni1OtYIhR4Yq4DUd1QaD4/N/tu3n8mQ/4XPfnQTmS5Hap6gz94vvmrcgVqyh93o4NVoFoqRLBRDu8ZscGgs/73B7NcDA0P5r9fTX/jl5Wr+uXBjxhayIFSzz/m5izY3f5EgtAaBAOCqJ/tEKQBbRyAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4CAQAF4EA4CIQAFwEAoCLQABwEQgALgIBwEUgALgIBAAXgQDgIhAAXAQCgItAAHARCAAuAgHARSAAuAgEABeBAOAiEABcBAKAi0AAcBEIAC4CAcBFIAC4KtlP3QDgVvX/A0Wp4tDWBNAwAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAEICAYAAACj9mr/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA48SURBVHgB7d1PbFTXFYDxY894BgYbWhuIwckE0hDc0hCBkoJaWomoogpqVZTuUJbppotssummUqRssukiWWfXKKu2IlJCJKQGpFAJFEQKhMb8aSAGDCW2FZt4bI89nr7zpo7tmAO+4/HM3Pu+nzRyBF2Nyud7z7vvvZbu7k1lAYDFyq0CAAYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJjSgpooZ3NS6uqJPzNr10u5ozP62SnlzOrKJ/r7+VomC9JSHJfWe8PRf49LS/SzdXRQUkO34o/+fZLk0hnJ5zolv6ZL1q9ql/XZ9vhnLpWJ/i4b//18heli9JmUwclv4v/Wn4MT30j/2JD0F4bjP8PytXR3byoLnOk/+KktT0up5ymZ3vykzHR0SS2lhm5KajCKxa3Lkh64GoVkSEKi/+B3d+ald90m6V3bHcWgQ2opDsXYsPSN3JG+0dtxPOCsTCAcaBSKT/1Epp94JorCNqmn9MAVaes75XUsNAr7NmyT3V2VMNRT38htOXn3KrFwQyCWQmMw+dzBukfB0nbtvLRdOhX/9IGuEA7ld9U9CpazQ19GsbgiZ4f7BQ9EICyzq4XiM/trvn2oFV1JZD85KplLp6XZzK4WDmzeEc8SmpHOLY70fxrHAvdFIO6nuHO/TDz7wqLBYrNqtlAc2LQjXjF8d7DYrAiFiUDMp1uI8edfatoVw8M0OhS6lXh52y+adsXwMIRiEQKhNAgTP/udTG3dKSHQQGgo6jXM1EuSh7fuiYaPj0sINBBHbnzKMJNAiEz17pXxn77ozXZiqeq1mti3cVscB1+2E0vFaiKW3EBoECajOcNkNG8IWfb8Ccme+SA+jFVLGoRDj+2Kh5AhOzZwMV5NJPTgVTIDoVuKsd++4u2swZWuJta891bNthy6pfjjjw96O2twpauJNz47msQtRznV3t7xmiRIqetRGXvxVSnn1klS6GppOpqvxIesCqOyHPk1nfKnnb+RdZnVkhTxqc9ovqKHrUamarsSa3aJCoTOG8Z+/QeRdJskTTxjKU1J243PpVo6b3h1x6+krTUlSaOR2N/dG60m7sVHuJMiMTdr6dmG8ehKRVLp9mLVmaNSLT3bcPiJPZJ0ehk3l8rKsdsXJQkScbt30uOg1rz3ZtWDSuKwkH4X+p0kQfCBiC9jJjwOlTMR1S2L48uYxGER/U72bXxSQhd0IHQgWdj/kiRZfB7iwnGphg4kX972c8H96XZDv6OQBRsIvYRZeOH3knS6eqhma6GXMl/p/aXgwUK/3BtkIHRin6RzDpbUwJWqTlLqxD5J5xyWY/a7Cu0k6awgA6EnJJMeB5X76C9SDT0hSRyWTldb+p2FKLhAFLfvCf749FJkLp2qajCpQ8nQj0+vBP3OQhxaBhUIXTXok59QmT24Cvk3YT0c3ro3uJVXUIGYePYgWwupfvWgD3lha1E9nUMc3hLWJeFgAqFbi6lerterzPkT4kq3FvrB8ug9G73ruiUUwQSCrUWFXrlIDd4UV2wtakfPR4QiiEDo6oGtRUWm75S40pUDW4va0VlOKEexgwgEq4cKPTVZzbkHVg+159NDex/E+0CwepijL9dxxephZcw+9t933geC1cOctj5WD83kQI//2wyvA6FPoWb1UKHbC9cVhE7cWT2sHJ1F+H5Fw+tAFLfvFVRUtb3YEP7tyo3m+wrN20DoymE6kPdY1EL6C7f3dOpvt1DeY9HM9H2kPg8rvQ3E9GZ++82Xvu22gmiWF+kmgc/DSm8DoU+KQoUejnJ95kMSnobULHZ35cVXXgYi3l5s5ljwLNeTk5XhGSuIevF5m+FlINheLJS+xfai2e3u9HPe42kgnhLMcZ8/hHMzkS98/c793GJs6BFU6OzBdf6Qb+fsSL35umrzLhDl7Or4adWoaB1ymz/oXjifC/tJzM1I5z4+ziG8CwRxWMh1QEkcGsfHR+QTCM85by/WsL1olHzOv+/eu0DMrOU34HzOlzi596JhfPzu/QsEN2ct0FJ0W0HoXhiN4eN3799VjGhIiTmugQj1BS8+YAVRB6UOthjzuc4g1mc7BI2RS2fFN/6tIDI5wRx9DoQLVhCNk0txmXPFldliLAuBaBzOQQAICoEAYCIQAEzeBcJ1ah8615lMYbooaAwfv3v/VhDFgmBO2fGqDoFonEKJQKy41iIriOUozBCIRhmcuCe+8W+LMer+WvuQzTgeHBsc9+//pKFgi1EHrgeDQucciMlvBI3h43fvXyBYQSxQzrrNIAYnCESj+PjdexeIlOMTlEI3s97t+Rj9BVZgjeLjd08gPOe6xegfYwXWKD5+916eg2hhDvEt1yds6aCMbUb99Y8NMaSsF9f3QIRMD0q5PkSnb+S2oL58Xbn5GYgBAjFfqcvtNQB9o3cE9eVrlL0MRNt1tzdZh266x+01hGeHvxTUl69R9jIQOodgFTHH9UqG7oXZZtSPfte+zn28vZsz/QWriFn6ImPXm7bODvUL6uPkXX9/mXkbiMzlU4I5rlczTn7FCqxefJ75eBsIthkLTW3d6fS/Z5tRH2eHvvT6srLXD4zJfnJUUDG1fa+4OnLjU8HK8nl7obwOhK4guHmrQmcQOotw0Tdyx8tbkH0xOHkvumLk96zH+0fOZc6dEFS4bjPUsYF/C1bGkX7/V2j+ByIaVvIYugrdZrhezdBhJU+Zqj1dPZy8e1V8530gNA7ZMx8IKtuMqS3uw8ojN84KaiuE1YMK4qnW2fMnmEX831Sv+7BStxnMImonlNWDCuax96s/ekdQOTTlOqxUb1/9WFAboaweVDCB0Csabdc4XakmnzsorvSKhl6zx/LoZc1QVg8qqBfnrPrnXxlYSmUV4XoLuHr32mkGlsugW4vQzpYEFYjWe8NxJCAy/vxL4kofqvruNY6wV0u3FqE9jCfV3t7xmgQkNXQrnuaXHtkqSaYriMpBMrcHleiDTXJtGflBx0bB0h27fVE+uHlBQhPkuzlXnTnKVQ2pbhahKr8JuaqxVPHWIqDB5HxBBkLnEGveezPx84hqr2joHOKNzz5kHrEEGoeQv6tg3+6tS2uNRNLpLML1dKXSecQbn3Ez3MO89fk/gn4IcHAziPlax0fjrcb01mckqeIX66Qykr7hfs/FyNR4/Btyd9fjgsXevvKxXPj6loQs6EAoHVq2FAsynf+RJFXpkS1VDSyVDi0LpUl5+vtuD6QJnV4SPn6nT0IXfCBU+r/XiUTPNslcOi0tpWlx9Z97XxGJeTQOxwYuShIkIhBKI5Hk7cZythpKI8F2o7KtSMLKYVZiAqF0u6HHsafzP3R+6a3vWiYL8SGy1vHqL1/qdkMfmf/093okl85KkhSmJ+X18+8HP3P4rkQFQungMo7E1p2JiYSunNr//mdJfX1XlksHl/qUpN2d+cREQldOr194X26Pj0jStHR3bypLAumlv4lnD0px534JWeb88fjgWK3PhOTSGTmU3yUHNu2QkOkJST0EldAzIeXEBmJWcfue+MRhNTc3NTPdUqw+/s6K3+G6b+OTcuixXbJ+VYeERLcUegt8wt8fQiDUTEdnvJqo5mErzajt2rlo3vC3qi5rVmN9tj1eTezb6H5qsxnpbe/vXj/NW9AJxEK+ryZ01qAPzmnU+0J8X03orEGvUuizMRAjEPfjWyh0O5E986Fko3lDM/AtFLqdOHLjX4k52+CAQDxIs4dCVwyZc8clc/l0U96Y1uyh0BXDsVsX5eRXV7kx7f4IxFLo+yaK2/fGl0abQSraQqz65Kg3rx7c3ZWXfRu2Nc0hK33loD75ia3EQxEIFzrM1Nuni9Ews7S5vgM5jULbF+eadrWwFDrM7F3XHQ8ze9dtknrSKOjwkdWCEwJRrdlY6Ke04VGZ6artfQot0fYhPXBV0rcuS9v188E922I2FhqK/JrO6FPbbZw+8Ebfqh2HYbifKFSHQNRK/Ji7KBKlrh6ZWdsVzy30zzQkklm96NSmDhalOC4t0ad1dDieJ7SODsXHwVNDNxP3sBs9eBWHItcZzyw0IPpnsz+/e2pTB4v6j75QKsaXI/X5FRqF/sJw5Q5UglALBAKAqRzsE6UALB+BAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYEpHn7IAwGLl/wG3HO+wiyOptAAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAEICAYAAACj9mr/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA6ASURBVHgB7d1NbFTXFcDxAwYTD/4AzyAbPKbgCJs0UTBqUGNnUTVkUwmnUqUmy9JtK7WLdNHusmsrJcuukyyTRaXILLqIU6lSIRWofFQksVEwjT/AZYzDGGawjXHfeVPLpuYQ3/F4PPe+/0+yiMDZjODve8+7771t7e37lwQA1lraLgBgIBAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAaYegInbtSEk6lZV0Q1aan8lI0660NO/KSH1dQ/ylf77a3MOCzC8WZXZuWuYWC/Gv+Qc5mS6Oy3RhPP7zJEnt2C6dzQ2Sjb4yDfXR5xh9peqj36+Thvrt8a+rFR4uSnH+keSK81JcWIw+t/n4v8fzRRmLvgoPHwk2blt7+/4lgTP9B39ozzHpaO6RA83dcRAqSSORuz8mE/lhmZwdiQMSEg1Cb1uLdKcbpae1MYrBTqmksfyDOBQjd+7J8PS9KCALAmdLBMKBRqE7/bJ0tR6Po1BNk/kR+fL2Wa9joVHoy7bGYehJ75ZqGp6+L+cm7hALNwRiPTQGJzoGqh4Fy+jMJRm+fS7+1Qc9rbvl1JH2qkfBculWPo7Fxam84KkIhGV5tXBs/2sV3z5Uiq4kzo8PynDunNSa5dXCa4cz8TyhFuncYvDalJwdnxE8EYF4khfbT8pLHafWDBZrVa2F4uShjAx0t60ZLNYqQmEiEKvpFuLVrtM1u2L4NlsdCt1KnD7WWbMrhm9DKNYgEEqD8MrBN+Rwa6+EQOcT5ycGqzbMTDfslDe+2yHH25olBBqIwWu3GGYSCJGj+/ql/+BPvdlOrFe1VhP92b1RHA54s51YL1YTseQGQoOgcwadN4Tsys0huTB5puIHr3QIOdDdHs8bQvbJaE7ORKHQg1kJlMxA6Jbix8+95e2swZWuJj7+4t2KbTl0S/Gbl5/1dtbgSlcT73z2VRK3HEt1jY1Nb0uC6HHonzz/W0nVt0hS6Grp8N7e+JBVYWFj1/6zzc/I7145Ii27KnvysZaldtbJ8faW+FRmfu6hJEmiAqHzhlNHfyU7tifnL/cyjcTiowUZu3tVyqXzhl+f6JKd25N3j59G4gcH0zJdmJex2QeSFIm5WUtnDa985w1JKt1eXJg4I+XSWcOb0TAy6fQybkMUi6EbOUmCRPwoSHoclM4gyh1UEofH6WcR+nB2WfCB0G1F0uOglzvLHVDqtoI4rKWfSX/HXgld0IHQgeQPu34mSaZh+NfUp1IOHUiefrFT8GS63eiMPqOQBRsIvYT5o+5fSNLpicpythZ6KfOX3zskeLq3vv9s/FmFKshA6MQ+SeccLJP54fjYtSs9BJWkcw4boVc39LMK7STpsiADoSckkx4H9en1D6QcekKSOKyfflanjrRJiIILRE+mL/jj0+uhK4dyBpN90VAyKRP6StLnXoQ4tAwqELpqOJEdEJRmD650L/16oD8Jq0FvWgttHhFUINhalJS7ehg4wtZiI3Qe8eZzYV0SDiYQurXQMw8QuTI1JK50a6FnHrAxve0t0t1aG8/erIRgAsHWokSvXOjj8l2xtaicnx8L5+xIEIHQ1QNbi5Ivy3hAjK4e2FpUjn6WoQx6gwgEq4cSnTuUc+6B1UPlDRzx56G9T+N9IFg9rNCX67hi9bA5dGDZF8BMx/tAsHpY8WXurLhi9bB59GyE77wOhD4lidVDiW4vXFcQvW3NrB42kX62vl/R8DoQPfv6BCXlbC/6s62CzTXg+QrN20DoykFXECi5PnPR6fv1xF9vIO+xqGU96Uavh5XeBuJAU228SLdW3Jy95vT93dFfXFSHz8NKbwPBqckVejjK9ZkP/R1sL6rF55Wal4HQ7YW+RxMlucK40/fr9qInHc5x4Frn8zbDy0CwvXjcRLSCcMH2ovp62/1cRfgZCFYPj3GdP/S0Eohq6/b0M/cyEPtSPEh12dxiwXn+EPqDVmuRr1s67wKxqy4l6d0EYtm0452begS4s7lBUF16aMrHOYR3gUjvzgpWuA4oO5tYPWyVrIcrN/8CkSIQq7luL7KsHraMjys37wLRvIsHqq6WK7htMTIp7r3YKhkP73vxLhDcnPW4+cWi0/dzc9bW8fGz93JIiRWugWgI9AUvPvDxidesIDznOoPIpMJ9TVytS9VzFWPT1dcxZFvN9fH2DTtZQWwVH1dv/m0xdrDF2IhQ3yHpg5SHcQ727d4ANo5AADARCAAm7wLhOrUPnetMpvBwUbA1Cgv+ffbeBcL1un/oXK/qFD38SxqKoodx9i8QrCA2xMefYqHIFebFN94FIj/v/lr7kLkeHJsuLgi2RnHhkfjGu0C4HgwKXVO9ayD8+ykWCh8/e/9WEHM5wQrXIaWPy9xQ5AjE5pt2fEBK6DKOj98byzPk3Spj+QfiG/8CcZ9ArOY6gxif9e8vaSjGPYyzf+cgFgvMIVZxfQSfXsVgDlF9Y3eLXp5B8fIkpet7IEKmz8dwXUUMT98XVNeYpys3LwNRzpusQ+b6nM7hO/cE1TUy7edn7mUgbsxcFqzoaO5x+v7LU3lBdQ3f8XPV5mUgdA7BKmKF65UMnUMMe/oTzUf6Wfs69/H2bs7rMxcFJfoqQtfzEJdYRVTNufEZ8ZW3gRi5/Zlghesc4tyEv39pfePr9kJ5Gwi2GY87vLfX6fvZZlTHpVt5ry8re/3AmPMTg4KSnn194mrw2pRgc52duCM+8zoQuoLg0FSJnofQWYSLkWjpO829GZtGP1vfZz3eP3Lu8q1PBCWu2wz1yQ1uftssIazQvA+EDit5DF2JbjNcr2bosJLH0FWerh7OBjAI9j4QOqy8MHlGUNpmHNpzzOn/0WHl4AiziEoLZb4TxFOtr9wcYhbxP0f39YuroWibwSyickJZPahgHnv/6fX3BaVDU67DSvXelTFBZYR0dSiYQOgVjdE7lwQiJzoGxJVe0bg4dVewMWfHZ4JZPaigXpzz968/YmAppVVEOW9B/+jzmwwsN0C3FqGdLQkqEDqH0EhA5NWu0+JKT/x9eHVSUB6NQ2gP46lrbGx6WwKiz6zUS31tjV2SZLqCmJx1P0imj6TTt1B37eEt6i6GRnPyl+u3JTRBvpvzwvgZrmpIebMIFf8k5KrGuoW4tVgWZCD0bMTHX7yb+HlEuVc09GzEO/+4zjxiHTQOIX9Wwb7dW1cQGomk01mE6+lKpXvpdz77SvB0f/rnv4N+CHBwM4jVigt5mZ2fLusehVBoHOq27ZSxu1fFVX7uYfyinePtLYK13r8yJldvz0rIgg6E0qHl/KOiHGx5XpKqramrrIGl0qGlbjle2NckWPHh55Pyt6/9vpV7PYIPhJq6N5r4SOiDbYdz52TxkfvLe0e/KRCJVTQOQwm5CzYRgVAaiSRvNzay1VAaCbYbpW1FElYOyxITCKXbjdGZS3JwzwtlDe58pld09BCZzmXKpdsNPY79QqYpPiuRJLqC+v25r4KfOfy/RAVC6T8QjYSuJJISCZ09/PnzP8o3DzZ+rV4Hl/qUpONtzYmJhF7K/EMUh6n7c5I029rb9y9JAumzE17KnpIX209KyK7cGpILE2cqfiZE4zBwpE1OHspIyPSEpB6CSuiZkKXEBmKZPoVJTxyWc3NTLdMg/HX0g02/w7WvY6+8HoUinaqXkOiWQucNCX9/CIFQGoeXOk6V9bCVWqRR0HlDtY6bpxvq49VEf3avhOBiFIWPoisVvAWdQDzG99WEBkEfnLNV7wvxfTWhs4b3rozLCC83XkYgnsS3UOh2QucMOm+oBb6FIn4uZzRnSMrZBgcE4mlqPRS6YtDH/o/kavPJ3rUeCl0x6GP/9d2Z3Jj2RARiPfSSaE+mTw631sYhq8n8sJyPVgy+vHqwt61F+rJ7okujtXHISl85OHjtP2wlvh2BcKErCb19+mimv6zbqDdCo3B95lLNrhbWQ4eZ3a2742FmT7pRqkmjoFckWC04IRDlWo7FgaZu2ZfqlPTuTqkk3T7oCmEiCsONby4H92yL5VhoKDqbn4m+GqSSdPswHK0QhqcLcnnqLlEoD4GoFD2VmU5l46/mXRlpqk/Hv6chqa9rWHNqU//Bzy8WZT76NR/FQO8Tyc/l4uPg+pW0h92kdtRJNoqExiITxaM1tTP+Pf3vhp11a05t6mCxGH3pP/xcdDnyTmEh/nUs/0DG80WCUBkEAoBpKdgnSgHYOAIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHARCAAmAgEABOBAGAiEABMBAKAiUAAMBEIACYCAcBEIACYCAQAE4EAYCIQAEwEAoCJQAAwEQgAJgIBwEQgAJgIBAATgQBgIhAATAQCgIlAADARCAAmAgHAtCP6WhIAWGvpv55E+lSGKsriAAAAAElFTkSuQmCC"] : ["data:image/png;base64,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", "data:image/png;base64,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", "data:image/png;base64,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"],
                imgStyle: {width: 66, height: 66}
            }, {
                label: "线样式",
                key: "setting-line",
                defaultValue: "2",
                imgs: T().isDark ? [sg, fg, mg] : [lg, pg, dg],
                imgStyle: {width: 144, height: 80},
                desc: ["折线", "圆角", "曲线"]
            }, {
                label: "箭头样式",
                key: "setting-arrow",
                defaultValue: "0",
                imgStyle: {width: 144, height: 80},
                imgs: T().isDark ? [hg, gg] : [vg, "data:image/png;base64,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"]
            }], xg = function (e) {
                var t = e.item, n = e.key, r = (0, o.useState)(localStorage.getItem(t.key) || t.defaultValue),
                    a = I()(r, 2), i = a[0], c = a[1];
                return o.createElement("div", {
                    className: "setting-card",
                    key: n
                }, o.createElement("div", {className: "setting-card-title setting-card-gap"}, t.label), o.createElement("div", {
                    style: {display: "flex"},
                    className: "setting-card-gap"
                }, t.imgs.map((function (e, n) {
                    return o.createElement("img", {
                        src: e,
                        style: wg(wg({}, t.imgStyle), {}, {marginRight: 12, borderRadius: 8}),
                        className: i === String(n) ? "active" : "",
                        key: e,
                        onClick: function () {
                            localStorage.setItem(t.key, String(n)), c(String(n)), "setting-mode" === t.key ? location.reload() : window.update()
                        }
                    })
                }))), t.desc && o.createElement("div", {
                    style: {display: "flex"},
                    className: "setting-card-gap"
                }, t.desc.map((function (e) {
                    return o.createElement("span", {
                        style: wg(wg({}, t.imgStyle), {}, {
                            height: "auto",
                            marginRight: 12
                        }), key: e
                    }, e)
                }))))
            }, Sg = [{
                label: "外观", key: "appearance", children: o.createElement("div", null, kg.map((function (e, t) {
                    return o.createElement(xg, {item: e, key: t})
                })))
            }, {label: "自动备份", key: "autoBackup", children: o.createElement(Cg, null)}];

            function Tg() {
                var e = (0, o.useState)(!1), t = I()(e, 2), n = t[0], r = t[1], a = (0, o.useState)(Sg[0].key),
                    i = I()(a, 2), c = i[0], u = i[1];
                return (0, o.useEffect)((function () {
                    Jd.lockScroll(n)
                }), [n]), (0, o.useEffect)((function () {
                    return Pi(Ti.TOGGLE_SETTING_VISIBLE, (function (e, t) {
                        r((function (t) {
                            return (0, El.Z)(e) && (e = !t), e
                        })), t && u(t)
                    }))
                }), []), o.createElement(o.Fragment, null, o.createElement("div", {
                    onClick: function () {
                        return r(!0)
                    }
                }, "设置"), o.createElement(to, {
                    wrapClassName: "app-header-setting-modal",
                    width: 720,
                    title: "设置",
                    footer: null,
                    open: n,
                    onCancel: function () {
                        return r(!1)
                    }
                }, o.createElement(ug.Z, {activeKey: c, tabPosition: "left", onChange: u, items: Sg})))
            }

            function Dg() {
                var e = (0, Fh.H)(), t = I()(e, 1)[0];
                return o.createElement("div", {className: "app-header-right"}, o.createElement(fo, {
                    placement: "bottomRight",
                    overlayClassName: "app-header-help",
                    forceRender: !0,
                    menu: {
                        items: [{
                            key: "question", label: o.createElement("div", {
                                onClick: function () {
                                    return window.open("https://web.vip.miui.com/page/info/mio/mio/detail?postId=37422595")
                                }
                            }, "问题反馈")
                        }, {
                            key: "community", label: o.createElement("div", {
                                onClick: function () {
                                    return window.open("https://www.xiaomi.cn/board/38676026")
                                }
                            }, "交流社区")
                        }, {key: "updateLog", label: o.createElement(cg, null)}, {
                            key: "help-center",
                            label: o.createElement("div", {
                                onClick: function () {
                                    return window.open("https://web.vip.miui.com/page/info/mio/mio/detail?postId=37417860")
                                }
                            }, "使用教程")
                        }, {
                            key: "quick-key",
                            label: o.createElement("div", {
                                style: {opacity: t.includes("graph") ? 1 : .3},
                                onClick: function () {
                                    Ri(Ti.TOGGLE_HELP_VISIBLE)
                                }
                            }, "快捷键指南")
                        }, {key: "setting", label: o.createElement(Tg, null)}]
                    }
                }, o.createElement(We.Z, {className: "icon-square icon-more", component: fc})))
            }

            function Pg() {
                return o.createElement("div", {className: "app-header"}, o.createElement(Wh, null), o.createElement(og, null), o.createElement(Dg, null))
            }

            const Rg = (0, o.memo)(Pg);
            var Bg = n(65460);

            function Ig() {
                return Ig = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Ig.apply(this, arguments)
            }

            const jg = e => o.createElement("svg", Ig({
                width: "1em",
                height: "1em",
                viewBox: "0 0 21 20",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M10.184 2.75a7.25 7.25 0 1 1 0 14.5 7.25 7.25 0 0 1 0-14.5Zm.01 9.303a.68.68 0 1 0 0 1.36.68.68 0 0 0 0-1.36Zm.084-5.678c-1.544 0-2.113 1.105-2.198 2.034-.012.138.1.25.239.25h.685c.045 0 .081-.035.083-.079.053-.88.45-1.32 1.191-1.32.763 0 1.14.39 1.129 1.168-.015.281-.16.545-.434.79-.41.369-.95.929-1.093 1.197-.114.214-.17.507-.188.832a.24.24 0 0 0 .243.25h.524a.25.25 0 0 0 .25-.252v-.076c0-.309.12-.493.377-.754.412-.418 1.375-.878 1.375-1.987 0-1.11-.498-2.053-2.183-2.053Z"
            }));
            var Ng = function (e) {
                    var t = function (e) {
                        var t = [], n = [];
                        return e.forEach((function (e) {
                            var r = n.indexOf(e.siid);
                            r > -1 ? t[r].list.push(e) : (n.push(e.siid), t.push({
                                siid: e.siid,
                                sDescription: e.sDescription,
                                list: [e]
                            }))
                        })), t
                    }, n = e.filter((function (e) {
                        return !e.proprietary
                    })), r = e.filter((function (e) {
                        return e.proprietary
                    }));
                    return [t(n), t(r)]
                }, Lg = 1, Qg = 2,
                Mg = [{name: "事件发生或状态更新", id: Lg}, {name: "查询当前状态", id: Qg}, {name: "执行操作", id: 3}],
                Zg = (0, o.memo)((function (e) {
                    var t = e.visible, n = e.onClose, r = e.device, i = (0, o.useState)(!1), c = I()(i, 2), l = c[0],
                        s = c[1], p = (0, o.useState)({}), f = I()(p, 2), d = f[0], m = f[1],
                        v = (0, o.useMemo)((function () {
                            return Ng([].concat(a()(d.event || []), a()(d.propertyNotify || [])))
                        }), [d]), h = I()(v, 2), g = h[0], y = h[1], A = (0, o.useMemo)((function () {
                            return Ng([].concat(a()(d.action || []), a()(d.propertySet || [])))
                        }), [d]), b = I()(A, 2), E = b[0], C = b[1], O = (0, o.useMemo)((function () {
                            return Ng(a()(d.propertyGet || []))
                        }), [d]), w = I()(O, 2), k = w[0], x = w[1], S = (0, o.useState)(Lg), T = I()(S, 2), D = T[0],
                        P = T[1], R = (0, o.useMemo)((function () {
                            return D === Lg ? [g, y] : D === Qg ? [k, x] : [E, C]
                        }), [D, k, g, E, x, y, C]), B = I()(R, 2), j = B[0], N = B[1], L = (0, o.useCallback)(function () {
                            var e = Fr()(Yr().mark((function e(t) {
                                var n;
                                return Yr().wrap((function (e) {
                                    for (; ;) switch (e.prev = e.next) {
                                        case 0:
                                            return e.prev = 0, s(!0), e.next = 4, Jd.gateway.getDeviceDetailByUrn(t);
                                        case 4:
                                            n = e.sent, m(n), e.next = 12;
                                            break;
                                        case 8:
                                            e.prev = 8, e.t0 = e.catch(0), u(e.t0), oo.error("加载失败");
                                        case 12:
                                            return e.prev = 12, s(!1), e.finish(12);
                                        case 15:
                                        case"end":
                                            return e.stop()
                                    }
                                }), e, null, [[0, 8, 12, 15]])
                            })));
                            return function (t) {
                                return e.apply(this, arguments)
                            }
                        }(), []);
                    return (0, o.useEffect)((function () {
                        if (t) {
                            P(Lg);
                            var e = Jd.gateway.data.urnMap[r.urn];
                            e && e.netStatus === oa && m(e), L(r.urn)
                        }
                    }), [r.urn, L, t]), o.createElement(to, {
                        footer: null,
                        className: "device-detail-modal",
                        title: o.createElement("div", {className: "modal-head"}, o.createElement(Fe.Z, {
                            rootClassName: "device-thumb",
                            src: r.icon,
                            preview: !1,
                            fallback: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        }), o.createElement("div", {className: "device-desc"}, o.createElement("div", {className: "device-name"}, r.name), o.createElement("p", {className: "device-meta"}, r.roomName || "未分配", o.createElement("span", {className: "meta-divider"}), r.deviceTypeDescription))),
                        centered: !0,
                        open: t,
                        onCancel: n,
                        width: 480
                    }, o.createElement(yh.Z, {spinning: l}, o.createElement("div", {className: "modal-detail-content"}, o.createElement("div", {className: "content-side-menu"}, Mg.map((function (e) {
                        return o.createElement("div", {
                            className: "menu-item ".concat(e.id === D ? "active" : ""),
                            key: e.id,
                            onClick: function () {
                                P(e.id)
                            }
                        }, e.name)
                    }))), o.createElement("div", {className: "content-main"}, 0 === j.length && 0 === N.length ? o.createElement("div", {className: "no-content-tips"}, o.createElement("img", {src: ic}), o.createElement("p", null, "设备无此功能")) : o.createElement(o.Fragment, null, o.createElement("div", {className: "spec-standard-list"}, j.map((function (e, t) {
                        return o.createElement("div", {
                            className: "spec-group",
                            key: t
                        }, o.createElement("div", {className: "group-title"}, e.sDescription), e.list.map((function (e, t) {
                            return o.createElement("div", {className: "spec-item", key: t}, e.description)
                        })))
                    }))), N.length > 0 && o.createElement(o.Fragment, null, o.createElement(Bg.Z, {plain: !0}, "非标准功能"), o.createElement("div", {className: "spec-unstandard-list"}, N.map((function (e, t) {
                        return o.createElement("div", {
                            className: "spec-group",
                            key: t
                        }, o.createElement("div", {className: "group-title"}, e.sDescription), e.list.map((function (e, t) {
                            return o.createElement("div", {className: "spec-item", key: t}, e.description)
                        })))
                    })))))))))
                })), Vg = function (e) {
                    var t = e.devices, n = (0, o.useMemo)((function () {
                            var e = [], n = [], r = [];
                            return t.forEach((function (t) {
                                t.online && t.specV2Access ? t.pushAvailable ? e.push(t) : n.push(t) : r.push(t)
                            })), [e, n, r]
                        }), [t]), r = I()(n, 3), a = r[0], i = r[1], c = r[2], u = (0, o.useState)(!1), l = I()(u, 2), s = l[0],
                        p = l[1], f = (0, o.useState)({}), d = I()(f, 2), m = d[0], v = d[1],
                        h = (0, o.useCallback)((function () {
                            p(!1)
                        }), []), g = function () {
                            var e = Fr()(Yr().mark((function e(t) {
                                return Yr().wrap((function (e) {
                                    for (; ;) switch (e.prev = e.next) {
                                        case 0:
                                            p(!0), v(t);
                                        case 2:
                                        case"end":
                                            return e.stop()
                                    }
                                }), e)
                            })));
                            return function (t) {
                                return e.apply(this, arguments)
                            }
                        }();
                    return o.createElement("div", {className: "device-list-wrap"}, a.length > 0 && o.createElement(o.Fragment, null, o.createElement("div", {className: "list-title"}, "完全可用"), o.createElement("div", {className: "device-list"}, a.map((function (e) {
                        return o.createElement(Ph, {key: e.did, data: e, onClick: g})
                    })))), i.length > 0 && o.createElement(o.Fragment, null, o.createElement("div", {className: "list-title"}, "部分可用", o.createElement(ho, {
                        title: "设备不支持本地上报给中枢",
                        placement: "right"
                    }, o.createElement(We.Z, {
                        component: jg,
                        className: "device-question-icon icon-square",
                        style: {fontSize: 20, width: 20}
                    }))), o.createElement("div", {className: "device-list"}, i.map((function (e) {
                        return o.createElement(Ph, {key: e.did, data: e, onClick: g})
                    })))), c.length > 0 && o.createElement(o.Fragment, null, o.createElement("div", {className: "list-title"}, "不可用", o.createElement(ho, {
                        title: "中枢不可探测或不支持标准协议",
                        placement: "right"
                    }, o.createElement(We.Z, {
                        component: jg,
                        className: "device-question-icon icon-square",
                        style: {fontSize: 20, width: 20}
                    }))), o.createElement("div", {className: "device-list"}, c.map((function (e) {
                        return o.createElement(Ph, {key: e.did, data: e, onClick: g})
                    })))), o.createElement(Zg, {visible: s, device: m, onClose: h}))
                };
            const Hg = (0, o.memo)(Vg);

            function Fg(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function Gg(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? Fg(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Fg(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var Yg = function () {
                var e = (0, o.useState)({keyword: "", roomIds: [], deviceTypes: []}), t = I()(e, 2), n = t[0], r = t[1],
                    a = (0, o.useState)(!1), i = I()(a, 2), c = i[0], u = i[1],
                    l = (0, o.useState)(Jd.gateway.data.devList), s = I()(l, 2), p = s[0], f = s[1],
                    d = (0, o.useMemo)((function () {
                        return p.filter((function (e) {
                            return e.name.toLowerCase().includes(n.keyword.trim().toLowerCase()) && (!(n.deviceTypes.length > 0) || n.deviceTypes.includes(e.deviceType)) && (!(n.roomIds.length > 0) || n.roomIds.includes(e.roomId))
                        }))
                    }), [n, p]), m = (0, o.useCallback)((function (e, t) {
                        r((function (n) {
                            return Gg(Gg({}, n), {}, H()({}, e, t))
                        }))
                    }), []), v = (0, o.useMemo)((function () {
                        var e = new Set, t = new Set, n = [], r = [];
                        p.forEach((function (a) {
                            t.has(a.roomId) || (n.push({
                                key: a.roomId,
                                label: a.roomName
                            }), t.add(a.roomId)), e.has(a.deviceType) || (r.push({
                                key: a.deviceType,
                                label: a.deviceTypeDescription
                            }), e.add(a.deviceType))
                        }));
                        var a = function (e) {
                            return e.sort((function (e, t) {
                                return e.label.localeCompare(t.label)
                            }))
                        };
                        return [a(n), a(r)]
                    }), [p]), h = I()(v, 2), g = h[0], y = h[1], A = (0, o.useCallback)(Fr()(Yr().mark((function e() {
                        var t, n, r, a;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    return e.prev = 0, u(!0), t = Jd.gateway.data.devList.map((function (e) {
                                        return e.did
                                    })), e.next = 5, Jd.gateway.getDevList();
                                case 5:
                                    f(Jd.gateway.data.devList), n = Jd.gateway.data.devList.map((function (e) {
                                        return e.did
                                    })), r = t.reduce((function (e, t) {
                                        return (n.includes(t) ? 0 : 1) + e
                                    }), 0), (a = n.length - (t.length - r)) > 0 && oo.success("新探测到".concat(a, "个设备")), r > 0 && oo.success("原列表中".concat(r, "个设备未探测到")), a + r === 0 && oo.success("设备列表未发生变化"), e.next = 18;
                                    break;
                                case 14:
                                    e.prev = 14, e.t0 = e.catch(0), window.location.reload();
                                case 18:
                                    return e.prev = 18, u(!1), e.finish(18);
                                case 21:
                                case"end":
                                    return e.stop()
                            }
                        }), e, null, [[0, 14, 18, 21]])
                    }))), []);
                return o.createElement("div", {className: "device-page-container"}, o.createElement(To, {
                    placeholder: "输入想找的设备",
                    value: n.keyword,
                    onSearch: function (e) {
                        m("keyword", e)
                    },
                    extra: o.createElement("div", {className: "device-total-stat"}, o.createElement(kn.Refresh, {
                        style: {marginRight: 10},
                        className: (0, Ge.Z)("icon-square icon-middle", {"icon-rotate": c}),
                        onClick: A
                    }), o.createElement("span", {style: {marginRight: 15}}, "总共", d.length, "个设备"), o.createElement(Th, null))
                }), o.createElement("div", {className: "content-scroll-wrapper"}, o.createElement(xh, {
                    roomTags: g,
                    deviceTypeTags: y,
                    checkedRoomIds: n.roomIds,
                    checkedDeviceTypes: n.deviceTypes,
                    onFilter: m
                }), d.length > 0 ? o.createElement(Hg, {devices: d}) : o.createElement("div", {className: "no-device-content"}, o.createElement("img", {src: ic}), o.createElement("p", null, "无设备"))))
            };
            const zg = o.memo(Yg);
            n(21556);
            var Ug = n(60828), qg = Ug.Z.Dragger;

            function Xg() {
                return o.createElement("div", {className: "recovery-modal-title"}, o.createElement("div", {className: "recovery-modal-main-title"}, o.createElement(Ic, null), o.createElement("div", {className: "recovery-modal-main-title-text"}, "恢复备份")), o.createElement("div", {className: "recovery-modal-sub-title"}, "将用上传文件数据", o.createElement("span", {className: "recovery-modal-sub-title-bold"}, "覆盖当前数据")))
            }

            const Kg = function (e) {
                var t = e.onClose, n = e.onSuccess, r = e.visible, a = (0, o.useState)(null), i = I()(a, 2), c = i[0],
                    l = i[1], s = (0, o.useState)(!1), p = I()(s, 2), f = p[0], d = p[1];
                (0, o.useEffect)((function () {
                    l(null)
                }), [r]);
                var m = function () {
                    var e = Fr()(Yr().mark((function e() {
                        var t, r;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (c && c.name.endsWith(".bak")) {
                                        e.next = 3;
                                        break
                                    }
                                    return oo.error("请上传 .bak 文件"), e.abrupt("return");
                                case 3:
                                    return d(!0), t = new window.FileReader, e.next = 7, new Promise((function (e, n) {
                                        try {
                                            t.onloadend = function () {
                                                var n = t.result;
                                                e(n)
                                            }, t.readAsArrayBuffer(c)
                                        } catch (_a) {
                                            n(_a), oo.error("恢复失败"), u(_a)
                                        }
                                    }));
                                case 7:
                                    return r = e.sent, e.next = 10, Jr.kd.loadBackup(r);
                                case 10:
                                    Ta(), d(!1), n(), oo.success("恢复成功");
                                case 14:
                                case"end":
                                    return e.stop()
                            }
                        }), e)
                    })));
                    return function () {
                        return e.apply(this, arguments)
                    }
                }();
                return o.createElement(L.Z, {
                    className: "recovery-modal ant-small-modal",
                    closable: !1,
                    open: r,
                    title: o.createElement(Xg, null),
                    okButtonProps: {disabled: !c},
                    confirmLoading: f,
                    onOk: m,
                    onCancel: t
                }, o.createElement(qg, {
                    showUploadList: !1,
                    beforeUpload: l
                }, c ? o.createElement("div", {className: "file-content"}, o.createElement(We.Z, {
                    className: "file-picture",
                    component: Je.Z
                }), o.createElement(jc, {
                    className: "file-remove-icon", onClick: function (e) {
                        e.stopPropagation(), l(null)
                    }
                }), o.createElement("p", {className: "file-name"}, c.name)) : o.createElement("div", {className: "upload-hint"}, "将备份文件拖拽至这里上传")), o.createElement(Ug.Z, {
                    className: "upload-button-wrapper",
                    showUploadList: !1,
                    beforeUpload: function (e) {
                        return l(e)
                    }
                }, o.createElement("div", {className: "upload-button bg-normal"}, o.createElement(We.Z, {component: ut.Z}), "上传文件")))
            };

            function Wg(e) {
                var t = e.onClose, n = e.visible, r = Ec.Z.useForm(), a = I()(r, 1)[0], i = (0, o.useState)(""),
                    c = I()(i, 2), u = c[0], l = c[1];
                (0, o.useEffect)((function () {
                    !n && a.resetFields()
                }), [n]);
                var s = function () {
                    var e = Fr()(Yr().mark((function e() {
                        var n, r;
                        return Yr().wrap((function (e) {
                            for (; ;) switch (e.prev = e.next) {
                                case 0:
                                    if (n = u.trim()) {
                                        e.next = 4;
                                        break
                                    }
                                    return oo.warning("请输入备份文件名称"), e.abrupt("return");
                                case 4:
                                    return r = "backupToCloud", oo.info("备份中", {
                                        duration: 0,
                                        key: r
                                    }), t(), e.prev = 7, e.next = 10, Jr.kd.backupManager.createBackup({
                                        from: "fds",
                                        params: {fileName: n}
                                    }, (function (e) {
                                    }));
                                case 10:
                                    oo.success("[ ".concat(n, " ]备份成功")), l(""), a.resetFields(), e.next = 18;
                                    break;
                                case 15:
                                    e.prev = 15, e.t0 = e.catch(7), oo.error("备份失败，请检查网络连接情况");
                                case 18:
                                    oo.destroy(r);
                                case 19:
                                case"end":
                                    return e.stop()
                            }
                        }), e, null, [[7, 15]])
                    })));
                    return function () {
                        return e.apply(this, arguments)
                    }
                }();
                return o.createElement(L.Z, {
                    title: "备份文件名称",
                    className: "ant-small-modal",
                    closable: !1,
                    open: n,
                    onOk: s,
                    onCancel: t,
                    okButtonProps: {disabled: !u.trim()}
                }, o.createElement(Ec.Z, {layout: "inline", form: a}, o.createElement(Ec.Z.Item, {
                    name: "sceneName",
                    style: {width: "100%"},
                    colon: !1
                }, o.createElement(jn.Z, {
                    placeholder: "请输入",
                    autoFocus: !0,
                    onPressEnter: s,
                    onChange: function (e) {
                        return l(e.target.value)
                    }
                }))))
            }

            function Jg(e) {
                var t = e.onClose, n = e.visible, r = (0, o.useState)([]), a = I()(r, 2), i = a[0], c = a[1],
                    u = (0, o.useState)([]), l = I()(u, 2), s = l[0], p = l[1], f = function () {
                        p(!0), Jr.kd.backupManager.getBackupList({from: "fds"}).then((function (e) {
                            e.sort((function (e, t) {
                                return t.ts - e.ts
                            })), c(e)
                        })).catch((function (e) {
                            c([]), oo.warn("获取云端备份文件列表失败")
                        })).finally((function () {
                            p(!1)
                        }))
                    }, d = function () {
                        var e = Fr()(Yr().mark((function e(t) {
                            var n;
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return n = "restoreToLocal", e.prev = 1, e.prev = 2, e.next = 5, sc({
                                            title: "恢复备份",
                                            content: "恢复备份将覆盖当前所有规则，确认恢复[ ".concat(t.fileName, " ]吗？")
                                        });
                                    case 5:
                                        e.next = 10;
                                        break;
                                    case 7:
                                        return e.prev = 7, e.t0 = e.catch(2), e.abrupt("return");
                                    case 10:
                                        return p(!0), oo.info("恢复中", {
                                            duration: 0,
                                            key: n
                                        }), e.next = 14, Jr.kd.backupManager.loadBackup({
                                            from: "fds",
                                            params: t
                                        }, (function (e) {
                                        }));
                                    case 14:
                                        return e.next = 16, new Promise((function (e) {
                                            return setTimeout(e, 3e3)
                                        }));
                                    case 16:
                                        Ri(Ti.RESTORE_SUCCESS), oo.success("[ ".concat(t.fileName, " ] 恢复成功")), e.next = 24;
                                        break;
                                    case 20:
                                        e.prev = 20, e.t1 = e.catch(1), oo.error("恢复失败");
                                    case 24:
                                        return e.prev = 24, oo.destroy(n), p(!1), e.finish(24);
                                    case 28:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, null, [[1, 20, 24, 28], [2, 7]])
                        })));
                        return function (t) {
                            return e.apply(this, arguments)
                        }
                    }(), m = function () {
                        var e = Fr()(Yr().mark((function e(t) {
                            var n;
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.prev = 0, e.next = 3, Jr.kd.backupManager.generateBackup({
                                            from: "fds",
                                            params: t
                                        }, (function (e) {
                                        }));
                                    case 3:
                                        n = e.sent, (0, lf.saveAs)(new window.Blob([new Uint8Array(n)]), t.fileName), oo.success("[ ".concat(t.fileName, " ]导出成功")), e.next = 13;
                                        break;
                                    case 9:
                                        e.prev = 9, e.t0 = e.catch(0), oo.error("导出失败");
                                    case 13:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, null, [[0, 9]])
                        })));
                        return function (t) {
                            return e.apply(this, arguments)
                        }
                    }(), v = function () {
                        var e = Fr()(Yr().mark((function e(t) {
                            return Yr().wrap((function (e) {
                                for (; ;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.prev = 0, e.prev = 1, e.next = 4, sc({
                                            title: "删除备份",
                                            content: "删除备份将删除云端备份文件，确认删除 [".concat(t.fileName, "] 吗？")
                                        });
                                    case 4:
                                        e.next = 9;
                                        break;
                                    case 6:
                                        return e.prev = 6, e.t0 = e.catch(1), e.abrupt("return");
                                    case 9:
                                        return p(!0), e.next = 12, Jr.kd.backupManager.deleteBackup({
                                            from: "fds",
                                            params: t
                                        });
                                    case 12:
                                        oo.success("[ ".concat(t.fileName, " ]删除成功")), f(), e.next = 19;
                                        break;
                                    case 16:
                                        e.prev = 16, e.t1 = e.catch(0), oo.error("删除失败");
                                    case 19:
                                        return e.prev = 19, p(!1), e.finish(19);
                                    case 22:
                                    case"end":
                                        return e.stop()
                                }
                            }), e, null, [[0, 16, 19, 22], [1, 6]])
                        })));
                        return function (t) {
                            return e.apply(this, arguments)
                        }
                    }();
                return (0, o.useEffect)((function () {
                    n && f()
                }), [n]), o.createElement(L.Z, {
                    title: "云端备份文件列表",
                    footer: "[ ".concat(i.length, " / 50 ] 仅保存该家庭最近的25份自动备份和25份手动备份文件，超出时将自动删除最早的备份文件"),
                    open: n,
                    onOk: t,
                    onCancel: t,
                    width: 968,
                    className: "backup-cloud-list-modal",
                    style: {maxHeight: "calc(100vh - 200px)", top: "100px"},
                    styles: {body: {maxHeight: "calc(100vh - 350px)", overflowY: "auto", padding: "16px 24px"}}
                }, o.createElement(yg.Z, {
                    itemLayout: "horizontal",
                    dataSource: i,
                    loading: s,
                    renderItem: function (e) {
                        var t;
                        return o.createElement(yg.Z.Item, {
                            actions: [o.createElement(Q.ZP, {
                                key: "recover",
                                type: "link",
                                onClick: function () {
                                    return d(e)
                                }
                            }, "恢复"), o.createElement(Q.ZP, {
                                key: "export", type: "link", onClick: function () {
                                    return m(e)
                                }
                            }, "导出"), o.createElement(Q.ZP, {
                                key: "delete", type: "link", onClick: function () {
                                    return v(e)
                                }
                            }, "删除")]
                        }, o.createElement(yg.Z.Item.Meta, {
                            title: e.fileName,
                            description: o.createElement(o.Fragment, null, "备份自", new Date(Number(e.ts)).toLocaleString("zh-CN", {hour12: !1}), " | ", null !== (t = e.deviceName) && void 0 !== t ? t : "未找到设备", "(", e.did, ") ", !0 === e.self ? o.createElement("span", {
                                className: "backup-tag",
                                color: "#f50"
                            }, " 本设备 ") : "")
                        }))
                    }
                }))
            }

            function _g(e) {
                var t = e.updateRuleList, n = (0, o.useState)(!1), r = I()(n, 2), a = r[0], i = r[1],
                    c = (0, o.useState)(!1), u = I()(c, 2), l = u[0], s = u[1], p = (0, o.useState)(!1), f = I()(p, 2),
                    d = f[0], m = f[1], v = (0, o.useState)(!1), h = I()(v, 2), g = h[0], y = h[1];
                (0, o.useEffect)((function () {
                    Jr.kd.backupManager.getBackupConfig({from: "fds"}).then((function (e) {
                        var t = e.autoBackup;
                        e.autoBackupLimit;
                        y(!1 === t)
                    })).catch((function () {
                        y(!0)
                    }))
                }), []);
                return o.createElement(o.Fragment, null, o.createElement(Kg, {
                    visible: a, onClose: function () {
                        i(!1)
                    }, onSuccess: function () {
                        i(!1), t(), Ri(Ti.RESTORE_SUCCESS)
                    }
                }), o.createElement(Wg, {
                    visible: l, onClose: function () {
                        s(!1)
                    }
                }), o.createElement(Jg, {
                    visible: d, onClose: function () {
                        m(!1)
                    }
                }), o.createElement(fo, {
                    overlayClassName: "backup-and-restore-dropdown", placement: "bottomRight", menu: {
                        items: [{
                            key: "backup",
                            label: o.createElement("div", {
                                className: "backup-and-restore-dropdown-btn",
                                onClick: function () {
                                    s(!0)
                                }
                            }, "备份至云端")
                        }, {
                            key: "backuplist",
                            label: o.createElement("div", {
                                className: "backup-and-restore-dropdown-btn",
                                onClick: function () {
                                    m(!0)
                                }
                            }, "云端备份文件列表")
                        }, {
                            key: "backupsetting",
                            label: o.createElement("div", {
                                className: "backup-and-restore-dropdown-btn",
                                onClick: function () {
                                    Ri(Ti.TOGGLE_SETTING_VISIBLE, !0, "autoBackup")
                                }
                            }, "自动备份设置")
                        }, {
                            key: "download",
                            label: o.createElement("div", {
                                className: "backup-and-restore-dropdown-btn",
                                onClick: function () {
                                    var e = "backup";
                                    oo.info("生成备份中...", {
                                        duration: 0,
                                        key: e
                                    }), Jr.kd.generateBackup().then(Fr()(Yr().mark((function t() {
                                        var n;
                                        return Yr().wrap((function (t) {
                                            for (; ;) switch (t.prev = t.next) {
                                                case 0:
                                                    return t.next = 2, Jr.kd.generateBackup();
                                                case 2:
                                                    n = t.sent, (0, lf.saveAs)(new window.Blob([new Uint8Array(n)]), "备份".concat((new Date).toLocaleString(), ".bak")), oo.destroy(e), oo.success("备份成功");
                                                case 6:
                                                case"end":
                                                    return t.stop()
                                            }
                                        }), t)
                                    })))).catch((function () {
                                        oo.destroy(e), oo.error("备份失败，请检查网络连接")
                                    }))
                                }
                            }, "备份至本地")
                        }, {
                            key: "upload",
                            label: o.createElement("div", {
                                className: "backup-and-restore-dropdown-btn",
                                onClick: function () {
                                    i(!0)
                                }
                            }, "恢复备份")
                        }]
                    }, onOpenChange: function () {
                        y(!1)
                    }
                }, o.createElement(mo.Z, {
                    title: o.createElement("div", {style: {color: "rgba(0, 0, 0, 0.4)"}}, "建议开启自动备份功能"),
                    color: "#fff",
                    placement: "bottom",
                    open: g
                }, o.createElement(Q.ZP, null, "恢复与备份"))))
            }

            function $g(e) {
                var t, n = e.visible, r = e.record, a = e.onClose, i = Ec.Z.useForm(), c = I()(i, 1)[0];
                (0, o.useEffect)((function () {
                    var e;
                    c.setFieldValue("ruleName", null == r || null == (e = r.userData) ? void 0 : e.name)
                }), [n]);
                var u = function () {
                    c.validateFields().then((function (e) {
                        a(e.ruleName)
                    }))
                };
                return o.createElement(L.Z, {
                    closable: !1,
                    className: "ant-small-modal",
                    open: n,
                    title: "名称",
                    onOk: u,
                    onCancel: function () {
                        return a()
                    }
                }, o.createElement(Ec.Z, {
                    form: c,
                    wrapperCol: {span: 24}
                }, o.createElement(Ec.Z.Item, {
                    name: "ruleName",
                    rules: [{required: !0, message: "名称不能为空"}],
                    initialValue: null == r || null == (t = r.userData) ? void 0 : t.name,
                    style: {marginBottom: 0}
                }, o.createElement(jn.Z, {autoFocus: !0, style: {width: "100%", height: 40}, onPressEnter: u}))))
            }

            function ey() {
                return ey = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, ey.apply(this, arguments)
            }

            _g.propTypes = {updateRuleList: Z().func.isRequired}, $g.propTypes = {
                visible: Z().bool.isRequired,
                record: Z().object.isRequired,
                onClose: Z().func.isRequired
            };
            const ty = e => o.createElement("svg", ey({
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M10 14a.8.8 0 0 1-.8-.8v-2.4H6.8a.8.8 0 0 1 0-1.6h2.4V6.8a.8.8 0 1 1 1.6 0v2.4h2.4a.8.8 0 0 1 0 1.6h-2.4v2.4a.8.8 0 0 1-.8.8Z",
                fill: "#0D84FF"
            }));

            function ny(e) {
                var t = e.list, n = (0, o.useRef)(), r = (0, o.useState)(0), a = I()(r, 2), i = a[0], c = a[1],
                    u = (0, o.useMemo)((function () {
                        for (var e = 0, n = [], r = 0; r < t.length; r++) {
                            var a = t[r], o = Math.min(Jd.measureText(a, 14) + 8, 65) + 4;
                            if (!(e + o + (t.length - (r + 1) > 0 ? Jd.measureText("+".concat(t.length - r), 14) + 4 : 0) < i)) break;
                            e += o, n.push(a)
                        }
                        return [n, t.length - n.length]
                    }), [t, i]), l = I()(u, 2), s = l[0], p = l[1];
                return (0, o.useEffect)((function () {
                    var e = function () {
                        n.current && c(n.current.clientWidth)
                    };
                    return e(), Pi(Ti.CONTAINER_SIZE_UPDATE, e)
                }), []), o.createElement("div", {className: "rule-tag-list", ref: n}, s.map((function (e, t) {
                    return o.createElement("div", {className: "rule-tag-list-item", key: e + t}, e)
                })), p > 0 ? o.createElement("div", {className: "rule-tag-list-item"}, "+", p) : null)
            }

            ny.propTypes = {list: Z().array.isRequired};
            const ry = ny;

            function ay(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function oy(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ay(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ay(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function iy(e) {
                var t = e.value, n = e.checkStyle, r = e.inputStyle, a = e.placeholder, i = e.onChange,
                    c = (0, o.useState)(!1), u = I()(c, 2), l = u[0], s = u[1], p = (0, o.useState)(""), f = I()(p, 2),
                    d = f[0], m = f[1], v = (0, o.useState)({checked: l, inputValue: d}), h = I()(v, 2), g = h[0],
                    y = h[1];
                (0, o.useEffect)((function () {
                    t !== g && (s(null == t ? void 0 : t.checked), m(null == t ? void 0 : t.inputValue))
                }), [t]);
                var A = function (e) {
                    y(e), i(oy(oy({}, e), {}, {key: t.key}))
                };
                return o.createElement("span", {className: "check-box-input"}, o.createElement(Pn.Z, {
                    className: "check-box-input-check",
                    style: n,
                    checked: l,
                    onChange: function (e) {
                        s(e.target.checked), A({checked: e.target.checked, inputValue: d})
                    }
                }), o.createElement(jn.Z, {
                    className: "check-box-input-input",
                    style: r,
                    value: d,
                    placeholder: a,
                    onChange: function (e) {
                        m(e.target.value), A({checked: l, inputValue: e.target.value})
                    }
                }))
            }

            function cy(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function uy(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? cy(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cy(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            function ly(e) {
                var t = e.visible, n = e.record, r = e.ruleList, a = e.onClose, i = Ec.Z.useForm(), c = I()(i, 1)[0],
                    u = em(), l = u.rulesFilter, s = u.setRulesFilter, p = (0, o.useState)(!1), f = I()(p, 2), d = f[0],
                    m = f[1], v = (0, o.useState)([]), h = I()(v, 2), g = h[0], y = h[1], A = (0, o.useState)([]),
                    b = I()(A, 2), E = b[0], C = b[1], O = n.id;
                if ((0, o.useEffect)((function () {
                    if (t) {
                        var e = function (e, t) {
                            var n = {};
                            return e.forEach((function (e) {
                                var r, a = (null == e || null == (r = e.userData) ? void 0 : r.tags) || [];
                                if (a.length) {
                                    var o = e.id === t;
                                    a.forEach((function (t) {
                                        n[t] = n[t] || {
                                            selectedIds: [],
                                            inputValue: t || ""
                                        }, n[t].selectedIds.push(e.id), o && (n[t].checked = !0)
                                    }))
                                }
                            })), Object.values(n).sort((function (e, t) {
                                return e.inputValue.localeCompare(t.inputValue)
                            }))
                        }(r, O);
                        y(e.map((function (e) {
                            return uy(uy({}, e), {}, {key: e.inputValue})
                        }))), C(e)
                    } else y([]), C([])
                }), [t, r, O]), (0, o.useEffect)((function () {
                    m(!1), c.resetFields()
                }), [g]), !O) return null;
                var w = function () {
                    C(c.getFieldsValue().tagList)
                };
                return o.createElement(to, {
                    title: "标签",
                    className: "rule-tag-form-modal",
                    width: 638,
                    open: t,
                    onCancel: function () {
                        return a(!1)
                    },
                    onOk: function () {
                        c.validateFields().then((function (e) {
                            var t = e.tagList;
                            n.userData.tags = t.filter((function (e) {
                                return e.checked && e.inputValue
                            })).map((function (e) {
                                return e.inputValue
                            })), m(!0);
                            var o = t.reduce((function (e, t) {
                                return t.key && (e[t.key] = t.inputValue), e
                            }), {}), i = [n];
                            r.forEach((function (e) {
                                if (e.id !== O) {
                                    var t = !1, n = [];
                                    (e.userData.tags || []).forEach((function (e) {
                                        var r = o[e];
                                        r !== e && (t = !0), r && n.push(r)
                                    })), t && (e.userData.tags = n, i.push(e))
                                }
                            })), Promise.all(i.map((function (e) {
                                return Jr.kd.changeRuleConfig(e)
                            }))).then((function () {
                                a(!0), m(!1)
                            })).catch((function () {
                                oo.warn("部分标签修改失败"), m(!1)
                            })).finally((function () {
                                var e = (l.tags || []).map((function (e) {
                                    return o[e]
                                })).filter(Boolean);
                                s({tags: e, sort: l.sort})
                            }))
                        }))
                    },
                    confirmLoading: d
                }, o.createElement("div", {className: "rule-tag-form-title"}, o.createElement("p", null, n.userData.name), o.createElement("div", {className: "rule-tag-form-title-tip"}, o.createElement("label", {className: "rule-tag-form-title-tip-timestamp"}, "编辑于 ", R()(n.userData.lastUpdateTime).format("MMMDo HH:mm")), o.createElement(ry, {
                    list: E.filter((function (e) {
                        return e.checked && e.inputValue
                    })).map((function (e) {
                        return e.inputValue
                    }))
                }))), o.createElement(Ec.Z, {
                    className: "tag-form-list-wrapper",
                    form: c,
                    onChange: w
                }, o.createElement(Ec.Z.List, {name: "tagList", initialValue: g}, (function (e, t) {
                    var n = t.add, r = t.remove;
                    return o.createElement(o.Fragment, null, o.createElement("div", {className: "tag-form-list"}, e.map((function (e) {
                        return o.createElement(Ec.Z.Item, qe()({}, e, {
                            rules: [{
                                validator: function (t, n) {
                                    if (!n || !n.inputValue) return Promise.reject("");
                                    var r = c.getFieldsValue().tagList;
                                    return -1 !== (void 0 === r ? [] : r).findIndex((function (t, r) {
                                        return r !== e.name && t.inputValue === n.inputValue
                                    })) ? (oo.destroy(), oo.error("标签名重复"), Promise.reject("")) : Promise.resolve()
                                }
                            }],
                            extra: o.createElement(We.Z, {
                                component: it.Z, style: {fontSize: 20}, onClick: function () {
                                    r(e.name), w()
                                }
                            })
                        }), o.createElement(iy, {placeholder: "请输入名称"}))
                    }))), o.createElement("div", {
                        className: "tag-form-list-add", onClick: function () {
                            n({checked: !0, inputValue: ""})
                        }
                    }, o.createElement(We.Z, {component: ty, style: {fontSize: 20}}), "添加新标签"))
                }))))
            }

            iy.propTypes = {
                value: Z().shape({checked: Z().bool, inputValue: Z().string}),
                onChange: Z().func,
                checkStyle: Z().object,
                inputStyle: Z().object,
                placeholder: Z().string
            }, ly.propTypes = {
                visible: Z().bool.isRequired,
                record: Z().object.isRequired,
                ruleList: Z().array.isRequired,
                onClose: Z().func.isRequired
            };
            var sy = n(71230);

            function py() {
                return py = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, py.apply(this, arguments)
            }

            const fy = e => o.createElement("svg", py({
                xmlns: "http://www.w3.org/2000/svg",
                width: "1em",
                height: "1em",
                viewBox: "0 0 20 20"
            }, e), o.createElement("path", {
                d: "M5.043 5a.5.5 0 0 0-.39.813l3.737 4.656a.5.5 0 0 1 .11.313v3.693a.5.5 0 0 0 .316.465l2 .79a.5.5 0 0 0 .684-.465v-4.483a.5.5 0 0 1 .11-.313l3.737-4.656a.5.5 0 0 0-.39-.813H5.043Z",
                stroke: "currentColor",
                strokeWidth: 1.4,
                strokeLinejoin: "round",
                fill: "none"
            }));

            function dy(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function my(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? dy(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : dy(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            var vy = Object.values(rr).map((function (e) {
                return {label: ar[e], key: e}
            }));

            function hy(e) {
                var t = e.dataSource, n = e.ruleList, r = em(), a = r.rulesFilter, i = r.setRulesFilter,
                    c = n.reduce((function (e, t) {
                        var n, r = null == t || null == (n = t.userData) ? void 0 : n.tags;
                        return r && r.length > 0 && r.forEach((function (t) {
                            -1 === e.indexOf(t) && e.push(t)
                        })), e.sort((function (e, t) {
                            return e.localeCompare(t)
                        }))
                    }), []), u = function (e) {
                        (0, El.Z)(c) || l({tags: e.selectedKeys})
                    }, l = function (e) {
                        i(my(my({}, a), e))
                    };
                return o.createElement("div", {className: "rule-list-head-filter"}, o.createElement("div", {className: "rule-list-head-filter-left"}, o.createElement(fo, {
                    menu: {
                        items: vy,
                        selectable: !0,
                        onSelect: function (e) {
                            return l({sort: e.key})
                        }
                    }
                }, o.createElement(sy.Z, {
                    type: "flex",
                    align: "middle",
                    className: "rule-list-head-filter-item ".concat(a.sort !== rr.LAST_UPDATE ? "bg-active" : "bg-normal")
                }, o.createElement(We.Z, {component: ft.Z}), ar[a.sort])), o.createElement(fo, {
                    overlayClassName: "rule-tag-filter-dropdown",
                    menu: {
                        multiple: !0,
                        selectable: !0,
                        items: (0, El.Z)(c) ? [{
                            label: "你还没有给任何自动化添加过标签",
                            key: "empty"
                        }] : c.map((function (e) {
                            return {
                                label: o.createElement("div", {
                                    key: e,
                                    className: "rule-tag-filter-item"
                                }, o.createElement(Pn.Z, {checked: a.tags.includes(e)}), o.createElement("label", {className: "rule-tag-filter-item-text"}, e)),
                                key: e
                            }
                        })),
                        onSelect: u,
                        onDeselect: u
                    }
                }, o.createElement(sy.Z, {
                    type: "flex",
                    align: "middle",
                    className: "rule-list-head-filter-item ".concat((0, El.Z)(a.tags) ? "bg-normal" : "bg-active")
                }, o.createElement(We.Z, {component: fy}), (0, El.Z)(a.tags) ? "" : a.tags.length, " 标签"))), o.createElement("div", {className: "rule-list-head-filter-right"}), t.length, " 个自动化， ", t.filter((function (e) {
                    return e.enable
                })).length, " 个运行中")
            }

            function gy() {
                return o.createElement("div", {className: "rule-empty"}, o.createElement("img", {
                    className: "rule-empty-content-image",
                    src: ic
                }), o.createElement("p", {className: "rule-empty-content-text"}, "没有查找到相关自动化，请重新输入"))
            }

            function yy() {
                return o.createElement("div", {className: "rule-empty"}, o.createElement("img", {
                    className: "rule-empty-content-image",
                    src: ic
                }), o.createElement("p", {className: "rule-empty-content-text"}, "暂无已创建的自动化流程"), o.createElement(Q.ZP, {
                    className: "rule-add-button",
                    icon: o.createElement(We.Z, {component: Pr}),
                    onClick: function () {
                        Ri(Ti.TOGGLE_CREATE_VISIBLE, !0)
                    }
                }, "创建自动化"))
            }

            function Ay() {
                return Ay = Object.assign ? Object.assign.bind() : function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }, Ay.apply(this, arguments)
            }

            hy.propTypes = {dataSource: Z().array.isRequired, ruleList: Z().array.isRequired};
            const by = e => o.createElement("svg", Ay({
                width: "1em",
                height: "1em",
                viewBox: "0 0 40 40",
                xmlns: "http://www.w3.org/2000/svg"
            }, e), o.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M20 15.68a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm0 6.12a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm1.8 4.32a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0Z"
            }));

            function Ey(e) {
                var t = e.record, n = e.onSwitch, r = e.onRename, a = e.onTag, i = e.onCopy, c = e.onDelete;
                return o.createElement("div", {
                    className: "rule-list-item-right", onClick: function (e) {
                        return e.stopPropagation()
                    }
                }, o.createElement(Bo.Z, {
                    className: "rule-list-item-right-switch",
                    checked: t.enable,
                    onChange: n
                }), o.createElement(fo, {
                    menu: {
                        items: [{
                            label: o.createElement("div", {onClick: r}, "重命名"),
                            key: "rename"
                        }, {
                            label: o.createElement("div", {onClick: a}, "添加标签"),
                            key: "tag"
                        }, {
                            label: o.createElement("div", {onClick: i}, "创建副本"),
                            key: "bat"
                        }, {label: o.createElement("div", {onClick: c}, "删除"), key: "delete"}]
                    }
                }, o.createElement(We.Z, {
                    className: "rule-list-item-right-more icon-square",
                    component: by,
                    style: {fontSize: 40, marginLeft: 20}
                })))
            }

            function Cy(e) {
                var t = e.record, n = e.onSwitch, r = e.onRename, a = e.onTag, i = e.onCopy, c = e.onDelete;
                return o.createElement("div", {
                    className: "rule-list-item", key: t.id, onClick: function () {
                        return Jp(t.id)
                    }
                }, o.createElement("div", {className: "rule-list-item-left"}, o.createElement("p", {className: "rule-list-item-left-title"}, t.userData.name), o.createElement("div", {className: "rule-list-item-left-content"}, o.createElement("label", {className: "rule-list-item-left-content-timestamp"}, "编辑于 ", R()(t.userData.lastUpdateTime).format("MMMDo HH:mm")), o.createElement(ry, {list: t.userData.tags || []}))), o.createElement(Ey, {
                    record: t,
                    onSwitch: n,
                    onRename: r,
                    onTag: a,
                    onCopy: i,
                    onDelete: c
                }))
            }

            Ey.propTypes = {
                record: Z().object.isRequired,
                onSwitch: Z().func.isRequired,
                onRename: Z().func.isRequired,
                onTag: Z().func.isRequired,
                onCopy: Z().func.isRequired,
                onDelete: Z().func.isRequired
            }, Cy.propTypes = {
                record: Z().object.isRequired,
                onSwitch: Z().func.isRequired,
                onRename: Z().func.isRequired,
                onTag: Z().func.isRequired,
                onCopy: Z().func.isRequired,
                onDelete: Z().func.isRequired
            };
            const Oy = function () {
                var e = em(), t = e.rulesFilter, n = e.filterName, r = e.setFilterName, a = e.ruleScrollTopRef,
                    i = e.setRuleScrollTop, c = (0, o.useState)(Jd.graphTool.rules), u = I()(c, 2), l = u[0], s = u[1],
                    p = (0, o.useState)(!1), f = I()(p, 2), d = f[0], m = f[1], v = (0, o.useState)({}), h = I()(v, 2),
                    g = h[0], y = h[1], A = (0, o.useState)(!1), b = I()(A, 2), E = b[0], C = b[1],
                    O = (0, o.useState)(!1), w = I()(O, 2), k = w[0], x = w[1], S = (0, o.useMemo)((function () {
                        return function (e) {
                            var t = e.ruleList, n = e.filterName, r = e.rulesFilter, a = t;
                            if (r.tags.length > 0) {
                                var o = r.tags.reduce((function (e, t) {
                                    return e[t] = !0, e
                                }), {});
                                a = t.filter((function (e) {
                                    var t, n = null == e || null == (t = e.userData) ? void 0 : t.tags;
                                    return !(!n || 0 === n.length) && n.some((function (e) {
                                        return o[e]
                                    }))
                                }))
                            }
                            switch (n && (a = a.filter((function (e) {
                                return (e.userData.name || "").toLowerCase().includes(n.toLowerCase())
                            }))), r.sort) {
                                case rr.NAME:
                                    return a.sort((function (e, t) {
                                        return e.userData.name.localeCompare(t.userData.name)
                                    }));
                                case rr.LAST_UPDATE:
                                    return a.sort((function (e, t) {
                                        return t.userData.lastUpdateTime - e.userData.lastUpdateTime
                                    }));
                                case rr.ENABLED:
                                    return a.sort((function (e, t) {
                                        return t.enable - e.enable
                                    }));
                                case rr.DISABLED:
                                    return a.sort((function (e, t) {
                                        return e.enable - t.enable
                                    }));
                                default:
                                    return a
                            }
                        }({ruleList: l, filterName: n, rulesFilter: t})
                    }), [l, n, t]), T = (0, o.useCallback)((function () {
                        (0, El.Z)(l) && m(!0), Jr.kd.getRuleConfigList().then((function (e) {
                            m(!1), e.map((function (e) {
                                return e.userData.name = e.userData.name || "", e
                            })), s(e), Jd.graphTool.rules = e
                        })).catch((function () {
                            m(!1)
                        }))
                    }), [l]);
                (0, o.useEffect)((function () {
                    return T(), Pi(Ti.RESTORE_SUCCESS, T)
                }), []), (0, o.useEffect)((function () {
                    var e = document.getElementById("ruleList");
                    e && (e.scrollTop = a.current)
                }), [S]);
                var D = function (e) {
                    Jr.kd.changeRuleConfig(e).then(T), Ri(Ti.UPDATE_TAB, e)
                };
                return o.createElement(o.Fragment, null, o.createElement(yh.Z, {
                    spinning: d,
                    wrapperClassName: "automation-rule-page"
                }, o.createElement(To, {
                    placeholder: "输入想找的自动化",
                    onSearch: r,
                    value: n,
                    extra: o.createElement(o.Fragment, null, o.createElement(_g, {updateRuleList: T}), o.createElement(Nr, {
                        onClick: function () {
                            Ri(Ti.TOGGLE_CREATE_VISIBLE, !0)
                        }
                    }, "创建自动化"))
                }), o.createElement("div", {className: "content-scroll-wrapper"}, (0, El.Z)(l) ? o.createElement(yy, null) : (0, El.Z)(S) ? o.createElement(gy, null) : o.createElement(o.Fragment, null, o.createElement(hy, {
                    dataSource: S,
                    ruleList: l
                }), o.createElement("div", {
                    id: "ruleList", className: "rule-list", onScroll: function (e) {
                        i(e.target.scrollTop)
                    }
                }, S.map((function (e) {
                    return o.createElement(Cy, {
                        key: e.id, record: e, onSwitch: function () {
                            e.enable = !e.enable, D(e)
                        }, onRename: function () {
                            C(!0), y(e)
                        }, onTag: function () {
                            y(e), x(!0)
                        }, onCopy: function () {
                            Jd.graphTool.appendBatGraph(e.id)
                        }, onDelete: function () {
                            var t;
                            t = e, L.Z.confirm({
                                icon: null,
                                title: "删除自动化流程",
                                content: "删除后，你将无法使用当前自动化流程，且该操作不可撤销。确认删除吗？",
                                onOk: function () {
                                    var e, n = l.find((function (e) {
                                        return e.id === t.id
                                    }));
                                    return Promise.all([Jr.kd.deleteRule(n), (e = Fa(t.id), Da.clearScopeVars(e), va.deleteVar({
                                        scope: e,
                                        all: !0
                                    }).then((function (t) {
                                        return xa.removeCache(e), Sa.removeCache(), t
                                    })))]).then((function () {
                                        oo.success("删除完成"), T(), Ri(Ti.REMOVE_TAB, t.id)
                                    }))
                                }
                            })
                        }
                    })
                })))))), o.createElement($g, {
                    visible: E, record: g, onClose: function (e) {
                        if (e) {
                            var t = l.find((function (e) {
                                return e.id === g.id
                            }));
                            t.userData.name = e, D(t)
                        }
                        C(!1), y({})
                    }
                }), o.createElement(ly, {
                    visible: k, record: g, ruleList: l, onClose: function (e) {
                        e && T(), y({}), x(!1)
                    }
                }))
            };

            function wy(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter((function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    }))), n.push.apply(n, r)
                }
                return n
            }

            function ky(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? wy(Object(n), !0).forEach((function (t) {
                        H()(e, t, n[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wy(Object(n)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    }))
                }
                return e
            }

            const xy = function () {
                var e = (0, o.useState)({keyword: ""}), t = I()(e, 2), n = t[0], r = t[1], a = Xa(), i = a.varList,
                    c = a.fetch, u = (0, o.useCallback)((function (e, t) {
                        r((function (n) {
                            return ky(ky({}, n), {}, H()({}, e, t))
                        }))
                    }), []), l = (0, o.useMemo)((function () {
                        return i.filter((function (e) {
                            var t, r;
                            return (null == (t = e.userData) ? void 0 : t.name) && (null == (r = e.userData) ? void 0 : r.name.toLowerCase().includes(n.keyword.trim().toLowerCase()))
                        }))
                    }), [n, i]);
                return o.createElement(Tc, {
                    onFinish: c, slot: function (e) {
                        var t = e.open;
                        return o.createElement(o.Fragment, null, o.createElement("div", {className: "vars-page-container"}, o.createElement(To, {
                            placeholder: "输入想找的变量",
                            value: n.keyword,
                            onSearch: function (e) {
                                u("keyword", e)
                            },
                            extra: o.createElement(Nr, {
                                onClick: function () {
                                    return t()
                                }
                            }, "创建变量")
                        }), o.createElement("div", {className: "content-scroll-wrapper"}, l.length > 0 ? o.createElement(bc, {
                            canDelete: !0,
                            data: l,
                            onRefresh: c,
                            openEditModal: t
                        }) : o.createElement("div", {className: "no-vars-content"}, o.createElement("img", {src: ic}), i.length > 0 ? o.createElement("p", null, "没有查找到相关的全局变量，请重新输入") : o.createElement(o.Fragment, null, o.createElement("p", null, "暂无已创建的全局变量"), o.createElement(Nr, {
                            iconSize: 24,
                            onClick: function () {
                                return t()
                            }
                        }, "创建变量"))))))
                    }
                })
            };
            var Sy = {DEVICE: "/device", VAR: "/vars", GRAPH: "/graph", RULE: "/"};
            var Ty, Dy = (Ty = function () {
                return T().isSystem && n.e(769).then(n.bind(n, 65769)), T().isDark ? n.e(888).then(n.bind(n, 62888)) : n.e(302).then(n.bind(n, 88302)), o.createElement(nm.ZP, {
                    autoInsertSpaceInButton: !1,
                    theme: {
                        token: {borderRadiusLG: 4},
                        components: {
                            Switch: {
                                trackHeight: 20,
                                trackMinWidth: 36,
                                trackPadding: 4,
                                handleSize: 12,
                                colorTextQuaternary: Nn().BACKGROUND3,
                                colorTextTertiary: Nn().BACKGROUND1
                            },
                            Checkbox: {
                                controlInteractiveSize: 14,
                                borderRadiusSM: 3,
                                colorBgContainerDisabled: Nn().BACKGROUND1,
                                colorBgContainer: Nn().BACKGROUND3
                            },
                            Radio: {dotSize: 6},
                            Button: {
                                paddingInline: 16,
                                paddingInlineLG: 16,
                                paddingInlineSM: 8,
                                controlHeightLG: 52,
                                lineType: "none",
                                defaultBorderColor: Nn().TRANSPARENT,
                                defaultColor: Nn().TEXT2,
                                defaultGhostBorderColor: Nn().TRANSPARENT,
                                fontWeight: 500,
                                defaultShadow: "",
                                dangerShadow: "",
                                primaryShadow: "",
                                defaultBg: Nn().BACKGROUND4,
                                colorBgTextActive: Nn().BACKGROUND3,
                                textHoverBg: Nn().BACKGROUND3,
                                borderColorDisabled: Nn().TRANSPARENT
                            },
                            Dropdown: {
                                paddingBlock: 5,
                                controlPaddingHorizontal: 12,
                                controlItemBgHover: Nn().BACKGROUND_DROPDOWN
                            },
                            Select: {
                                boxShadowSecondary: "0px 10px 20px 0px ".concat(Nn().BACKGROUND3, ";"),
                                paddingXXS: 4
                            },
                            Form: {itemMarginBottom: 8, itemMarginRight: 8}
                        }
                    }
                }, o.createElement(rm.UT, null, o.createElement(Rg, null), o.createElement("div", {className: "app-body"}, o.createElement("div", {className: "common-page"}, o.createElement(Kh, null), o.createElement("div", {className: "main-content"}, o.createElement(am.Z5, null, o.createElement(am.AW, {
                    path: Sy.DEVICE,
                    element: o.createElement(zg, null)
                }), o.createElement(am.AW, {
                    path: Sy.VAR,
                    element: o.createElement(xy, null)
                }), o.createElement(am.AW, {
                    path: "".concat(Sy.GRAPH, "/:id"),
                    element: o.createElement(Hh, null)
                }), o.createElement(am.AW, {path: "*", element: o.createElement(Oy, null)})))))))
            }, function () {
                var e = (0, o.useState)({sort: rr.LAST_UPDATE, tags: []}), t = I()(e, 2), n = t[0], r = t[1],
                    a = (0, o.useState)(""), i = I()(a, 2), c = i[0], u = i[1], l = (0, o.useRef)(0),
                    s = (0, o.useMemo)((function () {
                        return {
                            filterName: c, setFilterName: function (e) {
                                l.current = 0, u(e)
                            }, rulesFilter: n, setRulesFilter: function (e) {
                                l.current = 0, r(e)
                            }, ruleScrollTopRef: l, setRuleScrollTop: function (e) {
                                return l.current = e
                            }
                        }
                    }), [n, c]);
                return o.createElement($d.Provider, {value: s}, o.createElement(Ty, null))
            });
            const Py = function () {
                window._isMounted = !0, Wp("/"), By.render(o.createElement(nm.ZP, {locale: tm.Z}, o.createElement(Dy, null)))
            };
            const Ry = function () {
                !function () {
                    (0, o.useRef)(), (0, o.useRef)();
                    var e = (0, o.useRef)(!1);
                    (0, o.useEffect)((function () {
                        return function () {
                            e.current = !0
                        }
                    }), [])
                }();
                var e = (0, o.useState)(!1), t = I()(e, 2), n = t[0], r = t[1];
                return (0, o.useEffect)((function () {
                    var e = N()().browser, t = e.name, n = e.version, a = parseInt(n.split(".")[0]);
                    ["Edge", "Chrome", "Safari", "MIUI"].some((function (e) {
                        return t.includes(e)
                    })) ? (t.includes("Safari") && a < 15 || ["Edge", "Chrome"].some((function (e) {
                        return t.includes(e)
                    })) && a < 107) && L.Z.info({
                        title: "浏览器版本过低",
                        content: "建议使用 107 及以上版本的 Chrome / Edge 浏览器，或 15 及以上版本的 Safari 浏览器，以获得更好的体验",
                        icon: null
                    }) : r(!0)
                }), []), o.createElement("div", {className: "account"}, o.createElement(L.Z, {
                    open: n,
                    title: "暂不兼容您的浏览器类型",
                    closable: !1,
                    footer: [o.createElement(Q.ZP, {
                        key: "ok", type: "primary", onClick: function () {
                            window.open("https://www.google.cn/intl/zh-CN/chrome/")
                        }
                    }, "去下载")]
                }, "建议您使用 107 及以上版本的 Chrome / Edge 浏览器"), o.createElement("div", {className: "account-content absolute-center"}, o.createElement("div", {className: "account-title"}, "米家自动化极客版"), o.createElement("div", {className: "account-box-title"}, "输入 ", 6, " 位数字登录码"), o.createElement(_d, {onSuccess: Py}), o.createElement("div", {className: "account-tip"}, o.createElement("p", null, "无论输入的登录码是否正确，再次输入都需要重新获取登录码"), o.createElement("p", null, "刷新页面也会导致登录码失效，需要重新获取"))))
            };
            T().isSystem && n.e(769).then(n.bind(n, 65769)), T().isDark ? n.e(888).then(n.bind(n, 62888)) : n.e(302).then(n.bind(n, 88302)), R().locale("zh-cn"), (0, c.j6)({dsn: "https://4734ea6d82b14d26b9c6704a0d209256@sentry.d.xiaomi.net/1257"});
            var By = (0, D.s)(document.getElementById("app"));
            By.render(o.createElement(Ry, null))
        }, 46601: () => {
        }, 89214: () => {
        }, 25819: () => {
        }
    }, u = {};

    function l(e) {
        var t = u[e];
        if (void 0 !== t) return t.exports;
        var n = u[e] = {id: e, loaded: !1, exports: {}};
        return c[e].call(n.exports, n, n.exports, l), n.loaded = !0, n.exports
    }

    l.m = c, l.amdO = {}, e = [], l.O = (t, n, r, a) => {
        if (!n) {
            var o = 1 / 0;
            for (s = 0; s < e.length; s++) {
                for (var [n, r, a] = e[s], i = !0, c = 0; c < n.length; c++) (!1 & a || o >= a) && Object.keys(l.O).every((e => l.O[e](n[c]))) ? n.splice(c--, 1) : (i = !1, a < o && (o = a));
                if (i) {
                    e.splice(s--, 1);
                    var u = r();
                    void 0 !== u && (t = u)
                }
            }
            return t
        }
        a = a || 0;
        for (var s = e.length; s > 0 && e[s - 1][2] > a; s--) e[s] = e[s - 1];
        e[s] = [n, r, a]
    }, l.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return l.d(t, {a: t}), t
    }, n = Object.getPrototypeOf ? e => Object.getPrototypeOf(e) : e => e.__proto__, l.t = function (e, r) {
        if (1 & r && (e = this(e)), 8 & r) return e;
        if ("object" == typeof e && e) {
            if (4 & r && e.__esModule) return e;
            if (16 & r && "function" == typeof e.then) return e
        }
        var a = Object.create(null);
        l.r(a);
        var o = {};
        t = t || [null, n({}), n([]), n(n)];
        for (var i = 2 & r && e; "object" == typeof i && !~t.indexOf(i); i = n(i)) Object.getOwnPropertyNames(i).forEach((t => o[t] = () => e[t]));
        return o.default = () => e, l.d(a, o), a
    }, l.d = (e, t) => {
        for (var n in t) l.o(t, n) && !l.o(e, n) && Object.defineProperty(e, n, {enumerable: !0, get: t[n]})
    }, l.f = {}, l.e = e => Promise.all(Object.keys(l.f).reduce(((t, n) => (l.f[n](e, t), t)), [])), l.u = e => "chunks/" + e + "." + {
        302: "e57ee7",
        769: "33e479",
        888: "6047be"
    }[e] + ".js", l.miniCssF = e => 983 === e ? "lib/983.91755c.css" : 568 === e ? "ai-config-v5/ai-config-v5.c2b5ac.css" : "chunks/" + e + "." + {
        302: "177cda",
        769: "4ead94",
        888: "adea5e"
    }[e] + ".css", l.g = function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), l.hmd = e => ((e = Object.create(e)).children || (e.children = []), Object.defineProperty(e, "exports", {
        enumerable: !0,
        set: () => {
            throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + e.id)
        }
    }), e), l.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), r = {}, a = "ai-config:", l.l = (e, t, n, o) => {
        if (r[e]) r[e].push(t); else {
            var i, c;
            if (void 0 !== n) for (var u = document.getElementsByTagName("script"), s = 0; s < u.length; s++) {
                var p = u[s];
                if (p.getAttribute("src") == e || p.getAttribute("data-webpack") == a + n) {
                    i = p;
                    break
                }
            }
            i || (c = !0, (i = document.createElement("script")).charset = "utf-8", i.timeout = 120, l.nc && i.setAttribute("nonce", l.nc), i.setAttribute("data-webpack", a + n), i.src = e), r[e] = [t];
            var f = (t, n) => {
                i.onerror = i.onload = null, clearTimeout(d);
                var a = r[e];
                if (delete r[e], i.parentNode && i.parentNode.removeChild(i), a && a.forEach((e => e(n))), t) return t(n)
            }, d = setTimeout(f.bind(null, void 0, {type: "timeout", target: i}), 12e4);
            i.onerror = f.bind(null, i.onerror), i.onload = f.bind(null, i.onload), c && document.head.appendChild(i)
        }
    }, l.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, l.nmd = e => (e.paths = [], e.children || (e.children = []), e), l.j = 568, l.p = "//cdn.cnbj1.fds.api.mi-img.com/mijia-tob/prod/ai-config/", o = e => new Promise(((t, n) => {
        var r = l.miniCssF(e), a = l.p + r;
        if (((e, t) => {
            for (var n = document.getElementsByTagName("link"), r = 0; r < n.length; r++) {
                var a = (i = n[r]).getAttribute("data-href") || i.getAttribute("href");
                if ("stylesheet" === i.rel && (a === e || a === t)) return i
            }
            var o = document.getElementsByTagName("style");
            for (r = 0; r < o.length; r++) {
                var i;
                if ((a = (i = o[r]).getAttribute("data-href")) === e || a === t) return i
            }
        })(r, a)) return t();
        ((e, t, n, r) => {
            var a = document.createElement("link");
            a.rel = "stylesheet", a.type = "text/css", a.onerror = a.onload = o => {
                if (a.onerror = a.onload = null, "load" === o.type) n(); else {
                    var i = o && ("load" === o.type ? "missing" : o.type), c = o && o.target && o.target.href || t,
                        u = new Error("Loading CSS chunk " + e + " failed.\n(" + c + ")");
                    u.code = "CSS_CHUNK_LOAD_FAILED", u.type = i, u.request = c, a.parentNode.removeChild(a), r(u)
                }
            }, a.href = t, document.head.appendChild(a)
        })(e, a, t, n)
    })), i = {568: 0}, l.f.miniCss = (e, t) => {
        i[e] ? t.push(i[e]) : 0 !== i[e] && {302: 1, 769: 1, 888: 1}[e] && t.push(i[e] = o(e).then((() => {
            i[e] = 0
        }), (t => {
            throw delete i[e], t
        })))
    }, (() => {
        var e = {568: 0};
        l.f.j = (t, n) => {
            var r = l.o(e, t) ? e[t] : void 0;
            if (0 !== r) if (r) n.push(r[2]); else {
                var a = new Promise(((n, a) => r = e[t] = [n, a]));
                n.push(r[2] = a);
                var o = l.p + l.u(t), i = new Error;
                l.l(o, (n => {
                    if (l.o(e, t) && (0 !== (r = e[t]) && (e[t] = void 0), r)) {
                        var a = n && ("load" === n.type ? "missing" : n.type), o = n && n.target && n.target.src;
                        i.message = "Loading chunk " + t + " failed.\n(" + a + ": " + o + ")", i.name = "ChunkLoadError", i.type = a, i.request = o, r[1](i)
                    }
                }), "chunk-" + t, t)
            }
        }, l.O.j = t => 0 === e[t];
        var t = (t, n) => {
            var r, a, [o, i, c] = n, u = 0;
            if (o.some((t => 0 !== e[t]))) {
                for (r in i) l.o(i, r) && (l.m[r] = i[r]);
                if (c) var s = c(l)
            }
            for (t && t(n); u < o.length; u++) a = o[u], l.o(e, a) && e[a] && e[a][0](), e[a] = 0;
            return l.O(s)
        }, n = self.webpackChunkai_config = self.webpackChunkai_config || [];
        n.forEach(t.bind(null, 0)), n.push = t.bind(null, n.push.bind(n))
    })(), l.O(void 0, [514, 634, 280, 983, 664], (() => l(16862)));
    var s = l.O(void 0, [514, 634, 280, 983, 664], (() => l(86123)));
    s = l.O(s)
})();
