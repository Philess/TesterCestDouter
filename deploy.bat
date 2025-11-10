@echo off
echo === Albums API Azure Deployment ===

REM Navigate to project directory
cd /d "c:\repos\Conferences\TesterCestDouter"

REM Set environment variables
set AZURE_ENV_NAME=albums-api-dev
set AZURE_LOCATION=eastus

echo Environment: %AZURE_ENV_NAME%
echo Location: %AZURE_LOCATION%

echo Step 1: Authenticating with Azure...
azd auth login

echo Step 2: Creating/selecting environment...
azd env select %AZURE_ENV_NAME% || azd env new %AZURE_ENV_NAME%

echo Step 3: Setting location...
azd env set AZURE_LOCATION %AZURE_LOCATION%

echo Step 4: Deploying to Azure...
azd up

echo Deployment complete!
pause