import { useState } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";

interface UserMenuProps {
  user: { name: string };
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-4 py-2 bg-white border rounded-md shadow-md hover:bg-gray-100 transition"
      >
        <FiUser className="mr-2 text-gray-600" />
        {user.name}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 transition"
          >
            <FiLogOut className="mr-2" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
