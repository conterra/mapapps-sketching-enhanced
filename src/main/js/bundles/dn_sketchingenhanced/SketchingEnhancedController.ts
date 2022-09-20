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

export default class SketchingEnhancedController {

    private readonly sketchViewModel: SketchViewModel;
    private readonly sketchingEnhancedModel: typeof SketchingEnhancedModel;

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
                break;
            case "multipoint":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.pointSymbol;
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("multipoint");
                sketchingEnhancedModel.activeUi = "point";
                break;
            case "polyline":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polyline", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polyline";
                break;
            case "polyline_freehand":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polyline", {mode: "freehand"});
                sketchingEnhancedModel.activeUi = "polyline";
                break;
            case "polygon":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polygon", {mode: "click"});
                sketchingEnhancedModel.activeUi = "polygon";
                break;
            case "polygon_freehand":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("polygon", {mode: "freehand"});
                sketchingEnhancedModel.activeUi = "polygon";
                break;
            case "circle":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("circle");
                sketchingEnhancedModel.activeUi = "polygon";
                break;
            case "rectangle":
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("rectangle");
                sketchingEnhancedModel.activeUi = "polygon";
                break;
            case "text":
                sketchViewModel.pointSymbol = sketchingEnhancedModel.textSymbol;
                if (sketchViewModel.activeTool !== tool)
                    sketchViewModel.create("point");
                sketchingEnhancedModel.activeUi = "text";
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

        sketchViewModel.watch("activeTool", (tool) => {
            if (tool === "point" && sketchViewModel.pointSymbol.type === "text") {
                sketchingEnhancedModel.activeTool = "text";
            } else {
                sketchingEnhancedModel.activeTool = tool;
            }
        });

        sketchViewModel.on("create", (event) => {
            this.refreshUndoRedo();
            // enable sketching tool again after complete
            if (event.state === "complete") {
                if (event.tool === "point" && event.graphic.symbol.type === "text") {
                    this.activateTool("text");
                } else {
                    this.activateTool(event.tool);
                }
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

    refreshUndoRedo(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this.sketchingEnhancedModel;
        sketchingEnhancedModel.canUndo = sketchViewModel.canUndo();
        sketchingEnhancedModel.canRedo = sketchViewModel.canRedo();
    }

}
