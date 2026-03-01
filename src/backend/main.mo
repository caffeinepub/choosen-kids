import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // Types
  type CourseId = Nat;
  type ArtworkId = Nat;

  public type UserProfile = {
    name : Text;
    region : Text;
  };

  public type Course = {
    id : CourseId;
    title : Text;
    description : Text;
    artType : Text;
    price : Nat;
    mentorName : Text;
    mentorBio : Text;
    region : Text;
  };

  public type StudentProgress = {
    courseId : CourseId;
    progressPercent : Nat;
    royaltiesEarned : Nat;
  };

  public type Artwork = {
    id : ArtworkId;
    studentId : Principal;
    image : Storage.ExternalBlob;
    status : ArtworkStatus;
    submittedAt : Nat64;
  };

  public type ArtworkStatus = { #pending; #verified; #rejected };

  public type HeritageRegion = {
    name : Text;
    artForms : [Text];
  };

  module Course {
    public func compare(c1 : Course, c2 : Course) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };
  };

  // Storage
  var nextCourseId = 1;
  var nextArtworkId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let courses = Map.empty<CourseId, Course>();
  let studentProgress = Map.empty<Principal, List.List<StudentProgress>>();
  let artworks = Map.empty<ArtworkId, Artwork>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Courses
  public shared ({ caller }) func addCourse(title : Text, description : Text, artType : Text, price : Nat, mentorName : Text, mentorBio : Text, region : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let course : Course = {
      id = nextCourseId;
      title;
      description;
      artType;
      price;
      mentorName;
      mentorBio;
      region;
    };
    courses.add(nextCourseId, course);
    nextCourseId += 1;
  };

  public query func getAllCourses() : async [Course] {
    courses.values().toArray().sort();
  };

  public query func getCoursesByRegion(region : Text) : async [Course] {
    courses.values().toArray().filter(
      func(course) {
        Text.equal(course.region, region);
      }
    ).sort();
  };

  // Student Progress
  public shared ({ caller }) func enrollInCourse(courseId : CourseId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    if (not courses.containsKey(courseId)) {
      Runtime.trap("Course does not exist");
    };

    let progress = {
      courseId;
      progressPercent = 0;
      royaltiesEarned = 0;
    };

    let currentProgress = switch (studentProgress.get(caller)) {
      case (null) { List.empty<StudentProgress>() };
      case (?p) { p };
    };
    currentProgress.add(progress);
    studentProgress.add(caller, currentProgress);
  };

  public query ({ caller }) func getCallerCoursesProgress() : async ?[StudentProgress] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    studentProgress.get(caller).map(func(p) { p.toArray() });
  };

  // Artwork Uploads
  public shared ({ caller }) func submitArtwork(image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let artwork : Artwork = {
      id = nextArtworkId;
      studentId = caller;
      image;
      status = #pending;
      submittedAt = 0;
    };
    artworks.add(nextArtworkId, artwork);
    nextArtworkId += 1;
  };

  public shared ({ caller }) func verifyArtwork(artworkId : ArtworkId, status : ArtworkStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (artworks.get(artworkId)) {
      case (null) { Runtime.trap("Artwork not found") };
      case (?artwork) {
        artworks.add(artworkId, { artwork with status });
      };
    };
  };

  public query func getVerifiedArtworks() : async [Artwork] {
    artworks.values().toArray().filter(
      func(artwork) {
        switch (artwork.status) {
          case (#verified) { true };
          case (_) { false };
        };
      }
    );
  };

  // Heritage Regions
  public query func getHeritageRegions() : async [HeritageRegion] {
    [
      {
        name = "Tamil Nadu";
        artForms = ["Tanjore Painting", "Bharatanatyam"];
      },
      {
        name = "Rajasthan";
        artForms = ["Miniature Paintings", "Kathputli Puppetry"];
      },
      {
        name = "Kerala";
        artForms = ["Kerala Mural", "Kathakali"];
      },
    ];
  };
};
