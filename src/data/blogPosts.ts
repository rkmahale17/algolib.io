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
  image?: string;
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
  large?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'master-blind-75-visual-algorithms',
    title: 'Master the Blind 75: The Only LeetCode List You Need for FAANG Interviews',
    subtitle: 'Learn how 75 strategic problems and visual learning can land you your dream tech job faster than grinding 500+ random questions',
    description: 'Discover why the Blind 75 is the most efficient path to mastering coding interviews at Google, Meta, Amazon, and other top tech companies. Learn proven patterns through interactive visualizations that make complex algorithms click instantly.',
    author: 'AlgoLib Team',
    date: '2025-01-15',
    readTime: '18 min read',
    category: 'Interview Prep',
    tags: ['Blind 75', 'LeetCode', 'FAANG', 'Visual Learning', 'Coding Interview', 'Algorithm Patterns'],
    thumbnail: '/blog/blind75-patterns-diagram.png',
    image: '/blog/blind75-patterns-diagram.png', // Hero image

    content: [
      {
        type: 'paragraph',
        content: 'You\'ve probably heard it before: "Just grind LeetCode." But here\'s the truth that nobody tells you—grinding random problems is like trying to learn a language by memorizing random sentences. You might get lucky, but you\'ll never truly understand the underlying patterns. That\'s where the Blind 75 changes everything.'
      },
      {
        type: 'paragraph',
        content: 'Created by a former Facebook engineer who interviewed at dozens of top companies, the Blind 75 isn\'t just another problem list—it\'s a battle-tested blueprint that teaches you the 7 core patterns appearing in 90% of all coding interviews. '
      },

      {
        type: 'paragraph',
        content: 'In this comprehensive guide, we\'ll show you exactly how to master these 75 problems using AlgoLib.io\'s interactive visualizations, transforming your preparation from overwhelming to systematic, and from frustrating to genuinely enjoyable.'
      },

      {
        type: 'heading',
        content: 'What Makes the Blind 75 Different? (And Why It Works)'
      },

      {
        type: 'paragraph',
        content: 'LeetCode has over 2,500 problems. Grinding through them all would take years. The Blind 75 cuts through the noise by focusing on quality over quantity—75 carefully selected problems that teach you reusable patterns, not one-off tricks.'
      },

      {
        type: 'paragraph',
        content: 'Think of it like learning chess. You don\'t memorize every possible game—you learn opening principles, tactical patterns, and endgame techniques. Once you know these patterns, you can handle thousands of variations. The Blind 75 works exactly the same way for coding interviews.'
      },

      {
        type: 'subheading',
        content: 'The Numbers Don\'t Lie'
      },

      {
        type: 'list',
        items: [
          `<strong>75 problems vs 2,500+</strong>: Cover 90% of interview patterns with 3% of the problems`,
          '<strong>3-8 weeks to complete</strong>: A realistic timeline vs years of random grinding',
          '<strong>7 core patterns</strong>: Master these and unlock thousands of problem variations',
          '<strong>Verified by thousands</strong>: Engineers at Google, Meta, Amazon, Microsoft, and Apple credit this list for their success'
        ]
      },

      {
        type: 'quote',
        content: '"I got offers from Google and Meta by focusing only on the Blind 75. Once you understand the patterns, you realize most interview questions are just variations of these 75 problems." — Former candidate, now at Google'
      },

      {
        type: 'heading',
        content: 'Why Visual Learning is Your Secret Weapon'
      },

      {
        type: 'paragraph',
        content: 'Here\'s a question: Have you ever read an algorithm explanation three times and still felt confused, but then watched a 2-minute visualization and everything instantly clicked? You\'re not alone. Science explains why.'
      },

      {
        type: 'paragraph',
        content: '<strong>Your brain processes visual information 60,000 times faster than text.</strong> When you see pointers move through an array, nodes connect in a graph, or a stack build and collapse in real-time on AlgoLib.io, you\'re creating multiple neural pathways for that information. This is called dual coding theory—your brain stores both the visual representation AND the verbal explanation, creating redundant memory that you can recall under pressure.'
      },

      {
        type: 'subheading',
        content: 'What This Means for Your Interview Prep'
      },

      {
        type: 'list',
        items: [
          '<strong>65% better retention</strong>: Visual learners retain algorithms significantly longer and recall them faster during high-pressure interviews',
          '<strong>Pattern recognition on steroids</strong>: Your brain learns to spot "two elements converging" or "layer-by-layer traversal" automatically',
          '<strong>Reduced cognitive load</strong>: One cohesive animation vs holding 10 abstract steps in working memory',
          '<strong>Debugging intuition</strong>: After seeing algorithms execute visually, you can mentally "run" them during interviews',
          '<strong>Faster learning curve</strong>: What takes 2 hours to understand through text takes 20 minutes with visualization'
        ]
      },

      {
        type: 'paragraph',
        content: 'This is exactly why AlgoLib.io exists. We\'ve built step-by-step interactive visualizations for 72+ algorithms, complete with code examples in Python, Java, C++, and TypeScript. You can watch each algorithm execute line by line, pause at any moment, and truly understand what\'s happening—not just memorize the code.'
      },

      {
        type: 'heading',
        content: 'The 7 Patterns That Unlock Everything'
      },

      {
        type: 'paragraph',
        content: 'Every problem in the Blind 75 falls into one of seven fundamental patterns. Master these patterns, and you can solve thousands of variations. Here\'s your roadmap:'
      },

      {
        type: 'h4',
        content: '1. Two Pointers & Sliding Window (15 problems)'
      },

      {
        type: 'list',
        items: [`<strong>The Pattern:</strong> Use two pointers moving toward each other or a window that slides across data to solve problems in O(n) time instead of O(n²).`,
          '<strong>Key Problems:</strong> Two Sum II, Container With Most Water, Longest Substring Without Repeating Characters, Minimum Window Substring',
          '<strong>Why It Matters:</strong> This pattern appears in 20% of all FAANG interviews. Companies love it because it tests your ability to optimize brute force solutions.',
          '<strong>Visual Advantage:</strong> Watching pointers move and windows expand/contract on AlgoLib.io makes the "aha moment" instant. You\'ll see exactly when to move which pointer and why.']
      },
      {
        type: 'image',
        content: '/blog/patterns/two-pointers.png',
      },
      {
        type: "cta",
        link: '/algorithm/two-pointers/',
        content: 'Visualize two pointer problems on AlgoLib.io'
      },



      {
        type: 'h4',
        content: '2. Fast & Slow Pointers (5 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Use two pointers moving at different speeds to detect cycles, find middle elements, or solve problems on linked lists.',
          '<strong>Key Problems:</strong> Linked List Cycle, Find the Duplicate Number, Middle of Linked List.',
          '<strong>Why It Matters:</strong> This pattern is elegant and frequently asked. It’s also a great way to show interviewers you understand pointer manipulation.'
        ]
      },

      {
        type: 'image',
        content: '/blog/patterns/slow-fast-pointers.png',
      },
      {
        type: "cta",
        link: '/algorithm/fast-slow-pointers/',
        content: 'Visualize slow fast problems on AlgoLib.io'
      },

      {
        type: 'h4',
        content: '3. Binary Search & Modified Binary Search (7 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Divide and conquer sorted data to find elements in O(log n) time. The "modified" version applies binary search logic to unsorted problems.',
          '<strong>Key Problems:</strong> Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array, Time Based Key-Value Store.',
          '<strong>Why It Matters:</strong> Binary search is fundamental. If you can’t recognize when to apply it, you’ll struggle with medium and hard problems.'
        ]
      },
      {
        type: 'image',
        content: '/blog/patterns/bineary-search.png',
      },
      {
        type: "cta",
        link: '/algorithm/binary-search',
        content: 'Visualize binary search on AlgoLib.io'
      },

      {
        type: 'h4',
        content: '4. Tree & Graph Traversal (BFS/DFS) (20 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Navigate hierarchical or networked data using Breadth-First Search (level by level) or Depth-First Search (dive deep first).',
          '<strong>Key Problems:</strong> Binary Tree Level Order Traversal, Number of Islands, Clone Graph, Course Schedule.',
          '<strong>Why It Matters:</strong> Tree and graph problems make up 25–30% of all interviews. They test recursion skills, queue/stack usage, and your ability to think spatially.',
          '<strong>Visual Advantage:</strong> AlgoLib.io’s tree and graph visualizations make BFS vs DFS differences crystal clear.'
        ]
      },
      {
        type: 'image',
        content: '/blog/patterns/bfs.png',
      },
      {
        type: "cta",
        link: '/algorithm/bfs-level-order/',
        content: 'Visualize BFS on AlgoLib.io'
      },
      {
        type: "cta",
        link: '/algorithm/dfs-preorder/',
        content: 'Visualize DFS preorder on AlgoLib.io'
      },

      {
        type: "cta",
        link: '/algorithm/dfs-inorder/',
        content: 'Visualize DFS inorder on AlgoLib.io'
      },

      {
        type: "cta",
        link: '/algorithm/dfs-postorder/',
        content: 'Visualize DFS postorder on AlgoLib.io'
      },



      {
        type: 'h4',
        content: '5. Dynamic Programming (15 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Break problems into overlapping subproblems and build solutions from smaller pieces. Use memoization (top-down) or tabulation (bottom-up).',
          '<strong>Key Problems:</strong> Climbing Stairs, Coin Change, Longest Increasing Subsequence, Word Break.',
          '<strong>Why It Matters:</strong> DP is the final boss of coding interviews. It separates strong candidates from average ones.',
          '<strong>Visual Advantage:</strong> AlgoLib.io shows how subproblems overlap and how the DP table fills up, transforming confusion into clarity.'
        ]
      },
      {
        type: 'image',
        content: '/blog/patterns/coin-change.png',
      },
      {
        type: "cta",
        link: '/algorithm/coin-change/',
        content: 'Visualize Dyanamic Programming on AlgoLib.io'
      },
      {
        type: 'h4',
        content: '6. Backtracking & Recursion (8 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Explore all possible solutions by building them incrementally and backtracking when you hit dead ends.',
          '<strong>Key Problems:</strong> Subsets, Permutations, Combination Sum, Word Search.',
          '<strong>Why It Matters:</strong> These problems test your ability to think recursively and prune search spaces efficiently.'
        ]
      },
      {
        type: 'image',
        content: '/blog/patterns/backtracking.png',
      },
      {
        type: "cta",
        link: '/algorithm/subsets/',
        content: 'Visualize Backtracking on AlgoLib.io'
      },

      {
        type: 'h4',
        content: '7. Stacks, Queues & Heaps (5 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>The Pattern:</strong> Use LIFO (stacks), FIFO (queues), or priority-based structures (heaps) to solve problems involving ordering, scheduling, or processing.',
          '<strong>Key Problems:</strong> Valid Parentheses, Min Stack, Top K Frequent Elements, Merge K Sorted Lists.',
          '<strong>Why It Matters:</strong> These data structures are fundamental building blocks. Interviewers expect you to know when and how to use them.'
        ]
      },

      {
        type: 'image',
        content: '/blog/patterns/valid-parentesis.png',
      },
      {
        type: "cta",
        link: '/blind75/valid-parentheses',
        content: 'Visualize Stack, Queues on AlgoLib.io'
      },

      {
        type: 'heading',
        content: 'Your 8-Week Battle Plan to Master the Blind 75'
      },

      {
        type: 'paragraph',
        content: 'Here\'s a proven schedule that balances depth and breadth. Adjust based on your experience level and available time.'
      },

      {
        type: 'h4',
        content: 'Weeks 1–2: Array & String Fundamentals (15 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>Focus:</strong> Two Pointers, Sliding Window, Hashing.',
          '<strong>Why Start Here:</strong> These are the easiest patterns and build confidence. Arrays and strings appear in 40% of interviews.',
          '<strong>AlgoLib.io Resources:</strong> Watch Two Sum, Container With Most Water, and Longest Substring visualizations first.'
        ]
      },

      {
        type: 'h4',
        content: 'Weeks 3–4: Linked Lists & Binary Search (12 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>Focus:</strong> Fast & Slow Pointers, Binary Search variations.',
          '<strong>Practice Tip:</strong> Draw linked lists on paper while watching AlgoLib.io animations. This dual-channel learning accelerates retention.'
        ]
      },

      {
        type: 'h4',
        content: 'Weeks 5–6: Trees & Graphs (20 problems)'
      },
      {
        type: 'list',
        items: [
          '<strong>Focus:</strong> BFS, DFS, Recursion, Tree properties.',
          '<strong>Why It Gets Hard:</strong> Spatial reasoning is challenging. Use AlgoLib.io’s graph visualizations religiously—they’re specifically designed to make these concepts intuitive.'
        ]
      },

      {
        type: 'h4',
        content: 'Weeks 7-8: Dynamic Programming & Advanced Topics (18 problems)'
      },

      {
        type: 'list',
        items: ['<strong>Focus:</strong> DP, Backtracking, Advanced data structures', '<strong>Reality Check:</strong> DP is where most people struggle. Don\'t rush. Watch each visualization multiple times. Understanding ONE DP problem deeply beats superficially memorizing ten.']
      },


      {
        type: 'subheading',
        content: 'Daily Study Routine (2-3 hours)'
      },

      {
        type: 'list',
        items: [
          '<strong>Step 1 (20 min):</strong> Read the problem on LeetCode. Attempt it yourself for 15 minutes.',
          '<strong>Step 2 (30 min):</strong> Watch the algorithm visualization on AlgoLib.io. Pause at each step and understand WHY, not just WHAT.',
          '<strong>Step 3 (40 min):</strong> Code the solution from scratch WITHOUT looking. Get stuck? Go back to the visualization.',
          '<strong>Step 4 (20 min):</strong> Review time/space complexity. Can you explain it out loud?',
          '<strong>Step 5 (10 min):</strong> Note down the pattern and any edge cases you missed.'
        ]
      },

      {
        type: 'subheading',
        content: 'Common Mistakes (And How to Avoid Them)'
      },
      {
        type: 'list',
        items: [
          '<b>1:</b> Memorizing solutions instead of patterns. <strong>Fix:</strong> Ask "What pattern did this use?" after solving.',
          '<b> 2:</b> Rushing through easy problems. <strong>Fix:</strong> Easy ones teach fundamentals—master them first.',
          '<b> 3:</b> Skipping the "why" behind algorithms. <strong>Fix:</strong> Understand reasoning, not just syntax.',
          '<b>  4:</b> Not timing yourself. <strong>Fix:</strong> Simulate interviews with a timer.',
          '<b>  5:</b> Giving up too early. <strong>Fix:</strong> Watch visualizations, then retry from scratch.'
        ]
      },

      {
        type: 'heading',
        content: 'Is the Blind 75 Enough? (The Honest Answer)'
      },

      {
        type: 'paragraph',
        content: 'For most mid-level software engineering roles at FAANG and similar companies: <strong>Yes, the Blind 75 is enough.</strong>'
      },

      {
        type: 'paragraph',
        content: 'Countless engineers have landed offers at Google, Meta, Amazon, Microsoft, and Apple by mastering just these 75 problems. The key word is "mastering"—that means understanding the patterns so deeply that you can solve variations on the spot.'
      },

      {
        type: 'subheading',
        content: 'When You Might Need More:'
      },

      {
        type: 'list',
        items: [
          '<strong>Senior/Staff roles:</strong> Add system design prep and leadership questions',
          '<strong>Specialized domains:</strong> If applying for ML Engineer roles, add ML-specific problems',
          '<strong>Competitive programming background:</strong> If you find Blind 75 too easy, move to Blind 150 or company-specific problem sets',
          '<strong>Second interview rounds:</strong> After mastering these 75, practice on LeetCode\'s company-tagged problems for your target companies'
        ]
      },

      {
        type: 'heading',
        content: 'How AlgoLib.io Supercharges Your Preparation'
      },

      {
        type: 'paragraph',
        content: 'We built AlgoLib.io because we were frustrated with traditional learning methods. Reading algorithm explanations felt like trying to understand a movie by reading the script. We needed to SEE it happen.'
      },

      {
        type: 'subheading',
        content: 'What Makes AlgoLib.io Different:'
      },

      {
        type: 'list',
        items: [
          '<strong>72+ Algorithm Visualizations:</strong> Watch algorithms execute step-by-step with real-time animations',
          '<strong>Multi-Language Support:</strong> Code examples in Python, Java, C++, and TypeScript',
          '<strong>Direct LeetCode Links:</strong> One click from visualization to practice problem',
          '<strong>Complexity Analysis:</strong> Time and space complexity explained for every algorithm',
          '<strong>Interactive Controls:</strong> Pause, rewind, and replay at your own pace',
          '<strong>100% Free & Open Source:</strong> No paywalls, no subscriptions, forever free'
        ]
      },

      {
        type: 'paragraph',
        content: 'Whether you\'re a CS student prepping for your first interview, a self-taught developer breaking into tech, or an experienced engineer targeting FAANG, AlgoLib.io meets you where you are.'
      },

      {
        type: 'heading',
        content: 'Your Next Steps: Start Today'
      },

      {
        type: 'paragraph',
        content: 'The best time to start was yesterday. The second best time is right now. Here\'s your action plan:'
      },

      {
        type: 'list',
        items: [
          '<strong>Today:</strong> Pick one easy problem from the Two Pointers category. Watch it on AlgoLib.io, then solve it on LeetCode.',
          '<strong>This Week:</strong> Solve 3-5 problems using the same pattern. Notice how they\'re all variations of the same technique.',
          '<strong>This Month:</strong> Complete Weeks 1-2 of the study plan. You\'ll have Two Pointers and Sliding Window down cold.',
          '<strong>In 8 Weeks:</strong> You\'ll have mastered all 75 problems and the 7 core patterns. You\'ll be ready to interview anywhere.'
        ]
      },

      {
        type: 'paragraph',
        content: 'Remember: Every engineer who landed their dream job started exactly where you are now. The difference isn\'t talent—it\'s consistent, focused practice with the right resources.'
      },

      {
        type: 'cta',
        content: '🚀 Start Mastering the Blind 75 on AlgoLib.io',
        link: '/algorithms'
      },

      {
        type: 'heading',
        content: 'Frequently Asked Questions'
      },

      {
        type: 'h4',
        content: 'How long does it take to complete the Blind 75?'
      },

      {
        type: 'paragraph',
        content: 'Most people complete it in 3-8 weeks, depending on their starting level and time commitment. If you can dedicate 2-3 hours daily, aim for 6 weeks. If you\'re working full-time, 8-10 weeks is realistic.'
      },

      {
        type: 'h4',
        content: 'Do I need to know all data structures before starting?'
      },

      {
        type: 'paragraph',
        content: 'You should know the basics: arrays, strings, linked lists, stacks, queues, trees, and graphs. If you\'re rusty, AlgoLib.io has foundational visualizations to refresh your memory.'
      },

      {
        type: 'h4',
        content: 'What if I can\'t solve a problem after 30 minutes?'
      },

      {
        type: 'paragraph',
        content: 'This is normal, especially early on. Watch the AlgoLib.io visualization to understand the approach, then close it and implement from scratch. The struggle is part of learning.'
      },

      {
        type: 'h4',
        content: 'Should I do the problems in order?'
      },

      {
        type: 'paragraph',
        content: 'Follow the pattern-based order in our study plan. Starting with Two Pointers and Sliding Window builds confidence and teaches optimization thinking from day one.'
      },

      {
        type: 'h4',
        content: 'Can I use AlgoLib.io during actual interviews?'
      },

      {
        type: 'paragraph',
        content: 'No, but that\'s the point! AlgoLib.io trains your brain to visualize algorithms mentally. After watching enough visualizations, you\'ll be able to "run" algorithms in your head during real interviews.'
      },

      {
        type: 'heading',
        content: 'Final Thoughts: Pattern Recognition is Power'
      },

      {
        type: 'paragraph',
        content: 'The Blind 75 isn\'t magic. It\'s a systematic approach to learning the patterns that power 90% of coding interviews. Combined with AlgoLib.io\'s visual learning platform, you have everything you need to transform from interview anxiety to interview confidence.'
      },

      {
        type: 'paragraph',
        content: 'The journey won\'t always be easy. You\'ll get stuck. You\'ll feel frustrated. But every problem you struggle through is building the pattern recognition that makes the next problem easier. And one day—sooner than you think—you\'ll sit down for an interview, see a problem, and immediately recognize: "Oh, this is just Sliding Window with a HashMap. I got this."'
      },

      {
        type: 'paragraph',
        content: 'That\'s the moment everything changes. That\'s when you know you\'re ready.'
      },

      {
        type: 'paragraph',
        content: 'Your dream job is waiting. The Blind 75 is your roadmap. AlgoLib.io is your guide. All you need to do is start.'
      },

      {
        type: 'cta',
        content: 'Explore Blind 75  AlgoLib.io',
        link: '/blind75'
      }
    ]
  },

  {
    id: '2',
    slug: 'lru-cache-complete-guide',
    title: 'LRU Cache — The Complete Guide to the Most Popular Cache Algorithm',
    subtitle: 'Everything you need to know about the Least Recently Used cache — from intuition, implementation, and code to real-world systems and interview mastery.',
    description: 'A 4,000-word deep dive into LRU Cache: understand how caching works, why LRU is the backbone of performance optimization, and how to implement it efficiently using HashMaps and Doubly Linked Lists in multiple languages.',
    author: 'AlgoLib Team',
    date: '2025-02-14',
    readTime: '35 min read',
    category: 'System Design & Data Structures',
    tags: ['LRU Cache', 'System Design', 'Caching', 'HashMap', 'Doubly Linked List', 'Performance', 'Algorithms'],
    thumbnail: '/blog/lru/hero.png',
    image: '/blog/lru/hero.png',

    content: [
      {
        type: 'paragraph',
        content:
          'Caching is one of the most underrated but crucial concepts in computer science. Whether you are loading a web page, querying a database, or rendering a mobile app, caching determines how fast your system feels. The LRU Cache — or Least Recently Used Cache — is one of the simplest yet most powerful cache replacement policies that every engineer must understand deeply.'
      },
      {
        type: 'paragraph',
        content:
          'In this article, we’ll explore the complete picture of LRU Cache: the intuition behind it, how it achieves constant-time lookups and updates, its use in real systems like Redis and operating systems, and multiple code implementations with detailed visual explanations. By the end, you’ll not only be able to code it from scratch but also design distributed caching layers with confidence.'
      },

      {
        type: 'heading',
        content: '1. Why Do We Need Caches?'
      },
      {
        type: 'paragraph',
        content:
          'Modern computing is all about speed — but memory access is hierarchical. Accessing data from CPU cache takes nanoseconds, from RAM takes microseconds, and from disk or network may take milliseconds. Caches bridge this speed gap by keeping frequently accessed data closer to the CPU or application logic.'
      },
      {
        type: 'list',
        items: [
          ' Reduce latency by serving hot data instantly.',
          'Avoid recomputation or refetching expensive results.',
          ' Improve scalability by reducing backend load.',
          'Provide smoother user experiences for repeated operations.'
        ]
      },
      {
        type: 'paragraph',
        content:
          'However, since cache memory is limited, we cannot store everything. We need a smart policy to decide what stays and what gets evicted when new data arrives.'
      },

      {
        type: 'subheading',
        content: 'Cache Eviction Policies Overview'
      },
      {
        type: 'paragraph',
        content:
          'A cache eviction policy defines which item to remove when the cache is full. There are several well-known strategies:'
      },
      {
        type: 'list',
        items: [
          '<strong>FIFO (First In, First Out):</strong> Remove the oldest inserted item first.',
          '<strong>Random Replacement:</strong> Evict a random item — simple but inefficient.',
          '<strong>LFU (Least Frequently Used):</strong> Evict the least accessed item.',
          '<strong>LRU (Least Recently Used):</strong> Evict the item that has not been accessed recently.'
        ]
      },

      {
        type: 'paragraph',
        content:
          'Among these, LRU strikes the best balance between efficiency, simplicity, and predictability — making it the most widely adopted algorithm for cache management.'
      },

      {
        type: 'subheading',
        content: 'What Is LRU Cache Exactly?'
      },
      {
        type: 'paragraph',
        content:
          'An LRU Cache is a data structure that stores a limited number of key–value pairs and removes the least recently used element when capacity is exceeded. It ensures that frequently accessed data remains quickly retrievable while discarding items that haven’t been used in a while.'
      },
      {
        type: 'list',
        items: [
          'Constant-time O(1) operations for insertion, deletion, and lookup.',
          'Always evicts the oldest accessed item when capacity is full.',
          'Combines a <strong>HashMap</strong> for lookups and a <strong>Doubly Linked List</strong> for tracking recency.'
        ]
      },
      {
        type: 'image',
        content: '/blog/lru/basic.png'
      },

      {
        type: 'subheading',
        content: 'Real-World Analogy — The Study Desk Example'
      },
      {
        type: 'paragraph',
        content:
          'Imagine you have a small study desk that can hold only three books at once. When you start reading, you pick up a few books and place them on your desk. As you continue studying, you refer to some books more frequently and ignore others. If you now want to open a fourth book but the desk is full, what do you do?'
      },
      {
        type: 'paragraph',
        content:
          'Naturally, you remove the book you haven’t touched for the longest time — that’s your least recently used one. The new book replaces it. This is precisely how LRU Cache behaves with your data.'
      },

      {
        type: 'heading',
        content: '2. Internal Data Structures'
      },
      {
        type: 'paragraph',
        content:
          'The magic of O(1) performance in LRU Cache comes from combining two data structures:'
      },
      {
        type: 'list',
        items: [
          '<strong>HashMap:</strong> Stores the mapping of keys to their nodes for direct access.',
          '<strong>Doubly Linked List:</strong> Maintains ordering from most recently used (head) to least recently used (tail).'
        ]
      },

      {
        type: 'paragraph',
        content:
          'When you access or insert a key, the corresponding node moves to the front of the linked list. When capacity is full, the node at the tail (least recently used) is removed.'
      },
      {
        type: 'image',
        content: '/blog/lru/internal-structure.png'
      },

      {
        type: 'subheading',
        content: ' Core Operations Explained'
      },
      {
        type: 'list',
        items: [
          '<strong>get(key):</strong> Retrieve value if it exists. Move the node to the head because it was just used.',
          '<strong>put(key, value):</strong> Insert or update key–value pair. If capacity exceeds, remove the tail node.'
        ]
      },
      {
        type: 'paragraph',
        content:
          'Both operations take O(1) time because the HashMap provides constant-time lookups and the linked list provides constant-time removals and insertions at head or tail.'
      },

      {
        type: 'heading',
        content: '3. Step-By-Step Example'
      },
      {
        type: 'paragraph',
        content:
          'Let’s simulate a cache with capacity = 3 and sequence of operations:'
      },
      {
        type: 'list',
        items: [
          '<strong>put(1, A)</strong> → Cache: [1:A]',
          '<strong>put(2, B)</strong> → Cache: [2:B, 1:A]',
          '<strong>put(3, C) </strong>→ Cache: [3:C, 2:B, 1:A]',
          '<strong>get(2)</strong> → Cache: [2:B, 3:C, 1:A]',
          '<strong>put(4, D)</strong> → Evict least recently used (1:A) → Cache: [4:D, 2:B, 3:C]'
        ]
      },
      {
        type: 'paragraph',
        content:
          'Notice how each access or insertion updates the recency order, keeping the most recent element at the front.'
      },

      {
        type: 'heading',
        content: 'Implementation From Scratch (Python)'
      },
      {
        type: 'code',
        language: 'python',
        content: `class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def _add(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add(node)
        return node.value

    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
`
      },

      {
        type: 'h4',
        content: 'Time & Space Complexity'
      },
      {
        type: 'list',
        items: [
          '<strong>get()</strong>  → O(1)',
          '<strong> put()</strong> → O(1)',
          '<strong>Space Complexity</strong> → O(capacity)'
        ]
      },

      {
        type: 'h4',
        content: 'Implementation in JavaScript'
      },
      {
        type: 'code',
        language: 'javascript',
        content: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
`},

      {
        type: 'heading',
        content: '4. Visualization with AlgoLib.io'
      },
      {
        type: 'paragraph',
        content:
          'Visualizing the LRU cache makes its mechanism intuitive. In AlgoLib.io’s animation:'
      },

      {
        type: 'list',
        items: [
          'Each node represents a key–value pair connected via arrows.',
          'When get() is called, the accessed node moves to the left (most recent).',
          'When put() inserts a new key, it appears on the left, and if full, the rightmost node fades out (evicted).',
          'The animation highlights constant-time operations clearly, showing why the linked list + hashmap design is optimal.'
        ]
      },

      {
        type: 'image',
        content: '/blog/lru/lru-cache-viz.png'
      },

      {
        type: 'cta',
        content: 'Explore the LRU Cache Visualization on AlgoLib.io',
        link: '/algorithm/lru-cache'
      },

      {
        type: 'subheading',
        content: 'Variations & Alternatives'
      },
      {
        type: 'list',
        items: [
          '<strong>MRU (Most Recently Used):</strong> Evicts the most recently accessed item — opposite of LRU.',
          '<strong>LFU (Least Frequently Used):</strong> Tracks frequency instead of recency — used in databases.',
          '<strong>2Q Cache:</strong> Maintains two queues (new and frequent) for better adaptation.',
          '<strong>ARC (Adaptive Replacement Cache):</strong> Hybrid of LRU and LFU used in enterprise file systems like ZFS.'
        ]
      },

      {
        type: 'subheading',
        content: 'Real-World Applications'
      },
      {
        type: 'list',
        items: [
          ' <strong>CPU Cache:</strong> Decides which memory blocks to evict from fast L1/L2 caches.',
          ' <strong>Web Browsers:</strong> Remove old pages or images as new ones load.',
          '<strong>Operating Systems:</strong> Virtual memory page replacement.',
          ' <strong>Databases:</strong> Query and result caching (MySQL, PostgreSQL).',
          '<strong>Redis:</strong> Uses LRU-based eviction in its "maxmemory-policy" setting.'
        ]
      },

      {
        type: 'heading',
        content: '5. Common Interview Questions'
      },
      {
        type: 'list',
        items: [
          'Implement an LRU Cache from scratch.',
          'How do you achieve O(1) get() and put()?',
          'Explain difference between LRU and LFU.',
          'How would you scale an LRU cache across multiple servers?',
          'What happens in a distributed caching system when eviction occurs?'
        ]
      },

      {
        type: 'heading',
        content: '6. LRU in System Design'
      },
      {
        type: 'paragraph',
        content:
          'In system design interviews, caching is critical. LRU fits well in any tier where limited high-speed memory must store a subset of data. Examples:'
      },
      {
        type: 'list',
        items: [
          '📦 CDN edge servers caching recently requested static assets.',
          '🧰 Microservice data caching layer (in-memory LRU).',
          '⚙️ Database read-through cache for hot queries.',
          '📱 Mobile applications caching images or API responses locally.'
        ]
      },

      {
        type: 'h4',
        content: 'Common Pitfalls in Implementation'
      },
      {
        type: 'list',
        items: [
          'Forgetting to move accessed nodes to head — breaks recency tracking.',
          'Not removing tail node on overflow — leads to incorrect capacity behavior.',
          'Removing from HashMap but not from list (or vice versa).',
          'Using singly linked list — O(n) removal instead of O(1).',
          ' Overcomplicating structure when capacity = 0.'
        ]
      },

      {
        type: 'heading',
        content: '7. Beyond the Basics — Distributed LRU Cache'
      },
      {
        type: 'paragraph',
        content:
          'In large-scale systems, a single LRU cache instance may not be enough. Distributed caches partition data across nodes while maintaining local LRU policies. Frameworks like <strong>Redis Cluster</strong> or <strong>Memcached</strong> use consistent hashing and per-node eviction. Designing such systems involves trade-offs between consistency, load balancing, and latency.'
      },

      {
        type: 'heading',
        content: '8. Performance Considerations'
      },
      {
        type: 'list',
        items: [
          'LRU is optimal when recent access predicts future access (temporal locality).',
          'In purely random workloads, it may behave close to FIFO.',
          'For I/O-intensive systems, LRU ensures that hot data remains in memory while stale data gets flushed.',
          'Hybrid policies (like LRU + TTL) can combine temporal freshness with recency tracking.'
        ]
      },

      {
        type: 'heading',
        content: '9. Code Extensions — Thread-Safe LRU'
      },
      {
        type: 'paragraph',
        content:
          'In multi-threaded environments, access to the cache must be synchronized. In Python, you can use <code>threading.Lock()</code> or in JavaScript, an atomic design pattern to ensure thread safety. In Java, you can wrap LRU logic with <code>Collections.synchronizedMap()</code> or use <code>ConcurrentLinkedHashMap</code>.'
      },

      {
        type: 'heading',
        content: '10. Why Visual Learning Matters'
      },
      {
        type: 'paragraph',
        content:
          'Understanding LRU conceptually is good, but seeing it in action cements the knowledge. Visual tools like AlgoLib.io allow you to interact with algorithms — pausing, rewinding, and exploring step-by-step execution. Watching nodes move as operations occur gives you the spatial intuition you can recall instantly in interviews.'
      },

      {
        type: 'heading',
        content: 'Final Thoughts'
      },
      {
        type: 'paragraph',
        content:
          'The LRU Cache exemplifies elegant algorithmic engineering — achieving perfect balance between recency, performance, and memory usage. It’s a cornerstone of real-world system design, and mastering it will sharpen your understanding of how software performance scales. Once you truly internalize the pattern, you’ll start recognizing LRU-like mechanisms everywhere — in browsers, in APIs, even in your own code.'
      },


    ]
  },
  {
    "id": "3",
    "slug": "dynamic-programming-for-people-who-hate-dynamic-programming",
    "title": "Dynamic Programming for People Who Hate Dynamic Programming",
    "subtitle": "Understand DP using visuals, animations, and real intuitive examples — not confusing formulas.",
    "description": "A beginner-friendly, visually driven guide to Dynamic Programming (DP). Learn why DP feels hard, how to identify DP problems instantly, and how animations on AlgoLib.io make them simple to understand.",
    "author": "AlgoLib Team",
    "date": "2025-01-18",
    "readTime": "7 min read",
    "category": "Algorithms",
    "tags": ["Dynamic Programming", "DP", "Visual Learning", "DSA", "Coding Interview", "Algolib", "LeetCode"],
    "thumbnail": "/blog/3/hero.png",
    "image": "/blog/3/hero.png",

    "content": [
      {
        type: 'heading',
        content: 'Introduction: You’re Not Alone (Most People Hate DP)'

      },
      {
        type: 'paragraph',
        content: '<strong>Why?</strong> <br> Because DP is invisible.'

      },
      {
        type: 'paragraph',
        content: '<italic>You don’t <b>“see”</b> the transitions, the states, or the recursion trees expanding.Everything happens in your head — and that’s exactly why people avoid it.</italic>'

      },

      {
        type: 'paragraph',
        content: 'But here’s the good news:'

      },
      {
        type: 'paragraph',
        content: 'DP becomes insanely easy when you visualize it.'
      },

      {
        type: 'list',
        items: [

          'Instead of formulas, you see the recursion tree.',
          'Instead of jumping lines, you see transitions.',
          'Instead of guessing states, you see animations.',

        ]

      },
      {
        type: 'paragraph',
        content: 'This article will teach DP using simple visuals and practical examples — not theory.'
      },
      {
        "type": "paragraph",
        "content": "Dynamic Programming (DP) is infamous for being one of the most frustrating topics in coding interviews. Most people avoid it because DP is invisible — you can’t see the states, transitions, or recursion tree. Everything happens in your head, and that makes it feel impossible."
      },
      {
        "type": "paragraph",
        "content": "But here’s the secret: DP becomes simple when you can visualize it. Instead of memorizing formulas, you see the recursion expanding, the repeated subproblems, and the DP table building step by step. This blog makes DP so intuitive that even absolute beginners can understand it."
      },

      {
        "type": "heading",
        "content": "Why Dynamic Programming Feels Hard"
      },
      {
        "type": "paragraph",
        "content": "Most learners struggle with DP for four very simple reasons: imagination, confusing definitions, unreadable tutorials, and hidden transitions."
      },

      {
        "type": "subheading",
        "content": "1. DP requires imagination"
      },
      {
        "type": "paragraph",
        "content": "To understand recursion + memoization, you have to visualize how the recursion tree grows. Without visuals, everything feels abstract and overwhelming."
      },
      {
        "type": "image",
        "content": '/blog/patterns/coin-change.png',
        "link": "https://algolib.io",
        "large": false
      },
      {
        "type": "cta",
        link: '/algorithm/coin-change',
        content: 'Visualize Coin Change on AlgoLib.io'

      },


      {
        "type": "subheading",
        "content": "2. Definitions are confusing"
      },
      {
        "type": "paragraph",
        "content": "Terms like overlapping subproblems or optimal substructure sound scientific. In reality, they're simple ideas: don’t recompute work, and build answers from smaller pieces."
      },

      {
        "type": "subheading",
        "content": "3. Tutorial code hides the thought process"
      },
      {
        "type": "paragraph",
        "content": "Most articles show the final DP solution, skipping the reasoning that leads to it. Without the steps, learners feel lost."
      },

      {
        "type": "subheading",
        "content": "4. Transitions are not visually explained"
      },
      {
        "type": "paragraph",
        "content": "The most important part of DP is understanding how to move from one state to another. Unfortunately, tutorials rarely show transitions visually."
      },

      {
        "type": "heading",
        "content": "The Core Idea of DP in One Simple Line"
      },
      {
        "type": "quote",
        "content": "Dynamic Programming = Recursion + Memory + Visual Patterns"
      },

      {
        "type": "paragraph",
        "content": "If a problem can be solved using recursion, but recursion repeats work, then DP is simply the optimized version of that recursion — with memory and structure."
      },

      {
        "type": "heading",
        "content": "Why You Should Avoid Recursion in Fibonacci"
      },
      {
        "type": "paragraph",
        "content": "Fibonacci is the perfect example of why plain recursion becomes extremely slow. The recursive formula looks simple: f(n) = f(n-1) + f(n-2). But the moment you try to compute even f(40), your program becomes painfully slow. Why? Because recursion repeats the same calculations thousands of times."
      },
      {
        "type": "subheading",
        "content": "The Problem: Exponential Explosion"
      },
      {
        "type": "paragraph",
        "content": "Each recursive call splits into two more calls. Those calls again split into two more. This creates a massive recursion tree where the same values (like f(3), f(4), f(5)) get computed again and again. This leads to an exponential time complexity: O(2^n)."
      },

      {
        "type": "paragraph",
        "content": "For example, while computing f(6), recursion computes f(3) three separate times. For f(40), the number of repeated calculations rises to millions. This is why naive recursion is extremely inefficient and should be avoided for Fibonacci."
      },
      {
        "type": "subheading",
        "content": "Proof With Code"
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "function fib(n: number): number {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2); // Repeated work!\n}\n\nconsole.time('fib40');\nconsole.log(fib(40)); // Slow\nconsole.timeEnd('fib40');"
      },
      {
        "type": "paragraph",
        "content": "This code works, but it grows extremely slow when n increases. It wastes time recomputing the same values over and over."
      },
      {
        "type": "subheading",
        "content": "The Fix: Memoization (Top-Down DP)"
      },
      {
        "type": "paragraph",
        "content": "Memoization stores previously calculated Fibonacci values so they don't repeat. This turns the complexity from O(2^n) to O(n)."
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "const memo: Record<number, number> = {};\n\nfunction fibMemo(n: number): number {\n  if (n <= 1) return n;\n  if (memo[n] !== undefined) return memo[n];\n  memo[n] = fibMemo(n - 1) + fibMemo(n - 2);\n  return memo[n];\n}\n\nconsole.time('fib40_memo');\nconsole.log(fibMemo(40)); // Fast\nconsole.timeEnd('fib40_memo');"
      },
      {
        "type": "paragraph",
        "content": "With memoization, each Fibonacci number is calculated only once. This dramatically speeds up execution and removes repeated branching from the recursion tree."
      },
      {
        "type": "cta",
        "content": "See the recursion tree and memoization animation for Fibonacci on AlgoLib.io",
        "link": "https://algolib.io"
      },



      {
        "type": "heading",
        "content": "How to Instantly Identify a DP Problem"
      },
      {
        "type": "paragraph",
        "content": "Use this simple formula: If a problem can be broken into choices and consequences, it's almost always DP. Here’s a quick checklist:"
      },
      {
        "type": "list",
        "items": [
          "Can the problem be expressed in terms of subproblems?",
          "Do you see repeated calculations?",
          "Does the final answer depend on previously calculated results?",
          "Can you express the logic recursively?"
        ]
      },

      {
        "type": "heading",
        "content": "Why Visualizing DP Makes It 10× Easier"
      },
      {
        "type": "paragraph",
        "content": "AlgoLib.io makes DP simple by visually showing: recursion expansion, duplicate calls, memoization blocking repeated work, and DP tables filling cell-by-cell. This converts abstract theory into something you can SEE happening."
      },
      {
        "type": "image",
        "alt": "DP Visualization",
        "content": '/blog/common/house-robber.png',
        "caption": "House Robber Visualization ",
        "large": true
      },
      {
        "type": 'cta',
        "content": 'House robber visualization on AlgoLib.io',
        "link": '/algorithm/house-robber'
      },

      {
        "type": "heading",
        "content": "Why You Should Avoid Recursion in Fibonacci"
      },
      {
        "type": "paragraph",
        "content": "Fibonacci is the perfect example of why plain recursion becomes extremely slow. The recursive formula looks simple: f(n) = f(n-1) + f(n-2). But the moment you try to compute even f(40), your program becomes painfully slow. Why? Because recursion repeats the same calculations thousands of times."
      },
      {
        "type": "subheading",
        "content": "The Problem: Exponential Explosion"
      },
      {
        "type": "paragraph",
        "content": "Each recursive call splits into two more calls. Those calls again split into two more. This creates a massive recursion tree where the same values (like f(3), f(4), f(5)) get computed again and again. This leads to an exponential time complexity: O(2^n)."
      },
      {
        "type": "image",
        "alt": "Fib Simulation",
        "content": "/blog/common/fib-stack.png",
        "large": false
      },
      {
        "type": "paragraph",
        "content": "For example, while computing f(6), recursion computes f(3) three separate times. For f(40), the number of repeated calculations rises to millions. This is why naive recursion is extremely inefficient and should be avoided for Fibonacci."
      },
      {
        "type": "subheading",
        "content": "Proof With Code"
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "function fib(n: number): number {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2); // Repeated work!\n}\n\nconsole.time('fib40');\nconsole.log(fib(40)); // Slow\nconsole.timeEnd('fib40');"
      },
      {
        "type": "paragraph",
        "content": "This code works, but it grows extremely slow when n increases. It wastes time recomputing the same values over and over."
      },
      {
        "type": "subheading",
        "content": "The Fix: Memoization (Top-Down DP)"
      },
      {
        "type": "paragraph",
        "content": "Memoization stores previously calculated Fibonacci values so they don't repeat. This turns the complexity from O(2^n) to O(n)."
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "const memo: Record<number, number> = {};\n\nfunction fibMemo(n: number): number {\n  if (n <= 1) return n;\n  if (memo[n] !== undefined) return memo[n];\n  memo[n] = fibMemo(n - 1) + fibMemo(n - 2);\n  return memo[n];\n}\n\nconsole.time('fib40_memo');\nconsole.log(fibMemo(40)); // Fast\nconsole.timeEnd('fib40_memo');"
      },
      {
        "type": "paragraph",
        "content": "With memoization, each Fibonacci number is calculated only once. This dramatically speeds up execution and removes repeated branching from the recursion tree."
      },

      {
        "type": "heading",
        "content": "Let's Solve a Real DP Example: 0/1 Knapsack"
      },
      {
        "type": "paragraph",
        "content": "You are given weights and values of items, and a knapsack with limited capacity. You must maximize value by choosing items — but each item can be taken only once (0/1 choice)."
      },

      {
        "type": "subheading",
        "content": "Step 1: Think Recursively – The Choice"
      },
      {
        "type": "paragraph",
        "content": "For each item, you have two choices: include it or skip it. This choice-based structure is the foundation of DP."
      },
      {
        "type": "paragraph",
        "content": "Imagine you're going backpacking, but your backpack (the 'knapsack') can only hold a certain amount of weight. You have a pile of items, each with a different weight and a different personal value to you (e.g., a heavy book might be less valuable than a light, warm jacket)."
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "knapsack(i, capacity) = max(\n  value[i] + knapsack(i - 1, capacity - weight[i]), // include\n  knapsack(i - 1, capacity)                          // skip\n)"
      },



      {
        "type": "subheading",
        "content": "Step 2: Memoize to Remove Repeated Work"
      },
      {
        "type": "paragraph",
        "content": "Knapsack has huge overlapping subproblems. Memoization caches results so repeated states are instantly returned."
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "const dp = Array(n + 1).fill(null).map(() => Array(cap + 1).fill(-1));\nfunction knapsack(i, cap) {\n  if (i === 0 || cap === 0) return 0;\n  if (dp[i][cap] !== -1) return dp[i][cap];\n\n  if (weight[i] > cap) {\n    return dp[i][cap] = knapsack(i - 1, cap);\n  }\n\n  const include = value[i] + knapsack(i - 1, cap - weight[i]);\n  const skip = knapsack(i - 1, cap);\n\n  return dp[i][cap] = Math.max(include, skip);\n}"
      },


      {
        "type": "subheading",
        "content": "Step 3: Convert to Bottom-Up DP Table"
      },
      {
        "type": "paragraph",
        "content": "Bottom-up DP builds the solution iteratively. Each cell dp[i][c] represents the best value using first i items and capacity c."
      },
      {
        "type": "code",
        "language": "typescript",
        "content": "function knapsack(weights, values, cap) {\n  const n = weights.length;\n  const dp = Array(n + 1).fill(null).map(() => Array(cap + 1).fill(0));\n\n  for (let i = 1; i <= n; i++) {\n    for (let c = 1; c <= cap; c++) {\n      if (weights[i - 1] <= c) {\n        const include = values[i - 1] + dp[i - 1][c - weights[i - 1]];\n        const skip = dp[i - 1][c];\n        dp[i][c] = Math.max(include, skip);\n      } else {\n        dp[i][c] = dp[i - 1][c];\n      }\n    }\n  }\n  return dp[n][cap];\n}"
      },

      {
        "type": "image",
        "alt": "Knapsack DP algo",
        "caption": "Knapsack AlgoLib.io simulation ",
        "content": "/blog/common/knaps.png",
        "large": false
      },
      {
        type: 'cta',
        content: 'Learn Knapsack Algo by visualizing on AlgoLib.io',
        link: '/algorithm/knapsack-01'
      },







      {
        "type": "heading",
        "content": "The Only 5 DP Patterns You Ever Need"
      },
      {
        "type": "list",
        "items": [
          "Prefix/Suffix DP (Max subarray, House Robber)",
          "Knapsack / Choices DP (Pick or skip items)",
          "Subsequence DP (LCS, LIS, Edit Distance)",
          "DP on Grids (Paths, minimum cost, obstacles)",
          "DP on Trees / Graphs (Tree DP, DAG DP)"
        ]
      },
      {
        "type": "cta",
        "content": "Max subarray visualization on AlgoLib.io",
        "link": '/blind75/maximum-subarray'
      },

      {
        "type": "cta",
        "content": "Knapsack Algo visualization on AlgoLib.io",
        "link": '/algorithm/knapsack-01'
      },

      {
        "type": "cta",
        "content": "Longest common subsequence visualization on AlgoLib.io",
        "link": '/blind75/longest-common-subsequence'
      },


      {
        "type": "cta",
        "content": "Check all dynamic problems on AlgoLib.io",
        "link": '/blind75/longest-common-subsequence'
      },

      {
        "type": "heading",
        "content": "How AlgoLib.io Helps You Master DP"
      },
      {
        "type": "paragraph",
        "content": "Algolib.io takes DP to another level with interactive visualizations:"
      },
      {
        "type": "list",
        "items": [
          "Step-by-step code execution",
          "Recursion tree expansion and collapse",
          "Memoization highlights",
          "DP table animations",
          "Multi-language code (Java, JS, TS, Python, C++)",
          "NeetCode-style walkthroughs + your own visual layers"
        ]
      },

      {
        "type": "cta",
        "content": "Try any Dynamic Programming problem now on AlgoLib.io and see the code come alive.",
        "link": "https://algolib.io"
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