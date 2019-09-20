import { Project } from "@atomist/automation-client";
import { microgrammar, Rep1Sep } from "@atomist/microgrammar";
import { Aspect, FP, sha256 } from "@atomist/sdm-pack-fingerprint";
/**
 * This aspect is designed to move our organization toward a standard of separating
 * .ts source from its compiled output.
 * Compiler input should be in src/, and output should be in ./
 *
 * The purpose of this is: ship the .ts with the npm package, in a way that people working
 * in SDMs that use this library can click into its definitions and see TypeScript
 * without their compiler seeing and trying to compile all the TypeScript source in these libraries.
 */
export interface SourceAndOutputData {
    output: string;
    input: string[];
}
const SeparateSourceFromOutputAspectName = "SeparateSourceFromOutput";
const SeparateSourceFromOutputFingerprintName = "SeparateSourceFromOutput";

function toFingerprint(data: SourceAndOutputData):
    FP<SourceAndOutputData> {
    return {
        type: SeparateSourceFromOutputAspectName,
        name: SeparateSourceFromOutputFingerprintName,
        data,
        sha: sha256(JSON.stringify(data)),
    };
}

const includesMg = microgrammar<{ quotedItems: Array<{ value: string }> }>({
    phrase: `"includes" : [ \${quotedItems} ]`, terms: {
        // tslint:disable-next-line:no-invalid-template-strings
        quotedItems: new Rep1Sep(microgrammar({ phrase: '"${value}"' }), ","),
    },
});

export async function extractSourceAndOutputLocations(p: Project): Promise<Array<FP<SourceAndOutputData>>> {
    const tsConfig = await p.getFile("tsconfig.json");
    if (!tsConfig) {
        return [];
    }
    const tsConfigContentString = await tsConfig.getContent();
    const outDirMatch = /"outDir":\s*"([^"]*)"/.exec(tsConfigContentString);
    const output = outDirMatch ? outDirMatch[1] : undefined;

    const includesMatch = includesMg.firstMatch(tsConfigContentString);
    const input = includesMatch ? includesMatch.quotedItems.map(q => q.value) : [];

    const fp = toFingerprint({ output, input });
    return [fp];
}
export const SeparateSourceFromOutputAspect: Aspect<SourceAndOutputData> = {
    name: SeparateSourceFromOutputAspectName,
    displayName: "TypeScript source and output",
    extract: extractSourceAndOutputLocations,
};
