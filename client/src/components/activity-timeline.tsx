import { useState } from "react";
import { ContactWithData, Activity, Survey } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Vote, Headphones, ShoppingCart, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityTimelineProps {
  contact: ContactWithData;
}

interface TimelineItem {
  id: string;
  type: 'activity' | 'survey';
  title: string;
  subtitle: string;
  date: Date;
  status?: string;
  icon: React.ReactNode;
  details: Record<string, any>;
}

export default function ActivityTimeline({ contact }: ActivityTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityIcon = (activity: string) => {
    switch (activity.toLowerCase()) {
      case 'customer satisfaction survey':
        return <Vote className="h-4 w-4 text-primary" />;
      case 'support ticket':
        return <Headphones className="h-4 w-4 text-orange-600" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      default:
        return <Mail className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Read': 'bg-blue-100 text-blue-800',
      'Sent': 'bg-orange-100 text-orange-800',
      'Bounced': 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  // Get sentiment-based card styling
  const getSentimentCardStyle = (sentiment: string | null | undefined) => {
    if (!sentiment) return '';
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'border-green-500 border-2';
      case 'negative':
        return 'border-red-500 border-2';
      default:
        return 'border-yellow-500 border-2';
    }
  };

  // Create timeline items from activities only, with linked survey information
  const timelineItems: TimelineItem[] = contact.activities.map((activity): TimelineItem => {
    // Find surveys linked to this activity
    const linkedSurveys = contact.surveys.filter(survey => 
      survey.activityId === activity.id
    );
    
    // Get the primary survey for status and sentiment
    const primarySurvey = linkedSurveys[0];
    
    return {
      id: activity.id,
      type: 'activity',
      title: activity.activity,
      subtitle: `Activity ID: ${(activity.activityFields as any)?.ticket_id || (activity.activityFields as any)?.order_id || activity.id}`,
      date: (activity as any).activityUploadDate ? new Date((activity as any).activityUploadDate) : new Date(activity.createdAt),
      status: primarySurvey?.status,
      icon: getActivityIcon(activity.activity),
      details: {
        activityFields: activity.activityFields as any || {},
        uploadDate: (activity as any).activityUploadDate,
        surveys: linkedSurveys,
        sentiment: primarySurvey?.openEndedSentiment
      }
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredItems = timelineItems.filter(item => {
    if (filter !== "all" && !item.title.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
        <div className="flex space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="survey">Surveys</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-2.5 w-3 h-3 bg-primary rounded-full border-2 border-white shadow"></div>
              
              {/* Timeline card with sentiment-based outline */}
              <Card 
                className={`ml-10 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${getSentimentCardStyle(item.details.sentiment)}`}
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })} • {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status && getStatusBadge(item.status)}
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedItems.has(item.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Activity Attributes */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Activity Attributes</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {item.details.uploadDate && (
                          <div>
                            <span className="font-medium text-gray-700">Upload Date:</span>
                            <span className="text-gray-600 ml-2">
                              {new Date(item.details.uploadDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                        {Object.entries(item.details.activityFields || {}).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-gray-700">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </span>
                            <span className="text-gray-600 ml-2">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Survey Response Details */}
                    {item.details.surveys && item.details.surveys.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Survey Response Details</h5>
                        {item.details.surveys.map((survey: any, index: number) => (
                          <div key={survey.id} className="border border-gray-200 rounded-lg p-3 mb-2 last:mb-0">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="text-sm font-medium text-gray-800">{survey.title}</h6>
                              <Badge className={
                                survey.status === 'Completed' || survey.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }>
                                {survey.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {survey.channel && (
                                <div>
                                  <span className="font-medium text-gray-600">Channel:</span>
                                  <span className="text-gray-500 ml-1">{survey.channel}</span>
                                </div>
                              )}
                              {survey.responseTime && (
                                <div>
                                  <span className="font-medium text-gray-600">Response Time:</span>
                                  <span className="text-gray-500 ml-1">{survey.responseTime}</span>
                                </div>
                              )}
                              {survey.sentiment && (
                                <div>
                                  <span className="font-medium text-gray-600">Sentiment:</span>
                                  <span className={`ml-1 font-medium ${
                                    survey.sentiment === 'positive' ? 'text-green-600' :
                                    survey.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {survey.sentiment.charAt(0).toUpperCase() + survey.sentiment.slice(1)}
                                  </span>
                                </div>
                              )}
                              {survey.metricScores && Object.entries(survey.metricScores).slice(0, 3).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-600">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                  </span>
                                  <span className="text-gray-700 font-medium ml-1">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
