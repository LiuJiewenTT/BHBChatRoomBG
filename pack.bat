del BHBChatRoomBG.xpi
if not exist .\build\BHBChatRoomBG mkdir .\build\BHBChatRoomBG
@REM tar --dereference -cvf BHBChatRoomBG.xpi -C .\src\ *
xcopy /E /Y .\src\* .\build\BHBChatRoomBG\
7z a -sse BHBChatRoomBG.xpi .\build\BHBChatRoomBG\*