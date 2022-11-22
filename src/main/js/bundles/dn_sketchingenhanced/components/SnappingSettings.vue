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
    <div>
        <div class="subheading my-2">
            {{ i18n.title }}
        </div>
        <v-switch
            v-model="enabled"
            :label="i18n.snappingEnabled"
            color="primary"
            class="mt-1"
            hide-details
        ></v-switch>
        <v-switch
            v-model="selfEnabled"
            :label="i18n.snappingSelfEnabled"
            :disabled="!enabled"
            color="primary"
            class="mt-1"
            hide-details
        ></v-switch>
        <v-switch
            v-model="featureEnabled"
            :label="i18n.snappingFeatureEnabled"
            :disabled="!enabled"
            color="primary"
            class="mt-1"
            hide-details
        ></v-switch>
        <div class="subheading my-2">{{ i18n.snappingFeatureSources }}</div>
        <v-checkbox
            v-for="featureSource in featureSources"
            :key="featureSource.id"
            v-model="featureSource.enabled"
            :label="featureSource.title"
            :disabled="!enabled || !featureEnabled"
            color="primary"
            hide-details
            class="mt-1"
            @change="changeFeatureSource(featureSource)"
        />
    </div>
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
            snappingEnabled: {
                type: Boolean,
                default: true
            },
            snappingFeatureEnabled: {
                type: Boolean,
                default: true
            },
            snappingSelfEnabled: {
                type: Boolean,
                default: true
            },
            snappingFeatureSources: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            enabled: {
                get() {
                    return this.snappingEnabled;
                },
                set(snappingEnabled) {
                    this.$emit("update:snapping-enabled", snappingEnabled);
                }
            },
            featureEnabled: {
                get() {
                    return this.snappingFeatureEnabled;
                },
                set(featureEnabled) {
                    this.$emit("update:snapping-feature-enabled", featureEnabled);
                }
            },
            selfEnabled: {
                get() {
                    return this.snappingSelfEnabled;
                },
                set(selfEnabled) {
                    this.$emit("update:snapping-self-enabled", selfEnabled);
                }
            },
            featureSources: {
                get() {
                    return this.snappingFeatureSources;
                },
                set(featureSources) {
                    this.$emit("update:snapping-feature-sources", featureSources);
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
