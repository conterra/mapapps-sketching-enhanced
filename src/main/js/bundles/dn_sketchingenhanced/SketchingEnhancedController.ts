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
import MeasurementController from "./measurement/MeasurementController";
import Binding, { WatchHandle } from "apprt-binding/Binding";
import type { InjectedReference } from "apprt-core/InjectedReference";
import { createObservers } from "apprt-core/Observers";
import Collection from "esri/core/Collection";
import Layer from "esri/layers/Layer";

export default class SketchingEnhancedController {

    private readonly sketchViewModel: __esri.SketchViewModel;
    private readonly sketchingEnhancedModel: typeof SketchingEnhancedModel;
    private readonly mapWidgetModel: InjectedReference<any>;
    private measurementController: MeasurementController;
    private layersWatcher: WatchHandle;
    private scaleWatcher: WatchHandle;
    private scaleWatcher: WatchHandle;
    private observers = createObservers();
    private editObservers = createObservers();
    private layerVisibilityObservers: any;

    constructor(sketchViewModel: __esri.SketchViewModel, sketchingEnhancedModel: typeof SketchingEnhancedModel,
        mapWidgetModel: any, graphicsLayer: __esri.GraphicsLayer) {
        this.sketchViewModel = sketchViewModel;
        this.sketchingEnhancedModel = sketchingEnhancedModel;
        this.mapWidgetModel = mapWidgetModel;
        this.measurementController = new MeasurementController(sketchViewModel, sketchingEnhancedModel, graphicsLayer);
    }

    activateTool(tool: string): void {
        // TODO: Add enable ui for measurem
        this.measurementController.activateMeasuring();
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        this.deactivateEdit();
        switch (tool) {
            case "point":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.pointSymbol;
                sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "point";
                sketchingEnhancedModel.activeTool = "point";
                break;
            case "polyline":
                sketchViewModel.create("polyline", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline";
                break;
            case "polyline_freehand":
                sketchViewModel.create("polyline", {mode: "freehand"});
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline_freehand";
                break;
            case "polygon":
                sketchViewModel.create("polygon", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "polygon";
                break;
            case "polygon_freehand":
                sketchViewModel.create("polygon", {mode: "freehand"});
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
                if(graphic.symbol.type === editSymbol.type) {
                    graphic.symbol = editSymbol;
                }
            });
        }));

        this.editObservers.add(sketchViewModel.on("update", (event) => {
            const graphic = event.graphics.length ? event.graphics[0] : null;
            if(graphic) {
                sketchingEnhancedModel.editSymbol = graphic.symbol;
                switch(graphic.geometry.type) {
                    case "point":
                        if(graphic.symbol.text) {
                            sketchingEnhancedModel.activeUi = "text";
                        } else {
                            sketchingEnhancedModel.activeUi = "point";
                        }
                        break;
                    case "polyline":
                        sketchingEnhancedModel.activeUi = "polyline";
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

    deactivateEdit(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.updateOnGraphicClick = false;
        sketchViewModel.view.popup.autoOpenEnabled = true;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.editEnabled = false;
        sketchingEnhancedModel.editSymbol = undefined;
        this.editObservers.destroy();
    }

    deleteGraphic(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.delete();
    }

    cancelSketching(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.cancel();
        this.deactivateEdit();
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        this.activateTool(sketchingEnhancedModel.activeTool);
    }

    createWatchers(): void {
        this.layerVisibilityObservers = this.watchForLayerVisibility();
        this.layersWatcher = this.watchForChangedLayers();
        this.scaleWatcher = this.watchForChangedScale();
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
        this.scaleWatcher.remove();
        this.scaleWatcher = undefined;
    }

    watchForSketchingEnhancedModelEvents(): void {
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
    }

    watchForSketchViewModelEvents(): void {
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

    watchForLayerVisibility(): any {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        const observers = createObservers();
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;
        layers.forEach((layer)=>{
            observers.add(
                layer.watch("visible", () => {
                    sketchingEnhancedModel.snappingFeatureSources
                        = this.getSnappingFeatureSources(snappingOptions.featureSources);
                })
            );
        });
        return observers;
    }

    watchForChangedLayers(): WatchHandle {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        return layers.on("change", ({added, removed}) => {
            this.changeSnappingFeatureSources(added, removed);
        });
    }

    watchForChangedScale(): WatchHandle {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        return mapWidgetModel.watch("scale", () => {
            this.changeSnappingFeatureSources(layers, []);
        });
    }

    watchForChangedScale(): WatchHandle {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        return mapWidgetModel.watch("scale", () => {
            this.changeSnappingFeatureSources(layers, []);
        });
    }

    addSnappingFeatureSources(): void {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        this.changeSnappingFeatureSources(layers, []);
    }

    removeSnappingFeatureSources(): void {
        const mapWidgetModel = this.mapWidgetModel;
        const map = mapWidgetModel.map;
        const layers = map.allLayers;
        this.changeSnappingFeatureSources([], layers);
    }

    createSnappingBinding(): Binding {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;

        snappingOptions.featureSources.on("change", () => {
            snappingOptions.featureSources.forEach((featureSource) => {
                featureSource.watch("enabled", () => {
                    sketchingEnhancedModel.snappingFeatureSources
                        = this.getSnappingFeatureSources(snappingOptions.featureSources);
                });
            });
            sketchingEnhancedModel.snappingFeatureSources =
                this.getSnappingFeatureSources(snappingOptions.featureSources);
        });

        return Binding.for(sketchViewModel.snappingOptions, sketchingEnhancedModel)
            .sync("enabled", "snappingEnabled")
            .sync("featureEnabled", "snappingFeatureEnabled")
            .sync("selfEnabled", "snappingSelfEnabled");
    }

    isVisibleInHierarchy(layer: __esri.Layer): boolean {
        if (!layer.visible) return false;
        const parentLayer = layer.parent;
        if (parentLayer && parentLayer.declaredClass !== "esri.Map") {
            return this.isVisibleInHierarchy(parentLayer);
        }
        return layer.visible;
    }

    getSnappingFeatureSources(featureSources: Collection): any {
        return featureSources.toArray().map((featureSource) => {
            const isVisibleInHierarchy = this.isVisibleInHierarchy(featureSource.layer);
            const isVisibleAtScale = this.isVisibleAtScale(featureSource.layer);
            return {
                id: featureSource.layer.uid,
                title: featureSource.layer.title,
                // show the feature source as disabled if the layer is not visible in hierarchy
                // because snapping does not work for disabled layers
                enabled: isVisibleInHierarchy ? featureSource.enabled : false,
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
                snappingOptions.featureSources.push({
                    layer: layer, enabled: true
                });
            }
        });
        removed.forEach((layer: __esri.Layer) => {
            const snappingFeatureSource = contained(snappingOptions.featureSources, layer);
            if (this.isSnappableLayer(layer) && contained(snappingOptions.featureSources, layer)) {
                snappingOptions.featureSources.remove(snappingFeatureSource);
            }
        });

        snappingOptions.featureSources.forEach((featureSource)=>{
            const layer = featureSource.layer;
            // disable feature source if layer is not visible at scale to prevent query of all features
            featureSource.enabled = this.isVisibleAtScale(layer);
        });

        snappingOptions.featureSources.forEach((featureSource)=>{
            const layer = featureSource.layer;
            // disable feature source if layer is not visible at scale to prevent query of all features
            featureSource.enabled = this.isVisibleAtScale(layer);
        });
    }

    private isSnappableLayer(layer: __esri.Layer): boolean {
        return (layer.type === "feature" || layer.type === "graphics"
            || layer.type === "geojson" || layer.type === "wfs" || layer.type === "csv") && !layer.internal;
    }

    private isVisibleAtScale(layer) {
        const mapWidgetModel = this.mapWidgetModel;
        const scale = mapWidgetModel.scale;
        const minScale = layer.minScale || 0;
        const maxScale = layer.maxScale || 0;
        if (minScale === 0 && maxScale === 0) {
            return true;
        }
        return scale >= maxScale && (minScale !== 0 ? scale <= minScale : true);
    }

    private refreshUndoRedo(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.canUndo = sketchViewModel.canUndo();
        sketchingEnhancedModel.canRedo = sketchViewModel.canRedo();
    }

}
