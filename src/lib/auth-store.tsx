/**
 * DEPRECATED: This file is kept for backward compatibility during migration.
 * Use the centralized useUser() hook from '@/firebase' instead.
 */
'use client';

import { useUser } from "@/firebase";
import React from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useAuth = () => {
  const { user, loading } = useUser();
  return { user, loading };
};
