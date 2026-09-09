export default function LoadingSpinner({ label = "Loading turfs..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span className="border-primary size-9 animate-spin rounded-full border-3 border-t-transparent" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
