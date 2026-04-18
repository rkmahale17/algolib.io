"use client";
import { useState, useMemo } from 'react';
import { useAlgorithms, useBulkUpdateAlgorithms, useBatchStagedUpdates } from '@/hooks/useAlgorithms';
import { TOP_COMPANIES, CompanyTag } from '@/constants/companies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CompanyIcon } from '@/components/CompanyIcon';
import { Search, Loader2, Plus, X, ArrowLeft, Check, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from 'next/router';

export function AdminTaggingUpdate() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading } = useAlgorithms(searchQuery, '');
  const algorithms = data?.algorithms ?? [];
  
  const stagedUpdatesMutation = useBatchStagedUpdates();
  const [stagedEdits, setStagedEdits] = useState<Record<string, { is_pro?: boolean, companies?: string[] }>>({});

  const handleToggleProInline = (algoId: string, isNowPro: boolean) => {
    setStagedEdits(prev => {
      const current = prev[algoId] || {};
      return { ...prev, [algoId]: { ...current, is_pro: isNowPro } };
    });
  };

  const handleCompanyToggleInline = (algo: any, company: string, isAdding: boolean) => {
    const originalCompanies = algo.metadata?.companies || [];
    setStagedEdits(prev => {
      const current = prev[algo.id] || {};
      const currentCompanies = current.companies ?? originalCompanies;
      const newCompanies = isAdding 
        ? [...currentCompanies, company]
        : currentCompanies.filter((c: string) => c !== company);
      
      if (isAdding && currentCompanies.includes(company)) return prev;

      return { ...prev, [algo.id]: { ...current, companies: newCompanies } };
    });
  };

  const handleSaveStagedChanges = async () => {
    const updatesArray = Object.keys(stagedEdits).map(id => ({
      id,
      ...stagedEdits[id]
    }));
    
    if (updatesArray.length === 0) return;
    
    try {
      await stagedUpdatesMutation.mutateAsync(updatesArray);
      toast.success(`Successfully saved updates for ${updatesArray.length} algorithms!`);
      setStagedEdits({});
    } catch (e: any) {
      toast.error(`Failed to save changes: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header & Sticky Actions */}
      <div className="flex flex-col gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 pb-4 border-b">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
                <ArrowLeft className="h-4 w-4" />
             </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tagging & Pro Operations</h1>
              <p className="text-muted-foreground text-sm mt-1">Batch assign top companies and PRO state globally.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {Object.keys(stagedEdits).length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex justify-between items-center animate-in slide-in-from-top-2">
            <div className="flex gap-2 items-center">
              <Badge variant="default" className="text-sm px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
                {Object.keys(stagedEdits).length} Modified
              </Badge>
              <span className="text-sm text-foreground/80 font-medium tracking-tight">You have unsaved changes staged locally.</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={() => setStagedEdits({})}>
                Discard Edits
              </Button>
              <Button size="sm" onClick={handleSaveStagedChanges} disabled={stagedUpdatesMutation.isPending} className="gap-2 shadow-md bg-amber-500 hover:bg-amber-600">
                {stagedUpdatesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} 
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
           <Loader2 className="animate-spin text-primary w-8 h-8"/>
        </div>
      ) : (
        <div className="border rounded-lg shadow-sm bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">ID / Serial</TableHead>
                <TableHead>Title & Category</TableHead>
                <TableHead className="w-[300px]">Companies (Metadata)</TableHead>
                <TableHead className="w-[100px] text-center">PRO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {algorithms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No algorithms found matching search
                  </TableCell>
                </TableRow>
              ) : (
                algorithms.map((algo) => {
                   const algoCompanies = stagedEdits[algo.id]?.companies ?? (algo.metadata?.companies || []);
                   const isPro = stagedEdits[algo.id]?.is_pro ?? (algo.metadata?.is_pro || false);
                   const isModified = !!stagedEdits[algo.id];
                   
                   return (
                    <TableRow 
                      key={algo.id} 
                      className={`transition-colors ${isModified ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {algo.serial_no || '-'}<br/>
                        <span className="text-[9px] opacity-50">{algo.id.slice(0, 8)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm">{algo.title}</div>
                        <div className="text-xs text-muted-foreground uppercase mt-1 tracking-wider">{algo.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {algoCompanies.map((c: string) => {
                              const compConfig = TOP_COMPANIES.find(comp => comp.name.toLowerCase() === c.toLowerCase());
                              return (
                                <Badge key={c} variant="outline" className="text-[10px] bg-background gap-1 pr-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={() => handleCompanyToggleInline(algo, c, false)}>
                                  <CompanyIcon company={c} className="w-2.5 h-2.5 opacity-70" />
                                  {c} <X className="w-2.5 h-2.5" />
                                </Badge>
                              );
                          })}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] rounded-full border border-dashed text-muted-foreground w-6"><Plus className="w-3 h-3 hover:text-primary"/></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Add company..." className="h-8"/>
                                <CommandList className="max-h-[350px]">
                                  <CommandEmpty>No company found.</CommandEmpty>
                                  <CommandGroup className="overflow-auto pb-4">
                                    {TOP_COMPANIES.map((company) => {
                                      const isAdded = algoCompanies.includes(company.name);
                                      return (
                                        <CommandItem
                                          key={company.id}
                                          value={company.name}
                                          onSelect={() => handleCompanyToggleInline(algo, company.name, !isAdded)}
                                          className="cursor-pointer text-xs flex justify-between items-center"
                                        >
                                          <span>{company.name}</span>
                                          {isAdded && <Check className="w-3 h-3 text-primary opacity-80" />}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                           {isPro && <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[9px] px-1 py-0 uppercase shadow-sm mr-1">pro</Badge>}
                           <Switch 
                             checked={isPro}
                             onCheckedChange={(checked) => handleToggleProInline(algo.id, checked)}
                             disabled={stagedUpdatesMutation.isPending}
                             className="data-[state=checked]:bg-amber-500"
                           />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default AdminTaggingUpdate;
