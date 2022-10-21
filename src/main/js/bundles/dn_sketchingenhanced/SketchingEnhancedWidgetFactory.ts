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
import {Vue} from "apprt-vue/module";
import VueDijit from "apprt-vue/VueDijit";
import Binding, {Bindable} from "apprt-binding/Binding";
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import SketchingEnhancedWidget from "./SketchingEnhancedWidget.vue";
import SketchingEnhancedController from "dn_sketchingenhanced/SketchingEnhancedController";
import SnappingControls from "esri/widgets/support/SnappingControls";

const LAYER_ID = "sketching-enhanced-graphics";

export default class QueryBuilderWidgetFactory {

    private vm: Vue;
    private controller: SketchingEnhancedController;
    private _i18n!: InjectedReference<any>;
    private _sketchingEnhancedModel!: InjectedReference<any>;
    private _mapWidgetModel!: InjectedReference<any>;
    private sketchViewModel: SketchViewModel;
    private sketchViewModelBinding: Bindable;

    activate(): void {
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const mapWidgetModel = this._mapWidgetModel;
        const graphicsLayer = findOrBuildGraphicsLayer(sketchingEnhancedModel, mapWidgetModel);
        const sketchViewModel = this.sketchViewModel = createSketchViewModel(sketchingEnhancedModel, graphicsLayer);
        sketchViewModel.snappingOptions.featureSources.push({layer: graphicsLayer, enabled: true});
        const controller = this.controller = new SketchingEnhancedController(sketchViewModel, sketchingEnhancedModel);
        this.getView().then((view) => {
            sketchViewModel.view = view;

            // create new SnappingControls widget to get snapping layers in snappingOptions
            new SnappingControls({
                view: view,
                snappingOptions: sketchViewModel.snappingOptions
            });
        });
        this.initComponent(sketchingEnhancedModel, sketchViewModel, controller);
    }

    deactivate(): void {
    }

    createInstance(): any {
        const widget = VueDijit(this.vm, {class: "sketching-enhanced-widget"});
        const controller = this.controller;
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const sketchViewModel = this.sketchViewModel;

        let sketchViewModelBinding = this.sketchViewModelBinding;
        widget.activateTool = function () {
            sketchViewModelBinding.enable().syncToLeftNow();
            controller.activateTool(sketchingEnhancedModel.initialActiveTool);
        };
        widget.deactivateTool = function () {
            sketchViewModelBinding.disable();
            sketchViewModel.cancel();
            sketchViewModel.updateOnGraphicClick = false;
        };

        widget.own({
            remove() {
                sketchViewModelBinding.unbind();
                sketchViewModelBinding = undefined;
                this.vm.$off();
            }
        });
        return widget;
    }

    private initComponent(sketchingEnhancedModel, sketchViewModel, controller) {
        const i18n: any = this._i18n.get().ui;
        const vm = this.vm = new Vue(SketchingEnhancedWidget);
        vm.i18n = i18n;
        vm.snappingControlsNode = document.createElement("div");

        this.sketchViewModelBinding = Binding.for(vm, sketchingEnhancedModel)
            .syncAll("activeTool", "activeUi", "canUndo", "canRedo")
            .syncAll("snappingEnabled", "snappingFeatureEnabled", "snappingSelfEnabled")
            .syncAllToLeft("snappingFeatureSources")
            .syncAllToRight("pointSymbol", "polylineSymbol", "polygonSymbol", "textSymbol")
            .syncToLeftNow();

        vm.pointSymbol = sketchingEnhancedModel.pointSymbol;
        vm.polylineSymbol = sketchingEnhancedModel.polylineSymbol;
        vm.polygonSymbol = sketchingEnhancedModel.polygonSymbol;
        vm.textSymbol = sketchingEnhancedModel.textSymbol;

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
        vm.$on("cancel", () => {
            sketchViewModel.cancel();
        });
        vm.$on("settings", () => {
            controller.showSettings();
        });

        vm.$on("feature-source-changed", (featureSource) => {
            this.controller.changeFeatureSource(featureSource.id);
        });

        controller.watchForSketchingEnhancedModelEvents();
        controller.watchForSketchViewModelEvents();
        controller.createSnappingBinding();
    }

    private getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve, reject) => {
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

function createSketchViewModel(sketchingEnhancedModel, graphicsLayer) {
    return new SketchViewModel({
        layer: graphicsLayer,
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

function findOrBuildGraphicsLayer(sketchingEnhancedModel, mapWidgetModel) {
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
