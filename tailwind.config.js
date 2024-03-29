const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
                secondary: colors.orange,
                neutral: colors.zinc,
            },
        },
    },
    plugins: [],
};
