#!/bin/bash

# This script helps initialize a GitHub repository for your project
# and sets it up for GitHub Pages deployment

# Set this to your GitHub username
read -p "Enter your GitHub username: " github_username

# Set this to your desired repository name
read -p "Enter the repository name: " repo_name

# Ensure the GitHub Pages directory exists
mkdir -p gh-pages

# Run the deploy script to generate the GitHub Pages content
./deploy-gh-pages.sh

# Navigate to the gh-pages directory
cd gh-pages

# Initialize the repository
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial GitHub Pages deployment"

# Add the remote repository
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo ""
echo "Repository is now set up locally. Next steps:"
echo "1. Create a repository named '$repo_name' on GitHub"
echo "2. Run: git push -u origin main"
echo "3. Enable GitHub Pages in repository settings for the main branch"
echo ""
echo "Your site will be available at: https://$github_username.github.io/$repo_name/"