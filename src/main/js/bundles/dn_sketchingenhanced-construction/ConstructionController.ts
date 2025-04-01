///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

import { createObservers } from "apprt-core/Observers";
import type { InjectedReference } from "apprt-core/InjectedReference";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import ConstructionModel from "./ConstructionModel";
import ConstructionHistory from "./ConstructionHistory";
import Circle from "esri/geometry/Circle";
import { Polygon, Polyline } from "esri/geometry";
import { pointFromDistance } from "esri/geometry/support/geodesicUtils";
import type CoordinateTransformer from "coordinatetransformer/CoordinateTransformer";

export default class ConstructionController {

    private readonly _i18n: InjectedReference<any>;
    private readonly _constructionModel: InjectedReference<typeof ConstructionModel>;
    private readonly _sketchingEnhancedModel: InjectedReference<typeof SketchingEnhancedModel>;
    private readonly _coordinateTransformer: InjectedReference<CoordinateTransformer>;
    private sketchViewModel: __esri.SketchViewModel;
    private sketchViewModelObservers = createObservers();
    private history = new ConstructionHistory();

    activate(): void {
        if (this._sketchingEnhancedModel.sketchViewModel) {
            this.sketchViewModel = this._sketchingEnhancedModel.sketchViewModel;
            this.createSketchViewModelObservers();
        } else {
            const watcher = this._sketchingEnhancedModel.watch("sketchViewModel", (evt) => {
                this.sketchViewModel = evt.value;
                watcher.remove();
                this.createSketchViewModelObservers();
            });
        }
    }

    deactivate(): void {
        this.sketchViewModelObservers.destroy();
        this.sketchViewModel = undefined;
    }

    private createSketchViewModelObservers(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const constructionModel = this._constructionModel;
        const sketchViewModelObservers = this.sketchViewModelObservers;

        sketchViewModelObservers.add(sketchViewModel.on("create", (event) => {
            const tool = event.tool;
            const state = event.state;
            const type = event.type;
            const toolEventInfo = event.toolEventInfo;
            const graphic = event.graphic;
            // add step to history
            this.history.add(type);

            if (state === "cancel" || state === "complete") {
                if (this.history.wasDoubleClick()) {
                    // remove last added vertex when sketching was completed by a double click
                    graphic.geometry.paths[0].pop();
                }
                if (tool === "circle" && constructionModel.radiusEnabled) {
                    this.createCircle(graphic, constructionModel.radius);
                }
                if (tool === "polyline" && sketchingEnhancedModel.activeTool === "polyline" && constructionModel.lengthEnabled) {
                    this.createPolyline(graphic, constructionModel.length);
                }
            } else if (type === "create" && state === "active") {
                if (tool === "polyline" && sketchingEnhancedModel.activeTool === "polyline" && constructionModel.lengthEnabled) {
                    this.createPolyline(graphic, constructionModel.length);
                }
            }
            if (toolEventInfo?.type === "vertex-add" && sketchingEnhancedModel.activeTool === "polyline" && tool === "polyline") {
                this.createPolyline(graphic, constructionModel.length);
            }
        }));
    }

    private createCircle(graphic: __esri.Graphic, radius: number): void {
        if (!graphic) {
            return;
        }
        const geometry = graphic.geometry as Circle;
        const center = geometry.centroid;
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
        const json = graphic.geometry.toJSON();
        const poly = Polygon.fromJSON(json);
        graphic.geometry = poly;
    }

    private pointFromPlanarDistance(point: __esri.Point, distance: number, angle:number){
        angle = 360 - (angle - 90);
        if (angle <0 ){
            angle + 360;
        }
        const radians = angle * (Math.PI / 180);
        const x = point.x + distance * Math.cos(radians);
        const y = point.y + distance * Math.sin(radians);
        return({x, y});
    }

    private async createPolyline(graphic: __esri.Graphic, length: number): Promise<void> {
        if (!graphic) {
            return;
        }
        const geometry = graphic.geometry as Polyline;
        const path = geometry.paths[0];
        const point1 = geometry.getPoint(0, path.length - 2);
        const point2 = geometry.getPoint(0, path.length - 1);
        if (!point1 || !point2) {
            return;
        }
        const angle = this.getAngleBetweenTwoPoints(point1, point2);

        let geodesic = false;
        if (geometry.spatialReference.wkid === 3857
            || geometry.spatialReference.wkid === 4326
            || geometry.spatialReference.latestWkid === 3857
            || geometry.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }

        let tPoint= null;
        if (geodesic){
            // transform first point to 4326
            const tPoint1 = await this._coordinateTransformer.transform(point1, "4326");
            // calculate new point from distance and angle
            const point = pointFromDistance(tPoint1, length, angle);
            // transform new calculated endpoint back to map wkid
            tPoint = await this._coordinateTransformer.transform(point, geometry.spatialReference.wkid);
        }
        else {
            tPoint =  this.pointFromPlanarDistance(point1, length, angle);
        }

        path.pop();
        path.push([tPoint.x, tPoint.y]);
        graphic.geometry = new Polyline({
            paths: [path],
            spatialReference: geometry.spatialReference
        });


        const sketchViewModel = this.sketchViewModel;
        const drawOperation = sketchViewModel._operationHandle?.activeComponent?.drawOperation;
        if (drawOperation) {
            const cursorVertex = drawOperation.cursorVertex;
            if (cursorVertex) {
                cursorVertex.x = tPoint.x;
                cursorVertex.y = tPoint.y;
            }
        }
    }

    /**
     * Helper function used to calculate angle between two points.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns number
     *
     * @private
     */
    private getAngleBetweenTwoPoints(point1: __esri.Point, point2: __esri.Point): number {
        if (point1 && point2) {
            let angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
            angle = 360 - angle + 90;
            if (angle > 360) {
                angle = angle - 360;
            }
            return angle;
        } else {
            return 0;
        }
    }

}
