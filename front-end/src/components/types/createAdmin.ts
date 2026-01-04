import { QRL } from "@builder.io/qwik";

export interface CreateAdminProps {
  authToken: string;
  currentAdmin: {
    _id: string;
    username: string;
    role: 'superadmin' | 'admin';
  };
}

export interface Admin {
  _id: string;
  username: string;
  role: 'superadmin' | 'admin';
  createdAt?: string;
  profileImage?: string;
  lastLogin?: string;
}

export interface AdminHeaderProps {
  currentAdmin: {
    username: string;
    role: 'admin' | 'superadmin';
  };
}

export interface CreateAdminFormProps {
  username: { value: string };
  password: { value: string };
  confirmPassword: { value: string };
  isLoading: { value: boolean };
  message: { value: string };
  messageType: { value: 'success' | 'error' };
  onSubmit: QRL<() => void>;
  currentAdminRole: 'admin' | 'superadmin';
}

export interface HelpSectionProps {
  currentAdminRole: 'admin' | 'superadmin';
}

export interface AdminListProps {
  admins: Admin[];
  loadingAdmins: boolean;
  currentAdmin: Admin;
  deletingAdminId: string | null;
  onRefresh: QRL<() => void>;
  onDeleteClick: QRL<(admin: Admin) => void>;
}

export interface DeleteAdminModalProps {
  showModal: boolean;
  adminToDelete: Admin | null;
  deletingAdminId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}