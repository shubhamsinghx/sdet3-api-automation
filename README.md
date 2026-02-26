# SDET3 API Test Automation Framework

API test automation framework built with **Playwright** and **TypeScript** for the [Reqres](https://reqres.in) Users API.

## Project Structure

```
sdet3-api-automation/
├── tests/
│   ├── users/
│   │   ├── create-user.spec.ts      # POST create user tests
│   │   ├── get-users.spec.ts        # GET list + single user tests
│   │   ├── update-user.spec.ts      # PUT update user tests
│   │   └── delete-user.spec.ts      # DELETE user tests
│   └── e2e/
│       └── user-lifecycle.spec.ts   # Full CRUD lifecycle test
├── framework/
│   ├── api-client.ts                # Reusable API request wrapper
│   ├── validators.ts                # Response assertion helpers
│   ├── logger.ts                    # Console + file logging
│   ├── test-data-reader.ts          # YAML test case parser
│   └── config.ts                    # Env/config management
├── test-data/
│   └── users-tests.yaml             # Structured test cases in YAML
├── ci/
│   └── api-tests.yml                # GitHub Actions workflow
├── docs/
│   └── test-cases.md                # Documented test cases
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Prerequisites

- **Node.js** 20+
- **npm** 9+
- A **Reqres API key** (get one at [app.reqres.in](https://app.reqres.in))

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd sdet3-api-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright**
   ```bash
   npx playwright install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Reqres API key:
   ```
   REQRES_API_KEY=your_actual_api_key
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run only user CRUD tests
```bash
npm run test:users
```

### Run only E2E lifecycle tests
```bash
npm run test:e2e
```

### View HTML report
```bash
npm run test:report
```

### Type checking
```bash
npm run lint
```

## Test Cases

| ID    | Name                    | Method | Endpoint           | Expected Status |
|-------|-------------------------|--------|--------------------|-----------------|
| TC-01 | List All Users          | GET    | `/records`         | 200             |
| TC-02 | Create New User         | POST   | `/records`         | 201             |
| TC-03 | Get Single User by ID   | GET    | `/records/:id`     | 200             |
| TC-04 | Update User             | PUT    | `/records/:id`     | 200             |
| TC-05 | Delete User             | DELETE | `/records/:id`     | 204             |

See [docs/test-cases.md](docs/test-cases.md) for detailed test case documentation.

## Framework Features

- **Reusable API Client** — wraps Playwright's `APIRequestContext` with auto-attached headers and response timing
- **Response Validators** — helper functions for status, schema, field value, response time, and array assertions
- **Structured Logging** — request/response logging to console and file with API key redaction
- **Data-Driven Testing** — YAML-based test case definitions parsed at runtime
- **Parameterized Tests** — add new test cases in YAML without writing code
- **Error Handling** — typed responses, graceful 204/404 handling

## CI/CD

The project includes a GitHub Actions workflow (`ci/api-tests.yml`) that:

1. Triggers on push to `main` and on pull requests
2. Sets up Node.js 20 and installs dependencies
3. Runs all API tests
4. Uploads HTML report and logs as artifacts

### Setup GitHub Actions

Add `REQRES_API_KEY` as a repository secret in **Settings → Secrets and variables → Actions**.

## Reporting

- **HTML Report** — generated in `playwright-report/` after each test run
- **Console Output** — list reporter shows test results in terminal
- **Log Files** — detailed request/response logs saved in `logs/`

## Tech Stack

- [Playwright](https://playwright.dev) — test runner + API client
- [TypeScript](https://www.typescriptlang.org) — type-safe test code
- [dotenv](https://github.com/motdotla/dotenv) — environment variable management
- [js-yaml](https://github.com/nodeca/js-yaml) — YAML test data parsing
