echo off

set options=%1

if "%options%"=="" (goto notFound)
if %options%==build goto buildServe
if %options%==serve goto buildServe

:buildServe
ng build
goto commonpause

:serve
echo testt
cd ../.. && yarn start
goto commonpause

:notFound
ECHO "can't find option"
goto commonpause

:commonexit
exit

:commonpause
pause
