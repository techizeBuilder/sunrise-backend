import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { updateProfileSchema } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Lock } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/auth/profile`, data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Profile Settings" subtitle="Manage your account information">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <p className="text-sm text-muted-foreground">{user.userId}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Password Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For security reasons, password changes require email verification.
              </p>
              <Button variant="outline" size="sm">
                Request Password Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role === "admin" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Administrator Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complete system overview and management</li>
                    <li>• User account creation and management</li>
                    <li>• Access to all departments and data</li>
                    <li>• Financial reports and system configuration</li>
                  </ul>
                </div>
              )}
              
              {user.role === "sales" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Sales Department Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Order management and customer relations</li>
                    <li>• Product catalog and pricing</li>
                    <li>• Distributor network management</li>
                    <li>• Sales reports and performance metrics</li>
                  </ul>
                </div>
              )}
              
              {user.role === "production" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Production Department Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Production batch management</li>
                    <li>• Manufacturing schedules and planning</li>
                    <li>• Quality control and compliance</li>
                    <li>• Production reports and efficiency metrics</li>
                  </ul>
                </div>
              )}
              
              {user.role === "inventory" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Inventory Management Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Stock level monitoring and alerts</li>
                    <li>• Inventory movement tracking</li>
                    <li>• Product catalog management</li>
                    <li>• Stock reports and analytics</li>
                  </ul>
                </div>
              )}
              
              {user.role === "accounts" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Accounts Department Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Financial record management</li>
                    <li>• Budget planning and approval workflows</li>
                    <li>• Income and expense tracking</li>
                    <li>• Financial reports and analysis</li>
                  </ul>
                </div>
              )}
              
              {user.role === "distributor" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Distributor Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Delivery management and scheduling</li>
                    <li>• Order tracking and status updates</li>
                    <li>• Product availability and stock requests</li>
                    <li>• Distribution performance metrics</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}