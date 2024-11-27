if not exist ".\build\BHBChatRoomBG" mkdir ".\build\BHBChatRoomBG"
if not exist ".\build\BHBChatRoomBG" goto:eof
if exist ".\build\BHBChatRoomBG.xpi" del ".\build\BHBChatRoomBG.xpi"
if exist ".\build\BHBChatRoomBG.xpi" goto:eof
del ".\build\BHBChatRoomBG\*.*" /Q /S
rmdir ".\build\BHBChatRoomBG" /S /Q
if not exist ".\build\BHBChatRoomBG\res\icons" mkdir ".\build\BHBChatRoomBG\res\icons"
if not exist ".\build\BHBChatRoomBG\res\icons" goto:eof
xcopy /E /Y ".\src\*" ".\build\BHBChatRoomBG\"
copy ".\res\icons\icon.png" ".\build\BHBChatRoomBG\res\icons\icon.png"
copy ".\res\icons\lamp_121067.svg" ".\build\BHBChatRoomBG\res\icons\lamp_121067.svg"
ren ".\build\BHBChatRoomBG\manifest-firefox.json" "manifest.json"
7z a -sse ".\build\BHBChatRoomBG.xpi" ".\build\BHBChatRoomBG\*" -x!".\build\BHBChatRoomBG\manifest-chrome.json"
ren ".\build\BHBChatRoomBG\manifest.json" "manifest-firefox.json"
ren ".\build\BHBChatRoomBG\manifest-chrome.json" "manifest.json"
