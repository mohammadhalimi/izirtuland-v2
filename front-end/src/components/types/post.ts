import type { Post } from '~/components/types/posts';

export interface PostsHeaderProps {
  postCount: number;
}

export interface PostsMessageProps {
  message: string;
  messageType: 'success' | 'error';
  errorMessage?: string;
  onClose?: () => void;
}

export interface CreatePostFormProps {
  formState: {
    title: string;
    content: string;
    metaDescription: string;
    image: File | null;
    tags: string[];
  };
  newTag: string;
  previewUrl: string;
  isActionLoading: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onFileSelect: (event: Event) => void;
  onTagInput: (value: string) => void;
  onTagKeyPress: (event: KeyboardEvent) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  onResetForm: () => void;
  onSubmit: () => void;
}

export interface PostItemProps {
  post: Post;
  onDeleteClick: (post: Post) => void;
}

export interface PostsListProps {
  posts: Post[];
  onDeleteClick: (post: Post) => void;
}

export interface DeletePostModalProps {
  showModal: boolean;
  selectedPost: Post | null;
  isActionLoading: boolean;
  onClose: () => void;
  onConfirm: (postId: string) => void;
}

export interface PostsProps {
  authToken: string;
}