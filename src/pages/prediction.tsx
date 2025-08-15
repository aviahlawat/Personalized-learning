import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import TypingEffect from '@/components/TypingEffect';
import ParticleBackground from '@/components/ParticleBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

interface PredictionData {
  response: string;
  formData: any;
}

const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.response && location.state?.formData) {
      setPredictionData({
        response: location.state.response,
        formData: location.state.formData
      });
    } else {
      // Redirect to home if no data
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDownload = () => {
    if (!predictionData) return;
    
    const content = `AI Student Performance Analysis Report
Generated on: ${new Date().toLocaleDateString()}

${predictionData.response}

Input Data:
${Object.entries(predictionData.formData).map(([key, value]) => 
  `${key.replace(/_/g, ' ')}: ${value}`
).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!predictionData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Student Performance Analysis',
          text: 'Check out my AI-generated performance analysis!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (!predictionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <ThemeToggle />
      
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm border-border/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analysis
            </Button>
            
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm border-border/50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm border-border/50"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                🎯 Your Performance Analysis
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <TypingEffect 
                  text={predictionData.response} 
                  speed={20}
                />
              </div>
            </CardContent>
          </Card>

          {/* Input Summary */}
          <Card className="mt-8 bg-background/60 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Input Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(predictionData.formData).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-lg font-semibold">{String(value)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prediction;