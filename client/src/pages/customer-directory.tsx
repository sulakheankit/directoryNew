import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Upload, Download, MoreVertical, User } from "lucide-react";
import { Link } from "wouter";

export default function CustomerDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });

  const filteredContacts = contacts?.filter(contact => {
    const directoryFields = contact.directoryFields as any;
    const searchLower = searchQuery.toLowerCase();
    return (
      directoryFields.name?.toLowerCase().includes(searchLower) ||
      directoryFields.email?.toLowerCase().includes(searchLower) ||
      directoryFields.company?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Car Rental Customers</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Car Rental Customers</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setIsImportModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Contacts
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex space-x-8">
          <button className="border-b-2 border-gray-900 py-4 px-1 text-sm font-medium text-gray-900">
            All Contacts
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Activities
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Automation Rules
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or other attributes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96 border-gray-300"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{filteredContacts.length} of {contacts?.length || 0} contacts</span>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer ID
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State/Province
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Text Contact?
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => {
              const directoryFields = contact.directoryFields as any;
              const firstName = directoryFields.name?.split(' ')[0] || '';
              const lastName = directoryFields.name?.split(' ').slice(1).join(' ') || '';
              
              return (
                <TableRow 
                  key={contact.id} 
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.has(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {contact.id.replace('contact_', '')}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    <Link href={`/contact/${contact.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {firstName}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {lastName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.email || '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.location?.split(',')[1]?.trim() || directoryFields.segment || '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.phone || '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    No
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.location?.split(',')[0] || '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.join_date ? 
                      new Date(new Date(directoryFields.join_date).getTime() + 365 * 24 * 60 * 60 * 1000)
                        .toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 
                      '-'
                    }
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {directoryFields.join_date ? 
                      Math.ceil((new Date(new Date(directoryFields.join_date).getTime() + 365 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
                      '-'
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredContacts.length} of {filteredContacts.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Contacts</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop your CSV or JSON file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports CSV and JSON formats as described in the documentation
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  Upload
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}