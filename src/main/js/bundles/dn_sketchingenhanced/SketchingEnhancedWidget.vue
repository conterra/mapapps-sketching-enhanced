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
    <div class="fullHeight">
        <v-toolbar
            flat
            dense
            pa-0
        >
            <v-btn
                icon
                :disabled="!canUndo"
                @click="$emit('undo')"
            >
                <v-icon>undo</v-icon>
            </v-btn>
            <v-btn
                icon
                :disabled="!canRedo"
                @click="$emit('redo')"
            >
                <v-icon>redo</v-icon>
            </v-btn>
            <v-btn
                icon
                :disabled="!activeTool"
                @click="$emit('cancel')"
            >
                <v-icon>cancel</v-icon>
            </v-btn>
            <v-btn
                :input-value="activeUi === 'edit'"
                icon
                @click="$emit('edit')"
            >
                <v-icon>edit</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
                :input-value="activeUi === 'settings'"
                icon
                @click="$emit('settings')"
            >
                <v-icon>icon-drawing-settings</v-icon>
            </v-btn>
        </v-toolbar>
        <div class="ct-flex-container ct-flex-container--row">
            <div class="left ct-flex-item ct-flex-item--no-grow ct-flex-item--no-shrink overflowAuto">
                <navigation
                    :i18n="i18n"
                    :active-tool.sync="activeTool"
                    @activate-tool="$emit('activate-tool', $event)"
                />
            </div>
            <div class="center ct-flex-item overflowAuto pa-3">
                <div v-show="activeUi === 'settings'">
                    <div class="title my-2">{{ i18n.settings }}</div>
                    <div class="subheading my-2">{{ i18n.snappingSettings }}</div>
                    <v-switch
                        v-model="snappingEnabled"
                        :label="i18n.snappingEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    ></v-switch>
                    <v-switch
                        v-model="snappingSelfEnabled"
                        :label="i18n.snappingSelfEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    ></v-switch>
                    <v-switch
                        v-model="snappingFeatureEnabled"
                        :label="i18n.snappingFeatureEnabled"
                        color="primary"
                        class="mt-1"
                        hide-details
                    ></v-switch>
                    <div class="subheading my-2">{{ i18n.snappingFeatureSources }}</div>
                    <v-checkbox
                        v-for="snappingFeatureSource in snappingFeatureSources"
                        :key="snappingFeatureSource.id"
                        v-model="snappingFeatureSource.enabled"
                        :label="snappingFeatureSource.title"
                        hide-details
                        class="mt-1"
                        @change="changeFeatureSource(snappingFeatureSource)"
                    />
                </div>
                <div v-if="activeUi === 'edit'">
                    <v-alert
                        :value="true"
                        type="info"
                    >
                        {{ i18n.editHint }}
                    </v-alert>
                </div>
                <div v-else>
                    <symbol-settings
                        :i18n="i18n.symbolSettings"
                        :active-ui="activeUi"
                        :point-symbol.sync="pointSymbol"
                        :polyline-symbol.sync="polylineSymbol"
                        :polygon-symbol.sync="polygonSymbol"
                        :text-symbol.sync="textSymbol"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";
    import Navigation from "./Navigation.vue";
    import SymbolSettings from "./SymbolSettings.vue";

    export default {
        components: {
            "navigation": Navigation,
            "symbol-settings": SymbolSettings
        },
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            activeTool: {
                type: String,
                default: undefined
            },
            activeUi: {
                type: String,
                default: undefined
            },
            canUndo: {
                type: Boolean,
                default: false
            },
            canRedo: {
                type: Boolean,
                default: false
            },
            snappingEnabled: {
                type: Boolean,
                default: false
            },
            snappingFeatureEnabled: {
                type: Boolean,
                default: false
            },
            snappingSelfEnabled: {
                type: Boolean,
                default: false
            },
            snappingFeatureSources: {
                type: Array,
                default: () => []
            },
            pointSymbol: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            polylineSymbol: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            polygonSymbol: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            textSymbol: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        methods: {
            changeFeatureSource(featureSource) {
                this.$emit("feature-source-changed", featureSource);
            }
        }
    };
</script>
