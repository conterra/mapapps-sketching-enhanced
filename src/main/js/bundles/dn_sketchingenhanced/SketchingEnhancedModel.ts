///
/// Copyright (C) 2024 con terra GmbH (info@conterra.de)
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

import { Mutable, properties } from "apprt-core/Mutable";
import EsriSymbol from "esri/symbols/Symbol";

function defineProperties<Impl, P>(mutableDefinition: any, mutableProperties: P): Impl & Mutable<P> {
    properties(mutableDefinition, mutableProperties);
    return mutableDefinition;
}

class SketchingEnhancedModel extends Mutable {
}

interface SketchingEnhancedModelProps {
    initialActiveTool: string,
    activeTab: number,
    activeTool: string,
    activeUi: string,
    canUndo: boolean,
    canRedo: boolean,
    canDelete: boolean,
    canDuplicate: boolean,
    editEnabled: boolean,
    duplicateEnabled: boolean,
    snappingEnabled: boolean,
    snappingFeatureEnabled: boolean,
    snappingSelfEnabled: boolean,
    snappingFeatureSources: object[],
    snappingGroupLayerId: string,
    pointSymbol: EsriSymbol,
    polylineSymbol: EsriSymbol,
    polygonSymbol: EsriSymbol,
    textSymbol: EsriSymbol,
    arrowSymbol: EsriSymbol,
    editSymbol: EsriSymbol,
    lengthUnit: string,
    areaUnit: string,
    sketchViewModel: __esri.SketchViewModel,
    duplicateAvailable: boolean
}

export default defineProperties<SketchingEnhancedModel, SketchingEnhancedModelProps>(SketchingEnhancedModel,
    {
        initialActiveTool: "point",
        activeTab: 0,
        activeTool: undefined,
        activeUi: undefined,
        canUndo: false,
        canRedo: false,
        canDelete: false,
        canDuplicate: false,
        editEnabled: false,
        duplicateEnabled: false,
        snappingEnabled: true,
        snappingFeatureEnabled: true,
        snappingSelfEnabled: true,
        snappingFeatureSources: [],
        snappingGroupLayer: null,
        pointSymbol: {},
        polylineSymbol: {},
        polygonSymbol: {},
        textSymbol: {},
        arrowSymbol: {},
        editSymbol: undefined,
        lengthUnit: "meters",
        areaUnit: "square-meters",
        sketchViewModel: undefined,
        duplicateAvailable: false
    });
