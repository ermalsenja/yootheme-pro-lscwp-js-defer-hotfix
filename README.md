# YOOtheme + LiteSpeed JS Deferred Hotfix (Unofficial)

This plugin applies a frontend-only hotfix for YOOtheme Pro 5.x when **LiteSpeed Cache (LSCWP) → Load JS Deferred** is enabled.

## What it does
- Replaces `/wp-content/themes/yootheme/assets/site/js/consent.js` with a patched file bundled in this plugin.
- Adds `defer` to YOOtheme `theme.js` to avoid **UIkit is not defined** when script order changes.

## Install
1. Upload the plugin zip in WordPress → Plugins → Add New → Upload.
2. Activate.
3. Purge LiteSpeed cache + browser cache.

## Uninstall
Deactivate and delete the plugin. (No theme files are modified.)

## Notes
- This is a community hotfix. Test on staging first.
- Do not publish bundled theme JS if your YOOtheme license disallows redistribution. For public sharing, publish only a patch/diff and the PHP logic.

## License
This plugin is licensed under **GPL-3.0-or-later**.

It includes a modified JavaScript file derived from YOOtheme Pro (GPL). YOOtheme states their software is licensed under the GNU GPL and users receive all GPL rights (see YOOtheme Terms of Service).


## Repository
https://github.com/ermalsenja/yootheme-pro-lscwp-js-defer-hotfix/
