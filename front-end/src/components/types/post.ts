import { QRL } from '@builder.io/qwik';
import type { Post } from '~/components/types/posts';

export interface PostsHeaderProps {
  postCount: number;
}

export interface PostsMessageProps {
  message: string;
  messageType: 'success' | 'error';
  errorMessage?: string;
  onClose?: QRL<() => void>;
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
  onTitleChange: QRL<(value: string) => void>;
  onMetaDescriptionChange: QRL<(value: string) => void>;
  onContentChange: QRL<(value: string) => void>;
  onTagInput: QRL<(value: string) => void>;
  onRemoveTag: QRL<(index: number) => void>;
  onAddTag: QRL<() => void>;
  onTagKeyPress: QRL<(e: KeyboardEvent) => void>;
  onFileSelect: QRL<(e: Event) => void>;
  onResetForm: QRL<() => void>;
  onSubmit: QRL<() => void>;
}

export interface PostItemProps {
  post: Post;
  onDeleteClick: QRL<(post: Post) => void>;
}

export interface PostsListProps {
  posts: Post[];
  onDeleteClick: QRL<(post: Post) => void>;
}

export interface DeletePostModalProps {
  showModal: boolean;
  selectedPost: Post | null;
  isActionLoading: boolean;
  onClose: QRL<() => void>;
  onConfirm: QRL<(postId: string) => void>;
}

export interface PostsProps {
  authToken: string;
}