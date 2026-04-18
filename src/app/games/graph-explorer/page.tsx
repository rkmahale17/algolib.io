import { Metadata } from 'next';
import GraphExplorerClient from './GraphExplorerClient';

export const metadata: Metadata = {
  title: 'Graph Explorer - Visualize Graph Algorithms | RulCode',
  description: 'Explore and visualize graph data structures and algorithms interactively.',
};

export default function GraphExplorerPage() {
  return <GraphExplorerClient />;
}
