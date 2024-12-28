"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiSearch, FiPlus } from "react-icons/fi";
import { useDashboard } from '../../DashboardProvider';
import { Skeleton } from "@ui/components/ui/skeleton";

const LeadSheet = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { user, lists } = useDashboard();
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs] = useState([
    { field: 'name', headerName: 'Name' },
    { field: 'business_email', headerName: 'Business Email' },
    { field: 'business_phone', headerName: 'Business Phone' },
    { field: 'decision_maker_name', headerName: 'Decision Maker' },
    { field: 'decision_maker_email', headerName: 'Decision Maker Email' },
    { field: 'decision_maker_phone', headerName: 'Decision Maker Phone' },
    { field: 'status', sortable: true, filter: true },
  ]);

  useEffect(() => {
    const fetchLeads = async () => {
      if (params.id) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/lists?id=${params.id}`);
          if (response.ok) {
            const data = await response.json();
            setLeads(data);
            setError(null);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to fetch leads');
            if (response.status === 404) {
              router.push('/home'); // Redirect to home if list is not found or unauthorized
            }
          }
        } catch (error) {
          setError('Error fetching leads');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLeads();
  }, [params.id, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddLead = () => {
    // Implement add lead functionality
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex-1">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center mb-4">
              {[...Array(6)].map((_, cellIndex) => (
                <Skeleton key={cellIndex} className="h-8 w-full mr-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between p-4">
        <Input
          className="max-w-sm"
          type="text"
          placeholder="Search leads"
          value={searchQuery}
          onChange={handleSearch}
          startAdornment={<FiSearch className="h-4 w-4 text-gray-400" />}
        />
        <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleAddLead}>
          <FiPlus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>
      <div className="ag-theme-alpine flex-1">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={leads}
          domLayout='autoHeight'
        />
      </div>
    </div>
  );
};

export default LeadSheet;
