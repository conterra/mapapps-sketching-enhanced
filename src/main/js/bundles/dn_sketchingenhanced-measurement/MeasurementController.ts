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
import { Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import Collection from "esri/core/Collection";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import MeasurementModel from "./MeasurementModel";
import { MeasurementCalculator } from "./MeasurementCalculator";
import { CoordinateTransformer } from "@conterra/ct-mapapps-typings/coordinatetransformer/CoordinateTransformer";
import async from "apprt-core/async";

export default class MeasurementController {

    private readonly _i18n: InjectedReference<any>;
    private readonly _measurementModel: InjectedReference<typeof MeasurementModel>;
    private readonly _sketchingEnhancedModel: InjectedReference<typeof SketchingEnhancedModel>;
    private readonly _coordinateTransformer: InjectedReference<CoordinateTransformer>;
    private sketchViewModel: __esri.SketchViewModel;
    private graphicsLayer: __esri.GraphicsLayer;
    private measurementEnabledWatcher: WatchHandle;
    private measurementCalculator: MeasurementCalculator;
    private tempGraphics: __esri.Collection<__esri.Graphic> = new Collection();
    private sketchViewModelObservers = createObservers();

    activate(): void {
        this.measurementCalculator = new MeasurementCalculator(this._measurementModel, this._coordinateTransformer);
        if(this._sketchingEnhancedModel.sketchViewModel) {
            this.sketchViewModel = this._sketchingEnhancedModel.sketchViewModel;
            this.graphicsLayer = this.sketchViewModel.layer;
            if(this._measurementModel.measurementEnabled) {
                this.activateMeasuring();
            }
        } else {
            const watcher = this._sketchingEnhancedModel.watch("sketchViewModel", (sketchViewModel: any)=>{
                watcher.remove();
                this.sketchViewModel = sketchViewModel;
                this.graphicsLayer = sketchViewModel.graphicsLayer;
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
    }

    private createSketchViewModelObservers(): void {
        const sketchViewModel = this.sketchViewModel;
        const sketchViewModelObservers = this.sketchViewModelObservers;

        sketchViewModelObservers.add(sketchViewModel.on("create", (event) => {
            this.drawMeasurementGraphics(event);
            this.getMeasurmentCalculations(event);
        }));

        sketchViewModelObservers.add(sketchViewModel.on("delete", (event) => {
            async(() => {
                event.graphics.forEach((graphic) => {
                    const uid = graphic.attributes?.uid;
                    uid && this.deleteMeasurementGraphics(uid);
                });
            }, 100);
        }));

        sketchViewModelObservers.add(sketchViewModel.on("update", (event) => {
            event.graphics.forEach((graphic) => {
                const uid = graphic.attributes?.uid;
                uid && this.deleteMeasurementGraphics(uid);
            });
            this.drawMeasurementGraphics(event);
        }));
    }

    private async getMeasurmentCalculations(event: any): Promise<void> {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const graphic = event.graphics?.length ? event.graphics[0] : event.graphic;
        if(!graphic) {
            return;
        }
        measurementModel.x = undefined;
        measurementModel.y = undefined;
        measurementModel.area = undefined;
        measurementModel.length = undefined;

        if (graphic?.geometry?.type === "point") {
            const point = graphic.geometry as __esri.Point;
            const coordinates = await measurementCalculator.getPointCoordinates(point);
            measurementModel.x = coordinates.x;
            measurementModel.y = coordinates.y;
        }
        if (graphic?.geometry?.type === "polyline") {
            const polyline = graphic.geometry as __esri.Polyline;
            const length = measurementCalculator.getLength(polyline, measurementModel.lengthUnit);
            measurementModel.length = length;
        }
        if (graphic?.geometry?.type === "polygon") {
            const polygon = graphic.geometry as __esri.Polygon;
            const area = measurementCalculator.getArea(polygon, measurementModel.areaUnit);
            measurementModel.area = area;
        }

        if (event.state === "cancel") {
            measurementModel.x = undefined;
            measurementModel.y = undefined;
            measurementModel.area = undefined;
            measurementModel.length = undefined;
        }
    }

    private drawMeasurementGraphics(event: any): void {
        setTimeout(async () => {
            const tempGraphics: Array<__esri.Graphic> = [];
            const graphic = event.graphics?.length ? event.graphics[0] : event.graphic;
            if(!graphic) {
                return;
            }

            if (graphic?.geometry?.type === "point") {
                const point = graphic.geometry as __esri.Point;

                const textGraphic = await this.getPointCoordinatesGraphic(point);
                tempGraphics.push(textGraphic);
                this.addTempGraphics(tempGraphics);
            }
            if (graphic?.geometry?.type === "polyline") {
                const polyline = graphic.geometry as __esri.Polyline;

                const paths = polyline.paths[0];
                for (let i = 0; i < paths.length - 1; i++) {
                    const point1 = polyline.getPoint(0, i);
                    const point2 = polyline.getPoint(0, i+1);
                    tempGraphics.push(this.getDistanceLabelBetweenPointsGraphic(point1, point2));
                }
                if(paths.length > 2) {
                    tempGraphics.push(this.getLengthGraphic(polyline));
                    for (let i = 1; i < paths.length - 1; i++) {
                        const centerPoint = polyline.getPoint(0, i);
                        const nextPoint = polyline.getPoint(0, i+1);
                        const previousPoint = polyline.getPoint(0, i-1);
                        const angleGraphic =
                            this.getAngleLabelBetweenPointsGraphic(centerPoint, nextPoint, previousPoint);
                        tempGraphics.push(angleGraphic);
                    }
                }
                this.addTempGraphics(tempGraphics);
            }
            if (graphic?.geometry?.type === "polygon") {
                const polygon = graphic.geometry as __esri.Polygon;

                const rings = polygon.rings[0];
                for (let i = 0; i < rings.length - 1; i++) {
                    const point1 = polygon.getPoint(0, i);
                    const point2 = polygon.getPoint(0, i+1);
                    tempGraphics.push(this.getDistanceLabelBetweenPointsGraphic(point1, point2));

                }
                if(rings.length > 3) {
                    tempGraphics.push(this.getAreaGraphic(polygon));
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
                            this.getAngleLabelBetweenPointsGraphic(centerPoint, nextPoint, previousPoint);
                        tempGraphics.push(angleGraphic);
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

    /**
     * Method to generate point coordinate graphic.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns __esri.Graphic
     *
     * @private
     */
    private async getPointCoordinatesGraphic(point: __esri.Point): Promise<__esri.Graphic> {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const coordinates = await measurementCalculator.getPointCoordinates(point);
        const x = coordinates.x;
        const y = coordinates.y
        const unitSymbolX = measurementModel.pointCoordUnitSymbolX;
        const unitSymbolY = measurementModel.pointCoordUnitSymbolY;
        const coordinatesString = `${x}${unitSymbolX} / ${y}${unitSymbolY}`;
        return this.getMeasurementTextGraphic(point, 0, coordinatesString, null);
    }

    /**
     * Method to generate partial length label graphic.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns __esri.Graphic
     *
     * @private
     */
    private getDistanceLabelBetweenPointsGraphic(point1: __esri.Point, point2: __esri.Point): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const sketchViewModel = this.sketchViewModel;
        const angle = measurementCalculator.getAngleBetweenTwoPoints(point1, point2);
        const polyline = new Polyline({
            spatialReference: {
                wkid: sketchViewModel.view.spatialReference.wkid
            }
        });
        polyline.addPath([point1, point2]);
        const length = measurementCalculator.getLength(polyline, measurementModel.lengthUnit);
        const center = polyline.extent.center;
        const suffix = measurementModel.lengthUnitAbbreviation;
        return this.getMeasurementTextGraphic(center, angle, length, suffix);
    }

    /**
     * Method to generate angel label graphic.
     *
     * @param centerPoint center point
     * @param nextPoint next point
     * @param previousPoint previous point
     * @returns __esri.Graphic
     *
     * @private
     */
    private getAngleLabelBetweenPointsGraphic(centerPoint: __esri.Point, nextPoint: __esri.Point,
        previousPoint: __esri.Point): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const angle = measurementCalculator.getAngleBetweenThreePoints(centerPoint, nextPoint, previousPoint);
        const angleUnit = this.getAngleUnit();
        const suffix = angleUnit.abbreviation;
        const center = centerPoint;
        return this.getMeasurementTextGraphic(center, 0, angle, suffix);
    }

    /**
     * Function to generate length label graphic.
     *
     * @param polyline Polyline
     * @returns __esri.Graphic
     *
     * @private
     */
    private getLengthGraphic(polyline: __esri.Polyline): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const length = measurementCalculator.getLength(polyline, measurementModel.lengthUnit);
        const center = polyline.extent.center;
        const suffix = measurementModel.lengthUnitAbbreviation;

        return this.getMeasurementTextGraphic(center, 0, length, suffix);
    }

    /**
     * Function to generate area label graphic.
     *
     * @param polygon Polygon
     * @returns __esri.Graphic
     *
     * @private
     */
    private getAreaGraphic(polygon: __esri.Polygon): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this._measurementModel;
        const area = measurementCalculator.getArea(polygon, measurementModel.areaUnit);
        const center = polygon.extent.center;
        const suffix = measurementModel.areaUnitAbbreviation;

        return this.getMeasurementTextGraphic(center, 0, area, suffix);
    }

    /**
     * Function to create a measurement text graphic.
     *
     * @param center Center of the line
     * @param angle Angle of the line
     * @param measurement Distance measurement of the line
     * @param unitSuffix Text to be displayed after measurement
     * @returns __esri.Graphic
     *
     * @private
     */
    private getMeasurementTextGraphic(center: __esri.Point, angle: number, measurement: string,
        unitSuffix: string): __esri.Graphic {
        const measurementModel = this._measurementModel;
        const sketchViewModel = this.sketchViewModel;
        const currentWKID = sketchViewModel.view.spatialReference.wkid;

        const pointGeometry = {
            type: "point",
            x: center.x,
            y: center.y,
            spatialReference: {
                wkid: currentWKID
            }
        };

        const textSymbol = measurementModel.textSymbol;
        textSymbol.text = measurement;
        if(unitSuffix) {
            textSymbol.text += " " + unitSuffix;
        }
        textSymbol.angle = angle;
        const textSize = textSymbol.font.size / 2;
        const xoffset = textSize * Math.sin(angle / (180 / Math.PI));
        const yoffset = textSize * Math.cos(angle / (180 / Math.PI));
        textSymbol.xoffset = xoffset.toString() + "px";
        textSymbol.yoffset = yoffset.toString() + "px";

        const textGraphic = new Graphic({
            geometry: pointGeometry,
            symbol: textSymbol
        });

        return textGraphic;
    }

    private getAngleUnit() {
        const measurementModel = this._measurementModel;
        return measurementModel.angleUnits.find((unit) =>
            unit.name === measurementModel.angleUnit);
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
