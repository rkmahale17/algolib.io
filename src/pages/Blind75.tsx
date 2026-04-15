import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ListType } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ProblemsList } from "@/components/listing/ProblemsList";
import { Brain } from "lucide-react";

const Blind75 = () => {
  const { data, isLoading } = useAlgorithms();

  const allAlgorithms = data?.algorithms ?? [];
  const blind75Algorithms = useMemo(() =>
    allAlgorithms.filter(algo => algo.listType === ListType.Blind75 || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  return (
    <>
      <Helmet>
        <title>Blind 75 LeetCode Problems - Rulcode.com</title>
      </Helmet>

      <ProblemsList
        algorithms={blind75Algorithms}
        title="Blind 75 Problems"
        description="The definitive list of 75 essential problems designed to maximize your preparation in minimal time. Focus on the most frequent FAANG interview questions to ensure you're ready for the highest-level technical assessments."
        listType="blind75"
        progressTitle="Blind 75 Progress"
        isLoading={isLoading}
        icon={Brain}
      />
    </>
  );
};

export default Blind75;
