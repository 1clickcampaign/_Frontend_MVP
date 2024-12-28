import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@ui/components/navigation-menu";
import { buttonVariants } from "@ui/components/button";
import { LogoIcon } from "./Icons";
import { FaMapMarkerAlt, FaShopify, FaLinkedin, FaRobot, FaInstagram, FaPhone, FaStar } from "react-icons/fa";

const discoveryItems = [
  { title: "Local Businesses", href: "/find-local", description: "Find local businesses using Google Maps", icon: FaMapMarkerAlt, isNew: false },
  { title: "E-commerce", href: "/discovery/ecommerce", description: "Discover e-commerce opportunities with Shopify", icon: FaShopify, isNew: false },
  { title: "Companies", href: "/discovery/companies", description: "Explore companies on LinkedIn", icon: FaLinkedin, isNew: false },
];

const enrichmentItems = [
  { title: "AI Enrichment", href: "/enrichment/ai", description: "Enhance data with AI (New!)", isNew: true, icon: FaRobot },
  { title: "Social Media", href: "/enrichment/social", description: "Enrich with data from Instagram, Facebook, and LinkedIn", icon: FaInstagram },
  { title: "Contact Info", href: "/enrichment/contact", description: "Get phone numbers and emails", icon: FaPhone },
  { title: "Ratings", href: "/enrichment/ratings", description: "View ratings from Google Maps", icon: FaStar },
];

const ListItem = ({ title, href, description, isNew = false, icon: Icon }: { title: string, href: string, description: string, isNew?: boolean, icon: React.ElementType }) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {title} {isNew && <span className="ml-2 text-xs font-bold text-blue-500">NEW</span>}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
          {description}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
);

export const Navbar = () => {
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <Link href="/" className="ml-2 font-bold text-xl flex items-center">
              <LogoIcon />
              Datapull
            </Link>
          </NavigationMenuItem>

          {/* Desktop Navigation */}
          <div className="flex items-center">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Discovery</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {discoveryItems.map((item) => (
                    <ListItem key={item.title} {...item} isNew={item.isNew || false} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Enrichment</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {enrichmentItems.map((item) => (
                    <ListItem key={item.title} {...item} isNew={item.isNew || false} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/enterprise" legacyBehavior passHref>
                <NavigationMenuLink className={buttonVariants({ variant: "ghost" })}>
                  Enterprise
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={buttonVariants({ variant: "ghost" })}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>

          {/* Desktop Actions */}
          <div className="flex gap-2">
            <a
              rel="noreferrer noopener"
              href="https://github.com/yourusername/yourrepo"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <div className="w-5 h-5" />
              Github
            </a>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
