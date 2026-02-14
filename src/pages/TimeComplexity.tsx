
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Server, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import ComplexityCard from '@/components/complexity/ComplexityCard';
import { 
  ConstantTimeAnim, 
  LinearAnim, 
  LogarithmicAnim, 
  QuadraticAnim, 
  LinearithmicAnim 
} from '@/components/complexity/animations';

const TimeComplexity = () => {
  const [n, setN] = useState<Record<string, number>>({
    'O(1)': 10,
    'O(log n)': 16,
    'O(n)': 20,
    'O(n log n)': 10,
    'O(n^2)': 5
  });

  const handleNChange = (type: string, val: number) => {
    setN(prev => ({ ...prev, [type]: val }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-600/20 via-primary/10 to-green-600/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="container relative z-10 flex flex-col items-center text-center p-4">
          <Link to="/" className="absolute top-4 left-4 md:left-12">
             <Button variant="ghost" className="gap-2">
               <ArrowLeft className="w-4 h-4" /> Back to Home
             </Button>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent"
          >
            Time & Space Complexity
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-2xl"
          >
            A visual guide to understanding algorithm performance through interactive animations.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 grid gap-8">
        
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Time Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              How the running time of an algorithm increases as the size of the input (N) increases. It's not about seconds, but about operations.
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Space Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              How much extra memory an algorithm needs as the input size grows. Efficient algorithms use minimal extra space.
            </CardContent>
          </Card>
        </div>

        {/* Complexity Sections */}
        <div className="space-y-12 mt-8">
            <ComplexityCard 
                type="O(1)" 
                n={n['O(1)']}
                onNChange={(val) => handleNChange('O(1)', val)}
                animationComponent={<ConstantTimeAnim n={n['O(1)']} />}
                exampleCode={`function getFirstElement(arr) {
  // Always takes 1 step
  return arr[0]; 
}`}
            />

            <ComplexityCard 
                type="O(log n)" 
                n={n['O(log n)']}
                onNChange={(val) => handleNChange('O(log n)', val)}
                animationComponent={<LogarithmicAnim n={n['O(log n)']} />}
                exampleCode={`function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    // Halves the search space each step
    if (arr[mid] === target) return mid;
    // ...
  }
}`}
            />

            <ComplexityCard 
                type="O(n)" 
                n={n['O(n)']}
                onNChange={(val) => handleNChange('O(n)', val)}
                animationComponent={<LinearAnim n={n['O(n)']} />}
                exampleCode={`function findMax(arr) {
  let max = -Infinity;
  // Must check every element once
  for (let num of arr) {
    if (num > max) max = num;
  }
  return max;
}`}
            />

             <ComplexityCard 
                type="O(n log n)" 
                n={n['O(n log n)']}
                onNChange={(val) => handleNChange('O(n log n)', val)}
                animationComponent={<LinearithmicAnim n={n['O(n log n)']} />}
                exampleCode={`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  // Split (log n) + Merge (n)
  const mid = Math.floor(arr.length / 2);
  // ... recursive calls ...
}`}
            />

            <ComplexityCard 
                type="O(n^2)" 
                n={n['O(n^2)']}
                onNChange={(val) => handleNChange('O(n^2)', val)}
                animationComponent={<QuadraticAnim n={n['O(n^2)']} />}
                exampleCode={`function hasDuplicate(arr) {
  // Nested loops = n * n steps
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i] === arr[j]) return true;
    }
  }
  return false;
}`}
            />

        </div>

        {/* Footer */}
        <div className="py-12 text-center text-muted-foreground">
          <p>Understanding complexity helps you write scalable code.</p>
        </div>
      </div>
    </div>
  );
};

export default TimeComplexity;
