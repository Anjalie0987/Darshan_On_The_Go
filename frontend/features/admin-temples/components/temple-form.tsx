'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { templeService } from '../services/temples.service';

const CATEGORIES = [
  'Jyotirlinga', 'Shakti Peeth', 'Shiva', 'Vishnu', 'Hanuman', 'Ganesh', 'Gurudwara', 'Other', 'Custom'
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir'
];

export const templeFormSchema = z.object({
  name: z.string().min(1, 'Temple Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  category: z.string().min(1, 'Category is required'),
  customCategory: z.string().optional(),
  youtubeChannelUrl: z.string().regex(/^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]+|@[\w.-]+)$/, 'Must be a valid YouTube Channel URL (e.g. /@channelname or /channel/UC...)').or(z.literal('')),
  isActive: z.boolean().default(true),
}).refine(data => {
  if (data.category === 'Custom' && !data.customCategory?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the custom category',
  path: ['customCategory'],
});

export type TempleFormValues = z.infer<typeof templeFormSchema> & {
  coverImage?: File | null;
};

interface TempleFormProps {
  initialData?: Partial<TempleFormValues>;
  onSubmit: (data: TempleFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function TempleForm({ initialData, onSubmit, isLoading = false }: TempleFormProps) {
  const router = useRouter();

  const defaultCategory = initialData?.category;
  const isCustomInitially = defaultCategory && !CATEGORIES.includes(defaultCategory) && defaultCategory !== 'Custom';

  const form = useForm<z.infer<typeof templeFormSchema>>({
    resolver: zodResolver(templeFormSchema as any),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      state: initialData?.state || '',
      city: initialData?.city || '',
      category: isCustomInitially ? 'Custom' : (defaultCategory || ''),
      customCategory: isCustomInitially ? defaultCategory : '',
      youtubeChannelUrl: initialData?.youtubeChannelUrl || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = form;

  const watchName = watch('name');
  const currentSlug = watch('slug');
  const watchYoutubeUrl = watch('youtubeChannelUrl');

  // Image upload state
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (
    e: React.MouseEvent,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    e.stopPropagation();
    setPreview(null);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };



  // Auto-generate slug when name changes, if creating new temple or if user has not manually modified it
  useEffect(() => {
    if (!initialData?.name || initialData.name !== watchName) {
      if (!currentSlug || currentSlug === initialData?.slug || currentSlug === watchName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
         const generatedSlug = watchName
           .toLowerCase()
           .replace(/[^a-z0-9]+/g, '-')
           .replace(/(^-|-$)+/g, '');
         setValue('slug', generatedSlug, { shouldValidate: true });
      }
    }
  }, [watchName, initialData, setValue, currentSlug]);

  const onFormSubmit = async (data: z.infer<typeof templeFormSchema>) => {
    try {
      const payload = {
        ...data,
        category: data.category === 'Custom' && data.customCategory ? data.customCategory : data.category,
        coverImage: coverFile,
      } as TempleFormValues;

      if ('customCategory' in payload) {
        delete (payload as any).customCategory;
      }

      await onSubmit(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the primary details for the temple.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Temple Name *</Label>
                  <Input id="name" placeholder="e.g., Kashi Vishwanath" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" placeholder="e.g., kashi-vishwanath" {...register('slug')} />
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="A short description about the temple..." 
                  {...register('description')} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Category</CardTitle>
              <CardDescription>Where is it located and what category does it fall under?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select onValueChange={(v) => setValue('state', v as string, { shouldValidate: true })} defaultValue={initialData?.state || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="e.g., Varanasi" {...register('city')} />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(v) => setValue('category', v as string, { shouldValidate: true })} defaultValue={form.getValues('category') || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watch('category') === 'Custom' && (
                  <div className="mt-2">
                    <Input placeholder="Enter custom category" {...register('customCategory')} />
                    {errors.customCategory && <p className="text-sm text-red-500">{errors.customCategory.message}</p>}
                  </div>
                )}
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>YouTube link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="youtube">YouTube Channel URL *</Label>
                  </div>
                  <div className="relative">
                    <Input 
                      id="youtube" 
                      placeholder="https://www.youtube.com/@channel" 
                      {...register('youtubeChannelUrl')} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">URL format: https://www.youtube.com/@channel</p>
                  {errors.youtubeChannelUrl && <p className="text-sm text-red-500">{errors.youtubeChannelUrl.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Images & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload temple cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div 
                  className="relative overflow-hidden flex h-40 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/20 text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setCoverPreview, setCoverFile)}
                  />
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                        onClick={(e) => removeImage(e, setCoverPreview, setCoverFile, coverInputRef)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8 mb-2 opacity-70" />
                      <span className="text-sm font-medium">Click to upload</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 border rounded-md p-4 bg-muted/20">
                <Checkbox 
                  id="isActive" 
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => setValue('isActive', checked as boolean)} 
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="isActive" className="cursor-pointer">Active Temple</Label>
                  <p className="text-xs text-muted-foreground">If unchecked, the temple will be hidden.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/temples')} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Temple
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
