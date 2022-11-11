/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = {
    root: {
        bundleName: "Sketching Enhanced",
        bundleDescription: "This bundle adds an extended sketching functionality the map.",
        tool: {
            title: "Sketching Enhanced",
            tooltip: "Sketching Enhanced"
        },
        ui: {
            windowTitle: "Sketching Enhanced",
            graphicsLayerTitle: "Sketching",
            pointTool: "Point",
            polylineTools: "Polylines",
            polylineTool: "Polyline",
            freehandPolylineTool: "Freehand Polyline",
            polygonTools: "Polygons",
            polygonTool: "Polygon",
            freehandPolygonTool: "Freehand Polygon",
            circleTool: "Circle",
            rectangleTool: "Rectangle",
            textTool: "Text",
            editHint: "Click on a graphic in the map to edit it.",
            settings: "Settings",
            snappingSettings: {
                title: "Snapping controls",
                snappingEnabled: "Enable snapping",
                snappingSelfEnabled: "Geometry guides",
                snappingFeatureEnabled: "Feature to feature",
                snappingFeatureSources: "Snapping layers"
            },
            symbolSettings: {
                pointSymbolStyle: "Stil",
                pointSymbolStyles: {
                    circle: "Kreis",
                    cross: "Kreuz",
                    diamond: "Diamant",
                    Quadrat: "Quadrat",
                    Dreieck: "Dreieck",
                    x: "X"
                },
                pointSymbolSize: "Größe",
                pointSymbolColor: "Farbe",
                pointSymbolOutlineWidth: "Umriss-Breite",
                pointSymbolOutlineColor: "Umrisslinie-Farbe",
                polylineSymbolStil: "Stil",
                polylineSymbolStyles: {
                    dash: "Gedankenstrich",
                    dashDot: "Gedankenstrich-Punkt",
                    Punkt: "Punkt",
                    longDash: "Langer Gedankenstrich",
                    longDashDot: "Langer Bindestrich-Punkt",
                    longDashDotDot: "Long-Dash-Dot-Dot",
                    none: "Kein",
                    shortDash: "Kurzer Gedankenstrich",
                    shortDashDot: "Kurzer-Strich-Punkt",
                    shortDashDotDot: "Kurzer-Strich-Punkt-Punkt",
                    shortDot: "Kurzer-Punkt",
                    solid: "Vollton"
                },
                polylineSymbolWidth: "Breite",
                polylineSymbolColor: "Farbe",
                polygonSymbolStil: "Stil",
                polygonSymbolStyles: {
                    backwardDiagonal: "Rückwärts-Diagonal",
                    cross: "Kreuz",
                    diagonalCross: "Diagonal-Kreuz",
                    forwardDiagonal: "Vorwärts-Diagonal",
                    horizontal: "Horizontal",
                    keine: "Keine",
                    solid: "Durchgehend",
                    vertical: "Vertikal"
                },
                polygonSymbolColor: "Farbe",
                polygonSymbolOutlineStyle: "Outline-Stil",
                polygonSymbolOutlineWidth: "Umriss-Breite",
                polygonSymbolOutlineColor: "Umrisslinie-Farbe",
                textSymbolFarbe: "Farbe",
                textSymbolText: "Text",
                textSymbolPlatzhalterText: "Text eingeben"
            }
        }
    },
    de: true
};
