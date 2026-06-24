
import PromptCardsClient from "./PromptsCardClient";

const AllPromptsPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-4 pt-32">
      <div>
        <h1 className="text-xl sm:text-2xl font-medium text-[#115a88]">All prompts</h1>
      </div>
      <PromptCardsClient />
    </div>
  );
};

export default AllPromptsPage;
