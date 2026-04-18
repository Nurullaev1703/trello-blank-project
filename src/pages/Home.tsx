import { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject, useProjects, Project } from "@/services/projectService";
import { FolderPlusIcon, ProjectorScreenIcon, WarningCircleIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { CustomModal } from "@/components/ui/custom-modal";

interface CreateProjectForm {
  name: string;
}

export const Home: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<CreateProjectForm>({
    defaultValues: {
      name: "",
    },
  });
  const { success, error } = useToast();
  
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError, error: projectsError } = useProjects();

  const onSubmit = (data: CreateProjectForm) => {
    createProject(data, {
      onSuccess: () => {
        success("Project created successfully!");
        reset(); // Clear the form
        setIsModalOpen(false); // Close the modal
      },
      onError: (err: any) => {
        error(err.message || "Failed to create project");
      },
    });
  };

  const handleOpenModal = () => {
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ProjectorScreenIcon className="text-primary" weight="fill" />
            Projects Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your ongoing and upcoming projects.
          </p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center gap-2 shadow-md">
          <FolderPlusIcon weight="bold" size={20} />
          <span>New Project</span>
        </Button>
      </div>

      {isProjectsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="animate-spin mb-4 text-primary">
            <SpinnerGapIcon size={40} weight="bold" />
          </div>
          <p>Loading projects...</p>
        </div>
      ) : isProjectsError ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          <WarningCircleIcon size={48} weight="duotone" className="mb-2" />
          <h3 className="text-lg font-bold">Failed to Load Projects</h3>
          <p className="text-sm">{projectsError?.message || "An unknown error occurred"}</p>
        </div>
      ) : projects?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-xl">
          <ProjectorScreenIcon size={64} weight="duotone" className="text-primary/50 mb-4" />
          <h3 className="text-xl font-bold mb-1">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            You don't have any projects running. Let's set up a new environment to start your work.
          </p>
          <Button onClick={handleOpenModal} size="md">
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects?.map((project: Project) => (
            <div
              key={project.id}
              className="group p-6 rounded-2xl bg-white/10 border border-white/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <h3 className="font-bold text-lg mb-2 truncate">{project.name}</h3>
              <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium">ID: {project.id.slice(0, 8)}...</span>
                <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Creation Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Provide a memorable name for your team's new project space."
      >
        <form className="w-full flex flex-col gap-5 pt-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Project name is required",
              minLength: {
                value: 3,
                message: "Project name must be at least 3 characters",
              },
            }}
            render={({ field, fieldState: { error: fieldError } }) => (
              <Input
                {...field}
                label="Project Name"
                placeholder="e.g. My awesome project"
                error={!!fieldError}
                helperText={fieldError?.message}
                disabled={isCreating}
              />
            )}
          />

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};
