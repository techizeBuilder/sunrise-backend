import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Percent, Clock, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ManagementLayout from "@/components/layout/management-layout";
import type { Discount, InsertDiscount } from "@shared/schema";

export default function Discounts() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: discounts, isLoading } = useQuery({
    queryKey: ["/api/discounts"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertDiscount) => apiRequest("/api/discounts", {
      method: "POST",
      body: data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Discount created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Discount> }) =>
      apiRequest(`/api/discounts/${id}`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      setEditingDiscount(null);
      toast({
        title: "Success",
        description: "Discount updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/discounts/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      toast({
        title: "Success",
        description: "Discount deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDiscount = (formData: FormData) => {
    const discountData: InsertDiscount = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "percentage" | "fixed_amount" | "buy_x_get_y",
      value: parseFloat(formData.get("value") as string),
      applicationType: formData.get("applicationType") as "product" | "category" | "order",
      productId: formData.get("productId") as string || undefined,
      categoryId: formData.get("categoryId") as string || undefined,
      minQuantity: parseInt(formData.get("minQuantity") as string) || undefined,
      maxQuantity: parseInt(formData.get("maxQuantity") as string) || undefined,
      minOrderValue: parseFloat(formData.get("minOrderValue") as string) || undefined,
      customerGroup: formData.get("customerGroup") as string || undefined,
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: new Date(formData.get("validTo") as string),
      isActive: formData.get("isActive") === "true",
      usageLimit: parseInt(formData.get("usageLimit") as string) || undefined,
    };

    createMutation.mutate(discountData);
  };

  const handleUpdateDiscount = (formData: FormData) => {
    if (!editingDiscount) return;

    const discountData: Partial<Discount> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "percentage" | "fixed_amount" | "buy_x_get_y",
      value: parseFloat(formData.get("value") as string),
      applicationType: formData.get("applicationType") as "product" | "category" | "order",
      productId: formData.get("productId") as string || undefined,
      categoryId: formData.get("categoryId") as string || undefined,
      minQuantity: parseInt(formData.get("minQuantity") as string) || undefined,
      maxQuantity: parseInt(formData.get("maxQuantity") as string) || undefined,
      minOrderValue: parseFloat(formData.get("minOrderValue") as string) || undefined,
      customerGroup: formData.get("customerGroup") as string || undefined,
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: new Date(formData.get("validTo") as string),
      isActive: formData.get("isActive") === "true",
      usageLimit: parseInt(formData.get("usageLimit") as string) || undefined,
    };

    updateMutation.mutate({ id: editingDiscount.id, data: discountData });
  };

  const filteredDiscounts = discounts?.filter((discount: Discount) => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || discount.type === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case "percentage": return "bg-green-100 text-green-800";
      case "fixed_amount": return "bg-blue-100 text-blue-800";
      case "buy_x_get_y": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationTypeIcon = (type: string) => {
    switch (type) {
      case "product": return Package;
      case "category": return Users;
      default: return Clock;
    }
  };

  return (
    <ManagementLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Discount Management</h1>
            <p className="text-muted-foreground">Create time-based promotions and item-specific discount rules</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
              <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discounts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscounts.map((discount: Discount) => {
              const ApplicationIcon = getApplicationTypeIcon(discount.applicationType);
              
              return (
                <Card key={discount.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Percent className="h-5 w-5 mr-2 text-green-600" />
                          {discount.name}
                        </CardTitle>
                        <CardDescription>{discount.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDiscount(discount)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(discount.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <Badge className={getDiscountTypeColor(discount.type)}>
                          {discount.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Value:</span>
                        <span className="text-sm font-bold text-green-600">
                          {discount.type === "percentage" ? `${discount.value}%` : `₹${discount.value}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Application:</span>
                        <div className="flex items-center space-x-1">
                          <ApplicationIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{discount.applicationType}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={discount.isActive ? "default" : "secondary"}>
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Valid From:</span>
                        <span className="text-sm">
                          {new Date(discount.validFrom).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Valid To:</span>
                        <span className="text-sm">
                          {new Date(discount.validTo).toLocaleDateString()}
                        </span>
                      </div>

                      {discount.minQuantity && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Min Quantity:</span>
                          <span className="text-sm">{discount.minQuantity}</span>
                        </div>
                      )}

                      {discount.minOrderValue && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Min Order:</span>
                          <span className="text-sm">₹{discount.minOrderValue}</span>
                        </div>
                      )}

                      {discount.usageLimit && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Usage Limit:</span>
                          <span className="text-sm">{discount.usageLimit}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Discount Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discount</DialogTitle>
              <DialogDescription>
                Set up a new promotional discount with specific rules and conditions
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateDiscount(new FormData(e.target as HTMLFormElement));
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Summer Sale 20%"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Discount Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                        <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description of this discount..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Discount Value</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20 for 20% or 100 for ₹100"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="applicationType">Application Type</Label>
                    <Select name="applicationType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Where to apply" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Specific Product</SelectItem>
                        <SelectItem value="category">Product Category</SelectItem>
                        <SelectItem value="order">Entire Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productId">Product (Optional)</Label>
                    <Select name="productId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {products?.map((product: any) => (
                          product.id ? (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ) : null
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoryId">Category (Optional)</Label>
                    <Select name="categoryId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input
                      id="validFrom"
                      name="validFrom"
                      type="datetime-local"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input
                      id="validTo"
                      name="validTo"
                      type="datetime-local"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minQuantity">Min Quantity</Label>
                    <Input
                      id="minQuantity"
                      name="minQuantity"
                      type="number"
                      min="1"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxQuantity">Max Quantity</Label>
                    <Input
                      id="maxQuantity"
                      name="maxQuantity"
                      type="number"
                      min="1"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      name="usageLimit"
                      type="number"
                      min="1"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minOrderValue">Min Order Value</Label>
                    <Input
                      id="minOrderValue"
                      name="minOrderValue"
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerGroup">Customer Group</Label>
                    <Input
                      id="customerGroup"
                      name="customerGroup"
                      placeholder="e.g., Premium, VIP"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <Select name="isActive" defaultValue="true">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Discount"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Discount Dialog */}
        <Dialog open={!!editingDiscount} onOpenChange={() => setEditingDiscount(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Discount</DialogTitle>
              <DialogDescription>
                Update discount details and settings
              </DialogDescription>
            </DialogHeader>
            {editingDiscount && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateDiscount(new FormData(e.target as HTMLFormElement));
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        defaultValue={editingDiscount.name}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-type">Discount Type</Label>
                      <Select name="type" defaultValue={editingDiscount.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Off</SelectItem>
                          <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                          <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={editingDiscount.description || ""}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-value">Discount Value</Label>
                      <Input
                        id="edit-value"
                        name="value"
                        type="number"
                        step="0.01"
                        defaultValue={editingDiscount.value}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-applicationType">Application Type</Label>
                      <Select name="applicationType" defaultValue={editingDiscount.applicationType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Specific Product</SelectItem>
                          <SelectItem value="category">Product Category</SelectItem>
                          <SelectItem value="order">Entire Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-validFrom">Valid From</Label>
                      <Input
                        id="edit-validFrom"
                        name="validFrom"
                        type="datetime-local"
                        defaultValue={new Date(editingDiscount.validFrom).toISOString().slice(0, 16)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-validTo">Valid To</Label>
                      <Input
                        id="edit-validTo"
                        name="validTo"
                        type="datetime-local"
                        defaultValue={new Date(editingDiscount.validTo).toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-isActive">Status</Label>
                    <Select name="isActive" defaultValue={editingDiscount.isActive.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setEditingDiscount(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update Discount"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ManagementLayout>
  );
}