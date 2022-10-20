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

import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import Binding from "apprt-binding/Binding";

export default class SketchingEnhancedController {

    private readonly sketchViewModel: SketchViewModel;
    private readonly sketchingEnhancedModel: typeof SketchingEnhancedModel;
    private snappingBinding: any;

    constructor(sketchViewModel: SketchViewModel, sketchingEnhancedModel: typeof SketchingEnhancedModel) {
        this.sketchViewModel = sketchViewModel;
        this.sketchingEnhancedModel = sketchingEnhancedModel;
    }

    activateTool(tool: string): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        switch (tool) {
            case "point":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.pointSymbol;
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "point";
                sketchingEnhancedModel.activeTool = "point";
                break;
            case "polyline":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polyline", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline";
                break;
            case "polyline_freehand":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polyline", {mode: "freehand"});
                sketchingEnhancedModel.activeUi = "polyline";
                sketchingEnhancedModel.activeTool = "polyline_freehand";
                break;
            case "polygon":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polygon", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "polygon";
                break;
            case "polygon_freehand":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polygon", {mode: "freehand"});
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "polygon_freehand";
                break;
            case "circle":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("circle");
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "circle";
                break;
            case "rectangle":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("rectangle");
                sketchingEnhancedModel.activeUi = "polygon";
                sketchingEnhancedModel.activeTool = "rectangle";
                break;
            case "text":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.textSymbol;
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "text";
                sketchingEnhancedModel.activeTool = "text";
                break;
        }
    }

    activateEdit(): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.cancel();
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.activeUi = "edit";
    }

    showSettings(): void {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.activeUi = "settings";
    }

    watchForSketchingEnhancedModelEvents(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;

        sketchingEnhancedModel.watch("activeUi", (event) => {
            // enable updateOnGraphicClick if activeUi equals edit
            sketchViewModel.updateOnGraphicClick = event.value === "edit";
        });

        sketchingEnhancedModel.watch("pointSymbol", (event) => {
            sketchViewModel.pointSymbol = event.value;
        });

        sketchingEnhancedModel.watch("polylineSymbol", (event) => {
            sketchViewModel.polylineSymbol = event.value;
        });

        sketchingEnhancedModel.watch("polygonSymbol", (event) => {
            sketchViewModel.polygonSymbol = event.value;
        });

        sketchingEnhancedModel.watch("textSymbol", (event) => {
            sketchViewModel.pointSymbol = event.value;
        });
    }

    watchForSketchViewModelEvents(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;

        sketchViewModel.on("create", (event) => {
            this.refreshUndoRedo();
            // enable sketching tool again after complete
            if (event.state === "complete") {
                const activeTool = sketchingEnhancedModel.activeTool;
                this.activateTool(activeTool);
            }
        });

        sketchViewModel.on("delete", () => {
            this.refreshUndoRedo();
        });

        sketchViewModel.on("update", () => {
            this.refreshUndoRedo();
        });

        sketchViewModel.on("undo", () => {
            this.refreshUndoRedo();
        });

        sketchViewModel.on("redo", () => {
            this.refreshUndoRedo();
        });
    }

    createSnappingBinding(): void {
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;
        const snappingOptions = sketchViewModel.snappingOptions;
        const getSnappingFeatureSources = (featureSources) => {
            return featureSources.toArray().map((featureSource) => {
                return {
                    id: featureSource.layer.uid,
                    title: featureSource.layer.title,
                    enabled: featureSource.enabled
                };
            });
        };

        snappingOptions.featureSources.on("change", () => {
            snappingOptions.featureSources.forEach((featureSource) => {
                featureSource.watch("enabled", (enabled) => {
                    sketchingEnhancedModel.snappingFeatureSources = getSnappingFeatureSources(snappingOptions.featureSources);
                });
            });
            sketchingEnhancedModel.snappingFeatureSources = getSnappingFeatureSources(snappingOptions.featureSources);
        });
        this.snappingBinding = Binding.for(sketchViewModel.snappingOptions, sketchingEnhancedModel)
            .sync("enabled", "snappingEnabled")
            .sync("featureEnabled", "snappingFeatureEnabled")
            .sync("selfEnabled", "snappingSelfEnabled")
            .enable();
    }

    changeFeatureSource(id): void {
        const sketchViewModel = this.sketchViewModel;
        sketchViewModel.snappingOptions.featureSources.forEach((snappingFeatureSource) => {
            if (snappingFeatureSource.layer.uid === id) {
                snappingFeatureSource.enabled = !snappingFeatureSource.enabled;
            }
        });
    }

    refreshUndoRedo(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.canUndo = sketchViewModel.canUndo();
        sketchingEnhancedModel.canRedo = sketchViewModel.canRedo();
    }

}
