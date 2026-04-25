import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorSettings } from "@/hooks/useEditorSettings";

interface SettingsPopoverProps {
    settings: EditorSettings;
    updateSetting: <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => void;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({ settings, updateSetting }) => {
    return (
        <Popover>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Settings</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Editor Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Customize your coding experience.
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                                value={settings.theme === 'system' ? 'light' : settings.theme}
                                onValueChange={(val: any) => updateSetting('theme', val)}
                            >
                                <SelectTrigger className="w-full col-span-2 h-8">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="fontSize">Font Size</Label>
                            <div className="col-span-2 flex items-center gap-2">
                                <Slider
                                    id="fontSize"
                                    value={[settings.fontSize]}
                                    min={10}
                                    max={24}
                                    step={1}
                                    onValueChange={([val]) => updateSetting('fontSize', val)}
                                    className="w-full"
                                />
                                <span className="w-8 text-xs text-right">{settings.fontSize}px</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="tabSize">Tab Size</Label>
                            <Select
                                value={settings.tabSize.toString()}
                                onValueChange={(val) => updateSetting('tabSize', parseInt(val))}
                            >
                                <SelectTrigger className="w-full col-span-2 h-8">
                                    <SelectValue placeholder="Tab Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 spaces</SelectItem>
                                    <SelectItem value="4">4 spaces</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="wordWrap">Word Wrap</Label>
                            <Switch
                                id="wordWrap"
                                checked={settings.wordWrap === 'on'}
                                onCheckedChange={(checked) => updateSetting('wordWrap', checked ? 'on' : 'off')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="minimap">Minimap</Label>
                            <Switch
                                id="minimap"
                                checked={settings.minimap}
                                onCheckedChange={(checked) => updateSetting('minimap', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="lineNumbers">Line Numbers</Label>
                            <Switch
                                id="lineNumbers"
                                checked={settings.lineNumbers === 'on'}
                                onCheckedChange={(checked) => updateSetting('lineNumbers', checked ? 'on' : 'off')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="autocomplete">Autocomplete</Label>
                            <Switch
                                id="autocomplete"
                                checked={settings.autocomplete}
                                onCheckedChange={(checked) => updateSetting('autocomplete', checked)}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
