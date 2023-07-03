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
    <v-container class="pa-2 symbol-settings fullHeight">
        <div
            v-if="activeUi === 'point'"
        >
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolStyle }}
                </div>
                <div class="ct-flex-item">
                    <v-select
                        v-model="pointSymbolStyle"
                        :items="pointSymbolStyles"
                        :label="i18n.pointSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolSize }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="pointSymbolSize"
                        :label="i18n.pointSymbolSize"
                        type="number"
                        min="1"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="pointSymbolColor"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolOutlineWidth }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="pointSymbolOutlineWidth"
                        :label="i18n.pointSymbolOutlineWidth"
                        type="number"
                        min="0"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolOutlineColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="pointSymbolOutlineColor"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="activeUi === 'polyline'"
        >
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polylineSymbolStyle }}
                </div>
                <div class="ct-flex-item">
                    <v-select
                        v-model="polylineSymbolStyle"
                        :items="polylineSymbolStyles"
                        :label="i18n.polylineSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polylineSymbolWidth }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="polylineSymbolWidth"
                        :label="i18n.polylineSymbolWidth"
                        type="number"
                        min="1"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polylineSymbolColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="polylineSymbolColor"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="activeUi === 'polygon'"
        >
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polygonSymbolStyle }}
                </div>
                <div class="ct-flex-item">
                    <v-select
                        v-model="polygonSymbolStyle"
                        :items="polygonSymbolStyles"
                        :label="i18n.polygonSymbolStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polygonSymbolColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="polygonSymbolColor"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polygonSymbolOutlineStyle }}
                </div>
                <div class="ct-flex-item">
                    <v-select
                        v-model="polygonSymbolOutlineStyle"
                        :items="polylineSymbolStyles"
                        :label="i18n.polygonSymbolOutlineStyle"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.pointSymbolOutlineWidth }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="polygonSymbolOutlineWidth"
                        :label="i18n.polygonSymbolOutlineWidth"
                        type="number"
                        min="0"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.polygonSymbolOutlineColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="polygonSymbolOutlineColor"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="activeUi === 'text'"
        >
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.textSymbolText }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="textSymbolText"
                        :label="i18n.textSymbolText"
                        :placeholder="i18n.textSymbolPlaceholderText"
                        single-line
                        hide-details
                        clearable
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.textSymbolFontSize }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="textSymbolFontSize"
                        :label="i18n.textSymbolFontSize"
                        type="number"
                        min="1"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.textSymbolFontWeight }}
                </div>
                <div class="ct-flex-item">
                    <v-select
                        v-model="textSymbolFontWeight"
                        :items="textSymbolFontWeights"
                        :label="i18n.textSymbolFontWeight"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.textSymbolColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="textSymbolColor"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="activeUi === 'arrow'"
        >
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.arrowSymbolWidth }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="arrowSymbolWidth"
                        :label="i18n.arrowSymbolWidth"
                        type="number"
                        min="1"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.arrowSymbolBoldWidth }}
                </div>
                <div class="ct-flex-item">
                    <v-text-field
                        v-model="arrowSymbolBoldWidth"
                        :label="i18n.arrowSymbolBoldWidth"
                        type="number"
                        min="1"
                        single-line
                        hide-details
                        class="pa-0"
                    />
                </div>
            </div>
            <div class="ct-flex-container ct-flex-container--row">
                <div class="label ct-flex-item ct-flex-item--no-grow">
                    {{ i18n.arrowSymbolColor }}
                </div>
                <div class="ct-flex-item">
                    <color-picker
                        v-model="arrowSymbolColor"
                    />
                </div>
            </div>
        </div>
    </v-container>
</template>

<script>
    import ColorPicker from "./ColorPicker.vue";

    export default {
        components: {
            "color-picker": ColorPicker
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
                ],
                textSymbolFontWeights: [
                    {
                        value: "normal",
                        text: this.i18n.textSymbolFontWeights.normal
                    },
                    {
                        value: "bold",
                        text: this.i18n.textSymbolFontWeights.bold
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
                    const pointSymbol = this.cloneSymbol(this.pointSymbol);
                    pointSymbol.style = style;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolSize: {
                get: function () {
                    return this.pointSymbol.size;
                },
                set: function (size) {
                    const pointSymbol = this.cloneSymbol(this.pointSymbol);
                    pointSymbol.size = size;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolColor: {
                get: function () {
                    return this.pointSymbol.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const pointSymbol = this.cloneSymbol(this.pointSymbol);
                    pointSymbol.color = rgba;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolOutlineWidth: {
                get: function () {
                    return this.pointSymbol.outline?.width;
                },
                set: function (width) {
                    const pointSymbol = this.cloneSymbol(this.pointSymbol);
                    pointSymbol.outline.width = width;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            pointSymbolOutlineColor: {
                get: function () {
                    return this.pointSymbol.outline?.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const pointSymbol = this.cloneSymbol(this.pointSymbol);
                    pointSymbol.outline.color = rgba;
                    this.$emit("update:point-symbol", pointSymbol);
                }
            },
            arrowSymbolWidth: {
                get: function () {
                    return this.arrowSymbol.width;
                },
                set: function (width) {
                    const arrowSymbol = this.cloneSymbol(this.arrowSymbol);
                    arrowSymbol.width = width;
                    this.$emit("update:arrow-symbol", arrowSymbol);
                }
            },
            arrowSymbolBoldWidth: {
                get: function () {
                    return this.arrowSymbol.boldWidth;
                },
                set: function (boldWidth) {
                    const arrowSymbol = this.cloneSymbol(this.arrowSymbol);
                    arrowSymbol.boldWidth = boldWidth;
                    this.$emit("update:arrow-symbol", arrowSymbol);
                }
            },
            arrowSymbolColor: {
                get: function () {
                    return this.arrowSymbol.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const arrowSymbol = this.cloneSymbol(this.arrowSymbol);
                    arrowSymbol.color = rgba;
                    this.$emit("update:arrow-symbol", arrowSymbol);
                }
            },
            polylineSymbolStyle: {
                get: function () {
                    return this.polylineSymbol.style;
                },
                set: function (style) {
                    const polylineSymbol = this.cloneSymbol(this.polylineSymbol);
                    polylineSymbol.style = style;
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polylineSymbolWidth: {
                get: function () {
                    return this.polylineSymbol.width;
                },
                set: function (width) {
                    const polylineSymbol = this.cloneSymbol(this.polylineSymbol);
                    polylineSymbol.width = width;
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polylineSymbolColor: {
                get: function () {
                    return this.polylineSymbol.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polylineSymbol = this.cloneSymbol(this.polylineSymbol);
                    polylineSymbol.color = rgba;
                    this.$emit("update:polyline-symbol", polylineSymbol);
                }
            },
            polygonSymbolStyle: {
                get: function () {
                    return this.polygonSymbol.style;
                },
                set: function (style) {
                    const polygonSymbol = this.cloneSymbol(this.polygonSymbol);
                    polygonSymbol.style = style;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolColor: {
                get: function () {
                    return this.polygonSymbol.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polygonSymbol = this.cloneSymbol(this.polygonSymbol);
                    polygonSymbol.color = rgba;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineStyle: {
                get: function () {
                    return this.polygonSymbol.outline?.style;
                },
                set: function (style) {
                    const polygonSymbol = this.cloneSymbol(this.polygonSymbol);
                    polygonSymbol.outline.style = style;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineWidth: {
                get: function () {
                    return this.polygonSymbol.outline?.width;
                },
                set: function (width) {
                    const polygonSymbol = this.cloneSymbol(this.polygonSymbol);
                    polygonSymbol.outline.width = width;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            polygonSymbolOutlineColor: {
                get: function () {
                    return this.polygonSymbol.outline?.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const polygonSymbol = this.cloneSymbol(this.polygonSymbol);
                    polygonSymbol.outline.color = rgba;
                    this.$emit("update:polygon-symbol", polygonSymbol);
                }
            },
            textSymbolText: {
                get: function () {
                    return this.textSymbol.text;
                },
                set: function (text) {
                    const textSymbol = this.cloneSymbol(this.textSymbol);
                    textSymbol.text = text;
                    this.$emit("update:text-symbol", textSymbol);
                }
            },
            textSymbolFontSize: {
                get: function () {
                    return this.textSymbol.font?.size;
                },
                set: function (size) {
                    const textSymbol = this.cloneSymbol(this.textSymbol);
                    textSymbol.font.size = size;
                    this.$emit("update:text-symbol", textSymbol);
                }
            },
            textSymbolFontWeight: {
                get: function () {
                    return this.textSymbol.font?.weight || "normal";
                },
                set: function (weight) {
                    const textSymbol = this.cloneSymbol(this.textSymbol);
                    textSymbol.font.weight = weight;
                    this.$emit("update:text-symbol", textSymbol);
                }
            },
            textSymbolColor: {
                get: function () {
                    return this.textSymbol.color;
                },
                set: function (color) {
                    const rgba = color.rgba;
                    const textSymbol = this.cloneSymbol(this.textSymbol);
                    textSymbol.color = rgba;
                    this.$emit("update:text-symbol", textSymbol);
                }
            }
        },
        methods: {
            cloneSymbol(symbol) {
                if(symbol.clone) {
                    return symbol.clone();
                } else {
                    return Object.assign({}, symbol);
                }
            }
        }
    };
</script>
