
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\common\Header.svelte generated by Svelte v3.42.1 */

    const file$b = "src\\common\\Header.svelte";

    function create_fragment$c(ctx) {
    	let header;
    	let div11;
    	let button;
    	let span0;
    	let t0;
    	let h1;
    	let a0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div10;
    	let div3;
    	let a1;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let t2;
    	let span1;
    	let t3;
    	let div2;
    	let div1;
    	let div0;
    	let t5;
    	let div9;
    	let a2;
    	let span2;
    	let t6;
    	let div6;
    	let div4;
    	let t8;
    	let div5;
    	let t10;
    	let div8;
    	let a3;
    	let t12;
    	let a4;
    	let t14;
    	let a5;
    	let t16;
    	let div7;
    	let t17;
    	let a6;
    	let t19;
    	let a7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div11 = element("div");
    			button = element("button");
    			span0 = element("span");
    			t0 = space();
    			h1 = element("h1");
    			a0 = element("a");
    			img = element("img");
    			t1 = space();
    			div10 = element("div");
    			div3 = element("div");
    			a1 = element("a");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t2 = space();
    			span1 = element("span");
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.\r\n              Accusamus ad amet consectetur exercitationem fugiat in ipsa ipsum,\r\n              natus odio quidem quod repudiandae sapiente. Amet debitis et magni\r\n              maxime necessitatibus ullam.";
    			t5 = space();
    			div9 = element("div");
    			a2 = element("a");
    			span2 = element("span");
    			t6 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Fernando Chagas";
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "Tax Accountant";
    			t10 = space();
    			div8 = element("div");
    			a3 = element("a");
    			a3.textContent = "Set status";
    			t12 = space();
    			a4 = element("a");
    			a4.textContent = "Profile & account";
    			t14 = space();
    			a5 = element("a");
    			a5.textContent = "Feedback";
    			t16 = space();
    			div7 = element("div");
    			t17 = space();
    			a6 = element("a");
    			a6.textContent = "Settings";
    			t19 = space();
    			a7 = element("a");
    			a7.textContent = "Logout";
    			attr_dev(span0, "class", "navbar-toggler-icon");
    			add_location(span0, file$b, 14, 6, 353);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbar-menu");
    			add_location(button, file$b, 8, 4, 210);
    			if (!src_url_equal(img.src, img_src_value = "./static/logo-white.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "110");
    			attr_dev(img, "height", "32");
    			attr_dev(img, "alt", "Tabler");
    			attr_dev(img, "class", "navbar-brand-image");
    			add_location(img, file$b, 20, 8, 538);
    			attr_dev(a0, "href", ".");
    			add_location(a0, file$b, 19, 6, 516);
    			attr_dev(h1, "class", "navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3");
    			add_location(h1, file$b, 16, 4, 410);
    			attr_dev(path0, "stroke", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$b, 51, 13, 1473);
    			attr_dev(path1, "d", "M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6");
    			add_location(path1, file$b, 51, 65, 1525);
    			attr_dev(path2, "d", "M9 17v1a3 3 0 0 0 6 0v-1");
    			add_location(path2, file$b, 53, 14, 1652);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "icon");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$b, 40, 10, 1135);
    			attr_dev(span1, "class", "badge bg-red");
    			add_location(span1, file$b, 55, 10, 1719);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "nav-link px-0");
    			attr_dev(a1, "data-bs-toggle", "dropdown");
    			attr_dev(a1, "tabindex", "-1");
    			attr_dev(a1, "aria-label", "Show notifications");
    			add_location(a1, file$b, 31, 8, 850);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$b, 59, 12, 1880);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file$b, 58, 10, 1848);
    			attr_dev(div2, "class", "dropdown-menu dropdown-menu-end dropdown-menu-card");
    			add_location(div2, file$b, 57, 8, 1772);
    			attr_dev(div3, "class", "nav-item dropdown d-none d-md-flex me-3");
    			add_location(div3, file$b, 30, 6, 787);
    			attr_dev(span2, "class", "avatar avatar-sm");
    			set_style(span2, "background-image", "url(./static/avatars/003f.jpg)");
    			add_location(span2, file$b, 75, 10, 2477);
    			add_location(div4, file$b, 80, 12, 2666);
    			attr_dev(div5, "class", "mt-1 small text-muted");
    			add_location(div5, file$b, 81, 12, 2706);
    			attr_dev(div6, "class", "d-none d-xl-block ps-2");
    			add_location(div6, file$b, 79, 10, 2616);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "nav-link d-flex lh-1 text-reset p-0");
    			attr_dev(a2, "data-bs-toggle", "dropdown");
    			attr_dev(a2, "aria-label", "Open user menu");
    			add_location(a2, file$b, 69, 8, 2301);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "dropdown-item");
    			add_location(a3, file$b, 85, 10, 2880);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "dropdown-item");
    			add_location(a4, file$b, 86, 10, 2940);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "dropdown-item");
    			add_location(a5, file$b, 87, 10, 3011);
    			attr_dev(div7, "class", "dropdown-divider");
    			add_location(div7, file$b, 88, 10, 3069);
    			attr_dev(a6, "href", "#");
    			attr_dev(a6, "class", "dropdown-item");
    			add_location(a6, file$b, 89, 10, 3113);
    			attr_dev(a7, "href", "#");
    			attr_dev(a7, "class", "dropdown-item");
    			add_location(a7, file$b, 90, 10, 3171);
    			attr_dev(div8, "class", "dropdown-menu dropdown-menu-end dropdown-menu-arrow");
    			add_location(div8, file$b, 84, 8, 2803);
    			attr_dev(div9, "class", "nav-item dropdown");
    			add_location(div9, file$b, 68, 6, 2260);
    			attr_dev(div10, "class", "navbar-nav flex-row order-md-last");
    			add_location(div10, file$b, 29, 4, 732);
    			attr_dev(div11, "class", "container-xl");
    			add_location(div11, file$b, 7, 2, 178);
    			attr_dev(header, "class", "navbar navbar-expand-md navbar-dark d-print-none");
    			add_location(header, file$b, 6, 0, 109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div11);
    			append_dev(div11, button);
    			append_dev(button, span0);
    			append_dev(div11, t0);
    			append_dev(div11, h1);
    			append_dev(h1, a0);
    			append_dev(a0, img);
    			append_dev(div11, t1);
    			append_dev(div11, div10);
    			append_dev(div10, div3);
    			append_dev(div3, a1);
    			append_dev(a1, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(a1, t2);
    			append_dev(a1, span1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div10, t5);
    			append_dev(div10, div9);
    			append_dev(div9, a2);
    			append_dev(a2, span2);
    			append_dev(a2, t6);
    			append_dev(a2, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, a3);
    			append_dev(div8, t12);
    			append_dev(div8, a4);
    			append_dev(div8, t14);
    			append_dev(div8, a5);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div8, t17);
    			append_dev(div8, a6);
    			append_dev(div8, t19);
    			append_dev(div8, a7);

    			if (!mounted) {
    				dispose = listen_dev(a1, "click", toggle, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toggle() {
    	window.document.body.classList.toggle("theme-dark");
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ toggle });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\common\Footer.svelte generated by Svelte v3.42.1 */

    const file$a = "src\\common\\Footer.svelte";

    function create_fragment$b(ctx) {
    	let footer;
    	let div3;
    	let div2;
    	let div0;
    	let ul0;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let svg;
    	let path0;
    	let path1;
    	let t6;
    	let t7;
    	let div1;
    	let ul1;
    	let li4;
    	let t8;
    	let a4;
    	let t10;
    	let t11;
    	let li5;
    	let a5;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Documentation";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "License";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Source code";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t6 = text("\r\n              Sponsor");
    			t7 = space();
    			div1 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			t8 = text("Copyright © 2021\r\n            ");
    			a4 = element("a");
    			a4.textContent = "Tabler";
    			t10 = text(". All rights reserved.");
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "v1.0.0-beta3";
    			attr_dev(a0, "href", "./docs/index.html");
    			attr_dev(a0, "class", "link-secondary");
    			add_location(a0, file$a, 6, 12, 308);
    			attr_dev(li0, "class", "list-inline-item");
    			add_location(li0, file$a, 5, 10, 265);
    			attr_dev(a1, "href", "./license.html");
    			attr_dev(a1, "class", "link-secondary");
    			add_location(a1, file$a, 9, 12, 448);
    			attr_dev(li1, "class", "list-inline-item");
    			add_location(li1, file$a, 8, 10, 405);
    			attr_dev(a2, "href", "https://github.com/tabler/tabler");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "link-secondary");
    			attr_dev(a2, "rel", "noopener");
    			add_location(a2, file$a, 12, 12, 579);
    			attr_dev(li2, "class", "list-inline-item");
    			add_location(li2, file$a, 11, 10, 536);
    			attr_dev(path0, "stroke", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$a, 38, 17, 1522);
    			attr_dev(path1, "d", "M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572");
    			add_location(path1, file$a, 38, 69, 1574);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "icon text-pink icon-filled icon-inline");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$a, 27, 14, 1106);
    			attr_dev(a3, "href", "https://github.com/sponsors/codecalm");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "class", "link-secondary");
    			attr_dev(a3, "rel", "noopener");
    			add_location(a3, file$a, 20, 12, 837);
    			attr_dev(li3, "class", "list-inline-item");
    			add_location(li3, file$a, 19, 10, 794);
    			attr_dev(ul0, "class", "list-inline list-inline-dots mb-0");
    			add_location(ul0, file$a, 4, 8, 207);
    			attr_dev(div0, "class", "col-lg-auto ms-lg-auto");
    			add_location(div0, file$a, 3, 6, 161);
    			attr_dev(a4, "href", ".");
    			attr_dev(a4, "class", "link-secondary");
    			add_location(a4, file$a, 51, 12, 2006);
    			attr_dev(li4, "class", "list-inline-item");
    			add_location(li4, file$a, 49, 10, 1933);
    			attr_dev(a5, "href", "./changelog.html");
    			attr_dev(a5, "class", "link-secondary");
    			attr_dev(a5, "rel", "noopener");
    			add_location(a5, file$a, 54, 12, 2145);
    			attr_dev(li5, "class", "list-inline-item");
    			add_location(li5, file$a, 53, 10, 2102);
    			attr_dev(ul1, "class", "list-inline list-inline-dots mb-0");
    			add_location(ul1, file$a, 48, 8, 1875);
    			attr_dev(div1, "class", "col-12 col-lg-auto mt-3 mt-lg-0");
    			add_location(div1, file$a, 47, 6, 1820);
    			attr_dev(div2, "class", "row text-center align-items-center flex-row-reverse");
    			add_location(div2, file$a, 2, 4, 88);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$a, 1, 2, 59);
    			attr_dev(footer, "class", "footer footer-transparent d-print-none");
    			add_location(footer, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(ul0, t1);
    			append_dev(ul0, li1);
    			append_dev(li1, a1);
    			append_dev(ul0, t3);
    			append_dev(ul0, li2);
    			append_dev(li2, a2);
    			append_dev(ul0, t5);
    			append_dev(ul0, li3);
    			append_dev(li3, a3);
    			append_dev(a3, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(a3, t6);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, ul1);
    			append_dev(ul1, li4);
    			append_dev(li4, t8);
    			append_dev(li4, a4);
    			append_dev(li4, t10);
    			append_dev(ul1, t11);
    			append_dev(ul1, li5);
    			append_dev(li5, a5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\common\Layout.svelte generated by Svelte v3.42.1 */
    const file$9 = "src\\common\\Layout.svelte";

    function create_fragment$a(ctx) {
    	let header;
    	let t0;
    	let div;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "container-xl");
    			add_location(div, file$9, 6, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Header, Footer });
    	return [$$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\common\Title.svelte generated by Svelte v3.42.1 */

    const file$8 = "src\\common\\Title.svelte";

    // (13:8) {#if pretitle}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*pretitle*/ ctx[1]);
    			attr_dev(div, "class", "page-pretitle");
    			add_location(div, file$8, 13, 10, 301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pretitle*/ 2) set_data_dev(t, /*pretitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(13:8) {#if pretitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let t0;
    	let h2;
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let a0;
    	let svg0;
    	let path0;
    	let line0;
    	let line1;
    	let t3;
    	let t4;
    	let a1;
    	let svg1;
    	let path1;
    	let line2;
    	let line3;
    	let if_block = /*pretitle*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			t3 = text("\r\n            Adicionar Livro");
    			t4 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			line2 = svg_element("line");
    			line3 = svg_element("line");
    			attr_dev(h2, "class", "page-title");
    			add_location(h2, file$8, 17, 8, 395);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$8, 11, 6, 248);
    			attr_dev(path0, "stroke", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$8, 39, 15, 1169);
    			attr_dev(line0, "x1", "12");
    			attr_dev(line0, "y1", "5");
    			attr_dev(line0, "x2", "12");
    			attr_dev(line0, "y2", "19");
    			add_location(line0, file$8, 39, 67, 1221);
    			attr_dev(line1, "x1", "5");
    			attr_dev(line1, "y1", "12");
    			attr_dev(line1, "x2", "19");
    			attr_dev(line1, "y2", "12");
    			add_location(line1, file$8, 44, 16, 1343);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			add_location(svg0, file$8, 28, 12, 809);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "btn btn-primary d-none d-sm-inline-block");
    			attr_dev(a0, "data-bs-toggle", "modal");
    			attr_dev(a0, "data-bs-target", "#BookForm-modal");
    			add_location(a0, file$8, 21, 10, 539);
    			attr_dev(path1, "stroke", "none");
    			attr_dev(path1, "d", "M0 0h24v24H0z");
    			attr_dev(path1, "fill", "none");
    			add_location(path1, file$8, 67, 15, 2130);
    			attr_dev(line2, "x1", "12");
    			attr_dev(line2, "y1", "5");
    			attr_dev(line2, "x2", "12");
    			attr_dev(line2, "y2", "19");
    			add_location(line2, file$8, 67, 67, 2182);
    			attr_dev(line3, "x1", "5");
    			attr_dev(line3, "y1", "12");
    			attr_dev(line3, "x2", "19");
    			attr_dev(line3, "y2", "12");
    			add_location(line3, file$8, 72, 16, 2304);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "icon");
    			attr_dev(svg1, "width", "24");
    			attr_dev(svg1, "height", "24");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			add_location(svg1, file$8, 56, 12, 1770);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "btn btn-primary d-sm-none btn-icon");
    			attr_dev(a1, "data-bs-toggle", "modal");
    			attr_dev(a1, "data-bs-target", "#BookForm-modal");
    			attr_dev(a1, "aria-label", "Adicionar Novo Livro");
    			add_location(a1, file$8, 48, 10, 1459);
    			attr_dev(div1, "class", "btn-list");
    			add_location(div1, file$8, 20, 8, 505);
    			attr_dev(div2, "class", "col-auto ms-auto d-print-none");
    			add_location(div2, file$8, 19, 6, 452);
    			attr_dev(div3, "class", "row align-items-center");
    			add_location(div3, file$8, 10, 4, 204);
    			attr_dev(div4, "class", "page-header d-print-none");
    			add_location(div4, file$8, 9, 2, 160);
    			attr_dev(div5, "class", "page-wrapper");
    			add_location(div5, file$8, 7, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h2);
    			append_dev(h2, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, line0);
    			append_dev(svg0, line1);
    			append_dev(a0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, path1);
    			append_dev(svg1, line2);
    			append_dev(svg1, line3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*pretitle*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div0, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	let { title } = $$props;
    	let { pretitle } = $$props;
    	const writable_props = ['title', 'pretitle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pretitle' in $$props) $$invalidate(1, pretitle = $$props.pretitle);
    	};

    	$$self.$capture_state = () => ({ title, pretitle });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('pretitle' in $$props) $$invalidate(1, pretitle = $$props.pretitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, pretitle];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { title: 0, pretitle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Title> was created without expected prop 'title'");
    		}

    		if (/*pretitle*/ ctx[1] === undefined && !('pretitle' in props)) {
    			console.warn("<Title> was created without expected prop 'pretitle'");
    		}
    	}

    	get title() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pretitle() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pretitle(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\common\Body.svelte generated by Svelte v3.42.1 */

    const file$7 = "src\\common\\Body.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "row row-deck row-cards");
    			add_location(div0, file$7, 1, 2, 27);
    			attr_dev(div1, "class", "page-body");
    			add_location(div1, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Body', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Body> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Body extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Body",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    // localStore.js

    // receives the key of the local storage and an initial value
    const localStore = (key, initial) => {
      // helper functions
      const toString = (value) => JSON.stringify(value, null, 2);
      const toObj = JSON.parse;

      // item not present in local storage
      if (localStorage.getItem(key) === null) {
        // initialize local storage with initial value
        localStorage.setItem(key, toString(initial));
      }

      // convert to object
      const saved = toObj(localStorage.getItem(key));

      // create the underlying writable store
      const { subscribe, set, update } = writable(saved);

      return {
        subscribe,
        set: (value) => {
          // save also to local storage as a string
          localStorage.setItem(key, toString(value));
          return set(value);
        },
        update,
      };
    };

    // localStore.js

    // Event store
    const eventStore = () => {
      // Generate random key
      function uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
          return (
            c ^
            (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16);
        });
      }

      // Events
      function newEvent() {
        return {
          id: "",
          name: "",
          target: "",
          object: {},
        };
      }

      function createEvent(name, target, object) {
        let event = newEvent();
        event.id = uuid();
        event.name = name;
        event.target = target;
        event.object = object;
        return event;
      }

      // writable store
      const { subscribe, set } = writable({});

      return {
        dispatch: (component, action, object = null) => {
          let event = createEvent(action, component, object);
          console.log(event);
          return set(event);
        },
        listener: (component, actions) => {
          let fn = (event) => {
            if (event.target == component) {
              // Call action
              actions[event.name](event);
            }
          };

          subscribe(fn);
        },
      };
    };

    const books = localStore("books", []);
    const event = eventStore();

    /* src\common\Alert.svelte generated by Svelte v3.42.1 */
    const file$6 = "src\\common\\Alert.svelte";

    // (36:0) {#if show}
    function create_if_block$3(ctx) {
    	let br;
    	let t0;
    	let div;
    	let t1;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			div = element("div");
    			t1 = text(/*message*/ ctx[1]);
    			add_location(br, file$6, 36, 2, 633);
    			attr_dev(div, "class", div_class_value = "alert alert-title " + /*css*/ ctx[2]);
    			attr_dev(div, "role", "alert");
    			add_location(div, file$6, 37, 2, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 2) set_data_dev(t1, /*message*/ ctx[1]);

    			if (dirty & /*css*/ 4 && div_class_value !== (div_class_value = "alert alert-title " + /*css*/ ctx[2])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(36:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*show*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, []);
    	let show = false;
    	let message;
    	let css;

    	// Actions
    	const actions = {
    		showError: e => {
    			$$invalidate(0, show = true);
    			$$invalidate(1, message = e.object);
    			$$invalidate(2, css = "alert-danger");
    		},
    		showSuccess: e => {
    			$$invalidate(0, show = true);
    			$$invalidate(1, message = e.object);
    			$$invalidate(2, css = "alert-success");
    		},
    		hidden: e => {
    			$$invalidate(0, show = false);
    		}
    	};

    	event.listener("Alert", actions);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alert> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ event, show, message, css, actions });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('css' in $$props) $$invalidate(2, css = $$props.css);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, message, css];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Collection.svelte generated by Svelte v3.42.1 */

    function create_fragment$6(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function generateId(array) {
    	return array.length ? Math.max(...array.map(t => t.id)) + 1 : 1;
    }

    function create(object, list) {
    	object.id = generateId(list);
    	list = [...list, object];
    	return list;
    }

    function update(object, list) {
    	const i = list.findIndex(t => t.id === object.id);
    	list[i] = { ...list[i], ...object };
    	return { key: i, value: list[i] };
    }

    function remove(object, list) {
    	list = list.filter(t => t.id !== object.id);
    	return list;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(0, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Collection', slots, []);

    	const actions = {
    		// Book
    		createBook: event => {
    			set_store_value(books, $books = create(event.object, $books), $books);
    		},
    		updateBook: event => {
    			const { key, value } = update(event.object, $books);
    			set_store_value(books, $books[key] = value, $books);
    		},
    		deleteBook: event => {
    			set_store_value(books, $books = remove(event.object, $books), $books);
    		}
    	};

    	event.listener("Collection", actions);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Collection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		event,
    		books,
    		generateId,
    		create,
    		update,
    		remove,
    		actions,
    		$books
    	});

    	return [];
    }

    class Collection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collection",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const module = () => {
      // Form field errors
      function showFieldError(input, message) {
        function addInvalidField(input) {
          input.classList.add("is-invalid");
        }

        function removeInvalidField(div, input) {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
            input.classList.remove("is-invalid");
          }
        }

        function addInvalidFeedback(div, input) {
          div.classList.add("invalid-feedback");
          showErrorMessage(div, input);
        }

        function showErrorMessage(div, input) {
          div.appendChild(document.createTextNode(message));
          input.parentNode.insertBefore(div, input.nextSibling);
        }

        addInvalidField(input);

        if (!input.nextSibling) {
          let div = document.createElement("div");
          addInvalidFeedback(div, input);
          input.addEventListener("keypress", () => {
            removeInvalidField(div, input);
          });
          input.addEventListener("change", () => {
            removeInvalidField(div, input);
          });
        }
      }

      function hiddenFieldError(input) {
        input.classList.remove("is-invalid");
      }

      // Validate all inputs
      function validateRequiredInputs(inputs) {
        let validate = false;
        let invalids = 0;

        for (let i = 0; i < inputs.length; i++) {
          let input = inputs[i];
          let label = input.previousElementSibling;
          let required = label.className;

          required = required.includes("required");

          if (required && input.value === "") {
            invalids++;
            showFieldError(
              input,
              "Por favor, informe o(a) " + label.innerHTML.toLowerCase()
            );
          } else {
            hiddenFieldError(input);
          }
        }

        invalids ? (validate = false) : (validate = true);

        return validate;
      }

      return {
        focusFirstElement: (formId) => {
          var elements = document.getElementById(formId).elements;

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (element.tagName == "INPUT") {
              element.focus();
              break;
            }
          }

          window.scrollTo(0, 0);
        },
        cleanErrors: (formId) => {
          var elements = document.getElementById(formId).elements;

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            hiddenFieldError(element);
          }
        },
        validate: (formId) => {
          var form = document.getElementById(formId);
          const inputs = form.getElementsByTagName("input");

          let validate = validateRequiredInputs(inputs);

          return validate;
        },
      };
    };

    const form = module();

    /* src\common\Form.svelte generated by Svelte v3.42.1 */
    const file$5 = "src\\common\\Form.svelte";

    // (51:4) {:else}
    function create_else_block$1(ctx) {
    	let input0;
    	let t;
    	let input1;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "type", "submit");
    			attr_dev(input0, "class", "btn btn-primary ms-auto");
    			input0.value = "Incluir";
    			add_location(input0, file$5, 51, 6, 1470);
    			attr_dev(input1, "type", "hidden");
    			attr_dev(input1, "name", "action");
    			input1.value = "createData";
    			add_location(input1, file$5, 52, 6, 1549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(51:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if action == "updateData"}
    function create_if_block$2(ctx) {
    	let input0;
    	let t;
    	let input1;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "type", "submit");
    			attr_dev(input0, "class", "btn btn-primary ms-auto");
    			input0.value = "Alterar";
    			add_location(input0, file$5, 48, 6, 1314);
    			attr_dev(input1, "type", "hidden");
    			attr_dev(input1, "name", "action");
    			input1.value = "updateData";
    			add_location(input1, file$5, 49, 6, 1393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(48:4) {#if action == \\\"updateData\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let form;
    	let t0;
    	let div;
    	let a;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	function select_block_type(ctx, dirty) {
    		if (/*action*/ ctx[1] == "updateData") return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div = element("div");
    			a = element("a");
    			a.textContent = "Cancel";
    			t2 = space();
    			if_block.c();
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "btn btn-link link-secondary");
    			attr_dev(a, "data-bs-dismiss", "modal");
    			add_location(a, file$5, 44, 4, 1176);
    			attr_dev(div, "class", "modal-footer");
    			add_location(div, file$5, 43, 2, 1144);
    			attr_dev(form, "id", /*id*/ ctx[0]);
    			attr_dev(form, "method", "post");
    			add_location(form, file$5, 41, 0, 1082);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			append_dev(form, t0);
    			append_dev(form, div);
    			append_dev(div, a);
    			append_dev(div, t2);
    			if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*onSubmit*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(form, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, ['default']);
    	let { id } = $$props;
    	let action = "createData";

    	// Local Actions
    	function onSubmit(e) {
    		if (form.validate(id)) {
    			actions[action]();
    			form.focusFirstElement(id);
    		}

    		e.preventDefault();
    	}

    	// Global Actions
    	const actions = {
    		fillForm: e => {
    			event.dispatch(id, "fillForm", e.object);
    			form.cleanErrors(id);
    			$$invalidate(1, action = "updateData");
    		},
    		createData: () => {
    			event.dispatch(id, "createData");
    		},
    		updateData: () => {
    			event.dispatch(id, "updateData");
    			$$invalidate(1, action = "createData");
    		}
    	};

    	event.listener(id + "/Form", actions);

    	onMount(() => {
    		var modalEl = document.getElementById(id + "-modal");

    		// Close Modal
    		modalEl.addEventListener("hidden.bs.modal", function (e) {
    			form.cleanErrors(id);
    			event.dispatch(id, "newData");
    		});

    		form.focusFirstElement(id);
    	});

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		formJS: form,
    		event,
    		id,
    		action,
    		onSubmit,
    		actions
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('action' in $$props) $$invalidate(1, action = $$props.action);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, action, onSubmit, $$scope, slots];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Form> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\common\Modal.svelte generated by Svelte v3.42.1 */

    const file$4 = "src\\common\\Modal.svelte";

    function create_fragment$4(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let h5;
    	let t0;
    	let t1;
    	let button;
    	let t2;
    	let div3_id_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			button = element("button");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$4, 15, 8, 340);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn-close");
    			attr_dev(button, "data-bs-dismiss", "modal");
    			attr_dev(button, "aria-label", "Close");
    			add_location(button, file$4, 18, 8, 408);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$4, 14, 6, 304);
    			attr_dev(div1, "class", "modal-content");
    			add_location(div1, file$4, 13, 4, 269);
    			attr_dev(div2, "class", "modal-dialog modal-lg modal-dialog-centered");
    			attr_dev(div2, "role", "document");
    			add_location(div2, file$4, 12, 2, 190);
    			attr_dev(div3, "class", "modal modal-blur fade");
    			attr_dev(div3, "id", div3_id_value = "" + (/*id*/ ctx[0] + "-modal"));
    			attr_dev(div3, "tabindex", "-1");
    			set_style(div3, "display", "none");
    			attr_dev(div3, "aria-hidden", "true");
    			add_location(div3, file$4, 5, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(h5, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 1 && div3_id_value !== (div3_id_value = "" + (/*id*/ ctx[0] + "-modal"))) {
    				attr_dev(div3, "id", div3_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { id } = $$props;
    	let { title } = $$props;
    	const writable_props = ['id', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id, title });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, title, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Modal> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Modal> was created without expected prop 'title'");
    		}
    	}

    	get id() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\book\BookModal.svelte generated by Svelte v3.42.1 */
    const file$3 = "src\\book\\BookModal.svelte";

    // (44:2) <Form {id}>
    function create_default_slot_1$1(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let t1;
    	let input0;
    	let t2;
    	let div3;
    	let div2;
    	let t4;
    	let input1;
    	let t5;
    	let div5;
    	let div4;
    	let t7;
    	let input2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Título";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "Preço";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div4.textContent = "Descrição";
    			t7 = space();
    			input2 = element("input");
    			attr_dev(div0, "class", "form-label required");
    			add_location(div0, file$3, 46, 8, 1041);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			add_location(input0, file$3, 47, 8, 1096);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$3, 45, 6, 1013);
    			attr_dev(div2, "class", "form-label required");
    			add_location(div2, file$3, 50, 8, 1212);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "form-control");
    			add_location(input1, file$3, 51, 8, 1266);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$3, 49, 6, 1184);
    			attr_dev(div4, "class", "form-label required");
    			add_location(div4, file$3, 54, 8, 1384);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control");
    			add_location(input2, file$3, 55, 8, 1442);
    			attr_dev(div5, "class", "mb-3");
    			add_location(div5, file$3, 53, 6, 1356);
    			attr_dev(div6, "class", "modal-body");
    			add_location(div6, file$3, 44, 4, 981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*data*/ ctx[2].title);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t4);
    			append_dev(div3, input1);
    			set_input_value(input1, /*data*/ ctx[2].price);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t7);
    			append_dev(div5, input2);
    			set_input_value(input2, /*data*/ ctx[2].description);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 4 && input0.value !== /*data*/ ctx[2].title) {
    				set_input_value(input0, /*data*/ ctx[2].title);
    			}

    			if (dirty & /*data*/ 4 && to_number(input1.value) !== /*data*/ ctx[2].price) {
    				set_input_value(input1, /*data*/ ctx[2].price);
    			}

    			if (dirty & /*data*/ 4 && input2.value !== /*data*/ ctx[2].description) {
    				set_input_value(input2, /*data*/ ctx[2].description);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(44:2) <Form {id}>",
    		ctx
    	});

    	return block;
    }

    // (43:0) <Modal {id} {title}>
    function create_default_slot$1(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				id: /*id*/ ctx[0],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*id*/ 1) form_changes.id = /*id*/ ctx[0];

    			if (dirty & /*$$scope, data*/ 132) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(43:0) <Modal {id} {title}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				id: /*id*/ ctx[0],
    				title: /*title*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*id*/ 1) modal_changes.id = /*id*/ ctx[0];
    			if (dirty & /*title*/ 2) modal_changes.title = /*title*/ ctx[1];

    			if (dirty & /*$$scope, id, data*/ 133) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function newData() {
    	return { title: "", price: "", description: "" };
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BookModal', slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let data = newData();

    	// Global Actions
    	const actions = {
    		fillForm: e => {
    			$$invalidate(2, data = e.object);
    		},
    		newData: () => {
    			$$invalidate(2, data = newData());
    		},
    		createData: () => {
    			event.dispatch("Collection", "createBook", data);
    			event.dispatch("Alert", "showSuccess", "Livro cadastrado com sucesso.");
    			$$invalidate(2, data = newData());
    		},
    		updateData: () => {
    			event.dispatch("Collection", "updateBook", data);
    			event.dispatch("Alert", "showSuccess", "Livro alterado com sucesso.");
    			$$invalidate(2, data = newData());
    		}
    	};

    	event.listener(id, actions);
    	const writable_props = ['id', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BookModal> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		data.title = this.value;
    		$$invalidate(2, data);
    	}

    	function input1_input_handler() {
    		data.price = to_number(this.value);
    		$$invalidate(2, data);
    	}

    	function input2_input_handler() {
    		data.description = this.value;
    		$$invalidate(2, data);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		Form,
    		Modal,
    		event,
    		id,
    		title,
    		data,
    		newData,
    		actions
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		title,
    		data,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class BookModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BookModal",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<BookModal> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<BookModal> was created without expected prop 'title'");
    		}
    	}

    	get id() {
    		throw new Error("<BookModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<BookModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<BookModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<BookModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\book\BookTable.svelte generated by Svelte v3.42.1 */
    const file$2 = "src\\book\\BookTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (63:6) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*$books*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*onDelete, $books, onEdit*/ 7) {
    				each_value = /*$books*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(63:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:6) {#if $books.length === 0}
    function create_if_block$1(ctx) {
    	let tr;
    	let td;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			td.textContent = "Nenhum livro adicionado.";
    			attr_dev(td, "colspan", "4");
    			attr_dev(td, "class", "text-center");
    			add_location(td, file$2, 60, 10, 1480);
    			add_location(tr, file$2, 59, 8, 1464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(59:6) {#if $books.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (64:8) {#each $books as book}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*book*/ ctx[5].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*book*/ ctx[5].price + "";
    	let t2;
    	let t3;
    	let td2;
    	let a0;
    	let t4_value = /*book*/ ctx[5].description + "";
    	let t4;
    	let t5;
    	let td3;
    	let div;
    	let a1;
    	let t7;
    	let a2;
    	let t9;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*book*/ ctx[5]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*book*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a0 = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			div = element("div");
    			a1 = element("a");
    			a1.textContent = "Alterar";
    			t7 = space();
    			a2 = element("a");
    			a2.textContent = "Excluir";
    			t9 = space();
    			add_location(td0, file$2, 65, 12, 1637);
    			attr_dev(td1, "class", "text-muted");
    			add_location(td1, file$2, 66, 12, 1672);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "text-reset");
    			add_location(a0, file$2, 68, 15, 1765);
    			attr_dev(td2, "class", "text-muted");
    			add_location(td2, file$2, 67, 12, 1726);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "btn btn-info");
    			add_location(a1, file$2, 72, 16, 1923);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "btn btn-danger");
    			add_location(a2, file$2, 75, 16, 2053);
    			attr_dev(div, "class", "btn-list flex-nowrap");
    			add_location(div, file$2, 71, 14, 1871);
    			add_location(td3, file$2, 70, 12, 1851);
    			add_location(tr, file$2, 64, 10, 1619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a0);
    			append_dev(a0, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, div);
    			append_dev(div, a1);
    			append_dev(div, t7);
    			append_dev(div, a2);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", click_handler, false, false, false),
    					listen_dev(a2, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$books*/ 1 && t0_value !== (t0_value = /*book*/ ctx[5].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$books*/ 1 && t2_value !== (t2_value = /*book*/ ctx[5].price + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$books*/ 1 && t4_value !== (t4_value = /*book*/ ctx[5].description + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:8) {#each $books as book}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let bookmodal;
    	let t0;
    	let div5;
    	let div4;
    	let div1;
    	let t1;
    	let div0;
    	let input0;
    	let t2;
    	let t3;
    	let div3;
    	let t4;
    	let div2;
    	let input1;
    	let t5;
    	let div6;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t12;
    	let tbody;
    	let current;

    	bookmodal = new BookModal({
    			props: { id: "BookForm", title: "Novo Livro" },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*$books*/ ctx[0].length === 0) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			create_component(bookmodal.$$.fragment);
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			t1 = text("Show\r\n      ");
    			div0 = element("div");
    			input0 = element("input");
    			t2 = text("\r\n      entries");
    			t3 = space();
    			div3 = element("div");
    			t4 = text("Search:\r\n      ");
    			div2 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div6 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Título";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "Preço";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "Descrição";
    			t11 = space();
    			th3 = element("th");
    			t12 = space();
    			tbody = element("tbody");
    			if_block.c();
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-control-sm");
    			input0.value = "8";
    			attr_dev(input0, "size", "3");
    			attr_dev(input0, "aria-label", "Invoices count");
    			add_location(input0, file$2, 25, 8, 648);
    			attr_dev(div0, "class", "mx-2 d-inline-block");
    			add_location(div0, file$2, 24, 6, 605);
    			attr_dev(div1, "class", "text-muted");
    			add_location(div1, file$2, 22, 4, 561);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control form-control-sm");
    			attr_dev(input1, "aria-label", "Search invoice");
    			add_location(input1, file$2, 38, 8, 962);
    			attr_dev(div2, "class", "ms-2 d-inline-block");
    			add_location(div2, file$2, 37, 6, 919);
    			attr_dev(div3, "class", "ms-auto text-muted");
    			add_location(div3, file$2, 35, 4, 864);
    			attr_dev(div4, "class", "d-flex");
    			add_location(div4, file$2, 21, 2, 535);
    			attr_dev(div5, "class", "card-body border-bottom py-3");
    			add_location(div5, file$2, 20, 0, 489);
    			add_location(th0, file$2, 51, 8, 1273);
    			add_location(th1, file$2, 52, 8, 1298);
    			attr_dev(th2, "class", "w-30");
    			add_location(th2, file$2, 53, 8, 1322);
    			attr_dev(th3, "class", "w-1");
    			add_location(th3, file$2, 54, 8, 1363);
    			add_location(tr, file$2, 50, 6, 1259);
    			add_location(thead, file$2, 49, 4, 1244);
    			add_location(tbody, file$2, 57, 4, 1414);
    			attr_dev(table, "class", "table card-table table-vcenter text-nowrap datatable");
    			add_location(table, file$2, 48, 2, 1170);
    			attr_dev(div6, "class", "table-responsive");
    			add_location(div6, file$2, 47, 0, 1136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(bookmodal, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(div1, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t7);
    			append_dev(tr, th1);
    			append_dev(tr, t9);
    			append_dev(tr, th2);
    			append_dev(tr, t11);
    			append_dev(tr, th3);
    			append_dev(table, t12);
    			append_dev(table, tbody);
    			if_block.m(tbody, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bookmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bookmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bookmodal, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div6);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(0, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BookTable', slots, []);

    	function onEdit(book) {
    		event.dispatch("Alert", "hidden");
    		event.dispatch("BookForm/Form", "fillForm", book);
    	}

    	function onDelete(book) {
    		event.dispatch("Alert", "hidden");
    		event.dispatch("Collection", "deleteBook", book);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BookTable> was created with unknown prop '${key}'`);
    	});

    	const click_handler = book => onEdit(book);
    	const click_handler_1 = book => onDelete(book);

    	$$self.$capture_state = () => ({
    		books,
    		event,
    		BookModal,
    		onEdit,
    		onDelete,
    		$books
    	});

    	return [$books, onEdit, onDelete, click_handler, click_handler_1];
    }

    class BookTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BookTable",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\common\Card.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\common\\Card.svelte";

    // (6:2) {#if title}
    function create_if_block(ctx) {
    	let div;
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h3, "class", "card-title");
    			add_location(h3, file$1, 7, 6, 121);
    			attr_dev(div, "class", "card-header");
    			add_location(div, file$1, 6, 4, 88);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(6:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card");
    			add_location(div, file$1, 4, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { title = "" } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */
    const file = "src\\App.svelte";

    // (21:6) <Card title="Lista de Livros">
    function create_default_slot_2(ctx) {
    	let booktable;
    	let current;
    	booktable = new BookTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(booktable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(booktable, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(booktable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(booktable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(booktable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(21:6) <Card title=\\\"Lista de Livros\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:2) <Body>
    function create_default_slot_1(ctx) {
    	let div;
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: "Lista de Livros",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			attr_dev(div, "class", "col-md-12");
    			add_location(div, file, 19, 4, 491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(19:2) <Body>",
    		ctx
    	});

    	return block;
    }

    // (14:0) <Layout>
    function create_default_slot(ctx) {
    	let div;
    	let alert;
    	let t0;
    	let title;
    	let t1;
    	let body;
    	let current;
    	alert = new Alert({ $$inline: true });

    	title = new Title({
    			props: { title: "Livros" },
    			$$inline: true
    		});

    	body = new Body({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			create_component(title.$$.fragment);
    			t1 = space();
    			create_component(body.$$.fragment);
    			add_location(div, file, 14, 2, 417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(alert, div, null);
    			insert_dev(target, t0, anchor);
    			mount_component(title, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(body, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const body_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				body_changes.$$scope = { dirty, ctx };
    			}

    			body.$set(body_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			transition_in(body.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(title.$$.fragment, local);
    			transition_out(body.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(alert);
    			if (detaching) detach_dev(t0);
    			destroy_component(title, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(body, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(14:0) <Layout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let collection;
    	let t;
    	let layout;
    	let current;
    	collection = new Collection({ $$inline: true });

    	layout = new Layout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(collection.$$.fragment);
    			t = space();
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(collection, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layout_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collection.$$.fragment, local);
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collection.$$.fragment, local);
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collection, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Layout,
    		Title,
    		Body,
    		Alert,
    		Collection,
    		BookTable,
    		Card
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: "world",
      },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
