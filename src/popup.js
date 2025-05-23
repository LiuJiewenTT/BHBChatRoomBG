let baseUrl = "https://boyshelpboys.com/";

var currentTheme;

// // 获取设备的物理屏幕宽度
// var deviceWidth = window.screen.width;
// // 获取浏览器视口宽度
// var viewportWidth = window.innerWidth;
// // 弹窗显示
// alert(`Device width: ${deviceWidth} px\nViewport width: ${viewportWidth} px`);

let flag_disable_storage_sync = null;
var browser_storage_obj = null;
var storage_type_string = "";


/**
 * 检查更新
 */
function popupPage_checkExtensionUpdate() {
    var ext_currentVersion = document.getElementById('ext_currentVersion');
    ext_currentVersion.textContent = browser.runtime.getManifest().version;
    var projectRepoTagsUrl = "https://api.github.com/repos/LiuJiewenTT/BHBChatRoomBG/tags";
    var projectRepoReleasesUrl = "https://api.github.com/repos/LiuJiewenTT/BHBChatRoomBG/releases";
    var projectRepoReleasesPageUrl = "https://github.com/LiuJiewenTT/BHBChatRoomBG/releases";
    var projectRepoReleaseLatestPageUrl = "https://github.com/LiuJiewenTT/BHBChatRoomBG/releases/latest";

    fetch(projectRepoTagsUrl)
        .then(response => response.json())
        .then(data => {
            var latestVersion = data[0].name.replace(/^v/, '');
            var currentVersion = ext_currentVersion.textContent;
            // currentVersion = '1.1';
            console.log("Latest version: " + latestVersion + ", current version: " + currentVersion);
            if (compareVersion(latestVersion, currentVersion) > 0) {
                console.log("New version(tag) available: " + latestVersion);
                fetch(projectRepoReleasesUrl)
                    .then(response => response.json())
                    .then(data => {
                        var latestRelease = data[0];
                        console.log("Latest release: " + latestRelease.tag_name);
                        if (latestRelease.prerelease) {
                            console.log("This is a pre-release, skip update check.");
                            return;
                        }
                        if (latestRelease.tag_name === `v${latestVersion}`) {
                            console.log("Release for new version tag is available.");
                            var updateLink = document.getElementById('ext_updateLink');
                            updateLink.href = projectRepoReleaseLatestPageUrl;
                            updateLink.textContent = `Update available: ${latestVersion}`;
                            // updateLink.style.display = "block";
                            setElementTextIgnoreVisitedPseudoClass(updateLink);
                        } else {
                            console.log("No release for new version tag is available.");
                        }
                    })
                    .catch(error => console.error(error));
            }
        })
        .catch(error => console.error(error));
}
popupPage_checkExtensionUpdate();

var browser_storage_sync_obj = browser.storage.sync;
var browser_storage_local_obj = browser.storage.local;

let imageUrl_fullpath = "";
let cached_background_image_src = "";

loadCustomAvatarParams();

document.getElementById('saveButton').addEventListener('click', 
    /**
     * 保存参数
     */
    async () => {
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    collectedInputs = popupPageCollectInputs();

    // 将用户输入的内容保存到存储中
    browser_storage_obj.set(collectedInputs).then(async () => {
        // notify user that settings have been saved
        alert(`设置已保存! (${storage_type_string})`);        
        await eventTrigger(previewCheckbox, previewCheckbox_change, 'change');
    });

    if (flag_disable_storage_sync) {
        browser_storage_local_obj.set({disableStorageSync: true});
    } else {
        browser_storage_local_obj.set({disableStorageSync: false});
    }
});


document.addEventListener("DOMContentLoaded", 
    /**
     * 加载参数并应用，载入UI
     */
    async () => {
    const body = document.body;
    const headerTitle = document.querySelector('.header-title');
    const updateHint = document.getElementById("ext_updateLink");
    const syncSettingsCheckButton = document.getElementById("syncSettingsCheckButton");
    const syncSettingsStatusSpan = document.getElementById("syncSettingsStatusSpan");
    const useLocalImageBackgroundCheckbox = document.getElementById("useLocalImageBackgroundCheckbox");
    const selectLocalImageBackgroundButton = document.getElementById("selectLocalImageBackgroundButton");
    const deleteLocalImageBackgroundButton = document.getElementById("deleteLocalImageBackgroundButton");
    const imageUrlInput = document.getElementById("imageUrl");
    const displayTextInput = document.getElementById("displayText");
    const opacitySlider = document.getElementById("opacitySlider");
    const opacitySliderValueSpan = document.getElementById("opacitySliderValueSpan");
    const opacityResetButton = document.getElementById("opacityResetButton");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const displayModeSelect = document.getElementById("display-mode-select");
    const displayScopeSelect = document.getElementById("display-scope-select");
    const trySystemNotificationPushCheckbox = document.getElementById("trySystemNotificationPushCheckbox");
    const pauseSystemNotificationPushButton = document.getElementById("pauseSystemNotificationPushButton");
    const resumeSystemNotificationPushButton = document.getElementById("resumeSystemNotificationPushButton");
    const horizontalDivider1 = document.getElementById("horizontalDivider1");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const enableTextStrokeCheckbox_afterText = document.getElementById("enableTextStrokeCheckbox-afterText");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const persistTimestampDisplayCheckbox = document.getElementById("persistTimestampDisplayCheckbox");
    const hideScrollbarTrackCheckbox = document.getElementById("hideScrollbarTrackCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const textStrokeManualColorPickDiv = document.getElementById("textStrokeManualColorPickDiv");
    const textStrokeColorPicker = document.getElementById("textStrokeColorPicker");
    const textStrokeColorPrintSpan = document.getElementById("textStrokeColorPrint");
    const textStrokeScopeSelect = document.getElementById("text-stroke-scope-select");
    const horizontalDivider2 = document.getElementById("horizontalDivider2");
    const enableCustomAvatarCheckbox = document.getElementById("enableCustomAvatarCheckbox");
    const enableCustomAvatarCheckbox_afterText = document.getElementById("enableCustomAvatarCheckbox-afterText");
    const enableCustomAvatar_saveInitialButton = document.getElementById("customAvatar-saveInitialButton");
    const enableCustomAvatar_recoverInitialButton = document.getElementById("customAvatar-recoverInitialButton");
    const enableCustomAvatar_cleanButton = document.getElementById("customAvatar-cleanButton");
    const enableCustomAvatar_saveButton = document.getElementById("customAvatar-saveButton");
    const customAvatarUrlInput = document.getElementById("avatarUrl");
    const avatarUrlUsedSpan = document.getElementById("avatarUrlUsedSpan");
    const avatarUrlUsedImg = document.getElementById("avatarUrlUsedImg");
    const disableChatInputBoxAutoCompleteCheckbox = document.getElementById("disableChatInputBoxAutoCompleteCheckbox");
    const disableSearchBoxAutoCompleteCheckbox = document.getElementById("disableSearchBoxAutoCompleteCheckbox");
    
    const saveTo_HintSpan = document.getElementById("saveTo-HintSpan");
    const saveButton = document.getElementById('saveButton');
    const themeToggle = document.getElementById("themeToggle");
    const applyButton = document.getElementById('applyButton');

    var default_get_storage_dict_params = {
        useLocalImageBackground: false,
        imageUrl: '', displayText: '', opacityValue: 0.3, theme: '', previewEnabled: false, autoResizeBackground: false,
        displayMode: 'default', displayScope: 'default',
        trySystemNotificationPush: true,
        persistTimestampDisplay: false, hideScrollbarTrack: true,
        textStrokeParams: {
            isEnabled: false, autoColor: false, width: 0.1,
            color: '#000000', scope: 'username'
        },
        customAvatarParams: null,
        disableChatInputBoxAutoComplete: true,
        disableSearchBoxAutoComplete: true
    };
    var default_get_storage_dict_params2 = {
        useLocalImageBackground: false,
        localImageBackground_Data: null,
        imageUrl: '',
        previewEnabled: false
    }

    headerTitle.addEventListener('click', () => {
        popupPage_checkExtensionUpdate();
    });

    // 默认主题
    currentTheme = "light";
    imageUrl_fullpath = "";

    sliderFgColor = "var(--theme-color)";
    sliderBgColor = "var(--white-smoke)";
    sliderFgColor_light = "var(--theme-color)";
    sliderBgColor_light = "var(--white-smoke)";
    sliderFgColor_dark = "var(--light-purple-bgcolor)";
    sliderBgColor_dark = "var(--lighter-dark-bgcolor)";

    /**
     * 滑动条背景色更新
     * @param {*} slider 
     */
    function slider_colorChange(slider) {
        // 滑动条背景色适配
        if (currentTheme === "light") {
            sliderFgColor = sliderFgColor_light;
            sliderBgColor = sliderBgColor_light;
        } else {
            sliderFgColor = sliderFgColor_dark;
            sliderBgColor = sliderBgColor_dark;
        }
        sliderCoveredBackground = `linear-gradient(to right, ${sliderFgColor} 0%, ${sliderFgColor} ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, ${sliderBgColor} ${(slider.value - slider.min) / (slider.max - slider.min) * 100}%, ${sliderBgColor} 100%)`;
        body.style.setProperty('--slider-cover-background', sliderCoveredBackground); // 设置滑动条背景色
    }

    enableTextStrokeCheckbox_afterText.addEventListener("change", (event) => {
        const isTextStrokeEnabled = event.target.checked;
        enableTextStrokeCheckbox.checked = isTextStrokeEnabled;
        if (isTextStrokeEnabled) {
            horizontalDivider1.removeAttribute('hidden');
            enableTextStrokeCheckbox_afterText.setAttribute('hidden', '');
            enableTextStrokeCheckbox_afterText.parentElement.children[1].setAttribute('hidden', '');
            enableTextStrokeCheckbox_afterText.disabled = true;
            enableTextStrokeCheckbox.disabled = false;
            // enableTextStrokeCheckbox.removeAttribute('hidden');
            // enableTextStrokeCheckbox.parentElement.children[1].removeAttribute('hidden');
            document.getElementById('textStrokeSettingsHorizontalDiv_row1').style.removeProperty('display');
            document.getElementById('textStrokeSettingsHorizontalDiv_row2').style.removeProperty('display');
        }
    });


    // 加载后续需要在应用参数时触发事件的元素的监听器

    enableTextStrokeCheckbox.addEventListener("change", (event) => {
        const isTextStrokeEnabled = event.target.checked;
        enableTextStrokeCheckbox_afterText.checked = isTextStrokeEnabled;
        if (!isTextStrokeEnabled) {
            horizontalDivider1.setAttribute('hidden', '');
            // enableTextStrokeCheckbox.setAttribute('hidden', '');
            // enableTextStrokeCheckbox.parentElement.children[1].setAttribute('hidden', '');
            enableTextStrokeCheckbox.disabled = true;
            enableTextStrokeCheckbox_afterText.removeAttribute('hidden');
            enableTextStrokeCheckbox_afterText.disabled = false;
            enableTextStrokeCheckbox_afterText.parentElement.children[1].removeAttribute('hidden');

            document.getElementById('textStrokeSettingsHorizontalDiv_row1').style.display = 'none';
            document.getElementById('textStrokeSettingsHorizontalDiv_row2').style.display = 'none';
        }
    });

    
    enableCustomAvatarCheckbox_afterText.addEventListener("change", (event) => {
        const isCustomAvatarEnabled = event.target.checked;
        enableCustomAvatarCheckbox.checked = isCustomAvatarEnabled;
        cached_customAvatarParams.isEnabled = isCustomAvatarEnabled;
        if (isCustomAvatarEnabled) {
            horizontalDivider2.removeAttribute('hidden');
            enableCustomAvatarCheckbox_afterText.setAttribute('hidden', '');
            enableCustomAvatarCheckbox_afterText.parentElement.children[1].setAttribute('hidden', '');
            enableCustomAvatarCheckbox_afterText.disabled = true;
            enableCustomAvatarCheckbox.disabled = false;
            document.getElementById('customAvatarHorizontalDiv_row1').style.removeProperty('display');
            document.getElementById('customAvatarHorizontalDiv_row2').style.setProperty('display', 'block');
            document.getElementById('customAvatarHorizontalDiv_row3').style.removeProperty('display');
        }
    });

    enableCustomAvatarCheckbox.addEventListener("change", (event) => {
        const isCustomAvatarEnabled = event.target.checked;
        enableCustomAvatarCheckbox_afterText.checked = isCustomAvatarEnabled;
        cached_customAvatarParams.isEnabled = isCustomAvatarEnabled;
        if (!isCustomAvatarEnabled) {
            horizontalDivider2.setAttribute('hidden', '');
            enableCustomAvatarCheckbox.disabled = true;
            enableCustomAvatarCheckbox_afterText.removeAttribute('hidden');
            enableCustomAvatarCheckbox_afterText.disabled = false;
            enableCustomAvatarCheckbox_afterText.parentElement.children[1].removeAttribute('hidden');

            document.getElementById('customAvatarHorizontalDiv_row1').style.display = 'none';
            document.getElementById('customAvatarHorizontalDiv_row2').style.display = 'none';
            document.getElementById('customAvatarHorizontalDiv_row3').style.display = 'none';
        }
    });

    // 获取配置同步开关状态
    await ifStorageSyncDisabled_checkStorage().then(result => {
        flag_disable_storage_sync = result;
        // console.log("flag_disable_storage_sync: " + flag_disable_storage_sync);  // 调试用
    });

    // 应用配置同步开关和功能状态
    if (flag_disable_storage_sync === true) {
        syncSettingsStatusSpan.textContent = "Disabled";
        browser_storage_obj = browser.storage.local;
        storage_type_string = "local storage";
    } else {
        syncSettingsStatusSpan.textContent = "Enabled";
        browser_storage_obj = browser.storage.sync;
        storage_type_string = "sync storage";
    }

    saveTo_HintSpan.textContent = `Save to: ${storage_type_string}`;

    // 加载用户的设置（此处不可混用apply_work.js当中的，因为需要获取的列表不同）。
    browser_storage_obj.get(default_get_storage_dict_params).then(async (data) => {
        if (data.useLocalImageBackground === true) {
            useLocalImageBackgroundCheckbox.checked = true;
        } else {
            useLocalImageBackgroundCheckbox.checked = false;
        }

        if (data.imageUrl) {
            document.getElementById('imageUrl').value = data.imageUrl;
        }
        if (data.displayText) {
            document.getElementById('displayText').value = data.displayText;
        }

        // 恢复预览开关状态
        if (data.previewEnabled === true) {
            previewCheckbox.checked = true;
            body.classList.add("has-bg-image"); // 标记启用背景图片
        } else {
            previewCheckbox.checked = false;
        }

        if (data.autoResizeBackground === true) {
            autoResizeBackgroundCheckbox.checked = true;
        } else {
            autoResizeBackgroundCheckbox.checked = false;
        }

        if (data.opacityValue != null) {
            // 设置 opacitySilder 的数值为 data.opacityValue;
            opacitySlider.value = data.opacityValue;
            opacitySliderValueSpan.textContent = `${data.opacityValue}`;
        }

        if (data.trySystemNotificationPush != null) {
            trySystemNotificationPushCheckbox.checked = data.trySystemNotificationPush;
        }

        if (data.hideScrollbarTrack === true) {
            hideScrollbarTrackCheckbox.checked = true;
        } else {
            hideScrollbarTrackCheckbox.checked = false;
        }

        persistTimestampDisplayCheckbox.checked = data.persistTimestampDisplay;

        if (data.textStrokeParams) {
            enableTextStrokeCheckbox.checked = data.textStrokeParams.isEnabled;
            enableTextStrokeCheckbox_afterText.checked = data.textStrokeParams.isEnabled;
            enableTextStrokeCheckbox.dispatchEvent(new Event('change'));
            enableTextStrokeCheckbox_afterText.dispatchEvent(new Event('change'));
            autoTextStrokeColorCheckbox.checked = data.textStrokeParams.autoColor;
            autoTextStrokeColorCheckbox.dispatchEvent(new Event('change'));
            textStrokeWidthInput.value = data.textStrokeParams.width;
            textStrokeColorPicker.value = data.textStrokeParams.color;
            textStrokeColorPrintSpan.textContent = data.textStrokeParams.color;
            console.log('color: ', data.textStrokeParams.color, typeof data.textStrokeParams.color);
            textStrokeScopeSelect.value = data.textStrokeParams.scope;
        }

        if (data.customAvatarParams === null) {
            data.customAvatarParams = structuredClone(customAvatarParams_defaults);
        }
        if (data.customAvatarParams) {
            enableCustomAvatarCheckbox.checked = data.customAvatarParams.isEnabled;
            enableCustomAvatarCheckbox_afterText.checked = data.customAvatarParams.isEnabled;
            enableCustomAvatarCheckbox.dispatchEvent(new Event('change'));
            enableCustomAvatarCheckbox_afterText.dispatchEvent(new Event('change'));
            customAvatarUrlInput.value = data.customAvatarParams.avatarUrl;
        }

        // 恢复主题
        if (data.theme) {
            currentTheme = data.theme;
        }

        // 恢复显示模式
        if (data.displayMode) {
            displayModeSelect.value = data.displayMode;
        }

        if (data.displayScope) {
            displayScopeSelect.value = data.displayScope;
        }

        if (data.disableChatInputBoxAutoComplete) {
            disableChatInputBoxAutoCompleteCheckbox.checked = data.disableChatInputBoxAutoComplete;
        }

        if (data.disableSearchBoxAutoComplete) {
            disableSearchBoxAutoCompleteCheckbox.checked = data.disableSearchBoxAutoComplete;
        }

        updateHint.classList.add(currentTheme);
        syncSettingsCheckButton.classList.add(currentTheme);
        useLocalImageBackgroundCheckbox.classList.add(currentTheme);
        selectLocalImageBackgroundButton.classList.add(currentTheme);
        deleteLocalImageBackgroundButton.classList.add(currentTheme);
        imageUrlInput.classList.add(currentTheme);
        displayTextInput.classList.add(currentTheme);
        opacitySlider.classList.add(currentTheme);
        opacityResetButton.classList.add(currentTheme);
        slider_colorChange(opacitySlider);
        previewCheckbox.classList.add(currentTheme);
        autoResizeBackgroundCheckbox.classList.add(currentTheme);
        displayModeSelect.classList.add(currentTheme);
        displayScopeSelect.classList.add(currentTheme);
        themeToggle.classList.add(currentTheme);
        trySystemNotificationPushCheckbox.classList.add(currentTheme);
        pauseSystemNotificationPushButton.classList.add(currentTheme);
        resumeSystemNotificationPushButton.classList.add(currentTheme);
        persistTimestampDisplayCheckbox.classList.add(currentTheme);
        hideScrollbarTrackCheckbox.classList.add(currentTheme);
        horizontalDivider1.classList.add(currentTheme);
        enableTextStrokeCheckbox_afterText.classList.add(currentTheme);
        enableTextStrokeCheckbox.classList.add(currentTheme);
        autoTextStrokeColorCheckbox.classList.add(currentTheme);
        textStrokeWidthInput.classList.add(currentTheme);
        textStrokeScopeSelect.classList.add(currentTheme);
        horizontalDivider2.classList.add(currentTheme);
        enableCustomAvatarCheckbox_afterText.classList.add(currentTheme);
        enableCustomAvatarCheckbox.classList.add(currentTheme);
        enableCustomAvatar_saveInitialButton.classList.add(currentTheme);
        enableCustomAvatar_recoverInitialButton.classList.add(currentTheme);
        enableCustomAvatar_cleanButton.classList.add(currentTheme);
        enableCustomAvatar_saveButton.classList.add(currentTheme);
        customAvatarUrlInput.classList.add(currentTheme);
        disableChatInputBoxAutoCompleteCheckbox.classList.add(currentTheme);
        disableSearchBoxAutoCompleteCheckbox.classList.add(currentTheme);
        saveButton.classList.add(currentTheme);
        applyButton.classList.add(currentTheme);

        body.classList.add(currentTheme);
    });

    browser_storage_obj.get(default_get_storage_dict_params2).then(
        /**
         * 加载参数并应用，载入UI背景
         * @param {*} data 
         */
        async (data) => {
        // 恢复图片背景
        let backgroundImageSrc = "";
        backgroundImageSrc = await getBackgroundImageSrc(data.useLocalImageBackground, data.imageUrl);
        // console.log("backgroundImageSrc: " + backgroundImageSrc); // 调试用
        cached_background_image_src = backgroundImageSrc;
        if (data.useLocalImageBackground !== true) {
            console.log('图片背景: ', backgroundImageSrc);
        } else {
            console.log('图片背景是本地图片base64');
        }
        if (data.previewEnabled === true) {
            document.body.style.backgroundImage = cached_background_image_src;
        }
    });

    // 监听主题切换
    themeToggle.addEventListener("click", () => {
        newTheme = currentTheme === "light" ? "dark" : "light";

        // 切换主题类
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);

        updateHint.classList.remove(currentTheme);
        updateHint.classList.add(newTheme);
        syncSettingsCheckButton.classList.remove(currentTheme);
        syncSettingsCheckButton.classList.add(newTheme);
        useLocalImageBackgroundCheckbox.classList.remove(currentTheme);
        useLocalImageBackgroundCheckbox.classList.add(newTheme);
        selectLocalImageBackgroundButton.classList.remove(currentTheme);
        selectLocalImageBackgroundButton.classList.add(newTheme);
        deleteLocalImageBackgroundButton.classList.remove(currentTheme);
        deleteLocalImageBackgroundButton.classList.add(newTheme);
        imageUrlInput.classList.remove(currentTheme);
        imageUrlInput.classList.add(newTheme);
        displayTextInput.classList.remove(currentTheme);
        displayTextInput.classList.add(newTheme);
        opacitySlider.classList.remove(currentTheme);
        opacitySlider.classList.add(newTheme);
        opacityResetButton.classList.remove(currentTheme);
        opacityResetButton.classList.add(newTheme);
        previewCheckbox.classList.remove(currentTheme);
        previewCheckbox.classList.add(newTheme);
        autoResizeBackgroundCheckbox.classList.remove(currentTheme);
        autoResizeBackgroundCheckbox.classList.add(newTheme);
        displayModeSelect.classList.remove(currentTheme);
        displayModeSelect.classList.add(newTheme);
        displayScopeSelect.classList.remove(currentTheme);
        displayScopeSelect.classList.add(newTheme);
        themeToggle.classList.remove(currentTheme);
        themeToggle.classList.add(newTheme);
        trySystemNotificationPushCheckbox.classList.remove(currentTheme);
        trySystemNotificationPushCheckbox.classList.add(newTheme);
        pauseSystemNotificationPushButton.classList.remove(currentTheme);
        pauseSystemNotificationPushButton.classList.add(newTheme);
        resumeSystemNotificationPushButton.classList.remove(currentTheme);
        resumeSystemNotificationPushButton.classList.add(newTheme);
        persistTimestampDisplayCheckbox.classList.remove(currentTheme);
        persistTimestampDisplayCheckbox.classList.add(newTheme);
        hideScrollbarTrackCheckbox.classList.remove(currentTheme);
        hideScrollbarTrackCheckbox.classList.add(newTheme);
        horizontalDivider1.classList.remove(currentTheme);
        horizontalDivider1.classList.add(newTheme);
        enableTextStrokeCheckbox_afterText.classList.remove(currentTheme);
        enableTextStrokeCheckbox_afterText.classList.add(newTheme);
        enableTextStrokeCheckbox.classList.remove(currentTheme);
        enableTextStrokeCheckbox.classList.add(newTheme);
        autoTextStrokeColorCheckbox.classList.remove(currentTheme);
        autoTextStrokeColorCheckbox.classList.add(newTheme);
        textStrokeWidthInput.classList.remove(currentTheme);
        textStrokeWidthInput.classList.add(newTheme);
        textStrokeScopeSelect.classList.remove(currentTheme);
        textStrokeScopeSelect.classList.add(newTheme);
        horizontalDivider2.classList.remove(currentTheme);
        horizontalDivider2.classList.add(newTheme);
        enableCustomAvatarCheckbox.classList.remove(currentTheme);
        enableCustomAvatarCheckbox.classList.add(newTheme);
        enableCustomAvatarCheckbox_afterText.classList.remove(currentTheme);
        enableCustomAvatarCheckbox_afterText.classList.add(newTheme);
        enableCustomAvatar_saveInitialButton.classList.remove(currentTheme);
        enableCustomAvatar_saveInitialButton.classList.add(newTheme);
        enableCustomAvatar_recoverInitialButton.classList.remove(currentTheme);
        enableCustomAvatar_recoverInitialButton.classList.add(newTheme);
        enableCustomAvatar_cleanButton.classList.remove(currentTheme);
        enableCustomAvatar_cleanButton.classList.add(newTheme);
        enableCustomAvatar_saveButton.classList.remove(currentTheme);
        enableCustomAvatar_saveButton.classList.add(newTheme);
        customAvatarUrlInput.classList.remove(currentTheme);
        customAvatarUrlInput.classList.add(newTheme);
        disableChatInputBoxAutoCompleteCheckbox.classList.remove(currentTheme);
        disableChatInputBoxAutoCompleteCheckbox.classList.add(newTheme);
        disableSearchBoxAutoCompleteCheckbox.classList.remove(currentTheme);
        disableSearchBoxAutoCompleteCheckbox.classList.add(newTheme);
        saveButton.classList.remove(currentTheme);
        saveButton.classList.add(newTheme);
        applyButton.classList.remove(currentTheme);
        applyButton.classList.add(newTheme);

        currentTheme = newTheme;

        slider_colorChange(opacitySlider);

        // 输出body的主题类名
        console.log('[body.className:' + body.className + ']');

        // 保存主题到存储
        browser_storage_obj.set({ theme: currentTheme });
    });

    syncSettingsCheckButton.addEventListener("click", () => {
        if (flag_disable_storage_sync) {
            console.log('原同步设置状态：已禁用');
        } else {
            console.log('原同步设置状态：已启用');
        }

        // 切换同步设置状态
        flag_disable_storage_sync = !flag_disable_storage_sync;
        if (flag_disable_storage_sync) {
            console.log('新同步设置状态：已禁用');
            syncSettingsStatusSpan.textContent = "Disabled";
            browser_storage_obj = browser.storage.local;
            storage_type_string = "local storage";
        } else {
            console.log('新同步设置状态：已启用');
            syncSettingsStatusSpan.textContent = "Enabled";
            browser_storage_obj = browser.storage.sync;
            storage_type_string = "sync storage";
        }
        saveTo_HintSpan.textContent = `Save to: ${storage_type_string}`;
    });

    /**
     * 切换是否使用本地背景图
     * @param {*} event 
     */
    async function useLocalImageBackgroundCheckbox_change(event) {
        const isEnabled = event.target.checked;
    
        let backgroundImageSrc = "";
        backgroundImageSrc = await getBackgroundImageSrc(useLocalImageBackgroundCheckbox.checked, imageUrlInput.value);
        // console.log("backgroundImageSrc: " + backgroundImageSrc); // 调试用
        cached_background_image_src = backgroundImageSrc;
        if (isEnabled !== true) {
            console.log('图片背景: ', backgroundImageSrc);
        } else {
            console.log('图片背景是本地图片base64');
        }
        await eventTrigger(previewCheckbox, previewCheckbox_change, 'change');
    }
    useLocalImageBackgroundCheckbox.addEventListener("change", useLocalImageBackgroundCheckbox_change);

    selectLocalImageBackgroundButton.addEventListener("click", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                // 获取result中的base64编码数据的长度
                let length = event.target.result.length;
                let length_string = formatSize(length);
                browser.storage.local.set({ localImageBackground_Data: event.target.result }).then(async () => {
                    await eventTrigger(useLocalImageBackgroundCheckbox, useLocalImageBackgroundCheckbox_change, 'change');
                    await eventTrigger(previewCheckbox, previewCheckbox_change, 'change');
                    console.log('已保存本地图片，长度: ', length_string);
                    alert(`已保存本地图片，长度: ${length_string}`);
                }).catch((error) => {
                    console.error('保存本地图片失败，长度: ', length_string, error);
                    alert(`保存本地图片失败，长度: ${length_string}`);
                });
            });
            reader.readAsDataURL(file);
        });
        input.click();
    });

    deleteLocalImageBackgroundButton.addEventListener("click", () => {
        browser.storage.local.remove('localImageBackground_Data').then(async () => {
            await eventTrigger(useLocalImageBackgroundCheckbox, useLocalImageBackgroundCheckbox_change, 'change');
            await eventTrigger(previewCheckbox, previewCheckbox_change, 'change');
            console.log('已删除本地图片');
            alert('已删除本地图片');
        }).catch((error) => {
            console.error('删除本地图片失败: ', error);
            alert('删除本地图片失败');
        });
    });

    opacitySlider.addEventListener("input", function () {
        opacitySliderValueSpan.textContent = opacitySlider.value;  // 显示当前滑动条的值
        slider_colorChange(this);  // 背景色适配
    });

    opacityResetButton.addEventListener("click", function () {
        opacitySlider.value = 0.3;
        opacitySliderValueSpan.textContent = "0.3";
        slider_colorChange(opacitySlider);
    });

    // 监听预览复选框变化
    previewCheckbox.addEventListener("change", previewCheckbox_change);

    pauseSystemNotificationPushButton.addEventListener("click", () => {
        browser.runtime.sendMessage({
            action: 'pause_message_fetch'
        });
    });

    resumeSystemNotificationPushButton.addEventListener("click", () => {
        browser.runtime.sendMessage({
            action: 'resume_message_fetch'
        });
    });

    // 启用自动颜色时禁用并隐藏颜色选择器
    autoTextStrokeColorCheckbox.addEventListener("change", (event) => {
        const isAutoColorEnabled = event.target.checked;
        textStrokeColorPicker.disabled = isAutoColorEnabled;
        if (isAutoColorEnabled) {
            textStrokeManualColorPickDiv.children[0].setAttribute('hidden', '');
            textStrokeColorPicker.setAttribute('hidden', '');
            textStrokeColorPrintSpan.setAttribute('hidden', '');
        } else {
            textStrokeManualColorPickDiv.children[0].removeAttribute('hidden');
            textStrokeColorPicker.removeAttribute('hidden');
            textStrokeColorPrintSpan.removeAttribute('hidden');
        }
    });

    // 当颜色选择器的值改变时，更新 <span> 的文本
    textStrokeColorPicker.addEventListener('input', function (event) {
        const color = event.target.value;
        textStrokeColorPrintSpan.textContent = color;  // 改变 span 中的文本为选择的颜色值
    });
    // 当颜色选择器失去焦点时，打印选择的颜色值
    textStrokeColorPicker.addEventListener('blur', function () {
        const selectedColor = textStrokeColorPicker.value;
        console.log('颜色选择器失去焦点，选择的颜色值是:', selectedColor);
    });

    enableCustomAvatar_saveInitialButton.addEventListener("click", () => {
        console.log('保存初始头像');
        // 获取初始头像链接
        browser.cookies.get( { url: baseUrl, name: 'userinfo_avatar' } ).then((cookie) => {
            // console.log('cached_customAvatarParams (before): ', cached_customAvatarParams); // 调试用
            let initialAvatarUrl = cookie ? decodeURIComponent(cookie.value) : null;

            // 获取记录的初始头像链接
            browser_storage_obj.get({ customAvatarParams: null }).then((data) => {
                if ( data.customAvatarParams !== null && data.customAvatarParams.initialAvatarUrl ) {
                    // 比对初始头像链接
                    if (data.customAvatarParams.initialAvatarUrl !== initialAvatarUrl ) {
                        let confirmResult = confirm('当前头像与保存的初始头像不一致，是否覆盖？');
                        if (!confirmResult) {
                            console.log('用户取消覆盖');
                            return;
                        }
                    } else {
                        console.log('当前头像与保存的初始头像一致，无需覆盖');
                        alert('已保存初始头像(无需覆盖)');
                        return;
                    }
                }
                cached_customAvatarParams.initialAvatarUrl = initialAvatarUrl;
                // console.log('cached_customAvatarParams (after): ', cached_customAvatarParams);  // 调试用
                browser_storage_obj.set({ customAvatarParams: cached_customAvatarParams }).then(() => {
                    console.log('已保存初始头像:', cached_customAvatarParams.initialAvatarUrl);
                    alert('已保存初始头像');
                });
            });
        });
    });

    enableCustomAvatar_recoverInitialButton.addEventListener("click", () => {
        console.log('恢复初始头像到Cookie');
        if (!cached_customAvatarParams.initialAvatarUrl) {
            console.error('没有初始头像缓存，请先保存初始头像');
            alert('请先保存初始头像');
            return;
        }
        browser.cookies.set({ url: baseUrl, name: 'userinfo_avatar', value: encodeURIComponent(cached_customAvatarParams.initialAvatarUrl) }).then(() => {
            console.log('已恢复初始头像到Cookie: ', cached_customAvatarParams.initialAvatarUrl);
            avatarUrlUsedSpan.dispatchEvent(new Event('load'));
            alert('已恢复初始头像');
        });
    });

    enableCustomAvatar_cleanButton.addEventListener("click", () => {
        console.log('从Cookie清除头像');
        browser.cookies.remove({ url: baseUrl, name: 'userinfo_avatar' }).then(() => {
            console.log('已从Cookie清除头像');
            avatarUrlUsedSpan.dispatchEvent(new Event('load'));
            alert('已清除头像');
        });
    });

    enableCustomAvatar_saveButton.addEventListener("click", () => {
        console.log('保存头像到Cookie');
        const customAvatarUrl = customAvatarUrlInput.value.trim();
        if (!customAvatarUrl) {
            console.warn('请指定头像图片的链接');
        }

        browser_storage_obj.get({ customAvatarParams: null }).then((data) => {
            if ( !(data.customAvatarParams !== null && data.customAvatarParams.initialAvatarUrl) ) {
                let confirmResult = confirm('没有存储初始头像，是否继续设置头像？');
                if (!confirmResult) {
                    console.log('用户取消继续');
                    return;
                }
            }
            // 保存头像到cookie
            browser.cookies.set({ url: baseUrl, name: 'userinfo_avatar', value: encodeURIComponent(customAvatarUrl) }).then(() => {
                console.log('已保存头像到Cookie: ', customAvatarUrl);
                avatarUrlUsedSpan.dispatchEvent(new Event('load'));
                alert('已保存头像');
            });
        });
    });

    avatarUrlUsedSpan.addEventListener('load', function () {
        // 从cookie读取正在使用的头像链接
        browser.cookies.get({ url: baseUrl, name: 'userinfo_avatar' }).then((cookie) => {
            if (cookie === null || cookie.value === null) {
                console.error('读取头像失败(未获取到头像)');
                avatarUrlUsedSpan.textContent = '未获取到头像';
                avatarUrlUsedImg.setAttribute('src', '');
                return;
            }
            avatarUrlUsedSpan.textContent = decodeURIComponent(cookie.value);
            let avatarUrlUsedImgUrl = avatarUrlUsedSpan.textContent;
            if (cookie) {
                avatarUrlUsedImgUrl = getUrlFullpath(avatarUrlUsedImgUrl);
            }
            avatarUrlUsedImg.setAttribute('src', avatarUrlUsedImgUrl);
        }).catch((error) => {
            console.error('读取头像失败: ', error);
            avatarUrlUsedSpan.textContent = '获取头像失败';
            avatarUrlUsedImg.setAttribute('src', '');
        });
    });

    avatarUrlUsedSpan.addEventListener('click', function () {
        avatarUrlUsedSpan.dispatchEvent(new Event('load'));
    });

    avatarUrlUsedSpan.dispatchEvent(new Event('load'));

    applyButton.addEventListener("click", async () => {
        // local_data = await applyWork_getSyncData();
        var temporary_data = popupPageCollectInputs();
        var sync_data = null;
        var local_data = null;

        if (flag_disable_storage_sync === true) {
            // 使用本地存储
            console.log('使用本地存储应用');
            local_data = temporary_data;
            if (local_data === null) {
                local_data = {disableStorageSync: true};
            } else if (typeof local_data['disableStorageSync'] === 'undefined') {
                local_data['disableStorageSync'] = true;
            }
        } else {
            // 使用同步存储
            console.log('使用同步存储应用');
            sync_data = temporary_data;
        }

        if (temporary_data.useLocalImageBackground === true) {
            // 启用本地图片背景
            console.log('启用本地图片背景');
            await browser.storage.local.get('localImageBackground_Data').then((data) => {
                local_data['localImageBackground_Data'] = data.localImageBackground_Data;
            });
        }

        // console.log('temporary_data: ', temporary_data);     // 调试用
        // 获取当前活动标签页并注入脚本
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            // console.log('tabs:', tabs);     // 调试用
            browser.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function (syncData, localData) {
                    console.log('syncData: ', syncData);     // 调试用
                    console.log('localData: ', localData);     // 调试用
                    applyWork_core(syncData, localData);
                },
                args: [sync_data, local_data]  // 传递存储的设置到注入的函数中
            });
        });
    });
});

async function previewCheckbox_change(event) {
    const isPreviewEnabled = event.target.checked;

    if (isPreviewEnabled) {
        document.body.classList.remove(currentTheme);
        document.body.classList.add("has-bg-image");
        document.body.style.backgroundImage = cached_background_image_src;
        document.body.classList.add(currentTheme);
    } else {
        document.body.classList.remove(currentTheme);
        document.body.style.backgroundImage = "";
        document.body.classList.remove("has-bg-image");
        document.body.classList.add(currentTheme);
    }

    // 保存预览状态
    console.log('[previewEnabled:' + isPreviewEnabled + ']');
    browser_storage_obj.set({ previewEnabled: isPreviewEnabled });
}
