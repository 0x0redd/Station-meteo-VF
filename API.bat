@echo off
echo Starting Spring Boot Service Check and Run Script
echo ===============================================

:: Set the project directory
set PROJECT_DIR=C:\Users\FERRA\OneDrive\Documents\GitHub\Station-meteo-VF\API\weatherapi

:: Check if directory exists
if not exist "%PROJECT_DIR%" (
    echo Error: Directory not found: %PROJECT_DIR%
    echo Please check the path and try again.
    pause
    exit /b 1
)

:: Change to the correct directory
cd /d "%PROJECT_DIR%"

:: Check if pom.xml exists
if not exist "pom.xml" (
    echo Error: pom.xml not found in %PROJECT_DIR%
    echo Please ensure you are in the correct directory with the Maven project.
    pause
    exit /b 1
)

echo Current directory: %CD%
echo Checking for pom.xml... Found!
echo.
echo Starting Spring Boot application...
echo ===============================================

:: Run the Spring Boot application
call mvn spring-boot:run

:: If the application stops, wait before closing
echo.
echo Application stopped
pause