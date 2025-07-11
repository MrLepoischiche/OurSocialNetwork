import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page as the first page
    router.replace('/login');
  }, [router]);

  return null;
};

export default Index;
