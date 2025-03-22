import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../components/theme-provider';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  ),
});
