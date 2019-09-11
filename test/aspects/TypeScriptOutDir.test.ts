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

import { InMemoryProject } from "@atomist/automation-client";
import * as assert from "assert";
import { extractTypeScriptOutDir } from "../../lib/aspects/TypeScriptOutDir";

describe("Notice where people put their compiled output", () => {
    it("finds none in a project with no tsconfig", async () => {
        const p = InMemoryProject.of({ path: "index.js", content: "// some JS" });

        const extractedFingerprints = await extractTypeScriptOutDir(p);
        assert.strictEqual(extractedFingerprints.length, 0);
    });

    it("finds 'none' in a project with a tsconfig without an outDir", async () => {
        const p = InMemoryProject.of({
            path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
  }
}` });

        const extractedFingerprints = await extractTypeScriptOutDir(p);
        assert.strictEqual(extractedFingerprints.length, 1);
        const result = extractedFingerprints[0].data.directory;
        assert.strictEqual(result, undefined);
    });

    it("finds one in a project with a tsconfig with an outDir", async () => {
        const p = InMemoryProject.of({
            path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
    "outDir": "dist",
  }
}` });

        const extractedFingerprints = await extractTypeScriptOutDir(p);
        assert.strictEqual(extractedFingerprints.length, 1);
        const result = extractedFingerprints[0].data.directory;
        assert.strictEqual(result, "dist");
    });
});
