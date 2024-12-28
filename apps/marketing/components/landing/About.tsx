import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          {/* image */}
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                DataPull
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                DataPull is a cutting-edge lead generation and list enrichment platform designed for modern sales and marketing teams. Our AI-powered technology scans multiple data sources, including Google Maps, LinkedIn, and company websites, to provide you with high-quality, verified leads. We're committed to helping businesses of all sizes streamline their outreach efforts and drive growth through data-driven insights and automation.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
