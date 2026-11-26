# Playwright UI tests for Trainees website

## Application under test

- Site: https://traineeautomation.azurewebsites.net
- Login: `/Login?returnUrl=%2F`, credentials `user` / `123`
- After login the home page shows the text "Users and Addresses"
- Pages: Home `/`, Add User `/Forms/User/AddUser`, Add Address `/Forms/Address/AddAddress`

## Structure

- `tests/*.spec.ts` — tests
- `pages/*.ts` — page objects (currently only `login.ts`, class `LoginPage`)
- `playwright.config.ts` — projects chromium, firefox, webkit; no `baseURL`, so URLs are written in full

## Commands

- While developing, run in chromium only (3x faster than all browsers): `npx playwright test <file> --project=chromium`
- Before committing, run in all browsers: `npx playwright test`
- Run a single test by name: `npx playwright test -g "test name"`
- After editing code, run `npm run lint` (ESLint + Playwright rules, e.g. missing `await`) and `npm run format:check` (Prettier). Fix with `npm run lint:fix` / `npm run format`
- When a test fails, read `test-results/<test-folder>/error-context.md`. Its "Page snapshot" section shows the page as it was at the moment of failure, including the exact names of fields and buttons — compare them with the locators in the test

## Writing tests

- Log in via `LoginPage` in `test.beforeEach`; don't copy login steps into each test
- Locator priority: `getByTestId` → `getByRole` → `getByLabel` → `getByText`
- CSS / XPath only when none of the above can target the element (e.g. no test id and no accessible name, or the element is found by its position in a structure such as a specific table cell). Add a short comment explaining why
- Take field and button names from the actual page, not from memory: check them in the snapshot or via `npx playwright codegen`. A single typo (e.g. `Street Adress` instead of `Street Address`) makes a test hang for 30 seconds and fail on timeout
- Each test must work on its own and in any order: it must not rely on another test having run first. If a test fills a form, it opens that form itself (e.g. clicks the Add Address button) instead of assuming a previous test left the browser there
- Test names are in English and describe what is checked: `'City field is required'`
- For each form cover: successful submit, each required field, invalid data, the Cancel button

## Ask before doing

- Creating or changing page objects in `pages/` (e.g. moving repeated form-filling into a page object): propose it first and wait for approval

## Good to know

- Create tests add real records to a shared site: one run across all three browsers creates three records
- The `user` account cannot delete records: the Delete confirmation page shows "Only Admin can delete items." and pressing Yes does nothing. So tests cannot clean up after themselves
- Work in feature branches (e.g. `ui-tests-add-user-page`), not in `main`
