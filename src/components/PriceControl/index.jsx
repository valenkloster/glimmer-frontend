import React, { useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from '../../context';
import { CheckCircleIcon, MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

function PriceControl() {
    const { products, updateProductPrice } = useContext(ShoppingCartContext);
    const [inputValues, setInputValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    useEffect(() => {
        setLoading(false);
    }, []);

    const handleUpdatePrice = async (productId, value, productName) => {
        if (!value || isNaN(value) || value <= 0) return;
        
        setUpdating(productId);
        await updateProductPrice(productId, value);
        setInputValues(prev => ({ ...prev, [productId]: '' }));
        setUpdating(null);
        
        setSuccessMessage(`Precio actualizado: ${productName}`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const filteredAndSortedProducts = products
        .filter(product => 
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'precio') {
                return (a[sortConfig.key] - b[sortConfig.key]) * direction;
            }
            return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
        });

    if (loading) {
        return (
            <div className="animate-pulse p-8">
                <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Mensaje de éxito */}
            <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
                successMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    {successMessage}
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o marca..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-verde-agua focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                    <button 
                                        className="flex items-center gap-2 hover:text-gray-700"
                                        onClick={() => handleSort('nombre')}
                                    >
                                        Producto
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                    <button 
                                        className="flex items-center gap-2 hover:text-gray-700"
                                        onClick={() => handleSort('codigo')}
                                    >
                                        Código
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                    <button 
                                        className="flex items-center gap-2 hover:text-gray-700"
                                        onClick={() => handleSort('marca')}
                                    >
                                        Marca
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                    <button 
                                        className="flex items-center gap-2 hover:text-gray-700"
                                        onClick={() => handleSort('precio')}
                                    >
                                        Precio Actual
                                        <ArrowsUpDownIcon className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                    Nuevo Precio
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAndSortedProducts.map((product) => (
                                <tr 
                                    key={product.id_producto}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={product.imagen} 
                                                alt={product.nombre}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.nombre}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.codigo}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.marca}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            ${product.precio}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-verde-agua focus:border-transparent"
                                                placeholder="Precio"
                                                value={inputValues[product.id_producto] || ''}
                                                onChange={(e) => setInputValues(prev => ({
                                                    ...prev,
                                                    [product.id_producto]: e.target.value
                                                }))}
                                            />
                                            <button
                                                onClick={() => handleUpdatePrice(product.id_producto, inputValues[product.id_producto], product.nombre)}
                                                className="px-4 py-2 bg-verde-agua text-white rounded-lg hover:bg-verde-agua/90 transition-colors"
                                                disabled={updating === product.id_producto}
                                            >
                                                {updating === product.id_producto ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : 'Actualizar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PriceControl;