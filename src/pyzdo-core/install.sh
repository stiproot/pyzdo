#!/bin/bash

pip uninstall pyzdo_core

pip install dist/pyzdo_core-0.0.1/.

cp -f dist/pyzdo_core-0.0.1.tar.gz ~/code/azdo/pyzdo/src/workers/persist/tmp/
cp -f dist/pyzdo_core-0.0.1.tar.gz ~/code/azdo/pyzdo/src/workers/azdo/tmp/
cp -f dist/pyzdo_core-0.0.1.tar.gz ~/code/azdo/pyzdo/src/workers/insights/tmp/
cp -f dist/pyzdo_core-0.0.1.tar.gz ~/code/azdo/pyzdo/src/workers/azdo_proxy/tmp/
