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

function defineProperties<Impl, P>(mutableDefinition: any, mutableProperties: P): Impl & MutableType<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class SketchingEnhancedModel extends Mutable {
    activate() {
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
    lengthUnit: __esri.LinearUnits | 'auto',
    lengthUnitAbbreviation: string,
    lengthUnits: Array<any>,
    area: string,
    areaUnit: __esri.ArealUnits | 'auto',
    areaUnitAbbreviation: string,
    areaUnits: Array<any>,
    angleUnit: 'degrees' | 'auto',
    angleUnitAbbreviation: string,
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
        lengthUnit: "auto",
        lengthUnitAbbreviation: "m",
        lengthUnits: [],
        area: undefined,
        areaUnit: "auto",
        areaUnitAbbreviation: "m²",
        areaUnits: [],
        angleUnit: "degrees",
        angleUnitAbbreviation: "°",
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
