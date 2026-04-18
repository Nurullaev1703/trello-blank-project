import { FC, useState } from "react";
import { Input } from "./ui/input";
import { ImageBrokenIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { user, isLoading } = useAuth();

  const handleSearch = () => {
    console.log(searchValue);
  };

  return (
    <header className="sticky z-50 top-0 left-0 bg-white/20 py-4 border-b border-b-white backdrop-blur-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">Business</h1>
        <div className="max-w-md w-1/2 relative flex items-center gap-2">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="search"
            className="pl-10"
          />
          <MagnifyingGlassIcon
            className="absolute top-3 left-3"
            size={20}
            weight="bold"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex justify-center items-center font-bold text-background text-xl uppercase">
            {isLoading ? (
              <ImageBrokenIcon className="text-background" weight="duotone" />
            ) : user ? (
              user.username.charAt(0)
            ) : (
              <ImageBrokenIcon className="text-background" weight="duotone" />
            )}
          </div>
          <div>
            <h3>{isLoading ? "Loading..." : user?.username || "Guest"}</h3>
            <p className="text-muted-foreground">{isLoading ? "---" : user?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
