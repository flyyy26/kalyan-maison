import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the current directory
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend ESLint configurations for Next.js and TypeScript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // You can add custom rules here if necessary
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      // TypeScript-specific rules can be defined here
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
