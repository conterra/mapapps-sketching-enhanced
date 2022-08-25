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
    <v-container class="pa-1 symbol-settings fullHeight">
        <div
            v-if="activeUi === 'point'"
        >
            <v-layout
                row
                wrap>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolStyle }}
                </v-flex>
                <v-flex xs8>
                    <v-select
                        v-model="pointSymbolStyle"
                        :items="pointSymbolStyles"
                        :label="i18n.pointSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolSize }}
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="pointSymbolSize"
                        :label="i18n.pointSymbolSize"
                        type="number"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolColor }}
                </v-flex>
                <v-flex
                    xs8
                    pt-2>
                    <color-picker
                        v-model="pointSymbolColor"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolOutlineWidth }}
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="pointSymbolOutlineWidth"
                        :label="i18n.pointSymbolOutlineWidth"
                        type="number"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolOutlineColor }}
                </v-flex>
                <v-flex
                    xs8
                    pt-2>
                    <color-picker
                        v-model="pointSymbolOutlineColor"
                    />
                </v-flex>
            </v-layout>
        </div>
        <div
            v-if="activeUi === 'polyline'"
        >
            <v-layout
                row
                wrap>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polylineSymbolStyle }}
                </v-flex>
                <v-flex xs8>
                    <v-select
                        v-model="polylineSymbolStyle"
                        :items="polylineSymbolStyles"
                        :label="i18n.polylineSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polylineSymbolWidth }}
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="polylineSymbolWidth"
                        :label="i18n.polylineSymbolWidth"
                        type="number"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polylineSymbolColor }}
                </v-flex>
                <v-flex
                    xs8
                    pt-2>
                    <color-picker
                        v-model="polylineSymbolColor"
                    />
                </v-flex>
            </v-layout>
        </div>
        <div
            v-if="activeUi === 'polygon'"
        >
            <v-layout
                row
                wrap>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polygonSymbolStyle }}
                </v-flex>
                <v-flex xs8>
                    <v-select
                        v-model="polygonSymbolStyle"
                        :items="polygonSymbolStyles"
                        :label="i18n.polygonSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polygonSymbolColor }}
                </v-flex>
                <v-flex
                    xs8
                    pt-2>
                    <color-picker
                        v-model="polygonSymbolColor"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polygonSymbolOutlineStyle }}
                </v-flex>
                <v-flex xs8>
                    <v-select
                        v-model="polygonSymbolOutlineStyle"
                        :items="polylineSymbolStyles"
                        :label="i18n.polygonSymbolOutlineStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.pointSymbolOutlineWidth }}
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="polygonSymbolOutlineWidth"
                        :label="i18n.polygonSymbolOutlineWidth"
                        type="number"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </v-flex>
                <v-flex
                    xs4
                    class="label">
                    {{ i18n.polygonSymbolOutlineColor }}
                </v-flex>
                <v-flex
                    xs8
                    pt-2>
                    <color-picker
                        v-model="polygonSymbolOutlineColor"
                    />
                </v-flex>
            </v-layout>
        </div>
    </v-container>
</template>

<script>
    import { Chrome } from "dn_vuecolor";

    export default {
        components: {
            "color-picker": Chrome
        },
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
            }
        },
        data() {
            return {
                pointSymbolStyles: [
                    {
                        value: "circle",
                        text: this.i18n.pointSymbolStyles.circle
                    },
                    {
                        value: "cross",
                        text: this.i18n.pointSymbolStyles.cross
                    },
                    {
                        value: "diamond",
                        text: this.i18n.pointSymbolStyles.diamond
                    },
                    {
                        value: "square",
                        text: this.i18n.pointSymbolStyles.square
                    },
                    {
                        value: "triangle",
                        text: this.i18n.pointSymbolStyles.triangle
                    },
                    {
                        value: "x",
                        text: this.i18n.pointSymbolStyles.x
                    }
                ],
                polylineSymbolStyles: [
                    {
                        value: "dash",
                        text: this.i18n.polylineSymbolStyles.dash
                    },
                    {
                        value: "dash-dot",
                        text: this.i18n.polylineSymbolStyles.dashDot
                    },
                    {
                        value: "dot",
                        text: this.i18n.polylineSymbolStyles.dot
                    },
                    {
                        value: "long-dash",
                        text: this.i18n.polylineSymbolStyles.longDash
                    },
                    {
                        value: "long-dash-dot",
                        text: this.i18n.polylineSymbolStyles.longDashDot
                    },
                    {
                        value: "long-dash-dot-dot",
                        text: this.i18n.polylineSymbolStyles.longDashDotDot
                    },
                    {
                        value: "none",
                        text: this.i18n.polylineSymbolStyles.none
                    },
                    {
                        value: "short-dash",
                        text: this.i18n.polylineSymbolStyles.shortDash
                    },
                    {
                        value: "short-dash-dot",
                        text: this.i18n.polylineSymbolStyles.shortDashDot
                    },
                    {
                        value: "short-dash-dot-dot",
                        text: this.i18n.polylineSymbolStyles.shortDashDotDot
                    },
                    {
                        value: "short-dot",
                        text: this.i18n.polylineSymbolStyles.shortDot
                    },
                    {
                        value: "solid",
                        text: this.i18n.polylineSymbolStyles.solid
                    }
                ],
                polygonSymbolStyles: [
                    {
                        value: "backward-diagonal",
                        text: this.i18n.polygonSymbolStyles.backwardDiagonal
                    },
                    {
                        value: "cross",
                        text: this.i18n.polygonSymbolStyles.cross
                    },
                    {
                        value: "diagonal-cross",
                        text: this.i18n.polygonSymbolStyles.diagonalCross
                    },
                    {
                        value: "forward-diagonal",
                        text: this.i18n.polygonSymbolStyles.forwardDiagonal
                    },
                    {
                        value: "horizontal",
                        text: this.i18n.polygonSymbolStyles.horizontal
                    },
                    {
                        value: "none",
                        text: this.i18n.polygonSymbolStyles.none
                    },
                    {
                        value: "solid",
                        text: this.i18n.polygonSymbolStyles.solid
                    },
                    {
                        value: "vertical",
                        text: this.i18n.polygonSymbolStyles.vertical
                    }
                ]
            };
        },
        computed: {
            pointSymbolStyle: {
                get: function () {
                    return this.pointSymbol.style;
                },
                set: function (style) {
                    const pointSymbol = Object.assign({}, this.pointSymbol);
                    pointSymbol.style = style;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolSize: {
                get: function () {
                    return this.pointSymbol.size;
                },
                set: function (size) {
                    const pointSymbol = Object.assign({}, this.pointSymbol);
                    pointSymbol.size = size;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolColor: {
                get: function () {
                    const color = this.pointSymbol.color;
                    return {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const pointSymbol = Object.assign({}, this.pointSymbol);
                    pointSymbol.color = [rgba.r, rgba.g, rgba.b, rgba.a];
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolOutlineWidth: {
                get: function () {
                    return this.pointSymbol.outline.width;
                },
                set: function (width) {
                    const pointSymbol = Object.assign({}, this.pointSymbol);
                    pointSymbol.outline.width = width;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolOutlineColor: {
                get: function () {
                    const color = this.pointSymbol.outline.color;
                    return {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const pointSymbol = Object.assign({}, this.pointSymbol);
                    pointSymbol.outline.color = [rgba.r, rgba.g, rgba.b, rgba.a];
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            polylineSymbolStyle: {
                get: function () {
                    return this.polylineSymbol.style;
                },
                set: function (style) {
                    const polylineSymbol = Object.assign({}, this.polylineSymbol);
                    polylineSymbol.style = style;
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polylineSymbolWidth: {
                get: function () {
                    return this.polylineSymbol.width;
                },
                set: function (width) {
                    const polylineSymbol = Object.assign({}, this.polylineSymbol);
                    polylineSymbol.width = width;
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polylineSymbolColor: {
                get: function () {
                    const color = this.polylineSymbol.color;
                    return {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polylineSymbol = Object.assign({}, this.polylineSymbol);
                    polylineSymbol.color = [rgba.r, rgba.g, rgba.b, rgba.a];
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polygonSymbolStyle: {
                get: function () {
                    return this.polygonSymbol.style;
                },
                set: function (style) {
                    const polygonSymbol = Object.assign({}, this.polygonSymbol);
                    polygonSymbol.style = style;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolColor: {
                get: function () {
                    const color = this.polygonSymbol.color;
                    return {
                        r: color[0],
                        g: color[1],
                        b: color[2],
                        a: color[3]
                    };
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polygonSymbol = Object.assign({}, this.polygonSymbol);
                    polygonSymbol.color = [rgba.r, rgba.g, rgba.b, rgba.a];
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineStyle: {
                get: function () {
                    return this.polygonSymbol.outline.style;
                },
                set: function (style) {
                    const polygonSymbol = Object.assign({}, this.polygonSymbol);
                    polygonSymbol.outline.style = style;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineWidth: {
                get: function () {
                    return this.polygonSymbol.outline.width;
                },
                set: function (width) {
                    const polygonSymbol = Object.assign({}, this.polygonSymbol);
                    polygonSymbol.outline.width = width;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineColor: {
                get: function () {
                    const color = this.polygonSymbol.outline.color;
                    return {
                        r: color[0],
                        g: color[1],
                        b: color[2]
                    };
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polygonSymbol = Object.assign({}, this.polygonSymbol);
                    polygonSymbol.outline.color = [rgba.r, rgba.g, rgba.b];
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            }
        },
        methods: {}
    };
</script>
