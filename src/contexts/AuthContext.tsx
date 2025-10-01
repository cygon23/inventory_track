import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, User } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserProfile: (
    updates: Partial<User>
  ) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const provisionUserProfile = async (
    sbUser: SupabaseUser
  ): Promise<User | null> => {
    try {
      console.log("AuthContext: Provisioning user profile for", sbUser.id);
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: sbUser.id,
          name: sbUser.email?.split("@")[0] || "New User",
          email: sbUser.email || "",
          role: "admin",
          avatar: null,
          is_active: true,
          last_login: nowIso,
          permissions: ["all"],
          assigned_region: null,
          phone: null,
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select()
        .single();

      if (error) {
        console.error("Error provisioning user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error provisioning user profile:", error);
      return null;
    }
  };

  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", userId);
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: "No user data returned" };

      let userProfile = await fetchUserProfile(data.user.id);
      if (!userProfile) {
        userProfile = await provisionUserProfile(data.user);
        if (!userProfile) {
          await supabase.auth.signOut();
          return {
            success: false,
            error:
              "User profile could not be created. Please contact administrator.",
          };
        }
      }

      if (!userProfile.is_active) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: "Account is deactivated. Please contact administrator.",
        };
      }

      await updateLastLogin(data.user.id);
      setUser(userProfile);
      setSupabaseUser(data.user);
      setSession(data.session);
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" };
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!supabaseUser) return;
    try {
      const userProfile = await fetchUserProfile(supabaseUser.id);
      if (userProfile) setUser(userProfile);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let isInitializing = true;

    const initAuth = async () => {
      try {
        console.log("AuthContext: Getting initial session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setSupabaseUser(session.user);
          setSession(session);

          let userProfile = await fetchUserProfile(session.user.id);
          if (!userProfile) {
            userProfile = await provisionUserProfile(session.user);
          }

          if (userProfile?.is_active) {
            setUser(userProfile);
            updateLastLogin(session.user.id).catch(console.error);
          } else {
            setUser(null);
            console.warn("User profile inactive or missing on initAuth");
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setUser(null);
      } finally {
        if (mounted) {
          console.log("AuthContext: Initial auth check complete");
          isInitializing = false;
          setLoading(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext: onAuthStateChange", {
        event,
        hasSession: !!session,
        isInitializing,
      });

      if (!mounted) return;

      if (isInitializing) {
        console.log(
          "AuthContext: Skipping event during initialization:",
          event
        );
        return;
      }

      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn("Auth state change timeout - forcing loading to false");
          setLoading(false);
        }
      }, 10000);

      try {
        setSupabaseUser(session?.user ?? null);
        setSession(session ?? null);

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        setLoading(true);

        let userProfile = await fetchUserProfile(session.user.id);
        if (!userProfile) {
          userProfile = await provisionUserProfile(session.user);
        }

        if (userProfile?.is_active) {
          setUser(userProfile);
          updateLastLogin(session.user.id).catch(console.error);
        } else {
          setUser(null);
          console.warn("User profile inactive or missing onAuthStateChange");
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          console.log("AuthContext: Auth state change complete");
          setLoading(false);
        }
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    loading,
    signIn,
    signOut,
    updateUserProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) =>
    !user ? false : user.role === "super_admin" || roles.includes(user.role);

  const isSuperAdmin = () => hasRole("super_admin");
  const isAdmin = () => hasRole("admin");
  const isBookingManager = () => hasRole("booking_manager");
  const isOperationsCoordinator = () => hasRole("operations_coordinator");
  const isDriver = () => hasRole("driver");
  const isFinanceOfficer = () => hasRole("finance_officer");
  const isCustomerService = () => hasRole("customer_service");

  return {
    user,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
    isBookingManager,
    isOperationsCoordinator,
    isDriver,
    isFinanceOfficer,
    isCustomerService,
  };
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) =>
    !user
      ? false
      : user.permissions.includes(permission) ||
        user.permissions.includes("all");
  const hasAnyPermission = (permissions: string[]) =>
    !user
      ? false
      : user.role === "super_admin" ||
        permissions.some(
          (p) =>
            user.permissions.includes(p) || user.permissions.includes("all")
        );

  return {
    hasPermission,
    hasAnyPermission,
    permissions: user?.permissions || [],
  };
};
