import { QRL } from "@builder.io/qwik";
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
  onSearchChange: QRL<(value: string) => void>;
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
  onPageChange: QRL<(page: number) => void>;
}

export interface ErrorAlertProps {
  error: string;
  onDismiss: QRL<() => void>;
}