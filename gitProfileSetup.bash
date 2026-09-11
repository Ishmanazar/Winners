#!/bin/bash

set -u

echo ""
echo "🚀 GitHub Profile Setup"
echo "======================="
echo ""

# --------------------------------------------------
# Collect details
# --------------------------------------------------

read -p "GitHub username: " GITHUB_USERNAME
read -p "GitHub email: " GITHUB_EMAIL
read -p "GitHub repository name: " REPO_NAME

if [[ -z "$GITHUB_USERNAME" || -z "$GITHUB_EMAIL" || -z "$REPO_NAME" ]]; then
    echo ""
    echo "❌ Username, email and repository name are required."
    exit 1
fi

# --------------------------------------------------
# Build repository URL
#
# Username is intentionally included in the URL.
# This tells Git which GitHub account to authenticate.
# --------------------------------------------------

REMOTE_URL="https://${GITHUB_USERNAME}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📋 Configuration"
echo "-----------------------------"
echo "GitHub username : $GITHUB_USERNAME"
echo "GitHub email    : $GITHUB_EMAIL"
echo "Repository      : $REPO_NAME"
echo "Remote          : $REMOTE_URL"
echo "-----------------------------"

# --------------------------------------------------
# Check that we're inside a Git repository
# --------------------------------------------------

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo ""
    echo "❌ This directory is not a Git repository."
    exit 1
fi

# --------------------------------------------------
# Configure Git identity ONLY for this repository
# --------------------------------------------------

echo ""
echo "🔧 Configuring Git identity..."

git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$GITHUB_EMAIL"

echo "✅ Local Git identity configured."

# --------------------------------------------------
# Configure repository-scoped HTTPS credentials
# --------------------------------------------------

echo ""
echo "🔐 Configuring repository-scoped credentials..."

# This makes Git include the repository path when
# looking up credentials.
#
# Example:
#
# github.com/Ishmanazar/Winners.git
#
# instead of sharing one credential across github.com.

git config --local credential.useHttpPath true

echo "✅ Repository-scoped credentials enabled."

# --------------------------------------------------
# Configure origin
# --------------------------------------------------

echo ""
echo "🔗 Configuring origin..."

if git remote get-url origin >/dev/null 2>&1; then

    CURRENT_REMOTE=$(git remote get-url origin)

    echo "Existing origin:"
    echo "  $CURRENT_REMOTE"

    git remote set-url origin "$REMOTE_URL"

    if [[ $? -ne 0 ]]; then
        echo ""
        echo "❌ Failed to update origin."
        exit 1
    fi

    echo "✅ Origin updated."

else

    git remote add origin "$REMOTE_URL"

    if [[ $? -ne 0 ]]; then
        echo ""
        echo "❌ Failed to add origin."
        exit 1
    fi

    echo "✅ Origin added."

fi

# --------------------------------------------------
# Remove ONLY the cached credential for this
# specific GitHub username.
#
# This does NOT remove the credentials of your
# other GitHub account.
# --------------------------------------------------

echo ""
echo "🧹 Checking cached credentials..."

if command -v git-credential-osxkeychain >/dev/null 2>&1; then

    printf "protocol=https\nhost=github.com\nusername=%s\n\n" \
        "$GITHUB_USERNAME" |
        git credential-osxkeychain erase

    echo "✅ Cached credential for '$GITHUB_USERNAME' cleared if present."

else

    echo "⚠️ macOS Keychain credential helper not found."
    echo "Git will use the configured credential helper."
fi

# --------------------------------------------------
# Show final configuration
# --------------------------------------------------

echo ""
echo "📋 Final configuration"
echo "======================"

echo "Git user:"
git config --local user.name

echo "Git email:"
git config --local user.email

echo ""
echo "Origin:"
git remote get-url origin

# --------------------------------------------------
# Ask whether to push
# --------------------------------------------------

echo ""
read -p "Do you want to push the current branch now? (y/n): " PUSH_NOW

if [[ ! "$PUSH_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    echo "✅ Setup complete."
    echo ""
    echo "You can push later with:"
    echo "git push -u origin $(git branch --show-current)"
    exit 0
fi

# --------------------------------------------------
# Get current branch
# --------------------------------------------------

CURRENT_BRANCH=$(git branch --show-current)

if [[ -z "$CURRENT_BRANCH" ]]; then
    echo ""
    echo "❌ Could not determine the current branch."
    exit 1
fi

echo ""
echo "🚀 Pushing branch: $CURRENT_BRANCH"
echo ""
echo "GitHub account: $GITHUB_USERNAME"
echo ""
echo "If Git asks for a password, use a GitHub"
echo "Personal Access Token (PAT), NOT your GitHub password."
echo ""

# --------------------------------------------------
# Push
# --------------------------------------------------

git push -u origin "$CURRENT_BRANCH"

PUSH_STATUS=$?

# --------------------------------------------------
# Result
# --------------------------------------------------

if [[ $PUSH_STATUS -eq 0 ]]; then

    echo ""
    echo "🎉 =================================="
    echo "   Successfully pushed!"
    echo "   GitHub: $GITHUB_USERNAME"
    echo "   Repository: $REPO_NAME"
    echo "   Branch: $CURRENT_BRANCH"
    echo "===================================="
    echo ""

else

    echo ""
    echo "❌ Push failed."
    echo ""
    echo "Possible reasons:"
    echo ""
    echo "1. The repository does not exist."
    echo "2. '$GITHUB_USERNAME' does not have write access."
    echo "3. The GitHub PAT is invalid or expired."
    echo "4. The PAT does not have repository permissions."
    echo "5. The repository belongs to an organization with restrictions."
    echo ""

    exit $PUSH_STATUS

fi