@echo off
REM Start the Stream Bot Core stack with Docker Compose
docker compose -f docker-compose.yml up -d

echo.
echo All services are starting in the background.
echo To view logs: docker compose logs -f
echo To stop the stack: docker compose down
pause
