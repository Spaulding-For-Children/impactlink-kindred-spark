import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">By accessing and using the ImpactLink platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-4">ImpactLink is a collaborative platform connecting child welfare professionals, researchers, students, and agencies to share research, resources, and foster collaboration.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
          <p className="text-muted-foreground mb-4">Access to certain features requires registration, which is subject to administrator approval. You are responsible for maintaining the security of your account credentials.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Acceptable Use</h2>
          <p className="text-muted-foreground mb-4">Users agree to use the platform for professional and academic purposes related to child welfare research and practice. Any misuse, including uploading harmful content or violating others' intellectual property, is prohibited.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">Content uploaded by users remains the property of its respective authors. By sharing content on ImpactLink, you grant the platform a non-exclusive license to display and distribute it within the service.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">ImpactLink is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Contact</h2>
          <p className="text-muted-foreground mb-4">For questions about these terms, please contact us through the platform's contact form.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
