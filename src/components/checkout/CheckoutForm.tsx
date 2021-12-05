import React, { useState } from "react"

import { CardElement, useStripe, useElements, } from "@stripe/react-stripe-js"

import { makeStyles } from "@material-ui/core/styles"
import { Container } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Slide from "@material-ui/core/Slide"
import { TransitionProps } from "@material-ui/core/transitions"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles(() => ({
  container: {
    margin: "5rem 0 3rem",
    textAlign: "center"
  },
  agreeBtn: {
    textTransform: "none"
  },
  submitBtn: {
    textTransform: "none"
  }
}))

interface CompletionDialogProps {
  open: boolean
  title: string
  text: string
  handleClose: VoidFunction
}

// 決済処理後に表示するダイアログ（成功時も失敗時も）
const CompletionDialog = ({ open, title, text, handleClose }: CompletionDialogProps) => {
  const classes = useStyles()

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleClose}
            className={classes.agreeBtn}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

interface CheckoutFormProps {
  totalCost: number
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalCost}) => {
  const classes = useStyles()

  const [status, setStatus] = useState<"default" | "submitting" | "succeeded" | "failed">("default")
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const stripe = useStripe()
  const elements = useElements()

  // Stripeの決済方法はCharges APIとPayment Intents APIの２種類があるのでどちらかを選択
  // Charges: シンプルな一方、SCA対応していないためセキュリティ度はやや低い
  // Payment Intents: Chargesに比べて支払いまでのプロセスが増える一方、SCA対応しているためセキュリティ度は高い
  // 参照: https://stripe.com/docs/payments/payment-intents/migration/charges#understanding-the-stripe-payment-apis
  // 必ずしもどちらが良いかというわけではなく上手く使い分けるのが望ましいらしいが、今後の新機能はPayment Intents APIのみに追加されるとの事

  // なので今回はPayment Intents API方式で実装
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setStatus("submitting")

    try {
      const res = await fetch("/.netlify/functions/paymentIntents", {
        method: "POST",
        body: JSON.stringify({
          amount: totalCost
        }),
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      const client_secret = data.client_secret // レスポンス内からclient_secretを取得

      const card = elements?.getElement(CardElement) || { "token": ""} // クレジットカード情報を取得

      // 決済処理
      const result = await stripe?.confirmCardPayment(client_secret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "Test User"
            // 他にもaddress（住所）、email（メールアドレス）、phone（電話番号）などが付与可能
          }
        }
      })

      if (result?.paymentIntent?.status === "succeeded") {
        setStatus("succeeded")
      } else {
        throw new Error("Network response was not ok.")
      }
    } catch (err) {
      setStatus("failed")
    }

    handleOpen()
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit}>
        <h4>Would you like to complete the purchase?</h4>
        <CardElement />
        <Button
          type="submit"
          variant="outlined"
          disabled={status === "submitting"} // submitting中は再度ボタンを押せないように
          startIcon={<KeyboardArrowUpIcon />}
          className={classes.submitBtn}
        >
          {status === "submitting" ? "Submitting" : "Submit"}
        </Button>
      </form>
      <CompletionDialog
        open={open}
        title={status === "succeeded" ? "Succeeded!" : "Failed"}
        text={status === "succeeded" ? "Thank you, your payment was successful!" : "Sorry, something went wrong. Please check your credit card information again."}
        handleClose={handleClose}
      />
    </Container>
  )
}

export default CheckoutForm