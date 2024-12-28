import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface StatsProps {
  end: number;
  suffix: string;
  description: string;
}

const stats: StatsProps[] = [
  { end: 2700, suffix: '+', description: "Active Users" },
  { end: 5000000, suffix: '+', description: "Leads Generated" },
  { end: 98, suffix: '%', description: "Data Accuracy" },
  { end: 50, suffix: '+', description: "Integrations" },
];

export const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);  // Always set to visible for now
  }, []);

  return (
    <section id="statistics" className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ end, suffix, description }) => (
            <div key={description} className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                <CountUp
                  end={end}
                  duration={2.5}
                  separator=","
                  suffix={suffix}
                  start={isVisible ? undefined : end}
                />
              </h2>
              <p className="text-xl text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
