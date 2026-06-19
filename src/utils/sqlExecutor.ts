import axios from 'axios';
import env from '@/config/env';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGE_IDS } from '@/components/CodeRunner/constants';

export const executeSqlTestCases = async (code: string, testCases: any[], schema: any[], dbSetup: string, algorithmId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const apiUrl = env.apiUrl;
    
    const sqlPromises = testCases.map(async (tc: any) => {
        let script = `.bail on\n.headers on\n.mode list\n.separator '|_|_|'\n.nullvalue '___NULL___'\n`;
        const cleanDbSetup = dbSetup 
            ? dbSetup
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/\bAUTO_INCREMENT\b/gi, '')
                .replace(/\bAUTOINCREMENT\b/gi, '')
            : '';
        script += cleanDbSetup ? `${cleanDbSetup}\n\n` : '';
        
        schema?.forEach((field: any, i: number) => {
            const tableName = field.name.replace(/ table/i, '').trim();
            const rows = tc.input[i];
            let dataToInsert: any[] = [];
            if (Array.isArray(rows)) {
                dataToInsert = rows;
            } else if (rows && typeof rows === 'object') {
                const vals = Object.values(rows);
                if (vals.length > 0 && Array.isArray(vals[0])) dataToInsert = vals[0] as any[];
            } else if (rows !== undefined && rows !== null) {
                dataToInsert = [{ [tableName]: rows }];
            }
            
            if (dataToInsert.length > 0 && typeof dataToInsert[0] === 'object' && dataToInsert[0] !== null) {
                const columns = Object.keys(dataToInsert[0]);
                dataToInsert.forEach((row: any) => {
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        return val;
                    });
                    script += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
                });
                script += '\n';
            }
        });
        
        script += code;
        
        try {
            const response = await axios.post(`${apiUrl}/api/execute`, {
                language_id: LANGUAGE_IDS['sql'],
                source_code: script,
                stdin: "",
                problem_id: algorithmId,
            }, { headers: { Authorization: `Bearer ${session?.access_token}` } });
            
            return {
                tc,
                submission_id: response.data.submission_id
            };
        } catch (e: any) {
            return {
                tc,
                error: e.message || "Failed to submit query"
            };
        }
    });

    return await Promise.all(sqlPromises);
};

export const verifySqlResult = (tc: any, stdout: string, stderr: string) => {
    const actualStr = stdout ? stdout.replace(/\(\d+\s+rows?\)\s*$/, '').trim() : '';
    let passed = false;
    let expectedData = null;
    try {
        expectedData = typeof tc.expectedOutput === 'string' ? JSON.parse(tc.expectedOutput) : tc.expectedOutput;
    } catch {
        expectedData = tc.expectedOutput;
    }
    
    let parsedActual: any = actualStr;

    if (actualStr && tc.expectedOutput !== undefined) {
        try {
            const lines = actualStr.split('\n').map(l => l.trim()).filter(l => l);
            if (lines.length > 0) {
                const headers = lines[0].split('|_|_|').map(h => {
                    let clean = h.trim();
                    if (clean.startsWith('"') && clean.endsWith('"')) clean = clean.substring(1, clean.length - 1);
                    if (clean.startsWith("'") && clean.endsWith("'")) clean = clean.substring(1, clean.length - 1);
                    if (clean.startsWith('`') && clean.endsWith('`')) clean = clean.substring(1, clean.length - 1);
                    return clean;
                });
                parsedActual = lines.slice(1).map(line => {
                    const values = line.split('|_|_|');
                    const obj: any = {};
                    headers.forEach((h, idx) => {
                        const val = values[idx];
                        obj[h] = val === '___NULL___' ? null : val;
                    });
                    return obj;
                });
            } else {
                parsedActual = [];
            }

            if (Array.isArray(parsedActual) && Array.isArray(expectedData)) {
                if (parsedActual.length === expectedData.length) {
                    passed = parsedActual.every((actRow, i) => {
                        const expRow = expectedData[i];
                        if (!expRow || typeof expRow !== 'object') return false;
                        
                        const actKeys = Object.keys(actRow);
                        const expKeys = Object.keys(expRow);
                        
                        if (actKeys.length !== expKeys.length) return false;
                        
                        return expKeys.every(k => {
                            if (!actKeys.includes(k)) return false;
                            const aVal = actRow[k] === null ? 'null' : String(actRow[k]);
                            const eVal = expRow[k] === null ? 'null' : String(expRow[k]);
                            return aVal === eVal;
                        });
                    });
                }
            } else {
                passed = actualStr === JSON.stringify(expectedData);
            }
        } catch (e) {
            passed = actualStr === JSON.stringify(expectedData);
        }
    } else {
        passed = actualStr === JSON.stringify(expectedData) || !expectedData;
    }

    return {
        status: passed ? (stderr ? 'fail' : 'pass') : 'fail',
        input: tc.input || 'SQL Query',
        expected: expectedData,
        actual: parsedActual,
        stdout: stdout,
        error: stderr
    };
};
