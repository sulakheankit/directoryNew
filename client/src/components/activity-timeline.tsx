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

  // Combine activities and surveys into timeline items
  const timelineItems: TimelineItem[] = [
    ...contact.activities.map((activity): TimelineItem => ({
      id: activity.id,
      type: 'activity',
      title: activity.activity,
      subtitle: `Activity ID: ${(activity.activityFields as any)?.ticket_id || (activity.activityFields as any)?.order_id || activity.id}`,
      date: new Date(activity.createdAt),
      status: activity.activity === 'Support Ticket' ? 'Resolved' : 'Completed',
      icon: getActivityIcon(activity.activity),
      details: activity.activityFields as any || {}
    })),
    ...contact.surveys.map((survey): TimelineItem => ({
      id: survey.id,
      type: 'survey',
      title: survey.surveyTitle,
      subtitle: `Survey ID: ${survey.id}`,
      date: new Date(survey.sentAt),
      status: survey.status,
      icon: <Vote className="h-4 w-4 text-primary" />,
      details: {
        channel: survey.channel,
        participationMethod: survey.participationMethod,
        responseTime: survey.participationDate ? 
          `${Math.round((new Date(survey.participationDate).getTime() - new Date(survey.sentAt).getTime()) / (1000 * 60 * 60))} hours` : 
          'N/A',
        metricScores: survey.metricScores
      }
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

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
              
              {/* Timeline card */}
              <Card 
                className="ml-10 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {item.type === 'survey' ? (
                        <>
                          {item.details.channel && (
                            <div>
                              <span className="font-medium text-gray-700">Channel:</span>
                              <span className="text-gray-600 ml-2">{item.details.channel}</span>
                            </div>
                          )}
                          {item.details.responseTime && (
                            <div>
                              <span className="font-medium text-gray-700">Response Time:</span>
                              <span className="text-gray-600 ml-2">{item.details.responseTime}</span>
                            </div>
                          )}
                          {item.details.metricScores?.nps && (
                            <div>
                              <span className="font-medium text-gray-700">NPS Score:</span>
                              <span className="text-green-600 font-medium ml-2">{item.details.metricScores.nps}</span>
                            </div>
                          )}
                          {item.details.metricScores?.csat && (
                            <div>
                              <span className="font-medium text-gray-700">CSAT Score:</span>
                              <span className="text-primary font-medium ml-2">{item.details.metricScores.csat}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {item.details.category && (
                            <div>
                              <span className="font-medium text-gray-700">Category:</span>
                              <span className="text-gray-600 ml-2">{item.details.category}</span>
                            </div>
                          )}
                          {item.details.priority && (
                            <div>
                              <span className="font-medium text-gray-700">Priority:</span>
                              <span className="text-gray-600 ml-2">{item.details.priority}</span>
                            </div>
                          )}
                          {item.details.amount && (
                            <div>
                              <span className="font-medium text-gray-700">Amount:</span>
                              <span className="text-gray-600 ml-2">${item.details.amount.toLocaleString()}</span>
                            </div>
                          )}
                          {item.details.product && (
                            <div>
                              <span className="font-medium text-gray-700">Product:</span>
                              <span className="text-gray-600 ml-2">{item.details.product}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
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
