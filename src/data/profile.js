import velocityImg from '../assets/velocity.png';
import weatherImg from '../assets/weather.png';
import resumeImg from '../assets/resume-builder.png';

export const PROFILE = {
  hero: {
    summary: "Software engineer integrating cloud infrastructure, core development, and networking with AI as his sidekick."
  },
  about: {
    summary: "Your friendly neighbourhood Software Engineer with over 3 years of experience specializing in cloud infrastructure, high-performance CI/CD automation, and site reliability engineering. Adept at optimizing system architecture across GCP, Azure, and AWS to drive down cloud expenditures and maximize deployment frequencies. Leverages automated tooling and agile practices as a force multiplier to streamline complex release management, eliminate technical debt, and ensure zero-drift infrastructure stability.",
    experience: [
      {
        company: "NCR Atleos Corporation",
        position: "Software Engineer",
        period: "Feb 2025 - Present",
        responsibilities: [
          "Facilitated agile ceremonies and cleared blockers for an 18-member engineering squad, driving sprint predictability and process optimization as Scrum Master.",
          "Managed release lifecycles and cross-functional CI/CD coordination for the AMP Services Product on Azure, aligning delivery timelines and mitigating operational risks as Release Train Engineer (RTE).",
          "Functioned as primary Incident Commander for mission-critical production outages, architecting coordination strategies between Dev and Ops teams to significantly reduce Mean Time to Resolution.",
          "Spearheaded infrastructure provisioning and environment setup using GCP (GKE, Compute Engine), utilizing Jenkins, Helm, and Ansible to maintain high availability and deployment velocity.",
          "Conducted self-initiated legacy upgrades and continuous drift detection, successfully maintaining zero configuration drift across multi-cloud environments."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Software Engineer",
        period: "May 2023 - Feb 2025",
        responsibilities: [
          "Developed automated scripts and engineered resource allocation strategies on GCP, delivering a 34.56% reduction in cloud infrastructure costs via precision instance rightsizing and auto-scaling.",
          "Architected automated database maintenance blueprints and failover strategies utilizing Terraform and Ansible, decreasing database-related production incidents by 24%.",
          "Orchestrated environment deployment for the Authentic Switch application across production and staging GCP environments using Terraform, establishing fully reproducible, scalable infrastructure."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Trainee Software Engineer",
        period: "Jan 2023 - Apr 2023",
        responsibilities: [
          "Automated Jenkins-based deployment pipelines for the flagship Domino’s App (Jubilant Foods), radically minimizing manual interventions and reducing deployment cycle times.",
          "Managed Linux virtual environments and leveraged AWS core services to dynamically provision scalable staging environments for cross-functional development teams."
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
      title: "Velocity",
      description: "Network Speed Testing Application designed to measure download, upload, and latency with high precision.",
      link: "https://velocity-speedtest.netlify.app/",
      repo: "https://github.com/someshdayama/velocity",
      techStack: ["React", "Vite", "JavaScript", "CSS"],
      image: velocityImg,
      year: "2024"
    },
    {
      title: "Ambient Weather",
      description: "Real-time atmospheric data app providing beautifully designed weather forecasts and environmental conditions.",
      link: "https://ambientweather.netlify.app/",
      repo: "https://github.com/someshdayama/ambient-weather",
      techStack: ["React", "Vite", "OpenWeather API"],
      image: weatherImg,
      year: "2023"
    },
    {
      title: "Promptly",
      description: "AI Resume Generator that crafts tailored professional resumes using advanced language models.",
      link: "https://resumebuilder-promptly.vercel.app/",
      repo: "https://github.com/someshdayama/promptly",
      techStack: ["Next.js", "TailwindCSS", "OpenAI API"],
      image: resumeImg,
      year: "2024"
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
