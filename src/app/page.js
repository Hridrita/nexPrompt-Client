import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { TopCreators } from "@/components/TopCreators";
import { CustomerReviews } from "@/components/CustomReview";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import Featured from "@/components/Featured";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <Featured></Featured>
      <WhyChooseUs></WhyChooseUs>
      <TopCreators></TopCreators>
      <CustomerReviews></CustomerReviews>
      <HowItWorks></HowItWorks>
      <FAQ></FAQ>
    </div>
  );
}
