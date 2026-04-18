import { FC, useState } from "react";
import { MagnifyingGlassIcon, SpinnerGapIcon, UserCircleIcon, UserPlusIcon, UsersIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomModal } from "@/components/ui/custom-modal";
import {
  useProjectMembers,
  useProjectParticipants,
  useAddMember,
} from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { ProjectMember, ProjectParticipant } from "@/types/member";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-primary/20 text-primary border border-primary/30",
  WORKER: "bg-white/10 text-muted-foreground border border-white/20",
};

export const MembersModal: FC<MembersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { success, error } = useToast();

  const {
    data: members,
    isLoading: isMembersLoading,
  } = useProjectMembers(projectId);

  const { data: participants } = useProjectParticipants(projectId);

  const { mutate: addMember, isPending: isAdding } = useAddMember(projectId);

  // Local filtering — no extra API call needed
  const filtered: ProjectParticipant[] =
    participants?.filter((p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const handleAdd = (username: string) => {
    addMember(
      { username },
      {
        onSuccess: () => success(`${username} added to the project!`),
        onError: (err: any) =>
          error(err.message || "Failed to add member"),
      }
    );
  };

  const getInitial = (member: ProjectMember) =>
    member.user.firstName?.charAt(0) ?? member.user.username.charAt(0).toUpperCase();

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Members"
      description={`Manage who has access to "${projectName}"`}
      className="max-w-lg"
    >
      {/* ── Current members ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <UsersIcon size={14} className="text-muted-foreground" weight="bold" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Current Members
          </span>
          {members && (
            <span className="ml-auto text-xs text-muted-foreground">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isMembersLoading ? (
          <div className="flex items-center gap-2 py-4 text-muted-foreground">
            <SpinnerGapIcon className="animate-spin" size={18} />
            <span className="text-sm">Loading members...</span>
          </div>
        ) : members?.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No members yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {members?.map((m: ProjectMember) => (
              <li
                key={m.user.username}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {getInitial(m)}
                </div>
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{m.user.username}</p>
                  {(m.user.firstName || m.user.lastName) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[m.user.firstName, m.user.lastName].filter(Boolean).join(" ")}
                    </p>
                  )}
                </div>
                {/* Role badge */}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    roleColors[m.role] ?? "bg-white/10"
                  }`}
                >
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10 mb-5" />

      {/* ── Add member ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UserPlusIcon size={14} className="text-muted-foreground" weight="bold" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Add Member
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            weight="bold"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="pl-9"
          />
        </div>

        {/* Participants list */}
        {participants === undefined ? (
          <div className="flex items-center gap-2 py-3 text-muted-foreground">
            <SpinnerGapIcon className="animate-spin" size={18} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <UserCircleIcon size={36} weight="duotone" className="mb-2 opacity-40" />
            <p className="text-sm">
              {searchQuery ? `No users matching "${searchQuery}"` : "Everyone is already in the project!"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {filtered.map((p: ProjectParticipant) => (
              <li
                key={p.username}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-muted-foreground font-bold text-sm flex-shrink-0">
                  {(p.firstName?.charAt(0) ?? p.username.charAt(0)).toUpperCase()}
                </div>
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.username}</p>
                  {(p.firstName || p.lastName) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[p.firstName, p.lastName].filter(Boolean).join(" ")}
                    </p>
                  )}
                </div>
                {/* Add button */}
                <Button
                  size="sm"
                  onClick={() => handleAdd(p.username)}
                  disabled={isAdding}
                  className="flex-shrink-0"
                >
                  {isAdding ? (
                    <SpinnerGapIcon className="animate-spin" size={14} />
                  ) : (
                    "Add"
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CustomModal>
  );
};
