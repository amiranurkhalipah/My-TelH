import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    description: "Get in touch via email",
    action: "mytelh.help@gmail.com",
    link: "mailto:mytelh.help@gmail.com",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Chat",
    description: "Prefer to chat? Send a message",
    action: "Start Chat",
    link: "#",
  },
];

export const ContactSection = () => {
  return (
    <div className="py-20 px-4 bg-black/30">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl mx-auto">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="glass-card p-8 rounded-xl flex-1 flex flex-col items-center text-center"
          >
            <div className="text-blue-400 mb-4">{method.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
            <p className="text-gray-400 mb-4">{method.description}</p>
            <Button
              variant="outline"
              className="mt-auto hover:bg-blue-400 hover:text-white"
              asChild
            >
              <a href={method.link}>{method.action}</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
