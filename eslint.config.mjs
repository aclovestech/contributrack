import nextConfig from 'eslint-config-next/core-web-vitals';
import { globalIgnores } from 'eslint/config';

const eslintConfig = [
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'coverage/**']),
  ...nextConfig,
];

export default eslintConfig;
