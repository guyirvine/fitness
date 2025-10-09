include ~/.env

SONAR_HOST_URL=http://host.docker.internal:9000
PROJECT_BASEDIR=./

run:
	npm run dev

run_sonar:
	docker run -d --name sonarqube -p 9000:9000 sonarqube:community

start_sonar:
	docker start sonarqube

scan:
	docker run \
		--rm \
		-e SONAR_HOST_URL="${SONAR_HOST_URL}"  \
		-e SONAR_TOKEN="${SONAR_FITNESS_TOKEN}" \
		-v "${PROJECT_BASEDIR}:/usr/src" \
		sonarsource/sonar-scanner-cli

build:
	npm run build

run_local_prod:
#npm install -g serve
	serve -s dist -l 3000

test:
	npm test

test-coverage:
	@echo "Running tests with coverage..."
	@npm run test:coverage
	@if [ -f coverage/lcov.info ]; then \
		echo "Coverage report generated at coverage/lcov.info"; \
		else \
		echo "ERROR: coverage/lcov.info not found"; exit 1; \
		fi
