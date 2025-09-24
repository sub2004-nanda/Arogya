import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HealthRecordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Health Records</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Access your personal health records, view past appointments, and manage your medical history.
            </p>
            <div className="mt-10 text-muted-foreground">
              <p>New features are coming soon. Stay tuned!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
