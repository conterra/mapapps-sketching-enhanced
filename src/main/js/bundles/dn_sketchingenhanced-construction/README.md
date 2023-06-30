# dn_sketchingenhanced-construction

This bundle adds a construction functionality to the dn_sketchingenhanced bundle.

**Requirement: map.apps 4.12.0**

## Usage

1. Install the vue-color bundle: https://github.com/conterra/mapapps-vue-color
2. Add the dn_sketchingenhanced bundle to your app.
3. Add the dn_sketchingenhanced-construction bundle to your app.

## Configuration Reference

### Generals settings

To configure the bundle in app.json, use the configurable properties shown in the following example and their default values:

```json
"dn_sketchingenhanced-construction": {
    "Config": {
        "radius": 100,
        "length": 100
    }
}
```

| Property | Type   | Possible Values | Default   | Description                                         |
| -------- | ------ | --------------- | --------- | --------------------------------------------------- |
| radius   | Number |                 | ```100``` | Default radius in meters for circle construction.   |
| length   | Number |                 | ```100``` | Default length in meters for polyline construction. |
