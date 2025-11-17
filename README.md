![example workflow](https://github.com/conterra/mapapps-sketching-enhanced/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)
![Static Badge](https://img.shields.io/badge/requires_map.apps-4.20.0-e5e5e5?labelColor=%233E464F&logoColor=%23e5e5e5)
![Static Badge](https://img.shields.io/badge/tested_for_map.apps-4.20.0-%20?labelColor=%233E464F&color=%232FC050)

This branch contains the new Sketching Enhanced version 3.x. You can find the 2.x version in this branch: https://github.com/conterra/mapapps-sketching-enhanced/tree/2.x

# Sketching Enhanced

This bundle adds an extended sketching functionality to the map.

![Screenshot App](https://github.com/conterra/mapapps-sketching-enhanced/blob/main/screenshot.png)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/public_demo_sketchingenhanced/index.html

## Installation Guide

[dn_sketchingenhanced Documentation](https://github.com/conterra/mapapps-sketching-enhanced/tree/master/src/main/js/bundles/dn_sketchingenhanced)

[dn_sketchingenhanced-measurement Documentation](https://github.com/conterra/mapapps-sketching-enhanced/tree/master/src/main/js/bundles/dn_sketchingenhanced-measurement)

[dn_sketchingenhanced-construction Documentation](https://github.com/conterra/mapapps-sketching-enhanced/tree/master/src/main/js/bundles/dn_sketchingenhanced-construction)

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
