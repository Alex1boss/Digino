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

# Create a 404.html file to handle GitHub Pages routing for SPA
echo "Adding SPA routing for GitHub Pages..."
cat > debug-gh-pages/404.html << EOL
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
cp debug-gh-pages/index.html debug-gh-pages/index.html.bak

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
</script></head>|' debug-gh-pages/index.html

echo "Debug deployment completed - check the results above for any issues"