
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#3838fa",
                "accent-pink": "#f43f5e",
                "accent-cyan": "#06b6d4",
                "background-light": "#f5f5f8",
                "background-dark": "#050510",
                "surface-dark": "#0f0f23",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "body": ["Space Grotesk", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.5rem", "lg": "0.75rem", "xl": "1rem", "2xl": "1.5rem" },
            backgroundImage: {
                'hero-glow': 'radial-gradient(circle at 50% 0%, #3838fa 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)',
                'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                'neon-border': 'linear-gradient(90deg, #3838fa, #f43f5e, #3838fa)',
            },
            keyframes: {
                'pulse-blue': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(56, 56, 250, 0.7)', transform: 'scale(0.95)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(56, 56, 250, 0)', transform: 'scale(1)' },
                }
            },
            animation: {
                'pulse-blue': 'pulse-blue 2s infinite',
            }
        },
    },
    plugins: [],
}
