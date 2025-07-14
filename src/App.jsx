import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ProductTable from './components/ProductTable';
import CartSidebar from './components/CartSidebar';
import Pagination from './components/Pagination';
import { generateMockProducts, getUniqueCategories, getLowStockProducts } from './utils/dataGenerator';
import { debounce, searchProducts, filterByCategory, sortProducts } from './utils/search';
import { paginateData, getPaginationInfo } from './utils/paginate';

function App() {
  // State management
  const [allProducts] = useState(() => generateMockProducts(1000));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const ITEMS_PER_PAGE = 10;
  
  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  
  // Get unique categories
  const categories = useMemo(() => getUniqueCategories(allProducts), [allProducts]);
  
  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = searchProducts(allProducts, debouncedSearchTerm);
    filtered = filterByCategory(filtered, selectedCategory);
    filtered = sortProducts(filtered, sortBy, sortOrder);
    return filtered;
  }, [allProducts, debouncedSearchTerm, selectedCategory, sortBy, sortOrder]);
  
  // Paginate products
  const paginatedProducts = useMemo(() => {
    return paginateData(processedProducts, currentPage, ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);
  
  // Pagination info
  const paginationInfo = useMemo(() => {
    return getPaginationInfo(processedProducts.length, currentPage, ITEMS_PER_PAGE);
  }, [processedProducts.length, currentPage]);
  
  // Stats calculations
  const stats = useMemo(() => {
    const lowStockItems = getLowStockProducts(allProducts);
    const totalRevenue = allProducts.reduce((sum, product) => sum + product.price, 0);
    
    return {
      totalProducts: allProducts.length,
      lowStock: lowStockItems.length,
      totalRevenue: totalRevenue,
      totalCategories: categories.length
    };
  }, [allProducts, categories]);
  
  // Event handlers
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  
  const handleSortChange = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onCartToggle={handleCartToggle}
        />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              icon="📦"
              color="blue"
            />
            <StatsCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon="💰"
              color="green"
            />
            <StatsCard
              title="Low Stock"
              value={stats.lowStock}
              icon="⚠️"
              color="red"
              subtitle="Items with ≤5 stock"
            />
            <StatsCard
              title="Categories"
              value={stats.totalCategories}
              icon="🏷️"
              color="purple"
            />
          </div>
          
          {/* Product Table */}
          <div className="mb-6">
            <ProductTable
              products={paginatedProducts}
              onCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
              categories={categories}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalPages}
            onPageChange={handlePageChange}
            totalItems={paginationInfo.totalItems}
            startItem={paginationInfo.startItem}
            endItem={paginationInfo.endItem}
          />
        </main>
        
        {/* Cart Sidebar */}
        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </CartProvider>
  );
}

export default App;
