del BHBChatRoomBG.xpi
if not exist .\build\BHBChatRoomBG mkdir .\build\BHBChatRoomBG
@REM tar --dereference -cvf BHBChatRoomBG.xpi -C .\src\ *
del .\build\BHBChatRoomBG\*.* /Q /S
rmdir .\build\BHBChatRoomBG /S /Q
xcopy /E /Y .\src\* .\build\BHBChatRoomBG\
ren .\build\BHBChatRoomBG\manifest-firefox.json manifest.json
7z a -sse BHBChatRoomBG.xpi .\build\BHBChatRoomBG\* -x!.\build\BHBChatRoomBG\manifest-chrome.json
ren .\build\BHBChatRoomBG\manifest.json manifest-firefox.json
ren .\build\BHBChatRoomBG\manifest-chrome.json manifest.json
