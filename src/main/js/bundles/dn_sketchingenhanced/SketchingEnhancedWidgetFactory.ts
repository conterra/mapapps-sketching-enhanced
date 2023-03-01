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

import type {InjectedReference} from "apprt-core/InjectedReference";
import async from "apprt-core/async";
import {Vue} from "apprt-vue/module";
import VueDijit from "apprt-vue/VueDijit";
import Binding, {Bindable, WatchHandle} from "apprt-binding/Binding";
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import SketchingEnhancedWidget from "./SketchingEnhancedWidget.vue";
import SketchingEnhancedController from "dn_sketchingenhanced/SketchingEnhancedController";
import SketchingEnhancedModel from "./SketchingEnhancedModel";
import MapWidgetModel from "@conterra/ct-mapapps-typings/map-widget/MapWidgetModel";

const LAYER_ID = "sketch-graphics";

export default class SketchingEnhancedWidgetFactory {

    private readonly _i18n!: InjectedReference<any>;
    private readonly _mapWidgetModel!: InjectedReference<MapWidgetModel>;
    private readonly _sketchingEnhancedModel!: InjectedReference<typeof SketchingEnhancedModel>;
    private vm: Vue;
    private controller: SketchingEnhancedController;
    private sketchViewModel: SketchViewModel;
    private sketchViewModelBinding: Bindable;
    private snappingBinding: Bindable;

    activate(): void {
        this.initComponent();
    }

    deactivate(): void {
    }

    createInstance(): any {
        const widget = VueDijit(this.vm, {class: "sketching-enhanced-widget"});
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const mapWidgetModel = this._mapWidgetModel;
        let sketchViewModelBinding = this.sketchViewModelBinding;

        widget.activateTool = async () => {
            // create GraphicsLayer
            const graphicsLayer = findOrBuildGraphicsLayer(sketchingEnhancedModel, mapWidgetModel);
            // create SketchViewModel
            let sketchViewModel = this.sketchViewModel;
            if(!sketchViewModel) {
                const view = await this.getView();
                sketchViewModel = this.sketchViewModel =
                    createSketchViewModel(sketchingEnhancedModel, graphicsLayer, view);
            }

            // create SketchingEnhancedController
            let controller = this.controller;
            if(!controller) {
                controller = this.controller =
                    new SketchingEnhancedController(this.sketchViewModel, sketchingEnhancedModel, mapWidgetModel);
            }

            this.createVMWatchers();
            controller.addSnappingFeatureSources();
            controller.createWatchers();

            let snappingBinding = this.snappingBinding;
            if(!snappingBinding) {
                snappingBinding = this.snappingBinding = controller.createSnappingBinding();
            }
            snappingBinding.enable().syncToLeftNow();
            sketchViewModelBinding.enable().syncToLeftNow();
            controller.activateTool(sketchingEnhancedModel.initialActiveTool);
        };
        widget.deactivateTool = () => {
            const controller = this.controller;
            controller.cancelSketching();
            controller.removeSnappingFeatureSources();
            controller.removeWatchers();
            this.vm.$off();
            async(() => {
                this.snappingBinding.disable();
                sketchViewModelBinding.disable();
            }, 500);
        };

        widget.own({
            remove() {
                this.snappingBinding.unbind();
                this.snappingBinding = undefined;
                sketchViewModelBinding.unbind();
                sketchViewModelBinding = undefined;
                this.vm.$off();
            }
        });
        return widget;
    }

    private initComponent() {
        const i18n: any = this._i18n.get().ui;
        const vm = this.vm = new Vue(SketchingEnhancedWidget);
        vm.i18n = i18n;
        vm.snappingControlsNode = document.createElement("div");

        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        vm.pointSymbol = sketchingEnhancedModel.pointSymbol;
        vm.polylineSymbol = sketchingEnhancedModel.polylineSymbol;
        vm.polygonSymbol = sketchingEnhancedModel.polygonSymbol;
        vm.textSymbol = sketchingEnhancedModel.textSymbol;

        this.sketchViewModelBinding =this.createSketchViewModelBinding(vm, sketchingEnhancedModel);
    }

    private createSketchViewModelBinding(vm: Vue, sketchingEnhancedModel: typeof SketchingEnhancedModel): Binding {
        return Binding.for(vm, sketchingEnhancedModel)
            .syncAll("activeTool", "activeUi", "canUndo", "canRedo", "canDelete")
            .syncAll("editEnabled", "snappingEnabled", "snappingFeatureEnabled", "snappingSelfEnabled")
            .syncAllToLeft("snappingFeatureSources")
            .syncAllToRight("pointSymbol", "polylineSymbol", "polygonSymbol", "textSymbol")
            .syncAll("editSymbol");
    }

    private createVMWatchers(): void {
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;
        const controller = this.controller;
        const vm = this.vm;
        vm.$on("activate-tool", (tool) => {
            controller.activateTool(tool);
        });
        vm.$on("undo", () => {
            sketchViewModel.undo();
        });
        vm.$on("redo", () => {
            sketchViewModel.redo();
        });
        vm.$on("edit", () => {
            controller.activateEdit();
        });
        vm.$on("delete", () => {
            controller.deleteGraphic();
        });
        vm.$on("cancel", () => {
            controller.cancelSketching();
            const activeTool = sketchingEnhancedModel.activeTool;
            controller.activateTool(activeTool);
        });

        vm.$on("feature-source-changed", (featureSource) => {
            this.controller.changeSnappingFeatureSource(featureSource.id);
        });
    }

    private getView(): Promise<__esri.View> {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }

}

function createSketchViewModel(sketchingEnhancedModel: SketchViewModel,
    graphicsLayer: __esri.GraphicsLayer, view: __esri.View) {
    return new SketchViewModel({
        layer: graphicsLayer,
        view: view,
        pointSymbol: sketchingEnhancedModel.pointSymbol,
        polylineSymbol: sketchingEnhancedModel.polylineSymbol,
        polygonSymbol: sketchingEnhancedModel.polygonSymbol,
        updateOnGraphicClick: false,
        defaultCreateOptions: {
            hasZ: false
        },
        defaultUpdateOptions: {
            tool: sketchingEnhancedModel.initialGeometryEditMode,
            toggleToolOnClick: sketchingEnhancedModel.toggleGeometryEditModeOnClick,
            enableZ: false
        },
        snappingOptions: {
            enabled: sketchingEnhancedModel.snappingEnabled,
            featureEnabled: sketchingEnhancedModel.snappingFeatureEnabled,
            selfEnabled: sketchingEnhancedModel.snappingSelfEnabled
        }
    });
}

function findOrBuildGraphicsLayer(sketchingEnhancedModel: typeof SketchingEnhancedModel,
    mapWidgetModel: MapWidgetModel) {
    const layerId = sketchingEnhancedModel.graphicsLayerId || LAYER_ID;
    let layer = mapWidgetModel.map.findLayerById(layerId);
    if (layer) {
        return layer;
    }
    layer = new GraphicsLayer({
        id: layerId,
        title: sketchingEnhancedModel.graphicsLayerTitle,
        listMode: sketchingEnhancedModel.graphicsLayerListMode
    });
    mapWidgetModel.map.layers.add(layer);
    return layer;
}
