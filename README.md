# BHBChatRoomBG

## 简介

这是一个给BHB聊天室添加图片（外链）的插件，支持5种显示模式，支持暗色模式，且其中一种模式去除了输入框上方“白条/黑条”。

> 这个插件按照W3标准编写，对Chrome的兼容由[polyfill](https://github.com/mozilla/webextension-polyfill)提供。

## 安装

### 稳定版

<small>暂未上线。</small>


### 开发版

#### Chrome/Edge

当前版本，在项目根目录执行`pack.bat`后`build/BHBChatRoomBG/`下的可以直接供Chrome加载。以下以Edge举例：打开扩展页，在左侧边栏启用“开发人员模式”，在“已安装的扩展”右侧点击“加载解压缩的扩展”，选择`build`目录下的`BHBChatRoomBG`文件夹即可。

> 注：若火狐正直接加载着`build`目录下的`BHBChatRoomBG.xpi`，则`pack.bat`无法完整执行，提示拒绝访问，但这不影响Chrome/Edge版的打包，无视即可。

#### Firefox

在地址栏输入`about:debugging`进入调试页面，点击`This Firefox`下的`Load Temporary Add-on...`按钮，选择`build/BHBChatRoomBG.xpi`文件，即可安装插件。（适用于无扩展ID时）

## 使用方法

点击插件，在弹出的页面设置链接和文本，点击Save保存即可。

> - 关于链接：如果链接不是http(s)://协议开头，默认会当作BHB站内链接，这可能导致链接识别错误。所以，站外链接请使用完整链接。清空链接并保存，刷新聊天室就不会再插入背景了。
> - 关于文本：这玩意是可选的，不填也行。文本和链接是一体的，如果不插链接则文本也不会显示。文本在仅聊天框背景模式不生效。

## 效果图

<img src="docs/运行效果图1.png" alt="效果图1" style="zoom:50%;" />
<img src="docs/运行效果图2.png" alt="效果图2" style="zoom:50%;" />
<img src="docs/运行效果图3.png" alt="效果图3" style="zoom:50%;" />
<img src="docs/运行效果图4.png" alt="效果图4" style="zoom:50%;" />



## LICENSE Summary

项目本体基于MIT，但使用了一些第三方库，它们的LICENSE文件也可能适用。

- [polyfill](https://github.com/mozilla/webextension-polyfill/blob/master/LICENSE) MPL-2.0
