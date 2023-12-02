# dn_sketchingenhanced

This bundle adds an extended sketching functionality the map.

**Requirement: map.apps 4.12.0**

## Usage

1. Install the vue-color bundle: https://github.com/conterra/mapapps-vue-color
2. Add the dn_sketchingenhanced bundle to your app.


To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID                           | Component                         | Description              |
| --------------------------------- | --------------------------------- | ------------------------ |
| sketchingEnhancedWidgetToggleTool | SketchingEnhancedWidgetToggleTool | Show or hide the widget. |

## Configuration Reference

### Generals settings

To configure the bundle in app.json, use the configurable properties shown in the following example and their default values:

```json
"dn_sketchingenhanced": {
    "Config": {
        "initialActiveTool": "point",
        "initialGeometryEditMode": "reshape",
        "toggleGeometryEditModeOnClick": true,
        "snappingEnabled": true,
        "snappingSelfEnabled": true,
        "snappingFeatureEnabled": true,
        "snappingGroupLayerId": "snapping_layer",
        "pointSymbol": {
            "type": "simple-marker",
            "style": "circle",
            "size": 10,
            "color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 1
            },
            "outline": {
                "style": "solid",
                "width": 1,
                "color": {
                    "r": 50,
                    "g": 0,
                    "b": 0,
                    "a": 1
                }
            }
        },
        "polylineSymbol": {
            "type": "simple-line",
            "style": "solid",
            "width": 2,
            "color": {
                "r": 50,
                "g": 50,
                "b": 50,
                "a": 1
            }
        },
        "polygonSymbol": {
            "type": "simple-fill",
            "style": "solid",
            "color": {
                "r": 150,
                "g": 150,
                "b": 150,
                "a": 0.2
            },
            "outline": {
                "style": "solid",
                "color": {
                    "r": 50,
                    "g": 50,
                    "b": 50,
                    "a": 1
                },
                "width": 2
            }
        },
        "textSymbol": {
            "type": "text",
            "angle": 0,
            "color": {
                "r": 50,
                "g": 50,
                "b": 50,
                "a": 1
            },
            "font": {
                "size": 9,
                "family": "sans-serif",
                "weight": "normal"
            },
            "horizontalAlignment": "left",
            "verticalAlignment": "baseline"
        },
        "arrowSymbol": {
            "type": "cim",
            "width": 10,
            "boldWidth":4,
            "color": {
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 1
            }
        }
    }
}
```

| Property                      | Type    | Possible Values                                                                                                                                                                  | Default       | Description                                                                                                                     |
| ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| initialActiveTool             | String  | ```point``` &#124; ```polyline``` &#124; ```polyline_freehand``` &#124; ```polygon``` &#124; ```polygon_freehand``` &#124; ```circle``` &#124; ```rectangle``` &#124; ```text``` | ```point```   | Initial active tool.                                                                                                            |
| initialGeometryEditMode       | String  | ```move``` &#124; ```transform```   &#124; ```reshape```                                                                                                                         | ```reshape``` | Name of the update tool.                                                                                                        |
| toggleGeometryEditModeOnClick | Boolean | ```true``` &#124; ```false```                                                                                                                                                    | ```true```    | Indicates if the graphic being updated can be toggled between transform and reshape update options.                             |
| snappingEnabled               | Boolean | ```true``` &#124; ```false```                                                                                                                                                    | ```true```    | Global configuration to turn snapping on or off.                                                                                |
| snappingSelfEnabled           | Boolean | ```true``` &#124; ```false```                                                                                                                                                    | ```true```    | Global configuration option to turn self snapping (within one feature while either drawing or reshaping) on or off.             |
| snappingFeatureEnabled        | Boolean | ```true``` &#124; ```false```                                                                                                                                                    | ```true```    | Global configuration option to turn feature snapping on or off.                                                                 |
| snappingGroupLayerId          | String  |                                                                                                                                                                                  | ```null```    | Define a group layer id to enable some snapping layers if the Sketching Enhanced tool gets started.                             |
| pointSymbol                   | Object  |                                                                                                                                                                                  |               | A SimpleMarkerSymbol, PointSymbol3D, CIMSymbol, or WebStyleSymbol used for representing the point geometry that is being drawn. |
| polylineSymbol                | Object  |                                                                                                                                                                                  |               | A SimpleLineSymbol, LineSymbol3D, or CIMSymbol used for representing the polyline geometry that is being drawn.                 |
| polygonSymbol                 | Object  |                                                                                                                                                                                  |               | A SimpleFillSymbol, PolygonSymbol3D, or CIMSymbol used for representing the polygon geometry that is being drawn.               |
| arrowSymbol                   | Object  |                                                                                                                                                                                  |               | A A CIMSymbol in the form of an arrow showing the drawn arrow                                                                   |

### Disable snapping on specific layers

To disable snapping on layers you need to set _allowSnapping_ to false.

```json
{
    "id": "grenzen_3",
    "title": "Welt",
    "type": "AGS_FEATURE",
    "url": "https://services.conterra.de/arcgis/rest/services/common/grenzen/FeatureServer/3",
    "maxScale": 10000000,
    "sketchingEnhanced": {
        "allowSnapping": false
    }
}
```

### Add group layer that contains snappable layers. The group layer will be enabled if the sketching enhanced tool gets started.

#### 1. Add group layer to map
```json
"map": {
    "layers": [
        {
            "id": "snapping_layer",
            "title": "Snapping Layer",
            "type": "GROUP",
            "listMode": "show",
            "visible": false,
            "layers": [
                {
                    "id": "grenzen_1",
                    "title": "Kreise",
                    "type": "AGS_FEATURE",
                    "url": "https://services.conterra.de/arcgis/rest/services/common/grenzen/FeatureServer/1",
                    "maxScale": 250000,
                    "minScale": 1000000
                },
                {
                    "id": "grenzen_2",
                    "title": "Länder",
                    "type": "AGS_FEATURE",
                    "url": "https://services.conterra.de/arcgis/rest/services/common/grenzen/FeatureServer/2",
                    "maxScale": 1000000,
                    "minScale": 10000000
                }
            ]
        }
    ]
}
```

#### 2. Configure snappingGroupLayerId

```json
"dn_sketchingenhanced": {
    "Config": {
        ...
        "snappingGroupLayerId": "snapping_layer",
        ...
    }
}
```

### Enable measurement functionality

To add measurement functionalities add the dn_sketchingenhanced-measurement bundle to your app.

[dn_sketchingenhanced-measurement Documentation](https://github.com/conterra/mapapps-sketching-enhanced/tree/master/src/main/js/bundles/dn_sketchingenhanced-measurement)

### Hint
Self-generated CIMSymbols are not supported
