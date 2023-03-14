# dn_sketchingenhanced-measurement

This bundle adds a measurement functionality to the dn_sketchingenhanced bundle.

**Requirement: map.apps 4.12.0**

## Usage

1. Install the vue-color bundle: https://github.com/conterra/mapapps-vue-color
2. Add the dn_sketchingenhanced bundle to your app.
3. Add the dn_sketchingenhanced-measurement bundle to your app.

## Configuration Reference

### Generals settings

To configure the bundle in app.json, use the configurable properties shown in the following example and their default values:

```json
"dn_sketchingenhanced-measurement": {
    "Config": {
        "measurementEnabled": true,
        "lineMeasurementForPolylinesEnabled": true,
        "angleMeasurementForPolylinesEnabled": true,
        "totalLengthMeasurementForPolylinesEnabled": true,
        "lineMeasurementForPolygonsEnabled": true,
        "angleMeasurementForPolygonsEnabled": true,
        "areaMeasurementForPolygonsEnabled": true,
        "circumferenceMeasurementForPolygonsEnabled": true,
        "pointCoordSpatialReference": {
            "wkid": 3857
        },
        "pointCoordPlaces": 3,
        "pointCoordUnitSymbolX": "",
        "pointCoordUnitSymbolY": "",
        "lengthUnit": "auto",
        "areaUnit": "auto",
        "angleUnit": "degrees",
        "lengthUnits": [
            {
                "name": "auto",
                "title": "${ui.units.auto}"
            },
            {
                "name": "meters",
                "abbreviation": "m",
                "title": "${ui.units.meters}",
                "decimalPlaces": 2
            },
            {
                "name": "kilometers",
                "abbreviation": "km",
                "title": "${ui.units.kilometers}",
                "decimalPlaces": 2
            }
        ],
        "areaUnits": [
            {
                "name": "auto",
                "title": "${ui.units.auto}"
            },
            {
                "name": "square-meters",
                "abbreviation": "m²",
                "title": "${ui.units.square-meters}",
                "decimalPlaces": 2
            },
            {
                "name": "square-kilometers",
                "abbreviation": "km²",
                "title": "${ui.units.square-kilometers}",
                "decimalPlaces": 2
            },
            {
                "name": "hectares",
                "abbreviation": "ha",
                "title": "${ui.units.hectares}",
                "decimalPlaces": 2
            }
        ],
        "angleUnits": [
            {
                "name": "degrees",
                "abbreviation": "°",
                "title": "${ui.units.degrees}",
                "decimalPlaces": 0
            },
            {
                "name": "gon",
                "abbreviation": "gon",
                "title": "${ui.units.gon}",
                "decimalPlaces": 0
            }
        ],
        "textSymbol": {
            "type": "text",
            "color": {
                "r": 50,
                "g": 50,
                "b": 50,
                "a": 1
            },
            "font": {
                "size": 12,
                "family": "sans-serif",
                "weight": "normal"
            },
            "haloColor": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 1
            },
            "haloSize": 2,
            "horizontalAlignment": "center",
            "verticalAlignment": "baseline"
        }
    }
}
```

| Property                                   | Type    | Possible Values                                                                            | Default         | Description                                                                              |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------- |
| measurementEnabled                         | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable measurement.                                                              |
| lineMeasurementForPolylinesEnabled         | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable length measurement for every line of polylines.                           |
| angleMeasurementForPolylinesEnabled        | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable angle measurement for polylines.                                          |
| totalLengthMeasurementForPolylinesEnabled  | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable total length measurement for polylines.                                   |
| lineMeasurementForPolygonsEnabled          | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable length measurement for every line of polygons.                            |
| angleMeasurementForPolygonsEnabled         | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable angle measurement for polygons.                                           |
| areaMeasurementForPolygonsEnabled          | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable area measurement for polygons.                                            |
| circumferenceMeasurementForPolygonsEnabled | Boolean | ```true``` &#124; ```false```                                                              | ```true```      | Initial enable circumference measurement for polygons.                                   |
| pointCoordSpatialReference                 | Object  |                                                                                            | ```undefined``` | Spatial reference used for coordinate measurements.                                      |
| pointCoordPlaces                           | Number  |                                                                                            | ```3```         | Number of coordinate measurement decimal places.                                         |
| pointCoordUnitSymbolX                      | String  |                                                                                            |                 | Unit shown for x values of coordiantes.                                                  |
| pointCoordUnitSymbolY                      | String  |                                                                                            |                 | Unit shown for y values of coordiantes.                                                  |
| lengthUnit                                 | String  | ```auto``` &#124; ```square-meters``` &#124; ```square-kilometers``` &#124; ```hectares``` | ```auto```      | Initial selected lengthUnit.                                                             |
| areaUnit                                   | String  | ```auto``` &#124; ```meters``` &#124; ```kilometers```                                     | ```auto```      | Initial selected areaUnit.                                                               |
| angleUnit                                  | String  | ```degrees``` &#124; ```gon```                                                             | ```degrees```   | Initial selected angleUnit.                                                              |
| lengthUnits                                | Array   |                                                                                            |                 | The list of available length units.                                                      |
| areaUnits                                  | Array   |                                                                                            |                 | The list of available area units.                                                        |
| angleUnits                                 | Array   |                                                                                            |                 | The list of available angle units.                                                       |
| textSymbol                                 | Object  |                                                                                            |                 | A TextSymbol used for representing the measurement text geometries that are being drawn. |
