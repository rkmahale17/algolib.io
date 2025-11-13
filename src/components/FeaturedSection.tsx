import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, ListChecks, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';

const features = [
  {
    id: 'blind-75',
    title: 'Blind 75',
    description: 'Master the most important 75 LeetCode problems curated for technical interviews.',
    icon: null,
    badge: '75',
    link: '/blind75',
    action: 'Start Learning'
  },
  {
    id: 'blog',
    title: 'Blog & Tutorials',
    description: 'Deep dive into algorithm patterns, problem-solving strategies, and coding techniques.',
    icon: BookOpen,
    link: '/blog',
    action: 'Read Articles'
  }
];

export const FeaturedSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <Link
                key={feature.id}
                to={feature.link}
                className="group block"
              >
                <Card className="overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card">
                  <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                    {feature.badge ? (
                      <div className="text-6xl font-bold text-primary/40 group-hover:text-primary/60 transition-colors duration-300 group-hover:scale-110 transform">
                        {feature.badge}
                      </div>
                    ) : (
                      Icon && <Icon className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors duration-300 group-hover:scale-110 transform" />
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 gap-1"
                      >
                        {feature.action}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
