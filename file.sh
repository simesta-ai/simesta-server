#!/bin/bash

# Run all tests
npm run test

# Check the exit code of the tests
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix the issues before submitting a pull request."
  exit 1
else
  echo "All tests passed. You can proceed with the pull request."
  exit 0
fi