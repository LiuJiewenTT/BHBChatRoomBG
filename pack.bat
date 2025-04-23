if not exist ".\build\BHBChatRoomBG" mkdir ".\build\BHBChatRoomBG"
if not exist ".\build\BHBChatRoomBG" exit /B 1
:retry_entry_label
if exist ".\build\BHBChatRoomBG.xpi" del ".\build\BHBChatRoomBG.xpi"
@ if exist ".\build\BHBChatRoomBG.xpi" @(
    echo "Error: Fail to delete BHBChatRoomBG.xpi"
    choice /M "Do you want to continue packing for Chrome/Edge? [Y/N] Or retry? [R]: " /C YNR /N
    if ERRORLEVEL 3 goto :retry_entry_label
    if ERRORLEVEL 2 exit /B 1
)
del ".\build\BHBChatRoomBG\*.*" /Q /S
rmdir ".\build\BHBChatRoomBG" /S /Q
if not exist ".\build\BHBChatRoomBG\res\icons" mkdir ".\build\BHBChatRoomBG\res\icons"
if not exist ".\build\BHBChatRoomBG\res\icons" exit /B 1
xcopy /E /Y ".\src\*" ".\build\BHBChatRoomBG\"
copy ".\res\icons\icon.png" ".\build\BHBChatRoomBG\res\icons\icon.png"
copy ".\res\icons\lamp_121067.svg" ".\build\BHBChatRoomBG\res\icons\lamp_121067.svg"
copy ".\res\icons\cloudrefresh_icon-icons.com_54403.svg" ".\build\BHBChatRoomBG\res\icons\cloudrefresh_icon-icons.com_54403.svg"
copy ".\res\icons\arrow_reset_filled_icon_202577.svg" ".\build\BHBChatRoomBG\res\icons\arrow_reset_filled_icon_202577.svg"
copy ".\res\icons\blueray_disc_cd_dvd_icon_190780.svg" ".\build\BHBChatRoomBG\res\icons\blueray_disc_cd_dvd_icon_190780.svg"
copy ".\res\icons\dvdplayer_86273.svg" ".\build\BHBChatRoomBG\res\icons\dvdplayer_86273.svg"
copy ".\res\icons\bin_delete_file_garbage_recycle_remove_trash_icon_123192.svg" ".\build\BHBChatRoomBG\res\icons\bin_delete_file_garbage_recycle_remove_trash_icon_123192.svg"
copy ".\res\icons\3643774-disk-floppy-save-saveas-saved-saving_113433.svg" ".\build\BHBChatRoomBG\res\icons\3643774-disk-floppy-save-saveas-saved-saving_113433.svg"
copy ".\res\icons\iconfinder-pause-stop-button-player-music-4593160_122283.svg" ".\build\BHBChatRoomBG\res\icons\iconfinder-pause-stop-button-player-music-4593160_122283.svg"

ren ".\build\BHBChatRoomBG\manifest-firefox.json" "manifest.json"
7z a -sse ".\build\BHBChatRoomBG.xpi" ".\build\BHBChatRoomBG\*" -x!".\build\BHBChatRoomBG\manifest-chrome.json"
ren ".\build\BHBChatRoomBG\manifest.json" "manifest-firefox.json"
ren ".\build\BHBChatRoomBG\manifest-chrome.json" "manifest.json"
