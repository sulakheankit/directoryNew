import { useQuery } from "@tanstack/react-query";
import { ContactWithData } from "@shared/schema";
import ProfileSummaryCards from "@/components/profile-summary-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityTimeline from "@/components/activity-timeline";
import SurveyHistory from "@/components/survey-history";
import NLPInsights from "@/components/nlp-insights";
import NotesSection from "@/components/notes-section";
import { ArrowLeft, Mail, MoreVertical, User, Phone, MapPin } from "lucide-react";
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
                  <div className="h-5 w-5 border border-gray-400 rounded" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded border border-gray-300"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metrics Summary Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Latest Scores</h3>
                  <div className="h-5 w-5 border border-gray-400 rounded-full" />
                </div>
                <div className="space-y-2">
                  {contact.surveys.find(s => s.status === 'Completed')?.metricScores ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">NPS</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {(contact.surveys.find(s => s.status === 'Completed')?.metricScores as any)?.nps || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CSAT</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {(contact.surveys.find(s => s.status === 'Completed')?.metricScores as any)?.csat || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CES</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {(contact.surveys.find(s => s.status === 'Completed')?.metricScores as any)?.ces || 'N/A'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No completed surveys</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Card className="border-gray-200">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  <button className="py-4 px-1 border-b-2 border-gray-900 text-sm font-medium text-gray-900">
                    Overview
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                    Activity Timeline
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                    Survey History
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                    NLP Insights
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                    Notes
                  </button>
                </div>
              </div>

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

                <TabsContent value="timeline" className="mt-0">
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
