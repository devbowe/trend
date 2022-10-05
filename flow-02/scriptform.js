//validations
!(function (t) {
    "function" == typeof define && define.amd
        ? define(["jquery"], t)
        : t(window.jQuery || window.Zepto);
})(function (t) {
    var e = function (e, a, n) {
            var r,
                o,
                s = this;
            (e = t(e)),
                (a = "function" == typeof a ? a(e.val(), void 0, e, n) : a);
            var i = {
                getCaret: function () {
                    try {
                        var t,
                            a = 0,
                            n = e.get(0),
                            r = document.selection,
                            o = n.selectionStart;
                        return (
                            r && !~navigator.appVersion.indexOf("MSIE 10")
                                ? ((t = r.createRange()).moveStart(
                                      "character",
                                      e.is("input")
                                          ? -e.val().length
                                          : -e.text().length
                                  ),
                                  (a = t.text.length))
                                : (o || "0" === o) && (a = o),
                            a
                        );
                    } catch (t) {}
                },
                setCaret: function (t) {
                    try {
                        if (e.is(":focus")) {
                            var a,
                                n = e.get(0);
                            n.setSelectionRange
                                ? n.setSelectionRange(t, t)
                                : n.createTextRange &&
                                  ((a = n.createTextRange()).collapse(!0),
                                  a.moveEnd("character", t),
                                  a.moveStart("character", t),
                                  a.select());
                        }
                    } catch (t) {}
                },
                events: function () {
                    e.on("keydown.mask", function () {
                        r = i.val();
                    })
                        .on("keyup.mask", i.behaviour)
                        .on("paste.mask drop.mask", function () {
                            setTimeout(function () {
                                e.keydown().keyup();
                            }, 100);
                        })
                        .on("change.mask", function () {
                            e.data("changed", !0);
                        })
                        .on("blur.mask", function () {
                            r === e.val() ||
                                e.data("changed") ||
                                e.trigger("change"),
                                e.data("changed", !1);
                        })
                        .on("focusout.mask", function () {
                            n.clearIfNotMatch && !o.test(i.val()) && i.val("");
                        });
                },
                getRegexMask: function () {
                    for (var t, e, n, r, o = [], i = 0; i < a.length; i++)
                        (t = s.translation[a[i]])
                            ? ((e = t.pattern
                                  .toString()
                                  .replace(/.{1}$|^.{1}/g, "")),
                              (n = t.optional),
                              (t = t.recursive)
                                  ? (o.push(a[i]),
                                    (r = { digit: a[i], pattern: e }))
                                  : o.push(n || t ? e + "?" : e))
                            : o.push(
                                  a[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                              );
                    return (
                        (o = o.join("")),
                        r &&
                            (o = o
                                .replace(
                                    new RegExp(
                                        "(" + r.digit + "(.*" + r.digit + ")?)"
                                    ),
                                    "($1)?"
                                )
                                .replace(new RegExp(r.digit, "g"), r.pattern)),
                        new RegExp(o)
                    );
                },
                destroyEvents: function () {
                    e.off(
                        "keydown keyup paste drop change blur focusout DOMNodeInserted "
                            .split(" ")
                            .join(".mask ")
                    ).removeData("changeCalled");
                },
                val: function (t) {
                    var a = e.is("input");
                    return 0 < arguments.length
                        ? a
                            ? e.val(t)
                            : e.text(t)
                        : a
                        ? e.val()
                        : e.text();
                },
                getMCharsBeforeCount: function (t, e) {
                    for (var n = 0, r = 0, o = a.length; r < o && r < t; r++)
                        s.translation[a.charAt(r)] ||
                            ((t = e ? t + 1 : t), n++);
                    return n;
                },
                caretPos: function (t, e, n, r) {
                    return s.translation[
                        a.charAt(Math.min(t - 1, a.length - 1))
                    ]
                        ? Math.min(t + n - e - r, n)
                        : i.caretPos(t + 1, e, n, r);
                },
                behaviour: function (e) {
                    var a = (e = e || window.event).keyCode || e.which;
                    if (-1 === t.inArray(a, s.byPassKeys)) {
                        var n = i.getCaret(),
                            r = i.val(),
                            o = r.length,
                            c = n < o,
                            l = i.getMasked(),
                            u = l.length,
                            h =
                                i.getMCharsBeforeCount(u - 1) -
                                i.getMCharsBeforeCount(o - 1);
                        return (
                            l !== r && i.val(l),
                            !c ||
                                (65 === a && e.ctrlKey) ||
                                (8 !== a &&
                                    46 !== a &&
                                    (n = i.caretPos(n, o, u, h)),
                                i.setCaret(n)),
                            i.callbacks(e)
                        );
                    }
                },
                getMasked: function (t) {
                    var e,
                        r,
                        o = [],
                        c = i.val(),
                        l = 0,
                        u = a.length,
                        h = 0,
                        f = c.length,
                        g = 1,
                        d = "push",
                        v = -1;
                    for (
                        n.reverse
                            ? ((d = "unshift"),
                              (g = -1),
                              (e = 0),
                              (l = u - 1),
                              (h = f - 1),
                              (r = function () {
                                  return -1 < l && -1 < h;
                              }))
                            : ((e = u - 1),
                              (r = function () {
                                  return l < u && h < f;
                              }));
                        r();

                    ) {
                        var m = a.charAt(l),
                            p = c.charAt(h),
                            k = s.translation[m];
                        k
                            ? (p.match(k.pattern)
                                  ? (o[d](p),
                                    k.recursive &&
                                        (-1 === v
                                            ? (v = l)
                                            : l === e && (l = v - g),
                                        e === v && (l -= g)),
                                    (l += g))
                                  : k.optional && ((l += g), (h -= g)),
                              (h += g))
                            : (t || o[d](m), p === m && (h += g), (l += g));
                    }
                    return (
                        (t = a.charAt(e)),
                        u !== f + 1 || s.translation[t] || o.push(t),
                        o.join("")
                    );
                },
                callbacks: function (t) {
                    var o = i.val(),
                        s = o !== r;
                    !0 === s &&
                        "function" == typeof n.onChange &&
                        n.onChange(o, t, e, n),
                        !0 === s &&
                            "function" == typeof n.onKeyPress &&
                            n.onKeyPress(o, t, e, n),
                        "function" == typeof n.onComplete &&
                            o.length === a.length &&
                            n.onComplete(o, t, e, n);
                },
            };
            (s.mask = a),
                (s.options = n),
                (s.remove = function () {
                    var t;
                    return (
                        i.destroyEvents(),
                        i.val(s.getCleanVal()).removeAttr("maxlength"),
                        (t = i.getCaret()),
                        i.setCaret(t - i.getMCharsBeforeCount(t)),
                        e
                    );
                }),
                (s.getCleanVal = function () {
                    return i.getMasked(!0);
                }),
                (s.init = (function () {
                    (n = n || {}),
                        (s.byPassKeys = [
                            9, 16, 17, 18, 36, 37, 38, 39, 40, 91,
                        ]),
                        (s.translation = {
                            0: { pattern: /\d/ },
                            9: { pattern: /\d/, optional: !0 },
                            "#": { pattern: /\d/, recursive: !0 },
                            A: { pattern: /[a-zA-Z0-9]/ },
                            S: { pattern: /[a-zA-Z]/ },
                        }),
                        (s.translation = t.extend(
                            {},
                            s.translation,
                            n.translation
                        )),
                        (s = t.extend(!0, {}, s, n)),
                        (o = i.getRegexMask()),
                        !1 !== n.maxlength && e.attr("maxlength", a.length),
                        n.placeholder && e.attr("placeholder", n.placeholder),
                        e.attr("autocomplete", "off"),
                        i.destroyEvents(),
                        i.events();
                    var r = i.getCaret();
                    i.val(i.getMasked()),
                        i.setCaret(r + i.getMCharsBeforeCount(r, !0));
                })());
        },
        a = {},
        n = function () {
            var e = t(this),
                a = {};
            e.attr("data-mask-reverse") && (a.reverse = !0),
                "false" === e.attr("data-mask-maxlength") && (a.maxlength = !1),
                e.attr("data-mask-clearifnotmatch") && (a.clearIfNotMatch = !0),
                e.mask(e.attr("data-mask"), a);
        };
    (t.fn.mask = function (n, r) {
        var o = this.selector,
            s = function () {
                var a = t(this).data("mask"),
                    o = JSON.stringify;
                if (
                    "object" != typeof a ||
                    o(a.options) !== o(r) ||
                    a.mask !== n
                )
                    return t(this).data("mask", new e(this, n, r));
            };
        this.each(s),
            o &&
                !a[o] &&
                ((a[o] = !0),
                setTimeout(function () {
                    t(document).on("DOMNodeInserted.mask", o, s);
                }, 500));
    }),
        (t.fn.unmask = function () {
            try {
                return this.each(function () {
                    t(this).data("mask").remove().removeData("mask");
                });
            } catch (t) {}
        }),
        (t.fn.cleanVal = function () {
            return this.data("mask").getCleanVal();
        }),
        t("*[data-mask]").each(n),
        t(document).on("DOMNodeInserted.mask", "*[data-mask]", n);
});

// 23100 - Enterprise
MktoForms2.loadForm(
    "//resources.trendmicro.com",
    "945-CXD-062",
    23100,
    function (form) {
        jQuery(function ($) {
            $("#Phone").mask("(99) 9 9999-9999");
        });

        var invalidDomains = [
            "@gmail.",
            "@yahoo.",
            "@hotmail.",
            "@live.",
            "@aol.",
            "@outlook.",
            "@bol.",
            "@ig.",
            "@icloud.",
            "@terra.",
            "@me.",
            "@uol.",
        ];

        MktoForms2.whenReady(function (form) {
            form.onValidate(function () {
                var vals = form.vals();
                var email = form.vals().Email;
                form.submitable(false);

                if (email) {
                    if (!isEmailGood(email)) {
                        var emailElem = form.getFormElem().find("#Email");
                        form.showErrorMessage(
                            "Digite um e-mail comercial.",
                            emailElem
                        );
                        form.submitable(false);
                    } else {
                        form.submitable(true);
                    }
                }
            });
        });

        function isEmailGood(email) {
            for (var i = 0; i < invalidDomains.length; i++) {
                var domain = invalidDomains[i];
                if (email.indexOf(domain) != -1) {
                    return false;
                }
            }
            return true;
        }
    }
);

// 23099 - MSP
MktoForms2.loadForm(
    "//resources.trendmicro.com",
    "945-CXD-062",
    23099,
    function (form) {
        jQuery(function ($) {
            $("#Phone").mask("(99) 9 9999-9999");
        });

        var invalidDomains = [
            "@gmail.",
            "@yahoo.",
            "@hotmail.",
            "@live.",
            "@aol.",
            "@outlook.",
            "@bol.",
            "@ig.",
            "@icloud.",
            "@terra.",
            "@me.",
            "@uol.",
        ];

        MktoForms2.whenReady(function (form) {
            form.onValidate(function () {
                var vals = form.vals();
                var email = form.vals().Email;
                form.submitable(false);

                if (email) {
                    if (!isEmailGood(email)) {
                        var emailElem = form.getFormElem().find("#Email");
                        form.showErrorMessage(
                            "Digite um e-mail comercial.",
                            emailElem
                        );
                        form.submitable(false);
                    } else {
                        form.submitable(true);
                    }
                }
            });
        });

        function isEmailGood(email) {
            for (var i = 0; i < invalidDomains.length; i++) {
                var domain = invalidDomains[i];
                if (email.indexOf(domain) != -1) {
                    return false;
                }
            }
            return true;
        }
    }
);

// 23098 - SMB
MktoForms2.loadForm(
    "//resources.trendmicro.com",
    "945-CXD-062",
    23098,
    function (form) {
        jQuery(function ($) {
            $("#Phone").mask("(99) 9 9999-9999");
        });

        var invalidDomains = [
            "@gmail.",
            "@yahoo.",
            "@hotmail.",
            "@live.",
            "@aol.",
            "@outlook.",
            "@bol.",
            "@ig.",
            "@icloud.",
            "@terra.",
            "@me.",
            "@uol.",
        ];

        MktoForms2.whenReady(function (form) {
            form.onValidate(function () {
                var vals = form.vals();
                var email = form.vals().Email;
                form.submitable(false);

                if (email) {
                    if (!isEmailGood(email)) {
                        var emailElem = form.getFormElem().find("#Email");
                        form.showErrorMessage(
                            "Digite um e-mail comercial.",
                            emailElem
                        );
                        form.submitable(false);
                    } else {
                        form.submitable(true);
                    }
                }
            });
        });

        function isEmailGood(email) {
            for (var i = 0; i < invalidDomains.length; i++) {
                var domain = invalidDomains[i];
                if (email.indexOf(domain) != -1) {
                    return false;
                }
            }
            return true;
        }
    }
);
