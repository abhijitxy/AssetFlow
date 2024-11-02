"use client";

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';

const CreateAssetDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = api.user.getCurrent.useQuery();
  
  const utils = api.useContext();
  
  const { mutate: createAsset, isPending } = api.asset.create.useMutation({
    onSuccess: async () => {
      await utils.asset.getAll.invalidate();
      onOpenChange(false);
      resetForm();
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
    });
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    createAsset({
      ...formData,
      ownerId: user.id,
    });
  };

  // Add loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-900 border-stone-800 sm:max-w-[425px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl md:text-2xl">Create New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Asset Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-stone-800 border-stone-700 text-white"
              placeholder="Enter asset name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-stone-800 border-stone-700 h-24 text-white"
              placeholder="Enter asset description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Asset Image</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs rounded-lg mx-auto"
                />
              </div>
            )}
          </div>

          <Button
            variant="outline"
            type="submit"
            className="w-full text-sm md:text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Asset...
              </>
            ) : (
              'Create Asset'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssetDialog;