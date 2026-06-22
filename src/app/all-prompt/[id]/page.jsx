import PromptDetailsClient from "@/components/PromptDetailsClient";
import { getPromptById } from "@/lib/api/prompts";
import { notFound } from "next/navigation";

const PromptDetailsPage = async ({ params }) => {
  const { id } = await params;
  const prompt = await getPromptById(id);
  console.log("prompt details", prompt);

  if (!prompt) return notFound();

  return <PromptDetailsClient prompt={prompt} />;
};

export default PromptDetailsPage;