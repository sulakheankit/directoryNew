import { ContactWithData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Brain, Heart } from "lucide-react";

interface NLPInsightsProps {
  contact: ContactWithData;
}

export default function NLPInsights({ contact }: NLPInsightsProps) {
  // Extract real sentiment data from imported surveys
  const surveyInsights = contact.surveys.map(survey => ({
    id: survey.id,
    title: survey.surveyTitle,
    sentiment: survey.openEndedSentiment,
    themes: survey.openEndedThemes,
    emotions: survey.openEndedEmotions
  })).filter(s => s.sentiment || s.themes || s.emotions);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getSentimentBgColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50';
      case 'negative':
        return 'bg-red-50';
      default:
        return 'bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">NLP Insights</h3>

      {/* Survey-Based Insights from Imported Data */}
      {surveyInsights.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Survey Response Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {surveyInsights.map((survey) => (
              <div key={survey.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h5 className="font-medium text-gray-900 mb-2">{survey.title}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {survey.sentiment && (
                    <div>
                      <span className="font-medium">Sentiment:</span>{' '}
                      <span className={survey.sentiment === 'positive' ? 'text-green-600' : survey.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'}>
                        {survey.sentiment.charAt(0).toUpperCase() + survey.sentiment.slice(1)}
                      </span>
                    </div>
                  )}
                  {survey.themes && (
                    <div>
                      <span className="font-medium">Themes:</span>{' '}
                      <span className="text-gray-600">
                        {Array.isArray(survey.themes) ? 
                          survey.themes.map((theme: any) => 
                            typeof theme === 'object' ? theme.theme || theme.name : theme
                          ).join(', ') : 
                          typeof survey.themes === 'object' && survey.themes ?
                            Object.values(survey.themes as any).map((theme: any) => 
                              typeof theme === 'object' ? theme.theme || theme.name || theme : theme
                            ).join(', ') :
                            survey.themes
                        }
                      </span>
                    </div>
                  )}
                  {survey.emotions && (
                    <div>
                      <span className="font-medium">Emotions:</span>{' '}
                      <span className="text-gray-600">
                        {Array.isArray(survey.emotions) ? 
                          survey.emotions.map((emotion: any) => 
                            typeof emotion === 'object' ? emotion.emotion || emotion.name : emotion
                          ).join(', ') : 
                          typeof survey.emotions === 'object' && survey.emotions ?
                            Object.values(survey.emotions as any).map((emotion: any) => 
                              typeof emotion === 'object' ? emotion.emotion || emotion.name || emotion : emotion
                            ).join(', ') :
                            survey.emotions
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No sentiment analysis data available from imported surveys.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}