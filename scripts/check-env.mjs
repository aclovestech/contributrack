const requiredForBuild = [
  'NEXT_PUBLIC_STACK_PROJECT_ID',
  'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
  'STACK_SECRET_SERVER_KEY',
];

const missing = requiredForBuild.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `Missing required build environment variable${missing.length === 1 ? '' : 's'}: ${missing.join(', ')}`,
  );
  console.error(
    'Set these in a local .env.local or the deployment environment. Values are not printed.',
  );
  process.exit(1);
}
