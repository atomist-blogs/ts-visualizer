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

import { configure } from "@atomist/sdm-core";
import {
    aspectSupport,
    Tagger,
} from "@atomist/sdm-pack-aspect";
import { Aspect } from "@atomist/sdm-pack-fingerprint";
import {
    outputDirectoryNoneTagger,
    outputDirectoryTagger,
    TypeScriptOutDirAspect,
} from "./lib/aspects/TypeScriptOutDir";
import {
    sourceDirectoryTagger,
    TypeScriptSourceDirectoriesAspect,
} from "./lib/aspects/TypeScriptSourceDirectories";

/**
 * The main entry point into the SDM
 */
export const configuration = configure(async sdm => {
    const aspects: Aspect[] = [TypeScriptSourceDirectoriesAspect, TypeScriptOutDirAspect];
    const sourceDirTaggers: Tagger[] = ["src", "lib", ".", "test", "tests"].map(sourceDirectoryTagger);
    const outDirTaggers: Tagger[] = ["dist", "lib", "build"].map(outputDirectoryTagger);
    sdm.addExtensionPacks(aspectSupport({
        aspects,
        taggers: [...sourceDirTaggers, ...outDirTaggers, outputDirectoryNoneTagger],
    }));
});
