import { ContactWithData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Brain, Heart } from "lucide-react";

interface NLPInsightsProps {
  contact: ContactWithData;
}

export default function NLPInsights({ contact }: NLPInsightsProps) {
  const insights = contact.nlpInsights;
  
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

  const getAnalysisBorderColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-l-green-400';
      case 'negative':
        return 'border-l-red-400';
      default:
        return 'border-l-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">NLP Insights</h3>
      
      {/* Sentiment Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${getSentimentBgColor(insights.overallSentiment)}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Smile className={`h-8 w-8 ${getSentimentColor(insights.overallSentiment)} mr-3`} />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Overall Sentiment</h4>
                <p className={`text-2xl font-bold ${getSentimentColor(insights.overallSentiment)}`}>
                  {insights.overallSentiment.charAt(0).toUpperCase() + insights.overallSentiment.slice(1)}
                </p>
                <p className="text-sm text-gray-600">{insights.confidence}% confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Key Themes</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {insights.themes.join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Emotions</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {insights.emotions.join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Feedback Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.analysis.map((item, index) => (
            <div 
              key={index} 
              className={`border-l-4 ${getAnalysisBorderColor(item.sentiment)} pl-4`}
            >
              <h5 className="font-medium text-gray-900">
                {item.theme} ({item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)})
              </h5>
              <p className="text-sm text-gray-600 mt-1 italic">
                "{item.quote}"
              </p>
              <div className="flex space-x-2 mt-2">
                {item.emotions.map((emotion, emotionIndex) => (
                  <Badge
                    key={emotionIndex}
                    variant="secondary"
                    className={`
                      ${item.sentiment === 'positive' && 'bg-green-100 text-green-800'}
                      ${item.sentiment === 'negative' && 'bg-red-100 text-red-800'}
                      ${item.sentiment === 'neutral' && 'bg-yellow-100 text-yellow-800'}
                    `}
                  >
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Survey-Based Insights from Imported Data */}
      {surveyInsights.length > 0 && (
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
                          survey.themes.join(', ') : 
                          typeof survey.themes === 'object' && survey.themes ?
                            Object.values(survey.themes as any).join(', ') :
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
                          survey.emotions.join(', ') : 
                          typeof survey.emotions === 'object' && survey.emotions ?
                            Object.values(survey.emotions as any).join(', ') :
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
      )}
    </div>
  );
}
