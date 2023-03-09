<!--

    Copyright (C) 2022 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-container class="pa-2 fullHeight">
        <v-switch
            v-model="measurementEnabled"
            :label="i18n.measurementEnabled"
            color="primary"
            class="mt-2 mb-2"
            hide-details
        />
        <measurement-text
            v-if="activeUi ==='point'"
            :disabled="!measurementEnabled"
            :i18n="i18n"
            :value="x"
            :label="i18n.x"
            :prefix="pointCoordUnitSymbolX"
            :placeholder="i18n.hint"
        />
        <measurement-text
            v-if="activeUi ==='point'"
            :disabled="!measurementEnabled"
            :i18n="i18n"
            :value="y"
            :label="i18n.y"
            :prefix="pointCoordUnitSymbolY"
        />
        <measurement-text
            v-if="activeUi ==='polyline'"
            :disabled="!measurementEnabled"
            :i18n="i18n"
            :value="length"
            :label="i18n.length"
            :suffix="lengthUnitAbbreviation"
        />
        <measurement-text
            v-if="activeUi ==='polygon'"
            :disabled="!measurementEnabled"
            :i18n="i18n"
            :value="circumference"
            :label="i18n.circumference"
            :suffix="lengthUnitAbbreviation"
        />
        <measurement-text
            v-if="activeUi ==='polygon'"
            :disabled="!measurementEnabled"
            :i18n="i18n"
            :value="area"
            :label="i18n.area"
            :suffix="areaUnitAbbreviation"
        />
        <v-expansion-panel
            v-if="activeUi === 'polyline' || activeUi === 'polygon'"
            :disabled="!measurementEnabled"
            class="mt-2"
        >
            <v-expansion-panel-content expand-icon="settings">
                <template #header>
                    <div>{{ i18n.settings }}</div>
                </template>
                <v-card class="pa-2 dn_sketchingenhanced--settings-menu">
                    <v-switch
                        v-if="activeTool ==='polyline'"
                        v-model="lineMeasurementForPolylinesEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.lineMeasurementForPolylinesEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeTool ==='polyline'"
                        v-model="angleMeasurementForPolylinesEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.angleMeasurementForPolylinesEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeUi ==='polyline'"
                        v-model="totalLengthMeasurementForPolylinesEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.totalLengthMeasurementForPolylinesEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeTool ==='polygon' || activeTool ==='rectangle'"
                        v-model="lineMeasurementForPolygonsEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.lineMeasurementForPolygonsEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeTool ==='polygon' || activeTool ==='rectangle'"
                        v-model="angleMeasurementForPolygonsEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.angleMeasurementForPolygonsEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeUi ==='polygon'"
                        v-model="areaMeasurementForPolygonsEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.areaMeasurementForPolygonsEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-switch
                        v-if="activeUi ==='polygon'"
                        v-model="circumferenceMeasurementForPolygonsEnabled"
                        :disabled="!measurementEnabled"
                        :label="i18n.circumferenceMeasurementForPolygonsEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    />
                    <v-select
                        v-if="activeUi ==='polyline' || activeUi ==='polygon'"
                        v-model="lengthUnit"
                        :items="lengthUnits"
                        :label="i18n.lengthUnit"
                        item-value="name"
                        item-text="title"
                        hide-details
                    />
                    <v-select
                        v-if="activeUi ==='polygon'"
                        v-model="areaUnit"
                        :items="areaUnits"
                        :label="i18n.areaUnit"
                        item-value="name"
                        item-text="title"
                        hide-details
                    />
                    <v-select
                        v-if="activeUi ==='polyline' || activeUi ==='polygon'"
                        v-model="angleUnit"
                        :items="angleUnits"
                        :label="i18n.angleUnit"
                        item-value="name"
                        item-text="title"
                        hide-details
                    />
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-container>
</template>

<script>
    import Bindable from "apprt-vue/mixins/Bindable";
    import MeasurementText from './components/MeasurementText.vue';

    export default {
        components: {
            "measurement-text": MeasurementText
        },
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            activeUi: {
                type: String,
                default: undefined
            },
            activeTool: {
                type: String,
                default: undefined
            }
        },
        data() {
            return {
                measurementEnabled: true,
                lineMeasurementForPolylinesEnabled: true,
                angleMeasurementForPolylinesEnabled: true,
                totalLengthMeasurementForPolylinesEnabled: true,
                lineMeasurementForPolygonsEnabled: true,
                angleMeasurementForPolygonsEnabled: true,
                areaMeasurementForPolygonsEnabled: true,
                circumferenceMeasurementForPolygonsEnabled: true,
                lengthUnit: "meters",
                lengthUnitAbbreviation: "m",
                lengthUnits: [],
                areaUnit: "square-meters",
                areaUnitAbbreviation: "m²",
                areaUnits: [],
                angleUnit: "degrees",
                angleUnits: [],
                pointCoordUnitSymbolX: "X",
                pointCoordUnitSymbolY: "Y",
                x: undefined,
                y: undefined,
                length: undefined,
                area: undefined,
                circumference: undefined
            };
        },
        created() {
            this.$emit("created", this);
        }
    };
</script>
