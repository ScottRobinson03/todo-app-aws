#! /usr/bin/env bash

(cd ./cdk && cdk deploy TodoCDKStack) && \
node scripts/update-amplify-config.js && \
amplify env checkout dev