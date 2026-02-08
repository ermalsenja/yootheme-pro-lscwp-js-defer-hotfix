/*!
 * consent.patched.v5.0.12.js
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Derived from YOOtheme Pro consent.js (v5.0.12) and modified to improve compatibility
 * when JavaScript execution order changes (e.g., LiteSpeed Cache "Load JS Deferred").
 *
 * Changes include:
 * - Delay initialization until window.yootheme / yootheme.consent is available (race-condition guard)
 * - Safer click handling for consent buttons (closest('[data-consent-button]'))
 * - Null guard when reading anchor hash (closest('a'))
 *
 * (c) 2026 Community Hotfix. Provided WITHOUT ANY WARRANTY.
 */
/*! YOOtheme Pro v5.0.12 | https://yootheme.com */

const T = "optin",
    b = "optout",
    p = "allow",
    C = "deny",
    N = "yootheme:consent",
    x = "yootheme_consent",
    X = 30,
    y = "data-category";

function I(t, e) {
    var n;
    (e.debug || e.state.invalidConsent) && (e.element = (n = document.querySelector(t)) == null ? void 0 : n.content.firstElementChild.cloneNode(!0), document.body[e.banner_layout === "section-top" ? "prepend" : "append"](e.element)), document.addEventListener("click", i => {
        const r = i.target.closest("[data-consent-button]");
        if (!r) return;
        let l = r.dataset.consentButton;
        ["accept", "reject"].includes(l) && (e.setConsent(e.getCategories().reduce((g, h) => ({
            [h]: l === "accept" ? p : C,
            ...g
        }), {})), e.loadScriptTags(), e.saveState())
    })
}

function $(t) {
    const e = window.document.cookie.split(";");
    t = `${t}=`;
    for (let n of e)
        if (n = n.trim(), n.startsWith(t)) return n.substring(t.length);
    return ""
}

function j(t, e, n = 30) {
    const i = new Date,
        l = window.location.protocol === "https:" ? ";secure" : "";
    i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3), document.cookie = `${t}=${e}${l};expires=${i.toGMTString()};path=/`
}
async function A(t) {
    for (const e of t) {
        const n = document.createRange().createContextualFragment(e.outerHTML).firstElementChild;
        n.removeAttribute("type"), n.removeAttribute(y);
        for (const i of ["src", "type"]) e.dataset[i] && (n[i] = e.dataset[i], delete n.dataset[i]);
        await P(n, () => e.replaceWith(n))
    }
}
async function P(t, e) {
    const n = t.src && (!t.type || L(t.type));
    e(t), n && await new Promise(i => {
        t.onload = i(!0), t.onerror = i(!1)
    })
}

function L(t) {
    return ["text/javascript", "module"].includes(t)
}

function R(t) {
    const e = {
        type: T,
        event_prefix: N,
        cookie_prefix: x,
        cookie_expiration: 30,
        state: {},
        cookie: {},
        element: null,
        revision: null,
        categories: {},
        on: q,
        emit: W,
        extend: D,
        loadState: i,
        saveState: l,
        hasConsent: g,
        setConsent: h,
        changeConsent: u,
        getCategories: n,
        loadScriptTags: a
    };

    function n() {
        const o = [];
        for (const [s, c] of Object.entries(this.categories)) {
            o.push(s);
            for (const r of c) o.push(r ? `${s}.${r}` : s)
        }
        return o
    }

    function i() {
        var v;
        const {
            revision: o,
            categories: s,
            consentId: c,
            consentTimestamp: r,
            lastConsentTimestamp: f
        } = this.cookie = (v = S($(this.cookie_prefix))) != null ? v : {}, d = c && typeof c == "string", _ = this.revision === null || this.revision === o;
        return this.state = E({
            revision: o,
            categories: s,
            consentId: c,
            consentTimestamp: r,
            lastConsentTimestamp: f,
            invalidConsent: !d || !_ || !s || !r || !f
        }), this.state.invalidConsent && (this.state.categories = {}), this
    }

    function l() {
        var d;
        const {
            consentId: o,
            categories: s,
            consentTimestamp: c,
            invalidConsent: r
        } = this.state;
        if (!r && B(s, (d = this.cookie.categories) != null ? d : {})) return;
        const f = new Date().toISOString();
        this.cookie = {
            revision: this.revision,
            categories: s,
            consentId: o != null ? o : F(),
            consentTimestamp: c != null ? c : f,
            lastConsentTimestamp: f
        }, this.state = E({
            ...this.cookie,
            invalidConsent: !1
        }), j(this.cookie_prefix, k(this.cookie))
    }

    function g(o) {
        if (!this.type) return !0;
        const s = this.state.categories[o];
        return this.type === b && !s ? !0 : s === p
    }

    function h(o, s) {
        const c = [];
        typeof o == "string" ? r.call(this, o, s) : typeof o == "object" && Object.entries(o).forEach(f => r.call(this, ...f)), c.length > 0 && this.changeConsent(c);

        function r(f, d) {
            d !== p && d !== C || (this.state.categories[f] !== d && c.push(f), this.state.categories[f] = d)
        }
    }

    function u(o) {
        const s = {},
            c = {};
        for (const r of this.getCategories()) s[r] = this.hasConsent(r);
        for (const r of o) c[r] = this.hasConsent(r);
        this.emit("change", {
            allConsents: s,
            changedConsents: c,
            ...this
        })
    }
    async function a() {
        const o = [];
        for (const s of document.querySelectorAll(`script[${y}]`)) s.getAttribute(y).split(/\s+/).some(f => this.hasConsent(f)) && o.push(s);
        await A(o)
    }
    return e.extend(t).loadState()
}

function q(t, e) {
    document.addEventListener(`${this.event_prefix}.${t}`, n => e(n.detail, n))
}

function W(t, e, n) {
    document.dispatchEvent(new CustomEvent(`${this.event_prefix}.${t}`, {
        detail: e,
        ...n
    }))
}

function D(...t) {
    return Object.assign(this, ...t)
}

function B(t, e) {
    return Object.keys(t).length === Object.keys(e).length && Object.entries(t).every(([n, i]) => e[n] === i)
}

function E(t) {
    return S(k(t))
}

function S(t) {
    try {
        return JSON.parse(t)
    } catch {}
}

function k(t) {
    return JSON.stringify(t)
}

function F() {
    return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, t => (t ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> t / 4).toString(16))
}

function J(t, e) {
    document.addEventListener("click", h => {
        const u = h.target.closest("a,button");
        if (!u) return;
        u.hash !== t && u.dataset.consentButton !== "settings" || (h.preventDefault(), i(), g(), requestAnimationFrame(() => n.dispatchEvent(new CustomEvent("toggle"))))
    });
    let n;

    function i() {
        var h;
        n || (n = document.body.appendChild((h = document.querySelector(t)) == null ? void 0 : h.content.firstElementChild.cloneNode(!0)), n.addEventListener("change", u => {
            var f;
            const {
                form: a
            } = u.target;
            if (!a) return;
            const {
                name: o,
                checked: s
            } = u.target, c = e.getCategories();
            if (!c.includes(o)) return;
            const [r] = o.split(".", 1);
            if (o === r)
                for (const d of c) d.startsWith(`${r}.`) && a[d] && (a[d].checked = s);
            else a[r] && ((f = a[r]).checked || (f.checked = Array.from(a.elements).some(d => d.name.startsWith(`${r}.`) && d.checked)))
        }), n.addEventListener("submit", u => {
            const a = u.target;
            a && (u.preventDefault(), e.setConsent(e.getCategories().reduce((o, s) => {
                var c;
                return {
                    [s]: (c = a[s]) != null && c.checked ? p : C,
                    ...o
                }
            }, {})), l())
        }), n.addEventListener("click", u => {
            const r = u.target.closest("[data-consent-button]");
            let a = r && r.dataset.consentButton;
            ["accept", "reject"].includes(a) && (e.setConsent(e.getCategories().reduce((o, s) => ({
                [s]: a === "accept" ? p : C,
                ...o
            }), {})), l())
        }))
    }

    function l() {
        e.loadScriptTags(), e.saveState(), e.element && (e.element.hidden = !0)
    }

    function g() {
        var h, u;
        for (const a of (u = (h = n.querySelector("form")) == null ? void 0 : h.elements) != null ? u : []) e.getCategories().includes(a.name) && (a.checked = e.hasConsent(a.name))
    }
}

function M(t, e) {
    var n;
    window.wp_consent_type = e.type;
    for (const [i, l] of Object.entries(e.categories))
        for (const g of l)(n = t.services) == null || n.push({
            name: g,
            category: i
        });
    e.on("change", ({
        changedConsents: i
    }) => {
        var l, g;
        for (const [h, u] of Object.entries(i)) {
            const [a, o] = h.split(".");
            o ? (l = window.wp_set_service_consent) == null || l.call(window, o, u) : (g = window.wp_set_consent) == null || g.call(window, a, u ? "allow" : "deny")
        }
    })
}(function initConsent(r = 0) {
    const {
        consent_api: w,
        yootheme: O
    } = window;
    if (!O || !O.consent) {
        if (r < 200) return setTimeout(() => initConsent(r + 1), 25);
        return
    }
    const s = O.consent,
        m = O.consent = R(s);
    w && M(w, m), m.on("init", t => {
        I("#consent-banner", t), J("#consent-settings", t), t.loadScriptTags()
    }), m.type && m.emit("init", m)
})();