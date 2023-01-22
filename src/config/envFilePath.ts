export function getEnvFilePath(): string {
  return process.env['ENV_FILE_PATH'] || '.env';
}
