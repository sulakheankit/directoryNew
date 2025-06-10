import { ContactWithData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Brain, Heart, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

  // Aggregate sentiment analysis
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  const allThemes: string[] = [];
  const allEmotions: string[] = [];

  surveyInsights.forEach(survey => {
    if (survey.sentiment) {
      sentimentCounts[survey.sentiment as keyof typeof sentimentCounts]++;
    }
    
    if (survey.themes) {
      const themes = Array.isArray(survey.themes) 
        ? survey.themes.map((theme: any) => typeof theme === 'object' ? theme.theme || theme.name : theme)
        : typeof survey.themes === 'object' 
          ? Object.values(survey.themes as any).map((theme: any) => typeof theme === 'object' ? theme.theme || theme.name || theme : theme)
          : [survey.themes];
      allThemes.push(...themes.filter(Boolean));
    }
    
    if (survey.emotions) {
      const emotions = Array.isArray(survey.emotions) 
        ? survey.emotions.map((emotion: any) => typeof emotion === 'object' ? emotion.emotion || emotion.name : emotion)
        : typeof survey.emotions === 'object' 
          ? Object.values(survey.emotions as any).map((emotion: any) => typeof emotion === 'object' ? emotion.emotion || emotion.name || emotion : emotion)
          : [survey.emotions];
      allEmotions.push(...emotions.filter(Boolean));
    }
  });

  // Calculate overall sentiment
  const totalSentiments = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral;
  const overallSentiment = totalSentiments > 0 
    ? sentimentCounts.positive > sentimentCounts.negative && sentimentCounts.positive > sentimentCounts.neutral 
      ? 'positive' 
      : sentimentCounts.negative > sentimentCounts.positive && sentimentCounts.negative > sentimentCounts.neutral 
        ? 'negative' 
        : 'neutral'
    : 'neutral';

  // Pie chart data
  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive, color: '#10B981' },
    { name: 'Negative', value: sentimentCounts.negative, color: '#EF4444' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  // Word frequency for themes and emotions
  const getWordFrequency = (words: string[]) => {
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().trim();
      frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
    });
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);
  };

  const themeFrequency = getWordFrequency(allThemes);
  const emotionFrequency = getWordFrequency(allEmotions);

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

      {surveyInsights.length > 0 ? (
        <>
          {/* Aggregated Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Sentiment Card */}
            <Card className={`${getSentimentBgColor(overallSentiment)}`}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Smile className={`h-8 w-8 ${getSentimentColor(overallSentiment)} mr-3`} />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Overall Sentiment</h4>
                    <p className={`text-2xl font-bold ${getSentimentColor(overallSentiment)}`}>
                      {overallSentiment.charAt(0).toUpperCase() + overallSentiment.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Based on {totalSentiments} survey response{totalSentiments !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No sentiment data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Themes and Emotions Word Clouds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Themes Word Cloud */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Key Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {themeFrequency.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {themeFrequency.map(([theme, count]) => (
                      <Badge
                        key={theme}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                        style={{
                          fontSize: `${Math.max(0.75, Math.min(1.2, count * 0.1 + 0.8))}rem`,
                          padding: `${Math.max(4, Math.min(12, count * 2 + 4))}px ${Math.max(8, Math.min(16, count * 2 + 8))}px`
                        }}
                      >
                        {theme} ({count})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No themes data available</p>
                )}
              </CardContent>
            </Card>

            {/* Emotions Word Cloud */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Emotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emotionFrequency.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {emotionFrequency.map(([emotion, count]) => (
                      <Badge
                        key={emotion}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                        style={{
                          fontSize: `${Math.max(0.75, Math.min(1.2, count * 0.1 + 0.8))}rem`,
                          padding: `${Math.max(4, Math.min(12, count * 2 + 4))}px ${Math.max(8, Math.min(16, count * 2 + 8))}px`
                        }}
                      >
                        {emotion} ({count})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No emotions data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Individual Survey Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900">Individual Survey Analysis</CardTitle>
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
                              String(survey.themes)
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
                              String(survey.emotions)
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
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