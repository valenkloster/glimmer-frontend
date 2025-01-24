import { useContext } from 'react';
import { AddressContext } from '../../context/address/AddressContext';
import { TrashIcon } from '@heroicons/react/24/outline';

export const AddressList = () => {
  const { addresses, selectedAddress, setSelectedAddress, loading, deleteAddress } = useContext(AddressContext);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-agua"></div>
    </div>
  );

  if (!addresses.length) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-4 bg-nude rounded-lg">
        <p className="text-gray-600">No tienes direcciones guardadas aún</p>
        <p className="text-sm text-gray-500 mt-2">Crea una nueva dirección para continuar</p>
      </div>
    </div>
  );

  const handleDelete = async (e, id_direccion) => {
    e.stopPropagation();
    try {
      console.log(id_direccion)
      await deleteAddress({ id_direccion });
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
        <div className="space-y-3">
          {addresses.map((item) => (
            <div 
              key={item.id_cliente_direccion}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 relative group ${
                selectedAddress?.id_cliente_direccion === item.id_cliente_direccion
                  ? 'border-verde-agua bg-verde-agua/10'
                  : 'border-gray-200 hover:border-verde-agua'
              }`}
              onClick={() => setSelectedAddress(item)}
            >
              <div className="flex flex-col text-sm">
                <p className="font-medium">{item.direccion.direccion}</p>
                {item.direccion.departamento && (
                  <p className="text-gray-600">Depto: {item.direccion.departamento}</p>
                )}
                <div className="text-gray-500">
                  CP: {item.direccion.codigo_postal} - {item.direccion.localidad.nombre}, {item.direccion.localidad.provincia.nombre}
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(e, item.id_direccion)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};