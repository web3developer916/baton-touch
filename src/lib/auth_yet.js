import { supabase } from "./supabase";
// import { useFamilyStore } from "../stores/useFamilyStore";
import { useChildStore } from "../stores/useChildStore";

export async function signIn({ email, password }) {
  try {
    // Check if admin login
    // const { fetchFamilies, families } = useFamilyStore();

    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log(user, "checkuser");

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    console.log(profile, "checkprofile");

    // fetchFamilies(user.id);
    // console.log(families, "checkfamilies");
    // await fetchChildren(user.id);

    return profile;
  } catch (error) {
    throw error;
  }
}

export async function signUp({ email, password, name }) {
  // const { addFamily } = useFamilyStore();
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  console.log(user, "signup");

  // Create profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        email,
        name,
      },
    ])
    .select()
    .single();

  // addFamily(familyGroupName, user.id);

  return profile;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
