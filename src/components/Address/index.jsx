import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AddressContext } from '../../context/address/AddressContext';

export const Address = () => {
  const { provincias, loading, error, fetchProvincias, createAddress } = useContext(AddressContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchProvincias();
  }, []);

  const onSubmit = async (data) => {
    try {
      const addressData = {
        direccion: data.direccion,
        departamento: data.departamento || null,
        codigo_postal: data.codigo_postal,
        localidad: {
          nombre: data.localidad,
          provincia: {
            id_provincia: parseInt(data.provincia)
          }
        }
      };
      
      await createAddress(addressData);
      reset();
    } catch (err) {
      console.error('Error creating address:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Dirección
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-verde-agua focus:ring-verde-agua/50"
            placeholder="Ingresa tu dirección"
            {...register("direccion", { required: "Este campo es requerido" })}
          />
        </label>
        {errors.direccion && <span className="text-red-500 text-xs">{errors.direccion.message}</span>}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Departamento (opcional)
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-verde-agua focus:ring-verde-agua/50"
            placeholder="Número de departamento, piso, etc."
            {...register("departamento")}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Código Postal
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-verde-agua focus:ring-verde-agua/50"
            placeholder="Ej: 1414"
            {...register("codigo_postal", { 
              required: "Este campo es requerido",
              pattern: {
                value: /^[0-9]{4}$/,
                message: "El código postal debe tener 4 dígitos numéricos"
              }
            })}
          />
        </label>
        {errors.codigo_postal && <span className="text-red-500 text-xs">{errors.codigo_postal.message}</span>}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Localidad
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-verde-agua focus:ring-verde-agua/50"
            placeholder="Ingresa tu localidad"
            {...register("localidad", { required: "Este campo es requerido" })}
          />
        </label>
        {errors.localidad && <span className="text-red-500 text-xs">{errors.localidad.message}</span>}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Provincia
          <select
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-verde-agua focus:ring-verde-agua/50"
            {...register("provincia", { required: "Este campo es requerido" })}
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.id_provincia} value={provincia.id_provincia}>
                {provincia.nombre}
              </option>
            ))}
          </select>
        </label>
        {errors.provincia && <span className="text-red-500 text-xs">{errors.provincia.message}</span>}
      </div>

      <button
        type="submit"
        className="w-full bg-verde-agua text-white font-product py-2 px-4 rounded-full hover:bg-opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar Dirección'}
      </button>
    </form>
  );
};