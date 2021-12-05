import { createProxyMiddleware } from "http-proxy-middleware"

module.exports = function(app: any) {
  app.use(
    "/.netlify/functions/",
    createProxyMiddleware({
      target: "http://localhost:9000",
      changeOrigin: true
    })
  )
}