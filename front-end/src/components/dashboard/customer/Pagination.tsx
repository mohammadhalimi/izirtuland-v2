// src/components/admin/dashboard/customer/Pagination.tsx
import { component$ } from '@builder.io/qwik';
import { PaginationProps } from '~/components/types/customerPanelAdmin';



export const Pagination = component$<PaginationProps>(({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages - 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Info */}
                <div class="text-sm text-gray-700">
                    نمایش <span class="font-semibold">{startItem}</span> تا{' '}
                    <span class="font-semibold">{endItem}</span> از{' '}
                    <span class="font-semibold">{totalItems}</span> مشتری
                </div>

                {/* Page Navigation */}
                <div class="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick$={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>قبلی</span>
                    </button>

                    {/* Page Numbers */}
                    <div class="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick$={() => typeof page === 'number' && onPageChange(page)}
                                disabled={page === '...' || page === currentPage}
                                class={`
                  w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200
                  ${page === currentPage
                                        ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-md'
                                        : page === '...'
                                            ? 'text-gray-400 cursor-default'
                                            : 'border border-gray-300 hover:bg-gray-50 hover:border-green-300 text-gray-700'
                                    }
                `}
                            >
                                {page === '...' ? '...' : page}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick$={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <span>بعدی</span>
                        <span>→</span>
                    </button>
                </div>
            </div>

            {/* Quick Navigation */}
            <div class="mt-4 flex items-center justify-center gap-4">
                <div class="text-xs text-gray-500">برو به صفحه:</div>
                <div class="flex gap-2">
                    {[1, 2, totalPages - 1, totalPages].filter((p, i, arr) =>
                        p > 0 && arr.indexOf(p) === i
                    ).map(page => (
                        <button
                            key={page}
                            onClick$={() => onPageChange(page)}
                            class={`text-xs px-3 py-1 rounded ${currentPage === page
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});