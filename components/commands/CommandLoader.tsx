/**
 * The pulsing-dots loader shown during a command's "thinking" beat. Reused for
 * any in-command async loading (e.g. Spotify queries) so the loading state
 * stays visually identical from the artificial beat through to real data.
 */
export function CommandLoader() {
  return (
    <div className="flex items-center gap-1.5 pl-5">
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/60" />
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40 [animation-delay:150ms]" />
      <div className="h-1 w-1 animate-pulse rounded-full bg-primary/20 [animation-delay:300ms]" />
    </div>
  );
}
