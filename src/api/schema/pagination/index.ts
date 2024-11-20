import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const JobPagingation = objectType({
  name: "JobPagination",
  definition(t) {
    t.list.field("item", {
      type: "jobpost",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const CompaniesPagination = objectType({
  name: "CompaniesPagination",
  definition(t) {
    t.list.field("item", {
      type: "company",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const UserPagination = objectType({
  name: "UserPagination",
  definition(t) {
    t.list.field("item", {
      type: "user",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const SkillsPagination = objectType({
  name: "SkillsPagination",
  definition(t) {
    t.list.field("item", {
      type: "skills",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const Applicant = objectType({
  name: "ApplicantPagination",
  definition(t) {
    t.list.field("item", {
      type: "application",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const ActivityLogsPagination = objectType({
  name: "ActivityLogsPagination",
  definition(t) {
    t.list.field("item", {
      type: "activityLogs",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const SchedulePagination = objectType({
  name: "SchedulePagination",
  definition(t) {
    t.list.field("item", {
      type: "schedule",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const ThemePagination = objectType({
  name: "ThemePagination",
  definition(t) {
    t.list.field("item", {
      type: "theme",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const FontPagination = objectType({
  name: "FontPagination",
  definition(t) {
    t.list.field("item", {
      type: "fonts",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const ProjectOrganizerPagination = objectType({
  name: "ProjectOrganizerPagination",
  definition(t) {
    t.list.field("item", {
      type: "project",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const NotificationPagination = objectType({
  name: "NotificationPagination",
  definition(t) {
    t.list.field("notification", {
      type: "notification",
    }),
      t.string("cursor");
  },
});

export const ReportPagination = objectType({
  name: "ReportPagination",
  definition(t) {
    t.list.field("item", {
      type: "report",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});

export const ReviewPagination = objectType({
  name: "ReviewPagination",
  definition(t) {
    t.list.field("item", {
      type: "review",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});
