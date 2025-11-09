# Data Versioning & Validation Plan

The app ships a baseline `public/transactions.json`, merges it with `localStorage`, and lets people import/export archives. Right now we blindly trust whatever JSON we receive, so future schema tweaks or malformed files can brick the UI. This document outlines how to harden that pipeline without changing the current runtime code yet.

## Versioning Strategy
1. **Embed a semantic version** under `data.version` (already present but unused).
2. **Keep a migration table** in `src/utils/storage.js`:
   ```js
   const migrations = {
     '2.0.0': (data) => data,
     '2.1.0': (data) => upgradeWhatever(data),
     // ...
   };
   ```
3. **At load time**, compare the persisted version vs. the current `APP_DATA_VERSION` constant. Sequentially run migrations until the data matches the current version. Each migration function should be pure and return a new object so we can unit test it.
4. **When saving**, always stamp `lastModified` and the `APP_DATA_VERSION` so future loads know where to resume.

## Validation Layers
1. **Schema guard**: Define a runtime schema (Zod or a small custom validator) that enforces:
   - `profiles` is an object keyed by string ids.
   - Each profile has `id`, `name` (<= 50 chars), emoji from the supported set, `config` with numeric `initialAmount`, `annualInterestRate`, and ISO `startDate`.
   - Transactions are arrays limited to e.g. 500 entries, each with `id`, `date`, `amount` (finite number), `type` in {`addition`,`withdrawal`}, optional `note` (<= 120 chars).
2. **Import-time validation**: When the user imports a file, run it through the schema. Reject with a descriptive error if validation fails. If it passes but version is older, run migrations before saving.
3. **Baseline fetch**: Apply the same validator to the fetched `transactions.json` so corrupted deployments fail fast with a helpful console error.
4. **Normalization**: After validation, normalize strings (trim names, clamp interest rates, coerce numbers) in one place before data hits React state.

## Merge Behavior
- Perform a **deep merge** keyed by profile id:
  - If a profile exists locally but not in baseline, keep it.
  - If baseline introduces a new profile, add it without overriding the existing active id unless the current active profile was deleted.
  - Merge `config` objects field-by-field so new config properties inherit defaults instead of being discarded.
- Track a `schemaVersion` per profile if future profile-level migrations become necessary (e.g., new transaction fields).

## Testing Checklist
- Unit tests for the validator (happy path + rejection cases).
- Unit tests per migration to guarantee idempotency.
- Integration test that simulates loading v1 data, running migrations, and ensuring the resulting structure matches the latest schema.

Implementing this plan lets us evolve the data model safely, block corrupt imports, and give users actionable feedback instead of silent failure.
