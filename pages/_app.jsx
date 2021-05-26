import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
    return (
        <div className="bg-gray-300 min-h-screen">
            <Component {...pageProps} />
        </div>
    )
}

export default MyApp