#!/bin/bash
COMPANIES=(
"amazon amazon amazon"
"google google google"
"microsoft microsoft microsoft"
"meta meta meta"
"apple apple apple"
"netflix netflix netflix"
"uber uber uber"
"bloomberg bloomberg bloomberg"
"adobe adobe adobe"
"linkedin linkedin linkedin"
"salesforce salesforce salesforce"
"tiktok tiktok tiktok"
"oracle oracle oracle"
"nvidia nvidia nvidia"
"atlassian atlassian atlassian"
"stripe stripe stripe"
"goldman_sachs goldmansachs goldman-sachs"
"morgan_stanley morganstanley morgan-stanley"
"jpmorgan chase jpmorgan-chase"
"spotify spotify spotify"
"twitter x x"
"snapchat snapchat snapchat"
"pinterest pinterest pinterest"
"byte_dance bytedance bytedance"
"two_sigma twosigma two-sigma"
)

mkdir -p public/icons/companies

for row in "${COMPANIES[@]}"; do
    set -- $row
    ID=$1
    ICON=$2
    SVGL=$3
    
    DEST="public/icons/companies/${ICON}.svg"
    echo "Downloading ${ID}..."
    
    HTTP_CODE=$(curl -s -L -o "$DEST" -w "%{http_code}" "https://api.svgl.app/static/icons/${SVGL}.svg")
    
    if [ "$HTTP_CODE" != "200" ]; then
        HTTP_CODE=$(curl -s -L -o "$DEST" -w "%{http_code}" "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${ICON}.svg")
        if [ "$HTTP_CODE" != "200" ]; then
            echo "Both failed for ${ID}"
            rm -f "$DEST"
        fi
    fi
done
