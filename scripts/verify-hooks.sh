#!/bin/sh

hooks_path=$(git config core.hooksPath)

if [ "$hooks_path" != ".githooks" ]; then
  echo "Git hooks are not installed."
  echo "Run:"
  echo "chmod +x scripts/setup-hooks.sh"
  echo "./scripts/setup-hooks.sh"
  exit 1
fi

echo "Git hooks are installed and core.hooksPath is set to .githooks"
