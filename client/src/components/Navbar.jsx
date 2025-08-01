"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { removeCookie } from "@/api/usersApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    let data = await removeCookie();
    if (data) {
      toast.success(data.msg);
      logout();
      router.push("/");
    }
  };
  return (
    <nav className="flex-no-wrap fixed top-0 z-10 w-full text-gray-900 dark:text-white text-base font-medium flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 ring shadow-xl ring-gray-900/5">
      <div>
        <Link href="/" className="flex items-center">
          <img src="/icon.png" alt="Website Icon" width="40" height="40" />
          <span>CreatorsHub</span>
        </Link>
      </div>

      {/* Desktop Navbar */}
      <NavigationMenu.Root className="hidden md:flex">
        <NavigationMenu.List className="flex gap-4 items-center">
          <NavigationMenu.Item>
            <Link href="/">Explore</Link>
          </NavigationMenu.Item>

          {user ? (
            <>
              {/* Profile */}
              {!user.isAdmin && (
                <NavigationMenu.Item>
                  <Link href="/profile">Profile</Link>
                </NavigationMenu.Item>
              )}

              {user.isAdmin && (
                <NavigationMenu.Item>
                  <Link href="/admin/dashboard" className="hover:text-blue-600">
                    Dashboard
                  </Link>
                </NavigationMenu.Item>
              )}

              <NavigationMenu.Item>
                <button className="cursor-pointer" onClick={handleLogout}>
                  Sign Out
                </button>
              </NavigationMenu.Item>
            </>
          ) : (
            <>
              {/* Register */}
              <NavigationMenu.Item>
                <Link href="/register">Register</Link>
              </NavigationMenu.Item>

              {/* Login */}
              <NavigationMenu.Item>
                <Link href="/login">Login</Link>
              </NavigationMenu.Item>
            </>
          )}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Dialog.Root>
          <Dialog.Trigger className="p-2">
            <HamburgerMenuIcon className="w-6 h-6" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
            <Dialog.Content
              className="fixed top-0 right-0 w-64 h-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium px-5 py-2.5 text-center me-2 mb-2 z-50 flex flex-col p-4"
              aria-describedby="navigation"
            >
              <VisuallyHidden>
                <Dialog.Title>Navigation</Dialog.Title>
                <Dialog.Description>
                  Open this to access navigation links for the website
                </Dialog.Description>
              </VisuallyHidden>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Menu</span>
                <Dialog.Close>
                  <Cross2Icon className="w-5 h-5" />
                </Dialog.Close>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/">Explore</Link>
                {user ? (
                  <>
                    <Link href="/profile">Profile</Link>

                    {user.isAdmin && (
                      <Link href="/admin/dashboard">Dashboard</Link>
                    )}

                    <button className="cursor-pointer" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                  </>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
}
