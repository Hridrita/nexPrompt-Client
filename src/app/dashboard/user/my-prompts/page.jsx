import { getPromptsByCreators } from "@/lib/api/prompts";
import PromptsTable from "./PromptsTable";
import { getUserSession } from "@/lib/core/session";

const MyPromptsPage = async () => {
  const user = await getUserSession();
  const prompts = await getPromptsByCreators(user.id) ?? [];

  return <PromptsTable prompts={prompts} />;
};

export default MyPromptsPage;