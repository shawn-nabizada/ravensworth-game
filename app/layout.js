import './globals.css'

export const metadata = {
  title: 'Ravensworth Manor — A Mystery',
  description:
    'Interrogate eight suspects to solve a 1947 murder at Ravensworth Manor.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
