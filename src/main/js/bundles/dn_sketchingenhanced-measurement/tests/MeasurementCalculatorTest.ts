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

import { assert } from "chai";
import MeasurementModel from "../MeasurementModel";
import MeasurementCalculator from "../MeasurementCalculator";
import Point from "esri/geometry/Point";
import Polyline from "esri/geometry/Polyline";
import Polygon from "esri/geometry/Polygon";

let measurementCalculator: MeasurementCalculator;

describe(module.id, function(){
    beforeEach(function () {
        measurementCalculator = createMeasurementCalculator();
    });

    it("expect getPointCoordinates calculation is correct", async function () {
        const point = createPoint();
        const {x, y} = await measurementCalculator.getPointCoordinates(point);
        assert.equal(x, "7.629");
        assert.equal(y, "51.963");
    });

    it("expect getLengthAndUnit calculation for Polylines < 1000m is correct", function () {
        const polyline = createShortPolyline();
        const {length, unit} = measurementCalculator.getLengthAndUnit(polyline, "auto");
        assert.closeTo(length, 991.948, 0.001);
        assert.equal(unit, "meters");
    });

    it("expect getLengthAndUnit calculation for Polylines > 1000m is correct", function () {
        const polyline = createLongPolyline();
        const {length, unit} = measurementCalculator.getLengthAndUnit(polyline, "auto");
        assert.closeTo(length, 720.402, 0.001);
        assert.equal(unit, "kilometers");
    });

    it("expect getLengthAndUnit calculation for Polygones < 1000m is correct", function () {
        const polygon = createSmallPolygon();
        const {length, unit} = measurementCalculator.getLengthAndUnit(polygon);
        assert.closeTo(length, 825.919, 0.001);
        assert.equal(unit, "meters");
    });

    it("expect getLengthAndUnit calculation for Polygones > 1000m is correct", function () {
        const polygon = createLargePolygon();
        const {length, unit} = measurementCalculator.getLengthAndUnit(polygon);
        assert.closeTo(length, 59.659, 0.001);
        assert.equal(unit, "kilometers");
    });

    it("expect getAreaAndUnit calculation for Polygones < 1000000m² is correct", function () {
        const polygon = createSmallPolygon();
        const {area, unit} = measurementCalculator.getAreaAndUnit(polygon);
        assert.closeTo(area, 19224.443, 0.001);
        assert.equal(unit, "square-meters");
    });

    it("expect getAngleBetweenTwoPoints calculation is correct", function () {
        const point1 = createPoint1();
        const point2 = createPoint2();
        const angle = measurementCalculator.getAngleBetweenTwoPoints(point1, point2);
        assert.closeTo(angle, 72.920, 0.001);
    });

    it("expect getAngleBetweenThreePoints calculation is correct", function () {
        const point1 = createPoint1();
        const point2 = createPoint2();
        const point3 = createPoint3();
        const angle = measurementCalculator.getAngleBetweenThreePoints(point1, point2, point3);
        assert.closeTo(angle, 28.973, 0.001);
    });

    it("expect convertAngle calculation is correct", async function () {
        const angle = 85;
        const gonAngle = await measurementCalculator.convertAngle(angle, "gon");
        assert.closeTo(gonAngle, 94.444, 0.001);
    });
});

function createMeasurementCalculator(): MeasurementCalculator {
    const measurementModel = new MeasurementModel();
    const coordinateTransformer = createCoordinateTransformerMock();
    return new MeasurementCalculator(measurementModel, coordinateTransformer);
}

function createCoordinateTransformerMock() {
    return {
        transform(geometry: __esri.Geometry) {
            return geometry;
        }
    };
}

function createPoint(): __esri.Point {
    return new Point({
        x: 7.628694,
        y: 51.962944,
        spatialReference: {
            wkid: 4326
        }
    });
}

function createPoint1(): __esri.Point {
    return new Point({
        x: 748428.0751303822,
        y: 6696639.331922248,
        spatialReference: {
            wkid: 3857
        }
    });
}

function createPoint2(): __esri.Point {
    return new Point({
        x: 748559.4512727509,
        y: 6696211.762295267,
        spatialReference: {
            wkid: 3857
        }
    });
}

function createPoint3(): __esri.Point {
    return new Point({
        x: 749089.7331564933,
        y: 6696001.560467477,
        spatialReference: {
            wkid: 3857
        }
    });
}

function createShortPolyline(): __esri.Polyline {
    return new Polyline({
        "paths":[[
            [748428.0751303822, 6696639.331922248],
            [748559.4512727509, 6696211.762295267],
            [749089.7331564933, 6696001.560467477],
            [748975.0776140625, 6696281.0333521515],
            [749176.0563804391, 6696342.834850154],
            [749120.8225586425, 6696364.729338073]]
        ],
        "spatialReference":{
            "wkid":3857
        }
    });
}

function createLongPolyline(): __esri.Polyline {
    return new Polyline({
        "paths":[[
            [751545.272690171, 6713006.410603775],
            [787012.0538144757, 6576642.752143087],
            [942943.5915161599, 6588566.928555569],
            [924292.9566145861, 6717592.6323008835],
            [993697.7782974925, 6780576.743607839],
            [1060045.1188489934, 6693744.27947592],
            [1060350.8669621341, 6845395.3435936365],
            [900606.9939524508, 6881452.898586476],
            [816669.6207891097, 6825215.968126359],
            [813306.3915445636, 6712700.662490634]
        ]],
        "spatialReference":{
            "wkid":3857
        }
    });
}

function createSmallPolygon(): __esri.Polygon {
    return new Polygon({
        "rings":[[
            [753389.3159974946, 6685489.080421104],
            [753604.2951395619, 6685363.078757317],
            [753483.6679542828, 6685345.16382881],
            [753429.9231687625, 6685238.271422053],
            [753550.5503540415, 6685238.868586336],
            [753505.1658684909, 6685115.255579639],
            [753358.2634547529, 6685066.288108391],
            [753389.3159974946, 6685489.080421104]
        ]],
        "spatialReference":{
            "wkid":3857
        }
    });
}

function createLargePolygon(): __esri.Polygon {
    return new Polygon({
        "rings":[[
            [751547.0641829829, 6676977.100724452],
            [759190.7670114903, 6676059.856385032],
            [764373.8207622514, 6679733.896168355],
            [760528.415006479, 6690850.421358193],
            [772108.6247916677, 6691117.950957191],
            [775013.2318665005, 6679996.363341712],
            [771032.1573648702, 6663820.766275032],
            [754298.7972012456, 6664173.898486703],
            [751547.0641829829, 6676977.100724452]
        ]],
        "spatialReference":{
            "wkid":3857
        }
    });
}
