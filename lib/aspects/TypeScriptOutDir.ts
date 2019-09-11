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

import { Project } from "@atomist/automation-client";
import { gatherFromFiles } from "@atomist/automation-client/lib/project/util/projectUtils";
import { Aspect, FP, sha256 } from "@atomist/sdm-pack-fingerprint";
import * as _ from "lodash";
import * as path from "path";

interface TypeScriptOutDirFingerprintData { directory: string | undefined; }

const TypeScriptOutDirAspectName = "TypeScriptOutDir";

export const TypeScriptOutDirFingerprintName = "TypeScriptOutDirFingerprint";

function toTypeScriptOutDirFingerprint(data: TypeScriptOutDirFingerprintData):
    FP<TypeScriptOutDirFingerprintData> {
    return {
        name: TypeScriptOutDirFingerprintName,
        type: TypeScriptOutDirAspectName,
        data,
        sha: sha256(JSON.stringify(data)),
    };
}

export const extractTypeScriptOutDir:
    (p: Project) => Promise<Array<FP<TypeScriptOutDirFingerprintData>>> = async p => {
        const tsConfig = await p.getFile("tsconfig.json");
        if (!tsConfig) {
            return [];
        }
        const tsConfigContentString = await tsConfig.getContent();
        const outDirMatch = /"outDir":\s*"([^"]*)"/.exec(tsConfigContentString);
        if (!outDirMatch) {
            return [toTypeScriptOutDirFingerprint({ directory: undefined })];
        }
        const fp = toTypeScriptOutDirFingerprint({ directory: outDirMatch[1] });
        return [fp];
    };

export const TypeScriptOutDirAspect: Aspect<TypeScriptOutDirFingerprintData> = {
    displayName: "TS Output Directory",
    name: TypeScriptOutDirAspectName,
    extract: extractTypeScriptOutDir,
    toDisplayableFingerprintName: () => "TypeScript Output Directory",
    toDisplayableFingerprint: fp => fp.data.directory || "none",
};
