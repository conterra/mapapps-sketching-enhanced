This branch contains the new Sketching Enhanced version 3.x. You can find the 2.x version in this branch: https://github.com/conterra/mapapps-sketching-enhanced/tree/2.x

# Sketching Enhanced

This bundle adds an extended sketching functionality the map.

**Requirement: map.apps 4.12.0**

![Screenshot App](https://github.com/conterra/mapapps-sketching-enhanced/blob/master/screenshot.JPG)

## Build status

![example workflow](https://github.com/conterra/mapapps-sketching-enhanced/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_sketching_enhanced/index.html

## Installation Guide

[dn_sketchingenhanced Documentation](https://github.com/conterra/mapapps-sketching-enhanced/tree/master/src/main/js/bundles/dn_sketchingenhanced)

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
