import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormData {
  Quiz_Attempts: string;
  Quiz_Scores: string;
  Forum_Participation: string;
  Assignment_Completion_Rate: string;
  Engagement_Level: string;
  Final_Exam_Score: string;
  Feedback_Score: string;
}



const AIForm = () => {
//   const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    Quiz_Attempts: '',
    Quiz_Scores: '',
    Forum_Participation: '',
    Assignment_Completion_Rate: '',
    Engagement_Level: '',
    Final_Exam_Score: '',
    Feedback_Score: '',
  });

  const [loading, setLoading] = useState(false);

  const formFields = [
    { key: 'Quiz_Attempts', label: 'Quiz Attempts', placeholder: 'e.g., 15' },
    { key: 'Quiz_Scores', label: 'Quiz Scores', placeholder: 'e.g., 85' },
    { key: 'Forum_Participation', label: 'Forum Participation', placeholder: 'e.g., 12' },
    { key: 'Assignment_Completion_Rate', label: 'Assignment Completion Rate', placeholder: 'e.g., 95' },
    { key: 'Engagement_Level', label: 'Engagement Level', placeholder: 'e.g., 80' },
    { key: 'Final_Exam_Score', label: 'Final Exam Score', placeholder: 'e.g., 88' },
    { key: 'Feedback_Score', label: 'Feedback Score', placeholder: 'e.g., 4.2' },
  ];

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - replace with actual endpoint
    //   const mockResponse = await mockAICall(formData);
      
      // Navigate to prediction page with data
    //   navigate('/prediction', {
    //     state: {
    //       response: mockResponse,
    //       formData: formData
    //     }
    //   });
    } catch (error) {
      console.error('Error processing request:', error);
      // You could add a toast notification here for errors
    } finally {
      setLoading(false);
    }
  };

//   // Mock AI response function
//   const mockAICall = async (data: FormData): Promise<string> => {
//     await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
//     const score = calculatePredictedScore(data);
//     return `Based on your academic performance metrics, our AI analysis predicts:

// 📊 **Predicted Final Grade: ${score}%**

// 🎯 **Performance Insights:**
// • Your quiz performance (${data.Quiz_Scores}%) shows ${parseInt(data.Quiz_Scores) >= 80 ? 'strong' : 'room for improvement in'} understanding of core concepts
// • Forum participation level (${data.Forum_Participation} posts) indicates ${parseInt(data.Forum_Participation) >= 10 ? 'excellent' : 'moderate'} engagement with course community
// • Assignment completion rate of ${data.Assignment_Completion_Rate}% demonstrates ${parseInt(data.Assignment_Completion_Rate) >= 90 ? 'excellent' : 'good'} time management

// 💡 **Recommendations:**
// ${generateRecommendations(data)}

// Keep up the great work! Your dedication to learning is evident in these metrics.`;
//   };

//   const calculatePredictedScore = (data: FormData): number => {
//     const weights = {
//       Quiz_Scores: 0.25,
//       Assignment_Completion_Rate: 0.2,
//       Final_Exam_Score: 0.3,
//       Engagement_Level: 0.15,
//       Feedback_Score: 0.1
//     };

//     let weightedSum = 0;
//     weightedSum += parseFloat(data.Quiz_Scores || '0') * weights.Quiz_Scores;
//     weightedSum += parseFloat(data.Assignment_Completion_Rate || '0') * weights.Assignment_Completion_Rate;
//     weightedSum += parseFloat(data.Final_Exam_Score || '0') * weights.Final_Exam_Score;
//     weightedSum += parseFloat(data.Engagement_Level || '0') * weights.Engagement_Level;
//     weightedSum += (parseFloat(data.Feedback_Score || '0') * 20) * weights.Feedback_Score; // Convert 5-scale to 100-scale

//     return Math.round(weightedSum);
//   };

//   const generateRecommendations = (data: FormData): string => {
//     const recommendations = [];
    
//     if (parseInt(data.Quiz_Scores) < 80) {
//       recommendations.push("• Focus on review sessions before quizzes to improve scores");
//     }
    
//     if (parseInt(data.Forum_Participation) < 10) {
//       recommendations.push("• Increase participation in forum discussions to enhance learning");
//     }
    
//     if (parseInt(data.Assignment_Completion_Rate) < 90) {
//       recommendations.push("• Improve time management to complete more assignments on time");
//     }
    
//     if (parseInt(data.Engagement_Level) < 70) {
//       recommendations.push("• Consider more active participation in class activities");
//     }
    
//     if (recommendations.length === 0) {
//       recommendations.push("• Continue your excellent performance across all metrics!");
//       recommendations.push("• Consider helping peers to further enhance your learning experience");
//     }
    
//     return recommendations.join('\n');
//   };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
      <Card className="ai-form">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gradient mb-2">
            AI Student Performance Predictor
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Enter your academic metrics to get AI-powered performance insights
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium text-foreground">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    placeholder={placeholder}
                    value={formData[key as keyof FormData]}
                    onChange={(e) => handleInputChange(key as keyof FormData, e.target.value)}
                    className="ai-input"
                    required
                  />
                </div>
              ))}
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="ai-button w-full text-lg py-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Performance...
                </>
              ) : (
                'Get AI Analysis'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIForm;