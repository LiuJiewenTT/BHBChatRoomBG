let baseUrl = "https://boyshelpboys.com/";

var currentTheme;

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

{
    const headerTitle = document.querySelector('.header-title');
    headerTitle.addEventListener('click', () => {
        popupPage_checkExtensionUpdate();
    });
}


document.getElementById('saveButton').addEventListener('click', () => {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const displayText = document.getElementById('displayText').value;
    const opacitySlider = document.getElementById("opacitySlider");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const themeToggle = document.getElementById("themeToggle");
    const displayModeSelect = document.getElementById("display-mode-select");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const textStrokeColorPicker = document.getElementById("textStrokeColorPicker");
    const textStrokeScopeSelect = document.getElementById("text-stroke-scope-select");
    collectedInputs = popupPageCollectInputs();

    // 将用户输入的内容保存到存储中
    browser.storage.sync.set(collectedInputs).then(() => {
        alert('Section content saved!');
        if (imageUrl.trim() === "") {
            imageUrl_fullpath = "";
        } else {
            if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) {
                imageUrl_fullpath = imageUrl;
            } else {
                imageUrl_fullpath = baseUrl + imageUrl;
            }
        }

        document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
        console.log(document.documentElement.style.getPropertyValue("--bg-image"));
        if (previewCheckbox.checked) {
            if (imageUrl) {
                document.body.classList.remove(currentTheme);
                document.body.classList.add("has-bg-image")
                document.body.classList.add(currentTheme);
            } else {
                document.body.className = `${currentTheme}`;
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const updateHint = document.getElementById("ext_updateLink");
    const imageUrlInput = document.getElementById("imageUrl");
    const displayTextInput = document.getElementById("displayText");
    const opacitySlider = document.getElementById("opacitySlider");
    const opacitySliderValueSpan = document.getElementById("opacitySliderValueSpan");
    const opacityResetButton = document.getElementById("opacityResetButton");
    const previewCheckbox = document.getElementById("previewBackgroundCheckbox");
    const autoResizeBackgroundCheckbox = document.getElementById("autoResizeBackgroundCheckbox");
    const displayModeSelect = document.getElementById("display-mode-select");
    const horizontalDivider1 = document.getElementById("horizontalDivider1");
    const enableTextStrokeCheckbox = document.getElementById("enableTextStrokeCheckbox");
    const enableTextStrokeCheckbox_afterText = document.getElementById("enableTextStrokeCheckbox-afterText");
    const autoTextStrokeColorCheckbox = document.getElementById("autoTextStrokeColorCheckbox");
    const textStrokeWidthInput = document.getElementById("textStrokeWidthText");
    const textStrokeManualColorPickDiv = document.getElementById("textStrokeManualColorPickDiv");
    const textStrokeColorPicker = document.getElementById("textStrokeColorPicker");
    const textStrokeColorPrintSpan = document.getElementById("textStrokeColorPrint");
    const textStrokeScopeSelect = document.getElementById("text-stroke-scope-select");
    const saveButton = document.getElementById('saveButton');
    const themeToggle = document.getElementById("themeToggle");
    const applyButton = document.getElementById('applyButton');

    // 默认主题
    currentTheme = "light";
    imageUrl_fullpath = "";

    sliderFgColor = "var(--theme-color)";
    sliderBgColor = "var(--white-smoke)";
    sliderFgColor_light = "var(--theme-color)";
    sliderBgColor_light = "var(--white-smoke)";
    sliderFgColor_dark = "var(--light-purple-bgcolor)";
    sliderBgColor_dark = "var(--lighter-dark-bgcolor)";

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

    enableTextStrokeCheckbox.addEventListener("change", (event) => {
        const isTextStrokeEnabled = event.target.checked;
        enableTextStrokeCheckbox_afterText.checked = isTextStrokeEnabled;
        if (!isTextStrokeEnabled) {
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

    // 加载用户设置的图片背景
    browser.storage.sync.get({
        imageUrl: '', displayText: '', opacityValue: 0.3, theme: '', previewEnabled: false, autoResizeBackground: false,
        displayMode: 'default',
        textStrokeParams: {
            isEnabled: false, autoColor: false, width: 0.1,
            color: '#000000', scope: 'username'
        }
    }).then((data) => {
        if (data.imageUrl) {
            document.getElementById('imageUrl').value = data.imageUrl;
        }
        if (data.displayText) {
            document.getElementById('displayText').value = data.displayText;
        }

        // 恢复预览开关状态
        if (data.previewEnabled === true) {
            previewCheckbox.checked = true;
        } else {
            previewCheckbox.checked = false;
        }

        if (data.autoResizeBackground === true) {
            autoResizeBackgroundCheckbox.checked = true;
        } else {
            autoResizeBackgroundCheckbox.checked = false;
        }

        // 恢复图片背景
        if (data.imageUrl) {
            if (data.imageUrl.startsWith("http") || data.imageUrl.startsWith("https")) {
                imageUrl_fullpath = data.imageUrl;
            } else {
                imageUrl_fullpath = baseUrl + data.imageUrl;
            }
            document.documentElement.style.setProperty("--bg-image", `url('${imageUrl_fullpath}')`);
            console.log(document.documentElement.style.getPropertyValue("--bg-image"));
            if (previewCheckbox.checked) {
                body.classList.add("has-bg-image"); // 标记启用背景图片
            }
        } else {
            imageUrl_fullpath = "";
        }

        if (data.opacityValue != null) {
            // 设置 opacitySilder 的数值为 data.opacityValue;
            opacitySlider.value = data.opacityValue;
            opacitySliderValueSpan.textContent = `${data.opacityValue}`;
        }

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

        // 恢复主题
        if (data.theme) {
            currentTheme = data.theme;
        }

        // 恢复显示模式
        if (data.displayMode) {
            displayModeSelect.value = data.displayMode;
        }

        updateHint.classList.add(currentTheme);
        imageUrlInput.classList.add(currentTheme);
        displayTextInput.classList.add(currentTheme);
        opacitySlider.classList.add(currentTheme);
        opacityResetButton.classList.add(currentTheme);
        slider_colorChange(opacitySlider);
        previewCheckbox.classList.add(currentTheme);
        autoResizeBackgroundCheckbox.classList.add(currentTheme);
        displayModeSelect.classList.add(currentTheme);
        themeToggle.classList.add(currentTheme);
        horizontalDivider1.classList.add(currentTheme);
        enableTextStrokeCheckbox_afterText.classList.add(currentTheme);
        enableTextStrokeCheckbox.classList.add(currentTheme);
        autoTextStrokeColorCheckbox.classList.add(currentTheme);
        textStrokeWidthInput.classList.add(currentTheme);
        textStrokeScopeSelect.classList.add(currentTheme);
        saveButton.classList.add(currentTheme);
        applyButton.classList.add(currentTheme);

        body.classList.add(currentTheme);
    });

    // 监听主题切换
    themeToggle.addEventListener("click", () => {
        newTheme = currentTheme === "light" ? "dark" : "light";

        // 切换主题类
        body.classList.remove(currentTheme);
        body.classList.add(newTheme);

        updateHint.classList.remove(currentTheme);
        updateHint.classList.add(newTheme);
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
        themeToggle.classList.remove(currentTheme);
        themeToggle.classList.add(newTheme);
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
        saveButton.classList.remove(currentTheme);
        saveButton.classList.add(newTheme);
        applyButton.classList.remove(currentTheme);
        applyButton.classList.add(newTheme);

        currentTheme = newTheme;

        slider_colorChange(opacitySlider);

        // 输出body的主题类名
        console.log('[body.className:' + body.className + ']');

        // 保存主题到存储
        browser.storage.sync.set({ theme: currentTheme });
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
    previewCheckbox.addEventListener("change", (event) => {
        const isPreviewEnabled = event.target.checked;


        if (isPreviewEnabled && imageUrl_fullpath) {
            body.classList.remove(currentTheme);
            body.classList.add("has-bg-image")
            body.classList.add(currentTheme);
        } else {
            body.classList.remove(currentTheme);
            body.classList.remove("has-bg-image")
            body.classList.add(currentTheme);
        }

        // 保存预览状态
        console.log('[previewEnabled:' + isPreviewEnabled + ']');
        browser.storage.sync.set({ previewEnabled: isPreviewEnabled });
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

    applyButton.addEventListener("click", async () => {
        // local_data = await applyWork_getSyncData();
        temporage_data = popupPageCollectInputs();
        console.log('temporage_data:', temporage_data);     // 调试用
        // 获取当前活动标签页并注入脚本
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            console.log('tabs:', tabs);     // 调试用
            browser.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function (syncData, localData) {
                    // console.log('syncData:', syncData);     // 调试用
                    applyWork_core(syncData, localData);
                },
                args: [temporage_data, null]  // 传递存储的设置到注入的函数中
            });
        });
    });
});
