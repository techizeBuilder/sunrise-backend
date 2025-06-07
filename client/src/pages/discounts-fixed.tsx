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
import { ImageUpload } from "@/components/ui/image-upload";
import type { Discount, InsertDiscount } from "@shared/schema";

export default function Discounts() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ["/api/discounts"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertDiscount) => apiRequest("POST", "/api/discounts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      setIsCreateDialogOpen(false);
      setCreateImageUrl("");
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
      apiRequest("PATCH", `/api/discounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discounts"] });
      setEditingDiscount(null);
      setEditImageUrl("");
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
    mutationFn: (id: string) => apiRequest("DELETE", `/api/discounts/${id}`),
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
      type: formData.get("type") as "percentage" | "fixed_amount",
      value: parseFloat(formData.get("value") as string),
      applicationType: formData.get("applicationType") as "product" | "category" | "order" | "customer",
      targetIds: [formData.get("productId") as string || formData.get("categoryId") as string || ""].filter(Boolean),
      conditions: {
        minimumQuantity: parseInt(formData.get("minQuantity") as string) || undefined,
        minimumOrderValue: parseFloat(formData.get("minOrderValue") as string) || undefined,
        customerGroups: formData.get("customerGroup") ? [formData.get("customerGroup") as string] : undefined,
      },
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: new Date(formData.get("validTo") as string),
      isActive: formData.get("isActive") === "true",
      usageLimit: parseInt(formData.get("usageLimit") as string) || undefined,
      usedCount: 0,
      imageUrl: createImageUrl || undefined,
    };

    createMutation.mutate(discountData);
  };

  const handleUpdateDiscount = (formData: FormData) => {
    if (!editingDiscount) return;

    const discountData: Partial<Discount> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "percentage" | "fixed_amount",
      value: parseFloat(formData.get("value") as string),
      applicationType: formData.get("applicationType") as "product" | "category" | "order" | "customer",
      targetIds: [formData.get("productId") as string || formData.get("categoryId") as string || ""].filter(Boolean),
      conditions: {
        minimumQuantity: parseInt(formData.get("minQuantity") as string) || undefined,
        minimumOrderValue: parseFloat(formData.get("minOrderValue") as string) || undefined,
        customerGroups: formData.get("customerGroup") ? [formData.get("customerGroup") as string] : undefined,
      },
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: new Date(formData.get("validTo") as string),
      isActive: formData.get("isActive") === "true",
      usageLimit: parseInt(formData.get("usageLimit") as string) || undefined,
      imageUrl: editImageUrl || editingDiscount.imageUrl,
    };

    updateMutation.mutate({ id: editingDiscount.id, data: discountData });
  };

  const filteredDiscounts = Array.isArray(discounts) ? discounts.filter((discount: any) => {
    const matchesSearch = discount.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || discount.type === filterType;
    
    return matchesSearch && matchesType;
  }) : [];

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case "percentage": return "bg-green-100 text-green-800";
      case "fixed_amount": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationTypeIcon = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-4 w-4" />;
      case "category": return <Users className="h-4 w-4" />;
      case "order": return <Users className="h-4 w-4" />;
      case "customer": return <Users className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <ManagementLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading discounts...</div>
        </div>
      </ManagementLayout>
    );
  }

  return (
    <ManagementLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Discount Management</h1>
            <p className="text-muted-foreground">Create and manage promotional discounts and offers</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Discount
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
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
            </SelectContent>
          </Select>
        </div>

        {/* Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscounts.map((discount: any) => (
            <Card key={discount.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{discount.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {discount.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingDiscount(discount);
                        setEditImageUrl(discount.imageUrl || "");
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(discount.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {discount.imageUrl && (
                  <img
                    src={discount.imageUrl}
                    alt={discount.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                
                <div className="flex items-center gap-2">
                  <Badge className={getDiscountTypeColor(discount.type)}>
                    <Percent className="h-3 w-3 mr-1" />
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getApplicationTypeIcon(discount.applicationType)}
                    {discount.applicationType}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Valid: {new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validTo).toLocaleDateString()}
                  </div>
                  {discount.usageLimit && (
                    <div>
                      Used: {discount.usedCount || 0} / {discount.usageLimit}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Badge variant={discount.isActive ? "default" : "secondary"}>
                    {discount.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDiscounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No discounts found</div>
          </div>
        )}

        {/* Create Discount Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discount</DialogTitle>
              <DialogDescription>
                Add a new promotional discount or offer
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateDiscount(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Discount Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Discount Value</Label>
                  <Input id="value" name="value" type="number" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="applicationType">Application Type</Label>
                  <Select name="applicationType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Specific Product</SelectItem>
                      <SelectItem value="category">Product Category</SelectItem>
                      <SelectItem value="order">Entire Order</SelectItem>
                      <SelectItem value="customer">Customer Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productId">Specific Product (Optional)</Label>
                  <Select name="productId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select specific product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {Array.isArray(products) && products.map((product: any) => (
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
                      {Array.isArray(categories) && categories.map((category: any) => (
                        category.id ? (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ) : null
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    placeholder="Unlimited if not set"
                  />
                </div>
                <div>
                  <Label htmlFor="minQuantity">Min Quantity (Optional)</Label>
                  <Input
                    id="minQuantity"
                    name="minQuantity"
                    type="number"
                    placeholder="No minimum"
                  />
                </div>
              </div>

              <div>
                <Label>Discount Image (Optional)</Label>
                <ImageUpload
                  onImageUpload={setCreateImageUrl}
                  currentImage={createImageUrl}
                  uploadEndpoint="/api/upload/discount"
                  label="Upload Discount Image"
                />
              </div>

              <DialogFooter>
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
        <Dialog open={!!editingDiscount} onOpenChange={(open) => !open && setEditingDiscount(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Discount</DialogTitle>
              <DialogDescription>
                Update discount information
              </DialogDescription>
            </DialogHeader>
            {editingDiscount && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateDiscount(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Discount Name</Label>
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
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingDiscount.description}
                    required
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
                        <SelectItem value="customer">Customer Group</SelectItem>
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
                  <Label>Discount Image (Optional)</Label>
                  <ImageUpload
                    onImageUpload={setEditImageUrl}
                    currentImage={editImageUrl || editingDiscount.imageUrl}
                    uploadEndpoint="/api/upload/discount"
                    label="Upload Discount Image"
                  />
                </div>

                <DialogFooter>
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