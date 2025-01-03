'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Minus, Plus, Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { satoshi, integralCF } from '@/app/ui/fonts'
import { Product } from '@/types/product'

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
    </div>
  )
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-gray-900">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{product.category.name}</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square bg-gray-100 rounded-lg overflow-hidden",
                    selectedImage === index && "ring-2 ring-black"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-8 lg:mt-0">
            <h1 className={cn("text-3xl font-bold", integralCF.className)}>
              {product.title}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                <StarRating rating={product.rating} />
              </div>
              <span className="text-sm text-gray-500">
                {product.rating}/5 ({product.reviews} Reviews)
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className={cn("text-2xl font-bold", satoshi.className)}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className={`${satoshi.className} text-sm text-gray-500 line-through`}>${product.originalPrice}</span>
                  <span className="text-sm text-red-600">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8 space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>
                  Select Colors
                </h3>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full ring-2 ring-offset-2",
                        selectedColor.name === color.name
                          ? "ring-black"
                          : "ring-transparent hover:ring-gray-300"
                      )}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className={cn("text-sm font-medium", satoshi.className)}>
                  Choose Size
                </h3>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "py-2 text-sm border rounded-full",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border-r"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center border-l"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button className="flex-1 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

