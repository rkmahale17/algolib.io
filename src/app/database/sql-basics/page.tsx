import { Metadata } from 'next';
import { Suspense } from 'react';
import ProblemsClient from '@/app/dsa/problems/ProblemsClient';

export const metadata: Metadata = {
  title: "SQL Basics - RulCode",
  description: "Master the foundational SQL queries and database concepts. Practice essential problems covering SELECTs, JOINs, aggregations, and more.",
  openGraph: {
    title: "SQL Basics - RulCode",
    description: "Master foundational SQL queries with interactive database problems.",
    url: 'https://rulcode.com/database/sql-basics',
  },
  alternates: {
    canonical: 'https://rulcode.com/database/sql-basics',
  },
};

export default function SqlBasicsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={<div className="p-8 animate-pulse">Loading SQL Basics...</div>}>
        <ProblemsClient 
          listType="sql-basics"
          problemType="sql"
          title="SQL Basics"
          description="Master the foundational SQL queries and database concepts. Practice essential problems covering SELECTs, JOINs, aggregations, and more."
          progressTitle="SQL Progress"
          icon="database"
        />
      </Suspense>
    </div>
  );
}
