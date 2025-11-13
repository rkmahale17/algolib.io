export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  image?: string; // Hero image
  content: BlogContent[];
}

export interface BlogContent {
  type: 'heading' | 'subheading' | 'h4' | 'h5' | 'paragraph' | 'image' | 'code' | 'list' | 'quote' | 'cta';
  content?: string;
  language?: string;
  items?: string[];
  alt?: string;
  caption?: string;
  link?: string;
  large?: boolean; // For larger section spacing
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'master-blind-75-visual-algorithms',
    title: 'Master the Blind 75: Learn Faster with Visual Algorithms',
    subtitle: 'The complete guide to conquering technical interviews through pattern recognition',
    description: 'Understand the Blind 75 problems through interactive visual learning — learn patterns, logic, and coding techniques that actually stick.',
    author: 'Alex Chen',
    date: '2025-03-15',
    readTime: '15 min read',
    category: 'Interview Prep',
    tags: ['Blind 75', 'DSA Practice', 'Leetcode', 'Visual Learning', 'FAANG'],
    thumbnail: '/blog/blind75-patterns-diagram.jpg',
    image: '/blog/blind75-patterns-diagram.jpg', // Hero image
    content: [
      {
        type: 'paragraph',
        content: 'Landing your dream job at a top tech company requires more than just knowing algorithms—you need to master the patterns that appear repeatedly in coding interviews. The Blind 75 list has become the industry standard for interview preparation, representing a carefully curated collection that covers 90% of common interview scenarios at companies like Google, Amazon, Meta, Microsoft, and Apple.'
      },
      {
        type: 'paragraph',
        content: 'In this comprehensive guide, we\'ll explore how visual learning transforms the way you understand and retain these critical algorithms, making your interview preparation not just more effective, but actually enjoyable. We\'ll break down the science behind why visualization works, explore the key patterns you need to master, and provide you with a battle-tested study plan that has helped thousands land their dream roles.'
      },
      {
        type: 'image',
        content: '/blog/blind75-patterns-diagram.jpg',
        alt: 'The 7 essential algorithm patterns in Blind 75 - circular diagram showing Two Pointers, Sliding Window, Fast & Slow Pointers, Dynamic Programming, Binary Search, Tree Traversal, and Graph Algorithms'
      },
      {
        type: 'heading',
        content: 'What Makes the Blind 75 Special?'
      },
      {
        type: 'paragraph',
        content: 'Created by a former Facebook engineer, the Blind 75 isn\'t just another random problem list—it\'s a strategic selection of 75 LeetCode problems that teach you the fundamental patterns appearing in technical interviews. Unlike grinding through 500+ random problems hoping to see something similar, mastering these 75 effectively prepares you for thousands of variations.'
      },
      {
        type: 'paragraph',
        content: 'The revolutionary aspect is its focus on pattern recognition over memorization. Think of it like learning chess openings—once you understand fundamental patterns, you can recognize and respond to countless variations. Each problem teaches a reusable technique applicable to dozens of similar questions.'
      },
      {
        type: 'list',
        items: [
          '<strong>Efficiency Over Volume</strong>: 75 strategic problems vs 500+ random ones',
          '<strong>Pattern Recognition</strong>: Learn 7 core patterns that unlock thousands of problems',
          '<strong>Real Interview Focus</strong>: Problems actually asked at top tech companies',
          '<strong>Progressive Difficulty</strong>: Builds from fundamentals to advanced concepts'
        ]
      },
      {
        type: 'heading',
        content: 'The Neuroscience Behind Visual Learning'
      },
      {
        type: 'paragraph',
        content: 'Why does watching an algorithm visualization make it "click" instantly when reading the same explanation leaves you confused? The answer lies in cognitive science: our brains process visual information 60,000 times faster than text. When you watch pointers move through arrays, nodes connect in graphs, or stacks build and collapse in real-time, you\'re creating multiple neural pathways for that information.'
      },
      {
        type: 'paragraph',
        content: 'This phenomenon is explained by dual coding theory—your brain stores both visual representations AND verbal explanations, creating redundant memory pathways. It\'s why you can recall a movie scene years later but struggle to remember paragraphs you read yesterday.'
      },
      {
        type: 'list',
        items: [
          '<strong>Pattern Recognition Enhancement</strong>: Visual patterns train your brain to spot "two elements moving toward each other" or "building/tearing down structures"',
          '<strong>Reduced Cognitive Load</strong>: One cohesive picture vs holding 10 abstract concepts in working memory',
          '<strong>65% Better Retention</strong>: Visual learners retain information significantly longer and recall it faster under pressure',
          '<strong>Debugging Intuition</strong>: Mentally "run" algorithms in your head during interviews after seeing them execute visually'
        ]
      },
      {
        type: 'cta',
        content: '🚀 Start Your Visual Learning Journey Today',
        link: '/blind75'
      }
    ]
  }
];

export const getBlogPost = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit);
};
