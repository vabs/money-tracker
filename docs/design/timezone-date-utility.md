# Timezone-Safe Date Handling

## Problem Statement
HTML date inputs (`type="date"`) emit `YYYY-MM-DD` strings that the runtime interprets as UTC. Everywhere we call `new Date('2024-01-01')`, browsers convert that to midnight UTC, which becomes the prior day for negative offsets. The UI then shows the wrong transaction day and compound-interest math short-changes or overstates earning periods depending on the viewer's timezone.

## Goals
1. Keep storage simple (still store `YYYY-MM-DD`).
2. Treat the stored date as **local** midnight, not UTC.
3. Provide helpers for calculations, formatting, and input bindings so no component needs bespoke fixes.

## Proposed Utility Surface (`src/utils/dates.js`)
| Function | Purpose |
| --- | --- |
| `parseLocalDate(dateString)` | Returns a `Date` representing local midnight of the provided ISO string. Uses `Temporal.PlainDate` when available, otherwise falls back to `Date` + manual offset. |
| `formatLocalDate(date)` | Produces a `YYYY-MM-DD` string suitable for `<input type="date">` or storage. Always mirrors `parseLocalDate` so round trips are lossless. |
| `differenceInDays(a, b)` | Returns whole-day delta between two local dates using UTC math to avoid DST drift. |
| `addDays(dateString, days)` | Returns a new `YYYY-MM-DD` string advanced by `days` relative to local midnight. |
| `isBefore(a, b)` | Convenience comparator built on `differenceInDays` for validation. |

### Implementation Notes
- Internally normalize with `Date.UTC(year, monthIndex, day)` so arithmetic is timezone-neutral.
- When `Temporal` is available, prefer `Temporal.PlainDate.from(dateString)` for clarity.
- Guard against invalid inputs and always return `null` for malformed strings so callers can validate forms.

## Integration Plan
1. **Transaction math**: Replace every `new Date(tx.date)` call in `src/utils/calculations.js` with `parseLocalDate`. Use `differenceInDays` for interval math.
2. **Forms**: When initializing default values (e.g., `useState(new Date().toISOString().split('T')[0])`), switch to `formatLocalDate(new Date())` so defaults match the helper.
3. **Display**: Prefer `parseLocalDate(tx.date)` before formatting with `toLocaleDateString`, so the day label matches the stored string globally.
4. **Testing**: Add unit tests that freeze timezone offsets (e.g., mock `Intl.DateTimeFormat().resolvedOptions().timeZone`) to ensure the helpers behave identically for GMT+/- users.

By routing every date read/write through this helper we keep storage unchanged, fix rendering in every locale, and create one place to harden against future DST/Temporal changes.
