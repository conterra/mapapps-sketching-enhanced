///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

export default class ConstructionHistory {
    lastEvents = [];

    /**
     * Adds a history step
     * @param {string} eventName
     */
    add(eventName: string): void {
        this.lastEvents = this.lastEvents.slice(-8).concat([eventName]);
    }

    /**
     * Returns true, if the last action was executed by a double click
     * @returns boolean
     */
    wasDoubleClick(): boolean {
        return this.lastEvents.slice(-4, -3)[0] === 'vertex-add' && this.lastEvents.slice(-9, -8)[0] === 'vertex-add';
    }
}
