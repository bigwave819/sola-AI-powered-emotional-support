$body = @{
  email = "manual-safety-test@yourdomain.com"
} | ConvertTo-Json

# 1. Request a magic link, then manually copy the token from your test inbox
Invoke-RestMethod -Uri "http://localhost:3000/auth/magic-link/request" -Method Post -Body $body -ContentType "application/json"

Write-Host "Check your test inbox, then run the next block with the real token and access token."