"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Slider } from "@ui/components/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/components/dialog";
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { FiSearch, FiFilter, FiChevronDown, FiDownload, FiMoreVertical, FiMapPin } from "react-icons/fi";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false }
);

function CenterMarker() {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = L.marker(map.getCenter(), {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" fill="#4CAF50"/>
                 </svg>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
      }).addTo(map)
    } else {
      markerRef.current.setLatLng(map.getCenter())
    }
  }, [map])

  useMapEvents({
    move() {
      markerRef.current?.setLatLng(map.getCenter())
    }
  })

  return null
}

interface MapControllerProps {
  isSearchMode: boolean;
  searchRadius: number;
  onMapMove: (center: L.LatLng) => void;
}

function MapController({ isSearchMode, searchRadius, onMapMove }: MapControllerProps) {
  const map = useMap()
  const circleRef = useRef<L.Circle | null>(null)

  useMapEvents({
    moveend: () => {
      onMapMove(map.getCenter())
    },
    move: () => {
      if (circleRef.current) {
        circleRef.current.setLatLng(map.getCenter())
      }
    },
    resize: () => {
      map.setView(map.getCenter(), map.getZoom())
    }
  })

  useEffect(() => {
    if (isSearchMode) {
      if (!circleRef.current) {
        circleRef.current = L.circle(map.getCenter(), {
          radius: searchRadius * 1000,
          color: '#4CAF50',
          fillColor: '#4CAF50',
          fillOpacity: 0.1
        }).addTo(map)
      } else {
        circleRef.current.setRadius(searchRadius * 1000)
        circleRef.current.setLatLng(map.getCenter())
      }
    } else if (circleRef.current) {
      map.removeLayer(circleRef.current)
      circleRef.current = null
    }
  }, [map, isSearchMode, searchRadius])

  return isSearchMode ? <CenterMarker /> : null
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <FiSearch className="text-gray-400 mb-4" size={48} />
    <h2 className="text-2xl font-semibold mb-2">Search for Local Businesses</h2>
    <p className="text-gray-600 mb-4">Enter a search query to find businesses in your area.</p>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
      <div>"Restaurants in New York"</div>
      <div>"Coffee shops in San Francisco"</div>
      <div>"Gyms in Chicago"</div>
      <div>"Bookstores in Seattle"</div>
    </div>
  </div>
);

const LocalBusinessFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<L.LatLng>(L.latLng(34.0522, -118.2437)); // Los Angeles
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [splitPosition, setSplitPosition] = useState(70); // 70% for the table, 30% for the map
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columnDefs = [
    { field: 'name', headerName: 'Business Name', flex: 2 },
    { field: 'business_email', headerName: 'Business Email', flex: 1 },
    { field: 'business_phone', headerName: 'Business Phone', flex: 1 },
    { field: 'street', headerName: 'Street', flex: 2 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'state', headerName: 'State', flex: 1 },
    { field: 'country', headerName: 'Country', flex: 1 },
    { field: 'website', headerName: 'Website', flex: 1 },
    { field: 'rating', headerName: 'Rating', flex: 1 },
    { field: 'types', headerName: 'Types', flex: 2 },
  ];

  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsSearchMode(true);

      const response = await fetch('/api/gmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          max_leads: 100
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received leads:', data);
      
      // Update rowData with the received leads
      const newRowData = data.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        business_phone: lead.business_phone || '',
        street: lead.formatted_address?.split(',')[0] || '',
        city: lead.formatted_address?.split(',')[1]?.trim() || 'Unknown',
        state: lead.formatted_address?.split(',')[2]?.trim().split(' ')[0] || 'Unknown',
        country: lead.formatted_address?.split(',')[3]?.trim() || 'Unknown',
        website: lead.website,
        rating: lead.rating,
        types: lead.types?.join(', ') || '',
        latitude: lead.latitude,
        longitude: lead.longitude,
        business_status: lead.business_status
      }));

      // Add new rows to existing rows
      setRowData(prevRowData => [...prevRowData, ...newRowData]);
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Handle the error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const onGridReady = useCallback((params: any) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
      const allColumnIds = gridRef.current.api.getColumns()?.map((column: any) => column.getId()) || [];
      gridRef.current.api.autoSizeColumns(allColumnIds);
    }
  }, [])

  const handleExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv()
  }, [])

  const handleSplitDrag = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
    setSplitPosition(Math.max(20, Math.min(80, newPosition)))
  }, [isResizing])

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleSplitDrag)
    document.addEventListener('mouseup', () => setIsResizing(false))
    return () => {
      document.removeEventListener('mousemove', handleSplitDrag)
      document.removeEventListener('mouseup', () => setIsResizing(false))
    }
  }, [handleSplitDrag])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white" ref={containerRef}>
      <div className="flex flex-col w-full p-4 pb-0 overflow-hidden">
        <div className="mb-4 flex items-center space-x-2">
          <Input
            className="flex-grow max-w-3xl text-lg py-6"
            placeholder="Search for businesses (e.g., 'Restaurants in New York')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <FiFilter className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Options</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p>Add your filter options here.</p>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSearch} className="bg-green-600 text-white hover:bg-green-700 px-6 py-2" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <div className="flex flex-grow overflow-hidden">
          <div style={{ width: `${splitPosition}%` }} className="h-full overflow-hidden">
            <div className="flex justify-between mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Columns
                    <FiChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columnDefs.map((col) => (
                    <DropdownMenuItem key={col.field}>{col.headerName}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FiDownload className="mr-2 h-4 w-4" />
                Export leads
              </Button>
            </div>
            {isLoading ? (
              <div className="h-[calc(100%-2rem)] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : rowData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="ag-theme-alpine h-[calc(100%-2rem)] w-full overflow-hidden">
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    domLayout='normal'
                    enableCellTextSelection={true}
                    suppressColumnVirtualisation={false}
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      filter: true,
                      minWidth: 150,
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-white p-1 text-xs text-gray-500">
                    Scroll horizontally to see more columns
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className="w-6 h-20 bg-gray-200 rounded-full cursor-col-resize flex items-center justify-center hover:bg-gray-300 shadow-md"
                onMouseDown={() => setIsResizing(true)}
              >
                <FiMoreVertical className="text-gray-400" size={16} />
              </div>
            </div>
            <div className="h-full w-px bg-gray-200"></div>
          </div>
          <div style={{ width: `${100 - splitPosition}%` }} className="h-full pl-2">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              {!isSearchMode ? (
                <Button onClick={() => setIsSearchMode(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                  Search in this area
                </Button>
              ) : (
                <>
                  <div className="flex items-center space-x-2 flex-grow">
                    <span className="text-sm whitespace-nowrap">Search radius:</span>
                    <Slider
                      value={[searchRadius]}
                      onValueChange={(value) => setSearchRadius(value[0] || 5)}
                      max={50}
                      step={1}
                      className="w-32 flex-grow"
                    />
                    <span className="text-sm whitespace-nowrap">{searchRadius} km</span>
                  </div>
                  <Button onClick={handleSearch} className="bg-green-600 text-white hover:bg-green-700">
                    Confirm Search
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">Satellite</Button>
            </div>
            <div className="h-[calc(100%-3rem)] rounded-md border overflow-hidden relative">
              <MapComponent
                center={[mapCenter.lat, mapCenter.lng]}
                markers={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocalBusinessFinder;
