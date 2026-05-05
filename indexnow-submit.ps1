# IndexNow bulk URL submission — temptingbabes.com
# Run this whenever you publish new pages or update existing ones.
# Usage: Right-click → "Run with PowerShell"  (or: pwsh indexnow-submit.ps1)

$body = @{
  host        = "www.temptingbabes.com"
  key         = "8b094e7e22334df0b250a426d8b74150"
  keyLocation = "https://www.temptingbabes.com/8b094e7e22334df0b250a426d8b74150.txt"
  urlList     = @(
    # Core pages
    "https://www.temptingbabes.com/",
    "https://www.temptingbabes.com/New/",
    "https://www.temptingbabes.com/Trending/",
    "https://www.temptingbabes.com/Popular/",
    "https://www.temptingbabes.com/Offers/",
    "https://www.temptingbabes.com/Cams/",
    "https://www.temptingbabes.com/AI-chat/",
    # Dating profiles
    "https://www.temptingbabes.com/Dating/",
    "https://www.temptingbabes.com/Dating/abigail/",
    "https://www.temptingbabes.com/Dating/angel/",
    "https://www.temptingbabes.com/Dating/anita/",
    "https://www.temptingbabes.com/Dating/cassandra/",
    "https://www.temptingbabes.com/Dating/charlie/",
    "https://www.temptingbabes.com/Dating/chloe/",
    "https://www.temptingbabes.com/Dating/corina/",
    "https://www.temptingbabes.com/Dating/emily/",
    "https://www.temptingbabes.com/Dating/kate/",
    "https://www.temptingbabes.com/Dating/monica/",
    "https://www.temptingbabes.com/Dating/nicole/",
    "https://www.temptingbabes.com/Dating/rose/",
    "https://www.temptingbabes.com/Dating/sophie/",
    "https://www.temptingbabes.com/Dating/tracy/",
    # Blog articles
    "https://www.temptingbabes.com/Blog/dating-advice/midnight-ache-scrolling-loneliness/",
    "https://www.temptingbabes.com/Blog/dating-advice/no-social-circle-get-matched/",
    "https://www.temptingbabes.com/Blog/dating-advice/lonely-weekends/",
    "https://www.temptingbabes.com/Blog/dating-advice/3am-loneliness-brain/",
    "https://www.temptingbabes.com/Blog/dating-advice/doom-scrolling-vs-connecting/",
    "https://www.temptingbabes.com/Blog/dating-advice/dating-apps-designed-to-keep-you-single/",
    "https://www.temptingbabes.com/Blog/dating-advice/no-matches-tinder-real-reason/",
    "https://www.temptingbabes.com/Blog/dating-advice/why-women-dont-reply-dating-apps/",
    "https://www.temptingbabes.com/Blog/dating-advice/average-man-dating-app-stats/",
    "https://www.temptingbabes.com/Blog/dating-advice/ai-girlfriend-apps-ranked-2026/",
    "https://www.temptingbabes.com/Blog/dating-advice/talking-to-ai-companion/",
    "https://www.temptingbabes.com/Blog/dating-advice/ai-chat-men-over-30/",
    "https://www.temptingbabes.com/Blog/dating-advice/start-conversation-online-without-being-ignored/",
    "https://www.temptingbabes.com/Blog/dating-advice/what-women-want-first-message/",
    "https://www.temptingbabes.com/Blog/dating-advice/low-social-circle-meet-women/",
    "https://www.temptingbabes.com/Blog/dating-advice/find-active-women-online-near-you/",
    "https://www.temptingbabes.com/Blog/dating-advice/matching-vs-connecting/"
  )
} | ConvertTo-Json -Depth 3

Write-Host "Submitting $( ($body | ConvertFrom-Json).urlList.Count ) URLs to IndexNow..." -ForegroundColor Cyan

$response = Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.indexnow.org/IndexNow" `
  -ContentType "application/json; charset=utf-8" `
  -Body $body

Write-Host "Done! HTTP 200 = success." -ForegroundColor Green
