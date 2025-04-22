// 如果是 Chrome，加载 polyfill
if (typeof browser === "undefined") {
    importScripts("libs/browser-polyfill.js");
    importScripts("utils/utils.js");
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
            iconUrl: browser.runtime.getURL("res/icons/icon.png"),
            title: request.title || `BHB聊天室的消息`,
            message: prefix_string + request.message
        });
    }
});

