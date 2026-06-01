import velocityImg from '../assets/velocity.png';
import weatherImg from '../assets/weather.png';
import resumeImg from '../assets/resume-builder.png';

export const PROFILE = {
  hero: {
    summary: "Software engineer integrating cloud infrastructure, core development, and networking with AI as his sidekick."
  },
  about: {
    summary: "Software Engineer with over 3 years of experience focusing on cloud infrastructure, CI/CD automation, and site reliability. Experienced in managing and optimizing system architectures across GCP, Azure, and AWS to improve deployment efficiency and manage cloud costs. Utilizes automation and agile workflows to streamline release processes, reduce technical debt, and maintain multi-cloud infrastructure stability.",
    experience: [
      {
        company: "NCR Atleos Corporation",
        position: "Software Engineer",
        period: "Feb 2025 - Present",
        responsibilities: [
          "Release Coordination: Managed multi-team release lifecycles and CI/CD alignment for the Azure-based AMP Services Product, minimizing delivery risks.",
          "Agile Facilitation: Acted as Scrum Master for an 18-member squad, clearing blockers and running ceremonies to improve sprint predictability.",
          "Cloud Provisioning: Automated infrastructure setups on GCP and Azure using Jenkins, Github Actions, Helm, and Ansible to maintain high availability."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Software Engineer",
        period: "May 2023 - Feb 2025",
        responsibilities: [
          "Developed automated scripts and engineered resource allocation strategies on GCP, delivering a 34.56% reduction in cloud infrastructure costs.",
          "Architected automated database maintenance blueprints and failover strategies utilizing Terraform and Ansible.",
          "Orchestrated environment deployment for the Authentic Switch application using Terraform."
        ]
      },
      {
        company: "Monocept Consulting Pvt. Ltd.",
        position: "Trainee Software Engineer",
        period: "Jan 2023 - Apr 2023",
        responsibilities: [
          "Automated Jenkins-based deployment pipelines for the flagship Domino’s App (Jubilant Foods).",
          "Managed Linux virtual environments and leveraged AWS core services to dynamically provision scalable staging environments."
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
      { name: "GCP" },
      { name: "AWS" },
      { name: "Azure" },
      { name: "Terraform" },
      { name: "Ansible" },
      { name: "Docker" },
      { name: "Kubernetes (GKE)" },
      { name: "Helm" },
      { name: "Jenkins" },
      { name: "GitHub Actions" },
      { name: "Python" },
      { name: "Java" },
      { name: "Prometheus" },
      { name: "Grafana" }
    ]
  },
  projects: [
    {
      title: "Velocity",
      description: "Network Speed Testing Application",
      link: "https://velocity-speedtest.netlify.app/",
      image: velocityImg,
      year: "2024"
    },
    {
      title: "Ambient Weather",
      description: "Real-time atmospheric data",
      link: "https://ambientweather.netlify.app/",
      image: weatherImg,
      year: "2023"
    },
    {
      title: "Promptly",
      description: "AI Resume Generator",
      link: "https://resumebuilder-promptly.vercel.app/",
      image: resumeImg,
      year: "2024"
    }
  ]
};
