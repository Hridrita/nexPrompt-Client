import Image from "next/image";
import HeroSection from "./components/HeroSection";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { TopCreators } from "./components/TopCreators";
import { CustomerReviews } from "./components/CustomReview";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <WhyChooseUs></WhyChooseUs>
      <TopCreators></TopCreators>
      <CustomerReviews></CustomerReviews>
    </div>
  );
}
