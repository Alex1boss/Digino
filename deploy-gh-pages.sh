#!/bin/bash

# Create a gh-pages directory if it doesn't exist
mkdir -p gh-pages

# Build the application (static frontend only)
echo "Building the application for GitHub Pages..."
cd client
npx vite build --outDir ../gh-pages --base="./"

# Go back to root
cd ..

# Create a .nojekyll file to prevent Jekyll processing
touch gh-pages/.nojekyll

# Create static mock API data to use instead of the backend
echo "Creating mock API data..."
mkdir -p gh-pages/api
cp -r data/* gh-pages/api/ 2>/dev/null || echo "No static data to copy"

# Create an index.js file to handle GitHub Pages routing for SPA
cat > gh-pages/404.html << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting</title>
  <script>
    sessionStorage.setItem('redirect', window.location.pathname);
    window.location.href = '/';
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
EOL

# Add a script to index.html to handle the redirect
# First, save original index.html
cp gh-pages/index.html gh-pages/index.html.bak

# Add redirect script to head
sed -i 's|</head>|<script>\
  (function() {\
    var redirect = sessionStorage.getItem("redirect");\
    if (redirect && redirect !== "/") {\
      sessionStorage.removeItem("redirect");\
      if (redirect.startsWith("/")) {\
        history.replaceState(null, null, redirect);\
      }\
    }\
  })();\
</script></head>|' gh-pages/index.html

echo "GitHub Pages deployment files prepared in gh-pages/ directory."
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Create a new repository on GitHub"
echo "2. Push the contents of the gh-pages/ directory to the main branch of that repository"
echo "3. Enable GitHub Pages in your repository settings"
echo ""
echo "For manual deployment, you can execute these commands:"
echo "cd gh-pages"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial GitHub Pages deployment'"
echo "git remote add origin https://github.com/yourusername/your-repo.git"
echo "git push -u origin main"
echo ""
echo "Then in GitHub repository settings, enable GitHub Pages for the main branch"