
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Stethoscope, HeartHandshake, Store } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  role: z.enum(["patient", "doctor", "asha", "pharmacy"], {
    required_error: "Please select a role.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // In a real app, you'd handle authentication here.
    console.log("Login data:", data);

    let name = data.email.split('@')[0];
    if (data.role === 'doctor') {
        name = "Dr. Ankit";
    } else if (data.role === 'pharmacy') {
        name = "Gupta Medicals";
    }

    login(name, data.email, data.role);

    toast({
      title: "Login Successful",
      description: `Welcome back, ${name}!`,
    });

    switch (data.role) {
      case "doctor":
        router.push("/doctor-dashboard");
        break;
      case "asha":
        router.push("/asha-dashboard");
        break;
      case "pharmacy":
        router.push("/pharmacy-dashboard");
        break;
      case "patient":
      default:
        router.push("/home");
        break;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
      <div className="mb-8 flex items-center gap-4">
         <Link href="/"><Logo className="h-16 w-auto" /></Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your Arogya account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient"><div className="flex items-center gap-2"><User />Patient</div></SelectItem>
                        <SelectItem value="doctor"><div className="flex items-center gap-2"><Stethoscope />Doctor</div></SelectItem>
                        <SelectItem value="asha"><div className="flex items-center gap-2"><HeartHandshake />ASHA Worker</div></SelectItem>
                        <SelectItem value="pharmacy"><div className="flex items-center gap-2"><Store />Pharmacy</div></SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="patient@arogya.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
