if not exist .\build\BHBChatRoomBG mkdir .\build\BHBChatRoomBG
if not exist .\build\BHBChatRoomBG goto:eof
if exist .\build\BHBChatRoomBG.xpi del .\build\BHBChatRoomBG.xpi
if exist .\build\BHBChatRoomBG.xpi goto:eof
del .\build\BHBChatRoomBG\*.* /Q /S
rmdir .\build\BHBChatRoomBG /S /Q
xcopy /E /Y .\src\* .\build\BHBChatRoomBG\
ren .\build\BHBChatRoomBG\manifest-firefox.json manifest.json
7z a -sse .\build\BHBChatRoomBG.xpi .\build\BHBChatRoomBG\* -x!.\build\BHBChatRoomBG\manifest-chrome.json
ren .\build\BHBChatRoomBG\manifest.json manifest-firefox.json
ren .\build\BHBChatRoomBG\manifest-chrome.json manifest.json
