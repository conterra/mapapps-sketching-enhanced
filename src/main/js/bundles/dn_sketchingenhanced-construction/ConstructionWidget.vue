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
    <v-container class="pa-2 fullHeight sketching-enhanced--construction">
        <div
            v-if="activeTool === 'circle'"
            class="ct-flex-container ct-flex-container--row"
        >
            <div class="ct-flex-item ct-flex-item--no-grow">
                <v-checkbox
                    v-model="radiusEnabled"
                    hide-details
                    color="primary"
                    class="ma-0"
                />
            </div>
            <div class="ct-flex-item label ct-flex-item--no-grow">
                {{ i18n.radius }}
            </div>
            <div class="ct-flex-item">
                <v-text-field
                    v-model="radius"
                    :label="i18n.radius"
                    :disabled="!radiusEnabled"
                    suffix="m"
                    type="number"
                    min="1"
                    single-line
                    hide-details
                    class="pa-0"
                />
            </div>
        </div>
        <div
            v-if="activeTool === 'polyline'"
            class="ct-flex-container ct-flex-container--row"
        >
            <div class="ct-flex-item ct-flex-item--no-grow">
                <v-checkbox
                    v-model="lengthEnabled"
                    hide-details
                    color="primary"
                    class="ma-0"
                />
            </div>
            <div class="ct-flex-item label">
                {{ i18n.length }}
            </div>
            <div class="ct-flex-item">
                <v-text-field
                    v-model="length"
                    :label="i18n.length"
                    :disabled="!lengthEnabled"
                    suffix="m"
                    type="number"
                    min="1"
                    single-line
                    hide-details
                    class="pa-0"
                />
            </div>
        </div>
    </v-container>
</template>

<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
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
                radiusEnabled: true,
                lengthEnabled: true,
                radius: undefined,
                length: undefined
            };
        },
        created() {
            this.$emit("created", this);
        }
    };
</script>
