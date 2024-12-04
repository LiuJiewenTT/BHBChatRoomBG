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

