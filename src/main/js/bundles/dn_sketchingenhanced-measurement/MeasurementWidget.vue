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
    <v-container class="pa-1 measurement fullHeight">
        <v-text-field
            v-if="x"
            v-model="x"
            :label="i18n.x"
            prefix="$"
            readonly
        />
        <v-text-field
            v-if="y"
            v-model="y"
            :label="i18n.y"
            prefix="$"
            readonly
        />
        <v-text-field
            v-if="length"
            v-model="length"
            :label="i18n.length"
            prefix="$"
            readonly
        />
        <v-text-field
            v-if="area"
            v-model="area"
            :label="i18n.area"
            prefix="$"
            readonly
        />
    </v-container>
</template>

<script>
    export default {
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                x: "",
                y: "",
                length: "",
                area: ""
            };
        },
        created() {
            this.$emit("created", this);
        }
    };
</script>
