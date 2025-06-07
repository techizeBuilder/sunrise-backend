import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { apiRequest } from "@/lib/queryClient";
import { Wheat, Image, Mail, TrendingUp, LogOut, Edit, Trash2 } from "lucide-react";
import { Product, GalleryImage, ContactMessage } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, logout } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!admin) {
      setLocation("/admin");
    }
  }, [admin, setLocation]);

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!admin,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    enabled: !!admin,
  });

  const { data: galleryImages } = useQuery({
    queryKey: ["/api/gallery"],
    enabled: !!admin,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
    enabled: !!admin,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    },
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Image deleted",
        description: "Gallery image has been successfully deleted.",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/admin");
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="container-max">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl text-heading">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container-max section-padding">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Wheat className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Image className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Gallery Images</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.galleryImages || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.messages || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.pageViews || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Manage Products</h2>
                <Button className="btn-primary">
                  Add Product
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product: Product) => (
                      <tr key={product.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">{product.category}</td>
                        <td className="py-3 px-4">{product.price}</td>
                        <td className="py-3 px-4">
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Manage Gallery</h2>
                <Button className="btn-primary">
                  Upload Image
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages?.map((image: GalleryImage) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.imageUrl} 
                      alt={image.altText}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => deleteGalleryImageMutation.mutate(image.id)}
                        disabled={deleteGalleryImageMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Customer Messages</h2>
              
              <div className="space-y-4">
                {messages?.map((message: ContactMessage) => (
                  <Card key={message.id} className={message.isRead ? "bg-muted/30" : "bg-card"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">
                          {message.firstName} {message.lastName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!message.isRead && (
                            <Badge variant="destructive" className="text-xs">New</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        <strong>Subject:</strong> {message.subject}
                      </p>
                      <p className="text-foreground mb-3">{message.message}</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Email:</strong> {message.email}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                        {!message.isRead && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsReadMutation.mutate(message.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
