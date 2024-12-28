import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { Badge } from "@ui/components/badge";
import { Button, buttonVariants } from "@ui/components/button";
import { FaCheck, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@ui/components/card";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Audric Serador</CardTitle>
            <CardDescription>@aserador</CardDescription>
          </div>
        </CardHeader>

        <CardContent>This lead gen tool boosted our sales by 40%!</CardContent>
      </Card>

      {/* Prospect Profile */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=58"
            alt="prospect avatar"
            className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Sarah Johnson</CardTitle>
          <CardDescription className="font-normal text-primary">
            VP of Marketing @ TechCorp
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            Seeking innovative SaaS solutions to optimize our marketing funnel
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <Button variant="outline" size="sm" className="mr-2">
              <span className="sr-only">Email icon</span>
              <MdEmail className="w-5 h-5" />{"    "}
              Email
            </Button>
            <Button variant="outline" size="sm">
              <span className="sr-only">LinkedIn icon</span>
              <FaLinkedin className="w-5 h-5" />{"    "}
              Connect
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Pro
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$49</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Perfect for growing teams and businesses
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Start 14-Day Free Trial</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["10,000 Leads/mo", "AI Enrichment", "Email Verification"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <FaCheck className="w-5 h-5 text-primary" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Feature */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <div className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>AI-Powered Enrichment</CardTitle>
            <CardDescription className="text-md mt-2">
              Our AI automatically enhances your leads with accurate company data, contact details, and social profiles.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
