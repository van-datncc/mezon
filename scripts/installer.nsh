!macro preInit
  ExecWait 'taskkill /F /IM "mezon.exe"'
!macroend

!macro customInstall
  CreateShortCut "$APPDATA\Microsoft\Windows\Start Menu\Programs\mezon.lnk" "$INSTDIR\mezon.exe"
!macroend
