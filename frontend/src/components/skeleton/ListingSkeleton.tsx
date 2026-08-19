"use client"

import { useEffect } from "react"

function ListingSkeleton({width, height}: { width?: number, height?: number }) {
  return (
    <div 
      className={`listing-skeleton ${!width && 'w-[95%]'} ${!height  && 'h-40'} shrink-0`}
      style={{height: height, width: width}} />
  )
}

export default ListingSkeleton