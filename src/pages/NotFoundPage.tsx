import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center bg-background px-4 text-center text-on-surface">
    <div>
      <p className="font-label-sm uppercase tracking-[0.22em] text-primary">404</p>
      <h1 className="mt-4 font-display-xl text-5xl font-bold sm:text-6xl">
        Page not found
      </h1>
      <p className="mt-5 text-on-surface-variant">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg border border-outline-variant/30 px-5 py-3"
      >
        Return home
      </Link>
    </div>
  </main>
)
