import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/donations')({
  component: Donations,
});

function Donations() {
  return <div>Donations</div>;
}
