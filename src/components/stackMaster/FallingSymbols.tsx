import { FallingSymbol } from "@/hooks/useStackGame";

interface FallingSymbolsProps {
  symbols: FallingSymbol[];
  onPush: (symbol: FallingSymbol) => void;
  onPop: (symbol: FallingSymbol) => void;
  getSymbolColor: (char: string) => string;
}

export const FallingSymbols = ({ symbols, onPush, onPop, getSymbolColor }: FallingSymbolsProps) => {
  const handleSymbolClick = (symbol: FallingSymbol) => {
    if (symbol.type === 'open') {
      onPush(symbol);
    } else {
      onPop(symbol);
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-muted/20 rounded-lg border-2 border-border overflow-hidden">
      {/* Guidelines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-green-500/30" />
        <div className="absolute bottom-20 left-0 right-0 h-px bg-yellow-500/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red-500/50" />
      </div>

      {/* Action Zone Labels */}
      <div className="absolute top-2 right-2 text-xs text-green-500/50 pointer-events-none">
        Spawn Zone
      </div>
      <div className="absolute bottom-24 right-2 text-xs text-yellow-500/50 pointer-events-none">
        Action Zone
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-red-500/50 pointer-events-none">
        Miss = -1 Life
      </div>

      {/* Falling Symbols */}
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className={`absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-100 hover:scale-110 ${getSymbolColor(symbol.char)}`}
          style={{
            top: `${symbol.y}%`,
          }}
          onClick={() => handleSymbolClick(symbol)}
        >
          <div className="relative group">
            <div className="text-6xl font-bold drop-shadow-lg animate-in fade-in zoom-in duration-300">
              {symbol.char}
            </div>
            
            {/* Hover tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/90 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {symbol.type === 'open' ? 'Click to PUSH' : 'Click to POP'}
            </div>
          </div>
        </div>
      ))}

      {symbols.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          Waiting for symbols...
        </div>
      )}
    </div>
  );
};
