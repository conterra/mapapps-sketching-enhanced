# dn_sketchingenhanced

This bundle adds an extended sketching functionality the map.

**Requirement: map.apps 4.12.0**

## Usage

1. Install the vue-color bundle: https://github.com/conterra/mapapps-vue-color
2. Add the dn_sketchingenhanced bundle to your app.


To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID                           | Component                         | Description              |
|-----------------------------------|-----------------------------------|--------------------------|
| sketchingEnhancedWidgetToggleTool | SketchingEnhancedWidgetToggleTool | Show or hide the widget. |

## Configuration Reference

Um das Bundle in der app.json zu konfigurieren, verwenden Sie die konfigurierbaren, im folgenden Beispiel gezeigten Eigenschaften und ihre Default-Werte:

```json
"dn_sketchingenhanced": {
    "Config": {
        "initialActiveTool": "point",
        "initialGeometryEditMode": "reshape",
        "toggleGeometryEditModeOnClick": true,
        "snappingEnabled": true,
        "snappingSelfEnabled": true,
        "snappingFeatureEnabled": true,
        "pointSymbol": {
            "type": "simple-marker",
            "style": "circle",
            "size": 6,
            "color": [255, 255, 255, 1],
            "outline": {
                "style": "solid",
                "width": 1,
                "color": [50, 0, 0, 1]
            }
        },
        "polylineSymbol": {
            "type": "simple-line",
            "style": "solid",
            "width": 2,
            "color": [50, 50, 50, 1]
        },
        "polygonSymbol": {
            "type": "simple-fill",
            "style": "solid",
            "color": [150, 150, 150, 0.2],
            "outline": {
                "style": "solid",
                "color": [50, 50, 50, 1],
                "width": 2
            }
        },
        "textSymbol": {
            "type": "text",
            "color": [50, 50, 50, 1],
            "font": {
                "size": 9,
                "family": "sans-serif"
            },
            "horizontalAlignment": "left",
            "verticalAlignment": "baseline"
        }
    }
}
```
