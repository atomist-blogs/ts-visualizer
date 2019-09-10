/*
 * Copyright © 2019 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GoalWithFulfillment } from "@atomist/sdm";
import { AllGoals } from "@atomist/sdm-core";

/**
 * Interface to capture all goals that this SDM will manage
 */
export interface HelloWorldGoals extends AllGoals {

    /** Simple hello world goal */
    helloWorld: GoalWithFulfillment;

}
