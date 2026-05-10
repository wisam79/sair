# Deploy Supabase v2 Resources
Write-Host "🚀 Starting Deployment of UniRide v2..." -ForegroundColor Cyan

# 1. Deploy Edge Functions
Write-Host "📦 Deploying Edge Functions..."
supabase functions deploy atomic-booking
supabase functions deploy trip-engine

# 2. Apply Migrations
Write-Host "🗄️ Applying Database Migrations..."
supabase db push

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
