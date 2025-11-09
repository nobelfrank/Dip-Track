export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">You're Offline</h1>
        <p className="text-muted-foreground">
          Check your internet connection and try again.
        </p>
      </div>
    </div>
  )
}