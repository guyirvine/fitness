#!/bin/bash
# Build Vue app and deploy to Google Cloud Storage bucket

set -e

# Build the app
npm run build

# Set your bucket name here
BUCKET_NAME="fitness.guyirvine.com"

# Path to built files
DIST_DIR="dist"

# Sync built files to GCS bucket
if ! command -v gsutil &> /dev/null; then
  echo "gsutil could not be found. Please install Google Cloud SDK."
  exit 1
fi

#TODO rsync appeared to be missing the index.html file.
#TODO -m will run in parralel once rsync is sorted.
#TODO --delete-unmatched-destination-objects appeared to not work.

gsutil rsync -r $DIST_DIR gs://$BUCKET_NAME

# gsutil cp -r $DIST_DIR gs://$BUCKET_NAME


echo "Deployment to gs://$BUCKET_NAME complete."
