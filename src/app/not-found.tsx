import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <div className="text-7xl">😕</div>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist or was moved.</p>
        <Link href="/" className="text-primary underline underline-offset-4">Go back home</Link>
      </div>
    </div>
  );
}




