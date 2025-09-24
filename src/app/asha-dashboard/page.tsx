
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Activity } from "lucide-react";

export default function AshaDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">ASHA Worker Dashboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Manage your community tasks and patient information.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users/> Community Members</CardTitle>
                      <CardDescription>View and manage profiles in your area.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">85</p>
                      <p className="text-sm text-muted-foreground">households covered</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ClipboardList/> Daily Tasks</CardTitle>
                      <CardDescription>Check your list of assigned tasks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">tasks pending today</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Activity/> Health Surveys</CardTitle>
                      <CardDescription>Conduct and submit health surveys.</CardDescription>
                  </CardHeader>
                   <CardContent>
                      <p className="text-4xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">surveys to conduct</p>
                  </CardContent>
              </Card>
          </div>
           <div className="mt-10 text-center text-muted-foreground">
              <p>ASHA worker-specific features are coming soon. Stay tuned!</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
