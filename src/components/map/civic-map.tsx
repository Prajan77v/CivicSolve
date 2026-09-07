'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Search,
  MapPin,
  Flame,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { useAppearance } from '@/components/providers/appearance-provider'

export interface MapProblemItem {
  id: string
  title: string
  description?: string
  category: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  affectedCount: number
  district: string
  state: string
  lat: number
  lng: number
  submittedByName?: string
  challengeGroupId?: string | null
}

export interface MapProjectItem {
  id: string
  title: string
  status: string
  progressPercent: number
  teamName: string
  universityName: string
  problemId: string
  problemTitle: string
  category: string
  district: string
  state: string
  lat: number
  lng: number
}

export interface MapDeploymentItem {
  id: string
  projectId: string
  title: string
  description?: string | null
  location: string
  status: string
  deployedAt: string | Date
  district: string
  state: string
  lat: number
  lng: number
  peopleImpacted: number
  metric?: string | null
}

export interface MapChallengeGroupItem {
  id: string
  title: string
  description: string
  domain: string
  combinedPopulation: number
  combinedPriority: string
  region: string
  status: string
  lat: number
  lng: number
  problemCount: number
  problems: Array<{ id: string; title: string; priority: string; district?: string }>
}

export interface CivicMapProps {
  problems: MapProblemItem[]
  projects?: MapProjectItem[]
  deployments?: MapDeploymentItem[]
  challengeGroups?: MapChallengeGroupItem[]
  activeLayer: 'problems' | 'projects' | 'deployments' | 'groups'
  onLayerChange?: (layer: 'problems' | 'projects' | 'deployments' | 'groups') => void
  showHeatmap?: boolean
  onToggleHeatmap?: (val: boolean) => void
  onSelectProblem?: (problem: MapProblemItem) => void
  selectedDistrict?: string | null
  initialCenter?: [number, number]
  initialZoom?: number
  className?: string
}

// Default initial focus: Nashik, Maharashtra
const DEFAULT_CENTER: [number, number] = [19.9975, 73.7898]
const DEFAULT_ZOOM = 8

// Standard Indian Geocoding lookup table for instant, zero-latency search
const INDIAN_GEO_INDEX: Record<string, { lat: number; lng: number; zoom: number; label: string }> = {
  nashik: { lat: 19.9975, lng: 73.7898, zoom: 11, label: 'Nashik, Maharashtra' },
  pune: { lat: 18.5204, lng: 73.8567, zoom: 11, label: 'Pune, Maharashtra' },
  mumbai: { lat: 19.076, lng: 72.8777, zoom: 11, label: 'Mumbai, Maharashtra' },
  aurangabad: { lat: 19.8762, lng: 75.3433, zoom: 11, label: 'Chhatrapati Sambhajinagar (Aurangabad), Maharashtra' },
  yavatmal: { lat: 20.3888, lng: 78.1204, zoom: 11, label: 'Yavatmal, Maharashtra' },
  amravati: { lat: 20.932, lng: 77.7523, zoom: 11, label: 'Amravati, Maharashtra' },
  delhi: { lat: 28.6139, lng: 77.209, zoom: 11, label: 'Delhi NCR' },
  'south delhi': { lat: 28.5494, lng: 77.2683, zoom: 12, label: 'South Delhi (Okhla), Delhi' },
  kendrapara: { lat: 20.4986, lng: 86.4194, zoom: 11, label: 'Kendrapara, Odisha' },
  bhopal: { lat: 23.2599, lng: 77.4126, zoom: 11, label: 'Bhopal, Madhya Pradesh' },
  chennai: { lat: 13.0827, lng: 80.2707, zoom: 11, label: 'Chennai, Tamil Nadu' },
  bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 11, label: 'Bengaluru, Karnataka' },
  hyderabad: { lat: 17.385, lng: 78.4867, zoom: 11, label: 'Hyderabad, Telangana' },
  jaipur: { lat: 26.9124, lng: 75.7873, zoom: 11, label: 'Jaipur, Rajasthan' },
  ranchi: { lat: 23.3441, lng: 85.3096, zoom: 11, label: 'Ranchi, Jharkhand' },
  bhojpur: { lat: 25.6601, lng: 84.6738, zoom: 11, label: 'Bhojpur, Bihar' },
  maharashtra: { lat: 19.7515, lng: 75.7139, zoom: 7, label: 'Maharashtra State' },
  odisha: { lat: 20.9517, lng: 85.0985, zoom: 7, label: 'Odisha State' },
  rajasthan: { lat: 27.0238, lng: 74.2179, zoom: 7, label: 'Rajasthan State' },
  'tamil nadu': { lat: 11.1271, lng: 78.6569, zoom: 7, label: 'Tamil Nadu State' },
}

export default function CivicMap({
  problems,
  projects = [],
  deployments = [],
  challengeGroups = [],
  activeLayer = 'problems',
  onLayerChange,
  showHeatmap = false,
  onToggleHeatmap,
  onSelectProblem,
  selectedDistrict,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  className = '',
}: CivicMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const { resolvedTheme } = useAppearance()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null)
  const [currentZoom, setCurrentZoom] = useState(initialZoom)
  const [tileMode, setTileMode] = useState<'satellite' | 'terrain' | 'dark' | 'street'>('satellite')
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null)
  const tileLayerRef = useRef<any>(null)

  const TILE_SERVERS = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics, Maxar, GeoEye',
      maxZoom: 19
    },
    terrain: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }
  }

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return

    let L: any
    try {
      L = require('leaflet')
    } catch (e) {
      console.error('Failed to load Leaflet:', e)
      return
    }

    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '',
      iconUrl: '',
      shadowUrl: '',
    })

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 18,
    })

    // Add initial base tile layer (Realistic Satellite Imagery by default)
    const baseTile = L.tileLayer(TILE_SERVERS[tileMode].url, {
      maxZoom: TILE_SERVERS[tileMode].maxZoom,
      attribution: TILE_SERVERS[tileMode].attribution,
    }).addTo(map)
    tileLayerRef.current = baseTile

    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a> | Realistic Earth GIS',
      })
      .addTo(map)

    const markersGroup = L.layerGroup().addTo(map)
    const heatGroup = L.layerGroup().addTo(map)

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom())
    })

    map.on('mousemove', (e: any) => {
      if (e && e.latlng) {
        setCursorCoords({
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4))
        })
      }
    })

    if (containerRef.current) {
      ;(containerRef.current as any)._leaflet_map = map
      ;(containerRef.current as any)._markers_group = markersGroup
    }
    if (typeof window !== 'undefined') {
      ;(window as any).__CIVIC_MAP__ = map
      ;(window as any).__CIVIC_MARKERS__ = markersGroup
    }

    mapInstanceRef.current = map
    markersLayerRef.current = markersGroup
    heatLayerRef.current = heatGroup

    return () => {
      if (typeof window !== 'undefined' && (window as any).__CIVIC_MAP__ === map) {
        delete (window as any).__CIVIC_MAP__
        delete (window as any).__CIVIC_MARKERS__
      }
      map.remove()
      mapInstanceRef.current = null
      markersLayerRef.current = null
      heatLayerRef.current = null
      tileLayerRef.current = null
    }
  }, [])

  // Switch Tile Layer when user selects basemap mode
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return
    let L: any
    try {
      L = require('leaflet')
    } catch {
      return
    }

    mapInstanceRef.current.removeLayer(tileLayerRef.current)
    const newTile = L.tileLayer(TILE_SERVERS[tileMode].url, {
      maxZoom: TILE_SERVERS[tileMode].maxZoom,
      attribution: TILE_SERVERS[tileMode].attribution,
    }).addTo(mapInstanceRef.current)
    newTile.bringToBack()
    tileLayerRef.current = newTile
  }, [tileMode])

  // Pan to selected district if provided
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDistrict) return
    const key = selectedDistrict.toLowerCase().trim()
    if (INDIAN_GEO_INDEX[key]) {
      const geo = INDIAN_GEO_INDEX[key]
      mapInstanceRef.current.flyTo([geo.lat, geo.lng], geo.zoom, { duration: 1 })
    }
  }, [selectedDistrict])

  // Cluster Algorithm for Points within Zoom Threshold
  const clusters = useMemo(() => {
    let items: Array<{ id: string; lat: number; lng: number; raw: any }> = []

    if (activeLayer === 'problems') {
      items = problems.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, raw: p }))
    } else if (activeLayer === 'projects') {
      items = projects.map((pr) => ({ id: pr.id, lat: pr.lat, lng: pr.lng, raw: pr }))
    } else if (activeLayer === 'deployments') {
      items = deployments.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng, raw: d }))
    } else if (activeLayer === 'groups') {
      items = challengeGroups.map((g) => ({ id: g.id, lat: g.lat, lng: g.lng, raw: g }))
    }

    if (currentZoom >= 10 || items.length <= 4) {
      return items.map((it) => ({
        isCluster: false,
        lat: it.lat,
        lng: it.lng,
        count: 1,
        items: [it.raw],
      }))
    }

    const clusterGrid: Record<string, { latSum: number; lngSum: number; count: number; items: any[] }> = {}
    const cellSize = (360 / Math.pow(2, currentZoom)) * 0.45

    items.forEach((it) => {
      const cellX = Math.floor(it.lng / cellSize)
      const cellY = Math.floor(it.lat / cellSize)
      const cellKey = `${cellX}_${cellY}`

      if (!clusterGrid[cellKey]) {
        clusterGrid[cellKey] = { latSum: 0, lngSum: 0, count: 0, items: [] }
      }
      clusterGrid[cellKey].latSum += it.lat
      clusterGrid[cellKey].lngSum += it.lng
      clusterGrid[cellKey].count += 1
      clusterGrid[cellKey].items.push(it.raw)
    })

    return Object.values(clusterGrid).map((c) => ({
      isCluster: c.count > 1,
      lat: c.latSum / c.count,
      lng: c.lngSum / c.count,
      count: c.count,
      items: c.items,
    }))
  }, [activeLayer, problems, projects, deployments, challengeGroups, currentZoom])

  // Update Markers on Leaflet Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return
    let L: any
    try {
      L = require('leaflet')
    } catch {
      return
    }

    const group = markersLayerRef.current
    group.clearLayers()

    clusters.forEach((cluster) => {
      if (cluster.isCluster) {
        const size = cluster.count > 15 ? 42 : cluster.count > 5 ? 36 : 30
        const html = `
          <div data-testid="map-cluster" class="civic-cluster-marker" style="width: ${size}px; height: ${size}px; background: ${
          activeLayer === 'deployments'
            ? 'linear-gradient(135deg, #059669, #10b981)'
            : 'linear-gradient(135deg, #dc2626, #f97316)'
        }; border: 2px solid #ffffff; font-size: ${size > 36 ? 14 : 12}px;">
            ${cluster.count}
          </div>
        `
        const clusterIcon = L.divIcon({
          html,
          className: 'civic-leaflet-cluster-icon',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })

        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon }).addTo(group)
        marker.on('click', () => {
          mapInstanceRef.current.flyTo([cluster.lat, cluster.lng], Math.min(currentZoom + 2, 14), {
            duration: 0.8,
          })
        })
      } else {
        const item = cluster.items[0]
        if (!item) return

        let color = '#3b82f6'
        let ringColor = 'rgba(59, 130, 246, 0.4)'

        if (activeLayer === 'problems') {
          if (item.priority === 'CRITICAL') {
            color = '#ef4444'
            ringColor = 'rgba(239, 68, 68, 0.5)'
          } else if (item.priority === 'HIGH') {
            color = '#f59e0b'
            ringColor = 'rgba(245, 158, 11, 0.5)'
          } else if (item.priority === 'MEDIUM') {
            color = '#3b82f6'
            ringColor = 'rgba(59, 130, 246, 0.4)'
          } else {
            color = '#94a3b8'
            ringColor = 'rgba(148, 163, 184, 0.3)'
          }
        } else if (activeLayer === 'deployments') {
          color = '#10b981'
          ringColor = 'rgba(16, 185, 129, 0.4)'
        } else if (activeLayer === 'projects') {
          color = '#8b5cf6'
          ringColor = 'rgba(139, 92, 246, 0.4)'
        } else if (activeLayer === 'groups') {
          color = '#ec4899'
          ringColor = 'rgba(236, 72, 153, 0.4)'
        }

        const iconHtml = `
          <div data-testid="map-marker" data-entity-id="${item.id}" class="civic-pin group relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125" style="width: 24px; height: 24px;">
            <div style="width: 14px; height: 14px; background: ${color}; border: 2px solid #ffffff; border-radius: 9999px; box-shadow: 0 0 10px ${ringColor};"></div>
            ${
              item.priority === 'CRITICAL'
                ? `<div style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background: ${color}; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
          </div>
        `

        const pinIcon = L.divIcon({
          html: iconHtml,
          className: 'civic-leaflet-marker-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        })

        const marker = L.marker([cluster.lat, cluster.lng], { icon: pinIcon }).addTo(group)

        // Store Leaflet marker reference on DOM element once rendered for testing & programmatic clicks
        marker.on('add', () => {
          const el = marker.getElement()
          if (el) {
            ;(el as any)._leaflet_marker = marker
            const innerMarker = el.querySelector('[data-testid="map-marker"]')
            if (innerMarker) {
              ;(innerMarker as any)._leaflet_marker = marker
            }
          }
        })

        // Build HTML for Popup
        let popupHtml = ''
        if (activeLayer === 'problems') {
          popupHtml = `
            <div data-testid="marker-popup" class="p-4 space-y-2 min-w-[260px] max-w-[320px] font-sans">
              <div class="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono ${
                  item.priority === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : item.priority === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }">
                  ${item.priority} PRIORITY
                </span>
                <span class="text-[11px] text-slate-400 font-mono">${item.category}</span>
              </div>
              <h4 class="font-bold text-sm text-slate-100 leading-snug line-clamp-2">${item.title}</h4>
              <div class="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span class="text-slate-300">${item.district}, ${item.state}</span>
                <span>•</span>
                <span class="text-cyan-400">${(item.affectedCount || 0).toLocaleString('en-IN')} affected</span>
              </div>
              <div class="text-xs text-slate-400">
                <span class="text-slate-500 font-mono text-[10px] uppercase">Status:</span>
                <span class="ml-1 text-slate-200 font-medium">${item.status}</span>
              </div>
              <div class="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                <a href="/problems/${item.id}" class="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
                  <span>View Challenge</span>
                  <span class="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </div>
          `
        } else if (activeLayer === 'deployments') {
          popupHtml = `
            <div data-testid="marker-popup" class="p-4 space-y-2 min-w-[260px] max-w-[320px] font-sans">
              <div class="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  DEPLOYED
                </span>
                <span class="text-[11px] text-slate-400 font-mono">${item.district}</span>
              </div>
              <h4 class="font-bold text-sm text-slate-100 leading-snug">${item.title}</h4>
              <p class="text-xs text-slate-400">${item.location}</p>
              ${item.metric ? `<div class="text-xs font-mono bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 p-1.5 rounded">${item.metric}</div>` : ''}
              <div class="text-xs text-slate-400 font-mono">
                <strong class="text-white">${(item.peopleImpacted || 2350).toLocaleString('en-IN')}</strong> citizens impacted
              </div>
              <div class="pt-2 border-t border-slate-700/50">
                <a href="/projects/${item.projectId}" class="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  <span>View Solution →</span>
                </a>
              </div>
            </div>
          `
        } else if (activeLayer === 'projects') {
          popupHtml = `
            <div data-testid="marker-popup" class="p-4 space-y-2 min-w-[260px] max-w-[320px] font-sans">
              <div class="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  ${item.status} (${item.progressPercent}%)
                </span>
                <span class="text-[11px] text-slate-400 font-mono">${item.category}</span>
              </div>
              <h4 class="font-bold text-sm text-slate-100 leading-snug">${item.title}</h4>
              <div class="text-xs text-slate-300 font-mono">
                <div>Lab: <strong class="text-white">${item.teamName}</strong></div>
                <div class="text-[11px] text-slate-500">${item.universityName}</div>
              </div>
              <div class="pt-2 border-t border-slate-700/50">
                <a href="/projects/${item.id}" class="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  <span>Open Project Workspace →</span>
                </a>
              </div>
            </div>
          `
        } else if (activeLayer === 'groups') {
          popupHtml = `
            <div data-testid="marker-popup" class="p-4 space-y-2 min-w-[260px] max-w-[320px] font-sans">
              <div class="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  CHALLENGE GROUP
                </span>
                <span class="text-[11px] text-slate-400 font-mono">${item.domain}</span>
              </div>
              <h4 class="font-bold text-sm text-slate-100 leading-snug">${item.title}</h4>
              <div class="text-xs text-slate-400 font-mono">
                <div>Region: <strong class="text-slate-200">${item.region}</strong></div>
                <div class="text-cyan-400 font-bold mt-1">${item.problemCount} reports consolidated • ${(item.combinedPopulation || 0).toLocaleString('en-IN')} people affected</div>
              </div>
              <div class="pt-2 border-t border-slate-700/50">
                <a href="/review-queue" class="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
                  <span>Inspect Challenge Group →</span>
                </a>
              </div>
            </div>
          `
        }

        marker.bindPopup(popupHtml, { maxWidth: 320, minWidth: 260 })
        marker.on('click', () => {
          if (activeLayer === 'problems' && onSelectProblem) {
            onSelectProblem(item)
          }
        })
      }
    })
  }, [clusters, activeLayer, currentZoom, onSelectProblem])

  // Heatmap Density Layer (Calculated from real geographic coordinates)
  useEffect(() => {
    if (!mapInstanceRef.current || !heatLayerRef.current) return
    let L: any
    try {
      L = require('leaflet')
    } catch {
      return
    }

    const heatGroup = heatLayerRef.current
    heatGroup.clearLayers()

    if (!showHeatmap) return

    problems.forEach((p) => {
      const radius = p.priority === 'CRITICAL' ? 35000 : p.priority === 'HIGH' ? 25000 : 15000
      const color = p.priority === 'CRITICAL' ? '#ef4444' : p.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'

      L.circle([p.lat, p.lng], {
        radius,
        stroke: false,
        fillColor: color,
        fillOpacity: 0.18,
      }).addTo(heatGroup)

      L.circle([p.lat, p.lng], {
        radius: radius * 0.4,
        stroke: false,
        fillColor: color,
        fillOpacity: 0.35,
      }).addTo(heatGroup)
    })
  }, [showHeatmap, problems])

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut()
  }

  const handleResetLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.8 })
      setSearchFeedback('Reset to Nashik (Central Command Area)')
      setTimeout(() => setSearchFeedback(null), 3000)
    }
  }

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !mapInstanceRef.current) return

    const query = searchQuery.toLowerCase().trim()
    const matchedKey = Object.keys(INDIAN_GEO_INDEX).find(
      (k) => k === query || query.includes(k) || k.includes(query)
    )

    if (matchedKey) {
      const geo = INDIAN_GEO_INDEX[matchedKey]
      mapInstanceRef.current.flyTo([geo.lat, geo.lng], geo.zoom, { duration: 1.2 })
      setSearchFeedback(`Navigated to: ${geo.label}`)
      setSearchQuery('')
      setTimeout(() => setSearchFeedback(null), 4000)
    } else {
      const matchedProblem = problems.find(
        (p) =>
          p.district.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query)
      )

      if (matchedProblem) {
        mapInstanceRef.current.flyTo([matchedProblem.lat, matchedProblem.lng], 11, { duration: 1.2 })
        setSearchFeedback(`Focused: ${matchedProblem.district}, ${matchedProblem.state}`)
        setSearchQuery('')
        setTimeout(() => setSearchFeedback(null), 4000)
      } else {
        setSearchFeedback(`Location "${searchQuery}" not found in current civic registry.`)
        setTimeout(() => setSearchFeedback(null), 3500)
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }, 200)
  }

  return (
    <div
      data-testid="civic-map-container"
      className={`relative rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : className || 'h-[460px] sm:h-[520px] w-full'
      }`}
    >
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-slate-800/80 bg-[#08090c]/90 backdrop-blur z-20 font-mono text-xs">
        {/* Layer Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            data-testid="tab-problems"
            onClick={() => onLayerChange && onLayerChange('problems')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeLayer === 'problems'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Problems ({problems.length})
          </button>
          <button
            data-testid="tab-projects"
            onClick={() => onLayerChange && onLayerChange('projects')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeLayer === 'projects'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            data-testid="tab-deployments"
            onClick={() => onLayerChange && onLayerChange('deployments')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeLayer === 'deployments'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deployments ({deployments.length})
          </button>
          <button
            data-testid="tab-groups"
            onClick={() => onLayerChange && onLayerChange('groups')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeLayer === 'groups'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grouped ({challengeGroups.length})
          </button>
        </div>

        {/* Location Search Input */}
        <form onSubmit={handleSearchLocation} className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            data-testid="map-search-input"
            type="text"
            placeholder="Search city, district, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-64 rounded-md border border-slate-800 bg-[#0d1117] pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>

        {/* Actions (Density Heatmap Toggle, Fullscreen) */}
        <div className="flex items-center gap-2">
          {onToggleHeatmap && (
            <button
              data-testid="toggle-density"
              onClick={() => onToggleHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                showHeatmap
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Problem Density Layer"
            >
              <Flame className="h-3 w-3 text-red-400" />
              <span>Density Heatmap</span>
            </button>
          )}

          <button
            data-testid="toggle-fullscreen"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Real Leaflet Map Render Canvas */}
      <div className="relative flex-1 w-full h-full">
        <div
          ref={containerRef}
          data-testid="leaflet-map-canvas"
          className="w-full h-full"
          style={{ minHeight: '340px' }}
        />

        {/* Floating Basemap Imagery Style Switcher */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#0f172a]/95 backdrop-blur border border-slate-700/80 p-1 rounded-lg shadow-xl font-mono text-[11px]">
          <button
            type="button"
            data-testid="basemap-satellite"
            onClick={() => setTileMode('satellite')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              tileMode === 'satellite'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Realistic High-Resolution Satellite Earth Imagery"
          >
            <span>🛰️</span>
            <span className="hidden sm:inline">Satellite</span>
          </button>
          <button
            type="button"
            data-testid="basemap-terrain"
            onClick={() => setTileMode('terrain')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              tileMode === 'terrain'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Terrain Topography & Infrastructure"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Terrain</span>
          </button>
          <button
            type="button"
            data-testid="basemap-dark"
            onClick={() => setTileMode('dark')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              tileMode === 'dark'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Tactical Dark Vector GIS"
          >
            <span>🌃</span>
            <span className="hidden sm:inline">Dark</span>
          </button>
          <button
            type="button"
            data-testid="basemap-street"
            onClick={() => setTileMode('street')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              tileMode === 'street'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Standard Street Map"
          >
            <span>☀️</span>
            <span className="hidden sm:inline">Street</span>
          </button>
        </div>

        {/* Floating Custom Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 shadow-lg">
          <button
            data-testid="btn-zoom-in"
            onClick={handleZoomIn}
            className="h-8 w-8 rounded-md bg-[#0f172a]/90 backdrop-blur border border-slate-700/80 text-slate-200 hover:bg-slate-800 flex items-center justify-center transition-all"
            title="Zoom In"
            aria-label="Zoom in on map"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            data-testid="btn-zoom-out"
            onClick={handleZoomOut}
            className="h-8 w-8 rounded-md bg-[#0f172a]/90 backdrop-blur border border-slate-700/80 text-slate-200 hover:bg-slate-800 flex items-center justify-center transition-all"
            title="Zoom Out"
            aria-label="Zoom out on map"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            data-testid="btn-reset-location"
            onClick={handleResetLocation}
            className="h-8 w-8 rounded-md bg-[#0f172a]/90 backdrop-blur border border-slate-700/80 text-slate-200 hover:bg-slate-800 flex items-center justify-center transition-all mt-1"
            title="Locate / Reset to Nashik Command Focus"
            aria-label="Reset map focus to Nashik"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Search Feedback Floating Toast */}
        {searchFeedback && (
          <div
            data-testid="map-search-feedback"
            className="absolute top-16 right-4 z-20 px-3 py-1.5 rounded-md bg-slate-900/95 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-xl flex items-center gap-2 animate-in fade-in"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>{searchFeedback}</span>
          </div>
        )}

        {/* Live Cursor Coordinates & Telemetry Bar (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-300 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800/90 shadow-xl">
          <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span>
            {cursorCoords
              ? `GPS: ${cursorCoords.lat}° N, ${cursorCoords.lng}° E`
              : 'GPS: 19.9975° N, 73.7898° E'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-teal-400">Zoom: {currentZoom}x</span>
        </div>

        {/* Unobtrusive Map Legend (Requirement 27) */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-300 bg-slate-950/85 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800/90 shadow-xl">
          {activeLayer === 'problems' ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" /> Critical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" /> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Low
              </span>
            </>
          ) : activeLayer === 'deployments' ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" /> Active Municipal Deployments
            </span>
          ) : activeLayer === 'projects' ? (
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Active University Squads
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-pink-400">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Regional Consolidated Groups
            </span>
          )}
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Center: Nashik, MH</span>
        </div>
      </div>
    </div>
  )
}
