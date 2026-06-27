import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { AlgorithmListItem } from '@/types/algorithm';
import { ProgressStatus } from '@/store/slices/userProgressSlice';

export interface RecommendedProblem {
  algorithm: AlgorithmListItem;
  reason: string;
  confidence?: string;
}

const getDifficultyRank = (difficulty?: string) => {
  if (!difficulty) return 2;
  const normalized = difficulty.toLowerCase();
  if (['easy', 'beginner', 'beginners', 'begineers'].includes(normalized)) return 1;
  if (['medium', 'intermediate', 'intermeditate', 'intermediated'].includes(normalized)) return 2;
  if (['hard', 'advance', 'advanced', 'advacned', 'expert'].includes(normalized)) return 3;
  return 2;
};

export const useRecommendedProblems = (algorithms: AlgorithmListItem[]): RecommendedProblem[] => {
  const { data: userProgressData, progressMap } = useAppSelector(state => state.userProgress);

  return useMemo(() => {
    if (!algorithms || algorithms.length === 0) return [];

    const availableAlgorithms = algorithms;
    const solvedIds = Object.keys(progressMap).filter(id => progressMap[id] === 'solved');
    const solvedCount = solvedIds.length;
    
    // Check if user has solved any hard problems to determine if we should suggest them
    const hasSolvedHard = solvedIds.some(id => {
      const algo = availableAlgorithms.find(a => a.id === id);
      return algo && getDifficultyRank(algo.difficulty) === 3;
    });

    if (solvedCount === 0) {
      // 2 beginner-friendly problems
      const easyProblems = availableAlgorithms
        .filter(a => getDifficultyRank(a.difficulty) === 1)
        .sort((a, b) => (a.serial_no || 999) - (b.serial_no || 999));
        
      return easyProblems.slice(0, 2).map(algo => ({
        algorithm: algo,
        reason: '🎯 Beginner-friendly: Start your coding journey here.',
        confidence: 'Highly Recommended',
      }));
    }

    const recommendations: RecommendedProblem[] = [];
    const recommendedIds = new Set<string>();

    const addRecommendation = (algo: AlgorithmListItem | undefined, reason: string, confidence: string) => {
      if (algo && !recommendedIds.has(algo.id) && progressMap[algo.id] !== 'solved') {
        recommendations.push({ algorithm: algo, reason, confidence });
        recommendedIds.add(algo.id);
      }
    };

    // Unsolved problems, filtering out Hards if user hasn't solved any yet
    const unsolvedProblems = availableAlgorithms.filter(a => {
      if (progressMap[a.id] === 'solved') return false;
      if (!hasSolvedHard && getDifficultyRank(a.difficulty) === 3) return false;
      return true;
    });
    
    if (unsolvedProblems.length === 0) return [];

    const sortedProgress = [...userProgressData]
      .filter(p => p.completed && p.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

    // 1. Continue Your Journey
    if (sortedProgress.length > 0) {
      const lastSolvedId = sortedProgress[0].algorithm_id;
      const lastSolvedAlgo = availableAlgorithms.find(a => a.id === lastSolvedId);
      
      if (lastSolvedAlgo) {
        const nextInSequence = unsolvedProblems
          .filter(a => (a.serial_no || 999) > (lastSolvedAlgo.serial_no || 0))
          .sort((a, b) => (a.serial_no || 999) - (b.serial_no || 999))[0];
          
        if (nextInSequence) {
          addRecommendation(
            nextInSequence,
            `You solved ✓ ${lastSolvedAlgo.title || lastSolvedAlgo.name}! Keep your momentum going.`,
            'Best Next Step'
          );
        }
      }
    }

    // 2. Strengthen Weak Areas (Avoid frustrating level-ups, focus on breadth)
    const categoryStats: Record<string, { total: number; solved: number }> = {};
    availableAlgorithms.forEach(algo => {
      if (!algo.category) return;
      const cats = algo.category.split(',').map(c => c.trim());
      cats.forEach(c => {
        if (!categoryStats[c]) categoryStats[c] = { total: 0, solved: 0 };
        categoryStats[c].total++;
        if (progressMap[algo.id] === 'solved') {
          categoryStats[c].solved++;
        }
      });
    });

    let weakestCategory = '';
    let lowestRate = 1.1;
    
    Object.entries(categoryStats).forEach(([cat, stats]) => {
      if (stats.total > 0 && stats.solved > 0 && stats.solved < stats.total) {
        const rate = stats.solved / stats.total;
        if (rate < lowestRate) {
          lowestRate = rate;
          weakestCategory = cat;
        }
      }
    });

    if (weakestCategory && recommendations.length < 2) {
      // Find easiest available problem in this category to build confidence
      const weakProblem = unsolvedProblems
        .filter(a => a.category && a.category.split(',').map(c=>c.trim()).includes(weakestCategory))
        .sort((a, b) => {
          const diffDiff = getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty);
          if (diffDiff !== 0) return diffDiff;
          return (a.serial_no || 999) - (b.serial_no || 999);
        })[0];
        
      if (weakProblem) {
        // Construct smart, personal explanation
        const solvedCats = Object.entries(categoryStats)
          .filter(([_, stats]) => stats.solved > 0)
          .sort((a, b) => b[1].solved - a[1].solved)
          .map(([cat]) => cat);

        const highCompletionCat = Object.entries(categoryStats)
          .map(([cat, stats]) => ({ cat, percent: Math.round((stats.solved / stats.total) * 100) }))
          .filter(item => item.percent >= 50 && item.percent < 100)
          .sort((a, b) => b.percent - a.percent)[0];

        let personalizedReason = `💪 Practice more ${weakestCategory}`;
        if (highCompletionCat) {
          personalizedReason = `You've completed ${highCompletionCat.percent}% of ${highCompletionCat.cat}. Time to start ${weakestCategory}!`;
        } else if (solvedCats.length >= 2) {
          personalizedReason = `Because you've solved ✓ ${solvedCats[0]} and ✓ ${solvedCats[1]}, ${weakestCategory} is your next step.`;
        } else if (solvedCats.length === 1) {
          personalizedReason = `Because you've solved ✓ ${solvedCats[0]}, let's tackle ${weakestCategory} next.`;
        }

        addRecommendation(weakProblem, personalizedReason, '95% Match');
      }
    }

    // Fill up to 2
    if (recommendations.length < 2) {
      const remainingUnsolved = unsolvedProblems
        .filter(a => !recommendedIds.has(a.id))
        .sort((a, b) => (a.serial_no || 999) - (b.serial_no || 999));
        
      for (const algo of remainingUnsolved) {
        if (recommendations.length >= 2) break;
        addRecommendation(algo, `Recommended for your skill level`, '90% Match');
      }
    }

    return recommendations.slice(0, 2);
  }, [algorithms, userProgressData, progressMap]);
};
