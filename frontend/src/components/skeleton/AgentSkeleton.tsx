"use client"

import { useEffect } from "react"

function AgentSkeleton({height}: { height?: number }) {
  return (
    <div 
      className={`listing-skeleton ${!height  && 'h-90'} shrink-0`}
      style={{height: height}} />
  )
}

export default AgentSkeleton