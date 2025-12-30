import { Customer } from "./customer";

export interface CustomerStatsProps {
  stats: {
    totalCustomers: number;
    customersWithName: number;
    customersWithAddress: number;
    recentCustomers: number;
  };
}

export interface CustomerSearchProps {
  searchQuery: string;
  resultsCount: number;
  onSearchChange: (value: string) => void;
}

export interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
  searchQuery: string;
  paginatedCustomers: Customer[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface ErrorAlertProps {
  error: string;
  onDismiss: () => void;
}