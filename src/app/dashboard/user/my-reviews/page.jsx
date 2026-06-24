import { getAllReviewsByUser } from '@/lib/api/review';
import { getUserSession } from '@/lib/core/session';
import MyReviewsClient from './MyReviewsClient';


const MyReviewPage = async () => {
  const user = await getUserSession();
  const reviews = await getAllReviewsByUser(user.email);
  return <MyReviewsClient reviews={reviews} />;
};

export default MyReviewPage;