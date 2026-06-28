import { getUserSession } from '@/lib/core/session';
import ProfileClient from './ProfileClient';

const ProfilePage = async () => {
  const user = await getUserSession();
  return <ProfileClient initialUser={user} />;
};

export default ProfilePage;