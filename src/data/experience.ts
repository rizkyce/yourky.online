export interface Experience {
  id: string;
  type: "work" | "education";
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  location: string;
  description: string;
  responsibilities?: string[];
  techStack: string[];
}

export const experiences: Experience[] = [
  {
    id: "lintasarta",
    type: "work",
    company: "PT. Aplikanusa Lintasarta",
    companyUrl: "https://www.lintasarta.net/",
    role: "VSAT Operator – PT. Pertamina EP Drilling Project",
    period: "Aug 2024 – Present",
    location: "Indonesia",
    description:
      "Ensuring 24/7 VSAT network uptime for critical Pertamina drilling operations, performing maintenance on network devices, and preparing operational reports.",
    responsibilities: [
      "Monitored and ensured 24/7 VSAT network uptime for Pertamina drilling operations",
      "Performed routine maintenance on computers and network-supported devices",
      "Prepared daily, weekly, and final operational reports for management and technical evaluation",
      "Supported dashboard preparation for operational meetings",
      "Managed digital and physical documentation including material and fuel usage reports",
    ],
    techStack: ["VSAT", "Networking", "Monitoring", "Reporting"],
  },
  {
    id: "unsyiah-ra",
    type: "work",
    company: "Universitas Syiah Kuala",
    companyUrl: "https://unsyiah.ac.id/",
    role: "Research Assistant",
    period: "Jan 2023 – Jul 2024",
    location: "Banda Aceh",
    description:
      "Led research in IoT and deep learning, deploying LoRaWAN infrastructure on Google Cloud and developing AI-powered medical detection APIs.",
    responsibilities: [
      "Deployed and configured LoRaWAN servers on Google Cloud Platform",
      "Implemented MQTT communication protocol for IoT data transmission",
      "Developed deep learning-based APIs for breast cancer and tuberculosis detection",
      "Built web dashboards for monitoring IoT and smart home systems",
    ],
    techStack: [
      "Python",
      "GCP",
      "LoRaWAN",
      "MQTT",
      "TensorFlow",
      "Flask",
      "React",
    ],
  },
  {
    id: "unsyiah-la",
    type: "work",
    company: "Universitas Syiah Kuala",
    companyUrl: "https://unsyiah.ac.id/",
    role: "Laboratory Assistant",
    period: "Aug 2021 – Jul 2023",
    location: "Banda Aceh",
    description:
      "Guided students through Python programming, HCI, and embedded systems practicals. Led class sessions and evaluated student projects.",
    responsibilities: [
      "Assisted and guided students in Python Programming, HCI, and Embedded Systems",
      "Led practical classes and evaluated student projects",
      "Substituted lecturers during academic sessions",
    ],
    techStack: ["Python", "Arduino", "Embedded Systems", "HCI"],
  },
  {
    id: "telkom",
    type: "work",
    company: "Plasa Telkom WITEL Aceh",
    companyUrl: "https://www.telkom.co.id/",
    role: "Internship Trainee",
    period: "Jul 2022 – Aug 2022",
    location: "Banda Aceh",
    description:
      "Supported network assurance processes including IPv6 implementation and remote ticket handling.",
    responsibilities: [
      "Assisted in IPv6 implementation, remote ticket handling, and assurance processes",
      "Supported Telkom network service monitoring and improvement",
    ],
    techStack: ["Networking", "IPv6", "Telkom Systems"],
  },
  {
    id: "edu-unsyiah",
    type: "education",
    company: "Universitas Syiah Kuala",
    companyUrl: "https://unsyiah.ac.id/",
    role: "Bachelor of Computer Engineering",
    period: "Sep 2019 – Feb 2024",
    location: "Banda Aceh, Indonesia",
    description:
      "GPA: 3.56 / 4.00. Active in HIMATEKKOM, PKM & Gemastik competitions, Seulanga Community, and as Laboratory & Research Assistant.",
    techStack: [],
  },
  {
    id: "edu-bangkit",
    type: "education",
    company: "Bangkit Academy 2022",
    companyUrl: "https://grow.google/intl/id_id/bangkit/",
    role: "Certificate in Cloud Computing",
    period: "Feb 2022 – Jul 2022",
    location: "Indonesia (Online)",
    description:
      "Score: 86.45 / 100.00. Google-supported intensive program focused on cloud computing with GCP.",
    techStack: ["GCP", "Cloud Computing", "Kubernetes"],
  },
];

export const organizations = [
  {
    id: "himatekkom",
    name: "HIMATEKKOM",
    fullName: "Computer Engineering Student Association",
    role: "Head of Finance and Fundraising Division",
    period: "Jan 2022 – Jan 2023",
    location: "Banda Aceh",
  },
  {
    id: "seulanga",
    name: "Seulanga Community",
    fullName: "Seulanga Community",
    role: "Head of Web & Mobile Development Division",
    period: "Feb 2022 – Mar 2023",
    location: "Banda Aceh",
  },
];
