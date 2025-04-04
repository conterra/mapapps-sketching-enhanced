<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

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
            <v-tooltip
                bottom
                :disabled="!canUndo"
            >
                <template #activator="{ on }">
                    <v-btn
                        icon
                        :disabled="!canUndo"
                        @click="$emit('undo')"
                        v-on="on"
                    >
                        <v-icon>undo</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.undo }}</span>
            </v-tooltip>
            <v-tooltip
                bottom
                :disabled="!canRedo"
            >
                <template #activator="{ on }">
                    <v-btn
                        icon
                        :disabled="!canRedo"
                        @click="$emit('redo')"
                        v-on="on"
                    >
                        <v-icon>redo</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.redo }}</span>
            </v-tooltip>
            <v-tooltip
                bottom
            >
                <template #activator="{ on }">
                    <v-btn
                        icon
                        @click="$emit('cancel')"
                        v-on="on"
                    >
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.cancel }}</span>
            </v-tooltip>
            <v-tooltip
                bottom
                :disabled="editEnabled"
            >
                <template #activator="{ on }">
                    <v-btn
                        :input-value="editEnabled"
                        icon
                        @click="$emit('edit')"
                        v-on="on"
                    >
                        <v-icon>edit</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.edit }}</span>
            </v-tooltip>
            <v-tooltip
                v-if="duplicateAvailable"
                :disabled="!canDuplicate"
                bottom
            >
                <template #activator="{ on }">
                    <v-btn
                        :disabled="!canDuplicate"
                        icon
                        @click="$emit('duplicate')"
                        v-on="on"
                    >
                        <v-icon>content_copy</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.duplicate }}</span>
            </v-tooltip>
            <v-tooltip
                bottom
                :disabled="!canDelete"
            >
                <template #activator="{ on }">
                    <v-btn
                        :disabled="!canDelete"
                        icon
                        @click="$emit('delete')"
                        v-on="on"
                    >
                        <v-icon>delete</v-icon>
                    </v-btn>
                </template>
                <span>{{ i18n.delete }}</span>
            </v-tooltip>
            <v-spacer />
            <v-dialog
                v-model="deleteAllDialog"
                width="500"
            >
                <template #activator="{ on }">
                    <v-btn
                        flat
                        outline
                        color="error"
                        v-on="on"
                    >
                        <v-icon left>
                            delete
                        </v-icon>
                        {{ i18n.deleteAll.buttonLabel }}
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title
                        class="title"
                        primary-title
                    >
                        {{ i18n.deleteAll.attention }}
                    </v-card-title>
                    <v-card-text>
                        {{ i18n.deleteAll.hint }}
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="secondary"
                            flat
                            @click="deleteAllDialog = false"
                        >
                            {{ i18n.deleteAll.cancel }}
                        </v-btn>
                        <v-btn
                            color="primary"
                            flat
                            @click="deleteAllDialog = false;$emit('delete-all')"
                        >
                            {{ i18n.deleteAll.continue }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <div class="ct-flex-container ct-flex-container--row sketching-enhanced--container">
            <div class="left ct-flex-item ct-flex-item--no-grow ct-flex-item--no-shrink overflowAuto">
                <navigation
                    class="sketching-enhanced--navigation"
                    :i18n="i18n"
                    :active-ui="activeUi"
                    :active-tool.sync="activeTool"
                    @activate-tool="$emit('activate-tool', $event)"
                />
            </div>
            <div class="center ct-flex-item px-3">
                <v-tabs
                    v-model="activeTab"
                    slider-color="primary"
                    grow
                >
                    <v-tab
                        ripple
                    >
                        {{ i18n.tabs.sketching }}
                    </v-tab>
                    <v-tab
                        v-if="constructionWidget"
                        :disabled="activeTool !== 'circle' && activeTool !== 'polyline'"
                        ripple
                    >
                        {{ i18n.tabs.construction }}
                    </v-tab>
                    <v-tab
                        ripple
                    >
                        {{ i18n.tabs.snapping }}
                    </v-tab>
                    <v-tab
                        v-if="measurementWidget"
                        :disabled="activeUi === 'text' || activeUi === 'arrow'"
                        ripple
                    >
                        {{ i18n.tabs.measurement }}
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
                                class="sketching-enhanced--symbol-settings"
                                :i18n="i18n.symbolSettings"
                                :active-ui="activeUi"
                                :point-symbol.sync="pointSymbol"
                                :polyline-symbol.sync="polylineSymbol"
                                :polygon-symbol.sync="polygonSymbol"
                                :text-symbol.sync="textSymbol"
                                :arrow-symbol.sync="arrowSymbol"
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
                                class="sketching-enhanced--symbol-settings"
                                :i18n="i18n.symbolSettings"
                                :active-ui="activeUi"
                                :point-symbol.sync="editSymbol"
                                :polyline-symbol.sync="editSymbol"
                                :polygon-symbol.sync="editSymbol"
                                :text-symbol.sync="editSymbol"
                                :arrow-symbol.sync="editSymbol"
                            />
                        </div>
                    </v-tab-item>
                    <v-tab-item v-if="constructionWidget">
                        <component
                            :is="constructionWidgetInstance.view"
                            :active-ui="activeUi"
                            :active-tool="activeTool"
                            v-bind="{ ...constructionWidgetInstance.props }"
                            v-on="constructionWidgetInstance.events"
                        />
                    </v-tab-item>
                    <v-tab-item>
                        <snapping-settings
                            :i18n="i18n.snappingSettings"
                            :snapping-enabled.sync="snappingEnabled"
                            :snapping-feature-enabled.sync="snappingFeatureEnabled"
                            :snapping-self-enabled.sync="snappingSelfEnabled"
                            :snapping-feature-sources.sync="snappingFeatureSources"
                            @feature-source-changed="$emit('feature-source-changed', $event)"
                        />
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
    import NavigationPanel from "./components/NavigationPanel.vue";
    import SymbolSettings from "./components/SymbolSettings.vue";
    import SnappingSettings from "./components/SnappingSettings.vue";

    export default {
        components: {
            "navigation": NavigationPanel,
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
            activeTab: {
                type: Number,
                default: undefined
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
            canDuplicate: {
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
            duplicateAvailable: {
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
            arrowSymbol: {
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
            constructionWidget: {
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
        data: function() {
            return {
                deleteAllDialog: false
            };
        },
        computed: {
            constructionWidgetInstance() {
                return this.constructionWidget();
            },
            measurementWidgetInstance() {
                return this.measurementWidget();
            }
        }
    };
</script>
