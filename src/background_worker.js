// 如果是 Chrome，加载 polyfill
if (typeof browser === "undefined") {
    importScripts("libs/browser-polyfill.js");
    importScripts("utils/utils.js");
}


var staged_new_messages_cnt_to_notify = 0;
var messageIds = new Set();


function fetch_message(url) {
    let parsed_url = new URL(url);
    let site_base = parsed_url.protocol + '//' + parsed_url.hostname;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let messages = data.list;
            let length = data.list.length;
            let normal_msg_cnt = 0;
            let last_msg_index;
            // console.log(messages);
            for (let i=length; i>0; i-=1) {
                // console.log(messages[i-1]);
                let msg = JSON.parse(messages[i-1]);
                // 跳过系统信令消息，但保存已撤的消息
                if (
                    msg.type === 'clear' ||
                    msg.type === 'force_refresh' ||
                    msg.type === 'vip_settings'
                ) {
                    continue;
                }
                if ( !msg.id ) {
                    continue;
                }
                // console.log(msg.id);
                if ( messageIds.has(msg.id) ) {
                    break;
                }
                last_msg_index = i-1;
                messageIds.add(msg.id);
                normal_msg_cnt += 1;
            }
            staged_new_messages_cnt_to_notify += normal_msg_cnt;
            console.log(`staged_new_messages_cnt_to_notify: ${staged_new_messages_cnt_to_notify}`);

            if ( normal_msg_cnt > 0 ) {
                let message;
                let message_icon_url;
                if ( normal_msg_cnt === 1 ) {
                    let msg = JSON.parse(messages[last_msg_index]);
                    message = `(${staged_new_messages_cnt_to_notify}条未读)\n来自【${msg.name}】的消息: ${msg.msg}`;
                    message_icon_url = site_base + '/' + msg.pic;
                } else {
                    message = `(${staged_new_messages_cnt_to_notify}条未读)\n${normal_msg_cnt}条新消息`;
                }
                browser.runtime.sendMessage({
                    action: 'notify', 
                    message: message,
                    message_type: 'normal',
                    message_icon_url: message_icon_url
                }); 
            }
        });
}


// 监听消息
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "apply-custom-avatar") {
        // 取得自定义头像的 URL
        var customAvatarUrl = request.avatarUrl;
        console.log('收到自定义头像的 URL:', customAvatarUrl);
        if (customAvatarUrl === undefined) {
            console.log('自定义头像的 URL 为 undefined，不设置');
        }
        // 设置自定义头像
        browser.cookies.set({ url: "https://boyshelpboys.com/", name: "userinfo_avatar", value: encodeURIComponent(customAvatarUrl) }).then(() => {
            console.log('已保存头像到Cookie:', customAvatarUrl);
        });
    } else if (request.action === "apply-initial-avatar") {
        // 取得初始头像的 URL
        var initialAvatarUrl = request.initialAvatarUrl;
        console.log('收到初始头像的 URL:', initialAvatarUrl);
        if (initialAvatarUrl === undefined) {
            console.log('初始头像的 URL 为 undefined，无法设置');
        }
        // 设置初始头像
        browser.cookies.set({ url: "https://boyshelpboys.com/", name: "userinfo_avatar", value: encodeURIComponent(initialAvatarUrl) }).then(() => {
            console.log('已保存头像到Cookie:', initialAvatarUrl);
        });
    } else if (request.action === "notify") {
        let prefix_string = getMessageTypePrefixString(request?.message_type);
        browser.notifications.create({
            type: "basic",
            iconUrl: request.message_icon_url || browser.runtime.getURL("res/icons/icon.png"),
            title: request.title || `BHB聊天室的消息`,
            message: prefix_string + request.message
        });
    } else if (request.action === 'start_message_fetch' || request.action === 'stop_message_fetch') {
        if (request.action === 'start_message_fetch') {
            fetch_message_timer_handle = setInterval(() => { 
                messageIds.add(request.lastMsgID);
                fetch_message(request.url); 
            }, request.interval || 1000);
        } else {
            // stop_message_fetch
            clearInterval(fetch_message_timer_handle);
            fetch_message_timer_handle = 0;
            messageIds.clear();
            sendResponse({
                staged_new_messages_cnt_to_notify: staged_new_messages_cnt_to_notify
            });
            staged_new_messages_cnt_to_notify = 0;
        }
    }
});

