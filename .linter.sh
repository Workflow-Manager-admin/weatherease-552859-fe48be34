#!/bin/bash
cd /tmp/kavia/workspace/code-generation/weatherease-552859-fe48be34/weather_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

