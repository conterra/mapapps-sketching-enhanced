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
    <div class="pa-2 sketching-enhanced--snapping-settings">
        <v-switch
            v-model="enabled"
            :label="i18n.snappingEnabled"
            color="primary"
            class="mt-1"
            hide-details
        />
        <v-switch
            v-model="selfEnabled"
            :label="i18n.snappingSelfEnabled"
            :disabled="!enabled"
            color="primary"
            class="mt-1"
            hide-details
        />
        <v-switch
            v-model="featureEnabled"
            :label="i18n.snappingFeatureEnabled"
            :disabled="!enabled"
            color="primary"
            class="mt-1"
            hide-details
        />
        <div class="subheading my-2">
            {{ i18n.snappingFeatureSources }}
        </div>
        <div class="feature-sources">
            <div
                v-for="featureSource in featureSources"
                :key="featureSource.id"
                class="ct-flex-container feature-source"
            >
                <v-checkbox
                    v-model="featureSource.enabled"
                    :label="featureSource.title"
                    :disabled="!enabled || !featureEnabled
                        || !featureSource.isVisibleInHierarchy || !featureSource.isVisibleAtScale"
                    color="primary"
                    hide-details
                    class="mt-1"
                    @change="changeFeatureSource(featureSource)"
                />
                <v-tooltip
                    v-if="!featureSource.isVisibleInHierarchy || !featureSource.isVisibleAtScale"
                    bottom
                >
                    <template #activator="{ on }">
                        <v-icon
                            color="primary"
                            class="info-icon"
                            v-on="on"
                        >
                            info
                        </v-icon>
                    </template>
                    <span>{{ getInfoText(featureSource) }}</span>
                </v-tooltip>
            </div>
        </div>
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
            },
            getInfoText(featureSource) {
                if(!featureSource.isVisibleInHierarchy && !featureSource.isVisibleInScale) {
                    return this.i18n.isNotVisibleInHierarchyAndScale;
                } else if(!featureSource.isVisibleInHierarchy) {
                    return this.i18n.isNotVisibleInHierarchy;
                } else if(!featureSource.isVisibleInScale) {
                    return this.i18n.isNotVisibleInScale;
                } else {
                    return null;
                }
            }
        }
    };
</script>
