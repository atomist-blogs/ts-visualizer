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
import { Tagger } from "@atomist/sdm-pack-aspect";
import { Aspect, FP, sha256 } from "@atomist/sdm-pack-fingerprint";
import * as _ from "lodash";
import * as path from "path";

interface TypeScriptSourceDirectoriesFingerprintData { directories: string[]; }

const TypeScriptSourceDirectoriesAspectName = "TypeScriptSourceDirectories";

export const TypeScriptSourceCountByDirectoryFingerprintName = "TypeScriptSourceCountByDirectory";

function toTypeScriptSourceDirectoriesFingerprint(data: TypeScriptSourceDirectoriesFingerprintData):
    FP<TypeScriptSourceDirectoriesFingerprintData> {
    return {
        name: TypeScriptSourceCountByDirectoryFingerprintName,
        type: TypeScriptSourceDirectoriesAspectName,
        data,
        sha: sha256(JSON.stringify(data)),
    };
}

export const extractTypeScriptSourceDirectories: // ExtractFingerprint
    (p: Project) => Promise<Array<FP<TypeScriptSourceDirectoriesFingerprintData>>> = async project => {
        const allDirs = await gatherFromFiles(project, ["**/*.ts", "**/*.tsx", "!**/*.d.ts"],
            async f => path.dirname(f.path).split(path.sep)[0]);
        const directories = _.uniq(allDirs).sort();
        if (!allDirs || allDirs.length === 0) {
            return [];
        }
        const fp = toTypeScriptSourceDirectoriesFingerprint({ directories });
        return [fp];
    };

export const TypeScriptSourceDirectoriesAspect: Aspect<TypeScriptSourceDirectoriesFingerprintData> = {
    displayName: "TS Source Directories",
    name: TypeScriptSourceDirectoriesAspectName,
    extract: extractTypeScriptSourceDirectories,
    toDisplayableFingerprintName: () => "TypeScript Source Directories",
    toDisplayableFingerprint: fp => fp.data.directories.join(", "),
};

export function sourceDirectoryTagger(dirName: string): Tagger {
    return {
        name: "source:" + dirName,
        test: async par => {
            const tssdfp = par.analysis.fingerprints.find(fp => fp.name === TypeScriptSourceCountByDirectoryFingerprintName);
            if (!tssdfp) {
                return false;
            }
            return tssdfp.data.directories.includes(dirName);
        },
    };
}
