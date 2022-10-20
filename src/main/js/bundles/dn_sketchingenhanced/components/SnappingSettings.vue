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
            :disabled="!enabled"
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
