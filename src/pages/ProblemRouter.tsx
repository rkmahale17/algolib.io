import { useParams, Navigate } from 'react-router-dom';
import { algorithms } from '@/data/algorithms';
import { blind75Problems } from '@/data/blind75';
import AlgorithmDetail from '@/pages/AlgorithmDetail';
import Blind75Detail from '@/pages/Blind75Detail';

/**
 * Smart router that determines whether to show AlgorithmDetail or Blind75Detail
 * based on whether the ID matches an algorithm or a Blind75 problem
 */
const ProblemRouter = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  // Check if it's a Blind75 problem (using slug)
  const isBlind75 = blind75Problems.some((p) => p.slug === id);
  
  // Check if it's a regular algorithm
  const isAlgorithm = algorithms.some((a) => a.id === id);

  if (isBlind75) {
    return <Blind75Detail />;
  }

  if (isAlgorithm) {
    return <AlgorithmDetail />;
  }

  // If neither found, show 404
  return <Navigate to="/404" replace />;
};

export default ProblemRouter;
