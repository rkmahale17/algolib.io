import { useState } from 'react';
import { useAlgorithms, useCategories, useDeleteAlgorithm } from '@/hooks/useAlgorithms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AlgorithmList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [listTypeFilter, setListTypeFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: algorithms, isLoading } = useAlgorithms(searchQuery, categoryFilter === 'all' ? '' : categoryFilter);
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteAlgorithm();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredAlgorithms = algorithms?.filter(algo => {
    if (listTypeFilter === 'all') return true;
    // Check metadata.listType
    const type = algo.metadata?.listType || 'coreAlgo';
    return type === listTypeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => navigate('/admin')}
             className="mr-2"
          >
             <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Algorithm Management</h1>
          {!isLoading && (
            <span className="text-muted-foreground">
              Total: {filteredAlgorithms?.length || 0}
            </span>
          )}
        </div>
        <Button onClick={() => navigate('/admin/algorithms/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Algorithm
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={listTypeFilter} onValueChange={setListTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All List Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All List Types</SelectItem>
            <SelectItem value="coreAlgo">Core Algorithm</SelectItem>
            <SelectItem value="blind75">Blind 75</SelectItem>
            <SelectItem value="core+Blind75">Core + Blind 75</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8">Loading algorithms...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Edit</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>List Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlgorithms?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No algorithms found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlgorithms?.map((algo) => (
                  <TableRow key={algo.id}>
                    <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/algorithm/${algo.id}`)}
                          className="h-8 w-8 hover:bg-muted"
                          title="Edit Algorithm"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{algo.id}</TableCell>
                    <TableCell className="font-medium">{algo.name}</TableCell>
                    <TableCell>{algo.category}</TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(algo.difficulty)}>
                        {algo.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{algo.metadata?.listType || 'coreAlgo'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/algorithm/${algo.id}`)}
                          className="gap-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(algo.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the algorithm
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
