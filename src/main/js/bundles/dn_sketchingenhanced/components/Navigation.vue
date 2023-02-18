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
    <v-card class="fullHeight">
        <v-list class="pa-0">
            <div
                v-for="element in elements"
                :key="element.name"
            >
                <v-list-group
                    v-if="element.subTools"
                    :value="activeUi === element.name"
                    no-action
                    @click="activateTool(element.subTools[0].name)"
                    @keyup.enter="activateTool(element.subTools[0].name)"
                >
                    <template #activator>
                        <v-list-tile
                            :value="activeUi === element.name"
                            ripple
                            tag="div"
                            role="button"
                            tabindex="0"
                            :aria-label="element.title"
                            :aria-expanded="activeUi === element.name"
                        >
                            <v-list-tile-action>
                                <v-icon>{{ element.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ element.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile
                        v-for="subTool in element.subTools"
                        :key="subTool.name"
                        :value="activeTool === subTool.name"
                        class="subtool"
                        ripple
                        tag="div"
                        role="button"
                        tabindex="0"
                        @click="activateTool(subTool.name)"
                        @keyup.enter="activateTool(subTool.name)"
                    >
                        <v-list-tile-action>
                            <v-icon>{{ subTool.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ subTool.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile
                    v-else
                    :value="activeTool === element.name"
                    ripple
                    tag="div"
                    role="button"
                    tabindex="0"
                    :aria-label="element.title"
                    :aria-selected="activeTool === element.name"
                    @click.stop="activateTool(element.name)"
                    @keyup.enter="activateTool(element.name)"
                >
                    <v-list-tile-action>
                        <v-icon>{{ element.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ element.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </div>
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
                elements: [
                    {
                        name: "point",
                        title: this.i18n.pointTool,
                        icon: "icon-draw-point"
                    },
                    {
                        name: "polyline",
                        title: this.i18n.polylineTools,
                        icon: "icon-line",
                        subTools: [
                            {
                                name: "polyline",
                                title: this.i18n.polylineTool,
                                icon: "icon-polyline"
                            },
                            {
                                name: "polyline_freehand",
                                title: this.i18n.freehandPolylineTool,
                                icon: "icon-polyline-freeform"
                            }
                        ]
                    },
                    {
                        name: "polygon",
                        title: this.i18n.polygonTools,
                        icon: "icon-polygon",
                        subTools: [
                            {
                                name: "polygon",
                                title: this.i18n.polygonTool,
                                icon: "icon-polygon"
                            },
                            {
                                name: "polygon_freehand",
                                title: this.i18n.freehandPolygonTool,
                                icon: "icon-polygon-freeform"
                            },
                            {
                                name: "circle",
                                title: this.i18n.circleTool,
                                icon: "icon-radio-unselected"
                            },
                            {
                                name: "rectangle",
                                title: this.i18n.rectangleTool,
                                icon: "icon-checkbox-unchecked"
                            }
                        ]
                    },
                    {
                        name: "text",
                        title: this.i18n.textTool,
                        icon: "icon-text"
                    }
                ]
            };
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
