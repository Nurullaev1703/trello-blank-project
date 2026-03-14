import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Send, Bell, CheckCircle2, AlertCircle } from "lucide-react";

interface FormValues {
  email: string;
}

export const Home: React.FC = () => {
  const { toast, success, error, warning } = useToast();
  const [inputValue, setInputValue] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    success(`Submitted: ${data.email}`);
  };

  return (
    <div className="space-y-12 py-8 container mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Modern React Template
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          A premium starting point with Tailwind v4, TanStack Router/Query, and custom UI components.
        </p>
      </section>

      {/* Components Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Buttons Demo */}
        <section className="glass-dark p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Rocket className="text-primary" /> Buttons (CVA)
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => success("Primary action successful!")}>
              Primary
            </Button>
            <Button variant="secondary" onClick={() => toast("Secondary clicked")}>
              Secondary
            </Button>
            <Button variant="outline" onClick={() => toast("Outline clicked")}>
              Outline
            </Button>
            <Button variant="ghost" onClick={() => toast("Ghost hover")}>
              Ghost
            </Button>
            <Button variant="danger" onClick={() => error("Something went wrong!")}>
              Danger
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Send />
            </Button>
          </div>
        </section>

        {/* Inputs & Form Demo */}
        <section className="glass-dark p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="text-accent" /> Inputs & Form
          </h2>
          <div className="space-y-6">
            <div className="grid gap-4">
              <Input
                label="Outlined (Default)"
                placeholder="Basic input..."
                helperText="This is the default variant"
              />
              <Input
                variant="filled"
                label="Filled"
                placeholder="Filled style..."
              />
              <Input
                variant="standard"
                label="Standard"
                placeholder="Standard style (bottom border)..."
              />
              <Input
                label="Disabled / Blocked"
                placeholder="You can't type here"
                disabled
              />
              <Input
                label="Error state"
                placeholder="Invalid data..."
                error="This field has an error message"
              />
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-medium mb-4 text-primary">React Hook Form Integration Demo</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  placeholder="enter your email"
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email?.message}
                />
                <Button type="submit" className="w-full">Submit Form</Button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Feature Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Tailwind CSS v4", desc: "Native @theme support and OKLCH colors." },
          { title: "TanStack Stack", desc: "Type-safe routing and data fetching." },
          { title: "Lucide Icons", desc: "Beautifully simple pixel-perfect icons." },
          { title: "CVA Components", desc: "Easily extensible variant-based UI." },
          { title: "Toast System", desc: "Global notification context and hooks." },
          { title: "Glassmorphism", desc: "Modern semi-transparent UI utilities." },
        ].map((feat, i) => (
          <div key={i} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <h3 className="font-bold mb-1">{feat.title}</h3>
            <p className="text-sm text-muted-foreground">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
