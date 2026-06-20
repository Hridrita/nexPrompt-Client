import { requireRole } from "@/lib/core/session";


const CreatorLayout = async({children}) => {
    await requireRole('creator');
    return children
};

export default CreatorLayout;