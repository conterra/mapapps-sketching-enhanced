///
/// Copyright (C) 2023 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import type {InjectedReference} from "apprt-core/InjectedReference";
import ConstructionWidget from './ConstructionWidget.vue';
import Binding, { Binding as BindingType } from 'apprt-binding/Binding';

export default class MeasurementWidgetFactory {
    private readonly _i18n!: InjectedReference<any>;
    private readonly _constructionModel!: InjectedReference<any>;
    private binding: BindingType;

    createInstance(): any {
        const props = {
            i18n: this._i18n?.get()?.ui
        };

        const events = {
            created: (e) => {
                if (this.binding) {
                    this.binding.disable();
                    this.binding.remove();
                }

                this.binding = Binding.for(e, this._constructionModel)
                    .syncAll("radiusEnabled", "lengthEnabled")
                    .syncAll("radius", "length")
                    .syncToLeftNow()
                    .enable();
            }
        };

        return {
            props,
            events: events,
            view: ConstructionWidget
        };
    }
}
