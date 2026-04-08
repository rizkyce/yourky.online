export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  featured: boolean;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
}

export type Project = ProjectData;

// Data has migrated to Firestore
export const projects: ProjectData[] = [];
