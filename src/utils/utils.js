browser_type = null;

if (typeof chrome === 'undefined') {
    browser_type = 'firefox';
} else {
    browser_type = 'chrome';
}

var cached_customAvatarParams = null;
const customAvatarParams_defaults = {
    isEnabled: false,
    avatarUrl: null,
    initialAvatarUrl: null
}
cached_customAvatarParams = structuredClone(customAvatarParams_defaults);
var cached_customInitialAvatarUrl = null;

var default_sync_storage_dict_params = {
    disableStorageSync: false,
    imageUrl: '', displayText: '', displayMode: 'extended', opacityValue: 0.3, autoResizeBackground: false, 
    persistTimestampDisplay: false, hideScrollbarTrack: true,
    textStrokeParams: null, customAvatarParams: null
}
var default_local_storage_dict_params = structuredClone(default_sync_storage_dict_params);
var default_local_storage_dict_params_extra = {localImageData: null};
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
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const opacitySlider = document.getElementById("opacitySlider");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const themeToggle = document.getElementById("themeToggle");
    const displayModeSelect = document.getElementById("display-mode-select");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const persistTimestampDisplayCheckbox = document.getElementById("persistTimestampDisplayCheckbox");
    const hideScrollbarTrackCheckbox = document.getElementById("hideScrollbarTrackCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const textStrokeColorPicker = document.getElementById("textStrokeColorPicker");
    const textStrokeScopeSelect = document.getElementById("text-stroke-scope-select");
    const enableCustomAvatarCheckbox = document.getElementById("enableCustomAvatarCheckbox");
    const avatarUrl = document.getElementById("avatarUrl").value.trim();


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
        imageUrl, displayText, opacityValue: opacitySlider.value,
        previewEnabled: previewCheckbox.checked, autoResizeBackground: autoResizeBackgroundCheckbox.checked,
        displayMode: displayModeSelect.value, 
        persistTimestampDisplay: persistTimestampDisplayCheckbox.checked,
        hideScrollbarTrack: hideScrollbarTrackCheckbox.checked,
        textStrokeParams, customAvatarParams
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


async function loadLocalImageData() {
    await browser.storage.local.get({localImageData: null}).then( (data) => {
        if (data.localImageData) {
            console.log("getLocalImageData: not null");
            localImageData = data.localImageData;
        } else {
            console.log("getLocalImageData: null");
            localImageData = null;
        }
    });
}

function ifStorageSyncDisabled(storagedata_sync, storagedata_local) {
    if (storagedata_local !== null && storagedata_local.disableStorageSync === true
        || storagedata_sync !== null && storagedata_sync.disableStorageSync === true
    ) {
        return true;
    }
    return false;
}
