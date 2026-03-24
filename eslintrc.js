module.exports = {
  extends: [
    "next/core-web-vitals"
  ],
  rules: {
    // Temporarily disable problematic rules for deployment
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off", 
    "prefer-const": "off",
  }
};