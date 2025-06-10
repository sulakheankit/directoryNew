import { ContactWithData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, TrendingUp, Tags, Star } from "lucide-react";

interface ProfileSummaryCardsProps {
  contact: ContactWithData;
}

export default function ProfileSummaryCards({ contact }: ProfileSummaryCardsProps) {
  const directoryFields = contact.directoryFields as any;
  const latestSurvey = contact.surveys.find(s => s.status === 'Completed');
  const metricScores = latestSurvey?.metricScores as any;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Contact Info Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Info</h3>
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{directoryFields.email}</p>
            <p className="text-sm text-gray-600">{directoryFields.phone}</p>
            <p className="text-sm text-gray-600">{directoryFields.location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Communication Metrics Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Communication</h3>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Read Rate</span>
              <span className="text-sm font-medium text-green-600">
                {contact.communicationMetrics.emailReadRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-primary">
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
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            <Tags className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`
                  ${tag.color === 'green' && 'bg-green-100 text-green-800 hover:bg-green-200'}
                  ${tag.color === 'blue' && 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                  ${tag.color === 'purple' && 'bg-purple-100 text-purple-800 hover:bg-purple-200'}
                  ${tag.color === 'orange' && 'bg-orange-100 text-orange-800 hover:bg-orange-200'}
                `}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Summary Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Latest Scores</h3>
            <Star className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">NPS</span>
              <span className="text-lg font-semibold text-green-600">
                {metricScores?.nps || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CSAT</span>
              <span className="text-lg font-semibold text-primary">
                {metricScores?.csat || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CES</span>
              <span className="text-lg font-semibold text-orange-600">
                {metricScores?.ces || 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
