Welcome to your new TanStack Start app!

## Performance training duration

Click a training row or choose **View Details** to open its details drawer.
It fetches the selected training by ID and displays its duration, type, status,
content URL, assignment criteria, employee progress/scores and audit dates.
The employee list and progress/scores are shown only for the `employees` assignment category.
Loading and request errors are shown explicitly, with a retry action.

React uses `duration_days`, a numeric whole-day count (1-2147483647).
Vue continues using the separate legacy text `duration`. React requires a valid
day count on create/edit; legacy records with null `duration_days` display
"Not provided" and require an explicit day count when edited.
Deploy the backend duration-days migrations before using the updated API.

Run validation tests with
`pnpm exec vitest run src/lib/utils/schema/performance.schema.test.ts`.

## Performance appraisal settings

Appraisal Settings supports searchable, paginated Appraisers and Approvers tabs.
Use Add or Edit to configure assignment categories and ordered primary/alternate
appraisers, or static/dynamic approvers with sequential/concurrent approval.
Click a row or choose View Details to open the corresponding detail drawer.

Delete requires confirmation. The backend rejects deletion when an existing
appraisal group (including an archived group) references the setting and returns
the blocking group's name. The confirmation stays open and displays the error;
successful changes refresh the relevant list and details.

Run the focused regression tests with:

```sh
pnpm exec vitest run src/lib/api/client/performance.test.ts src/lib/hooks/tables/usePerformanceAppraisalGGSettings.test.tsx src/components/organisms/modals/AppraisalPeopleSettingModal.test.tsx src/components/organisms/drawers/AppraisalPeopleSettingDetailDrawer.test.tsx
```

## Performance reports

Performance Reports is available at `/admin-dashboard/performance/report` and
requires `generate performance report`. It migrates the working Vue Appraisal
Scorecards workflow, not the static appraisal/feedback report mockups.

- Attendance-style report/column and workforce criteria panels; branch,
  department, team, grade or employee scope, a year and employee grouping.
- Validated criteria and pagination are stored in the URL. Refresh regenerates
  the saved criteria; editing filters does not change the preview until Generate.
- Only approved appraisals from ended appraisal groups are scorecards. Current
  active workforce records determine employee scope. Employees with no matching
  scorecards are retained; pagination totals count employees, not scorecards.
- Click an employee for real scorecards, appraisal periods, scores, performance
  areas, KPI categories and weighted subcategories in the shared drawer.
- CSV/Excel/PDF exports include all employee pages and scorecard summary rows,
  not just the preview. KPI hierarchies are inspected in the drawer. PDF reuses
  the branded attendance layout with performance labels and year metadata.
- Exports reject more than 10,000 employees or incomplete/duplicate pagination.
  Numeric-page exports are not database snapshots; concurrent changes can still
  affect results. Report and export failures are surfaced explicitly.

Deploy the accompanying backend schema correction: `/hrm/appraisals/reports`
accepts `perPage` (not `per_page`), supports grade scope and only implements
employee grouping. Branch is required for department/team/grade scope.

Regression tests:

```sh
pnpm exec vitest run src/lib/api/client/performanceReports.test.ts src/components/organisms/boxes/AllPerformanceReports.test.tsx
```

## Admin Attendance migration

### Attendance reports

Attendance reports are available at
`/admin-dashboard/attendance/attendance-reports`. The page follows the
organization-report layout: report/column selection, workforce criteria,
generated statistics, a shared table and an export dropdown. It uses
`useGetPageHeader`, shared date inputs, a dedicated form hook and a table hook.

- Report types are shown only when the user has the corresponding
  `view <lowercase-report-type> report` permission.
- Scope includes accessible branches, departments, teams, grades and employees.
  Changing scope or department branch clears incompatible selections.
- Validated report criteria, including pagination, are stored in the URL.
  Reloading the preview regenerates the same request; draft edits do not change
  the displayed report until Generate Report is selected.
- Date ranges are inclusive and limited to 93 days. Summary reports are
  employee-grouped; daily reports can be grouped by date or employee.
- Row clicks open a report-record drawer. Missing data remains distinct from
  zero, absence and explicit off days.
- CSV, Excel and PDF exports request all matching groups, not just the preview
  page. Export limits/errors are surfaced rather than silently truncating data.
  PDFs use attendance-specific metadata and filenames without a fabricated auditor.

Attendance PDFs follow the organization report's branded header, metadata cards,
blue summary strip, alternating table rows and confidential page-number footer.
Company branding is captured from the current workspace at export time. Scope,
period and grouping describe the actual selected criteria; totals count exported
records rather than implying unique employees. Wide attendance tables retain A3
landscape pages, repeating column headers and unsplit rows. Source warnings remain
visible; the layout does not assert audit verification or biometric synchronization.

React uses `POST /attendance/reports/:type/generate-v2` and
`POST /attendance/reports/:type/download-v2`. Deploy the accompanying backend
before enabling the page. Legacy Vue report endpoints remain separate.
No attendance-service changes or deployment are required.

Report hours and summary metrics are supplied by the backend/attendance service;
the browser does not reinterpret missing punches as worked hours or sum clock
strings. Simple reports are same-calendar-day reports, not overnight shift
reports. Approved Overtime reports are separate from attendance-derived
Overtime Summary. Historical workforce scope currently uses active employees
and their current branch/department records, not historical personnel snapshots.
Backend warnings and calculation limitations are displayed in the preview.
Summary absence totals remain the source attendance totals. Approved leave on
scheduled absent dates is shown separately and is not subtracted blindly from
the source absence count. These figures overlap and should not be added together.
The unchanged service can still miscalculate same-day/overnight simple reports,
cross-year shift clock-outs, same-date break pairing and large duration totals.
Warnings are preserved in PDF/Excel metadata and backend CSV exports.

The backend permission migration adds definitions only; administrators must
grant the relevant report permissions to roles. No permissions are automatically
granted by the React page. All-result exports reject more than 10,000
groups/detail records instead of returning a truncated successful export.

The Devices workflow is available at `/admin-dashboard/attendance/devices`:

- Paginated device list, search/status filters and device details.
- Create and edit devices, including loading an edit directly by URL.
- Confirmed reboot and force-pull commands.
- Employee/device search, selected-user transfer, move and access changes.
- Whole-device user transfer, without requiring employee selection.
- Transaction history and paginated per-device command logs.

Click a transaction-history row to open its details drawer. It loads the
transaction by ID and pages through its device commands, including status,
command content and commit time. Refresh reloads the transaction and current
command page; pending does not imply failure while a device is offline.

This uses the existing authenticated API client, Mantine forms, shared tables,
Zod validation, TanStack Query and file-based routes. Device commands use serial
numbers, employee commands use employee IDs, and permissions match the backend.
Offline devices receive queued commands when they reconnect; a successful queue
request does not mean execution has finished. Check transaction logs for progress.

The Work Shifts workflow is available at `/admin-dashboard/attendance/workshift`:

- Paginated/searchable weekly shifts, creation, editing and confirmed deletion.
  Click a row to open the by-ID details drawer with its weekly schedule and
  assignments. Edit/assign/delete remain in the row action popover; there is no
  View action. Old detail-page URLs redirect to the list.
- Optional weekend exclusion and a shift type for each included day.
- Company (HQ admins only), branch, department and individual assignments.
  Saving replaces the assignment list; details also supports confirmed unassignment.
- Mantine Schedule employee calendars with month/week/day/year views,
  agenda, employee search, refresh and saved-schedule detail drawers.
- Roster filters for company/branches/departments/individuals, paginated results
  and CSV export of all matching employees. Generated filters are stored in the
  URL so the roster can be refreshed or bookmarked.
- Shift type settings (times, 1-14 day durations, colors) and company-wide
  clock matching windows (0-30 hours). System shift types are read-only.

Work Shifts uses the same client/forms/tables/Query architecture as Devices.
The create/edit form uses a dedicated form hook, grouped `Tams2ColsForm` fields,
a `LoadingOverlay` and the shared unsaved-changes `TamsActionWidget`.
Cancel restores the initial values; saving retains the existing numeric payload
and edit scope restrictions.
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

### Scheduler and branch-department routines

Scheduler is available at `/admin-dashboard/attendance/scheduler`. Filter by
company, branches or individual employees, select employees on the current
page, then preview and confirm dated assignments. Department selection belongs
to Workshift, not Scheduler.

- Repeat once, daily or on selected weekdays, with an inclusive end date.
  Repeats create finite assignments, not a persistent recurrence rule.
- Limits: 93 days, 100 employees and 5,000 dated assignments per save.
- Existing schedules (including off days) are kept by default; replacement
  requires selecting that policy explicitly. The backend checks conflicts again
  before saving. Keep-existing is read-before-write, not an atomic guarantee
  against concurrent schedulers.
- Workshift department assignments require a branch and apply to its **current
  eligible employees**, stored as ordinary employee assignments for compatibility
  with the unchanged attendance service. These have employee-level precedence.
  Reapply after new hires, department changes or transfers; previous assignments
  are not automatically removed by transfers.
- Calendars show **saved schedules only**. Blank future dates are not off days:
  the attendance service may not have generated regular workshift dates yet.
  Off days, overnight and multi-day saved shifts remain distinct.
- The legacy attendance upsert does not update the stored end date. The backend
  rejects replacements that would change it instead of displaying stale dates.

The Scheduler uses the existing client/service, form-hook, modal and table-hook
structure. Its form uses Mantine `useForm` directly because the shared
`useTamsForm` wrapper still uses the older transform-function generic, while the
installed Mantine version expects the transformed value type. No shared form
behaviour is changed for other modules.

Deploy the accompanying backend changes before using these features. No
attendance-service deployment or migration is required.

React uses `GET/POST /attendance/shift/schedules-v2` and
`POST /attendance/shift/workshift/assign-v2`, under the existing `/api/v1`
base URL. Vue keeps its unsuffixed endpoints and legacy contracts, including
schedule CSV uploads. Other workshift CRUD, unassignment, calendar and settings
endpoints remain shared. There is no automatic fallback to legacy replacement
if a v2 endpoint is unavailable.

Devices, Work Shifts and Scheduler are migrated, not the complete Attendance module.
Overtime, mobile clocks, reports and the dashboard remain to be
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
