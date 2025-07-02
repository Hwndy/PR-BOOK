export interface ResourcePost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  tags?: string[];
  author: string;
  status: 'draft' | 'published';
  date: string;
  publishedAt: string;
  linkedinUrl?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isManual?: boolean;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
}

export interface ResourceStats {
  totalPosts: number;
  totalEngagement: number;
  lastUpdated: string;
  posts: ResourcePost[];
  profileName?: string;
  profileUrl?: string;
  linkedinConnected?: boolean;
}

export interface ResourceFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  tags: string;
  author: string;
  status: 'draft' | 'published';
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
}

export const RESOURCE_CATEGORIES = [
  'PR Measurement',
  'Digital PR',
  'Strategy',
  'Industry Trends',
  'Case Studies',
  'Analytics',
  'Insights'
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];

export interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ResourceFormData, imageFile?: File) => Promise<void>;
  selectedPost?: ResourcePost | null;
  saving?: boolean;
  onPreview?: () => void;
  formData: ResourceFormData;
  onFormDataChange: (data: ResourceFormData) => void;
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  imagePreview: string;
  onImagePreviewChange: (preview: string) => void;
  imageUploadType: 'upload' | 'url';
  onImageUploadTypeChange: (type: 'upload' | 'url') => void;
}

export interface ResourceListProps {
  posts: ResourcePost[];
  onEdit: (post: ResourcePost) => void;
  onDelete: (postId: string) => void;
}

export interface ResourceStatsProps {
  stats: ResourceStats | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onCreateNew: () => void;
}

export interface ResourcePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ResourceFormData;
  imagePreview: string;
  onSave: () => void;
  saving: boolean;
  selectedPost?: ResourcePost | null;
}

export interface ResourceImageUploadProps {
  imageUploadType: 'upload' | 'url';
  onTypeChange: (type: 'upload' | 'url') => void;
  imageFile: File | null;
  onFileChange: (file: File | null) => void;
  imagePreview: string;
  onUrlChange: (url: string) => void;
  imageUrl: string;
  uploading: boolean;
}
