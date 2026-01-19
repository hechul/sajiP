# Conversation Log

## 2026-01-15
- **User Request**: Check why `lunar-javascript` is showing a red line (error).
- **Action**: Checking `package.json` for dependencies and searching for usage of `lunar-javascript`.
- **Findings**: `lunar-javascript` is in `package.json` and imported in `composables/useSaju.ts`. Suspecting TypeScript type issues.
- **Next Step**: Examining `composables/useSaju.ts` and investigating type definitions.
- **Investigation**: Checking `node_modules/lunar-javascript/package.json` to see if it includes type definitions. (Failed due to ignore patterns)
- **Action**: Installing `lunar-typescript` (removing `lunar-javascript`) and creating `test-saju.js` to verify output.
- **Goal**: Confirm if the output is in Korean or Chinese.
- **Result**: Confirmed `lunar-typescript` runs correctly. Output is Chinese characters (Hanzi), not Hangul.
- **Action**: Inform user and offer Hangul conversion helper. Cleaning up test files.
- **User Report**: Red squiggly line on `@/assets/data/sajuMap.json`.
- **Diagnosis**: `sajuMap.json` is valid. Issue is missing `resolveJsonModule` in `tsconfig.json`.
- **Correction**: `tsconfig.json` is managed by Nuxt. Modifying `nuxt.config.ts` instead.
- **Action**: Updated `nuxt.config.ts` to include `resolveJsonModule: true`.
- **User Request**: Explain the meaning of contents in `sajuMap.json` in the context of Saju.
- **Action**: Reading `composables/useSaju.ts` (already read `sajuMap.json`) to explain the mapping logic.
- **Debugging**: Checking the content of `test-saju.js` and running it to reproduce the error.
- **Hypothesis**: Likely due to `package.json` having `"type": "module"` but the environment or file extension causing conflict, or simply the library wasn't installed successfully earlier.
- **Action**: Verifying if `@types/lunar-javascript` exists.

## 2026-01-19
- **User Request**: Question about `const tempSaju = getGanji(new Date(y, 5, 15));` in `composables/useFortune.ts` - why June 15th?
- **Action**: Searched code, identified `composables/useFortune.ts`.
- **Analysis**: Reading file to confirm the logic. The date (June 15th) is likely chosen as a safe mid-year date to determine the year's Ganji (Secha) avoiding the ambiguous Ipchun (approx Feb 4th) boundary.