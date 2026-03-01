import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Course {
    id: CourseId;
    region: string;
    title: string;
    artType: string;
    description: string;
    mentorName: string;
    price: bigint;
    mentorBio: string;
}
export type ArtworkId = bigint;
export interface HeritageRegion {
    artForms: Array<string>;
    name: string;
}
export interface Artwork {
    id: ArtworkId;
    status: ArtworkStatus;
    studentId: Principal;
    submittedAt: bigint;
    image: ExternalBlob;
}
export interface StudentProgress {
    progressPercent: bigint;
    royaltiesEarned: bigint;
    courseId: CourseId;
}
export type CourseId = bigint;
export interface UserProfile {
    region: string;
    name: string;
}
export enum ArtworkStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCourse(title: string, description: string, artType: string, price: bigint, mentorName: string, mentorBio: string, region: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    enrollInCourse(courseId: CourseId): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getCallerCoursesProgress(): Promise<Array<StudentProgress> | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoursesByRegion(region: string): Promise<Array<Course>>;
    getHeritageRegions(): Promise<Array<HeritageRegion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedArtworks(): Promise<Array<Artwork>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitArtwork(image: ExternalBlob): Promise<void>;
    verifyArtwork(artworkId: ArtworkId, status: ArtworkStatus): Promise<void>;
}
