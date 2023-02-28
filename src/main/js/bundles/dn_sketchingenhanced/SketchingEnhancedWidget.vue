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
                @click="$emit('cancel')"
            >
                <v-icon>cancel</v-icon>
            </v-btn>
            <v-btn
                :input-value="editEnabled"
                icon
                @click="$emit('edit')"
            >
                <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
                :disabled="!canDelete"
                icon
                @click="$emit('delete')"
            >
                <v-icon>delete</v-icon>
            </v-btn>
            <v-spacer />
            <v-menu
                offset-x
                :close-on-content-click="false"
            >
                <template #activator="{ on }">
                    <v-btn
                        flat
                        color="secondary"
                        class="ct-flex-item"
                        v-on="on"
                    >
                        {{ i18n.settings }}
                        <v-icon right>
                            icon-drawing-settings
                        </v-icon>
                    </v-btn>
                </template>
                <v-card class="pa-2 dn_sketchingenhanced--settings-menu">
                    <div class="title mb-2">
                        {{ i18n.settings }}
                    </div>
                    <snapping-settings
                        :i18n="i18n.snappingSettings"
                        :snapping-enabled.sync="snappingEnabled"
                        :snapping-feature-enabled.sync="snappingFeatureEnabled"
                        :snapping-self-enabled.sync="snappingSelfEnabled"
                        :snapping-feature-sources.sync="snappingFeatureSources"
                        @feature-source-changed="$emit('feature-source-changed', $event)"
                    />
                </v-card>
            </v-menu>
        </v-toolbar>
        <div class="ct-flex-container ct-flex-container--row">
            <div class="left ct-flex-item ct-flex-item--no-grow ct-flex-item--no-shrink overflowAuto">
                <navigation
                    class="dn_sketchingenhanced--navigation"
                    :i18n="i18n"
                    :active-ui="activeUi"
                    :active-tool.sync="activeTool"
                    @activate-tool="$emit('activate-tool', $event)"
                />
            </div>
            <div class="center ct-flex-item overflowAuto px-3">
                <v-tabs
                    slider-color="primary"
                >
                    <v-tab
                        ripple
                    >
                        Zeichnen
                    </v-tab>
                    <v-tab
                        v-if="measurementWidget"
                        ripple
                    >
                        Messen
                    </v-tab>
                    <v-tab-item>
                        <div v-if="!editEnabled">
                            <div v-if="!activeTool">
                                <v-alert
                                    :value="true"
                                    type="info"
                                >
                                    {{ i18n.toolHint }}
                                </v-alert>
                            </div>
                            <symbol-settings
                                class="dn_sketchingenhanced--symbol-settings"
                                :i18n="i18n.symbolSettings"
                                :active-ui="activeUi"
                                :point-symbol.sync="pointSymbol"
                                :polyline-symbol.sync="polylineSymbol"
                                :polygon-symbol.sync="polygonSymbol"
                                :text-symbol.sync="textSymbol"
                            />
                        </div>
                        <div v-else>
                            <v-alert
                                :value="true"
                                type="info"
                            >
                                {{ i18n.editHint }}
                            </v-alert>
                            <symbol-settings
                                v-if="editSymbol"
                                :i18n="i18n.symbolSettings"
                                :active-ui="activeUi"
                                :point-symbol.sync="editSymbol"
                                :polyline-symbol.sync="editSymbol"
                                :polygon-symbol.sync="editSymbol"
                                :text-symbol.sync="editSymbol"
                            />
                        </div>
                    </v-tab-item>
                    <v-tab-item v-if="measurementWidget">
                        <component
                            :is="measurementWidgetInstance.view"
                            :active-ui="activeUi"
                            :active-tool="activeTool"
                            v-bind="{ ...measurementWidgetInstance.props }"
                            v-on="measurementWidgetInstance.events"
                        />
                    </v-tab-item>
                </v-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";
    import Navigation from "./components/Navigation.vue";
    import SymbolSettings from "./components/SymbolSettings.vue";
    import SnappingSettings from "./components/SnappingSettings.vue";

    export default {
        components: {
            "navigation": Navigation,
            "symbol-settings": SymbolSettings,
            "snapping-settings": SnappingSettings
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
            canDelete: {
                type: Boolean,
                default: false
            },
            editEnabled: {
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
            },
            editSymbol: {
                type: Object,
                default: function () {
                    return undefined;
                }
            },
            measurementWidget: {
                type: Object,
                default: function () {
                    return undefined;
                }
            }
        },
        computed: {
            measurementWidgetInstance() {
                return this.measurementWidget();
            }
        }
    };
</script>
