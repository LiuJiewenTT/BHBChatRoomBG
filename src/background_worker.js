// 如果是 Chrome，加载 polyfill
if (typeof browser === "undefined") {
    importScripts("libs/browser-polyfill.js");
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
        browser.cookies.set({ url: "https://boyshelpboys.com/", name: "userinfo_avatar", value: customAvatarUrl }).then(() => {
            console.log('已保存头像到Cookie:', customAvatarUrl);
        });
    }
});

