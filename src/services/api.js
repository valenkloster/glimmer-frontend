const baseURL = import.meta.env.VITE_API_URL;

export const productService = {
    getAll: async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/productos`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  
    getById: async (id) => {
      try {
        const response = await fetch(`${baseURL}/api/v1/productos/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
  
    getByCategory: async (categoryId) => {
      try {
        const response = await fetch(`${baseURL}/api/v1/productos/categoria/${categoryId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }
    }
  };

export const categoryService = {
  getAll: async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/categorias`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};