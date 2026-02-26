import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface TestAssertion {
  field: string;
  operator: 'equals' | 'exists' | 'type' | 'greaterThan' | 'contains';
  value?: unknown;
}

export interface TestCase {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: Record<string, unknown>;
  expectedStatus: number;
  assertions: TestAssertion[];
}

interface TestDataFile {
  testSuite: string;
  baseEndpoint: string;
  testCases: TestCase[];
}

/**
 * Read and parse a YAML test data file.
 */
export function readTestData(fileName: string): TestDataFile {
  const filePath = path.resolve(__dirname, '..', 'test-data', fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent) as TestDataFile;
}

/**
 * Read only the test cases from a YAML file.
 */
export function readTestCases(fileName: string): TestCase[] {
  const data = readTestData(fileName);
  return data.testCases;
}

/**
 * Evaluate a single assertion against a response body.
 */
export function evaluateAssertion(body: unknown, assertion: TestAssertion): { pass: boolean; message: string } {
  const value = getNestedValue(body, assertion.field);

  switch (assertion.operator) {
    case 'equals':
      return {
        pass: value === assertion.value,
        message: `Expected "${assertion.field}" to equal "${assertion.value}" but got "${value}"`,
      };
    case 'exists':
      return {
        pass: value !== undefined && value !== null,
        message: `Expected "${assertion.field}" to exist but it was ${value}`,
      };
    case 'type':
      return {
        pass: typeof value === assertion.value,
        message: `Expected "${assertion.field}" to be type "${assertion.value}" but got "${typeof value}"`,
      };
    case 'greaterThan':
      return {
        pass: typeof value === 'number' && value > (assertion.value as number),
        message: `Expected "${assertion.field}" to be greater than ${assertion.value} but got ${value}`,
      };
    case 'contains':
      return {
        pass: typeof value === 'string' && value.includes(assertion.value as string),
        message: `Expected "${assertion.field}" to contain "${assertion.value}" but got "${value}"`,
      };
    default:
      return { pass: false, message: `Unknown operator: ${assertion.operator}` };
  }
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}
