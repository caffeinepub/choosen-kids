import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Artwork,
  Course,
  StudentProgress,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Mock seed data ────────────────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  {
    id: 1n,
    title: "Toda Embroidery",
    artType: "Toda Embroidery",
    region: "Nilgiris",
    description:
      "Master the ancient geometric embroidery of the Toda tribe — one of India's most endangered textile traditions.",
    mentorName: "Devaki Amma",
    mentorBio: "38 years weaving the sacred geometry of the Nilgiri hills.",
    price: 349900n,
  },
  {
    id: 2n,
    title: "Madhubani Painting",
    artType: "Madhubani",
    region: "Mithila",
    description:
      "Learn the vibrant storytelling tradition of Mithila — paintings that speak of gods, nature, and cosmic rhythms.",
    mentorName: "Ramesh Babu",
    mentorBio: "42 years illuminating mythology through line and colour.",
    price: 299900n,
  },
  {
    id: 3n,
    title: "Warli Folk Art",
    artType: "Warli",
    region: "Maharashtra",
    description:
      "Discover the minimalist tribal geometry of the Warli people — white on earthy terracotta, telling stories of harvest and life.",
    mentorName: "Sunita Warli",
    mentorBio: "Community elder and keeper of Warli visual language.",
    price: 199900n,
  },
  {
    id: 4n,
    title: "Sacred Mandala",
    artType: "Mandala",
    region: "Pan-India",
    description:
      "From sacred geometry to meditative practice — craft intricate mandalas using traditional pigment and gold leaf techniques.",
    mentorName: "Anand Sharma",
    mentorBio: "Spiritual artist blending Tantric geometry with modern craft.",
    price: 249900n,
  },
  {
    id: 5n,
    title: "Kalamkari Chronicles",
    artType: "Kalamkari",
    region: "Andhra Pradesh",
    description:
      "The ancient pen-and-brush art of Andhra — natural dyes, mythological narratives, centuries of unbroken tradition.",
    mentorName: "Lakshmi Devi",
    mentorBio: "Fourth-generation Kalamkari artist from Srikalahasti.",
    price: 319900n,
  },
];

const MOCK_PROGRESS: StudentProgress[] = [
  { courseId: 1n, progressPercent: 65n, royaltiesEarned: 124000n },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useGetAllCourses() {
  const { actor, isFetching } = useActor();
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return MOCK_COURSES;
      try {
        const result = await actor.getAllCourses();
        return result.length > 0 ? result : MOCK_COURSES;
      } catch {
        return MOCK_COURSES;
      }
    },
    enabled: !isFetching,
    placeholderData: MOCK_COURSES,
  });
}

export function useGetCoursesProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProgress[]>({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor) return MOCK_PROGRESS;
      try {
        const result = await actor.getCallerCoursesProgress();
        return result && result.length > 0 ? result : MOCK_PROGRESS;
      } catch {
        return MOCK_PROGRESS;
      }
    },
    enabled: !isFetching,
    placeholderData: MOCK_PROGRESS,
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
  });
}

export function useGetVerifiedArtworks() {
  const { actor, isFetching } = useActor();
  return useQuery<Artwork[]>({
    queryKey: ["verifiedArtworks"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getVerifiedArtworks();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    placeholderData: [],
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useEnrollInCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.enrollInCourse(courseId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
