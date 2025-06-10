import React from "react";
import { Survey, ContactWithData } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface SurveyDetailsProps {
  survey: Survey;
  contact?: ContactWithData;
  showRelatedActivity?: boolean;
}

export default function SurveyDetails({ survey, contact, showRelatedActivity = false }: SurveyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Response Details */}
      <div>
        <div className="border-l-4 border-blue-500 pl-3 mb-3">
          <h4 className="text-lg font-semibold text-gray-900">Response Details</h4>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Participation Method:</span>
            <span className="text-gray-900">{(survey as any).participatedVia || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Response Time:</span>
            <span className="text-gray-900">
              {(survey as any).participatedDate ? 
                `${Math.round((new Date((survey as any).participatedDate).getTime() - new Date(survey.sentAt).getTime()) / (1000 * 60 * 60))} hours after sent` : 
                'N/A'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Language:</span>
            <span className="text-gray-900">{survey.language || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Survey Link:</span>
            <span>
              {(survey as any).surveyResponseLink ? (
                <a 
                  href={(survey as any).surveyResponseLink} 
                  className="text-blue-600 hover:underline text-sm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Response
                </a>
              ) : (
                <span className="text-gray-900">N/A</span>
              )}
            </span>
          </div>
          {showRelatedActivity && contact && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Related Activity:</span>
              <span className="text-gray-900">
                {survey.activityId ? 
                  contact.activities.find(activity => activity.id === survey.activityId)?.activity || 'Unknown Activity' :
                  'None'
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Driver Scores */}
      {(survey as any).driverScores && (
        <div>
          <div className="border-l-4 border-green-500 pl-3 mb-3">
            <h4 className="text-lg font-semibold text-gray-900">Driver Scores</h4>
          </div>
          <div className="space-y-3 text-sm">
            {Object.entries((survey as any).driverScores as any).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-600">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                </span>
                <span className="text-gray-900 font-semibold">{value as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Analysis */}
      {survey.openEndedSentiment && (
        <div>
          <div className="border-l-4 border-purple-500 pl-3 mb-3">
            <h4 className="text-lg font-semibold text-gray-900">Feedback Analysis</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Sentiment:</span>
              <Badge 
                className={
                  survey.openEndedSentiment === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : survey.openEndedSentiment === 'negative' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {survey.openEndedSentiment.charAt(0).toUpperCase() + survey.openEndedSentiment.slice(1)}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-600 block mb-1">Key Themes:</span>
              <div className="text-gray-900">
                {Array.isArray(survey.openEndedThemes) ? 
                  survey.openEndedThemes.map((theme: any) => 
                    typeof theme === 'string' ? theme : (theme.theme || theme.name || theme)
                  ).join(', ') : 
                  'N/A'
                }
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600 block mb-1">Emotions:</span>
              <div className="text-gray-900">
                {Array.isArray(survey.openEndedEmotions) ? 
                  survey.openEndedEmotions.map((emotion: any) => 
                    typeof emotion === 'string' ? emotion : (emotion.emotion || emotion.name || emotion)
                  ).join(', ') : 
                  'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}