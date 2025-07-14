import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

const ProductTable = ({ 
  products, 
  onCategoryChange, 
  selectedCategory, 
  categories, 
  onSortChange, 
  sortBy, 
  sortOrder 
}) => {
  const { addToCart } = useCart();
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  // Initial column order
  const [columnOrder, setColumnOrder] = useState([
    { key: 'id', label: 'ID', width: 'w-16' },
    { key: 'image', label: 'Image', width: 'w-20' },
    { key: 'name', label: 'Name', width: 'w-64' },
    { key: 'category', label: 'Category', width: 'w-32' },
    { key: 'price', label: 'Price', width: 'w-24' },
    { key: 'stock', label: 'Stock', width: 'w-20' },
    { key: 'status', label: 'Status', width: 'w-24' },
    { key: 'actions', label: 'Actions', width: 'w-32' }
  ]);
  
  // Drag and drop handlers
  const handleDragStart = (e, columnIndex) => {
    setDraggedColumn(columnIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };
  
  const handleDragOver = (e, columnIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnIndex);
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedColumn === null || draggedColumn === dropIndex) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }
    
    const newColumnOrder = [...columnOrder];
    const draggedItem = newColumnOrder[draggedColumn];
    
    // Remove the dragged item
    newColumnOrder.splice(draggedColumn, 1);
    // Insert at new position
    newColumnOrder.splice(dropIndex, 0, draggedItem);
    
    setColumnOrder(newColumnOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };
  
  const handleSort = (column) => {
    if (column === 'image' || column === 'actions') return;
    
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(column, newOrder);
  };
  
  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };
  
  const renderCellContent = (product, column) => {
    switch (column.key) {
      case 'id':
        return <span className="text-sm text-gray-900 font-medium">{product.id}</span>;
      
      case 'image':
        return (
          <img
            src={product.image}
            alt={product.name}
            className="h-12 w-12 object-cover rounded-lg"
          />
        );
      
      case 'name':
        return (
          <div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
          </div>
        );
      
      case 'category':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.category}
          </span>
        );
      
      case 'price':
        return <span className="text-sm font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>;
      
      case 'stock':
        return (
          <span className={`text-sm font-medium ${
            product.stock === 0 ? 'text-red-600' : 
            product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {product.stock}
          </span>
        );
      
      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.status === 'In Stock' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.status}
          </span>
        );
      
      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add to Cart
            </button>
            
            <button className="text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            
            <button className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded p-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [column, order] = e.target.value.split('-');
                  onSortChange(column, order);
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id-asc">ID (A-Z)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="stock-asc">Stock (Low to High)</option>
                <option value="stock-desc">Stock (High to Low)</option>
                <option value="category-asc">Category (A-Z)</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {products.length} products found
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnOrder.map((column, index) => (
                <th
                  key={column.key}
                  draggable={column.key !== 'actions'}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => handleSort(column.key)}
                  className={`${column.width} px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors duration-200 ${
                    dragOverColumn === index ? 'bg-blue-100' : ''
                  } ${column.key !== 'image' && column.key !== 'actions' ? 'hover:text-gray-700' : ''}`}
                >
                  <div className="flex items-center space-x-1">
                    {column.key !== 'actions' && (
                      <span className="text-gray-400">≡</span>
                    )}
                    <span>{column.label}</span>
                    <span className="text-blue-600 font-bold">{getSortIcon(column.key)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                {columnOrder.map((column) => (
                  <td key={`${product.id}-${column.key}`} className={`${column.width} px-6 py-4 whitespace-nowrap`}>
                    {renderCellContent(product, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2v1z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
