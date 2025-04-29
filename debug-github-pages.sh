#!/bin/bash

# Debug deploy script for GitHub Pages
echo "Starting debug deployment process..."

# Check if all product schema files are corrected
echo "Checking schema paths..."
grep -r "../../../shared/schema\|@shared/schema" client/src/ || echo "No broken schema paths found"

# Check for path aliases that need to be replaced
echo "Checking path aliases..."
grep -r "@/" client/src/ || echo "No @/ path aliases found"

# Create a basic deployment to see what files are generated
rm -rf debug-gh-pages
mkdir -p debug-gh-pages

echo "Building a minimal version for testing..."
cd client
npx vite build --outDir ../debug-gh-pages --base="./" --debug

cd ..
echo "Checking for static data files..."
mkdir -p debug-gh-pages/api
cp -r data/* debug-gh-pages/api/ 2>/dev/null || echo "No static data to copy"

echo "Debug deployment completed - check the results above for any issues"