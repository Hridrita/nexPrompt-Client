import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { TopCreators } from "@/components/TopCreators";
import { CustomerReviews } from "@/components/CustomReview";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <HowItWorks></HowItWorks>
      <WhyChooseUs></WhyChooseUs>
      <TopCreators></TopCreators>
      <CustomerReviews></CustomerReviews>
      <FAQ></FAQ>
    </div>
  );
}
