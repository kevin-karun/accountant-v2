#!/bin/sh

set -e

git config core.hooksPath .githooks
chmod +x .githooks/commit-msg
chmod +x .githooks/pre-push

echo "Local git hooks installed from .githooks"
