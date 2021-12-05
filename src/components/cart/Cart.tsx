import React from "react"
import CartItem from "./CartItem"

import { makeStyles } from "@material-ui/core/styles"
import { Container } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined"

import { CartItem as CartItemType } from "../../interfaces/index"

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "3rem",
    maxWidth: 800,
    textAlign: "center"
  },
  resetBtn: {
    textTransform: "none"
  }
}))

interface CartProps {
  cartItems: CartItemType[]
  totalCost: number
  setCartItems: Function
}

const Cart: React.FC<CartProps> = ({ cartItems, totalCost, setCartItems }) => {
  const classes = useStyles()

  // カート内の商品をクリア
  const handleResetCart = () => {
    setCartItems([])
  }

  return (
    <>
      <Container className={classes.container}>
        <h2>Your shopping cart</h2>
        { cartItems.length > 0 ? (
          <>
            {cartItems.map((cartItem: CartItemType) => (
              <CartItem
                key={cartItem.id}
                id={cartItem.id}
                title={cartItem.title}
                cost={(cartItem.price || 0) * cartItem.quantity}
                quantity={cartItem.quantity}
              />
            ))}
            <h4>Total cost: ¥{totalCost.toFixed(2)}</h4>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              startIcon={<ClearOutlinedIcon />}
              className={classes.resetBtn}
              onClick={handleResetCart}
            >
              Clear cart
            </Button>
          </>
        ) : (
          <p>Empty</p>
        )}
      </Container>
    </>
  )
}

export default Cart