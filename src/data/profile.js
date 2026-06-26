import velocityImg from '../assets/velocity.webp';
import weatherImg from '../assets/weather.webp';
import resumeImg from '../assets/resume-builder.webp';
import radarImg from '../assets/career-radar.webp';

export const PROFILE = {
  hero: {
    summary: "Friendly neighbourhood Software Engineer building cloud infrastructure, automated pipelines, and custom AI agents."
  },
  about: {
    summary: "With over 3 years of experience in cloud infrastructure, CI/CD automation, and site reliability, I focus on optimizing architectures on GCP, Azure, and AWS to reduce costs and keep deployments fast. At NCR Atleos, I take care of the AMPS product as the Release Train Engineer (RTE), representing the product at the management level, aligning release cycles and mitigating risks. Recently I've also been building custom AI agents to automate development workflows.",
    experience: [
      {
        company: "NCR Atleos Corporation",
        position: "Software Engineer",
        period: "Feb 2025 - Present",
        responsibilities: [
          "Manage release lifecycles and cross-functional CI/CD coordination on Azure as the Release Train Engineer (RTE).",
          "Serve as Scrum Master for an 18-member squad, facilitating ceremonies and clearing blockers to boost velocity.",
          "Writing and implementing CI/CD pipelines using Azure DevOps and Jenkins, also migrating Jenkins to Github Workflows.",
          "Provisioned and scaled Azure infrastructure (AKS, VM's) using Helm, Ansible, and Jenkins.",
          "Automating the process of initial development phase by implementing AI agents."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Software Engineer",
        period: "May 2023 - Feb 2025",
        responsibilities: [
          "Cut GCP infrastructure costs by 34.56% through precision instance rightsizing and auto-scaling scripts.",
          "Designed automated database maintenance and failover strategies using Terraform and Ansible, reducing incidents by 24%.",
          "Provisioned reproducible staging and production GCP environments for the Authentic Switch application using Terraform."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Trainee Software Engineer",
        period: "Jan 2023 - Apr 2023",
        responsibilities: [
          "Automated Jenkins pipelines for the Domino's App (Jubilant Foods) to cut down cycle times and manual efforts.",
          "Provisioned dynamic staging environments using AWS core services and managed Linux virtual environments."
        ]
      }
    ],
    education: [
      {
        degree: "Master of Computer Applications (MCA)",
        institution: "National Institute of Technology (NIT), Bhopal — 2023"
      },
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "Prestige Institute of Management and Research, Indore — 2020"
      }
    ],
    skills: [
      {
        category: "Cloud Providers",
        items: ["GCP", "AWS", "Azure"]
      },
      {
        category: "Infrastructure & Containerization",
        items: ["Terraform", "Ansible", "Docker", "Kubernetes (GKE)", "Helm"]
      },
      {
        category: "CI/CD & Automation",
        items: ["Jenkins", "GitHub Actions", "Maven"]
      },
      {
        category: "Scripting & Languages",
        items: ["Java", "Python", "Groovy", "Bash", "Linux Shell", "SQL"]
      },
      {
        category: "Observability & Tools",
        items: ["Prometheus", "Grafana", "Git", "JIRA"]
      },
      {
        category: "Concepts",
        items: ["System Design", "Agile/Scrum"]
      }
    ]
  },
  projects: [
    {
      title: "Career Radar",
      description: "Real-time job search and aggregation streaming dashboard scanning listings from top tech firms using Server-Sent Events (SSE).",
      link: "https://career-radar-smoky.vercel.app/",
      repo: "https://github.com/someshdayama/career-radar",
      techStack: ["Next.js", "React", "Server-Sent Events", "TailwindCSS"],
      image: radarImg
    },
    {
      title: "Velocity",
      description: "Network Speed Testing Application designed to measure download, upload, and latency with high precision.",
      link: "https://velocity-speedtest.netlify.app/",
      repo: "https://github.com/someshdayama/velocity",
      techStack: ["React", "Vite", "JavaScript", "CSS"],
      image: velocityImg
    },
    {
      title: "Promptly",
      description: "AI Resume Generator that crafts tailored professional resumes using advanced language models.",
      link: "https://resumebuilder-promptly.vercel.app/",
      repo: "https://github.com/someshdayama/promptly",
      techStack: ["Next.js", "TailwindCSS", "OpenAI API"],
      image: resumeImg
    },
    {
      title: "Ambient Weather",
      description: "Real-time atmospheric data app providing beautifully designed weather forecasts and environmental conditions.",
      link: "https://ambientweather.netlify.app/",
      repo: "https://github.com/someshdayama/ambient-weather",
      techStack: ["React", "Vite", "OpenWeather API"],
      image: weatherImg
    }
  ],
  contact: {
    email: "someshdayama2@gmail.com",
    phone: "+917049614849",
    socials: [
      { name: "LinkedIn", url: "https://www.linkedin.com/in/somesh-dayama/" },
      { name: "GitHub", url: "https://github.com/someshdayama" }
    ]
  }
};
