#!/bin/bash

# Clean any previous build
rm -rf gh-pages
mkdir -p gh-pages

# Build with vite directly for GitHub Pages
echo "Building the application for GitHub Pages..."
cd client
npx vite build --outDir ../gh-pages --base="./"
cd ..

# Create a .nojekyll file to prevent Jekyll processing
touch gh-pages/.nojekyll

# Create static mock API data to use instead of the backend
echo "Creating mock API data..."
mkdir -p gh-pages/api
cp -r data/* gh-pages/api/ 2>/dev/null || echo "No static data to copy"

# Create a 404.html file to handle GitHub Pages routing for SPA
cat > gh-pages/404.html << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Innventa Marketplace</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // This script takes the current URL and converts the path and query
    // parameters into just a query parameter for the real index.html,
    // which GitHub Pages will properly serve.
    var pathSegmentsToKeep = 1; // Change this to 0 if your repo is username.github.io

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <h2>Redirecting...</h2>
</body>
</html>
EOL

# Add a script to index.html to handle the redirect
# First, save original index.html
cp gh-pages/index.html gh-pages/index.html.bak

# Add redirect script to head
sed -i 's|</head>|<base href="./"><script type="text/javascript">\
  // Single Page Apps for GitHub Pages\
  // MIT License\
  // This script checks to see if a redirect is present in the query string\
  // and converts it back into the correct url and adds it to the\
  // browser\'s history using window.history.replaceState(...),\
  // which won\'t cause the browser to attempt to load the new url.\
  (function(l) {\
    if (l.search[1] === \'/\' ) {\
      var decoded = l.search.slice(1).split(\'&\').map(function(s) { \
        return s.replace(/~and~/g, \'&\')\
      }).join(\'?\');\
      window.history.replaceState(null, null,\
          l.pathname.slice(0, -1) + decoded + l.hash\
      );\
    }\
  }(window.location))\
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