#! /usr/bin/env bash

(cd ./cdk && cdk deploy TodoCDKStack --profile default) && \
node scripts/update-amplify-config.js && \
amplify env checkout dev