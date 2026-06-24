import ErrorPage from '@/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage 
      title="404 - Page Not Found" 
      message="The page you are looking for does not exist or has been moved." 
    />
  );
}