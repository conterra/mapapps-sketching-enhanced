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
    textSymbol: __esri.TextSymbol,
    lengthUnit: __esri.LinearUnits,
    areaUnit: __esri.ArealUnits,
    lengthUnits: Array<any>,
    areaUnits: Array<any>,
    length: string,
    area: string,
    x: string,
    y: string
}): Impl & MutableType<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class SketchingEnhancedModel extends Mutable {
}

interface SketchingEnhancedModelProps {
    measurementEnabled: boolean,
    textSymbol: __esri.TextSymbol,
    lengthUnit: __esri.LinearUnits,
    areaUnit: __esri.ArealUnits,
    lengthUnits: Array<any>,
    areaUnits: Array<any>,
    length: string,
    area: string
    x: string,
    y: string
}

export default defineProperties<SketchingEnhancedModel, SketchingEnhancedModelProps>(SketchingEnhancedModel,
    {
        measurementEnabled: false,
        textSymbol: undefined,
        lengthUnit: "meters",
        areaUnit: "square-meters",
        lengthUnits: [],
        areaUnits: [],
        length: undefined,
        area: undefined,
        x: undefined,
        y: undefined
    });
