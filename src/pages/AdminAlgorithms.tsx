import { useState } from 'react';
import { AlgorithmList } from '@/components/admin/AlgorithmList';
import { AlgorithmForm } from '@/components/admin/AlgorithmForm';
import { Algorithm } from '@/hooks/useAlgorithms';

export default function AdminAlgorithms() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedAlgorithm(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAlgorithm(null);
  };

  return (
    <div className="container mx-auto py-8">
      <AlgorithmList onEdit={handleEdit} onCreate={handleCreate} />
      <AlgorithmForm
        algorithm={selectedAlgorithm}
        open={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
}
