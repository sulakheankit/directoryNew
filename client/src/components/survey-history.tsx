import React, { useState } from "react";
import { ContactWithData, Survey } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Smartphone } from "lucide-react";
import SurveyDetails from "@/components/survey-details";

interface SurveyHistoryProps {
  contact: ContactWithData;
}

export default function SurveyHistory({ contact }: SurveyHistoryProps) {
  const [surveyFilter, setSurveyFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpandedRow = (surveyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(surveyId)) {
      newExpanded.delete(surveyId);
    } else {
      newExpanded.add(surveyId);
    }
    setExpandedRows(newExpanded);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4 text-gray-400" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
      case 'app':
        return <Smartphone className="h-4 w-4 text-gray-400" />;
      default:
        return <Mail className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-800',
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

  const filteredSurveys = contact.surveys.filter(survey => {
    if (surveyFilter !== "all" && !survey.surveyTitle.toLowerCase().includes(surveyFilter.toLowerCase())) {
      return false;
    }
    if (channelFilter !== "all" && survey.channel.toLowerCase() !== channelFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== "all" && survey.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">Survey History</h3>
        <div className="flex flex-wrap gap-2">
          <Select value={surveyFilter} onValueChange={setSurveyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Surveys" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Surveys</SelectItem>
              {Array.from(new Set(contact.surveys.map(survey => survey.surveyTitle))).map(surveyTitle => (
                <SelectItem key={surveyTitle} value={surveyTitle.toLowerCase()}>
                  {surveyTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {Array.from(new Set(contact.surveys.map(survey => survey.channel))).map(channel => (
                <SelectItem key={channel} value={channel.toLowerCase()}>
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Array.from(new Set(contact.surveys.map(survey => survey.status))).map(status => (
                <SelectItem key={status} value={status.toLowerCase()}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Survey Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3">Survey</TableHead>
                <TableHead className="px-6 py-3">Channel</TableHead>
                <TableHead className="px-6 py-3">Sent At</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3">Scores</TableHead>
                <TableHead className="px-6 py-3">Related Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => [
                <TableRow 
                  key={survey.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpandedRow(survey.id)}
                >
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{survey.surveyTitle}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      {getChannelIcon(survey.channel)}
                      <span className="text-sm text-gray-900 ml-2">{survey.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {new Date(survey.sentAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(survey.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {survey.metricScores ? (
                      <div className="flex space-x-2 flex-wrap">
                        {Object.entries(survey.metricScores as any).slice(0, 2).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="bg-blue-100 text-blue-800 mb-1">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value as string}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Not Completed</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {survey.activityId ? (
                      <div className="text-sm font-medium text-gray-900">
                        {contact.activities.find(activity => activity.id === survey.activityId)?.activity || 'Unknown Activity'}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No related activity</span>
                    )}
                  </TableCell>
                </TableRow>,

                // Expanded Details Row
                expandedRows.has(survey.id) && (
                  <TableRow key={`${survey.id}-expanded`} className="bg-gray-50">
                    <TableCell colSpan={6} className="px-6 py-6">
                      <SurveyDetails 
                        survey={survey} 
                        contact={contact}
                        showRelatedActivity={true}
                      />
                    </TableCell>
                  </TableRow>
                )
              ].filter(Boolean))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
