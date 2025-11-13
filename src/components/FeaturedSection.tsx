import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, ListChecks, BookOpen, Gamepad2 } from 'lucide-react';

const features = [
  {
    id: 'core-algorithms',
    title: 'Core Algorithms',
    description: 'Explore step-by-step visualizations of 72+ essential algorithms across multiple categories.',
    icon: Code2,
    link: '#algorithms',
    image: '/placeholder.svg',
    action: 'Browse Algorithms'
  },
  {
    id: 'blind-75',
    title: 'Blind 75',
    description: 'Master the most important 75 LeetCode problems curated for technical interviews.',
    icon: ListChecks,
    link: '/blind75',
    image: '/placeholder.svg',
    action: 'Start Learning'
  },
  {
    id: 'blog',
    title: 'Blog & Tutorials',
    description: 'Deep dive into algorithm patterns, problem-solving strategies, and coding techniques.',
    icon: BookOpen,
    link: '/blog',
    image: '/placeholder.svg',
    action: 'Read Articles'
  },
  {
    id: 'games',
    title: 'Interactive Games',
    description: 'Practice algorithms through fun, interactive games that reinforce your understanding.',
    icon: Gamepad2,
    link: '/games',
    image: '/placeholder.svg',
    action: 'Play Now'
  }
];

export const FeaturedSection = () => {
  const handleCoreAlgorithmsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (features[0].link.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById('algorithms');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isFirstCard = index === 0;
            
            return (
              <Link
                key={feature.id}
                to={feature.link}
                onClick={isFirstCard ? handleCoreAlgorithmsClick : undefined}
                className="group block h-full"
              >
                <Card className="h-full flex flex-col overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                    <Icon className="w-20 h-20 text-primary/40 group-hover:text-primary/60 transition-colors duration-300 group-hover:scale-110 transform" />
                  </div>
                  
                  <CardHeader className="flex-none">
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  
                  <CardFooter className="flex-none pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {feature.action}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
