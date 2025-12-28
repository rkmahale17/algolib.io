import { useState } from 'react';
import { useAlgorithms, useCategories, useDeleteAlgorithm } from '@/hooks/useAlgorithms';
import { ListType, LIST_TYPE_LABELS, LIST_TYPE_OPTIONS, LIST_TYPE_OPTIONS_ADMIN } from '@/types/algorithm';
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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'serial_no', direction: 'asc' });

  const { data, isLoading } = useAlgorithms(searchQuery, categoryFilter === 'all' ? '' : categoryFilter);
  const algorithms = data?.algorithms ?? [];
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

  const filteredAlgorithms = algorithms.filter(algo => {
    if (listTypeFilter === 'all') return true;
    // Check list_type
    const type = algo.list_type || 'core';
    return type === listTypeFilter;
  })?.sort((a: any, b: any) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'serial_no') {
        const aNum = aValue === null || aValue === undefined || aValue === '' ? -1 : Number(aValue);
        const bNum = bValue === null || bValue === undefined || bValue === '' ? -1 : Number(bValue);
        
        // If sorting strictly by what exists, we might want nulls at bottom.
        // Let's stick to the previous pattern: nulls last.
        const aIsNull = aValue === null || aValue === undefined || aValue === '';
        const bIsNull = bValue === null || bValue === undefined || bValue === '';

        if (aIsNull && bIsNull) return 0;
        if (aIsNull) return 1;
        if (bIsNull) return -1;

        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    if (aValue === bValue) return 0;
    
    // Handle null/undefined values - push to end
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const result = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? result : -result;
  });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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
          <h1 className="text-3xl font-bold">Problem Management</h1>
          {!isLoading && (
            <span className="text-muted-foreground">
              Total: {filteredAlgorithms?.length || 0}
            </span>
          )}
        </div>
        <Button onClick={() => navigate('/admin/problem/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Problem
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

            
            {LIST_TYPE_OPTIONS_ADMIN.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
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
                <TableHead onClick={() => handleSort('id')} className="cursor-pointer hover:bg-muted/50">ID</TableHead>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-muted/50">Name</TableHead>
                <TableHead onClick={() => handleSort('category')} className="cursor-pointer hover:bg-muted/50">Category</TableHead>
                <TableHead onClick={() => handleSort('difficulty')} className="cursor-pointer hover:bg-muted/50">Difficulty</TableHead>
                <TableHead onClick={() => handleSort('serial_no')} className="cursor-pointer hover:bg-muted/50 font-bold text-primary">Serial No</TableHead>
                <TableHead onClick={() => handleSort('list_type')} className="cursor-pointer hover:bg-muted/50">List Type</TableHead>
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
                          onClick={() => navigate(`/admin/problem/${algo.id}`)}
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
                    <TableCell className="font-mono text-sm">{algo.serial_no || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{algo.list_type || 'core'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/problem/${algo.id}`)}
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
