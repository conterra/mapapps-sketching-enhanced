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

import { Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import MeasurementModel from "./MeasurementModel";
import MeasurementCalculator from "./MeasurementCalculator";

export default class MeasurementController {

    private measurementModel: typeof MeasurementModel;
    private sketchViewModel: __esri.SketchViewModel;
    private measurementCalculator: MeasurementCalculator;

    constructor(measurementModel: typeof MeasurementModel, sketchViewModel: __esri.SketchViewModel,
        measurementCalculator: MeasurementCalculator) {
        this.measurementModel = measurementModel;
        this.sketchViewModel = sketchViewModel;
        this.measurementCalculator = measurementCalculator;
    }

    /**
     * Method to generate point coordinate graphic.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns __esri.Graphic
     *
     */
    async getPointCoordinatesGraphic(point: __esri.Point): Promise<__esri.Graphic> {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this.measurementModel;
        const coordinates = await measurementCalculator.getPointCoordinates(point);
        const x = coordinates.x;
        const y = coordinates.y;
        const unitSymbolX = measurementModel.pointCoordUnitSymbolX;
        const unitSymbolY = measurementModel.pointCoordUnitSymbolY;
        const coordinatesString = `${x}${unitSymbolX} / ${y}${unitSymbolY}`;
        return this.getMeasurementTextGraphic(point, 0, coordinatesString, null, false);
    }

    /**
     * Method to generate partial length label graphic.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns __esri.Graphic
     *
     */
    getDistanceLabelBetweenPointsGraphic(point1: __esri.Point, point2: __esri.Point): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this.measurementModel;
        const sketchViewModel = this.sketchViewModel;
        const angle = measurementCalculator.getAngleBetweenTwoPoints(point1, point2);
        const polyline = new Polyline({
            spatialReference: {
                wkid: sketchViewModel.view.spatialReference.wkid
            }
        });
        polyline.addPath([point1, point2]);
        const length = measurementCalculator.getLength(polyline, measurementModel.lengthUnit);
        const lengthText = measurementCalculator.formatNumber(length, 2);
        const center = polyline.extent.center;
        const suffix = measurementModel.lengthUnitAbbreviation;
        return this.getMeasurementTextGraphic(center, angle, lengthText, suffix, false);
    }

    /**
     * Method to generate angel label graphic.
     *
     * @param centerPoint center point
     * @param nextPoint next point
     * @param previousPoint previous point
     * @returns __esri.Graphic
     *
     */
    getAngleLabelBetweenPointsGraphic(centerPoint: __esri.Point, nextPoint: __esri.Point,
        previousPoint: __esri.Point): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const angle = measurementCalculator.getAngleBetweenThreePoints(centerPoint, nextPoint, previousPoint);
        const angleUnit = this.getAngleUnit();
        const convertedAngle = measurementCalculator.convertAngle(angle, angleUnit.name);
        const convertedAngleText = measurementCalculator.formatNumber(convertedAngle, 0);
        const suffix = angleUnit.abbreviation;
        const center = centerPoint;
        return this.getMeasurementTextGraphic(center, 0, convertedAngleText, suffix, false);
    }

    /**
     * Function to generate length label graphic.
     *
     * @param line Polyline | Polygon
     * @returns __esri.Graphic
     *
     */
    getLengthGraphic(line: __esri.Polyline | __esri.Polygon): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this.measurementModel;
        const length = measurementCalculator.getLength(line, measurementModel.lengthUnit);
        const lengthText = measurementCalculator.formatNumber(length, 2);
        const center = line.extent.center;
        const suffix = measurementModel.lengthUnitAbbreviation;

        return this.getMeasurementTextGraphic(center, 0, lengthText, suffix, line.type === "polygon");
    }

    /**
     * Function to generate area label graphic.
     *
     * @param polygon Polygon
     * @returns __esri.Graphic
     *
     */
    getAreaGraphic(polygon: __esri.Polygon): __esri.Graphic {
        const measurementCalculator = this.measurementCalculator;
        const measurementModel = this.measurementModel;
        const area = measurementCalculator.getArea(polygon, measurementModel.areaUnit);
        const areaText = measurementCalculator.formatNumber(area, 2);
        const center = polygon.extent.center;
        const suffix = measurementModel.areaUnitAbbreviation;

        return this.getMeasurementTextGraphic(center, 0, areaText, suffix, false);
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
     */
    getMeasurementTextGraphic(center: __esri.Point, angle: number, measurement: string,
        unitSuffix: string, additionalYoffset: boolean): __esri.Graphic {
        if(!measurement) {
            return;
        }
        const measurementModel = this.measurementModel;
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
        let yoffset = textSize * Math.cos(angle / (180 / Math.PI));
        if(additionalYoffset) {
            yoffset -= textSymbol.font.size + textSize;
        }
        textSymbol.xoffset = xoffset.toString() + "px";
        textSymbol.yoffset = yoffset.toString() + "px";

        const textGraphic = new Graphic({
            geometry: pointGeometry,
            symbol: textSymbol
        });

        return textGraphic;
    }

    private getAngleUnit() {
        const measurementModel = this.measurementModel;
        return measurementModel.angleUnits.find((unit) =>
            unit.name === measurementModel.angleUnit);
    }

}
