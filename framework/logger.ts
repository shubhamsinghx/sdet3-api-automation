import fs from 'fs';
import path from 'path';
import { config } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_DIR = path.resolve(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, `test-run-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.logLevel];
}

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

function writeToFile(formatted: string): void {
  ensureLogDir();
  fs.appendFileSync(LOG_FILE, formatted + '\n');
}

function redactApiKey(text: string): string {
  if (!config.apiKey) return text;
  return text.replace(new RegExp(config.apiKey, 'g'), '***REDACTED***');
}

export const logger = {
  debug(message: string): void {
    if (!shouldLog('debug')) return;
    const formatted = formatMessage('debug', message);
    console.log(redactApiKey(formatted));
    writeToFile(redactApiKey(formatted));
  },

  info(message: string): void {
    if (!shouldLog('info')) return;
    const formatted = formatMessage('info', message);
    console.log(redactApiKey(formatted));
    writeToFile(redactApiKey(formatted));
  },

  warn(message: string): void {
    if (!shouldLog('warn')) return;
    const formatted = formatMessage('warn', message);
    console.warn(redactApiKey(formatted));
    writeToFile(redactApiKey(formatted));
  },

  error(message: string): void {
    if (!shouldLog('error')) return;
    const formatted = formatMessage('error', message);
    console.error(redactApiKey(formatted));
    writeToFile(redactApiKey(formatted));
  },

  logRequest(method: string, url: string, body?: unknown): void {
    this.info(`➡️  REQUEST: ${method} ${url}`);
    if (body) {
      this.debug(`   Body: ${JSON.stringify(body, null, 2)}`);
    }
  },

  logResponse(status: number, body: unknown, durationMs: number): void {
    this.info(`⬅️  RESPONSE: ${status} (${durationMs}ms)`);
    this.debug(`   Body: ${JSON.stringify(body, null, 2)}`);
  },
};
