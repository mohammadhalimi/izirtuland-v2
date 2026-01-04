// src/components/admin/dashboard/Posts.tsx
import { component$, useSignal, useTask$, useStore, $ } from '@builder.io/qwik';
import type { Post } from '~/components/types/posts';
import { API_BASE_URL } from '~/config/api';
import type { PostsProps } from '~/components/types/post';
import { PostsHeader } from '~/components/dashboard/post/PostsHeader';
import { LoadingState } from '~/components/ProductId/LoadingState';
import { PostsMessage } from '~/components/dashboard/post/PostsMessage';
import { CreatePostForm } from '~/components/dashboard/post/CreatePostForm';
import { PostsList } from '~/components/dashboard/post/PostsList';
import { DeletePostModal } from '~/components/dashboard/post/DeletePostModal';

export default component$<PostsProps>(({ authToken }) => {
  // State management
  const posts = useSignal<Post[]>([]);
  const isLoading = useSignal(true);
  const showDeleteModal = useSignal(false);
  const selectedPost = useSignal<Post | null>(null);
  const isActionLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');
  const previewUrl = useSignal('');
  const newTag = useSignal('');
  const errorMessage = useSignal('');

  // Form state
  const formState = useStore({
    title: '',
    content: '',
    metaDescription: '',
    image: null as File | null,
    tags: [] as string[]
  });

  // Reset form
  const resetForm = $(() => {
    formState.title = '';
    formState.content = '';
    formState.metaDescription = '';
    formState.image = null;
    formState.tags = [];
    previewUrl.value = '';
    newTag.value = '';
  });

  // Fetch posts
  useTask$(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/my-posts`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        const postsData = await response.json();
        const postsArray = Array.isArray(postsData) ? postsData : (postsData.posts || postsData.data || []);

        posts.value = postsArray.map((post: any) => ({
          ...post,
          author: post.author || { username: 'شما' },
          metaDescription: post.metaDescription || '',
          tags: Array.isArray(post.tags) ? post.tags : [],
          createdAt: post.createdAt || new Date().toISOString()
        }));
      } else {
        errorMessage.value = 'خطا در دریافت پست‌های شما';
      }
    } catch  {
      errorMessage.value = 'خطا در ارتباط با سرور';
    } finally {
      isLoading.value = false;
    }
  });

  // Tag management
  const addTag = $(() => {
    const tag = newTag.value.trim();
    if (tag && !formState.tags.includes(tag)) {
      formState.tags = [...formState.tags, tag];
      newTag.value = '';
    }
  });

  const removeTag = $((index: number) => {
    formState.tags = formState.tags.filter((_, i) => i !== index);
  });

  const handleTagKeyPress = $((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  });

  // File selection
  const handleFileSelect = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        showMessage('لطفاً فقط فایل تصویر انتخاب کنید', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showMessage('حجم فایل باید کمتر از ۵ مگابایت باشد', 'error');
        return;
      }

      formState.image = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });

  // Message handling
  const showMessage = $((msg: string, type: 'success' | 'error') => {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => message.value = '', type === 'success' ? 5000 : 3000);
  });

  // Create post
  const handleCreatePost = $(async () => {
    if (!formState.title.trim() || !formState.content.trim()) {
      showMessage('عنوان و محتوای پست الزامی است', 'error');
      return;
    }

    isActionLoading.value = true;

    try {
      const formData = new FormData();
      formData.append('title', formState.title.trim());
      formData.append('content', formState.content.trim());
      formData.append('metaDescription', formState.metaDescription.trim());
      formData.append('tags', formState.tags.join(','));

      if (formState.image) {
        formData.append('image', formState.image);
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`خطای سرور: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      const newPost: Post = {
        ...data.post,
        author: data.post.author || { username: 'شما' },
        metaDescription: data.post.metaDescription || '',
        tags: Array.isArray(data.post.tags) ? data.post.tags : [],
        createdAt: data.post.createdAt || new Date().toISOString()
      };

      posts.value = [newPost, ...posts.value];
      resetForm();
      showMessage('🎉 پست جدید با موفقیت ایجاد شد!', 'success');
    } catch (error: any) {
      showMessage(`خطا در ایجاد پست: ${error.message}`, 'error');
    } finally {
      isActionLoading.value = false;
    }
  });

  // Delete post
  const handleDeletePost = $(async (postId: string) => {
    isActionLoading.value = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);
        posts.value = posts.value.filter(post => post._id !== postId);
        showDeleteModal.value = false;
        showMessage(data.message || '🗑️ پست با موفقیت حذف شد', 'success');
      } else {
        const data = JSON.parse(responseText);
        showMessage(data.message || 'خطا در حذف پست', 'error');
      }
    } catch {
      showMessage('خطا در ارتباط با سرور', 'error');
    } finally {
      isActionLoading.value = false;
    }
  });

  // Close delete modal
  const closeDeleteModal = $(() => {
    showDeleteModal.value = false;
    selectedPost.value = null;
  });

  // Event handlers
  const handleTitleChange = $((value: string) => {
    formState.title = value;
  });

  const handleContentChange = $((value: string) => {
    formState.content = value;
  });

  const handleMetaDescriptionChange = $((value: string) => {
    formState.metaDescription = value;
  });

  const handleTagInput = $((value: string) => {
    newTag.value = value;
  });

  const handleDeleteClick = $((post: Post) => {
    selectedPost.value = post;
    showDeleteModal.value = true;
  });

  const handleMessageClose = $(() => {
    message.value = '';
  });

  // Loading state
  if (isLoading.value) {
    return <LoadingState />;
  }

  return (
    <div class="space-y-6">
      {/* Header & Stats */}
      <PostsHeader postCount={posts.value.length} />

      {/* Messages */}
      <PostsMessage
        message={message.value}
        messageType={messageType.value}
        errorMessage={errorMessage.value}
        onClose={handleMessageClose}
      />

      {/* Create Post Form */}
      <CreatePostForm
        formState={formState}
        newTag={newTag.value}
        previewUrl={previewUrl.value}
        isActionLoading={isActionLoading.value}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onMetaDescriptionChange={handleMetaDescriptionChange}
        onFileSelect={handleFileSelect}
        onTagInput={handleTagInput}
        onTagKeyPress={handleTagKeyPress}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onResetForm={resetForm}
        onSubmit={handleCreatePost}
      />

      {/* Posts List */}
      <PostsList
        posts={posts.value}
        onDeleteClick={handleDeleteClick}
      />

      {/* Delete Modal */}
      <DeletePostModal
        showModal={showDeleteModal.value}
        selectedPost={selectedPost.value}
        isActionLoading={isActionLoading.value}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePost}
      />
    </div>
  );
});