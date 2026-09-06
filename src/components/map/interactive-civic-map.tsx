'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import type { CivicMapProps } from '@/components/map/civic-map'

const CivicMap = dynamic(() => import('@/components/map/civic-map'), {
  ssr: false,
  loading: () => (
    <div
      data-testid="civic-map-loading"
      className="h-[460px] sm:h-[520px] w-full rounded-xl border border-slate-800 bg-[#0d1117] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-400"
    >
      <div className="h-7 w-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <div className="text-slate-300 font-semibold">Initializing Geographic GIS Engine...</div>
      <div className="text-[11px] text-slate-500">Connecting to OpenStreetMap telemetry nodes</div>
    </div>
  ),
})

export default function InteractiveCivicMap(props: CivicMapProps) {
  return <CivicMap {...props} />
}
