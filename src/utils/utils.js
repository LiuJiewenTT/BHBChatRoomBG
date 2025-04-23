
let matchlists_scope_all_pages = ["*://boyshelpboys.com/*",];
let matchlists_scope_chat_rooms = [
    "/chat.htm",
    "/my-notice.htm"
];
let flag_isChatRoomPage = false;


var cached_customAvatarParams = null;
const customAvatarParams_defaults = {
    isEnabled: false,
    avatarUrl: null,
    initialAvatarUrl: null
}
cached_customAvatarParams = structuredClone(customAvatarParams_defaults);
var cached_customInitialAvatarUrl = null;

var default_sync_storage_dict_params = {
    useLocalImageBackground: false,
    localImageBackground_Data: null,
    disableStorageSync: false,
    imageUrl: '', displayText: '', opacityValue: 0.3, autoResizeBackground: false, displayMode: 'extended', displayScope: 'chat-rooms',
    persistTimestampDisplay: false, hideScrollbarTrack: true,
    textStrokeParams: null, customAvatarParams: null,
    disableChatInputBoxAutoComplete: true,
    disableSearchBoxAutoComplete: true
}
var default_local_storage_dict_params = structuredClone(default_sync_storage_dict_params);
var default_local_storage_dict_params_extra = {localImageBackground_Data: null};
default_local_storage_dict_params = {...default_local_storage_dict_params, ...default_local_storage_dict_params_extra};

var localImageData = null;


// 将 RGB 颜色转为反色
function invertColor(color) {
    // 提取 RGB 数值
    const rgb = color.match(/\d+/g);
    if (!rgb) return color; // 如果没有匹配到，则返回原色

    const r = 255 - parseInt(rgb[0]);
    const g = 255 - parseInt(rgb[1]);
    const b = 255 - parseInt(rgb[2]);

    return `rgb(${r}, ${g}, ${b})`;
}


function getSiteThemeMode_LightOrDark() {
    const csslink = document.getElementById("stately_core_css");
    if (!csslink) return "light"; // 如果没有找到 CSS 链接，则返回默认的 light 模式
    // console.log(csslink.getAttribute('href'));
    // console.log(csslink.getAttribute('data-light_mode_href'));
    // console.log(csslink.getAttribute('data-dark_mode_href'));
    switch (csslink.getAttribute('href')) {
        case csslink.getAttribute('data-light_mode_href'):
            return "light";
        case csslink.getAttribute('data-dark_mode_href'):
            return "dark";
        default:
            return "light";
    }
}


function HexToRgb(hex) {
    // 移除可能存在的 #
    hex = hex.replace(/^#/, '');

    // 判断十六进制颜色的长度
    if (hex.length === 3) {
        // 如果是短格式（如 #FFF），扩展为长格式（如 #FFFFFF）
        hex = hex.split('').map(function (char) {
            return char + char;
        }).join('');
    }

    // 解析 RGB 值
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
}


function compareVersion(v1, v2) {
    const parts1 = v1.split('.').map(num => parseInt(num, 10));
    const parts2 = v2.split('.').map(num => parseInt(num, 10));

    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;  // v1 大于 v2
        if (parts1[i] < parts2[i]) return -1; // v1 小于 v2
    }
    return 0; // v1 等于 v2
}


function setElementTextIgnoreVisitedPseudoClass(element) {
    element.addEventListener('mouseover', function () {
        if (currentTheme === "dark") {
            element.style.color = "var(--light-purple-bgcolor)";
        } else {
            element.style.color = "var(--hover-bgcolor)";
        }
    });
    element.addEventListener('mouseout', function () {
        if (currentTheme === "dark") {
            element.style.color = "var(--lighter-dark-bgcolor)";
        } else {
            element.style.color = "var(--white-smoke)";
        }
    });
    element.addEventListener('mousedown', function () {
        if (currentTheme === "dark") {
            element.style.color = "var(--theme-color)";
        } else {
            element.style.color = "var(--theme-color)";
        }
    });
    element.addEventListener('mouseup', function () {
        if (currentTheme === "dark") {
            element.style.color = "var(--lighter-dark-bgcolor)";
        } else {
            element.style.color = "var(--white-smoke)";
        }
    });
}


function popupPageCollectInputs() {
    const useLocalImageBackgroundCheckbox = document.getElementById("useLocalImageBackgroundCheckbox");
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const opacitySlider = document.getElementById("opacitySlider");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const themeToggle = document.getElementById("themeToggle");
    const displayModeSelect = document.getElementById("display-mode-select");
    const displayScopeSelect = document.getElementById("display-scope-select");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const persistTimestampDisplayCheckbox = document.getElementById("persistTimestampDisplayCheckbox");
    const hideScrollbarTrackCheckbox = document.getElementById("hideScrollbarTrackCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const textStrokeColorPicker = document.getElementById("textStrokeColorPicker");
    const textStrokeScopeSelect = document.getElementById("text-stroke-scope-select");
    const enableCustomAvatarCheckbox = document.getElementById("enableCustomAvatarCheckbox");
    const avatarUrl = document.getElementById("avatarUrl").value.trim();
    const disableChatInputBoxAutoCompleteCheckbox = document.getElementById("disableChatInputBoxAutoCompleteCheckbox");
    const disableSearchBoxAutoCompleteCheckbox = document.getElementById("disableSearchBoxAutoCompleteCheckbox");


    let textStrokeParams = {
        isEnabled: enableTextStrokeCheckbox.checked,
        autoColor: autoTextStrokeColorCheckbox.checked,
        width: parseFloat(textStrokeWidthInput.value),
        color: textStrokeColorPicker.value.trim(),
        scope: textStrokeScopeSelect.value
    };

    let customAvatarParams = {
        isEnabled: enableCustomAvatarCheckbox.checked,
        avatarUrl: avatarUrl,
        initialAvatarUrl: cached_customAvatarParams.initialAvatarUrl
    }

    var collected = {
        useLocalImageBackground: useLocalImageBackgroundCheckbox.checked,
        imageUrl, displayText, opacityValue: opacitySlider.value,
        previewEnabled: previewCheckbox.checked, autoResizeBackground: autoResizeBackgroundCheckbox.checked,
        displayMode: displayModeSelect.value, displayScope: displayScopeSelect.value,
        persistTimestampDisplay: persistTimestampDisplayCheckbox.checked,
        hideScrollbarTrack: hideScrollbarTrackCheckbox.checked,
        textStrokeParams, customAvatarParams,
        disableChatInputBoxAutoComplete: disableChatInputBoxAutoCompleteCheckbox.checked,
        disableSearchBoxAutoComplete: disableSearchBoxAutoCompleteCheckbox.checked,
    }
    return collected;
}


/**
 * 从同步存储加载自定义头像参数到缓存缓存中（`cached_customAvatarParams`）
 * @returns 
 */
async function loadCustomAvatarParams() {
    // load from sync storage
    let customAvatarParams = await browser.storage.sync.get('customAvatarParams');
    if (customAvatarParams === null) return;
    customAvatarParams = customAvatarParams.customAvatarParams;
    console.log("loadCustomeAvatarParams async (stored): ", customAvatarParams);
    if (typeof customAvatarParams.isEnabled !== "undefined") {
        cached_customAvatarParams.isEnabled = customAvatarParams.isEnabled;
    }
    if (typeof customAvatarParams.avatarUrl !== "undefined") {
        cached_customAvatarParams.avatarUrl = customAvatarParams.avatarUrl;
    }
    if (typeof customAvatarParams.initialAvatarUrl !== "undefined") {
        cached_customAvatarParams.initialAvatarUrl = customAvatarParams.initialAvatarUrl;
    }
    console.log("loadCustomeAvatarParams async (cached): ", cached_customAvatarParams);
}


function ifStorageSyncDisabled(storagedata_sync, storagedata_local) {
    if (storagedata_local !== null && storagedata_local.disableStorageSync === true
        || storagedata_sync !== null && storagedata_sync.disableStorageSync === true
    ) {
        return true;
    }
    return false;
}


async function getDisableSyncSettings() {
    let storagedata_sync = await browser.storage.sync.get({disableStorageSync: false});
    let storagedata_local = await browser.storage.local.get({disableStorageSync: false});
    return [storagedata_sync, storagedata_local];
}


async function ifStorageSyncDisabled_checkStorage() {
    let [storagedata_sync, storagedata_local] = await getDisableSyncSettings();
    return ifStorageSyncDisabled(storagedata_sync, storagedata_local);
}

function getUrlFullpath(theUrl) {
    let theUrl_fullpath = "";
    if (typeof theUrl !== "undefined" && theUrl !== null 
        && theUrl.trim() !== ""
    ) {
        if (theUrl.startsWith("http") || theUrl.startsWith("https")) {
            theUrl_fullpath = theUrl;
        } else {
            theUrl_fullpath = baseUrl + theUrl;
        }
    }
    return theUrl_fullpath;
}

async function getBackgroundImageSrc(useLocalImageBackground, imageUrl) {
    let backgroundImageSrc = "";
    if ( useLocalImageBackground === true ) {
        await browser.storage.local.get('localImageBackground_Data').then((storagedata_local) => {
            if (storagedata_local.localImageBackground_Data !== null) {
                backgroundImageSrc = `url('${storagedata_local.localImageBackground_Data}')`;
            }
        });
    } else {
        imageUrl_fullpath = getUrlFullpath(imageUrl);
        backgroundImageSrc = `url('${imageUrl_fullpath}')`;
    }
    return backgroundImageSrc;
}

// 一个自动进行单位转换的函数，从Byte到MB都兼容，以最高一级为准，保留两位小数
function formatSize(size) {
    let unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = Math.floor(Math.log(size) / Math.log(1024));
    let sizeStr = (size / Math.pow(1024, index)).toFixed(2);
    return sizeStr + unitArr[index];
}

function formatStorageSize(size) {
    let unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = Math.floor(Math.log(size) / Math.log(1000));
    let sizeStr = (size / Math.pow(1000, index)).toFixed(2);
    return sizeStr + unitArr[index];
}

async function eventTrigger(target, process_function, event_name) {
    let event = {type: event_name, target: target};
    await process_function(event);
}

function getUrlWithoutQuery() {
    const urlWithoutQuery = window.location.origin + window.location.pathname;
    return urlWithoutQuery;
}

function wildcardMatch(url, pattern) {
    // 把通配符（*）替换为正则的 `.*`，然后用正则进行匹配
    const regexPattern = '^' + pattern.split('*').map(escapeRegExp).join('.*') + '$';
    const regex = new RegExp(regexPattern);
    return regex.test(url);
}

// 转义正则表达式的特殊字符
function escapeRegExp(str) {
    return str.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
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

function getMessageTypePrefixString(type) {
    let prefix_string = '❔';
    if ( type === 'log' || type === 'normal' || type === 'info' ) {
        prefix_string = '💬';
    } else if ( type === 'panic' ) {
        prefix_string = '💥❌';
    } else if ( type === 'error' || type === 'fail' ) {
        prefix_string = '❌';
    } else if ( type === 'success' ) {
        prefix_string = '✔';
    } else if ( type === 'warn' ) {
        prefix_string = '⚡❕';
    }
    return prefix_string;
}

function isChatRoomPage() {
    const url = window.location.pathname;
    return matchlists_scope_chat_rooms.some(pattern => wildcardMatch(url, pattern));
}

function createNewUnreadMessagesCountTip() {
    const li_item = document.createElement('li');
    const message = document.createElement('div');
    message.style.cssText = `
        background: rgba(0,0,0,0.3);
        color: white;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
    `;
    message.textContent = `离开期间收到${staged_new_messages_cnt_to_notify}条新消息`;
    li_item.appendChild(message);
    document.querySelector('.mk-chat-box').appendChild(li_item);
}
