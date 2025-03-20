import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/donors')({
  component: Donors,
});

function Donors() {
  return <div>Donors</div>;
}
