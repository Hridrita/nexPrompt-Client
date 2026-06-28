import PromptDetailsClient from "@/components/PromptDetailsClient";
import { getPromptById } from "@/lib/api/prompts";
import { notFound } from "next/navigation";

const PromptDetailsPage = async ({ params }) => {
  const { id } = await params;
  const prompt = await getPromptById(id);
  // console.log("prompt details", prompt);

  if (!prompt) return notFound();

  //  if (prompt.error && prompt.isLocked) {
    
  //   return <PromptDetailsClient 
  //     prompt={{ 
  //       _id: prompt._id,
  //       visibility: "private",
  //       isLocked: true,
  //       title: "Premium Prompt",
  //       description: prompt.message || "This is a private premium prompt.",
  //       creator: { name: "Premium Creator", image: null, role: null },
  //       reviews: [],
  //       rating: 0,
  //       copyCount: 0,
  //       content: "",
  //       tags: [],
  //       category: "",
  //       difficulty: "",
  //       aiTool: "",
  //       thumbnail: null,
  //       createdAt: new Date().toISOString(),
  //     }} 
  //     isLocked={true} 
  //     lockMessage={prompt.message}
  //   />;
  // }

  return <PromptDetailsClient prompt={prompt} isLocked={prompt.isLocked ?? false}  />;
};

export default PromptDetailsPage;