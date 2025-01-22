import { useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ShoppingCartContext } from '../../context';
import ProductDetail from '../../components/ProductDetail';
// import Reviews from '../../components/Reviews';

const ProductPage = () => {
  const { id } = useParams();
  const { products, setProductToShow } = useContext(ShoppingCartContext);

  useEffect(() => {
    const product = products.find((product) => product.id === parseInt(id));
    console.log(product)
    if (product) {
      setProductToShow(product);
    }
  }, [id, products, setProductToShow]);

  return (
    <div className='m-8 w-10/12 h-screen'>
        < ProductDetail/>
    </div>
  );
};

export default ProductPage;
