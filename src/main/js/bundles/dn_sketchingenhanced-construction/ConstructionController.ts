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

import { WatchHandle } from "apprt-binding/Binding";
import { createObservers, Observers } from "apprt-core/Observers";
import type {InjectedReference} from "apprt-core/InjectedReference";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import ConstructionModel from "./ConstructionModel";
import ConstructionHistory from "./ConstructionHistory";
import Circle from "esri/geometry/Circle";

export default class ConstructionController {

    private readonly _i18n: InjectedReference<any>;
    private readonly _constructionModel: InjectedReference<typeof ConstructionModel>;
    private readonly _sketchingEnhancedModel: InjectedReference<typeof SketchingEnhancedModel>;
    private sketchViewModel: __esri.SketchViewModel;
    private sketchViewModelObservers = createObservers();
    private history = new ConstructionHistory();

    activate(): void {
        if(this._sketchingEnhancedModel.sketchViewModel) {
            this.sketchViewModel = this._sketchingEnhancedModel.sketchViewModel;
            this.createSketchViewModelObservers();
        } else {
            const watcher = this._sketchingEnhancedModel.watch("sketchViewModel", (evt)=>{
                const sketchViewModel = this.sketchViewModel = evt.value;
                watcher.remove();
                this.createSketchViewModelObservers();
            });
        }
    }

    deactivate(): void {
        this.sketchViewModelObservers.destroy();
    }

    private createSketchViewModelObservers(): void {
        const sketchViewModel = this.sketchViewModel;
        const constructionModel = this._constructionModel;
        const sketchViewModelObservers = this.sketchViewModelObservers;

        sketchViewModelObservers.add(sketchViewModel.on("create", (event) => {
            const tool = event.tool;
            const state = event.state;
            const type = event.type;
            // add step to history
            this.history.add(type);

            if (state === "cancel" || state === "complete") {
                if (this.history.wasDoubleClick()) {
                    // remove last added vertex when sketching was completed by a double click
                    event.graphic.geometry.paths[0].pop();
                }
                if (tool === "circle" && constructionModel.radiusEnabled) {
                    this.createCircle(event.graphic, constructionModel.radius);
                }
            } else if (type === "create" && state === "active") {
                // const angle = this._getOption("angle");
                // const angleModulus = this._getOption("angleModulus");
                // const angleTypeRelative = this._getOption("angleTypeRelative", false);
                // const planarLength = this._getOption("planarLength");

                // snappingManager && (snappingManager._mandatoryWithoutSnappingMode = !!(angle || angleModulus || planarLength));
                // if (angle || angleModulus || planarLength) {
                //     this._constructionHandler(angle, angleModulus, angleTypeRelative, planarLength, evt);
                // }
            }
        }));

        // sketchViewModelObservers.add(sketchViewModel.on("update", (event) => {

        // }));
    }

    private createCircle(graphic: __esri.Graphic, radius: number): void {
        const center = graphic.geometry.centroid;
        let geodesic = false;
        if (center.spatialReference.wkid === 3857
            || center.spatialReference.wkid === 4326
            || center.spatialReference.latestWkid === 3857
            || center.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }
        graphic.geometry = new Circle({
            geodesic: geodesic,
            center: center,
            radius: radius,
            radiusUnit: "meters"
        });
    }

}
