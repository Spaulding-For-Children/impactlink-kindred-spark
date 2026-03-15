import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>

          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">We collect information you provide during registration (name, email, organization, phone number) and profile creation (professional details, research interests, bio). We also collect usage data to improve the platform.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">Your information is used to operate the platform, facilitate collaboration between users, provide partner matching, send event notifications, and improve our services.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground mb-4">Your profile information is visible to other registered users for collaboration purposes. We do not sell your personal data to third parties. We may share data with service providers who help operate the platform.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p className="text-muted-foreground mb-4">We implement industry-standard security measures to protect your data, including encrypted connections, secure authentication, and row-level access controls on our database.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h2>
          <p className="text-muted-foreground mb-4">You may access, update, or delete your profile information through the Profile Settings page. To request complete account deletion, please contact the site administrator.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Cookies</h2>
          <p className="text-muted-foreground mb-4">We use essential cookies for authentication and session management. No third-party tracking cookies are used.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Contact</h2>
          <p className="text-muted-foreground mb-4">For privacy-related inquiries, please use the contact form on our platform or email the site administrator.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
