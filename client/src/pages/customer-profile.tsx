import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ContactWithData } from "@shared/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityTimeline from "@/components/activity-timeline";
import SurveyHistory from "@/components/survey-history";
import NLPInsights from "@/components/nlp-insights";
import NotesSection from "@/components/notes-section";
import TimeFilter, { TimeFilterValue } from "@/components/time-filter";
import { ArrowLeft, Mail, MoreVertical, User, Phone, MapPin, Building, Briefcase, DollarSign, Calendar, X, Plus, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

interface CustomerProfileProps {
  contactId: string;
}

export default function CustomerProfile({ contactId }: CustomerProfileProps) {
  const { data: contact, isLoading, error } = useQuery<ContactWithData>({
    queryKey: [`/api/contacts/${contactId}`],
  });

  // Time filter state
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>({
    type: 'fixed',
    range: 'all',
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('activity');

  // Hidden contact fields state
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());

  const hideField = (fieldName: string) => {
    setHiddenFields(prev => new Set([...Array.from(prev), fieldName]));
  };

  const showField = (fieldName: string) => {
    setHiddenFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  // Define available contact fields
  const contactFields = contact ? [
    { key: 'email', label: 'Email', icon: Mail, value: (contact?.directoryFields as any)?.email },
    { key: 'phone', label: 'Phone', icon: Phone, value: (contact?.directoryFields as any)?.phone },
    { key: 'location', label: 'Location', icon: MapPin, value: (contact?.directoryFields as any)?.location },
    { key: 'company', label: 'Company', icon: Building, value: (contact?.directoryFields as any)?.company },
    { key: 'role', label: 'Role', icon: Briefcase, value: (contact?.directoryFields as any)?.role },
    { key: 'industry', label: 'Industry', icon: Briefcase, value: (contact?.directoryFields as any)?.industry },
    { key: 'annual_revenue', label: 'Annual Revenue', icon: DollarSign, value: (contact?.directoryFields as any)?.annual_revenue ? `$${(contact.directoryFields as any).annual_revenue.toLocaleString()}` : null },
    { key: 'segment', label: 'Segment', icon: User, value: (contact?.directoryFields as any)?.segment },
    { key: 'join_date', label: 'Join Date', icon: Calendar, value: (contact?.directoryFields as any)?.join_date },
  ].filter(field => field.value) : []; // Only show fields with values

  // Filter contact data based on time filter
  const filteredContact = useMemo(() => {
    if (!contact) return contact;

    // If "All Time" is selected, return original contact
    if (timeFilter.type === 'fixed' && timeFilter.range === 'all') {
      return contact;
    }

    // Determine date range
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date();

    if (timeFilter.type === 'custom' && timeFilter.startDate && timeFilter.endDate) {
      startDate = timeFilter.startDate;
      endDate = timeFilter.endDate;
    } else if (timeFilter.type === 'rolling') {
      const days = parseInt(timeFilter.range);
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      endDate = now;
    } else if (timeFilter.type === 'fixed' && timeFilter.range !== 'all') {
      const days = parseInt(timeFilter.range);
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      endDate = now;
    }

    // Filter activities, surveys, and notes
    const filteredActivities = contact.activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return (!startDate || activityDate >= startDate) && (!endDate || activityDate <= endDate);
    });

    const filteredSurveys = contact.surveys.filter(survey => {
      const surveyDate = new Date(survey.createdAt);
      return (!startDate || surveyDate >= startDate) && (!endDate || surveyDate <= endDate);
    });

    const filteredNotes = contact.notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return (!startDate || noteDate >= startDate) && (!endDate || noteDate <= endDate);
    });

    return {
      ...contact,
      activities: filteredActivities,
      surveys: filteredSurveys,
      notes: filteredNotes,
    };
  }, [contact, timeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Contact Not Found</h1>
            </div>
          </div>
        </header>
        <main className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Not Found</h1>
                <p className="text-gray-600">
                  The contact you're looking for doesn't exist or there was an error loading the data.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const directoryFields = contact.directoryFields as any;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center">
              <User className="h-8 w-8 mr-3 text-gray-400" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{directoryFields?.name}</h1>
                <p className="text-sm text-gray-500">{directoryFields?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <TimeFilter 
              value={timeFilter} 
              onChange={setTimeFilter}
            />
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 h-[calc(100vh-120px)]">
        <div className="w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
            {/* Left Panel - Contact Info */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Contact Info</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {Array.from(hiddenFields).map((fieldKey) => {
                          const field = contactFields.find(f => f.key === fieldKey);
                          return field ? (
                            <DropdownMenuItem
                              key={fieldKey}
                              onClick={() => showField(fieldKey)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add {field.label}
                            </DropdownMenuItem>
                          ) : null;
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 overflow-y-auto">
                  {contactFields
                    .filter(field => !hiddenFields.has(field.key))
                    .map((field) => (
                      <div 
                        key={field.key} 
                        className="group relative flex items-center p-2 rounded hover:bg-gray-50"
                      >
                        <field.icon className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                          <p className="text-sm text-gray-900 truncate">{field.value}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 absolute right-1 top-1 h-6 w-6 p-0"
                          onClick={() => hideField(field.key)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>


            </div>

            {/* Right Panel - Main Content */}
            <div className="lg:col-span-4 h-full flex flex-col">

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Communication Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Email Read Rate</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(contact.communicationMetrics.emailReadRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(contact.communicationMetrics.responseRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Contact</span>
                      <span className="text-sm text-gray-600">
                        {contact.communicationMetrics.lastContact}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant={tag.type === 'ai' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Latest Scores Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Latest Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      // Find the most recent completed survey with metrics
                      const completedSurvey = filteredContact?.surveys
                        .filter(s => s.status === 'completed' || s.status === 'Completed')
                        .find(s => s.metricScores);
                      
                      if (!completedSurvey) {
                        return <p className="text-sm text-gray-500">No completed surveys with scores</p>;
                      }
                      
                      const metrics = completedSurvey.metricScores as any;
                      
                      // Get the first 3 metrics dynamically from whatever is available
                      const metricEntries = Object.entries(metrics || {}).slice(0, 3);
                      
                      if (metricEntries.length === 0) {
                        return <p className="text-sm text-gray-500">No metric scores available</p>;
                      }
                      
                      return (
                        <>
                          {metricEntries.map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <span className="text-lg font-bold text-gray-900">
                                {value as string}
                              </span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              <div className="w-full flex-1 flex flex-col">
                {/* Simple Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  {[
                    { key: 'activity', label: 'Activity Timeline' },
                    { key: 'surveys', label: 'Survey History' },
                    { key: 'insights', label: 'NLP Insights' },
                    { key: 'notes', label: 'Notes' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                        activeTab === tab.key
                          ? 'text-gray-900 border-b-2 border-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto mt-6">
                  {activeTab === 'activity' && filteredContact && (
                    <ActivityTimeline contact={filteredContact} />
                  )}
                  {activeTab === 'surveys' && filteredContact && (
                    <SurveyHistory contact={filteredContact} />
                  )}
                  {activeTab === 'insights' && filteredContact && (
                    <NLPInsights contact={filteredContact} />
                  )}
                  {activeTab === 'notes' && filteredContact && (
                    <NotesSection contact={filteredContact} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}