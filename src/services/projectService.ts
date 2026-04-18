import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "./apiService";

export interface CreateProjectDto {
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

class ProjectService {
  async createProject(dto: CreateProjectDto) {
    const response = await apiService.post<Project>({
      url: "/v1/projects",
      dto,
    });
    
    if (response.statusCode >= 400) {
      throw new Error(response.message || "Failed to create project");
    }
    
    return response.data;
  }

  async getProjects() {
    const response = await apiService.get<Project[]>({
      url: "/v1/projects",
    });

    if (response.statusCode >= 400 || !response.data) {
      throw new Error(response.message || "Failed to fetch projects");
    }

    return response.data;
  }
}

export const projectService = new ProjectService();

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateProjectDto) => projectService.createProject(dto),
    onSuccess: () => {
      // Invalidate project list cache if there's a useQuery for fetching it
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
