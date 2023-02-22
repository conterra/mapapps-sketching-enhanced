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
    textSymbol: __esri.TextSymbol,
    distanceUnit: __esri.LinearUnits,
    areaUnit: __esri.ArealUnits,
    distanceUnits: Array<any>,
    areaUnits: Array<any>
}): Impl & MutableType<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class SketchingEnhancedModel extends Mutable {
}

interface SketchingEnhancedModelProps {
    textSymbol: __esri.TextSymbol,
    distanceUnit: __esri.LinearUnits,
    areaUnit: __esri.ArealUnits,
    distanceUnits: Array<any>,
    areaUnits: Array<any>
}

export default defineProperties<SketchingEnhancedModel, SketchingEnhancedModelProps>(SketchingEnhancedModel,
    {
        textSymbol: undefined,
        distanceUnit: "meters",
        areaUnit: "square-meters",
        distanceUnits: [],
        areaUnits: []
    });
