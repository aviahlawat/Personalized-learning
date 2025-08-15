import '../App.css'
import ParticleBackground from '../components/ParticleBackground';
import AIForm from '../components/AiForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from './../components/ThemeProvider';


const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-app-theme">
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <ThemeToggle />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
        <AIForm  />
      </div>
    </div>
    </ThemeProvider>
  );
};

export default Index;