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
    <v-container class="pa-0 pt-3 measurement-text ct-flex-container ct-flex-container--row">
        <div class="label ct-flex-item ct-flex-item--no-grow">
            {{ label }}:
        </div>
        <div class="ct-flex-item">
            <v-text-field
                v-model="value"
                :disabled="disabled"
                :label="label"
                :prefix="prefix"
                :suffix="suffix"
                :placeholder="i18n.noMeasurement"
                readonly
                single-line
                hide-details
                class="pa-0"
            />
        </div>
        <div class="ct-flex-item ct-flex-item--no-grow">
            <v-tooltip top>
                <v-btn
                    slot="activator"
                    :disabled="disabled"
                    small
                    icon
                    flat
                    color="primary"
                    @click="copyTextToClipboard(value)"
                >
                    <v-icon>
                        content_copy
                    </v-icon>
                </v-btn>
                <span>{{ i18n.copyToClipboard }}</span>
            </v-tooltip>
        </div>
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
            },
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: String,
                default: undefined
            },
            label: {
                type: String,
                default: undefined
            },
            prefix: {
                type: String,
                default: undefined
            },
            suffix: {
                type: String,
                default: undefined
            },
            placeholder: {
                type: String,
                default: undefined
            }
        },
        methods: {
            copyTextToClipboard(text) {
                const el = document.createElement("textarea");
                el.value = text;
                el.setAttribute("readonly", "");
                el.style = { display: "none" };
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
        }
    };
</script>
