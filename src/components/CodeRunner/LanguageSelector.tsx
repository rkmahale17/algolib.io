import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2, Coffee, FileJson, Hash, Database } from "lucide-react";
import { Language } from '@/types/algorithm';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  disabled?: boolean;
  availableLanguages?: Language[];
}

const languages: { id: Language; name: string; icon: React.ElementType }[] = [
  { id: 'python', name: 'Python', icon: Hash },
  { id: 'cpp', name: 'C++', icon: Code2 },
  { id: 'java', name: 'Java', icon: Coffee },
  { id: 'typescript', name: 'TypeScript', icon: FileJson },
  { id: 'sql', name: 'SQLite', icon: Database },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange,
  disabled,
  availableLanguages
}) => {
  const displayLanguages = availableLanguages
    ? languages.filter(l => availableLanguages.includes(l.id))
    : languages;

  return (
    <Select
      value={language}
      onValueChange={(value) => onLanguageChange(value as Language)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px] h-full bg-transparent border-0 border-r rounded-none text-xs focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none transition-colors hover:bg-muted/50">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent className="p-2 z-[100]">
        {displayLanguages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id} className="text-xs cursor-pointer">
            <div className="flex items-center gap-2">
              <lang.icon className="w-3.5 h-3.5" />
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
