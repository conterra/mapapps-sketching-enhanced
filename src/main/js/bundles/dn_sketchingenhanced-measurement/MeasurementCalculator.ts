///
/// Copyright (C) 2023 con terra GmbH (info@conterra.de)
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

import type CoordinateTransformer from "coordinatetransformer/CoordinateTransformer";
import * as geometryEngine from 'esri/geometry/geometryEngine';
import * as intl from "esri/intl";
import MeasurementModel from "./MeasurementModel";

export interface Coordinates {
    x: string,
    y: string
}

export default class MeasurementCalculator {
    measurementModel: typeof MeasurementModel;
    coordinateTransformer: CoordinateTransformer;

    constructor(measurementModel: typeof MeasurementModel, coordinateTransformer: CoordinateTransformer) {
        this.measurementModel = measurementModel;
        this.coordinateTransformer = coordinateTransformer;
    }

    /**
    * Helper function to convert the point graphic into a readable string (asyncronous)
    *
    * @param point
    * @return corrdinate string
    * @private
    */
    public async getPointCoordinates(point: __esri.Point): Promise<Coordinates> {
        if (!point) {
            return null;
        }
        const mapSpatialReference = point.spatialReference;
        const measurementSpatialReference = this.measurementModel.pointCoordSpatialReference;
        const targetSpatialReference = measurementSpatialReference || mapSpatialReference;
        const places = this.measurementModel.pointCoordPlaces;
        const transformedPoint = await this.transformGeometry(point, targetSpatialReference.wkid) as __esri.Point;

        if (!transformedPoint) {
            return null;
        }
        const x = transformedPoint.x.toFixed(places);
        const y = transformedPoint.y.toFixed(places);
        return {
            x, y
        };
    }

    /**
     * Helper function to calculate geometry length.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param geometry Geometry
     * @param unit Unit of measurement
     * @returns length and unit
     *
     * @public
     */
    public getLengthAndUnit(geometry: __esri.Polygon | __esri.Polyline,
        unit: __esri.LinearUnits | 'auto' = this.measurementModel?.lengthUnit):
        { length: number, unit: __esri.LinearUnits } {
        const unitForCalculation = unit === 'auto' ? 'meters' : unit;
        const length = this.calculateGeometryLength(geometry, unitForCalculation);
        if (unit !== 'auto') {
            // fixed unit
            return { length, unit };
        }
        // automatic recalculation of length
        if (length > 1000) {
            // calculate kilometers
            return { length: length / 1000, unit: 'kilometers' };
        }
        return { length: length, unit: 'meters' };
    }

    /**
     * Helper function to calculate geometry length.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param geometry Geometry
     * @param unit Unit of measurement
     * @returns number
     *
     * @private
     */
    private calculateGeometryLength(geometry: __esri.Polygon | __esri.Polyline, unit: __esri.LinearUnits): number {
        if (this.shouldCalculateGeodesic(geometry.spatialReference)) {
            return geometryEngine.geodesicLength(geometry, unit);
        } else {
            return geometryEngine.planarLength(geometry, unit);
        }
    }

    /**
     * Helper function to calculate polygon area.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param polygon Polygon
     * @param unit Unit of measurement
     * @returns area and unit
     *
     * @public
     */
    public getAreaAndUnit(geometry: __esri.Polygon,
        unit: __esri.ArealUnits | 'auto' = this.measurementModel?.areaUnit):
        { area: number, unit: __esri.ArealUnits } {
        const unitForCalculation = unit === 'auto' ? 'square-meters' : unit;
        const area = this.calculateGeometryArea(geometry, unitForCalculation);
        if (unit !== 'auto') {
            // fixed unit
            return { area, unit };
        }
        // automatic recalculation of area
        if (area > 1000000) {
            // calculate square-kilometers
            return { area: area / 1000000, unit: 'square-kilometers' };
        }
        return { area: area, unit: 'square-meters' };
    }

    /**
     * Helper function to calculate polygon area.
     * Uses either geodesic or planar measurement according to map WKID.
     *
     * @param polygon Polygon
     * @param unit Unit of measurement
     * @returns number
     *
     * @private
     */
    private calculateGeometryArea(polygon: __esri.Polygon, unit: __esri.ArealUnits): number {
        if (this.shouldCalculateGeodesic(polygon.spatialReference)) {
            return geometryEngine.geodesicArea(polygon, unit);
        } else {
            return geometryEngine.planarArea(polygon, unit);
        }
    }

    /**
     * Helper function used to calculate angle between two points.
     *
     * @param point1 Point 1
     * @param point2 Point 2
     * @returns number
     *
     * @public
     */
    public getAngleBetweenTwoPoints(point1: __esri.Point, point2: __esri.Point): number {
        const quadrant = this.getQuadrant(point1, point2);
        const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
        if(isNaN(angle)) {
            return;
        }
        return this.adjustAngleToQuadrant(quadrant, angle);
    }

    /**
     * Helper function used to calculate angle between three points.
     *
     * @param centerPoint center point
     * @param nextPoint next point
     * @param previousPoint previous point
     * @returns number
     *
     * @public
     */
    public getAngleBetweenThreePoints(centerPoint: __esri.Point, nextPoint: __esri.Point,
        previousPoint: __esri.Point): number {
        const p2Quadrant = this.getQuadrant(nextPoint, centerPoint);
        const p3Quadrant = this.getQuadrant(previousPoint, centerPoint);
        const quadrant = [p2Quadrant, p3Quadrant].join(' ');
        const angle = this.calculateAngle(centerPoint, nextPoint, previousPoint, quadrant);
        if(isNaN(angle)) {
            return;
        }
        return angle;
    }

    /**
     * Helper function used to convert angles.
     *
     * @param angle angle
     * @param angleUnit angle unit
     * @returns angle
     */
    public convertAngle(angle: number, angleUnit: string): number {
        if(angleUnit === "gon") {
            return angle * (200/180);
        }
        return angle;
    }

    /**
     * Helper function to calculate angle at between two points adjusted to quadrant.
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
     * Helper function to calculate angle at between three points adjusted to quadrants.
     *
     * @param centerPoint
     * @param nextPoint
     * @param previousPoint
     * @param quadrantsString
     * @returns
     */
    private calculateAngle(centerPoint: __esri.Point, nextPoint: __esri.Point, previousPoint: __esri.Point,
        quadrantsString: string): number {
        // construction of right triangles from p1, p2 and p1, p3
        // calculating angle at p1
        const a = Math.atan((Math.abs(nextPoint.y - centerPoint.y) / Math.abs(nextPoint.x - centerPoint.x)))
         * 180 / Math.PI;
        const b = Math.atan((Math.abs(previousPoint.y - centerPoint.y) / Math.abs(previousPoint.x - centerPoint.x)))
         * 180 / Math.PI;
        let angle = 0;
        switch (quadrantsString) {
            case '1 1':
                angle = (Math.abs(b - a));
                if (b < a) angle = (360 - angle);
                break;
            case '2 1':
                angle = 360 - (360 - (a + b));
                break;
            case '3 1':
                angle = 360 - (180 + a - b);
                break;
            case '4 1':
                angle = 360 - (180 - (a + b));
                break;
            case '1 2':
                angle = 360 - (a + b);
                break;
            case '2 2':
                angle = (Math.abs(a - b));
                if (a < b) angle = (360 - angle);
                break;
            case '3 2':
                angle = 360 - (360 - (180 - (a + b)));
                break;
            case '4 2':
                angle = 360 - (180 - a + b);
                break;
            case '1 3':
                angle = 360 - (180 + a - b);
                break;
            case '2 3':
                angle = 360 - (180 - (a + b));
                break;
            case '3 3':
                angle = (Math.abs(b - a));
                if (b < a) angle = (360 - angle);
                break;
            case '4 3':
                angle = 360 - (360 - (a + b));
                break;
            case '1 4':
                angle = 360 - (360 - (180 - (a + b)));
                break;
            case '2 4':
                angle = 360 - (180 - a + b);
                break;
            case '3 4':
                angle = 360 - (a + b);
                break;
            case '4 4':
                angle = (Math.abs(a - b));
                if (a < b) angle = (360 - angle);
                break;
            default:
                console.warn("error");
                break;
        }

        return angle;
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
     * Helper function to transform the point into a the desired srs
     *
     * @param geometry
     * @param targetSrs
     * @returns geometry
     *
     * @private
     */
    private async transformGeometry(geometry: __esri.Geometry, wkid: number): Promise<__esri.Geometry> {
        return this.coordinateTransformer?.transform(geometry, wkid);
    }

    /**
     * Helper function used to determine whether planar or geodesic measurements will be used.
     *
     * @param spatialReference Used WKID
     * @returns boolean
     *
     * @private
     */
    private shouldCalculateGeodesic(spatialReference: __esri.SpatialReference): boolean {
        return (spatialReference.isWebMercator || spatialReference.wkid === 4326);
    }

    public formatNumber(area: number, places: number): string {
        const numberFormatIntlOptions = intl.convertNumberFormatToIntlOptions({
            places: places,
            digitSeparator: true
        });
        return intl.formatNumber(area, numberFormatIntlOptions);
    }
}
