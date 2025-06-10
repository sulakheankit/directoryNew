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
      <DashboardLayout>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
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
          <main className="flex-1 overflow-auto p-6">
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
      </DashboardLayout>
    );
  }

  if (error || !contact) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
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
        </div>
      </DashboardLayout>
    );
  }

  const directoryFields = contact.directoryFields as any;

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {directoryFields.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {directoryFields.company} • {directoryFields.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4 mr-2" />
                Send Survey
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Profile Summary Cards */}
            <ProfileSummaryCards contact={contact} />

            {/* Tabbed Content */}
            <Card className="mt-8">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200">
                  <TabsList className="h-auto p-0 bg-transparent border-none">
                    <div className="flex space-x-8 px-6">
                      <TabsTrigger 
                        value="overview" 
                        className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="timeline" 
                        className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                      >
                        Activity Timeline
                      </TabsTrigger>
                      <TabsTrigger 
                        value="surveys" 
                        className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                      >
                        Survey History
                      </TabsTrigger>
                      <TabsTrigger 
                        value="insights" 
                        className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                      >
                        NLP Insights
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notes" 
                        className="py-4 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                      >
                        Notes
                      </TabsTrigger>
                    </div>
                  </TabsList>
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
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Mail className="h-4 w-4 text-blue-600" />
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
    </DashboardLayout>
  );
}
