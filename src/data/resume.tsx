import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Jay",
  initials: "JY",
  url: "https://jayfolio.vercel.app",
  location: "Ile-Ife, Nigeria",
  locationLink: "https://goo.gl/maps/8Q1KZJ8v1Zz",
  description:
    "Software Engineer. I love building cool things with code. I'm currently working on a few projects and looking for new opportunities.",
  summary:
    "Yo! My name is Yanfunmi Jeje, everyone calls me Jay, and I'm a software engineer. I have 3+ years experience building software products, i like challenging myself and learning new things. I'm currently working on a few projects and looking for new opportunities.",
  avatarUrl: "/me.png",
  skills: [
    "React",
    "React-native",
    "Next.js",
    "Typescript",
    "Python",
    "Go",
    "Postgres",
    "Softr",
    "Airtable",
    "Supabase",
    "Hugo",
    "AI",
    "Bubble"
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "https://dubjay.hashnode.dev", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "jejeniyi7@gmail.com",
    tel: "+2349130860401",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Dubjay18",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/dubjay/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/YanfunmiJ",
        icon: Icons.x,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:jejeniyi7@gmail.com",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Shippack",
      href: "https://theshippack.com/",
      badges: [],
      location: "Remote",
      title: "Frontend Web Developer",
      logoUrl: "/theshippack_logo.jpg",
      start: "Sep 2023",
      end: "Apr 2024",
      description:
        "Built the Shippack website and webapp with next.js and typescript.",
    },
    {
      company: "Codegarage Africa",
      badges: [],
      href: "https://codegarage.africa/",
      location: "Remote",
      title: "Frontend Engineer",
      logoUrl: "/codegarage.jpg",
      start: "March 2023",
      end: "Sep 2023",
      description:
        "rafted a captivating frontend codebase from the ground up, utilizing cutting-edge technologies like Next.js, Typescript, Tailwind CSS, and Rsuite",
    },
    {
      company: "Veenode Technologies",
      href: "https://veenode.com/",
      badges: ["Next.js", "React-native"],
      location: "Remote",
      title: "Frontend & mobile Engineer",
      logoUrl: "/veenode_technologies_logo.jpg",
      start: "August 2022",
      end: "January 2023",
      description:
        "Worked with the Flutipay team to build a web app for their payment platform using React, Typescript, and Tailwind CSS also worled a bit with the Telneting mobile team.",
    },
  ],
  education: [
    {
      school: "Obafemi Awolowo University",
      href: "https://oauife.edu.ng/",
      degree: "Bachelor's Degree of Computer Science with Mathematices (BSC)",
      logoUrl: "/oau.png",
      start: "2021",
      end: "present",
    },
  ],
  projects: [
    {
      title: "Treate",
      href: "https://treate.ng/",
      dates: "May 2024",
      active: true,
      description:
        "At Treate, we harness visionary talent and cutting-edge blockchain and AI technologies to shape the future. We connect minds, coach excellence, and create solutions that tackle today's issues with tomorrow's tools. Our commitment ensures every project not only anticipates but actively shapes the future.",
      technologies: [
        "Framer motion",
        "Typescript",
        "TailwindCSS",
        "React",
      ],
      links: [
        {
          type: "Source - web",
          href: "https://treate.ng/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/treate.png",
      video: "",
    },
    {
      title: "Telneting",
      href: "https://telneting.com/",
      dates: "May 2023",
      active: true,
      description:
        "Telneting communication is an enterprise that strengthens the human and business end- to-end connection and communication by providing affordable internet services, automated online bills payment, a suite of voice and business and family connectivity solutions.",
      technologies: [
        "React-native",
        "Typescript",
        "TailwindCSS",
        "React",
      ],
      links: [
        {
          type: "Source - web",
          href: "https://telneting.com/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source - mobile",
          href: "https://play.google.com/store/apps/details?id=com.telnetingveenode.app",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/telneting.png",
      video: "",
    },
    {
      title: "QRaven",
      href: "https://github.com/Dubjay18/QRaven",
      dates: "May 2024 - Present",
      active: true,
      description:
        "QRaven is a QR code ticketing system for events. It allows event organizers to create events, generate QR codes for attendees, and scan QR codes at the event entrance to verify attendance.",
      technologies: [
        "React-native",
        "Golang",
        "Typescript",
        "PostgreSQL",
        "TailwindCSS",
      ],
      links: [
        {
          type: "Source - backend",
          href: "https://github.com/Dubjay18/QRaven",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Source - mobile",
          href: "https://github.com/Dubjay18/QRaven-mobile",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/Qraven-logo.webp",
      video: "",
    },
    {
      title: "Ushort",
      href: "https://github.com/Dubjay18/Ushort",
      dates: "...",
      active: true,
      description:
        "Ushort is a URL shortening service that allows users to shorten long URLs into short, easy-to-remember links.",
      technologies: ["Golang", "HTMX", "TailwindCSS", "Redis"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Dubjay18/Ushort",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/ushort.webp",
      video: "",
    },
    {
      title: "Jaypexel",
      href: "https://jaypexel.vercel.app/",
      dates: "April 2023",
      active: true,
      description:
        "A site filled with free pictures and videos that can be download on the pexels main site. This was built with Next.js, Tailwind CSS, pexels Api, Framer motion.",
      technologies: ["Next.js", "Typescript", "TailwindCSS"],
      links: [
        {
          type: "Website",
          href: "https://jaypexel.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/Dubjay18/Jaypexel",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/jaypexel.png",
      video: "",
    },
    {
      title: "Mov",
      href: "https://github.com/Dubjay18/Mov-mobile",
      dates: "june 2024",
      active: true,
      description:
        "Mov is a mobile app that allows users to find and book movie tickets at nearby theaters. Users can also view movie showtimes, trailers, and reviews.",
      technologies: ["React-native", "Typescript", "TailwindCSS", "expo"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Dubjay18/Mov-mobile",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/mov.jpg",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "Sandstore",
      dates: "March 2024 - May 2024",
      location: "Remote",
      description: "Contract work to help fix bugs on the ecommerce site.",
      image: "/sands.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [
        {
          title: "Website",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://www.sandsstores.com/",
        },
      ],
    },
    {
      title: "NativMD",
      dates: "February 2024 - March 2024",
      location: "Remote",
      description:
        "Contract work to help build the NativMD website using Nextjs and Typescript.",
      image: "/nativmd.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Zush",
      dates: "April 2024 - May 2024",
      location: "--",
      description:
        "Side Project - Basic mobile app that allows users to create and share short videos.",
      icon: "public",
      image: "/zush.png",
      links: [
        {
          title: "Demo",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://appetize.io/app/b_3uiat4glvuwc4hoapfcmx2fs6q?device=pixel7&osVersion=13.0",
        },
      ],
    },
    {
      title: "Greenlit",
      dates: "February 2024 - March 2024",
      location: "",
      description:
        "Side project - Green-Lit API is a RESTful API built with Go. It provides functionalities for user authentication, article management, and user management.",
      image: "/me.png",
      links: [
        {
          title: "Github",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Dubjay18/green-lit",
        },
      ],
    },
    {
      title: "JaySlack",
      dates: "2021",
      location: "",
      description:
        "A slack-clone with group chat functionality and google authentication. Built with React js, Material UI, Firebase",
      image: "/me.png",
      win: "Best Data Hack",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg",
      links: [
        {
          title: "Webapp",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://slack-clone-51ace.web.app/",
        },
        {
          title: "GitHub",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Dubjay18/slack-clone",
        },
      ],
    },
  ],
} as const;
