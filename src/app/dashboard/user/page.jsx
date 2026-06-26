import { redirect } from "next/navigation";

const UserDashboard = () => {
    redirect("/dashboard/user/my-prompts");
};

export default UserDashboard;