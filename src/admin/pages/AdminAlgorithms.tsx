"use client";
import { AlgorithmList } from '@/admin/components/AlgorithmList';

export default function AdminAlgorithms() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: ".global-nav { display: none !important; }",
        }}
      />
      <div className="container mx-auto py-8">
        <AlgorithmList />
      </div>
    </>
  );
}
