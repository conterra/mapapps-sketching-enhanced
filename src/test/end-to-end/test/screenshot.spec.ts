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

import { test } from '@playwright/test';

import { expectToMatchScreenshot } from './common/testUtils';
import { MapCanvas } from "./components/map-canvas";

// test used to generate a screenshot for the bundle documentation
test('Create Screenshot for GitHub Page', async ({ page }) => {
    await page.goto('http://localhost:9090/');
    const canvas = new MapCanvas(page);
    await canvas.loaded();


    await page.getByRole('button', { name: 'Polylines' }).click();
    await page.locator('canvas').click({
        position: {
            x: 756,
            y: 614
        }
    });
    await page.locator('canvas').click({
        position: {
            x: 904,
            y: 554
        }
    });
    await page.locator('canvas').click({
        position: {
            x: 1060,
            y: 425
        }
    });
    await page.locator('canvas').dblclick({
        position: {
            x: 1088,
            y: 314
        }
    });

    await page.getByRole('button', { name: 'Polygons' }).click();
    await page.locator('canvas').click({
        position: {
            x: 881,
            y: 212
        }
    });
    await page.locator('canvas').click({
        position: {
            x: 796,
            y: 251
        }
    });
    await page.locator('canvas').click({
        position: {
            x: 917,
            y: 393
        }
    });
    await page.locator('canvas').dblclick({
        position: {
            x: 1447,
            y: 212
        }
    });

    await expectToMatchScreenshot(page, "screenshot.png", {
        timeout: 10000
    });
});
