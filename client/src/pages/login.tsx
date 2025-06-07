import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { loginSchema } from "@shared/schema";

export default function Login() {
  const { toast } = useToast();
  const { login, isLoginPending, loginError, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (loginError) {
      toast({
        title: "Login Failed",
        description: loginError.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  }, [loginError, toast]);

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="https://sunrisefoods.in/assets/img/Global/Everyday118x72.png" 
              alt="Sunrise Foods" 
              className="h-16 mx-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Sunrise Foods account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isLoginPending}
              >
                {isLoginPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Link href="/reset-password">
              <Button variant="link" className="text-sm text-orange-600 hover:text-orange-700">
                Forgot your password?
              </Button>
            </Link>
          </div>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <p><strong>Admin:</strong> admin@sunrisefoods.in / admin123</p>
              <p><strong>Sales:</strong> sales@sunrisefoods.in / admin123</p>
              <p><strong>Production:</strong> production@sunrisefoods.in / admin123</p>
              <p><strong>Inventory:</strong> inventory@sunrisefoods.in / admin123</p>
              <p><strong>Accounts:</strong> accounts@sunrisefoods.in / admin123</p>
              <p><strong>Distributor:</strong> distributor@sunrisefoods.in / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}