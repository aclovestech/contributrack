import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/dashboard/donors">Donors</Link>
            </li>
            <li>
              <Link to="/dashboard/donations">Donations</Link>
            </li>
            <li>
              <Link to="/dashboard/reports">Reports</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
