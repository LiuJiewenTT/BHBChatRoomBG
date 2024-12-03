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
