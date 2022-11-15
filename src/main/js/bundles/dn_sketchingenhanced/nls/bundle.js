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
                pointSymbolStyle: "Style",
                pointSymbolStyles: {
                    circle: "Circle",
                    cross: "Cross",
                    diamond: "Diamond",
                    square: "Square",
                    triangle: "Triangle",
                    x: "X"
                },
                pointSymbolSize: "Size",
                pointSymbolColor: "Color",
                pointSymbolOutlineWidth: "Outline-Width",
                pointSymbolOutlineColor: "Outline-Color",
                polylineSymbolStyle: "Stil",
                polylineSymbolStyles: {
                    dash: "Dash",
                    dashDot: "Dash-Dot",
                    dot: "Dot",
                    longDash: "Long-Dash",
                    longDashDot: "Long-Dash-Dot",
                    longDashDotDot: "Long-Dash-Dot-Dot",
                    none: "None",
                    shortDash: "Short-Dash",
                    shortDashDot: "Short-Dash-Dot",
                    shortDashDotDot: "Short-Dash-Dot-Dot",
                    shortDot: "Short-Dot",
                    solid: "Solid"
                },
                polylineSymbolWidth: "Width",
                polylineSymbolColor: "Color",
                polygonSymbolStyle: "Style",
                polygonSymbolStyles: {
                    backwardDiagonal: "Backward-Diagonal",
                    cross: "Cross",
                    diagonalCross: "Diagonal-Cross",
                    forwardDiagonal: "Forward-Diagonal",
                    horizontal: "Horizontal",
                    none: "None",
                    solid: "Solid",
                    vertical: "Vertical"
                },
                polygonSymbolColor: "Color",
                polygonSymbolOutlineStyle: "Outline-Style",
                polygonSymbolOutlineWidth: "Outline-Width",
                polygonSymbolOutlineColor: "Outline-Color",
                textSymbolText: "Text",
                textSymbolColor: "Color",
                textSymbolFontSize: "Text size",
                textSymbolPlaceholderText: "Enter text"
            }
        }
    },
    de: true
};
