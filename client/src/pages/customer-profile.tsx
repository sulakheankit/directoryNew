import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ContactWithData } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityTimeline from "@/components/activity-timeline";
import SurveyHistory from "@/components/survey-history";
import NLPInsights from "@/components/nlp-insights";
import NotesSection from "@/components/notes-section";
import TimeFilter, { TimeFilterValue } from "@/components/time-filter";
import { getDateRangeFromFilter } from "@/lib/time-filter-utils";
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
  const contactFields = [
    { key: 'email', label: 'Email', icon: Mail, value: (contact?.directoryFields as any)?.email },
    { key: 'phone', label: 'Phone', icon: Phone, value: (contact?.directoryFields as any)?.phone },
    { key: 'location', label: 'Location', icon: MapPin, value: (contact?.directoryFields as any)?.location },
    { key: 'company', label: 'Company', icon: Building, value: (contact?.directoryFields as any)?.company },
    { key: 'role', label: 'Role', icon: Briefcase, value: (contact?.directoryFields as any)?.role },
    { key: 'industry', label: 'Industry', icon: Briefcase, value: (contact?.directoryFields as any)?.industry },
    { key: 'annual_revenue', label: 'Annual Revenue', icon: DollarSign, value: (contact?.directoryFields as any)?.annual_revenue ? `$${(contact.directoryFields as any).annual_revenue.toLocaleString()}` : null },
    { key: 'segment', label: 'Segment', icon: User, value: (contact?.directoryFields as any)?.segment },
    { key: 'join_date', label: 'Join Date', icon: Calendar, value: (contact?.directoryFields as any)?.join_date },
  ].filter(field => field.value); // Only show fields with values

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
      endDate = now;
      switch (timeFilter.range) {
        case 'last_7_days': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case 'last_14_days': startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); break;
        case 'last_30_days': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        case 'last_60_days': startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); break;
        case 'last_90_days': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
        case 'last_180_days': startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); break;
        case 'last_365_days': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
      }
    }

    if (!startDate && !endDate) {
      return contact;
    }

    const isInRange = (dateStr: string | Date | null | undefined) => {
      if (!dateStr) return true;
      const date = new Date(dateStr);
      if (!startDate && !endDate) return true;
      if (!startDate) return date <= endDate!;
      if (!endDate) return date >= startDate;
      return date >= startDate && date <= endDate;
    };

    return {
      ...contact,
      activities: contact.activities.filter(activity => isInRange(activity.createdAt)),
      surveys: contact.surveys.filter(survey => isInRange(survey.participationDate) || isInRange(survey.sentAt)),
      notes: contact.notes.filter(note => isInRange(note.createdAt)),
    };
  }, [contact, timeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
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
          <div className="max-w-7xl mx-auto">
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
      <div className="min-h-screen bg-white">
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
            <Button>
              Send Survey
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Contact Info */}
            <div className="lg:col-span-1">
              <Card>
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
                <CardContent className="space-y-4">
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

              {/* Communication Card */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email Read Rate</p>
                      <p className="text-sm font-semibold text-gray-900">{(contact.communicationMetrics.emailReadRate * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Response Rate</p>
                      <p className="text-sm font-semibold text-gray-900">{(contact.communicationMetrics.responseRate * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Contact</p>
                      <p className="text-sm text-gray-900">{contact.communicationMetrics.lastContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card className="mt-6">
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
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Latest Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CSAT Score</p>
                      <p className="text-lg font-bold text-gray-900">
                        {filteredContact.surveys.length > 0 
                          ? ((filteredContact.surveys[0] as any).metricScores?.csat_score || 'N/A')
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Effort Score</p>
                      <p className="text-lg font-bold text-gray-900">
                        {filteredContact.surveys.length > 0 
                          ? ((filteredContact.surveys[0] as any).metricScores?.effort_score || 'N/A')
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Resolution Rating</p>
                      <p className="text-lg font-bold text-gray-900">
                        {filteredContact.surveys.length > 0 
                          ? ((filteredContact.surveys[0] as any).metricScores?.escalation_handling || 'N/A')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Main Content */}
            <div className="lg:col-span-3">
              {/* Time Filter */}
              <div className="flex justify-between items-center mb-6">
                <div></div>
                <TimeFilter 
                  value={timeFilter} 
                  onChange={setTimeFilter}
                />
              </div>

              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                  <TabsTrigger value="surveys">Survey History</TabsTrigger>
                  <TabsTrigger value="insights">NLP Insights</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-6 mt-6">
                  <ActivityTimeline contact={filteredContact} />
                </TabsContent>

                <TabsContent value="surveys" className="space-y-6 mt-6">
                  <SurveyHistory contact={filteredContact} />
                </TabsContent>

                <TabsContent value="insights" className="space-y-6 mt-6">
                  <NLPInsights contact={filteredContact} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-6 mt-6">
                  <NotesSection contact={filteredContact} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
              <TabsList className="grid w-full grid-cols-5 bg-gray-50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900">
                  Activity Timeline
                </TabsTrigger>
                <TabsTrigger value="surveys" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900">
                  Survey History
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900">
                  NLP Insights
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900">
                  Notes
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Industry</span>
                          <span className="text-sm text-gray-600">{directoryFields.industry}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Annual Revenue</span>
                          <span className="text-sm text-gray-600">${directoryFields.annual_revenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Segment</span>
                          <span className="text-sm text-gray-600">{directoryFields.segment}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Join Date</span>
                          <span className="text-sm text-gray-600">
                            {new Date(directoryFields.join_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {(filteredContact?.activities || []).slice(0, 3).map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                                <Mail className="h-4 w-4 text-gray-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} - {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                                  weekday: 'long' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  {filteredContact && <ActivityTimeline contact={filteredContact} />}
                </TabsContent>

                <TabsContent value="surveys" className="mt-0">
                  {filteredContact && <SurveyHistory contact={filteredContact} />}
                </TabsContent>

                <TabsContent value="insights" className="mt-0">
                  {filteredContact && <NLPInsights contact={filteredContact} />}
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  {filteredContact && <NotesSection contact={filteredContact} />}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
