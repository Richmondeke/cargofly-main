#!/bin/bash
# Script to add environment variables to Vercel for Cargofly

# Firebase
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "AIzaSyCz6OAnpdaeC4BYp85MKM7ImbsEec-w4hE"
npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "caverton-4eeec.firebaseapp.com"
npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "caverton-4eeec"
npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "caverton-4eeec.firebasestorage.app"
npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "905688850260"
npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "1:905688850260:web:7da10ea5ebb2827c5772c1"

# App URL
npx vercel env add NEXT_PUBLIC_APP_URL production <<< "https://cargofly.vercel.app"

# Payments
npx vercel env add NEXT_PUBLIC_KORAPAY_PUBLIC_KEY production <<< "pk_test_cEWzXJRd4krgSQYeAc6M1rFAmB1Zp4xPmmM6ZbW4"
npx vercel env add KORAPAY_SECRET_KEY production <<< "sk_test_8p41vygdnH58YrsHaRvz6LADTM6SHqkLthHfBr2z"
npx vercel env add KORAPAY_ENCRYPTION_KEY production <<< "V9GK5RvNr8pRVaApua5XwFZg2qdRrXti"

echo "Environment variables sync triggered."
