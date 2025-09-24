
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Video } from "lucide-react";

export default function DoctorDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Doctor Dashboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Manage your appointments, patients, and schedule.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Calendar/> Upcoming Appointments</CardTitle>
                      <CardDescription>View your schedule for today.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">5</p>
                      <p className="text-sm text-muted-foreground">appointments today</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users/> My Patients</CardTitle>
                      <CardDescription>Access patient records and history.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">120</p>
                      <p className="text-sm text-muted-foreground">active patients</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Video/> Video Consultations</CardTitle>
                      <CardDescription>Start or join video calls.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">pending requests</p>
                  </CardContent>
              </Card>
          </div>
           <div className="mt-10 text-center text-muted-foreground">
              <p>Doctor-specific features are coming soon. Stay tuned!</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
