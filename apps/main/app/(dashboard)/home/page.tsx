"use client";

import React, { useState } from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { 
  FiFileText, FiMapPin, FiDatabase, FiCreditCard, FiPlus, FiShoppingBag, FiLinkedin
} from "react-icons/fi";
import { List } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/components/dialog";
import { Label } from "@ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/select";
import { useRouter } from 'next/navigation';
import DataSheetList from '@/components/DataSheetList';
import { useDashboard } from '../DashboardProvider';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const [newListName, setNewListName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const { user, lists, isLoading } = useDashboard();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateNew = async () => {
    if (!newListName) {
      alert('Please enter a list name');
      return;
    }

    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newListName,
        template: selectedTemplate,
      }),
    });

    if (response.ok) {
      const newList: List = await response.json();
      // Update the lists in the DashboardProvider
      // This part needs to be implemented in the DashboardProvider
      setIsCreateModalOpen(false);
      setNewListName("");
      setSelectedTemplate("");
    } else {
      console.error('Failed to create new list');
    }
  };

  const handleListClick = (listId: string) => {
    router.push(`/sheet/${listId}`);
  };

  const templates = [
    { name: "Blank data sheet", icon: FiFileText },
    { name: "Sales pipeline", icon: FiFileText },
    { name: "Customer database", icon: FiDatabase },
  ];

  const discoveryServices = [
    { name: "Local Businesses", icon: FiMapPin, description: "Find local businesses using Google Maps" },
    { name: "E-commerce", icon: FiShoppingBag, description: "Discover e-commerce opportunities with Shopify" },
    { name: "Companies", icon: FiLinkedin, description: "Explore companies on LinkedIn" },
  ];

  const enrichmentServices = [
    { name: "Clearbit", icon: FiCreditCard },
    { name: "FullContact", icon: FiCreditCard },
    { name: "Hunter.io", icon: FiCreditCard },
  ];

  const handleServiceClick = (serviceName: string) => {
    // Placeholder function for redirecting to the service page
    console.log(`Redirecting to ${serviceName} page`);
    // You can implement the actual redirection logic here
    // For example: router.push(`/discovery/${serviceName.toLowerCase()}`);
    if (serviceName === "Local Businesses") {
      router.push('/discovery/gmaps');
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FiPlus className="mr-2 h-4 w-4" /> Create New List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New List</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template" className="text-right">
                      Template
                    </Label>
                    <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.name} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateNew}>Create List</Button>
              </DialogContent>
            </Dialog>
          </div>
          <Input
            className="mb-6"
            type="search"
            placeholder="Search for any data sheet"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="discovery">Discovery</TabsTrigger>
              <TabsTrigger value="enrichment">Enrichment Services</TabsTrigger>
            </TabsList>
            <TabsContent value="templates">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template, index) => (
                  <Button key={index} variant="outline" className="h-auto flex-col items-start p-4 text-left">
                    <template.icon className="mb-2 h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="discovery">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {discoveryServices.map((service, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 text-left"
                    onClick={() => handleServiceClick(service.name)}
                  >
                    <service.icon className="mb-2 h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium">{service.name}</span>
                    <p className="mt-1 text-xs text-gray-500">{service.description}</p>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="enrichment">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enrichmentServices.map((service, index) => (
                  <Button key={index} variant="outline" className="h-auto flex-col items-start p-4 text-left">
                    <service.icon className="mb-2 h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium">{service.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <h2 className="mb-4 mt-8 text-lg font-semibold">My Data Sheets</h2>
          <DataSheetList
            lists={lists}
            isLoading={isLoading}
            onListClick={handleListClick}
          />
        </div>
        <aside className="w-80 border-l bg-gray-50 p-6">
          <div className="mb-6 rounded-lg bg-green-600 p-4 text-white">
            <h2 className="mb-2 text-lg font-semibold">Get started with DataPull</h2>
            <p className="mb-4 text-sm">Learn how to use our platform effectively</p>
            <Button variant="secondary" className="w-full bg-white text-green-800 hover:bg-gray-100">
              Watch video
            </Button>
          </div>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <FiFileText className="mr-2 h-4 w-4" />
              DataPull University
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FiFileText className="mr-2 h-4 w-4" />
              B2B Prospecting Guide
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FiFileText className="mr-2 h-4 w-4" />
              Docs & Help Center
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FiFileText className="mr-2 h-4 w-4" />
              Refer a Friend
            </Button>
          </nav>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
