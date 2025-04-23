
var searchBoxAutoCompleteScope_ScopeName = "boyshelpboys.com - search keyword";


function applyWork() {
    applyWork_getSyncAndLocalData().then((data) => {
        console.log('applyWork_getSyncData: ', data[0]);  // 调试用
        console.log('applyWork_getLocalData: ', data[1]);  // 调试用
        applyWork_core(data[0], data[1]);
    });
}


async function applyWork_getSyncData() {
    return await browser.storage.sync.get(default_sync_storage_dict_params);
}


async function applyWork_getLocalData() {
    return await browser.storage.local.get(default_local_storage_dict_params);
}


async function applyWork_getSyncAndLocalData() {
    let storagedata_sync = await applyWork_getSyncData();
    let storagedata_local = await applyWork_getLocalData();
    return [storagedata_sync, storagedata_local];
}


function applyWork_core(storagedata_sync, storagedata_local) {
    const urlWithoutQuery = getUrlWithoutQuery();
    flag_isChatRoomPage = isChatRoomPage();

    let flag_disable_storage_sync = ifStorageSyncDisabled(storagedata_sync, storagedata_local);
    if (flag_disable_storage_sync === true) {
        data = storagedata_local;
        console.log('applyWork_core: storagedata_local is used.');
    } else {
        data = storagedata_sync;
        console.log('applyWork_core: storagedata_sync is used.');
    }

    if (data.displayScope === 'default') {
        data.displayScope = 'chat-rooms';
    }
    if (data.displayScope === 'all-pages') {
        // 检查当前url是否通过matchlists_scope_all_pages的wildcard匹配
        // if (!matchlists_scope_all_pages.some(pattern => wildcardMatch(urlWithoutQuery, pattern))) {
        //     return;
        // }
    } else if (data.displayScope === 'chat-rooms') {
        // 检查当前url是否通过matchlists_scope_chat_rooms的wildcard匹配
        if (!matchlists_scope_chat_rooms.some(pattern => wildcardMatch(window.location.pathname, pattern))) {
            return;
        }
    }

    let siteThemeMode = getSiteThemeMode_LightOrDark();
    console.log('siteThemeMode: ', siteThemeMode);  // 调试用

    (() => {

        let section;
        let flag_new_section = false;
        let sectionClassName = "background-insert-section";
        let sectionID = "background-insert-section-id";
        let chatboxClassName = "chat-history-wrapper";
        let chatboxContainerClassName = "app-chat-history";
        let cardContainerClassName = "card";
        section = document.getElementById(sectionID);
        chatBox = document.querySelector('.' + chatboxClassName);
        chatboxContainer = document.querySelector('.' + chatboxContainerClassName);
        cardContainer = document.querySelector('.' + cardContainerClassName);

        let backgroundImageSrc = "";
        if ( data.useLocalImageBackground === true && data.localImageBackground_Data !== null ) {
            backgroundImageSrc = `url('${storagedata_local.localImageBackground_Data}')`;
        } else {
            backgroundImageSrc = `url('${data.imageUrl}')`;
        }

        if (data.displayMode === 'default') {
            data.displayMode = 'chat-background-extended-clear';
        }

        if (!section) {
            flag_new_section = true;
            section = document.createElement('section');
            section.className = "background-insert-section"
            section.id = sectionID;
        }

        if (data.imageUrl 
            || (data.useLocalImageBackground === true && data.localImageBackground_Data !== null)
        ) {
            section.style.backgroundImage = backgroundImageSrc;
            section.style.backgroundRepeat = "repeat";
            if (data.autoResizeBackground) {
                section.style.backgroundSize = "cover";
            } else {
                section.style.backgroundSize = "auto";
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

        if (!flag_new_section) {
            section.remove();
        }
        // else: new section will be appended to body without deleting old one
        
        if (chatBox !== null) {
            chatBox.style.backgroundImage = "";
        }

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
        if (data.displayMode === 'pure-page-background') {
            if (data.autoResizeBackground) {
                document.body.style.backgroundSize = "contain";
            } else {
                document.body.style.backgroundSize = "auto";
            }
            document.body.style.backgroundImage = backgroundImageSrc;
        }
        if (data.displayMode === 'chat-background-extended') {
            if (chatBox !== null) {
                chatBox.insertBefore(section, chatBox.firstChild);
                // 接下来删除黑条
                if (inputBoxShadowLineStyle_isNew) {
                    chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
                }
            }
            if (cardContainer !== null) {
                cardContainer.parentNode.appendChild(section);
            }
        }
        if (data.displayMode === 'chat-background-extended-clear') {
            if (chatBox !== null && chatboxContainer !== null) {
                chatboxContainer.parentNode.insertBefore(section, chatboxContainer);
                // 接下来删除黑条
                if (inputBoxShadowLineStyle_isNew) {
                    chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
                }
            }
            if (cardContainer !== null) {
                cardContainer.insertBefore(section, cardContainer.firstChild);
            }
        }
        if (data.displayMode === 'chat-background') {
            if (chatBox !== null) {
                if (data.autoResizeBackground) {
                    chatBox.style.backgroundSize = "cover";
                } else {
                    chatBox.style.backgroundSize = "auto";
                }
                chatBox.style.backgroundImage = backgroundImageSrc;
                // 接下来删除黑条
                if (inputBoxShadowLineStyle_isNew) {
                    chatBox.parentNode.insertBefore(inputBoxShadowLineStyle, chatBox);
                }
            }
        }
        
        if ( data.trySystemNotificationPush !== null ) {
            if ( data.trySystemNotificationPush !== false
                && data.trySystemNotificationPush !== true ) {
                console.error(`trySystemNotificationPush value invalid: ${data.trySystemNotificationPush}`);
            } else {
                notify_new_message_flag = data.trySystemNotificationPush;
                console.log(`notify_new_message_flag = trySystemNotificationPush = ${notify_new_message_flag}`);
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

    // 以下设置仅在聊天室生效
    if (isChatRoomPage()) {
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
                let chatBoxInputObject = document.querySelector('div.form-send-message.d-flex.justify-content-between.align-items-center.talk.write');
                
                if (chatBoxInputObject !== null) {
                    chatBox_send_button = document.createElement('button');
                    chatBox_send_button.id = chatBox_send_button_custom_id;
                    chatBox_send_button.classList.add('btn', 'btn-primary', 'd-flex', 'write-link', 'send');
                    chatBox_send_button.setAttribute('onclick', 'send()');
                    chatBox_send_button.innerHTML = '<i class="la la-paper-plane bx-sm ms-md-2 ms-0" style="margin: 0 !important;"></i>';

                    chatBoxInputObject.appendChild(chatBox_send_button);
                    console.log('applyWork_core: added chatBox_send_button.');
                }
            }
        }
    }

    // 强制修复左导航栏的绅士严选图标
    let gentleman_icon = document.querySelector('.menu-link img.menu-icon.navbar-icon.avatar-1');
    if (gentleman_icon) {
        gentleman_icon.classList.remove('menu-icon');
        console.log('applyWork_core: fixed gentleman icon.');
    }

    // 强制删除搜索框自动补全属性
    let search_inputs = document.querySelectorAll('#search_form input[name="keyword"]');
    if (data.disableSearchBoxAutoComplete === true) {
        search_inputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
        });
        console.log('applyWork_core: disabled search box autocomplete.');
    }

    let chatInput = document.querySelector('input#msg');
    if (chatInput && data.disableChatInputBoxAutoComplete === true) {
        chatInput.setAttribute('autocomplete', 'off');
        console.log('applyWork_core: disabled chat input autocomplete.');
    }

    console.log('applyWork() done.');
}


