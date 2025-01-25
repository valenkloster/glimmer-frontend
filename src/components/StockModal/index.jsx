import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const StockModal = ({ isOpen, onClose, stockIssues, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Ajuste de Stock</h3>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>
        
        <div className="mb-6">
          <p className="mb-4">Algunos productos requieren ajuste por disponibilidad:</p>
          <ul className="space-y-2">
            {stockIssues.map(item => (
              <li key={item.id_producto} className="text-sm">
                <span className="font-medium">{item.producto.nombre}</span>
                <br />
                Cantidad actual: {item.cantidad} → Disponible: {item.producto.stock}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Volver al carrito
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            Continuar con ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockModal;