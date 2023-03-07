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

import {Mutable, properties} from "apprt-core/Mutable";
import type {Mutable as MutableType} from "@conterra/ct-mapapps-typings/apprt-core/Mutable";

function defineProperties<Impl, P>(mutableDefinition: any, mutableProperties: {
    measurementEnabled: boolean,
    totalLengthMeasurementForPolylinesEnabled: boolean,
    lineMeasurementForPolylinesEnabled: boolean,
    angleMeasurementForPolylinesEnabled: boolean,
    lineMeasurementForPolygonsEnabled: boolean,
    angleMeasurementForPolygonsEnabled: boolean,
    areaMeasurementForPolygonsEnabled: boolean,
    circumferenceMeasurementForPolygonsEnabled: boolean,
    textSymbol: __esri.TextSymbol,
    length: string,
    lengthUnit: __esri.LinearUnits,
    lengthUnitAbbreviation: string,
    lengthUnitDecimalPlaces: number,
    lengthUnits: Array<any>,
    area: string,
    areaUnit: __esri.ArealUnits,
    areaUnitAbbreviation: string,
    areaUnitDecimalPlaces: number,
    areaUnits: Array<any>,
    angleUnit: string,
    angleUnitAbbreviation: string,
    angleUnitDecimalPlaces: number,
    angleUnits: Array<any>,
    circumference: string,
    x: string,
    y: string,
    pointCoordSpatialReference: __esri.SpatialReference
    pointCoordPlaces: number,
    pointCoordUnitSymbolX: string,
    pointCoordUnitSymbolY: string,
    deleteClicked: boolean
}): Impl & MutableType<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class SketchingEnhancedModel extends Mutable {
    activate() {
        this.watch("lengthUnit", ({value}) => {
            const lengthUnitObj = this.lengthUnits.find((unit) =>
                unit.name === value);
            if(lengthUnitObj) {
                this.lengthUnitAbbreviation = lengthUnitObj.abbreviation;
                this.lengthUnitDecimalPlaces = lengthUnitObj.decimalPlaces;
            }
        });
        this.watch("areaUnit", ({value}) => {
            const areaUnitObj = this.areaUnits.find((unit) =>
                unit.name === value);
            if(areaUnitObj) {
                this.areaUnitAbbreviation = areaUnitObj.abbreviation;
                this.areaUnitDecimalPlaces = areaUnitObj.decimalPlaces;
            }
        });
        this.watch("angleUnit", ({value}) => {
            const angleUnitObj = this.angleUnits.find((unit) =>
                unit.name === value);
            if(angleUnitObj) {
                this.angleUnitAbbreviation = angleUnitObj.abbreviation;
                this.angleUnitDecimalPlaces = angleUnitObj.decimalPlaces;
            }
        });
    }
}

interface SketchingEnhancedModelProps {
    measurementEnabled: boolean,
    totalLengthMeasurementForPolylinesEnabled: boolean,
    lineMeasurementForPolylinesEnabled: boolean,
    angleMeasurementForPolylinesEnabled: boolean,
    lineMeasurementForPolygonsEnabled: boolean,
    angleMeasurementForPolygonsEnabled: boolean,
    areaMeasurementForPolygonsEnabled: boolean,
    circumferenceMeasurementForPolygonsEnabled: boolean,
    textSymbol: __esri.TextSymbol,
    length: string,
    lengthUnit: __esri.LinearUnits,
    lengthUnitAbbreviation: string,
    lengthUnitDecimalPlaces: number,
    lengthUnits: Array<any>,
    area: string,
    areaUnit: __esri.ArealUnits,
    areaUnitAbbreviation: string,
    areaUnitDecimalPlaces: number,
    areaUnits: Array<any>,
    angleUnit: string,
    angleUnitAbbreviation: string,
    angleUnitDecimalPlaces: number,
    angleUnits: Array<any>,
    circumference: string,
    x: string,
    y: string,
    pointCoordSpatialReference: __esri.SpatialReference
    pointCoordPlaces: number,
    pointCoordUnitSymbolX: string,
    pointCoordUnitSymbolY: string,
    deleteClicked: boolean
}

export default defineProperties<SketchingEnhancedModel, SketchingEnhancedModelProps>(SketchingEnhancedModel,
    {
        measurementEnabled: true,
        totalLengthMeasurementForPolylinesEnabled: true,
        lineMeasurementForPolylinesEnabled: true,
        angleMeasurementForPolylinesEnabled: true,
        lineMeasurementForPolygonsEnabled: true,
        angleMeasurementForPolygonsEnabled: true,
        areaMeasurementForPolygonsEnabled: true,
        circumferenceMeasurementForPolygonsEnabled: true,
        textSymbol: undefined,
        length: undefined,
        lengthUnit: "meters",
        lengthUnitAbbreviation: "m",
        lengthUnitDecimalPlaces: 2,
        lengthUnits: [],
        area: undefined,
        areaUnit: "square-meters",
        areaUnitAbbreviation: "m²",
        areaUnitDecimalPlaces: 2,
        areaUnits: [],
        angleUnit: "degrees",
        angleUnitAbbreviation: "°",
        angleUnitDecimalPlaces: 0,
        angleUnits: [],
        circumference: undefined,
        x: undefined,
        y: undefined,
        pointCoordSpatialReference: undefined,
        pointCoordPlaces: 3,
        pointCoordUnitSymbolX: "",
        pointCoordUnitSymbolY: "",
        deleteClicked: false
    });
