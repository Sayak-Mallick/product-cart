// Mock data generation for 1000+ products
export const generateMockProducts = (count = 1000) => {
  const categories = ["Electronics", "Grocery", "Clothing", "Accessories", "Books", "Home & Garden", "Sports", "Beauty"];
  const productsMap = new Map();
  
  const productNames = {
    Electronics: ["Laptop", "Smartphone", "Tablet", "Headphones", "Camera", "Smart Watch", "Gaming Console", "Monitor"],
    Grocery: ["Organic Apples", "Whole Wheat Bread", "Fresh Milk", "Chicken Breast", "Basmati Rice", "Olive Oil", "Greek Yogurt", "Bananas"],
    Clothing: ["Cotton T-Shirt", "Denim Jeans", "Leather Jacket", "Running Shoes", "Formal Shirt", "Casual Dress", "Winter Coat", "Sneakers"],
    Accessories: ["Leather Wallet", "Sunglasses", "Wrist Watch", "Handbag", "Belt", "Jewelry Set", "Phone Case", "Backpack"],
    Books: ["Programming Guide", "Mystery Novel", "Science Fiction", "Biography", "Cookbook", "Self-Help", "History Book", "Art Book"],
    "Home & Garden": ["Garden Tools", "Kitchen Utensils", "Bed Sheets", "Curtains", "Plant Pots", "Cleaning Supplies", "Decorative Vase", "Cushions"],
    Sports: ["Tennis Racket", "Football", "Yoga Mat", "Dumbbells", "Bicycle", "Swimming Goggles", "Running Shoes", "Gym Bag"],
    Beauty: ["Face Cream", "Shampoo", "Lipstick", "Perfume", "Nail Polish", "Face Mask", "Hair Oil", "Moisturizer"]
  };

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const productNamesForCategory = productNames[category];
    const baseName = productNamesForCategory[Math.floor(Math.random() * productNamesForCategory.length)];
    
    const product = {
      id: i,
      name: `${baseName} ${i}`,
      category: category,
      price: Math.floor(Math.random() * 10000) + 100, // ₹100 to ₹10,100
      stock: Math.floor(Math.random() * 100) + 1, // 1 to 100
      status: Math.random() > 0.8 ? "Out of Stock" : "In Stock",
      image: `https://via.placeholder.com/50x50?text=${i}`,
      description: `High quality ${baseName.toLowerCase()} with excellent features and durability.`,
      rating: (Math.random() * 5).toFixed(1)
    };
    
    // Set out of stock products to have 0 stock
    if (product.status === "Out of Stock") {
      product.stock = 0;
    }
    
    productsMap.set(i, product);
  }
  
  return Array.from(productsMap.values());
};

export const getUniqueCategories = (products) => {
  const categorySet = new Set();
  products.forEach(product => categorySet.add(product.category));
  return Array.from(categorySet);
};

export const getLowStockProducts = (products, threshold = 5) => {
  return products.filter(product => product.stock <= threshold && product.stock > 0);
};

export const getTotalRevenue = (products) => {
  return products.reduce((total, product) => total + product.price, 0);
};
