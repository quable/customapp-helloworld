import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/public"]), {
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:n/recommended",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        node: {
            tryExtensions: [".js", ".json", ".node", ".ts"],
        },
    },

    rules: {
        "n/no-extraneous-import": "off",
        "@typescript-eslint/explicit-member-accessibility": "warn",
        "@typescript-eslint/no-misused-promises": 0,
        "@typescript-eslint/no-floating-promises": 0,
        "@typescript-eslint/unbound-method": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "comma-dangle": ["warn", "always-multiline"],
        "no-console": 0,
        "no-extra-boolean-cast": 0,
        semi: 1,
        quotes: ["warn", "single"],
        "n/no-process-env": 0,

        "n/no-unsupported-features/es-syntax": ["error", {
            ignores: ["modules"],
        }],

        "n/no-missing-import": 0,
        "n/no-unpublished-import": 0,

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_"
        }],
    },
}]);