import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-4">
          <Button variant="link" asChild>
            <a href="/about">About</a>
          </Button>
          <Button variant="link" asChild>
            <a href="/contact">Contact</a>
          </Button>
          <Button variant="link" asChild>
            <a href="/terms">Terms of Service</a>
          </Button>
          <Button variant="link" asChild>
            <a href="/privacy">Privacy Policy</a>
          </Button>
        </div>
        <p className="mt-2">© 2025 RideShareX</p>
      </div>
    </footer>
  );
};

export default Footer;