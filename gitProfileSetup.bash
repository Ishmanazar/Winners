#!/bin/bash

echo "🚀 GitHub Profile Setup"
echo "======================="

read -p "GitHub username: " GITHUB_USERNAME
read -p "GitHub email: " GITHUB_EMAIL
read -p "Repository name: " REPO_NAME

REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "Configuring Git identity..."

# Configure Git identity ONLY for the current repository
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

echo "✅ Git identity configured"

echo ""
echo "Configuring GitHub remote..."

# Check whether origin already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "Origin already exists. Updating it..."

    git remote set-url origin "$REMOTE_URL"

    if [ $? -eq 0 ]; then
        echo "✅ Origin updated successfully"
    else
        echo "❌ Failed to update origin"
        exit 1
    fi
else
    echo "Origin does not exist. Adding it..."

    git remote add origin "$REMOTE_URL"

    if [ $? -eq 0 ]; then
        echo "✅ Origin added successfully"
    else
        echo "❌ Failed to add origin"
        exit 1
    fi
fi

echo ""
echo "📦 Repository:"
git remote -v

echo ""
read -p "Push to GitHub now? (y/n): " PUSH_NOW

if [[ "$PUSH_NOW" == "y" || "$PUSH_NOW" == "Y" ]]; then

    echo ""
    echo "🚀 Pushing to $GITHUB_USERNAME/$REPO_NAME..."

    # Detect current branch
    CURRENT_BRANCH=$(git branch --show-current)

    git push -u origin "$CURRENT_BRANCH"

    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Successfully pushed!"
    else
        echo ""
        echo "❌ Push failed."
        echo "Check your GitHub authentication and repository permissions."
        exit 1
    fi
fi