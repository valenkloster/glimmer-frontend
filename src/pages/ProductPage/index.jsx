import { useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ShoppingCartContext } from '../../context';
import ProductDetail from '../../components/ProductDetail';
// import Reviews from '../../components/Reviews';

const ProductPage = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const { products, setProductToShow } = useContext(ShoppingCartContext);

  // Cargar el producto cuando el ID cambia
  useEffect(() => {
    const product = products.find((product) => product.id === parseInt(id));
    console.log(product)
    if (product) {
      setProductToShow(product); // Establece el producto a mostrar en el contexto
    }
  }, [id, products, setProductToShow]);

  return (
    <div className='m-8 w-10/12 h-screen'>
        < ProductDetail/>
    </div>
  );
};

export default ProductPage;
