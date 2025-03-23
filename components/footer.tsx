import { ModeToggle } from "@/components/ui/mode-toggle";
import { Footer, FooterBottom } from "@/components/ui/footer";
import { Github, GithubIcon, Linkedin, Mail } from "lucide-react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function FooterSection() {

    // Function to get the current year
const getCurrentYear = () => new Date().getFullYear();
  return (
    <footer className="w-full bg-background px-4">
      <div className="mx-auto max-w-container">
        <Footer className="pt-0">
          <FooterBottom className="mt-0 flex flex-col items-center gap-4 sm:flex-col md:flex-row">
          <div>© {getCurrentYear()} Ai Image Generator. All rights reserved</div>
            <div className="flex items-center gap-4">
              <a href="login">Sign in</a> <a href="register">Sign up</a>|
              <a href="https://github.com/saqlain991/Image-Gen_AI"><GithubIcon  /></a>
              <a href="https://www.linkedin.com/in/saqlain-sultan"><Linkedin /></a>
              <a href="mailto:saqlainsultan991@gmail.com"><Mail /></a>
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
