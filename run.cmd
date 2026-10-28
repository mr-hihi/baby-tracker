@echo off
setlocal
call :find_bash
if not defined GIT_BASH if /i "%~1"=="setup" (
  where winget >nul 2>&1 || (echo Error: winget missing - install "App Installer" from the Microsoft Store. & exit /b 1)
  echo Installing Git for Windows with winget...
  winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
  call :find_bash
)
if not defined GIT_BASH (
  echo Error: Git for Windows not found. Run "run setup" or install it from https://git-scm.com/download/win
  exit /b 1
)
rem Forward slashes: run.sh derives ROOT_DIR with dirname, which ignores backslashes.
set "SCRIPT=%~dp0run.sh"
set "SCRIPT=%SCRIPT:\=/%"
"%GIT_BASH%" "%SCRIPT%" %*
exit /b %ERRORLEVEL%

rem Git for Windows' bash only, never the bash on PATH: on Windows that is often WSL.
:find_bash
for %%P in ("%ProgramFiles%\Git" "%ProgramFiles(x86)%\Git" "%LocalAppData%\Programs\Git") do (
  if not defined GIT_BASH if exist "%%~P\bin\bash.exe" set "GIT_BASH=%%~P\bin\bash.exe"
)
if not defined GIT_BASH for /f "delims=" %%G in ('where git 2^>nul') do (
  if not defined GIT_BASH if exist "%%~dpG..\bin\bash.exe" set "GIT_BASH=%%~dpG..\bin\bash.exe"
)
exit /b 0
