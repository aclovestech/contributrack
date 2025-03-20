import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/reports')({
  component: Reports,
});

function Reports() {
  return <div>Reports</div>;
}
