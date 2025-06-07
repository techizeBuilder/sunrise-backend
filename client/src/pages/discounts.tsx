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
  
  // Form state for create
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    type: "",
    value: "",
    applicationType: "",
    productId: "",
    categoryId: "",
    customerGroup: "",
    minQuantity: "",
    minOrderValue: "",
    validFrom: "",
    validTo: "",
    isActive: true,
    usageLimit: ""
  });

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    type: "",
    value: "",
    applicationType: "",
    productId: "",
    categoryId: "",
    customerGroup: "",
    minQuantity: "",
    minOrderValue: "",
    validFrom: "",
    validTo: "",
    isActive: true,
    usageLimit: ""
  });

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
      // Reset form
      setCreateFormData({
        name: "",
        description: "",
        type: "",
        value: "",
        applicationType: "",
        productId: "",
        categoryId: "",
        customerGroup: "",
        minQuantity: "",
        minOrderValue: "",
        validFrom: "",
        validTo: "",
        isActive: true,
        usageLimit: ""
      });
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
      // Reset edit form
      setEditFormData({
        name: "",
        description: "",
        type: "",
        value: "",
        applicationType: "",
        productId: "",
        categoryId: "",
        customerGroup: "",
        minQuantity: "",
        minOrderValue: "",
        validFrom: "",
        validTo: "",
        isActive: true,
        usageLimit: ""
      });
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

  const handleCreateDiscount = () => {
    const discountData: InsertDiscount = {
      name: createFormData.name,
      description: createFormData.description,
      type: createFormData.type as "percentage" | "fixed_amount",
      value: parseFloat(createFormData.value),
      applicationType: createFormData.applicationType as "product" | "category" | "order" | "customer",
      targetIds: [createFormData.productId || createFormData.categoryId || ""].filter(Boolean),
      conditions: {
        minimumQuantity: createFormData.minQuantity ? parseInt(createFormData.minQuantity) : undefined,
        minimumOrderValue: createFormData.minOrderValue ? parseFloat(createFormData.minOrderValue) : undefined,
        customerGroups: createFormData.customerGroup ? [createFormData.customerGroup] : undefined,
      },
      validFrom: createFormData.validFrom ? new Date(createFormData.validFrom) : new Date(),
      validTo: createFormData.validTo ? new Date(createFormData.validTo) : new Date(),
      isActive: createFormData.isActive,
      usageLimit: createFormData.usageLimit ? parseInt(createFormData.usageLimit) : undefined,
      usedCount: 0,
      imageUrl: createImageUrl || undefined,
    };

    createMutation.mutate(discountData);
  };

  const initializeEditForm = (discount: Discount) => {
    setEditFormData({
      name: discount.name || "",
      description: discount.description || "",
      type: discount.type || "",
      value: discount.value?.toString() || "",
      applicationType: discount.applicationType || "",
      productId: discount.targetIds?.[0] || "",
      categoryId: discount.targetIds?.[0] || "",
      customerGroup: discount.conditions?.customerGroups?.[0] || "",
      minQuantity: discount.conditions?.minimumQuantity?.toString() || "",
      minOrderValue: discount.conditions?.minimumOrderValue?.toString() || "",
      validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString().slice(0, 16) : "",
      validTo: discount.validTo ? new Date(discount.validTo).toISOString().slice(0, 16) : "",
      isActive: discount.isActive ?? true,
      usageLimit: discount.usageLimit?.toString() || ""
    });
    setEditImageUrl(discount.imageUrl || "");
  };

  const handleUpdateDiscount = () => {
    if (!editingDiscount) return;

    const discountData: Partial<Discount> = {
      name: editFormData.name,
      description: editFormData.description,
      type: editFormData.type as "percentage" | "fixed_amount",
      value: parseFloat(editFormData.value),
      applicationType: editFormData.applicationType as "product" | "category" | "order" | "customer",
      targetIds: [editFormData.productId || editFormData.categoryId || ""].filter(Boolean),
      conditions: {
        minimumQuantity: editFormData.minQuantity ? parseInt(editFormData.minQuantity) : undefined,
        minimumOrderValue: editFormData.minOrderValue ? parseFloat(editFormData.minOrderValue) : undefined,
        customerGroups: editFormData.customerGroup ? [editFormData.customerGroup] : undefined,
      },
      validFrom: editFormData.validFrom ? new Date(editFormData.validFrom) : new Date(),
      validTo: editFormData.validTo ? new Date(editFormData.validTo) : new Date(),
      isActive: editFormData.isActive,
      usageLimit: editFormData.usageLimit ? parseInt(editFormData.usageLimit) : undefined,
      imageUrl: editImageUrl || editingDiscount.imageUrl,
    };

    updateMutation.mutate({ id: editingDiscount.id, data: discountData });
  };

  const discountsList = Array.isArray(discounts) ? discounts : [];
  const filteredDiscounts = discountsList.filter((discount: any) => {
    if (!discount || typeof discount !== 'object') return false;
    
    const matchesSearch = discount.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      discount.description?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || discount.type === filterType;
    
    return matchesSearch && matchesType;
  });

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
                          onClick={() => {
                            setEditingDiscount(discount);
                            initializeEditForm(discount);
                          }}
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

                      {discount.conditions?.minimumQuantity && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Min Quantity:</span>
                          <span className="text-sm">{discount.conditions.minimumQuantity}</span>
                        </div>
                      )}

                      {discount.conditions?.minimumOrderValue && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Min Order:</span>
                          <span className="text-sm">₹{discount.conditions.minimumOrderValue}</span>
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
              handleCreateDiscount();
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Summer Sale 20%"
                      value={createFormData.name}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Discount Type</Label>
                    <Select value={createFormData.type} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, type: value }))}>
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
                    placeholder="Description of this discount..."
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Discount Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20 for 20% or 100 for ₹100"
                      value={createFormData.value}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, value: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="applicationType">Application Type</Label>
                    <Select value={createFormData.applicationType} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, applicationType: value }))}>
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
                    <Select value={createFormData.productId} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, productId: value }))}>
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
                    <Select value={createFormData.categoryId} onValueChange={(value) => setCreateFormData(prev => ({ ...prev, categoryId: value }))}>
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
                      type="datetime-local"
                      value={createFormData.validFrom}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input
                      id="validTo"
                      type="datetime-local"
                      value={createFormData.validTo}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, validTo: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minQuantity">Min Quantity</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      min="1"
                      placeholder="Optional"
                      value={createFormData.minQuantity}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
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
                      type="number"
                      min="1"
                      placeholder="Optional"
                      value={createFormData.usageLimit}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minOrderValue">Min Order Value</Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={createFormData.minOrderValue}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerGroup">Customer Group</Label>
                    <Input
                      id="customerGroup"
                      placeholder="e.g., Premium, VIP"
                      value={createFormData.customerGroup}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, customerGroup: e.target.value }))}
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
                handleUpdateDiscount();
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-type">Discount Type</Label>
                      <Select value={editFormData.type} onValueChange={(value) => setEditFormData(prev => ({ ...prev, type: value }))}>
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
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    <Label>Discount Image (Optional)</Label>
                    <ImageUpload
                      onImageUpload={setEditImageUrl}
                      currentImage={editImageUrl || editingDiscount.imageUrl}
                      uploadEndpoint="/api/upload/discount"
                      label="Upload Discount Image"
                    />
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
                  <Button type="button" variant="outline" onClick={() => {
                    setEditingDiscount(null);
                    setEditImageUrl("");
                  }}>
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