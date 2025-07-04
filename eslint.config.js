const globals = require("globals");
const tseslint = require("typescript-eslint");
const n8nPlugin = require("eslint-plugin-n8n-nodes-base");

module.exports = [
  {
    ignores: ["dist/*", "node_modules/*", ".eslintrc.js"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  {
    files: ["nodes/**/*.ts"],
    plugins: {
      "n8n-nodes-base": n8nPlugin,
    },
    rules: {
      ...n8nPlugin.configs.nodes.rules,
      "n8n-nodes-base/node-execute-block-missing-continue-on-fail": "off",
      "n8n-nodes-base/node-resource-description-filename-against-convention": "off",
      "n8n-nodes-base/node-param-fixed-collection-type-unsorted-items": "off",
    },
  },
  {
    files: ["credentials/**/*.ts"],
    plugins: {
      "n8n-nodes-base": n8nPlugin,
    },
    rules: {
        ...n8nPlugin.configs.credentials.rules,
        "n8n-nodes-base/cred-class-field-documentation-url-missing": "off",
        "n8n-nodes-base/cred-class-field-documentation-url-miscased": "off",
    }
  },
  {
    files: ["package.json"],
    plugins: {
        "n8n-nodes-base": n8nPlugin,
    },
    rules: {
        ...n8nPlugin.configs.community.rules,
        "n8n-nodes-base/community-package-json-name-still-default": "off",
        "n8n-nodes-base/community-package-json-license-not-default": "off",
    }
  }
];
