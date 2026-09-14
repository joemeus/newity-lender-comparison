# AI Usage

I used AI throughout the assessment as a thinking partner and implementation accelerator across problem understanding, scoping, development, testing, and documentation.

## Understanding & Scoping

I used ChatGPT to analyze the assessment brief and lender CSV before beginning implementation.

This helped me identify:

- the primary user and live-call workflow
- the core business problem
- the information actually available during a borrower call
- explicit and implicit requirements
- major ambiguities and edge cases
- the highest-value outcome under the four-hour constraint

This led to a V1 focused on borrower criteria entry, deterministic lender matching, explainable results, validation, and lightweight program comparison.

I intentionally deferred persistence, sharing, manager analytics, automatic rate updates, authentication, and external integrations because they did not materially improve the primary live-call workflow within the available time.

## Data Modeling

I used ChatGPT to reason through the lender CSV and separate the raw CSV representation from the normalized application model.

Key decisions included:

- converting numeric fields into numbers
- converting blank optional values to `null`
- normalizing dates
- preserving `Yes | No | Varies` for collateral
- treating `All` as a business-type wildcard
- keeping debt ratio values as decimal ratios
- avoiding unsupported eligibility assumptions

I also identified fields that should not automatically determine eligibility without additional borrower information, including exact credit score, debt ratio, collateral availability, and free-text special requirements.

## Architecture & Planning

I used ChatGPT to compare React + TypeScript + Vite, Next.js, Streamlit, and a frontend/backend architecture.

I selected **React + TypeScript + Vite with client-side CSV processing** because the dataset is small and static, there are no required integrations, and a backend would add complexity without meaningful product value.

The build was then broken into small increments so the application remained runnable after each step:

1. CSV loading and normalization
2. borrower input form
3. matching logic and focused tests
4. lender result cards and match explanations
5. validation and no-match handling
6. program comparison

## Implementation

I used Cursor Agent to implement the application incrementally rather than asking it to generate the entire product at once.

Each increment was constrained to a small set of files and behaviors, then manually validated before moving on.

I also committed each stable increment to Git so I had clear checkpoints throughout the build.

## Reviewing AI Output

I reviewed AI-generated work rather than accepting it blindly.

One example was the initial **Why this matched** section. Cursor used the same generic explanations for every lender:

- Loan amount fits
- Years in business requirement met
- Business type accepted
- Credit tier requirement met

Although technically correct, that did not meaningfully explain why a specific program matched a specific borrower.

I changed the implementation so the explanation is derived from both the borrower and the lender program, for example:

- `$250,000 is within this program's $10,000–$250,000 range`
- `3 years in business meets the 1-year minimum`
- `Good credit meets the Fair tier requirement`

This made the result more useful and explainable for the salesperson.

## Testing

AI helped identify the highest-risk matching rules and define focused Vitest coverage.

Tests cover:

- minimum and maximum loan boundaries
- out-of-range loan amounts
- years-in-business boundaries
- the `All` business-type wildcard
- specific business-type mismatches
- credit-tier hierarchy

I also manually validated realistic borrower scenarios against the source CSV, including:

- `$250,000 / Retail / 3 years / Good` → 21 potential matches
- `$5,000,000 / Retail / 3 years / Good` → 6 potential matches
- `$100,000 / Retail / 2 years / Excellent` → confirmed that Excellent satisfies Good and Fair requirements

Additional manual testing covered invalid input, no-match scenarios, result-card data, and program comparison behavior.

## Documentation

I used AI to help structure the README, scope rationale, testing notes, AI usage summary, and final demo narrative.

All generated documentation was reviewed against the implemented application so it would not claim functionality that was not actually built.

## Overall Approach

I used AI as a force multiplier while retaining responsibility for:

- product scope
- architecture
- business-rule assumptions
- reviewing generated code
- validating results
- deciding what to change or reject
- determining when V1 was complete
