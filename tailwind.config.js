/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: true, // 保留preflight但我们会自定义修复
  },
  // 添加CSS兼容性前缀
  prefix: '',
  important: false,
}