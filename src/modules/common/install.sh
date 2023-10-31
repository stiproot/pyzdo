#!/bin/bash

pip uninstall pm_common

pip install dist/pm_common-0.0.1/.

cp -f dist/pm_common-0.0.1.tar.gz ~/code/azdo/project-m/src/workers/persist/tmp/
cp -f dist/pm_common-0.0.1.tar.gz ~/code/azdo/project-m/src/workers/azdo/tmp/
cp -f dist/pm_common-0.0.1.tar.gz ~/code/azdo/project-m/src/workers/insights/tmp/
cp -f dist/pm_common-0.0.1.tar.gz ~/code/azdo/project-m/src/workers/azdo_proxy/tmp/
