browser_type = 'unknown';

// console.log(typeof browser);
// console.log(typeof browser === "undefined");
// console.log(browser);

if (typeof browser === "undefined") {
    browser_type = 'chrome';
} else {
    browser_type = 'firefox';
}

function get_browser_type_general(type) {
    if ( type === 'chrome' ) {
        return 'Chromium';
    } else if ( type === 'firefox' ) {
        return 'Gecko';
    }
    return 'Unknown';
}

browser_type_general = get_browser_type_general(browser_type);
