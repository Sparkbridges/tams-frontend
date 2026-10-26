Welcome to your new TanStack Start app!

## Admin Attendance migration

The Devices workflow is available at `/admin-dashboard/attendance/devices`:

- Paginated device list, search/status filters and device details.
- Create and edit devices, including loading an edit directly by URL.
- Confirmed reboot and force-pull commands.
- Employee/device search, selected-user transfer, move and access changes.
- Whole-device user transfer, without requiring employee selection.
- Transaction history and paginated per-device command logs.

This uses the existing authenticated API client, Mantine forms, shared tables,
Zod validation, TanStack Query and file-based routes. Device commands use serial
numbers, employee commands use employee IDs, and permissions match the backend.
Offline devices receive queued commands when they reconnect; a successful queue
request does not mean execution has finished. Check transaction logs for progress.

The Work Shifts workflow is available at `/admin-dashboard/attendance/workshift`:

- Paginated/searchable weekly shifts, creation, editing, details and confirmed deletion.
- Optional weekend exclusion and a shift type for each included day.
- Company (HQ admins only), branch, department and individual assignments.
  Saving replaces the assignment list; details also supports confirmed unassignment.
- Employee monthly calendars with date-aligned shifts, colors and times.
- Roster filters for company/branches/departments/individuals, paginated results
  and CSV export of all matching employees. Generated filters are stored in the
  URL so the roster can be refreshed or bookmarked.
- Shift type settings (times, 1-14 day durations, colors) and company-wide
  clock matching windows (0-30 hours). System shift types are read-only.

Work Shifts uses the same client/forms/tables/Query architecture as Devices.
Queries are scoped by company, user and active branch; switching context resets
draft forms. Numeric entity IDs and assignment-record IDs are kept separate.
Department assignment names require the accompanying backend lookup fix.

Known service constraints are represented explicitly rather than copied as
non-working controls: an existing shift's branch scope is read-only because the
attendance service only updates its name and days. Custom shift types cannot
start or end at exactly midnight because the service silently filters those
records out; overnight shifts with other times remain supported. The Vue
Synchronization and Clock Options pages were placeholders and are intentionally
not migrated. The Vue Ignore Function Keys toggle had no saved boolean;
only the supported clock windows are editable.

Devices and Work Shifts are migrated, not the complete Attendance module.
Scheduling, overtime, mobile clocks, reports and the dashboard remain to be
migrated. Employee self-service is outside these stages.

# Getting Started

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
