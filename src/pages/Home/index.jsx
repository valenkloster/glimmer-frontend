import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import ProductDetail from '../../components/ProductDetail'

function Home() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/products') // traemos la info en tipo promesa
      .then(response => response.json()) // tomamos la respuesta en json
      .then(data => setItems(data)) // agregamos los items al estado
  }, [])

  // Por cada elemento mostramos una card
  return (
    <Layout>
      <div className='grid gap-10 grid-cols-4 w-full max-w-screen-xl'>
        {
          items?.map(item => (
            <Card
              key={item.id}
              data={item}
             />
          ))
        }
      </div>
      < ProductDetail />
    </Layout>
  )
}

export default Home