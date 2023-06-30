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
export default {
    bundleName: "Erweitertes Zeichnen",
    bundleDescription: "Dieses Bundle fügt der App erweiterte Zeichenfunktionalität hinzu.",
    tool: {
        title: "Erweitertes Zeichnen",
        tooltip: "Erweitertes Zeichnen"
    },
    ui: {
        windowTitle: "Erweitertes Zeichnen",
        graphicsLayerTitle: "Zeichnungen",
        undo: "Den letzten Zeichenschritt rückgängig machen",
        redo: "Den letzten Zeichenschritt wiederholen",
        cancel: "Die aktuelle Zeichnung abbrechen",
        edit: "Eine Zeichnung zum Editieren auswählen",
        delete: "Die aktuell ausgewählte Zeichnung löschen",
        deleteAll: {
            buttonLabel: "Alle Zeichnungen löschen",
            hint: "Dieser Vorgang löscht alle bisher erstellten Zeichungen. Dieser Vorgang kann nicht rückgängig gemacht werden.",
            attention: "Achtung",
            continue: "Alle Zeichnungen löschen",
            cancel: "Abbrechen"
        },
        pointTool: "Punkt",
        polylineTools: "Linienwerkzeuge",
        polylineTool: "Polylinie",
        arrowTool: "Pfeil",
        freehandPolylineTool: "Freihandlinie",
        polygonTools: "Polygonwerkzeuge",
        polygonTool: "Polygon",
        freehandPolygonTool: "Freihandpolygon",
        circleTool: "Kreis",
        rectangleTool: "Rechteck",
        textTool: "Text",
        editHint: "Klicken Sie auf eine Grafik in der Karte, um diese zu editieren.",
        toolHint: "Wählen Sie ein Zeichentool aus, um mit dem Zeichnen zu beginnen.",
        settings: "Einstellungen",
        tabs: {
            sketching: "Zeichnen",
            snapping: "Fangen",
            construction: "Konstruktion",
            measurement: "Messen"
        },
        snappingSettings: {
            snappingEnabled: "Fangen aktivieren",
            snappingSelfEnabled: "Geometrieführungslinien",
            snappingFeatureEnabled: "Karteninhalte fangen",
            snappingFeatureSources: "Fang-Inhalte",
            isNotVisibleInHierarchyAndScale: "Dieser Layer ist im aktuellen Mapstab nicht sichtbar und im TOC deaktiviert.",
            isNotVisibleInHierarchy: "Dieser Layer ist deaktiviert.",
            isNotVisibleInScale: "Dieser Layer ist im aktuellen Mapstab nicht sichtbar."
        },
        symbolSettings: {
            pointSymbolStyle: "Stil",
            pointSymbolStyles: {
                circle: "Kreis",
                cross: "Kreuz",
                diamond: "Diamant",
                square: "Quadrat",
                triangle: "Dreieck",
                x: "X"
            },
            arrowSymbolWidth: "Breite",
            arrowSymbolBoldWidth: "Linienbreite",
            arrowSymbolColor: "Farbe",
            pointSymbolSize: "Größe",
            pointSymbolColor: "Farbe",
            pointSymbolOutlineWidth: "Umriss-Breite",
            pointSymbolOutlineColor: "Umrisslinie-Farbe",
            polylineSymbolStyle: "Style",
            polylineSymbolStyles: {
                dash: "Gedankenstrich",
                dashDot: "Gedankenstrich-Punkt",
                dot: "Punkt",
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
            polygonSymbolStyle: "Stil",
            polygonSymbolStyles: {
                backwardDiagonal: "Rückwärts-Diagonal",
                cross: "Kreuz",
                diagonalCross: "Diagonal-Kreuz",
                forwardDiagonal: "Vorwärts-Diagonal",
                horizontal: "Horizontal",
                none: "Keine",
                solid: "Durchgehend",
                vertical: "Vertikal"
            },
            polygonSymbolColor: "Farbe",
            polygonSymbolOutlineStyle: "Outline-Stil",
            polygonSymbolOutlineWidth: "Umriss-Breite",
            polygonSymbolOutlineColor: "Umrisslinie-Farbe",
            textSymbolText: "Text",
            textSymbolColor: "Schriftfarbe",
            textSymbolFontSize: "Schriftgröße",
            textSymbolFontWeight: "Schriftgewicht",
            textSymbolFontWeights: {
                normal: "Normal",
                bold: "Fett"
            },
            textSymbolPlaceholderText: "Text eingeben"
        }
    }
};
