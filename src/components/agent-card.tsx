"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AgentPricingType = "free" | "one-time" | "subscription";

export interface AgentCardProps {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: string;
  rating?: number;
  verified?: boolean;
  thumbnail: string;
  category?: string;
  pricingType?: AgentPricingType;
}

export function AgentCard({
  slug,
  title,
  tagline,
  price,
  rating,
  verified,
  thumbnail,
  category,
  pricingType,
}: AgentCardProps) {
  const pricingLabelMap: Record<AgentPricingType, string> = {
    free: "Free",
    "one-time": "One-time",
    subscription: "Subscription",
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/agents/${slug}`} className="relative block">
          <Image
            src={thumbnail}
            alt={title}
            width={600}
            height={400}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {verified ? (
            <Badge className="absolute left-3 top-3 bg-emerald-600 text-white">
              Verified
            </Badge>
          ) : null}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2 text-xs">
          {category ? (
            <Badge variant="outline" className="uppercase tracking-wide">
              {category}
            </Badge>
          ) : null}
          {pricingType ? (
            <Badge variant="secondary" className="text-foreground">
              {pricingLabelMap[pricingType]}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            <Link href={`/agents/${slug}`} className="hover:underline">
              {title}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tagline}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="font-semibold">{price}</span>
          {rating ? <span className="text-muted-foreground">⭐ {rating}</span> : null}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Link
          href={`/agents/${slug}`}
          className={buttonVariants({ className: "w-full justify-center" })}
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
}
