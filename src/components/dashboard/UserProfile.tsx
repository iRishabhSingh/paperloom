import React from "react";
import { FiEdit, FiUser } from "react-icons/fi";

interface UserProfileProps {
  name?: string;
  email?: string;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name = "John Doe",
  email = "john.doe@example.com",
  className = "",
}) => {
  return (
    <div className={`group flex w-full items-center gap-3 ${className}`}>
      {/* Avatar with subtle edit indicator */}
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-content">
          <FiUser size={20} aria-label="User avatar" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-base-100 shadow-sm">
          <FiEdit
            className="text-primary transition-transform group-hover:scale-110"
            size={10}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* User info with better typography */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium leading-tight">{name}</h3>
        <p className="truncate text-xs text-base-content/70">{email}</p>

        {/* Edit profile indicator with animated underline */}
        <div className="mt-0.5">
          <span className="relative inline-block text-xs font-medium text-primary">
            Edit Profile{" "}
            <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
