npx vite --force --host 0.0.0.0

docker run -d `
  --name ai-slides-manual-root `
  -u root `
  -p 5173:5173 `
  -v "C:\:/mnt/c" `
  -v "app_vol:/app" `
  --workdir /app `
  ai-slides-final:v2 `
  tail -f /dev/null
