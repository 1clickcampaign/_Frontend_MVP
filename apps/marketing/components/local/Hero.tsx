import { Button } from "@ui/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-50">
      <div className="container mx-auto text-center">
        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full mb-4">
          Local Business Finder
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Find the best local businesses using Google Maps
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Use company names, addresses, and more to discover perfect leads from anywhere on the Internet.
        </p>
        <Button size="lg">Try free today →</Button>
      </div>
    </section>
  );
}