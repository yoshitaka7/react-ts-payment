export interface Product {
  id: number
  title: string
  description: string
  price: number
  image: string
}

export interface CartItem {
  id?: number | undefined
  title?: string | undefined
  price?: number | undefined
  quantity: number
  cost?: number | undefined
}