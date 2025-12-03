import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface CodeBlock {
  codeType: "optimize" | "starter";
  code: string;
}

interface CodeImplementation {
  lang: string;
  code: CodeBlock[];
}

interface CodeImplementationEditorProps {
  implementations: CodeImplementation[];
  onChange: (implementations: CodeImplementation[]) => void;
}

const LANGUAGES = [
  { id: "typeScript", label: "TypeScript", monacoLang: "typescript" },
  { id: "python", label: "Python", monacoLang: "python" },
  { id: "java", label: "Java", monacoLang: "java" },
  { id: "cpp", label: "C++", monacoLang: "cpp" },
];

const CODE_TYPES: Array<{ id: "optimize" | "starter"; label: string }> = [
  { id: "optimize", label: "Optimized Solution" },
  { id: "starter", label: "Starter Code" },
];

export function CodeImplementationEditor({
  implementations,
  onChange,
}: CodeImplementationEditorProps) {
  const [activeLanguage, setActiveLanguage] = useState(
    implementations[0]?.lang || "typeScript"
  );
  const [activeCodeType, setActiveCodeType] = useState<"optimize" | "starter">(
    "optimize"
  );

  const currentImpl = implementations.find((impl) => impl.lang === activeLanguage);
  const currentCode = currentImpl?.code.find(
    (c) => c.codeType === activeCodeType
  );

  const addLanguage = (langId: string) => {
    if (!implementations.find((impl) => impl.lang === langId)) {
      onChange([
        ...implementations,
        {
          lang: langId,
          code: [
            { codeType: "optimize", code: "" },
            { codeType: "starter", code: "" },
          ],
        },
      ]);
      setActiveLanguage(langId);
    }
  };

  const removeLanguage = (langId: string) => {
    onChange(implementations.filter((impl) => impl.lang !== langId));
    if (activeLanguage === langId) {
      setActiveLanguage(implementations[0]?.lang || "typeScript");
    }
  };

  const updateCode = (langId: string, codeType: "optimize" | "starter", code: string) => {
    onChange(
      implementations.map((impl) => {
        if (impl.lang === langId) {
          return {
            ...impl,
            code: impl.code.map((c) =>
              c.codeType === codeType ? { ...c, code } : c
            ),
          };
        }
        return impl;
      })
    );
  };

  const availableLanguages = LANGUAGES.filter(
    (lang) => !implementations.find((impl) => impl.lang === lang.id)
  );

  const getMonacoLanguage = (langId: string) => {
    return LANGUAGES.find((l) => l.id === langId)?.monacoLang || "typescript";
  };

  return (
    <div className="space-y-4">
      {/* Language Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Languages</span>
            {availableLanguages.length > 0 && (
              <div className="flex gap-2">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLanguage(lang.id)}
                    className="gap-2"
                  >
                    <Plus className="h-3 w-3" />
                    {lang.label}
                  </Button>
                ))}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {implementations.map((impl) => {
              const lang = LANGUAGES.find((l) => l.id === impl.lang);
              return (
                <Badge
                  key={impl.lang}
                  variant={activeLanguage === impl.lang ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 gap-2"
                  onClick={() => setActiveLanguage(impl.lang)}
                >
                  {lang?.label || impl.lang}
                  {implementations.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLanguage(impl.lang);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      {currentImpl && (
        <Card>
          <CardHeader>
            <Tabs value={activeCodeType} onValueChange={(v) => setActiveCodeType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                {CODE_TYPES.map((type) => (
                  <TabsTrigger key={type.id} value={type.id}>
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Editor
                height="500px"
                language={getMonacoLanguage(activeLanguage)}
                value={currentCode?.code || ""}
                onChange={(value) =>
                  updateCode(activeLanguage, activeCodeType, value || "")
                }
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activeCodeType === "optimize"
                ? "Write the optimized solution with proper implementation"
                : "Provide starter code template for users to complete"}
            </p>
          </CardContent>
        </Card>
      )}

      {implementations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No languages added yet</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.id}
                  type="button"
                  variant="outline"
                  onClick={() => addLanguage(lang.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add {lang.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
