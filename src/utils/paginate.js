// Pagination utility for large datasets
export const paginateData = (data, page, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return data.slice(start, end);
};

// Get pagination info
export const getPaginationInfo = (totalItems, currentPage, limit = 10) => {
  const totalPages = Math.ceil(totalItems / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);
  
  return {
    totalPages,
    startItem,
    endItem,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems
  };
};

// Generate page numbers array for pagination component
export const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const pages = [];
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
};
