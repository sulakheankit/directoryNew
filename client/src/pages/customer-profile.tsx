import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ContactWithData } from "@shared/schema";
import ProfileSummaryCards from "@/components/profile-summary-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityTimeline from "@/components/activity-timeline";
import SurveyHistory from "@/components/survey-history";
import NLPInsights from "@/components/nlp-insights";
import NotesSection from "@/components/notes-section";
import TimeFilter, { TimeFilterValue } from "@/components/time-filter";
import { filterByDateRange } from "@/lib/time-filter-utils";
import { ArrowLeft, Mail, MoreVertical, User, Phone, MapPin, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  // Filter contact data based on time filter
  const filteredContact = useMemo(() => {
    if (!contact) return null;

    // Convert date strings to Date objects for filtering
    const activitiesWithDates = contact.activities.map(activity => ({
      ...activity,
      createdAt: new Date(activity.createdAt),
    }));

    const surveysWithDates = contact.surveys.map(survey => ({
      ...survey,
      participationDate: survey.participationDate ? new Date(survey.participationDate) : undefined,
      sentAt: survey.sentAt ? new Date(survey.sentAt) : undefined,
    }));

    const notesWithDates = contact.notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
    }));

    return {
      ...contact,
      activities: filterByDateRange(activitiesWithDates, timeFilter),
      surveys: filterByDateRange(surveysWithDates, timeFilter),
      notes: filterByDateRange(notesWithDates, timeFilter),
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4 text-gray-700 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {directoryFields.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {directoryFields.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {directoryFields.phone}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {directoryFields.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Mail className="h-4 w-4 mr-2" />
              Send Survey
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Time Filter */}
          <div className="mb-6">
            <TimeFilter value={timeFilter} onChange={setTimeFilter} />
          </div>

          {/* Profile Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Contact Info Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Info</h3>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{directoryFields.company}</p>
                  <p className="text-sm text-gray-600">{directoryFields.role}</p>
                  <p className="text-sm text-gray-600">{directoryFields.industry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Communication Metrics Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Read Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {contact.communicationMetrics.emailReadRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {contact.communicationMetrics.responseRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Contact</span>
                    <span className="text-sm text-gray-600">
                      {contact.communicationMetrics.lastContact}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded border border-blue-300">
                    High Value
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded border border-green-300">
                    {directoryFields.segment}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Summary Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Latest Scores</h3>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {(() => {
                    // Find the most recent completed survey with metrics
                    const completedSurvey = contact.surveys
                      .filter(s => s.status === 'Completed' || s.status === 'completed')
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
                            <span className="text-lg font-semibold text-gray-900">
                              {value as string}
                            </span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Card className="border-gray-200">
            <Tabs defaultValue="overview" className="w-full">
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
                        {contact.activities.slice(0, 3).map((activity) => (
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
                  <ActivityTimeline contact={contact} />
                </TabsContent>

                <TabsContent value="surveys" className="mt-0">
                  <SurveyHistory contact={contact} />
                </TabsContent>

                <TabsContent value="insights" className="mt-0">
                  <NLPInsights contact={contact} />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <NotesSection contact={contact} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
