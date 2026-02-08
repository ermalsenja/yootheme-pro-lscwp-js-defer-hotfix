<?php
/**
 * Plugin Name: YOOtheme + LiteSpeed JS Deferred Hotfix
 * Plugin URI: https://github.com/ermalsenja/yootheme-pro-lscwp-js-defer-hotfix/
 * Description: Frontend-only compatibility hotfix for YOOtheme Pro 5.x when LiteSpeed Cache (LSCWP) "Load JS Deferred" is enabled. Replaces consent.js with a patched version and adds defer to theme.js to preserve UIkit ordering.
 * Version: 0.1.3
 * Author: Community Hotfix
 * License: GPL-3.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Notes:
 * - This plugin performs HTML output rewriting on the frontend (template_redirect + output buffering).
 * - It is intended as a temporary workaround until an upstream fix is available.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('template_redirect', function () {
    // Frontend only
    if (is_admin() || wp_doing_ajax() || wp_is_json_request()) {
        return;
    }

    // Build the URL to the patched JS shipped with this plugin
    $patched_url = plugins_url('assets/consent.patched.v5.0.12.js', __FILE__);
    $patched_src = parse_url($patched_url, PHP_URL_PATH) ?: $patched_url;
ob_start(function ($html) use ($patched_src) {
        // 1) Replace YOOtheme consent.js with patched file (ignore querystring)
        $html = preg_replace(
            '#/wp-content/themes/yootheme/assets/site/js/consent\.js(\?[^"\']*)?#i',
            $patched_src,
            $html
        );

        // 2) Defer theme.js to avoid "UIkit is not defined" when UIkit is deferred by LSCWP
        $html = preg_replace(
            '#<script\s+src="([^"]*/wp-content/themes/yootheme/assets/site/js/theme\.js[^"]*)"\s*></script>#i',
            '<script defer src="$1"></script>',
            $html
        );

        return $html;
    });
}, 0);

add_action('shutdown', function () {
    if (ob_get_level()) {
        @ob_end_flush();
    }
});