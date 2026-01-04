import { QRL } from "@builder.io/qwik";

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
  onFileSelect: QRL<(event: Event) => void>;
  onUpload: QRL<() => void>;
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
  onUsernameChange: QRL<(value: string) => void>;
  onCurrentPasswordChange: QRL<(value: string) => void>;
  onNewPasswordChange: QRL<(value: string) => void>;
  onConfirmPasswordChange: QRL<(value: string) => void>;
  onSubmit: QRL<() => void>;
}

export interface ProfileSecurityInfoProps {
  userId: string;
  username: string;
  role: 'superadmin' | 'admin';
}

export interface ErrorStateProps {
  onRetry: QRL<() => void>;
}

export interface SuccessMessageProps {
  message: string;
  type: 'success' | 'error';
  onDismiss?: QRL<() => void>;
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