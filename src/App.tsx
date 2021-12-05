import React, { useState } from "react"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { Container, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { products } from "./data/products"
import Product from "./components/product/Product"
import Cart from "./components/cart/Cart"
import CheckoutForm from "./components/checkout/CheckoutForm"

import Header from "./components/layouts/Header"

import { CartItem as CartItemType } from "./interfaces/index"

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "3rem"
  }
}))

const App: React.FC = () => {
  const classes = useStyles()

  const [cartItems, setCartItems] = useState<CartItemType[]>([])

  const handleAddToCart = (id: number) => {
    setCartItems((cartItems: CartItemType[]) => {
      const cartItem = cartItems.find((item) => item.id === id)

      // すでに同じ商品が入っている場合は数量を増加
      if (cartItem) {
        return cartItems.map((item) => {
          if (item.id !== id) return item
          return { ...cartItem, quantity: item.quantity + 1 }
        })
      }

      // そうでない場合は新たに追加
      const newCartItem = products.find(item => item.id === id)
      return [...cartItems, { ...newCartItem, quantity: 1 }]
    })
  }

  // 合計金額を算出
  const totalCost = cartItems.reduce(
    (acc: number, item: CartItemType) => acc + (item.price || 0) * item.quantity,
    0
  )

  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || "" // Stripe APIの公開鍵
  const stripePromise = loadStripe(stripePublicKey)

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Container maxWidth="lg">
          <Grid container spacing={4} justify="center" className={classes.container}>
            {products.map(product => (
              <Grid item key={product.id}>
                <Product
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  handleAddToCart={() => handleAddToCart(product.id)}
                />
              </Grid>
            ))}
          </Grid>
          <Cart
            cartItems={cartItems}
            totalCost={totalCost}
            setCartItems={setCartItems}
          />
          { cartItems.length > 0 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm totalCost={totalCost} />
            </Elements>
          )}
        </Container>
      </main>
    </>
  )
}

export default App
