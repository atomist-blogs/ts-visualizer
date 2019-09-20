
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
import { extractSourceAndOutputLocations } from "../../lib/aspects/SeparateSourceFromOutput";

describe("Notice where people put their compiled output", () => {
  it("does not fingerprint a project with no tsconfig", async () => {
    const p = InMemoryProject.of({ path: "index.js", content: "// some JS" });

    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 0);
  });

  it("finds nothing for output if outDir is not defined", async () => {
    const p = InMemoryProject.of({
      path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
  }
}` });

    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 1);
    const result = extractedFingerprints[0].data.output;
    assert.strictEqual(result, undefined);
  });

  it("finds the output in a project with a tsconfig with an outDir", async () => {
    const p = InMemoryProject.of({
      path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
    "outDir": "./",
  }
}` });

    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 1);
    const result = extractedFingerprints[0].data.output;
    assert.strictEqual(result, "./");
  });

  it("finds the input in a project with a tsconfig with an includes", async () => {
    const p = InMemoryProject.of({
      path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
    "outDir": "./",
  },
  "includes": ["src"]
}` });
    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 1);
    const result = extractedFingerprints[0].data.input;
    assert.deepStrictEqual(result, ["src"]);
  });

  it("finds the input in a project with a tsconfig with multiple includes", async () => {
    const p = InMemoryProject.of({
      path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
    "outDir": "./",
  },
  "includes": [
    "src",
    "blah",
  ],
}` });

    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 1);
    const result = extractedFingerprints[0].data.input;
    assert.deepStrictEqual(result, ["src", "blah"]);
  });

  it("finds empty input array in a project with a tsconfig without", async () => {
    const p = InMemoryProject.of({
      path: "tsconfig.json", content: `{
  "compilerOptions": {
    "newLine": "LF",
    "outDir": "./",
  }
}` });

    const extractedFingerprints = await extractSourceAndOutputLocations(p);
    assert.strictEqual(extractedFingerprints.length, 1);
    const result = extractedFingerprints[0].data.input;
    assert.deepStrictEqual(result, []);
  });

});
