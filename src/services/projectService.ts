import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "./apiService";
import {
  AddMemberDto,
  ProjectMember,
  ProjectParticipant,
} from "@/types/member";

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

  async getMembers(projectId: string) {
    const response = await apiService.get<ProjectMember[]>({
      url: `/v1/projects/${projectId}/members`,
    });
    if (response.statusCode >= 400 || !response.data) {
      throw new Error(response.message || "Failed to fetch members");
    }
    return response.data;
  }

  async getParticipants(projectId: string) {
    const response = await apiService.get<ProjectParticipant[]>({
      url: `/v1/projects/${projectId}/participants`,
    });
    if (response.statusCode >= 400 || !response.data) {
      throw new Error(response.message || "Failed to fetch participants");
    }
    return response.data;
  }

  async addMember(projectId: string, dto: AddMemberDto) {
    const response = await apiService.post<string>({
      url: `/v1/projects/${projectId}/members`,
      dto,
    });
    if (response.statusCode >= 400) {
      throw new Error(response.message || "Failed to add member");
    }
    return response.data;
  }
}

export const projectService = new ProjectService();

// ─── Project hooks ────────────────────────────────────────────

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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ─── Member hooks ─────────────────────────────────────────────

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => projectService.getMembers(projectId),
    enabled: !!projectId,
  });
};

export const useProjectParticipants = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "participants"],
    queryFn: () => projectService.getParticipants(projectId),
    enabled: !!projectId,
  });
};

export const useAddMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddMemberDto) => projectService.addMember(projectId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "participants"],
      });
    },
  });
};
