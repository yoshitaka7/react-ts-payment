import Stripe from "stripe"

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(secretKey, { apiVersion: "2020-08-27" })

exports.handler = async (event, context, callback) => {
  // POSTメソッド以外は拒否
  if (event.httpMethod !== "POST") {
    return callback(null, { statusCode: 405, body: "Method Not Allowed" })
  }

  const data = JSON.parse(event.body)

  // 1円に満たない金額だった場合はエラー
  if (parseInt(data.amount) < 1) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Some required fields were not supplied."
      })
    })
  }

  await stripe.paymentIntents.create({
    amount: parseInt(data.amount),
    currency: "jpy",
    description: "Sample Shop",
    metadata: { integration_check: "accept_a_payment" }
  })
  .then(({ client_secret }) => {
    return callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        client_secret: client_secret // 取引を確認するためのclient_secretを返す
      })
    })
  })
  .catch((err) => {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: `Error: ${err.message}`
      })
    })
  })
}