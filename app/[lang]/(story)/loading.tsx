export default function Loading() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12">
      <div className="animate-pulse space-y-3">
        <div className="h-2 bg-rule rounded w-20" />
        <div className="h-10 bg-rule rounded w-2/3" />
        <div className="h-4 bg-rule rounded w-full" />
        <div className="h-4 bg-rule rounded w-5/6" />
      </div>
    </div>
  );
}
