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
import type { AgentSummary } from "@/types/agents";

export type AgentPricingType = "free" | "one-time" | "subscription";

type CreatorPlan = "free" | "pro";

export interface AgentCardProps extends AgentSummary {
  category?: string;
  pricingType?: AgentPricingType;
  creatorPlan?: CreatorPlan;
  isFeatured?: boolean;
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
  creatorPlan,
  isFeatured,
}: AgentCardProps) {
  const pricingLabelMap: Record<AgentPricingType, string> = {
    free: "Free",
    "one-time": "One-time",
    subscription: "Subscription",
  };

  const imgSrc = thumbnail || "https://placehold.co/600x400/png";
  const isRemoteImage = /^https?:\/\//.test(imgSrc);
  const isProCreator = creatorPlan === "pro";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/agents/${slug}`} className="relative block">
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized={isRemoteImage}
          />
          {verified ? (
            <Badge className="absolute left-3 top-3 bg-emerald-600 text-white">
              Verified
            </Badge>
          ) : null}
          {isFeatured ? (
            <span className="absolute right-[-42px] top-5 rotate-45 bg-black px-10 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
              Featured
            </span>
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
          {isProCreator ? (
            <Badge className="bg-black text-white">Pro Creator</Badge>
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
