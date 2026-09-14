# NEWITY Lender Comparison (V1)

A salesperson-facing tool for live borrower calls. It narrows a static lender dataset to **Potential Matches** from a few details typically collected on the call, then lets the salesperson compare a short list of programs.

Results are not underwriting decisions and are not labeled Eligible or Approved.

## What V1 does

- Loads `src/data/lenders.csv` in the browser and normalizes it into a typed program model
- Collects loan amount, business type, years in business, and credit tier
- Validates those inputs before matching
- Returns matching programs with why they matched and which requirements still need confirmation
- Shows a no-match message when nothing in the current dataset fits
- Lets the salesperson select up to 3 matches for a side-by-side comparison

## Local setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Optional: `npm test` runs the matching tests; `npm run build` typechecks and builds.

## Architecture

React + TypeScript + Vite. CSV parsing (Papa Parse) and normalization run client-side at startup. Matching is a pure function in `src/domain/matching.ts` and does not depend on React. There is no backend, database, routing, or global state library. Comparison selection is React `useState` in `App.tsx`.

## Matching rules

A program is a Potential Match when all of the following are true:

1. Loan amount is between the program minimum and maximum (inclusive)
2. Years in business is at least the program minimum
3. Business type equals the program’s type, or the program accepts `All`
4. Borrower credit tier meets or exceeds the program’s required tier

## Important assumptions

- Credit-tier order is **Excellent > Good > Fair**
- The rough credit tier is **not** converted into a numeric credit score
- Results are **Potential Matches**, not underwriting approvals
- Matching uses only information a salesperson typically has on a normal call

## Criteria not evaluated automatically

These fields are shown as information to confirm. They do **not** automatically disqualify a borrower, because the normal call workflow does not provide enough data to evaluate them safely:

- Minimum credit score (`minCreditScore`)
- Maximum existing debt ratio
- Collateral requirement / availability
- Special requirements

## Testing

Vitest covers the V1 matching rules, including loan boundaries, years in business, business type (including the `All` wildcard), credit-tier ordering, and contextual match explanations.

I also manually validated representative borrower scenarios against the source CSV, along with invalid-input, no-match, and comparison-limit behavior.

Run:

`npm test`

A production build can be verified with:

`npm run build`

## Intentionally deferred

- Persistence, authentication, routing, and backend infrastructure
- Saving or sharing borrower comparisons
- Manager recommendation analytics
- Automated lender-rate updates
- Additional borrower criteria that are not consistently available during a live call
- Advanced sorting or recommendation ranking

## What I would build next

1. **Rate freshness and data-update workflow** — make stale lender data obvious and provide a reliable way to refresh the dataset as rates change.
2. **Additional borrower qualification criteria** — if the sales workflow can reliably capture exact credit score, debt ratio, or collateral information, incorporate those fields into matching rather than leaving them as requirements to confirm.
3. **Borrower-friendly comparison sharing** — allow a salesperson to save or share a clean summary of selected programs after the call.

## AI usage

AI was used throughout the full development lifecycle, including problem analysis, scope prioritization, data modeling, implementation, testing, and documentation.

See [`ai_usage.md`](./ai_usage.md) for a concise summary of how ChatGPT and Cursor were used, including an example where AI-generated output was reviewed and corrected rather than accepted as-is.
