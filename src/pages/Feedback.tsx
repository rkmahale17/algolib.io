import { ImagePlus, Loader2, MessageSquare, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const Feedback = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    if (!supabase) {
      toast.error('Database connection not available');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('feedback-images')
          .upload(fileName, image);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Failed to upload image');
          return;
        }

        const { data: urlData } = supabase.storage
          .from('feedback-images')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Insert feedback into database
      const { error: insertError } = await supabase
        .from('feedback')
        .insert({
          title: title.trim(),
          description: description.trim(),
          user_email: email.trim() || null,
          image_url: imageUrl,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Failed to submit feedback');
        return;
      }

      toast.success('Thank you for your feedback!');
      setTitle('');
      setDescription('');
      setEmail('');
      removeImage();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback & Suggestions - AlgoLib.io | Report Bugs & Request Features</title>
        <meta 
          name="description" 
          content="Share your feedback, report bugs, or request new features for AlgoLib.io. Help us improve our free algorithm learning platform." 
        />
        <meta 
          name="keywords" 
          content="algolib feedback, report bug, feature request, algorithm platform feedback, contribute feedback" 
        />
        <link rel="canonical" href="https://algolib.io/feedback" />
        
        <meta property="og:title" content="Feedback & Suggestions - AlgoLib.io" />
        <meta property="og:description" content="Help us improve AlgoLib.io by sharing your feedback and suggestions" />
        <meta property="og:url" content="https://algolib.io/feedback" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">We Value Your Input</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Feedback & Suggestions</h1>
              <p className="text-muted-foreground">
                Help us improve AlgoLib by sharing your feedback, bug reports, or feature requests.
              </p>
            </div>

            <Card className="p-6 glass-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">We'll only use this to follow up on your feedback</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your feedback"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed feedback, bug reports, or feature requests..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Screenshot (optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                    >
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Add Screenshot
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Max 5MB, helps us understand the issue better</p>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Feedback;
