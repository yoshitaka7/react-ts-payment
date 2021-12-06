import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles(() => ({
  card: {
    minWidth: 300,
    margin: "1rem",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow:
        "1px 0px 20px -1px rgba(0,0,0,0.2), 0px 0px 20px 5px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      transform: "translateY(-3px)"
    }
  },
  cardHeader: {
    textAlign: "center"
  },
  cardMedia: {
    height: 0,
    paddingTop: "56.25%"
  },
  box: {
    padding: "0 1rem 1rem"
  },
  cartBtn: {
    textTransform: "none"
  }
}))

//props型定義
interface ProductProps {
  handleAddToCart: React.MouseEventHandler<HTMLButtonElement> | undefined
  price: number
  title: string
  description: string
  image: string
}

const Product: React.FC<ProductProps> = ({ handleAddToCart, price, title, description, image }) => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardHeader
        title={title}
        className={classes.cardHeader}
      />
      <CardMedia className={classes.cardMedia} image={image} title={title} />
      <CardContent>
        <Typography variant="body1" color="inherit" component="p" align="center" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" align="center">
          ¥{price}
        </Typography>
      </CardContent>
      <Box className={classes.box}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ShoppingCartOutlinedIcon />}
          className={classes.cartBtn}
          fullWidth
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </Box>
    </Card>
  )
}

export default Product