#!/bin/bash

pip uninstall pm_common

pip install dist/pm_common-0.0.1/.

cp dist/pm_common-0.0.1.tar.gz ~/code/repo/project-m/src/workers/persist/tmp/
cp dist/pm_common-0.0.1.tar.gz ~/code/repo/project-m/src/workers/azdo/tmp/
cp dist/pm_common-0.0.1.tar.gz ~/code/repo/project-m/src/workers/insights/tmp/
cp dist/pm_common-0.0.1.tar.gz ~/code/repo/project-m/src/workers/azdo_proxy/tmp/
