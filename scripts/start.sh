#!/usr/bin/env bash
set -e

echo "Starting local firebase funcitons ..."

 npm run build

echo "Starting firebase shell ..."

# firebase functions:shell

# npm run watch & firebase serve -p 5001 --only functions
tsc -w & firebase serve -p 5001 --only functions


# firebase emulators:start --only functions

echo "Finished firebase shell!"

echo "Finished local firebase funcitons!"
