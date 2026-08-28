import { useState } from 'react';
import { useAlgorithms, useDeleteAlgorithm, useUpdateAlgorithm } from '@/hooks/useAlgorithms';
import { TOP_COMPANIES } from '@/constants/companies';
import { CompanyIcon } from '@/components/CompanyIcon';
import { ListType, LIST_TYPE_LABELS } from '@/types/algorithm';
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
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Pencil, Trash2, Plus, Search, ArrowLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ADMIN_CATEGORIES } from '@/constants/categories';

export function AlgorithmList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [listTypeFilters, setListTypeFilters] = useState<string[]>([]);
  const [problemTypeFilter, setProblemTypeFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'serial_no', direction: 'asc' });
  const [customCategoryInputs, setCustomCategoryInputs] = useState<Record<string, string>>({});

  const { data, isLoading } = useAlgorithms(searchQuery, categoryFilter === 'all' ? '' : categoryFilter);
  const algorithms = data?.algorithms ?? [];
  const deleteMutation = useDeleteAlgorithm();
  const updateMutation = useUpdateAlgorithm();

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
    if (listTypeFilters.length > 0) {
      const types = algo.listTypes || (algo.list_type ? [algo.list_type] : ['core']);
      if (!types.some((t: string) => listTypeFilters.includes(t))) return false;
    }
    
    if (problemTypeFilter !== 'all') {
      const pt = algo.problemType || algo.problem_type;
      if (problemTypeFilter === 'dsa' && pt !== 'dsa') return false;
      if (problemTypeFilter === 'frontend' && pt !== 'frontend') return false;
      if (problemTypeFilter === 'other' && pt === 'dsa' || pt === 'frontend') return false;
    }

    if (publishedFilter !== 'all') {
      const isPublished = algo.published !== false;
      if (publishedFilter === 'published' && !isPublished) return false;
      if (publishedFilter === 'unpublished' && isPublished) return false;
    }
    
    return true;
  })?.sort((a: any, b: any) => {
    let aValue = sortConfig.key === 'list_type' ? (a.listTypes?.join(', ') || a.listType || '') : a[sortConfig.key];
    let bValue = sortConfig.key === 'list_type' ? (b.listTypes?.join(', ') || b.listType || '') : b[sortConfig.key];

    if (sortConfig.key === 'published') {
      const aVal = a.published ? 1 : 0;
      const bVal = b.published ? 1 : 0;
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (sortConfig.key === 'serial_no') {
      const aNum = aValue === null || aValue === undefined || aValue === '' ? -1 : Number(aValue);
      const bNum = bValue === null || bValue === undefined || bValue === '' ? -1 : Number(bValue);

      const aIsNull = aValue === null || aValue === undefined || aValue === '';
      const bIsNull = bValue === null || bValue === undefined || bValue === '';

      if (aIsNull && bIsNull) return 0;
      if (aIsNull) return 1;
      if (bIsNull) return -1;

      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    if (aValue === bValue) return 0;

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
            onClick={() => router.push('/admin')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-">Problem Management</h1>
          {!isLoading && (
            <span className="text-muted-foreground">
              Total: {filteredAlgorithms?.length || 0}
            </span>
          )}
        </div>
        <Button onClick={() => router.push('/admin/problem/new')} className="gap-2">
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ADMIN_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={problemTypeFilter} onValueChange={setProblemTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Problem Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="dsa">DSA</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={publishedFilter} onValueChange={setPublishedFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between font-normal">
              <span className="truncate">
                {listTypeFilters.length === 0 ? "All List Types" : `${listTypeFilters.length} selected`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search list types..." className="h-9" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setListTypeFilters([])}
                    className="cursor-pointer flex justify-between"
                  >
                    All List Types
                    {listTypeFilters.length === 0 && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                  {Object.entries(LIST_TYPE_LABELS)
                    .filter(([key]) => key !== 'all' && key !== 'coreAlgo')
                    .map(([value, label]) => {
                      const isSelected = listTypeFilters.includes(value);
                      return (
                        <CommandItem
                          key={value}
                          onSelect={() => {
                            setListTypeFilters(prev => 
                              isSelected ? prev.filter(t => t !== value) : [...prev, value]
                            );
                          }}
                          className="cursor-pointer flex justify-between"
                        >
                          {label}
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
                <TableHead onClick={() => handleSort('serial_no')} className="cursor-pointer hover:bg-muted/50 font- text-primary">Serial No</TableHead>
                <TableHead onClick={() => handleSort('list_type')} className="cursor-pointer hover:bg-muted/50">List Types</TableHead>
                <TableHead onClick={() => handleSort('published')} className="cursor-pointer hover:bg-muted/50 w-[100px] text-center">Published</TableHead>
                <TableHead className="w-[120px] text-center">Tags & Pro</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlgorithms?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No algorithms found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlgorithms?.map((algo) => {
                  const listTypes = algo.listTypes || (algo.list_type ? [algo.list_type] : ['core']);
                  return (
                    <TableRow key={algo.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/problem/${algo.id}`)}
                          className="h-8 w-8 hover:bg-muted"
                          title="Edit Algorithm"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{algo.id}</TableCell>
                      <TableCell className="font-medium">{algo.name}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-auto min-h-[28px] max-w-[180px] text-xs bg-background hover:bg-muted font-medium py-1 px-2 flex flex-wrap gap-1">
                              {(!algo.categories || algo.categories.length === 0) ? (
                                <span className="text-muted-foreground">Select...</span>
                              ) : (
                                algo.categories.map((cat: string) => (
                                  <Badge key={cat} variant="secondary" className="text-[9px] px-1 py-0 capitalize flex items-center gap-0.5">
                                    {cat}
                                    <X className="w-2 h-2 opacity-50 hover:opacity-100 cursor-pointer" onClick={(e) => {
                                      e.stopPropagation();
                                      const newCategories = algo.categories.filter((c: string) => c !== cat);
                                      updateMutation.mutate({ id: algo.id, updates: { categories: newCategories } });
                                    }} />
                                  </Badge>
                                ))
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search categories..." className="h-8" />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup className="overflow-auto max-h-[220px]">
                                  {ADMIN_CATEGORIES.map((cat) => {
                                    const algoCats = algo.categories || (algo.category ? algo.category.split(',').map((c: string) => c.trim()) : []);
                                    const isSelected = algoCats.includes(cat);
                                    return (
                                      <CommandItem
                                        key={cat}
                                        value={cat}
                                        onSelect={() => {
                                          const newCategories = isSelected
                                            ? algoCats.filter((c: string) => c !== cat)
                                            : [...algoCats, cat];
                                          updateMutation.mutate({ id: algo.id, updates: { categories: newCategories } });
                                        }}
                                        className="cursor-pointer text-xs flex justify-between items-center"
                                      >
                                        <span className="capitalize">{cat}</span>
                                        {isSelected && <Check className="w-3 h-3 text-primary opacity-80" />}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                                <div className="border-t p-2 flex gap-1.5 items-center">
                                  <Input
                                    placeholder="Custom..."
                                    value={customCategoryInputs[algo.id] || ""}
                                    onChange={(e) => setCustomCategoryInputs(prev => ({ ...prev, [algo.id]: e.target.value }))}
                                    className="h-7 text-xs flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && customCategoryInputs[algo.id]?.trim()) {
                                        const algoCats = algo.categories || (algo.category ? algo.category.split(',').map((c: string) => c.trim()) : []);
                                        const newCat = customCategoryInputs[algo.id].trim();
                                        if (!algoCats.includes(newCat)) {
                                          updateMutation.mutate({ id: algo.id, updates: { categories: [...algoCats, newCat] } });
                                        }
                                        setCustomCategoryInputs(prev => ({ ...prev, [algo.id]: "" }));
                                      }
                                    }}
                                  />
                                  <Button 
                                    size="sm" 
                                    className="h-7 text-xs px-2"
                                    onClick={() => {
                                      if (customCategoryInputs[algo.id]?.trim()) {
                                        const algoCats = algo.categories || (algo.category ? algo.category.split(',').map((c: string) => c.trim()) : []);
                                        const newCat = customCategoryInputs[algo.id].trim();
                                        if (!algoCats.includes(newCat)) {
                                          updateMutation.mutate({ id: algo.id, updates: { categories: [...algoCats, newCat] } });
                                        }
                                        setCustomCategoryInputs(prev => ({ ...prev, [algo.id]: "" }));
                                      }
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(algo.difficulty)}>
                          {algo.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{algo.serial_no || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(LIST_TYPE_LABELS)
                            .filter(([key]) => key !== 'all' && key !== 'coreAlgo')
                            .map(([value, label]) => {
                              const isSelected = listTypes.includes(value);
                              return (
                                <Badge
                                  key={value}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`text-[9px] px-1.5 py-0.5 cursor-pointer select-none transition-colors ${
                                    isSelected 
                                      ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent" 
                                      : "hover:bg-muted text-muted-foreground border-muted-foreground/30"
                                  }`}
                                  onClick={() => {
                                    const newListTypes = isSelected
                                      ? listTypes.filter((t: string) => t !== value)
                                      : [...listTypes, value];
                                    updateMutation.mutate({ 
                                      id: algo.id, 
                                      updates: { 
                                        list_types: newListTypes,
                                        list_type: newListTypes[0] || 'core'
                                      } 
                                    });
                                  }}
                                >
                                  {label}
                                </Badge>
                              );
                            })}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={algo.published !== false}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({ id: algo.id, updates: { published: checked } });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {algo.metadata?.companies?.slice(0, 3).map((c: string) => (
                            <CompanyIcon key={c} company={c} className="w-3.5 h-3.5 opacity-80" />
                          ))}
                          {algo.metadata?.companies?.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{algo.metadata.companies.length - 3}</span>
                          )}
                          <div className={`w-3 h-3 rounded-full ${algo.metadata?.is_pro ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-muted/30'}`} title={algo.metadata?.is_pro ? 'PRO' : 'Free'} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/problem/${algo.id}`)}
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
                  );
                })
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
