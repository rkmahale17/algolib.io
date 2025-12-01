import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { algorithmsDB } from '@/data/algorithmsDB';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SeedDatabase = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    setResults(null);

    try {
      const algorithms = Object.values(algorithmsDB);

      console.log(`Sending ${algorithms.length} algorithms to seed function`);

      const { data, error } = await supabase.functions.invoke('seed-algorithms', {
        body: { algorithms },
      });

      if (error) throw error;

      setResults(data.results);
      toast({
        title: 'Seeding completed',
        description: `Successfully seeded ${data.results.success} algorithms. ${data.results.failed} failed.`,
      });
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast({
        title: 'Seeding failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
          <CardDescription>
            Seed the algorithms table with data from algorithmsDB.ts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              This will insert all algorithms from algorithmsDB.ts into the database.
              Existing algorithms will be updated (upsert).
            </p>
            
            <Button
              onClick={handleSeed}
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSeeding ? 'Seeding...' : 'Seed Algorithms Table'}
            </Button>
          </div>

          {results && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Success: {results.success}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Failed: {results.failed}</span>
                </div>
                
                {results.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Errors:</p>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {results.errors.map((error: string, idx: number) => (
                        <p key={idx} className="text-xs text-red-500">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeedDatabase;
