"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import CreateAssetDialog from "./CreateAssetDialog";
import TransactionHistoryDialog from "./TransactionHistoryDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster } from "~/components/ui/toaster";
import { useToast } from "~/hooks/use-toast";

type Asset = RouterOutputs["asset"]["getAll"][number];
type User = RouterOutputs["user"]["getAll"][number];

interface NFTDashboardProps {
  initialAssets: Asset[];
  initialUsers: User[];
}

export const NFTDashboard: React.FC<NFTDashboardProps> = ({
  initialAssets,
  initialUsers,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  
  // Queries
  const { data: user, isLoading: isUserLoading } = api.user.getCurrent.useQuery();
  const { data: assets, isLoading: assetsLoading } = api.asset.getAll.useQuery(undefined, {
    initialData: initialAssets,
  });
  const { data: users } = api.user.getAll.useQuery(undefined, {
    initialData: initialUsers,
  });

  // Context
  const utils = api.useContext();

  // Mutations
  const { mutate: transferAsset, isPending: isTransferring } = api.asset.transfer.useMutation({
    onSuccess: async () => {
      await utils.asset.getAll.invalidate();
      setTransferModalOpen(false);
      setSelectedAssetId(null);
      toast({
        title: "Asset transferred successfully",
        description: "The asset has been transferred to the selected user.",
      });
    },
    onError: (error) => {
      toast({
        title: "Transfer failed",
        description: error.message || "There was an error transferring the asset.",
        variant: "destructive",
      });
    },
  });

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onError: (error) => {
      toast({
        title: "Transaction record failed",
        description: error.message || "Failed to record the transaction history.",
        variant: "destructive",
      });
    },
  });

  // State hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [createAssetOpen, setCreateAssetOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<Asset | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/404');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isOwner = (asset: Asset) => {
    return asset.ownerId === user?.id;
  };

  const handleTransfer = (assetId: string, newOwnerId: string) => {
    const asset = assets?.find((a) => a.id === assetId);
    if (!asset || !isOwner(asset)) return;

    transferAsset({
      assetId,
      newOwnerId,
    });

    createTransaction({
      assetId,
      senderId: asset.ownerId,
      receiverId: newOwnerId,
    });
  };

  const availableUsers = users?.filter(u => u.id !== user?.id) ?? [];

  const filteredAssets =
    assets?.filter((asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="container mx-auto space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="AssetFlow Logo" 
              width={32} 
              height={32} 
            />
            <h1 className="text-2xl md:text-3xl font-bold text-white">AssetFlow</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              className="flex items-center gap-2"
              onClick={() => setCreateAssetOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Asset</span>
              <span className="sm:hidden">Create</span>
            </Button>
            <CreateAssetDialog
              open={createAssetOpen}
              onOpenChange={setCreateAssetOpen}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search assets..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
            <span className="sm:hidden">{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </Button>
        </div>

        {/* Loading State */}
        {assetsLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Empty State */}
        {!assetsLoading && sortedAssets.length === 0 && (
          <Alert>
            <AlertDescription>
              No assets found. Try adjusting your search or create a new asset.
            </AlertDescription>
          </Alert>
        )}

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedAssets.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden border-stone-800 bg-stone-900"
            >
              <CardHeader className="p-0">
                <img
                  src={asset.imageUrl ?? "/api/placeholder/200/200"}
                  alt={asset.name}
                  className="h-36 sm:h-48 w-full object-cover"
                />
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <CardTitle className="mb-2 text-lg sm:text-xl text-white">
                  {asset.name}
                </CardTitle>
                <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                  <p className="line-clamp-2">{asset.description}</p>
                  <p>Created: {new Date(asset.createdAt).toLocaleDateString()}</p>
                  {isOwner(asset) && (
                    <p className="flex items-center gap-1 text-emerald-400">
                      <User className="h-3 w-3" />
                      You own this asset
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 p-3 sm:p-4 pt-0">
                {isOwner(asset) && (
                  <Dialog
                    open={transferModalOpen && selectedAssetId === asset.id}
                    onOpenChange={(open) => {
                      setTransferModalOpen(open);
                      if (!open) setSelectedAssetId(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => setSelectedAssetId(asset.id)}
                      >
                        Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-stone-800 bg-stone-900 w-[95%] sm:w-full max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Transfer Asset
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Select a user to transfer &quot;{asset.name}&quot; to
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Select
                          onValueChange={setSelectedReceiverId}
                          value={selectedReceiverId}
                        >
                          <SelectTrigger className="border-stone-700 bg-stone-800 text-white">
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent className="border-stone-700 bg-stone-800 text-white">
                            {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name ?? user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            handleTransfer(asset.id, selectedReceiverId)
                          }
                          disabled={!selectedReceiverId || isTransferring}
                        >
                          {isTransferring ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Transferring...
                            </>
                          ) : (
                            "Confirm Transfer"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedAssetForHistory(asset);
                    setHistoryModalOpen(true);
                  }}
                >
                  History
                </Button>
                <TransactionHistoryDialog
                  open={historyModalOpen && selectedAssetForHistory?.id === asset.id}
                  onOpenChange={(open) => {
                    setHistoryModalOpen(open);
                    if (!open) setSelectedAssetForHistory(null);
                  }}
                  assetId={asset.id}
                  assetName={asset.name}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};
