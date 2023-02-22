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
import type {InjectedReference} from "apprt-core/InjectedReference";
import * as geometryEngine from "esri/geometry/geometryEngine";
import * as intl from "esri/intl";
import { Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import Collection from "esri/core/Collection";
import SketchingEnhancedModel from "dn_sketchingenhanced/SketchingEnhancedModel";
import MeasurementModel from "./MeasurementModel";

export default class MeasurementController {

    private readonly _i18n: InjectedReference<any>;
    private readonly _measurementModel: InjectedReference<typeof MeasurementModel>;
    private readonly _sketchingEnhancedModel: InjectedReference<typeof SketchingEnhancedModel>;
    private sketchViewModel: __esri.SketchViewModel;
    private graphicsLayer: __esri.GraphicsLayer;
    private sketchViewModelCreateWatcher: WatchHandle;
    private measurementEnabledWatcher: WatchHandle;
    private tempGraphics: __esri.Collection<__esri.Graphic> = new Collection();

    activate(): void {
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
        this.sketchViewModelCreateWatcher = this.createSketchViewModelWatcher();
    }

    deactivateMeasuring(): void {
        // remove watcher
        this.sketchViewModelCreateWatcher.remove();
    }

    private createSketchViewModelWatcher(): WatchHandle {
        const sketchViewModel = this.sketchViewModel;

        const watcher = sketchViewModel.on("create", (event) => {
            setTimeout(() => {
                const tempGraphics: Array<__esri.Graphic> = [];
                const graphic = event.graphic;
                if(!graphic) {
                    return;
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
                    }
                    this.addTempGraphics(tempGraphics);
                }

                if (event.state === "complete") {
                    watcher.remove();
                    this.addTempGraphicsToLayer();
                    this.clearTempGraphics();
                }

                if (event.state === "cancel") {
                    watcher.remove();
                    this.clearTempGraphics();
                }
            }, 10);
        });
        return watcher;
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
        const measurementModel = this._measurementModel;
        const sketchViewModel = this.sketchViewModel;
        const baseAngle = this.getBaseAdjustedAngleBetweenPoints(point1, point2);
        const polyline = new Polyline({
            spatialReference: {
                wkid: sketchViewModel.view.spatialReference.wkid
            }
        });
        polyline.addPath([point1, point2]);
        const distanceUnit = this.getDistanceUnit();
        const distance = this.calculateGeometryLength(polyline, measurementModel.distanceUnit);
        const intlDistance = this.formatNumber(distance);
        const center = polyline.extent.center;
        const suffix = distanceUnit.abbreviation;
        return this.getMeasurementTextGraphic(center, baseAngle, intlDistance, suffix);
    }

    /**
     * Method to generate angel label graphic.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns __esri.Graphic
     *
     * @private
     */
    private getAngleLabelBetweenPointsGraphic(point1: __esri.Point, point2: __esri.Point): __esri.Graphic {
        const measurementModel = this._measurementModel;
        const baseAngle = this.getBaseAdjustedAngleBetweenPoints(point1, point2);
        const angleUnit = this.getDistanceUnit();
        const intlDistance = this.formatNumber(distance);
        const center = polyline.extent.center;
        const suffix = distanceUnit.abbreviation;
        return this.getMeasurementTextGraphic(center, baseAngle, intlDistance, suffix);
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
        const measurementModel = this._measurementModel;
        const length = this.calculateGeometryLength(polyline, measurementModel.distanceUnit);
        const intlLength = this.formatNumber(length);
        const center = polyline.extent.center;
        const distanceUnit = this.getDistanceUnit();
        const suffix = distanceUnit.abbreviation;

        return this.getMeasurementTextGraphic(center, 0, intlLength, suffix);
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
        const measurementModel = this._measurementModel;
        const area = this.calculateGeometryArea(polygon, measurementModel.areaUnit);
        const intlArea = this.formatNumber(area);
        const center = polygon.extent.center;
        const areaUnit = this.getAreaUnit();
        const suffix = areaUnit.abbreviation;

        return this.getMeasurementTextGraphic(center, 0, intlArea, suffix);
    }

    /**
     * Function to determine the angle between two points adjusted for their spatial relation.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns number
     *
     * @private
     */
    private getBaseAdjustedAngleBetweenPoints(point1: __esri.Point, point2: __esri.Point): number {
        return this.calculateAngle(point1, point2);
    }

    /**
     * Function to determine geometry length.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param geometry Geometry
     * @param unit Unit of measurement
     * @returns number
     *
     * @private
     */
    private calculateGeometryLength(geometry: __esri.Geometry, unit: __esri.LinearUnits): number {
        if (this.geodesicCalculationApplicable(geometry.spatialReference)) {
            return geometryEngine.geodesicLength(geometry, unit);
        } else {
            return geometryEngine.planarLength(geometry, unit);
        }
    }

    /**
     * Function to determine polygon area.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param polygon Polygon
     * @param unit Unit of measurement
     * @returns number
     *
     * @private
     */
    private calculateGeometryArea(polygon: __esri.Polygon, unit: __esri.ArealUnits): number {
        if (this.geodesicCalculationApplicable(polygon.spatialReference)) {
            return geometryEngine.geodesicArea(polygon, unit);
        } else {
            return geometryEngine.planarArea(polygon, unit);
        }
    }

    /**
     * Helper function used to determine whether planar or geodesic measurements will be used.
     *
     * @param spatialReference Used WKID
     * @returns boolean
     *
     * @private
     */
    private geodesicCalculationApplicable(spatialReference: __esri.SpatialReference): boolean {
        return (spatialReference.isWebMercator || spatialReference.wkid === 4326);
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
    private calculateAngle(point1: __esri.Point, point2: __esri.Point): number {
        const quadrant = this.getQuadrant(point1, point2);
        const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
        return this.adjustAngleToQuadrant(quadrant, angle);
    }

    /**
     * Helper function to determine angle at between two points adjusted to quadrant.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @param angle Angle between the points
     * @returns number
     *
     * @private
     */
    private adjustAngleToQuadrant(quadrant: number, angle: number): number {
        let adjustedAngle;
        switch (quadrant) {
            case 1:
                adjustedAngle = 180 - angle;
                break;
            case 2:
                adjustedAngle = 180 - angle;
                break;
            case 3:
                adjustedAngle = angle * -1;
                break;
            case 4:
                adjustedAngle = angle * -1;
                break;
        }

        return adjustedAngle;
    }

    /**
     * Helper function used to determine quadrant based on spatial relation of two points.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns number
     *
     *  2 | 3
     * -------
     *  1 | 4
     *
     * @private
     */
    private getQuadrant(point1: __esri.Point, point2: __esri.Point): number {
        const tempPoint = {
            x: point1.x - point2.x,
            y: point1.y - point2.y
        };
        if (tempPoint.x >= 0 && tempPoint.y >= 0) {
            return 1;
        } else if (tempPoint.x >= 0 && tempPoint.y <= 0) {
            return 2;
        } else if (tempPoint.x <= 0 && tempPoint.y <= 0) {
            return 3;
        } else if (tempPoint.x <= 0 && tempPoint.y >= 0) {
            return 4;
        }
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
        textSymbol.text = measurement + " " + unitSuffix;
        textSymbol.angle = angle;
        const textSize = textSymbol.font.size / 2;
        textSymbol.xoffset = textSize * Math.sin(angle / (180 / Math.PI)) + "px";
        textSymbol.yoffset = textSize * Math.cos(angle / (180 / Math.PI)) + "px";

        const textGraphic = new Graphic({
            geometry: pointGeometry,
            symbol: textSymbol
        });

        return textGraphic;
    }

    private formatNumber(area: number): string {
        const numberFormatIntlOptions = intl.convertNumberFormatToIntlOptions({
            places: 2,
            digitSeparator: true
        });
        return intl.formatNumber(area, numberFormatIntlOptions);
    }

    private getDistanceUnit() {
        const measurementModel = this._measurementModel;
        return measurementModel.distanceUnits.find((unit) =>
            unit.name === measurementModel.distanceUnit);
    }

    private getAreaUnit() {
        const measurementModel = this._measurementModel;
        return measurementModel.areaUnits.find((unit) =>
            unit.name === measurementModel.areaUnit);
    }

    private addTempGraphicsToLayer(): void {
        this.graphicsLayer.addMany(this.tempGraphics.toArray());
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
}
