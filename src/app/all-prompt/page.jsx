// import { getPromptsFromCreators } from "@/lib/api/prompts";
// import PromptCardsClient from "./PromptsCardClient";

// const AllPromptsPage = async () => {
//   const prompts = await getPromptsFromCreators();

//   return (
//     <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-4 pt-32">
//       <div>
//         <h1 className="text-xl sm:text-2xl font-medium text-[#115a88]">
//           All prompts
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">
//           {prompts.length} prompt{prompts.length !== 1 ? "s" : ""} from the community
//         </p>
//       </div>

//       <PromptCardsClient prompts={prompts} />
//     </div>
//   );
// };

// export default AllPromptsPage;



// app/all-prompt/page.jsx
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
