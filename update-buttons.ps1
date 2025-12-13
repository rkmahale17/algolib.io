$file = "d:\repo\hobby\learn-algo-animate\src\components\CodeRunner\CodeRunner.tsx"
$content = Get-Content $file -Raw

# Replace container div
$content = $content -replace 'flex items-center gap-0\.5 p-0\.5 bg-white backdrop-blur-xl border border-gray-200 shadow-lg rounded-full', 'flex items-center shadow-lg rounded-md bg-background'

# Replace Run button className
$content = $content -replace 'h-8 px-3 text-xs rounded-full bg-violet-100 text-primary hover:bg-primary hover:text-white transition-all border-0 group', 'h-8 px-4 text-xs rounded-r-none border border-r-0 bg-violet-100 text-violet-700 hover:bg-violet-500 hover:text-white border-violet-200 font-medium transition-colors'

# Replace Run button icon and text (remove "Running" text, use "Run")
$content = $content -replace '(<Loader2 className=")w-3 h-3 mr-1\.5 animate-spin group-hover:text-white(" />)\s*Running', '$1w-3.5 h-3.5 mr-2 animate-spin$2 Run'
$content = $content -replace '(<Play className=")w-3 h-3 mr-1 text-primary fill-primary group-hover:text-white group-hover:fill-white(" />)\s*Run', '$1w-3.5 h-3.5 mr-2 fill-current$2 Run'

# Replace Submit button className  
$content = $content -replace 'h-8 px-3 text-xs rounded-full transition-all border-0 group', 'h-8 px-4 text-xs rounded-l-none border'

# Replace Submit button icon and text (remove "Submitting" text, use "Submit")
$content = $content -replace '(<Loader2 className=")w-3 h-3 mr-1\.5 animate-spin group-hover:text-white(" />)\s*Submitting', '$1w-3.5 h-3.5 mr-2 animate-spin$2 Submit'
$content = $content -replace '(<Send className=")w-3 h-3 mr-1 group-hover:text-white(" />)\s*Submit', '$1w-3.5 h-3.5 mr-2$2 Submit'

# Remove the separator div between buttons (3 blank lines)
$content = $content -replace '(\s*</FeatureGuard>\s*)\n\s*\n\s*\n\s*(<FeatureGuard flag="submit_button">)', '$1$2'

Set-Content $file $content -NoNewline

Write-Host "Button styles updated successfully!"
