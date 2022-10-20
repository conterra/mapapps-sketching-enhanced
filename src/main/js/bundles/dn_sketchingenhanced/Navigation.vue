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
    <v-card class="navigation fullHeight">
        <v-list class="pa-0">
            <v-list>
                <v-list-tile
                    :value="activeTool === 'point'"
                    @click="activateTool('point')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-draw-point</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.pointTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-list-group
                :value="activeTool === 'polyline' || activeTool === 'polyline_freehand'"
                no-action
            >
                <template #activator>
                    <v-list-tile :value="activeTool === 'polyline' || activeTool === 'polyline_freehand'">
                        <v-list-tile-action>
                            <v-icon>icon-polyline</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ i18n.polylineTools }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-list-tile
                    :value="activeTool === 'polyline'"
                    @click="activateTool('polyline')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-polyline</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.polylineTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    :value="activeTool === 'polyline_freehand'"
                    @click="activateTool('polyline_freehand')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-polyline-freeform</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.freehandPolylineTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
            <v-list-group
                :value="activeTool === 'polygon' || activeTool === 'polygon_freehand'
                    || activeTool === 'circle' || activeTool === 'rectangle'"
                no-action
            >
                <template #activator>
                    <v-list-tile
                        :value="activeTool === 'polygon' || activeTool === 'polygon_freehand'
                            || activeTool === 'circle' || activeTool === 'rectangle'"
                    >
                        <v-list-tile-action>
                            <v-icon>icon-line</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ i18n.polygonTools }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-list-tile
                    :value="activeTool === 'polygon'"
                    @click="activateTool('polygon')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-polygon</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.polygonTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    :value="activeTool === 'polygon_freehand'"
                    @click="activateTool('polygon_freehand')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-polygon-freeform</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.freehandPolygonTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    :value="activeTool === 'circle'"
                    @click="activateTool('circle')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-radio-unselected</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.circleTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    :value="activeTool === 'rectangle'"
                    @click="activateTool('rectangle')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-checkbox-unchecked</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.rectangleTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
            <v-list-group
                :value="activeTool === 'text'"
                no-action
            >
                <template #activator>
                    <v-list-tile
                        :value="activeTool === 'text'"
                    >
                        <v-list-tile-action>
                            <v-icon>icon-text</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ i18n.textTools }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-list-tile
                    :value="activeTool === 'text'"
                    @click="activateTool('text')"
                >
                    <v-list-tile-action>
                        <v-icon>icon-text</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ i18n.textTool }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
        </v-list>
    </v-card>
</template>

<script>
    export default {
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
            }
        },
        data() {
            return {};
        },
        computed: {
            activeToolValue: {
                get: function () {
                    return this.activeTool;
                },
                set: function (activeTool) {
                    this.$emit('update:active-tool', activeTool);
                }
            }
        },
        methods: {
            activateTool(tool) {
                this.activeToolValue = tool;
                this.$emit("activate-tool", tool);
            }
        }
    };
</script>
