#   Bitly Automation

##  About Framework
This repo contains cypress framework for testing of QRCodeMonkey website

## Prerequisite
This framework is built on nodev12 and npmv6

##  Where are Tests
Tests are present in cypress/integration/ folder.

##  Where are reusable functions
Helper functions are present in cypress/support/ folder.

## How to execute
### Through Cypress test runner
1. Open terminal
2. Navigate to root of project
3. Run command - 'npx cypress open'. It will open cypress test runner on local.
4. Select test file you want to run. You will be able to see the execution on local browser (or electron by default)

### Through Command line
1. Open terminal
2. Navigate to root of project
3. Run command - 'npm run test'. It will start executing all tests and logs are visible on command line.

## Reporting
HTML report of test execution is available at cypress/results/mochaawesome.html
On report you can see the stats and filter the passed/failed/skipped tests
Failed test screenshot is available at cypress/results/screenshots folder
