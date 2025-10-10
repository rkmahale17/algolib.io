import { ArrowLeft, BookOpen, Code2, ExternalLink, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
// src/pages/AlgorithmDetail.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AlgoMetaHead from '@/services/meta.injectot';
import { ArrayVisualization } from '@/components/visualizations/ArrayVisualization';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyCodeButton } from '@/components/CopyCodeButton';
import { GraphVisualization } from '@/components/visualizations/GraphVisualization';
import { LinkedListVisualization } from '@/components/visualizations/LinkedListVisualization';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/ShareButton';
import { TreeVisualization } from '@/components/visualizations/TreeVisualization';
import { algorithms } from '@/data/algorithms';
import { getAlgorithmImplementation } from '@/data/algorithmImplementations';

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const algorithm = algorithms.find((a) => a.id === id);
  const implementation = getAlgorithmImplementation(id || '');
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);

  // Scroll to top on mount/route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);
          
          // Only apply on mobile (below md breakpoint - 768px)
          if (window.innerWidth < 768) {
            // Only change state if scroll difference is significant (more than 10px)
            if (scrollDifference > 100) {
              if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling down
                setShowBreadcrumb(false);
              } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setShowBreadcrumb(true);
              }
              lastScrollY = currentScrollY;
            }
          } else {
            setShowBreadcrumb(true);
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);


  // If algorithm not found - show friendly 404 and still inject meta if id present
  if (!algorithm) {
    return (
      <>
        <AlgoMetaHead id={id} />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Algorithm not found</h2>
            <p className="text-sm text-muted-foreground">
              The algorithm <code>{id}</code> could not be found.
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const renderVisualization = () => {
    // Enhanced visualizations with static imports
    if (algorithm.id === 'two-pointers') {
      const TwoPointersVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/TwoPointersVisualization').then(m => ({ default: m.TwoPointersVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <TwoPointersVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'sliding-window') {
      const SlidingWindowVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/SlidingWindowVisualization').then(m => ({ default: m.SlidingWindowVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <SlidingWindowVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'prefix-sum') {
      const PrefixSumVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/PrefixSumVisualization').then(m => ({ default: m.PrefixSumVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <PrefixSumVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'binary-search') {
      const BinarySearchVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/BinarySearchVisualization').then(m => ({ default: m.BinarySearchVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BinarySearchVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'kadanes-algorithm') {
      const KadanesVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/KadanesVisualization').then(m => ({ default: m.KadanesVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <KadanesVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'dutch-national-flag') {
      const DutchNationalFlagVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DutchNationalFlagVisualization').then(m => ({ default: m.DutchNationalFlagVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DutchNationalFlagVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'merge-intervals') {
      const MergeIntervalsVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/MergeIntervalsVisualization').then(m => ({ default: m.MergeIntervalsVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <MergeIntervalsVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'monotonic-stack') {
      const MonotonicStackVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/MonotonicStackVisualization').then(m => ({ default: m.MonotonicStackVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <MonotonicStackVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'quick-select') {
      const QuickSelectVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/QuickSelectVisualization').then(m => ({ default: m.QuickSelectVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <QuickSelectVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'container-with-most-water') {
      const ContainerWithMostWaterVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/ContainerWithMostWaterVisualization').then(m => ({ default: m.ContainerWithMostWaterVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <ContainerWithMostWaterVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'trapping-rain-water') {
      const TrappingRainWaterVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/TrappingRainWaterVisualization').then(m => ({ default: m.TrappingRainWaterVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <TrappingRainWaterVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'dfs-preorder') {
      const DFSPreorderVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DFSPreorderVisualization').then(m => ({ default: m.DFSPreorderVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DFSPreorderVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'rotate-array') {
      const RotateArrayVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/RotateArrayVisualization').then(m => ({ default: m.RotateArrayVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <RotateArrayVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'cyclic-sort') {
      const CyclicSortVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/CyclicSortVisualization').then(m => ({ default: m.CyclicSortVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <CyclicSortVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'merge-sorted-lists') {
      const MergeSortedListsVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/MergeSortedListsVisualization').then(m => ({ default: m.MergeSortedListsVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <MergeSortedListsVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'dfs-inorder') {
      const DFSInorderVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DFSInorderVisualization').then(m => ({ default: m.DFSInorderVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DFSInorderVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'dfs-postorder') {
      const DFSPostorderVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DFSPostorderVisualization').then(m => ({ default: m.DFSPostorderVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DFSPostorderVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'bfs-level-order') {
      const BFSLevelOrderVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/BFSLevelOrderVisualization').then(m => ({ default: m.BFSLevelOrderVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BFSLevelOrderVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'bst-insert') {
      const BSTInsertVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/BSTInsertVisualization').then(m => ({ default: m.BSTInsertVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BSTInsertVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'lca') {
      const LowestCommonAncestorVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/LowestCommonAncestorVisualization').then(m => ({ default: m.LowestCommonAncestorVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <LowestCommonAncestorVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'serialize-tree') {
      const SerializeTreeVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/SerializeTreeVisualization').then(m => ({ default: m.SerializeTreeVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <SerializeTreeVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'recover-bst') {
      const RecoverBSTVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/RecoverBSTVisualization').then(m => ({ default: m.RecoverBSTVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <RecoverBSTVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'fast-slow-pointers') {
      const FastSlowPointersVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/FastSlowPointersVisualization').then(m => ({ default: m.FastSlowPointersVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <FastSlowPointersVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'reverse-linked-list') {
      const ReverseLinkedListVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/ReverseLinkedListVisualization').then(m => ({ default: m.ReverseLinkedListVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <ReverseLinkedListVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'detect-cycle') {
      const DetectCycleVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DetectCycleVisualization').then(m => ({ default: m.DetectCycleVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DetectCycleVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'middle-node') {
      const MiddleNodeVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/MiddleNodeVisualization').then(m => ({ default: m.MiddleNodeVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <MiddleNodeVisualization />
        </React.Suspense>
      );
    }

    // Trees & BSTs
    if (algorithm.id === 'trie') {
      const TrieVisualization = React.lazy(() => import('@/components/visualizations/algorithms/TrieVisualization').then(m => ({ default: m.TrieVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><TrieVisualization /></React.Suspense>;
    }

    // Graphs
    if (algorithm.id === 'graph-dfs') {
      const GraphDFSVisualization = React.lazy(() => import('@/components/visualizations/algorithms/GraphDFSVisualization').then(m => ({ default: m.GraphDFSVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><GraphDFSVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'graph-bfs') {
      const GraphBFSVisualization = React.lazy(() => import('@/components/visualizations/algorithms/GraphBFSVisualization').then(m => ({ default: m.GraphBFSVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><GraphBFSVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'topological-sort') {
      const TopologicalSortVisualization = React.lazy(() => import('@/components/visualizations/algorithms/TopologicalSortVisualization').then(m => ({ default: m.TopologicalSortVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><TopologicalSortVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'union-find') {
      const UnionFindVisualization = React.lazy(() => import('@/components/visualizations/algorithms/UnionFindVisualization').then(m => ({ default: m.UnionFindVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><UnionFindVisualization /></React.Suspense>;
    }

    // Dynamic Programming
    if (algorithm.id === 'knapsack-01') {
      const KnapsackVisualization = React.lazy(() => import('@/components/visualizations/algorithms/KnapsackVisualization').then(m => ({ default: m.KnapsackVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><KnapsackVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'coin-change') {
      const CoinChangeVisualization = React.lazy(() => import('@/components/visualizations/algorithms/CoinChangeVisualization').then(m => ({ default: m.CoinChangeVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><CoinChangeVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'lcs') {
      const LCSVisualization = React.lazy(() => import('@/components/visualizations/algorithms/LCSVisualization').then(m => ({ default: m.LCSVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><LCSVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'lis') {
      const LISVisualization = React.lazy(() => import('@/components/visualizations/algorithms/LISVisualization').then(m => ({ default: m.LISVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><LISVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'edit-distance') {
      const EditDistanceVisualization = React.lazy(() => import('@/components/visualizations/algorithms/EditDistanceVisualization').then(m => ({ default: m.EditDistanceVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><EditDistanceVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'matrix-path-dp') {
      const MatrixPathVisualization = React.lazy(() => import('@/components/visualizations/algorithms/MatrixPathVisualization').then(m => ({ default: m.MatrixPathVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><MatrixPathVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'house-robber') {
      const HouseRobberVisualization = React.lazy(() => import('@/components/visualizations/algorithms/HouseRobberVisualization').then(m => ({ default: m.HouseRobberVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><HouseRobberVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'climbing-stairs') {
      const ClimbingStairsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/ClimbingStairsVisualization').then(m => ({ default: m.ClimbingStairsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><ClimbingStairsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'kruskals') {
      const KruskalsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/KruskalsVisualization').then(m => ({ default: m.KruskalsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><KruskalsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'prims') {
      const PrimsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/PrimsVisualization').then(m => ({ default: m.PrimsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><PrimsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'dijkstras') {
      const DijkstrasVisualization = React.lazy(() => import('@/components/visualizations/algorithms/DijkstrasVisualization').then(m => ({ default: m.DijkstrasVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><DijkstrasVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'bellman-ford') {
      const BellmanFordVisualization = React.lazy(() => import('@/components/visualizations/algorithms/BellmanFordVisualization').then(m => ({ default: m.BellmanFordVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><BellmanFordVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'floyd-warshall') {
      const FloydWarshallVisualization = React.lazy(() => import('@/components/visualizations/algorithms/FloydWarshallVisualization').then(m => ({ default: m.FloydWarshallVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><FloydWarshallVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'a-star') {
      const AStarVisualization = React.lazy(() => import('@/components/visualizations/algorithms/AStarVisualization').then(m => ({ default: m.AStarVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><AStarVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'partition-equal-subset') {
      const PartitionEqualSubsetVisualization = React.lazy(() => import('@/components/visualizations/algorithms/PartitionEqualSubsetVisualization').then(m => ({ default: m.PartitionEqualSubsetVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><PartitionEqualSubsetVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'word-break') {
      const WordBreakVisualization = React.lazy(() => import('@/components/visualizations/algorithms/WordBreakVisualization').then(m => ({ default: m.WordBreakVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><WordBreakVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'subsets') {
      const SubsetsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SubsetsVisualization').then(m => ({ default: m.SubsetsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SubsetsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'permutations') {
      const PermutationsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/PermutationsVisualization').then(m => ({ default: m.PermutationsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><PermutationsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'combinations') {
      const CombinationsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/CombinationsVisualization').then(m => ({ default: m.CombinationsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><CombinationsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'combination-sum') {
      const CombinationSumVisualization = React.lazy(() => import('@/components/visualizations/algorithms/CombinationSumVisualization').then(m => ({ default: m.CombinationSumVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><CombinationSumVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'word-search' || algorithm.id === 'word-search-grid') {
      const WordSearchVisualization = React.lazy(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => ({ default: m.WordSearchVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><WordSearchVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'n-queens') {
      const NQueensVisualization = React.lazy(() => import('@/components/visualizations/algorithms/NQueensVisualization').then(m => ({ default: m.NQueensVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><NQueensVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'sudoku-solver') {
      const SudokuSolverVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SudokuSolverVisualization').then(m => ({ default: m.SudokuSolverVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SudokuSolverVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'segment-tree') {
      const SegmentTreeVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SegmentTreeVisualization').then(m => ({ default: m.SegmentTreeVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SegmentTreeVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'fenwick-tree') {
      const FenwickTreeVisualization = React.lazy(() => import('@/components/visualizations/algorithms/FenwickTreeVisualization').then(m => ({ default: m.FenwickTreeVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><FenwickTreeVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'kmp' || algorithm.id === 'kmp-string-matching') {
      const KMPVisualization = React.lazy(() => import('@/components/visualizations/algorithms/KMPVisualization').then(m => ({ default: m.KMPVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><KMPVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'rabin-karp') {
      const RabinKarpVisualization = React.lazy(() => import('@/components/visualizations/algorithms/RabinKarpVisualization').then(m => ({ default: m.RabinKarpVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><RabinKarpVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'activity-selection') {
      const ActivitySelectionVisualization = React.lazy(() => import('@/components/visualizations/algorithms/ActivitySelectionVisualization').then(m => ({ default: m.ActivitySelectionVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><ActivitySelectionVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'xor-trick') {
      const XORTrickVisualization = React.lazy(() => import('@/components/visualizations/algorithms/XORTrickVisualization').then(m => ({ default: m.XORTrickVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><XORTrickVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'count-bits') {
      const CountBitsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/CountBitsVisualization').then(m => ({ default: m.CountBitsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><CountBitsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'subset-generation-bits') {
      const SubsetBitsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SubsetBitsVisualization').then(m => ({ default: m.SubsetBitsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SubsetBitsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'kth-largest' || algorithm.id === 'kth-largest-element') {
      const KthLargestVisualization = React.lazy(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => ({ default: m.KthLargestVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><KthLargestVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'merge-k-lists' || algorithm.id === 'merge-k-sorted-lists') {
      const MergeKSortedListsVisualization = React.lazy(() => import('@/components/visualizations/algorithms/MergeKSortedListsVisualization').then(m => ({ default: m.MergeKSortedListsVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><MergeKSortedListsVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'sliding-window-maximum') {
      const SlidingWindowMaxVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SlidingWindowMaxVisualization').then(m => ({ default: m.SlidingWindowMaxVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SlidingWindowMaxVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'gcd-euclidean' || algorithm.id === 'gcd') {
      const GCDVisualization = React.lazy(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => ({ default: m.GCDVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><GCDVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'sieve-eratosthenes' || algorithm.id === 'sieve-of-eratosthenes') {
      const SieveVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SieveVisualization').then(m => ({ default: m.SieveVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SieveVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'modular-exponentiation') {
      const ModularExpVisualization = React.lazy(() => import('@/components/visualizations/algorithms/ModularExpVisualization').then(m => ({ default: m.ModularExpVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><ModularExpVisualization /></React.Suspense>;
    }
    if (algorithm.id === 'sparse-table') {
      const SparseTableVisualization = React.lazy(() => import('@/components/visualizations/algorithms/SparseTableVisualization').then(m => ({ default: m.SparseTableVisualization })));
      return <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}><SparseTableVisualization /></React.Suspense>;
    }

    // Default: Show coming soon for all algorithms without explicit visualization
    return (
      <div className="text-center space-y-3 py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">Visualization Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">We're working on an interactive visualization for this algorithm</p>
        </div>
      </div>
    );


  };

  return (
    <div>
       {/* Dynamic SEO meta for this algorithm */}
      <AlgoMetaHead id={id} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center flex-wrap gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className={`flex items-center gap-2 text-sm text-muted-foreground transition-all duration-100 md:opacity-100 ${showBreadcrumb ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Algorithms
                </Link>
                <span>/</span>
                <Link 
                  to={`/?category=${encodeURIComponent(algorithm.category)}`}
                  className="hover:text-foreground transition-colors"
                >
                  {algorithm.category}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium text-sm  md:text-xl">{algorithm.name}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        {/* Single column layout for all screen sizes */}
        <div className="space-y-6 mx-auto">
          {/* 1. Animation */}
          <Card className="p-4 sm:p-6 glass-card overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Interactive Visualization
                </h2>
                <div className="flex items-center gap-2">
                  <ShareButton title={algorithm.name} description={algorithm.description} />
                  <Badge variant="outline" className={difficultyColors[algorithm.difficulty]}>
                    {algorithm.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-2 sm:p-4 overflow-x-auto">
                <div className="min-w-[280px]">
                  {renderVisualization()}
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Code Implementation */}
          <Card className="p-4 sm:p-6 glass-card  overflow-hidden  mx-auto">
            <div className="space-y-4 ">
              <h3 className="font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Implementation
              </h3>
              
           <Tabs 
  defaultValue={localStorage.getItem('preferredLanguage') || 'python'}
  onValueChange={(v) => {
    localStorage.setItem('preferredLanguage', v);
  }}
>
  <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 gap-1">
    <TabsTrigger value="python" className="text-xs sm:text-sm">Python</TabsTrigger>
    <TabsTrigger value="typescript" className="text-xs sm:text-sm">TypeScript</TabsTrigger>
    <TabsTrigger value="cpp" className="text-xs sm:text-sm">C++</TabsTrigger>
    <TabsTrigger value="java" className="text-xs sm:text-sm">Java</TabsTrigger>
  </TabsList>
  
  {implementation ? (
    <>
      <TabsContent value="typescript" className="mt-4">
        <div className="relative overflow-hidden rounded-lg">
          <CopyCodeButton code={implementation.code.typescript} />
          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
            <code className="block">{implementation.code.typescript}</code>
          </pre>
        </div>
      </TabsContent>
      
      <TabsContent value="python" className="mt-4">
        <div className="relative overflow-hidden rounded-lg">
          <CopyCodeButton code={implementation.code.python} />
          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
            <code className="block">{implementation.code.python}</code>
          </pre>
        </div>
      </TabsContent>

      <TabsContent value="cpp" className="mt-4">
        <div className="relative overflow-hidden rounded-lg">
          <CopyCodeButton code={implementation.code.cpp} />
          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
            <code className="block">{implementation.code.cpp}</code>
          </pre>
        </div>
      </TabsContent>

      <TabsContent value="java" className="mt-4">
        <div className="relative overflow-hidden rounded-lg">
          <CopyCodeButton code={implementation.code.java} />
          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
            <code className="block">{implementation.code.java}</code>
          </pre>
        </div>
      </TabsContent>
    </>
  ) : (
    <p className="text-sm text-muted-foreground mt-4">Implementation coming soon</p>
  )}
</Tabs>
            </div>
          </Card>

          {/* 3. Algorithm Overview & Complexity */}
          <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Algorithm Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                {implementation?.explanation.overview || algorithm.description}
              </p>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Time Complexity</p>
                  <Badge variant="outline" className="font-mono">
                    {algorithm.timeComplexity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Space Complexity</p>
                  <Badge variant="outline" className="font-mono">
                    {algorithm.spaceComplexity}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Steps, Use Cases & Tips */}
          {implementation && (
            <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
              <Tabs defaultValue="steps">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="steps" className="text-xs sm:text-sm">Steps</TabsTrigger>
                  <TabsTrigger value="usecase" className="text-xs sm:text-sm">Use Cases</TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs sm:text-sm">Pro Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="steps" className="mt-4">
                  <ol className="space-y-2 list-decimal list-inside">
                    {implementation.explanation.steps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="usecase" className="mt-4">
                  <p className="text-sm text-muted-foreground">{implementation.explanation.useCase}</p>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-4">
                  <ul className="space-y-2 list-disc list-inside">
                    {implementation.explanation.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </Card>
          )}

          {/* 5. Practice Problems */}
          {algorithm?.problems && algorithm.problems.length > 0 && (
            <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
              <h3 className="font-semibold mb-4">Practice Problems</h3>
              <div className="space-y-2">
                {algorithm.problems.map((problem, i) => (
                  <a
                    key={i}
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{problem.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {problem.difficulty}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
      

export default AlgorithmDetail;
