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
        }
    }
}
```
