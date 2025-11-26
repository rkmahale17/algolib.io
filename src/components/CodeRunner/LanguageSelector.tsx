import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2, Coffee, FileJson, Hash } from "lucide-react";

export type Language = 'cpp' | 'java' | 'python' | 'typescript';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  disabled?: boolean;
}

const languages: { id: Language; name: string; icon: React.ElementType }[] = [
  { id: 'cpp', name: 'C++', icon: Code2 },
  { id: 'java', name: 'Java', icon: Coffee },
  { id: 'python', name: 'Python', icon: Hash },
  { id: 'typescript', name: 'TypeScript', icon: FileJson },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange,
  disabled
}) => {
  return (
    <Select
      value={language}
      onValueChange={(value) => onLanguageChange(value as Language)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px] bg-background border-input">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            <div className="flex items-center gap-2">
              <lang.icon className="w-4 h-4" />
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
