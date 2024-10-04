import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1 className='m-6 text-3xl font-bold text-center'>ノート</h1>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <p className='m-6 text-center'>とが</p>
        </footer>
      </body>
    </html>
  )
}
