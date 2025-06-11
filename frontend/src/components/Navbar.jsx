// import NotificationPanel from "@/components/NotificationPanel";
// import { useAuth } from "@/context/AuthContext";
// import {
//   SignedIn,
//   SignedOut,
//   // SignInButton,
//   // SignUpButton,
//   // UserButton,
//   useUser,
//   useAuth as useClerkAuth,
// } from "@clerk/clerk-react";
// import { Crown, LogOut, Menu, ShoppingCart, User } from "lucide-react";
// import { useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// function Navbar({ notifications, setSubscriptionOpen }) {
//   const navigate = useNavigate();
//   const { user: contextUser, logout } = useAuth(); // Your existing auth context
//   const { user: clerkUser } = useUser(); // Clerk user
//   const { signOut } = useClerkAuth(); // Clerk auth methods
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Determine which user to show (prioritize Clerk user if available)
//   const currentUser = clerkUser || contextUser;
//   const isClerkUser = !!clerkUser;

//   const getNavLinkClass = (isActive) =>
//     isActive
//       ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//       : " hover:text-indigo-600";

//   const handleLogout = async () => {
//     try {
//       if (isClerkUser) {
//         await signOut();
//         navigate("/");
//       } else {
//         await logout();
//         navigate("/auth/login");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <nav id="top">
//       <div className="max-w-7xl mx-auto mt-3 md:bg-sky-50 float-delay flex items-center justify-between shadow-lg px-4 py-3 rounded-full">
//         {/* Left */}
//         <div>
//           <h1 className="text-3xl font-semibold">Logo</h1>
//         </div>

//         {/* Middle Nav - hidden on small screens */}
//         <div className="hidden sm:flex items-center gap-6">
//           <NavLink
//             to="/"
//             className={({ isActive }) => getNavLinkClass(isActive)}
//           >
//             Home
//           </NavLink>
//           <NavLink
//             to="/discussion"
//             className={({ isActive }) => getNavLinkClass(isActive)}
//           >
//             Discussion
//           </NavLink>
//           <NavLink
//             to="/guidance"
//             className={({ isActive }) => getNavLinkClass(isActive)}
//           >
//             Guidance
//           </NavLink>
//           <NavLink
//             to="/community-chat"
//             className={({ isActive }) => getNavLinkClass(isActive)}
//           >
//             Community chat
//           </NavLink>
//           <NavLink
//             to="/report"
//             className={({ isActive }) => getNavLinkClass(isActive)}
//           >
//             Report
//           </NavLink>
//         </div>

//         {/* Right - Desktop */}
//         <div className="hidden sm:flex items-center gap-2">
//           {/* Clerk Authentication */}
//           <SignedIn>
//             <div className="flex items-center gap-4">
//               <Button
//                 className="bg-blue-600 hover:bg-blue-500"
//                 onClick={() => setSubscriptionOpen(true)}
//               >
//                 Premium <Crown className="text-amber-400" />
//               </Button>

//               <ShoppingCart
//                 className="cursor-pointer hover:text-indigo-600"
//                 onClick={() => navigate("/cart")}
//               />
//               <NotificationPanel notifications={notifications} />

//               {/* Clerk UserButton with custom dropdown */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="focus-visible:outline-0">
//                   <Avatar className="h-9 w-9 cursor-pointer">
//                     <AvatarImage
//                       src={clerkUser?.imageUrl || clerkUser?.profileImageUrl}
//                       alt="User avatar"
//                       className="object-cover"
//                     />
//                     <AvatarFallback>
//                       {clerkUser?.firstName?.charAt(0)?.toUpperCase() ||
//                        clerkUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-30">
//                   <NavLink to="/dashboard">
//                     <Button className="w-full my-1"> Dashboard</Button>
//                   </NavLink>
//                   <DropdownMenuSeparator />
//                   <NavLink to="/profile">
//                     <DropdownMenuItem>
//                       <User />
//                       Profile
//                     </DropdownMenuItem>
//                   </NavLink>
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut />
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </SignedIn>

//           <SignedOut>
//             <div className="flex items-center gap-2">
//               {/* Route-based navigation for Clerk pages */}
//               <Button
//                 variant="outline"
//                 onClick={() => navigate('/sign-in')}
//               >
//                 Sign In
//               </Button>

//               <Button onClick={() => navigate('/sign-up')}>
//                 Sign Up
//               </Button>
//             </div>
//           </SignedOut>

//           {/* Fallback to traditional auth if not using Clerk */}
//           {!isClerkUser && currentUser && (
//             <div className="flex items-center gap-4">
//               <Button
//                 className="bg-blue-600 hover:bg-blue-500"
//                 onClick={() => setSubscriptionOpen(true)}
//               >
//                 Premium <Crown className="text-amber-400" />
//               </Button>

//               <ShoppingCart
//                 className="cursor-pointer hover:text-indigo-600"
//                 onClick={() => navigate("/cart")}
//               />
//               <NotificationPanel notifications={notifications} />

//               <DropdownMenu>
//                 <DropdownMenuTrigger className="focus-visible:outline-0">
//                   <Avatar className="h-9 w-9 cursor-pointer">
//                     <AvatarImage
//                       src={currentUser.imageUrl}
//                       alt="User avatar"
//                       className="object-cover"
//                     />
//                     <AvatarFallback>
//                       {currentUser.name?.charAt(0).toUpperCase() || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-30">
//                   <NavLink to="/dashboard">
//                     <Button className="w-full my-1"> Dashboard</Button>
//                   </NavLink>
//                   <DropdownMenuSeparator />
//                   <NavLink to="/profile">
//                     <DropdownMenuItem>
//                       <User />
//                       Profile
//                     </DropdownMenuItem>
//                   </NavLink>
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut />
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           )}

//           {/* Traditional auth fallback for non-Clerk users */}
//           {!isClerkUser && !currentUser && (
//             <>
//               <Link to="/auth/login">
//                 <Button variant="outline">Login</Button>
//               </Link>
//               <Link to="/auth/register">
//                 <Button>Sign Up</Button>
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Hamburger menu - visible only on small screens */}
//         <button
//           className="sm:hidden p-2 rounded-md hover:bg-gray-200"
//           onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           <Menu />
//         </button>
//       </div>

//       {/* Mobile menu content */}
//       {isMobileMenuOpen && (
//         <div className="sm:hidden mt-6 flex flex-col gap-4 px-4 bg-white shadow-lg rounded-lg p-4">
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//                 : "hover:text-indigo-600"
//             }
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Home
//           </NavLink>
//           <NavLink
//             to="/discussion"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//                 : "hover:text-indigo-600"
//             }
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Discussion
//           </NavLink>
//           <NavLink
//             to="/guidance"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//                 : "hover:text-indigo-600"
//             }
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Guidance
//           </NavLink>
//           <NavLink
//             to="/community-chat"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//                 : "hover:text-indigo-600"
//             }
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Community chat
//           </NavLink>
//           <NavLink
//             to="/report"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
//                 : "hover:text-indigo-600"
//             }
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Report
//           </NavLink>

//           {/* Mobile Auth Section */}
//           <div className="border-t pt-4 mt-4">
//             <SignedIn>
//               <div className="flex flex-col gap-2">
//                 <NavLink
//                   to="/profile"
//                   className="hover:text-indigo-600"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Profile
//                 </NavLink>
//                 <NavLink
//                   to="/dashboard"
//                   className="hover:text-indigo-600"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Dashboard
//                 </NavLink>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="hover:text-indigo-600 text-left"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </SignedIn>

//             <SignedOut>
//               <div className="flex flex-col gap-2">
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => {
//                     navigate('/sign-in');
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   Sign In
//                 </Button>
//                 <Button
//                   className="w-full"
//                   onClick={() => {
//                     navigate('/sign-up');
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   Sign Up
//                 </Button>
//               </div>
//             </SignedOut>

//             {/* Fallback for traditional auth */}
//             {!isClerkUser && currentUser && (
//               <div className="flex flex-col gap-2">
//                 <NavLink
//                   to="/profile"
//                   className="hover:text-indigo-600"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Profile
//                 </NavLink>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="hover:text-indigo-600 text-left"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}

//             {!isClerkUser && !currentUser && (
//               <div className="flex flex-col gap-2">
//                 <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
//                   <Button variant="outline" className="w-full">
//                     Login
//                   </Button>
//                 </Link>
//                 <Link
//                   to="/auth/register"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <Button className="w-full">Sign Up</Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

import NotificationPanel from "@/components/NotificationPanel";
import { useAuth } from "@/context/AuthContext";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignUpButton,
//   UserButton,
// } from "@clerk/clerk-react";
import { Crown, LogOut, Menu, ShoppingCart, User, Video } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Navbar({ notifications, setSubscriptionOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinkClass = (isActive) =>
    isActive
      ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
      : " hover:text-indigo-600";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav id="top">
      <div className="max-w-7xl mx-auto mt-3 md:bg-sky-50 float-delay flex items-center justify-between shadow-lg px-4 py-3 rounded-full">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-semibold">Logo</h1>
        </div>

        {/* Middle Nav - hidden on small screens */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Home
          </NavLink>
          <NavLink
            to="/mentors"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Find Mentors
          </NavLink>
          <NavLink
            to="/discussion"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Discussion
          </NavLink>
          {/* <NavLink
            to="/guidance"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Guidance
          </NavLink> */}
          <NavLink
            to="/community-chat"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Community chat
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Report
          </NavLink>
          {/* <NavLink
            to="/report"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Report
          </NavLink> */}
        </div>

        {/* Right - hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-500"
                onClick={() => navigate("/live-stream")}
              >
                Go live <Video className="text-amber-400" />
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-500"
                onClick={() => setSubscriptionOpen(true)}
              >
                Premium <Crown className="text-amber-400" />
              </Button>

              {/* <ShoppingCart onClick={() => navigate("/cart")} /> */}
              <NotificationPanel notifications={notifications} />

              <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:outline-0">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={user.imageUrl}
                      alt="@shadcn"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                  <NavLink to="dashboard">
                    <Button className="w-full my-1"> Dashboard</Button>
                  </NavLink>
                  <DropdownMenuSeparator />
                  <NavLink to="profile">
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </NavLink>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Clerk Auth  */}

        {/* Hamburger menu - visible only on small screens */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-gray-200"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile menu content (optional, you can implement if needed) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-6 flex flex-col gap-4 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
                : "hover:text-indigo-600"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/discussion"
            className={({ isActive }) =>
              isActive
                ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
                : "hover:text-indigo-600"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Discussion
          </NavLink>
          <NavLink
            to="/guidance"
            className={({ isActive }) =>
              isActive
                ? "text-amber-400 font-semibold border-b-2 border-amber-500 pb-1"
                : "hover:text-indigo-600"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Guidance
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="profile"
                className="hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-indigo-600 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
