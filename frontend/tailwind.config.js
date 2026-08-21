/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // این خط یعنی تمام زیرپوشه‌های src را بگرد
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Vazir', 'sans-serif'],
            },
        },
    },
    plugins: [],
}