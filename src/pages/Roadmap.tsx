import { Construction } from "lucide-react";

const Roadmap = () => {
    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Construction className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Interactive Roadmap</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                We're working hard on compiling the ultimate preparation roadmaps. Check back soon for structured learning paths designed to help you land your dream job faster.
            </p>
        </div>
    );
};

export default Roadmap;
