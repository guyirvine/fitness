How to generate coverage reports and send to SonarQube

This project uses Vitest for unit tests and generates coverage reports in LCOV and Cobertura formats for SonarQube.

1) Generate coverage reports

Run:

```bash
npm run test:coverage
```

This produces coverage reports in the `coverage/` folder:
- `coverage/lcov.info` (LCOV)
- `coverage/cobertura-coverage.xml` (Cobertura)

2) Send coverage to SonarQube

The project already includes `sonar-project.properties` which points SonarQube to `coverage/lcov.info`.

You need the SonarScanner CLI installed locally (or use the SonarScanner Docker image). Install the scanner:

macOS (Homebrew):

```bash
brew install sonar-scanner
```

Or use npm (global):

```bash
npm install -g sonar-scanner
```

Then run in the project root:

```bash
sonar-scanner
```

Notes:
- If your SonarQube instance requires authentication, set the `SONAR_LOGIN` environment variable or update `sonar-project.properties` with the auth token and server URL.
- CI: On CI, install sonar-scanner in the pipeline or use the official SonarCloud/GitHub action and pass `coverage/lcov.info` as the report path.

3) Alternative: use Docker

```bash
docker run --rm -v "$PWD":/usr/src -w /usr/src sonarsource/sonar-scanner-cli sonar-scanner
```

If you'd like, I can:
- Add an npm script that downloads the sonar-scanner CLI locally and runs it.
- Add CI pipeline snippets for GitHub Actions to run tests and upload coverage to SonarCloud.
