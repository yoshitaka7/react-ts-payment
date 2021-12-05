import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
    marginTop: 0
  },
  item: {
    textAlign: "center",
    display: "table-cell",
    verticalAlign: "middle"
  },
  divider: {
    marginTop: "0.5rem"
  }
}))

interface CartItemProps {
  id: number | undefined
  title: string | undefined
  quantity: number
  cost: number | undefined
}

const CartItem: React.FC<CartItemProps> = ({ title, quantity, cost }) => {
  const classes = useStyles()

  return (
    <>
      <Grid container spacing={3} justify="center" className={classes.container}>
        <Grid item xs={4} className={classes.item}>
          {title}
        </Grid>
        <Grid item xs={4} className={classes.item}>
          {quantity}
        </Grid>
        <Grid item xs={4} className={classes.item}>
          ¥{cost}
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </>
  )
}

export default CartItem