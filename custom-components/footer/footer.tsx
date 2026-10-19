import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    // { label: "Courses", href: "/courses" },
    // { label: "Book a Tee Time", href: "/book" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "FAQs", href: "/faq" },
    { label: "Terms of Service", href: "/#" },
    { label: "Privacy Policy", href: "/#" },
    { label: "Cancellation Policy", href: "/#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61594913026452", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/yougolfbhutan/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/yougolfbhutan-undefined-51931b43a/", label: "Twitter" },
  ];

  return (
    <footer className="w-full bg-white relative">
      {/* Fairway stripe signature — mimics mown grass banding along a fairway */}
      <div
        className="h-2 w-full"
        // style={{
        //   backgroundImage:
        //     "repeating-linear-gradient(90deg, #15803d 0px, #15803d 40px, #16a34a 40px, #16a34a 80px)",
        // }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-14">
       

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10 py-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={"/logo.png"}
                alt="YouGolf Bhutan icon"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
              <span className="text-xl font-bold tracking-tight">
                <>
                  <span className="text-black">YouGolfBhutan</span>
                  {/* <span className="text-amber-500">Bhutan</span> */}
                </>
              </span>
            </Link>
            <p className="text-sm text-black-700 leading-relaxed max-w-xs">
              Book your round at one of the world highest courses.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-green-200 text-black-700 hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors duration-200"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-black-950 font-semibold text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-black-700 hover:text-black-950 transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-black-500">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-black-950 font-semibold text-sm uppercase tracking-wide">
              Support
            </h3>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-black-700 hover:text-black-950 transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-black-500">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-black-950 font-semibold text-sm uppercase tracking-wide">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-black-700">
                <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-green-50 text-black-600">
                  <MapPin size={14} />
                </span>
                <span className="pt-1">
                  Thimphu,Bhutan
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-black-700">
                <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-green-50 text-black-600">
                  <Phone size={14} />
                </span>
                <a
                  href="tel:+975 17875268"
                  className="hover:text-black-950 transition-colors"
                >
                  +975 17875268
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-black-700">
                <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-green-50 text-black-600">
                  <Mail size={14} />
                </span>
                <a
                  href="mailto:support@golfbook.com"
                  className="hover:text-black-950 transition-colors"
                >
                  yougolfbhuatan@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-green-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-black-600">
            © {year} GolfBook. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-black-600">
            <span>Made with</span>
            <span className="text-black-600">⛳</span>
            <span>for golf lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
