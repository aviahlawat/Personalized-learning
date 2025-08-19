import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormData {
  Quiz_Attempts: number | '';
  Quiz_Scores: number | '';
  Forum_Participation: number | '';
  Assignment_Completion_Rate: number | '';
  Engagement_Level: string;
  Final_Exam_Score: number | '';
  Feedback_Score: number | '';
}

const ENGAGEMENT_OPTIONS = [
  { value: 'Low', label: 'LOW' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'HIGH' },
];

// Import the actual API call function
import { makePostRequest } from './hooks';

const TypewriterComponent = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h2 style="font-size: 20px; font-weight: bold; margin: 16px 0 8px 0;">$1</h2>')
      .replace(/^## (.*$)/gm, '<h3 style="font-size: 18px; font-weight: bold; margin: 12px 0 6px 0;">$1</h3>')
      .replace(/^\* (.*$)/gm, '• $1<br/>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: formatText(displayText) }} />
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-blue-500 animate-pulse ml-1"></span>
      )}
    </div>
  );
};

const AIForm = () => {
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
  const [apiResponse, setApiResponse] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formFields = [
    { 
      key: 'Quiz_Attempts', 
      label: 'Quiz Attempts', 
      placeholder: 'e.g., 5', 
      type: 'number',
      min: 0,
      max: 10,
      step: 1
    },
    { 
      key: 'Quiz_Scores', 
      label: 'Quiz Scores', 
      placeholder: 'e.g., 85', 
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    },
    { 
      key: 'Forum_Participation', 
      label: 'Forum Participation', 
      placeholder: 'e.g., 12', 
      type: 'number',
      min: 0,
      max: 50,
      step: 1
    },
    { 
      key: 'Assignment_Completion_Rate', 
      label: 'Assignment Completion Rate', 
      placeholder: 'e.g., 95', 
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    },
    { 
      key: 'Engagement_Level', 
      label: 'Engagement Level', 
      placeholder: '', 
      type: 'select'
    },
    { 
      key: 'Final_Exam_Score', 
      label: 'Final Exam Score', 
      placeholder: 'e.g., 88', 
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    },
    { 
      key: 'Feedback_Score', 
      label: 'Feedback Score', 
      placeholder: 'e.g., 4.2', 
      type: 'number',
      min: 0,
      max: 5,
      step: 0.1
    },
  ];

  const validateInput = (key: keyof FormData, value: string) => {
    const field = formFields.find(f => f.key === key);
    const numValue = Number(value);
    
    if (field && field.type === 'number') {
      if (value !== '' && (numValue < field.min! || numValue > field.max!)) {
        return `Value must be between ${field.min} and ${field.max}`;
      }
    }
    return '';
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    // Clear existing error for this field
    setErrors(prev => ({ ...prev, [key]: '' }));

    if (key === 'Engagement_Level') {
      setFormData(prev => ({ ...prev, [key]: value }));
    } else {
      const numValue = value === '' ? '' : Number(value);
      
      // Validate input
      const error = validateInput(key, value);
      if (error) {
        setErrors(prev => ({ ...prev, [key]: error }));
      }
      
      // Update form data only if within constraints or empty
      const field = formFields.find(f => f.key === key);
      if (field && field.type === 'number' && value !== '') {
        const num = Number(value);
        if (num >= field.min! && num <= field.max!) {
          setFormData(prev => ({ ...prev, [key]: numValue }));
        } else if (value === '') {
          setFormData(prev => ({ ...prev, [key]: '' }));
        }
      } else {
        setFormData(prev => ({ ...prev, [key]: numValue }));
      }
    }
  };

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some(error => error !== '');
    const hasEmptyRequired = Object.values(formData).some(value => value === '');
    return !hasErrors && !hasEmptyRequired;
  };

  const handleAnalysis = async () => {
    if (!isFormValid()) {
      return;
    }

    setLoading(true);
    setShowChat(false);
    setApiResponse('');

    try {
      const preparedData = {
        ...formData,
        Quiz_Attempts: formData.Quiz_Attempts === '' ? null : Number(formData.Quiz_Attempts),
        Quiz_Scores: formData.Quiz_Scores === '' ? null : Number(formData.Quiz_Scores),
        Forum_Participation: formData.Forum_Participation === '' ? null : Number(formData.Forum_Participation),
        Assignment_Completion_Rate: formData.Assignment_Completion_Rate === '' ? null : Number(formData.Assignment_Completion_Rate),
        Final_Exam_Score: formData.Final_Exam_Score === '' ? null : Number(formData.Final_Exam_Score),
        Feedback_Score: formData.Feedback_Score === '' ? null : Number(formData.Feedback_Score),
      };

      console.log(preparedData);
      const response = await makePostRequest(preparedData);
      
      let responseText;
      if (typeof response === 'string') {
        responseText = response;
      } else if (response?.recommendation) {
        responseText = response.recommendation;
      } else if (response?.text) {
        responseText = response.text;
      } else if (response?.message) {
        responseText = response.message;
      } else {
        responseText = JSON.stringify(response);
      }
      
      console.log(response);
      setApiResponse(responseText);
      setShowChat(true);
    } catch (error) {
      console.error('Error processing request:', error);
      setApiResponse('Sorry, there was an error processing your request. Please try again.');
      setShowChat(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Quiz_Attempts: '',
      Quiz_Scores: '',
      Forum_Participation: '',
      Assignment_Completion_Rate: '',
      Engagement_Level: '',
      Final_Exam_Score: '',
      Feedback_Score: '',
    });
    setApiResponse('');
    setShowChat(false);
    setErrors({});
  };

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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map(({ key, label, placeholder, type, min, max, step }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium text-foreground">
                    {label}
                  </Label>
                  {type === 'select' ? (
                    <select
                      id={key}
                      value={formData.Engagement_Level}
                      onChange={e => handleInputChange('Engagement_Level', e.target.value)}
                      className="ai-input block w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="" disabled>
                        Select Engagement Level
                      </option>
                      {ENGAGEMENT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <Input
                        id={key}
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        placeholder={placeholder}
                        value={formData[key as keyof FormData] === '' ? '' : String(formData[key as keyof FormData])}
                        onChange={e => handleInputChange(key as keyof FormData, e.target.value)}
                        className="ai-input"
                        required
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleAnalysis}
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
          </div>
        </CardContent>
      </Card>

      {/* Chat-like Response Window */}
      {showChat && (
        <Card className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  AI Performance Analysis
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Analysis complete • Just now
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="max-w-none">
                <div 
                  className="text-slate-700 leading-relaxed whitespace-pre-wrap"
                  style={{ 
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}
                >
                  <TypewriterComponent text={apiResponse} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Response generated</span>
              </div>
              
              <Button
                onClick={resetForm}
                variant="outline"
                size="sm"
                className="text-sm hover:bg-gray-50"
              >
                New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State for Chat */}
      {loading && !showChat && (
        <Card className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  AI Performance Analysis
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Analyzing your data...
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-slate-500 text-sm">AI is thinking...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIForm;