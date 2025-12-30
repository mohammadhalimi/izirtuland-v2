export interface ProfileHeaderProps {
  username: string;
  role: 'superadmin' | 'admin';
  profileImageUrl?: string;
}

export interface ProfileImageUploadProps {
  previewUrl: string;
  selectedFile: File | null;
  isUploading: boolean;
  currentUsername: string;
  onFileSelect: (event: Event) => void;
  onUpload: () => void;
}

export interface ProfileFormProps {
  currentUsername: string;
  newUsername: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  onUsernameChange: (value: string) => void;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export interface ProfileSecurityInfoProps {
  userId: string;
  username: string;
  role: 'superadmin' | 'admin';
}

export interface ErrorStateProps {
  onRetry: () => void;
}

export interface SuccessMessageProps {
  message: string;
  type: 'success' | 'error';
  onDismiss?: () => void;
}

export interface EditProfileProps {
  authToken: string;
  currentAdmin: {
    _id: string;
    username: string;
    role: 'superadmin' | 'admin';
    profileImage?: string;
  };
}