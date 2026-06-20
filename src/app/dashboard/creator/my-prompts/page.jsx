import { getPrompts } from "@/lib/api/prompts";
import PromptsTable from "./PromptsTable";


const MyPromptsPage = async () => {
  const prompts = await getPrompts();

  
  

  return (
    <PromptsTable prompts={prompts}
      
    />
  );
};

export default MyPromptsPage;