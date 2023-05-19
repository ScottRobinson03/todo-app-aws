#! /usr/bin/env bash

(cd ../backend/cdk && cdk deploy TodoCDKStack) && \
node scripts/update-amplify-config.js && \
amplify env checkout dev