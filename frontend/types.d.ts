declare var SpeechRecognition: any

interface Window {
  SpeechRecognition: typeof SpeechRecognition
  webkitSpeechRecognition: typeof SpeechRecognition
}

declare module 'react-mathjax' {
  interface NodeProps {
    formula: string;
    inline?: boolean;
  }

  interface ProviderProps {
    input: 'tex' | 'ascii';
    children: React.ReactNode;
  }

  const Node: React.FC<NodeProps>;
  const Provider: React.FC<ProviderProps>;

  const MathJax: {
    Node: typeof Node;
    Provider: typeof Provider;
  };

  export default MathJax;
}

