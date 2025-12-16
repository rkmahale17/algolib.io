import { useNavigate, useParams } from 'react-router-dom';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { AlgorithmFormBuilder } from '@/components/admin/AlgorithmFormBuilder';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminAlgorithmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: algorithm, isLoading, error } = useAlgorithm(id || '');

  const handleCancel = () => {
    navigate('/admin/algorithms');
  };

  const handleSuccess = () => {
    navigate('/admin/algorithms');
  };

  if (id && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (id && error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Error loading algorithm</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => navigate('/admin/algorithms')}
          className="mt-4 text-primary hover:underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto  mx-2">
   
      <AlgorithmFormBuilder
        algorithm={algorithm}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
