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
import Collection from "esri/core/Collection";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import MeasurementModel from "./MeasurementModel";
import MeasurementCalculator from "./MeasurementCalculator";
import MeasurementGraphicsFactory from "./MeasurementGraphicsFactory";
import { CoordinateTransformer } from "coordinatetransformer/CoordinateTransformer";

export default class MeasurementController {

    private readonly _i18n: InjectedReference<any>;
    private readonly _measurementModel: InjectedReference<typeof MeasurementModel>;
    private readonly _sketchingEnhancedModel: InjectedReference<typeof SketchingEnhancedModel>;
    private readonly _coordinateTransformer: InjectedReference<CoordinateTransformer>;
    private sketchViewModel: __esri.SketchViewModel;
    private graphicsLayer: __esri.GraphicsLayer;
    private measurementEnabledWatcher: WatchHandle;
    private measurementCalculator: MeasurementCalculator;
    private measurementGraphicsFactory: MeasurementGraphicsFactory;
    private tempGraphics: __esri.Collection<__esri.Graphic> = new Collection();
    private sketchViewModelObservers = createObservers();

    activate(): void {
        this.measurementCalculator = new MeasurementCalculator(this._measurementModel, this._coordinateTransformer);
        if(this._sketchingEnhancedModel.sketchViewModel) {
            this.sketchViewModel = this._sketchingEnhancedModel.sketchViewModel;
            this.measurementGraphicsFactory = new MeasurementGraphicsFactory(this._measurementModel,
                this.sketchViewModel, this.measurementCalculator);
            this.graphicsLayer = this.sketchViewModel.layer;
            if(this._measurementModel.measurementEnabled) {
                this.activateMeasuring();
            }
        } else {
            const watcher = this._sketchingEnhancedModel.watch("sketchViewModel", (evt)=>{
                const sketchViewModel = this.sketchViewModel = evt.value;
                watcher.remove();
                this.measurementGraphicsFactory = new MeasurementGraphicsFactory(this._measurementModel,
                    this.sketchViewModel, this.measurementCalculator);
                this.graphicsLayer = sketchViewModel.layer;
                if(this._measurementModel.measurementEnabled) {
                    this.activateMeasuring();
                }
            });
        }
        this.measurementEnabledWatcher = this.watchForMeasurementEnabled();
    }

    deactivate(): void {
        this.measurementEnabledWatcher.remove();
    }

    watchForMeasurementEnabled(): WatchHandle {
        return this._measurementModel.watch("measurementEnabled", ({value}) => {
            if(value) {
                this.activateMeasuring();
            } else {
                this.deactivateMeasuring();
            }
        });
    }

    activateMeasuring(): void {
        this.createSketchViewModelObservers();
    }

    deactivateMeasuring(): void {
        // remove watcher
        this.sketchViewModelObservers.destroy();
        this.clearTempGraphics();
    }

    private createSketchViewModelObservers(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchViewModelObservers = this.sketchViewModelObservers;

        sketchViewModelObservers.add(sketchViewModel.on("create", (event) => {
            this.drawMeasurementGraphics(event);
            this.getMeasurmentCalculations(event);
        }));

        sketchViewModelObservers.add(sketchViewModel.on("delete", (event) => {
            event.graphics.forEach((graphic) => {
                const uid = graphic.attributes?.uid;
                uid && this.deleteMeasurementGraphics(uid);
            });
            this.clearTempGraphics();
        }));

        sketchViewModelObservers.add(sketchViewModel.on("update", (event) => {
            event.graphics.forEach((graphic) => {
                const uid = graphic.attributes?.uid;
                uid && this.deleteMeasurementGraphics(uid);
            });
            if(!this._sketchingEnhancedModel.deleteClicked) {
                this.drawMeasurementGraphics(event);
                this.getMeasurmentCalculations(event);
            }
        }));
    }

    private async getMeasurmentCalculations(event: any): Promise<void> {
        const mc = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const graphic = event.graphics?.length ? event.graphics[0] : event.graphic;
        if(!graphic) {
            return;
        }
        measurementModel.x = undefined;
        measurementModel.y = undefined;
        measurementModel.length = undefined;
        measurementModel.area = undefined;
        measurementModel.circumference = undefined;

        if (graphic?.geometry?.type === "point") {
            const point = graphic.geometry as __esri.Point;
            const coordinates = await mc.getPointCoordinates(point);
            measurementModel.x = coordinates.x;
            measurementModel.y = coordinates.y;
        }
        if (graphic?.geometry?.type === "polyline") {
            const polyline = graphic.geometry as __esri.Polyline;
            const {length, unit: lengthUnit} = mc.getLengthAndUnit(polyline, measurementModel.lengthUnit);
            const lengthUnitObj = this._measurementModel.lengthUnits.find((u)=>u.name === lengthUnit);
            const lengthText = mc.formatNumber(length, lengthUnitObj.decimalPlaces);
            measurementModel.length = lengthText;
            measurementModel.lengthUnitAbbreviation = lengthUnitObj.abbreviation;
        }
        if (graphic?.geometry?.type === "polygon") {
            const polygon = graphic.geometry as __esri.Polygon;
            const {area, unit: areaUnit}  = mc.getAreaAndUnit(polygon, measurementModel.areaUnit);
            const areaUnitObj = this._measurementModel.areaUnits.find((u)=>u.name === areaUnit);
            const areaText = mc.formatNumber(area, areaUnitObj.decimalPlaces);
            measurementModel.area = areaText;
            measurementModel.areaUnitAbbreviation = areaUnitObj.abbreviation;
            const {length: circumference, unit: lengthUnit} = mc.getLengthAndUnit(polygon, measurementModel.lengthUnit);
            const lengthUnitObj = this._measurementModel.lengthUnits.find((u)=>u.name === lengthUnit);
            const circumferenceText = mc.formatNumber(circumference, lengthUnitObj.decimalPlaces);
            measurementModel.circumference = circumferenceText;
            measurementModel.lengthUnitAbbreviation = lengthUnitObj.abbreviation;
        }

        if (event.state === "cancel") {
            measurementModel.x = undefined;
            measurementModel.y = undefined;
            measurementModel.length = undefined;
            measurementModel.area = undefined;
            measurementModel.circumference = undefined;
        }
    }

    private drawMeasurementGraphics(event: any): void {
        const measurementModel = this._measurementModel;
        const sketchingEnhancedModel = this._sketchingEnhancedModel;
        const activeUi = sketchingEnhancedModel.activeUi;
        const activeTool = sketchingEnhancedModel.activeTool;
        const graphicsFactory = this.measurementGraphicsFactory;
        setTimeout(async () => {
            const tempGraphics: Array<__esri.Graphic> = [];
            const graphic = event.graphics?.length ? event.graphics[0] : event.graphic;
            if(!graphic) {
                return;
            }

            if (activeUi === "point") {
                const point = graphic.geometry as __esri.Point;

                const textGraphic = await graphicsFactory.getPointCoordinatesGraphic(point);
                tempGraphics.push(textGraphic);
                this.addTempGraphics(tempGraphics);
            }
            if (activeUi === "polyline") {
                const polyline = graphic.geometry as __esri.Polyline;

                const paths = polyline.paths[0];
                if(measurementModel.lineMeasurementForPolylinesEnabled && activeTool !== "polyline_freehand") {
                    for (let i = 0; i < paths.length - 1; i++) {
                        const point1 = polyline.getPoint(0, i);
                        const point2 = polyline.getPoint(0, i+1);
                        tempGraphics.push(graphicsFactory.getDistanceLabelBetweenPointsGraphic(point1, point2));
                    }
                }
                if(paths.length > 2) {
                    if(measurementModel.totalLengthMeasurementForPolylinesEnabled) {
                        tempGraphics.push(graphicsFactory.getLengthGraphic(polyline));
                    }
                    if(measurementModel.angleMeasurementForPolylinesEnabled && activeTool !== "polyline_freehand") {
                        for (let i = 1; i < paths.length - 1; i++) {
                            const centerPoint = polyline.getPoint(0, i);
                            const nextPoint = polyline.getPoint(0, i+1);
                            const previousPoint = polyline.getPoint(0, i-1);
                            const angleGraphic =
                            graphicsFactory.getAngleLabelBetweenPointsGraphic(centerPoint, nextPoint, previousPoint);
                            tempGraphics.push(angleGraphic);
                        }
                    }
                }
                this.addTempGraphics(tempGraphics);
            }
            if (activeUi === "polygon") {
                const polygon = graphic.geometry as __esri.Polygon;

                const rings = polygon.rings[0];
                if(measurementModel.lineMeasurementForPolygonsEnabled
                    && activeTool !== "polygon_freehand" && activeTool !== "circle") {
                    for (let i = 0; i < rings.length - 1; i++) {
                        const point1 = polygon.getPoint(0, i);
                        const point2 = polygon.getPoint(0, i+1);
                        tempGraphics.push(graphicsFactory.getDistanceLabelBetweenPointsGraphic(point1, point2));

                    }
                }
                if(rings.length > 3) {
                    if(measurementModel.areaMeasurementForPolygonsEnabled) {
                        tempGraphics.push(graphicsFactory.getAreaGraphic(polygon));
                    }
                    if(measurementModel.circumferenceMeasurementForPolygonsEnabled) {
                        tempGraphics.push(graphicsFactory.getLengthGraphic(polygon));
                    }
                    if(measurementModel.angleMeasurementForPolygonsEnabled
                        && activeTool !== "polygon_freehand" && activeTool !== "circle" && activeTool !== "rectangle") {
                        for (let i = 1; i < rings.length; i++) {
                            const centerPoint = polygon.getPoint(0, i);
                            // switch next and previous point to calculate inner angles
                            const nextPoint = polygon.getPoint(0, i-1);
                            let previousPoint;
                            // use first point to calculate last angle
                            if(i === rings.length-1) {
                                previousPoint = polygon.getPoint(0, 1);
                            } else {
                                previousPoint = polygon.getPoint(0, i+1);
                            }
                            const angleGraphic =
                            graphicsFactory.getAngleLabelBetweenPointsGraphic(centerPoint, nextPoint, previousPoint);
                            tempGraphics.push(angleGraphic);
                        }
                    }
                }
                this.addTempGraphics(tempGraphics);
            }

            if (event.state === "complete") {
                // add uid to drawn graphic
                if(!graphic.attributes?.uid) {
                    graphic.setAttribute("uid", graphic.uid);
                }
                this.addTempGraphicsToLayer(graphic);
                this.clearTempGraphics();
            }

            if (event.state === "cancel") {
                this.clearTempGraphics();
            }
        }, 10);
    }

    private addTempGraphicsToLayer(graphic: __esri.Graphic): void {
        const graphics = this.tempGraphics;
        if(graphic.attributes.uid) {
            graphics.forEach((g)=>{
                g.setAttribute("parentUid", graphic.attributes.uid);
            });
        }
        this.graphicsLayer.addMany(graphics.toArray());
    }

    private addTempGraphics(graphics: Array<__esri.Graphic>): void {
        graphics = graphics.filter((graphic)=>graphic);
        this.clearTempGraphics();
        const view = this.sketchViewModel.view;
        view.graphics.addMany(graphics);
        this.tempGraphics.addMany(graphics);
    }

    private clearTempGraphics(): void {
        const view = this.sketchViewModel.view;
        const graphics = this.tempGraphics;
        view.graphics.removeMany(graphics);
        this.tempGraphics.removeAll();
    }

    private deleteMeasurementGraphics(uid: number): void {
        const sketchViewModel = this.sketchViewModel;
        const graphics = sketchViewModel.layer.graphics;
        const graphicsToRemove = graphics.filter((g)=>g.attributes.parentUid === uid);
        graphics.removeMany(graphicsToRemove);
    }
}
