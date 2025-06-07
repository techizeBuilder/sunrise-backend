import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, DollarSign, Users, Calendar } from "lucide-react";
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
import type { PriceList, InsertPriceList } from "@shared/schema";

export default function PriceLists() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: priceLists, isLoading } = useQuery({
    queryKey: ["/api/price-lists"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPriceList) => apiRequest("/api/price-lists", {
      method: "POST",
      body: data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Price list created successfully",
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
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceList> }) =>
      apiRequest(`/api/price-lists/${id}`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      setEditingPriceList(null);
      toast({
        title: "Success",
        description: "Price list updated successfully",
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
    mutationFn: (id: string) => apiRequest(`/api/price-lists/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-lists"] });
      toast({
        title: "Success",
        description: "Price list deleted successfully",
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

  const handleCreatePriceList = (formData: FormData) => {
    const priceListData: InsertPriceList = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "standard" | "bulk" | "b2b" | "promotional",
      isActive: formData.get("isActive") === "true",
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: formData.get("validTo") ? new Date(formData.get("validTo") as string) : undefined,
      minQuantity: parseInt(formData.get("minQuantity") as string) || 1,
      customerGroup: formData.get("customerGroup") as string || undefined,
    };

    createMutation.mutate(priceListData);
  };

  const handleUpdatePriceList = (formData: FormData) => {
    if (!editingPriceList) return;

    const priceListData: Partial<PriceList> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as "standard" | "bulk" | "b2b" | "promotional",
      isActive: formData.get("isActive") === "true",
      validFrom: new Date(formData.get("validFrom") as string),
      validTo: formData.get("validTo") ? new Date(formData.get("validTo") as string) : undefined,
      minQuantity: parseInt(formData.get("minQuantity") as string) || 1,
      customerGroup: formData.get("customerGroup") as string || undefined,
    };

    updateMutation.mutate({ id: editingPriceList.id, data: priceListData });
  };

  const filteredPriceLists = priceLists?.filter((priceList: PriceList) =>
    priceList.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    priceList.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    priceList.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getPriceListTypeColor = (type: string) => {
    switch (type) {
      case "b2b": return "bg-blue-100 text-blue-800";
      case "bulk": return "bg-green-100 text-green-800";
      case "promotional": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ManagementLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Price Lists</h1>
            <p className="text-muted-foreground">Manage B2B pricing, bulk discounts, and custom rate cards</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Price List
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search price lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Price Lists Grid */}
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
            {filteredPriceLists.map((priceList: PriceList) => (
              <Card key={priceList.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{priceList.name}</CardTitle>
                      <CardDescription>{priceList.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPriceList(priceList)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(priceList.id)}
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
                      <Badge className={getPriceListTypeColor(priceList.type)}>
                        {priceList.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={priceList.isActive ? "default" : "secondary"}>
                        {priceList.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Min Quantity:</span>
                      <span className="text-sm">{priceList.minQuantity}</span>
                    </div>

                    {priceList.customerGroup && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Customer Group:</span>
                        <span className="text-sm">{priceList.customerGroup}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Valid From:</span>
                      <span className="text-sm">
                        {new Date(priceList.validFrom).toLocaleDateString()}
                      </span>
                    </div>

                    {priceList.validTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Valid To:</span>
                        <span className="text-sm">
                          {new Date(priceList.validTo).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Price List Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Price List</DialogTitle>
              <DialogDescription>
                Set up a new pricing structure for specific customer groups or bulk orders
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreatePriceList(new FormData(e.target as HTMLFormElement));
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., B2B Wholesale Rates"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description of this price list..."
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price list type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="b2b">B2B</SelectItem>
                      <SelectItem value="bulk">Bulk</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minQuantity">Minimum Quantity</Label>
                  <Input
                    id="minQuantity"
                    name="minQuantity"
                    type="number"
                    min="1"
                    defaultValue="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customerGroup">Customer Group (Optional)</Label>
                  <Input
                    id="customerGroup"
                    name="customerGroup"
                    placeholder="e.g., Premium Clients"
                  />
                </div>

                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="validTo">Valid To (Optional)</Label>
                  <Input
                    id="validTo"
                    name="validTo"
                    type="date"
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
                  {createMutation.isPending ? "Creating..." : "Create Price List"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Price List Dialog */}
        <Dialog open={!!editingPriceList} onOpenChange={() => setEditingPriceList(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Price List</DialogTitle>
              <DialogDescription>
                Update price list details and settings
              </DialogDescription>
            </DialogHeader>
            {editingPriceList && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePriceList(new FormData(e.target as HTMLFormElement));
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={editingPriceList.name}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={editingPriceList.description || ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-type">Type</Label>
                    <Select name="type" defaultValue={editingPriceList.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="b2b">B2B</SelectItem>
                        <SelectItem value="bulk">Bulk</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-minQuantity">Minimum Quantity</Label>
                    <Input
                      id="edit-minQuantity"
                      name="minQuantity"
                      type="number"
                      min="1"
                      defaultValue={editingPriceList.minQuantity}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-customerGroup">Customer Group</Label>
                    <Input
                      id="edit-customerGroup"
                      name="customerGroup"
                      defaultValue={editingPriceList.customerGroup || ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-validFrom">Valid From</Label>
                    <Input
                      id="edit-validFrom"
                      name="validFrom"
                      type="date"
                      defaultValue={new Date(editingPriceList.validFrom).toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-validTo">Valid To</Label>
                    <Input
                      id="edit-validTo"
                      name="validTo"
                      type="date"
                      defaultValue={editingPriceList.validTo ? new Date(editingPriceList.validTo).toISOString().split('T')[0] : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-isActive">Status</Label>
                    <Select name="isActive" defaultValue={editingPriceList.isActive.toString()}>
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
                  <Button type="button" variant="outline" onClick={() => setEditingPriceList(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update Price List"}
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