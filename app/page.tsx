import Collections from '@/components/Collections';
import AuthWrapper from '@/components/AuthWrapper';

export default function Home() {
  return (
    <AuthWrapper>
      <Collections />
    </AuthWrapper>
  );
}
