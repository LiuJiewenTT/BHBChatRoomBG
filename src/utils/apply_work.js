function applyWork() {
    applyWork_getSyncData().then((data) => {
        console.log('applyWork_getSyncData: ', data);  // 调试用
        applyWork_core(data, null);
    });
}

async function applyWork_getSyncData() {
    return await browser.storage.sync.get({
        imageUrl: '', displayText: '', displayMode: 'extended', opacityValue: 0.3, autoResizeBackground: false, 
        persistTimestampDisplay: false, hideScrollbarTrack: true,
        textStrokeParams: null, customAvatarParams: null
    });
}

function applyWork_core(storagedata_sync, storagedata_local) {
    let siteThemeMode = getSiteThemeMode_LightOrDark();
    console.log('siteThemeMode: ', siteThemeMode);  // 调试用

    data = storagedata_sync;

    (() => {

        let section;
        let old_section = null;
        let sectionClassName = "background-insert-section";
        let sectionID = "background-insert-section-id";
        let chatboxClassName = "chat-history-wrapper";
        let chatboxContainerClassName = "app-chat-history";
        section = document.getElementById(sectionID);
        chatBox = document.querySelector('.' + chatboxClassName);
        chatboxContainer = document.querySelector('.' + chatboxContainerClassName);

        if (data.displayMode === 'default') {
            data.displayMode = 'chat-background-extended-clear';
        }

        if (!section) {
            flag_new_section = true;
            section = document.createElement('section');
            section.className = "background-insert-section"
            section.id = sectionID;
        }
        else {
            flag_new_section = false;
            // 创建一个深拷贝（包含子节点）
            // old_section = section.cloneNode(true);
            // 创建一个浅拷贝（不包含子节点）
            old_section = section.cloneNode(false);
        }
        if (data.imageUrl) {
            section.style.backgroundImage = `url('${data.imageUrl}')`;
            section.style.backgroundRepeat = "repeat";
            if (data.autoResizeBackground) {
                section.style.backgroundSize = "cover";
            }
            section.style.display = "flex";
            section.style.alignItems = "center";
            section.style.justifyContent = "center";
            section.style.fontSize = "xx-large";
            section.style.fontWeight = "900";
            section.style.position = "fixed";
            section.style.top = "0";
            section.style.left = "0";
            section.style.right = "0";
            section.style.bottom = "0";
            section.style.pointerEvents = "none"; // 防止干扰用户操作
            section.style.opacity = `${data.opacityValue}`;
            if (data.displayMode === 'fullscreen') {
                section.style.zIndex = "2000";  // 全屏模式用
            } else {
                // 取消对于 section.style.zIndex 的设置
                section.style.zIndex = null;
            }

            // 设置显示的文本，默认为空字符串
            section.textContent = data.displayText || '';
        }

        let inputBoxShadowLineStyleID = "input-box-shadow-line-removing-style";
        let inputBoxShadowLineStyle = document.getElementById(inputBoxShadowLineStyleID);
        let inputBoxShadowLineStyle_isNew = false;
        if (inputBoxShadowLineStyle === null) {
            inputBoxShadowLineStyle_isNew = true;
            inputBoxShadowLineStyle = document.createElement('style');
            inputBoxShadowLineStyle.id = inputBoxShadowLineStyleID;
            inputBoxShadowLineStyle.textContent = `
            .chat-history-footer:before {
                background: transparent !important;
            }
            `;
        }

        if (old_section) {
            section.remove();
        }
        // else: new section will be appended to body without deleting old one
        chatBox.style.removeProperty('background-image');

        if (data.displayMode === 'disabled') {
            console.log('applyWork_core: displayMode is disabled.');
            // return;
        }

        if (data.displayMode === 'fullscreen') {
            document.body.appendChild(section); // 将 section 插入页面
        }
        if (data.displayMode === 'extended') {
            document.body.appendChild(section); // 将 section 插入页面
        }
        if (data.displayMode === 'page-background') {
            document.body.insertBefore(section, document.body.firstChild);
        }
        if (data.displayMode === 'chat-background-extended') {
            chatBox.insertBefore(section, chatBox.firstChild);
            // 接下来删除黑条
            if (inputBoxShadowLineStyle_isNew) {
                chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
            }
        }
        if (data.displayMode === 'chat-background-extended-clear') {
            chatboxContainer.parentNode.insertBefore(section, chatboxContainer);
            // 接下来删除黑条
            if (inputBoxShadowLineStyle_isNew) {
                chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
            }
        }
        if (data.displayMode === 'chat-background') {
            if (data.autoResizeBackground) {
                chatBox.style.backgroundSize = "cover";
            } else {
                chatBox.style.backgroundSize = "auto";
            }
            chatBox.style.setProperty('background-image', `url('${data.imageUrl}')`);
            // 接下来删除黑条
            if (inputBoxShadowLineStyle_isNew) {
                chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
            }
        }

        let persistTimestampDisplayStyleID = "persist-timestamp-display-style";
        let persistTimestampDisplayStyle = document.getElementById(persistTimestampDisplayStyleID);
        if (data.persistTimestampDisplay === true) {
            if (persistTimestampDisplayStyle === null) {
                persistTimestampDisplayStyle = document.createElement('style');
                persistTimestampDisplayStyle.id = persistTimestampDisplayStyleID;
                persistTimestampDisplayStyle.textContent = `
                .message-time {
                    opacity: 1;
                }`;
                document.head.appendChild(persistTimestampDisplayStyle);
            }
        } else {
            if (persistTimestampDisplayStyle !== null) {
                persistTimestampDisplayStyle.remove();
            }
        }

        let hideScrollbarTrackStyleID = "hide-scrollbar-track-style";
        let hideScrollbarTrackStyle = document.getElementById(hideScrollbarTrackStyleID);
        if (data.hideScrollbarTrack === true) {
            if (hideScrollbarTrackStyle === null) {
                hideScrollbarTrackStyle = document.createElement('style');
                hideScrollbarTrackStyle.id = hideScrollbarTrackStyleID;
            }
            hideScrollbarTrackStyle.textContent = `
            ::-webkit-scrollbar-track {
                display: none;
            }
            `;
            document.head.appendChild(hideScrollbarTrackStyle);
        } else {
            if (hideScrollbarTrackStyle !== null) {
                hideScrollbarTrackStyle.remove();
            }
        }

        let textStrokeStyleID = "text-stroke-style";
        let textStrokeStyle = document.getElementById(textStrokeStyleID);
        let textStrokeStyle_isNew = false;
        textStrokeParams = data.textStrokeParams;
        // console.log('textStrokeParams: ', textStrokeParams);  // 调试用
        textStrokeEnabled = textStrokeParams && textStrokeParams.isEnabled === true;
        if (textStrokeEnabled) {
            let textStrokeScope = textStrokeParams.scope;
            let scope_username = false;
            let scope_chatbox = false;
            let style_filter = '';
            let textStrokeColor = null;
            let textStrokeColorToUse = null;

            console.log('text stroke scope: ', textStrokeScope);  // 调试用
            // textStrokeScope = 'all';    // 临时设置
            if (textStrokeScope === null) {
                textStrokeScope = 'username';    // 设置默认值
            }
            if (textStrokeScope === 'username') {
                scope_username = true;
                style_filter = 'small';
            }
            if (textStrokeScope === 'chatbox') {
                scope_chatbox = true;
                style_filter = '.chat-history-wrapper';
            }
            if (textStrokeParams.color) {
                textStrokeColor = textStrokeParams.color;
            }
            if (textStrokeParams.autoColor) {
                let tempColor;
                if (siteThemeMode === 'dark') {
                    tempColor = HexToRgb('#7071a4');
                } else {
                    tempColor = HexToRgb('#a1acb8');
                }
                textStrokeColorToUse = invertColor(tempColor);
                console.log('textStrokeColorToUse: ', textStrokeColorToUse);  // 调试用
            } else {
                textStrokeColorToUse = textStrokeColor;
            }

            if (!textStrokeParams.hasOwnProperty('width') || (!textStrokeParams.hasOwnProperty('color') && !textStrokeParams.hasOwnProperty('autoColor') || !textStrokeColorToUse)) {
                throw new Error('textStrokeParams.width or (textStrokeParams.color and textStrokeParams.autoColor) are not ready.');
            }


            if (textStrokeStyle === null) {
                textStrokeStyle = document.createElement('style');
                textStrokeStyle.id = textStrokeStyleID;
                textStrokeStyle_isNew = true;
            }

            if (!textStrokeStyle_isNew) {
                textStrokeStyle.parentElement.removeChild(textStrokeStyle);
            }
            if (textStrokeScope === 'all') {
                textStrokeStyle.textContent = `
                p,div,span,a{
                    -webkit-text-stroke: ${textStrokeParams.width}px ${textStrokeColorToUse};
                }
                `;
                document.body.insertBefore(textStrokeStyle, document.body.firstChild);
            }
            if (scope_username || scope_chatbox) {
                textStrokeStyle.textContent = `
                ${style_filter} {
                    -webkit-text-stroke: ${textStrokeParams.width}px ${textStrokeColorToUse};
                }
                `;
                chatBox.parentNode.insertBefore(textStrokeStyle, chatBox);
            }
        } else {
            // 未启用，删除已有的 textStrokeStyle
            if (textStrokeStyle !== null) {
                textStrokeStyle.remove();
            }
        }

        if (data.customAvatarParams) {
            if (data.customAvatarParams.isEnabled) {
                if (data.customAvatarParams.avatarUrl !== null) {
                    console.log('applyWork_core: customAvatarParams.avatarUrl: ', data.customAvatarParams.avatarUrl);   // 调试用
                    browser.runtime.sendMessage({
                        action: "apply-custom-avatar",
                        avatarUrl: data.customAvatarParams.avatarUrl,
                    });
                }
            } else {
                // 未启用，删除已有的 customAvatar
                if (data.customAvatarParams.initialAvatarUrl !== null) {
                    console.log('applyWork_core: customAvatarParams.initialAvatarUrl: ', data.customAvatarParams.initialAvatarUrl); // 调试用
                    browser.runtime.sendMessage({
                        action: "apply-initial-avatar",
                        initialAvatarUrl: data.customAvatarParams.initialAvatarUrl,
                    });
                }
            }
        }
    })();


    const wrap_msg_script_id = "wrap_msg_script-id";
    let wrap_msg_script = document.getElementById(wrap_msg_script_id);
    if (wrap_msg_script === null) {
        wrap_msg_script = document.createElement('script');
        wrap_msg_script.id = wrap_msg_script_id;
        wrap_msg_script.src = browser.runtime.getURL('utils/wrap_msg.js');
        wrap_msg_script.onload = function () {
            console.log("wrap_msg_script loaded.");
        };
        document.head.appendChild(wrap_msg_script);
    }

    let chatBox_send_button = null;
    chatBox_send_button = document.querySelector('button.btn.btn-primary.d-flex.write-link.send');
    if (chatBox_send_button === null) {
        chatBox_send_button = document.querySelector('button.send-btn');
    }
    
    if (chatBox_send_button) {
        chatBox_send_button.style.alignItems = "center";
    } else {
        // 添加替补发送按钮
        const chatBox_send_button_custom_id = "chatBox_send_button";
        const chatBox_send_button_style_id = "chatBox_send_button-style-id";
        // let chatBox_send_button_style_isNew = false;
        let chatBox_send_button_style = document.getElementById(chatBox_send_button_style_id);
        if (chatBox_send_button_style === null) {
            // chatBox_send_button_style_isNew = true;
            chatBox_send_button_style = document.createElement('style');
            chatBox_send_button_style.id = chatBox_send_button_style_id;
            chatBox_send_button_style.textContent = `
            #${chatBox_send_button_custom_id} {
                border-radius: 50%;
                width: 26px;
                height: 26px;
                align-items: center;
                justify-content: center;
                display: flex;
                padding: 0.75rem;
            }
            `;
            document.head.appendChild(chatBox_send_button_style);
            console.log('applyWork_core: added chatBox_send_button_style.');
        }
        chatBox_send_button = document.getElementById(chatBox_send_button_custom_id);
        if (chatBox_send_button === null) {
            chatBox_send_button = document.createElement('button');
            chatBox_send_button.id = chatBox_send_button_custom_id;
            chatBox_send_button.classList.add('btn', 'btn-primary', 'd-flex', 'write-link', 'send');
            chatBox_send_button.setAttribute('onclick', 'send()');
            chatBox_send_button.innerHTML = '<i class="la la-paper-plane bx-sm ms-md-2 ms-0" style="margin: 0 !important;"></i>';
            document.querySelector('div.form-send-message.d-flex.justify-content-between.align-items-center.talk.write').appendChild(chatBox_send_button);
            console.log('applyWork_core: added chatBox_send_button.');
        }
    }

    // 强制修复左导航栏的绅士严选图标
    let gentleman_icon = document.querySelector('.menu-link img.menu-icon.navbar-icon.avatar-1');
    if (gentleman_icon) {
        gentleman_icon.classList.remove('menu-icon');
        console.log('applyWork_core: fixed gentleman icon.');
    }

    console.log('applyWork() done.');
}
