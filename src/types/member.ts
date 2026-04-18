export type ProjectRole = "ADMIN" | "WORKER";

export interface ProjectMember {
  role: ProjectRole;
  user: {
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface ProjectParticipant {
  username: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AddMemberDto {
  username: string;
}
