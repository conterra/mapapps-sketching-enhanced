///
/// Copyright (C) 2022 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import SketchingEnhancedModel from "./SketchingEnhancedModel";
import Binding, { Bindable, WatchHandle } from "apprt-binding/Binding";
import type { InjectedReference } from "apprt-core/InjectedReference";
import { createObservers } from "apprt-core/Observers";
import Collection from "esri/core/Collection";
import MapWidgetModel from "map-widget/MapWidgetModel";
import async from "apprt-core/async";

export default class SketchingEnhancedController {

    private readonly sketchViewModel: __esri.SketchViewModel;
    private readonly sketchingEnhancedModel: typeof SketchingEnhancedModel;
    private readonly mapWidgetModel: InjectedReference<MapWidgetModel>;
    private layersWatcher: WatchHandle;
    private scaleWatcher: WatchHandle;
    private observers = createObservers();
    private editObservers = createObservers();
    private snappingSourceObservers = createObservers();
    private layerVisibilityObservers: any;

    constructor(sketchViewModel: __esri.SketchViewModel, sketchingEnhancedModel: typeof SketchingEnhancedModel,
        mapWidgetModel: any) {
        this.sketchViewModel = sketchViewModel;
        this.sketchingEnhancedModel = sketchingEnhancedModel;
        this.mapWidgetModel = mapWidgetModel;
    }

    activateTool(tool: string): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        let arrowSymbol;
        this.deactivateEdit();
        switch (tool) {
            case "point":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.pointSymbol;
                sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "point";
                sketchingEnhancedModel.activeTool = "point";
                break;
            case "polyline":
                sketchViewModel.polylineSymbol = sketchingEnhancedModel.polylineSymbol;
                sketchViewModel.create("polyline", { mode: "click" });
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline";
                break;
            case "polyline_freehand":
                sketchViewModel.polylineSymbol = sketchingEnhancedModel.polylineSymbol;
                sketchViewModel.create("polyline", { mode: "freehand" });
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline_freehand";
                break;
            case "polygon":
                sketchViewModel.create("polygon", { mode: "click" });
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "polygon";
                break;
            case "polygon_freehand":
                sketchViewModel.create("polygon", { mode: "freehand" });
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "polygon_freehand";
                break;
            case "circle":
                sketchViewModel.create("circle");
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "circle";
                break;
            case "rectangle":
                sketchViewModel.create("rectangle");
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "rectangle";
                break;
            case "text":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.textSymbol;
                sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "text";
                sketchingEnhancedModel.activeTool = "text";
                break;
            case "arrow":
                arrowSymbol = sketchingEnhancedModel.arrowSymbol;
                sketchViewModel.polylineSymbol = this.getArrowCimSymbol(arrowSymbol.color, arrowSymbol.width,arrowSymbol.boldWidth);
                sketchViewModel.create("polyline");
                sketchingEnhancedModel.activeUi = "arrow";
                sketchingEnhancedModel.activeTool = "arrow";
                break;
            default:
                sketchingEnhancedModel.activeUi = undefined;
                sketchingEnhancedModel.activeTool = undefined;
        }
    }

    activateEdit(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.cancel();
        sketchViewModel.updateOnGraphicClick = true;
        sketchViewModel.view.popup.autoOpenEnabled = false;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.activeTool = null;
        sketchingEnhancedModel.editEnabled = true;

        this.editObservers.add(sketchingEnhancedModel.watch("editSymbol", ({ value: editSymbol }) => {
            sketchViewModel.updateGraphics.forEach((graphic) => {
                if (graphic.symbol.type === editSymbol.type) {
                    if (graphic.symbol.type === "cim") {
                        graphic.symbol = this.getArrowCimSymbol(editSymbol.color, editSymbol.width, editSymbol.boldWidth);
                        debugger
                    } else {
                        graphic.symbol = editSymbol;
                    }
                }
            });
        }));

        this.editObservers.add(sketchViewModel.on("update", (event) => {
            const graphic = event.graphics.length ? event.graphics[0] : null;
            if (graphic) {
                sketchingEnhancedModel.editSymbol = this.getEasyArrowSymbol(graphic.symbol);
                switch (graphic.geometry.type) {
                    case "point":
                        if (graphic.symbol.text) {
                            sketchingEnhancedModel.activeUi = "text";
                        } else {
                            sketchingEnhancedModel.activeUi = "point";
                        }
                        break;
                    case "polyline":
                        //graphic.symbol.arrow
                        if (graphic.symbol.type == "cim") {
                            sketchingEnhancedModel.activeUi = "arrow";
                        } else {
                            sketchingEnhancedModel.activeUi = "polyline";
                        }
                        break;
                    case "polygon":
                        sketchingEnhancedModel.activeUi = "polygon";
                        break;
                    default:
                        sketchingEnhancedModel.activeUi = "point";
                }
            }

        }));
    }

    private deactivateEdit(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.updateOnGraphicClick = false;
        if (sketchViewModel.view) {
            sketchViewModel.view.popup.autoOpenEnabled = true;
        }
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.editEnabled = false;
        sketchingEnhancedModel.editSymbol = undefined;
        this.editObservers.destroy();
    }

    deleteGraphic(): void {
        this.sketchingEnhancedModel.deleteClicked = true;
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.delete();
    }

    deleteAllGraphics(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.layer.removeAll();
    }

    cancelSketching(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.cancel();
        this.deactivateEdit();
    }

    createWatchers(): void {
        this.layerVisibilityObservers = this.watchForLayerVisibility();
        this.layersWatcher = this.watchForChangedLayers();
        this.scaleWatcher = this.watchForChangedScale();
        this.watchForSketchingEnhancedModelEvents();
        this.watchForSketchViewModelEvents();
    }

    removeWatchers(): void {
        this.layerVisibilityObservers.destroy();
        this.layersWatcher.remove();
        this.layersWatcher = undefined;
        this.scaleWatcher.remove();
        this.scaleWatcher = undefined;
    }

    private watchForSketchingEnhancedModelEvents(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;

        this.observers.add(sketchingEnhancedModel.watch("pointSymbol", (event) => {
            sketchViewModel.pointSymbol = event.value;
        }));

        this.observers.add(sketchingEnhancedModel.watch("polylineSymbol", (event) => {
            sketchViewModel.polylineSymbol = event.value;
        }));

        this.observers.add(sketchingEnhancedModel.watch("polygonSymbol", (event) => {
            sketchViewModel.polygonSymbol = event.value;
        }));

        this.observers.add(sketchingEnhancedModel.watch("textSymbol", (event) => {
            sketchViewModel.pointSymbol = event.value;
        }));

        this.observers.add(sketchingEnhancedModel.watch("arrowSymbol", (event) => {
            sketchViewModel.polylineSymbol = this.getArrowCimSymbol(event.value.color, event.value.width, event.value.boldWidth);
        }));
    }

    private watchForSketchViewModelEvents(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;

        this.observers.add(sketchViewModel.on("create", (event) => {
            this.refreshUndoRedo();
            // enable sketching tool again after complete
            if (event.state === "complete") {
                const activeTool = sketchingEnhancedModel.activeTool;
                this.activateTool(activeTool);
            }
        }));

        this.observers.add(sketchViewModel.on("delete", () => {
            this.refreshUndoRedo();
            async(() => {
                this.sketchingEnhancedModel.deleteClicked = false;
            }, 100);
        }));

        this.observers.add(sketchViewModel.on("update", (evt) => {
            if (evt.state === "start") {
                sketchingEnhancedModel.canDelete = true;
            } else if (evt.state === "complete") {
                sketchingEnhancedModel.canDelete = false;
            }
            this.refreshUndoRedo();
        }));

        this.observers.add(sketchViewModel.on("undo", () => {
            this.refreshUndoRedo();
        }));

        this.observers.add(sketchViewModel.on("redo", () => {
            this.refreshUndoRedo();
        }));
    }

    private watchForLayerVisibility(): any {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        const observers = createObservers();
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;
        layers.forEach((layer) => {
            observers.add(
                layer.watch("visible", () => {
                    sketchingEnhancedModel.snappingFeatureSources
                        = this.getSnappingFeatureSources(snappingOptions.featureSources);
                })
            );
        });
        return observers;
    }

    private watchForChangedLayers(): WatchHandle {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        return layers.on("change", ({ added, removed }) => {
            this.changeSnappingFeatureSources(added, removed);
        });
    }

    private watchForChangedScale(): WatchHandle {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;
        const mapWidgetModel = this.mapWidgetModel;
        const snappingOptions = sketchViewModel.snappingOptions;
        return mapWidgetModel.watch("scale", () => {
            sketchingEnhancedModel.snappingFeatureSources
                = this.getSnappingFeatureSources(snappingOptions.featureSources);
        });
    }

    addSnappingFeatureSources(): void {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        this.changeSnappingFeatureSources(layers, new Collection());
    }

    removeSnappingFeatureSources(): void {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        this.changeSnappingFeatureSources(new Collection(), layers);
    }

    createSnappingBinding(): Binding {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;

        return Binding.for(sketchViewModel.snappingOptions as Bindable, sketchingEnhancedModel)
            .sync("enabled", "snappingEnabled")
            .sync("featureEnabled", "snappingFeatureEnabled")
            .sync("selfEnabled", "snappingSelfEnabled");
    }

    createSnappingFeatureSourcesWatcher(): WatchHandle {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;
        sketchingEnhancedModel.snappingFeatureSources =
            this.getSnappingFeatureSources(snappingOptions.featureSources);

        return snappingOptions.featureSources.on("change", () => {
            this.snappingSourceObservers.destroy();
            snappingOptions.featureSources.forEach((featureSource) => {
                this.snappingSourceObservers.add(featureSource.watch("enabled", () => {
                    sketchingEnhancedModel.snappingFeatureSources
                        = this.getSnappingFeatureSources(snappingOptions.featureSources);
                }));
            });
            sketchingEnhancedModel.snappingFeatureSources =
                this.getSnappingFeatureSources(snappingOptions.featureSources);
        });
    }

    private getSnappingFeatureSources(featureSources: __esri.Collection): any {
        return featureSources.toArray().map((featureSource) => {
            const isVisibleInHierarchy = this.isVisibleInHierarchy(featureSource.layer);
            const isVisibleAtScale = this.isVisibleAtScale(featureSource.layer);
            return {
                id: featureSource.layer.uid,
                title: featureSource.layer.title,
                enabled: featureSource.enabled,
                isVisibleInHierarchy: isVisibleInHierarchy,
                isVisibleAtScale: isVisibleAtScale
            };
        });
    }

    changeSnappingFeatureSource(id: string): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.snappingOptions.featureSources.forEach((snappingFeatureSource) => {
            if (snappingFeatureSource.layer.uid === id) {
                snappingFeatureSource.enabled = !snappingFeatureSource.enabled;
            }
        });
    }

    private changeSnappingFeatureSources(added: __esri.Collection, removed: __esri.Collection) {
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;

        const contained = (featureSources, layer) =>
            featureSources.find((featureSource) => featureSource.layer === layer);

        added.forEach((layer) => {
            if (this.isSnappableLayer(layer) && !contained(snappingOptions.featureSources, layer)) {
                snappingOptions.featureSources.push(
                    {
                    layer: layer,
                    enabled: true
                }
                );
            }
        });
        removed.forEach((layer: __esri.Layer) => {
            const snappingFeatureSource = contained(snappingOptions.featureSources, layer);
            if (this.isSnappableLayer(layer) && contained(snappingOptions.featureSources, layer)) {
                snappingOptions.featureSources.remove(snappingFeatureSource);
            }
        });
    }

    private isSnappableLayer(layer: __esri.Layer): boolean {
        const hasSupportedLayerType = layer.type === "feature" || layer.type === "graphics"
            || layer.type === "geojson" || layer.type === "wfs" || layer.type === "csv";
        const isNotInternalLayer = !layer.internal;
        let snappingAllowed = true;
        if (layer.sketchingEnhanced) {
            snappingAllowed = layer.sketchingEnhanced.allowSnapping;
        }
        return hasSupportedLayerType && isNotInternalLayer && snappingAllowed;
    }

    private isVisibleAtScale(layer: __esri.Layer): boolean {
        const mapWidgetModel = this.mapWidgetModel;
        const scale = mapWidgetModel.scale;
        const minScale = layer.minScale || 0;
        const maxScale = layer.maxScale || 0;
        if (minScale === 0 && maxScale === 0) {
            return true;
        }
        return scale >= maxScale && (minScale !== 0 ? scale <= minScale : true);
    }

    private isVisibleInHierarchy(layer: __esri.Layer): boolean {
        if (!layer.visible) return false;
        const parentLayer = layer.parent;
        if (parentLayer && parentLayer.declaredClass !== "esri.Map") {
            return this.isVisibleInHierarchy(parentLayer);
        }
        return layer.visible;
    }

    private refreshUndoRedo(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.canUndo = sketchViewModel.canUndo();
        sketchingEnhancedModel.canRedo = sketchViewModel.canRedo();
    }
//https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols.html
    private getArrowCimSymbol(color:Array<Object>, width:number,boldWidth:number): __esri.CIMSymbol {
        return {
            "type": "cim",
            "data": {
                "type": "CIMSymbolReference",
                "enable":true,
                "symbol": {
                    "type": "CIMLineSymbol",
                    "symbolLayers": [
                        {
                            "type": "CIMSolidStroke",
                            "effects": [
                                {
                                    "type": "CIMGeometricEffectArrow",
                                    "geometricEffectArrowType": "Block",
                                    "width": width
                                }
                            ],
                            "width":boldWidth,
                            "color": [color.r, color.g, color.b, color.a * 255]
                        }
                    ]
                }
            }
        };
    }

    private getEasyArrowSymbol(cimSymbol: __esri.Symbol): any {
        const color = cimSymbol.data.symbol.symbolLayers[0].color;
        return {
            type: "cim",
            color: {
                r: color[0],
                g: color[1],
                b: color[2],
                a: color[3] / 255
            },
            width: cimSymbol.data.symbol.symbolLayers[0].effects[0].width,
            boldWidth: cimSymbol.data.symbol.symbolLayers[0].width
        };
    }
}
