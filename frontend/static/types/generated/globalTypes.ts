/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CourseStatus {
  Active = "Active",
  Ended = "Ended",
  Upcoming = "Upcoming",
}

export enum OrganizationRole {
  OrganizationAdmin = "OrganizationAdmin",
  Student = "Student",
  Teacher = "Teacher",
}

export interface CourseAliasCreateUpdateInput {
  course?: string | null
  course_code: string
  id?: string | null
}

export interface CourseArg {
  automatic_completions?: boolean | null
  automatic_completions_eligible_for_ects?: boolean | null
  base64?: boolean | null
  completion_email?: string | null
  completions_handled_by?: string | null
  course_aliases?: CourseAliasCreateUpdateInput[] | null
  course_translations?: CourseTranslationCreateUpdateInput[] | null
  course_variants?: CourseVariantCreateUpdateInput[] | null
  delete_photo?: boolean | null
  ects?: string | null
  end_date?: string | null
  has_certificate?: boolean | null
  hidden?: boolean | null
  id?: string | null
  inherit_settings_from?: string | null
  name?: string | null
  new_photo?: any | null
  new_slug?: string | null
  open_university_registration_links?:
    | OpenUniversityRegistrationLinkCreateUpdateInput[]
    | null
  order?: number | null
  photo?: string | null
  points_needed?: number | null
  promote?: boolean | null
  slug?: string | null
  start_date?: string | null
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module_order?: number | null
  study_module_start_point?: boolean | null
  study_modules?: StudyModuleWhereUniqueInput[] | null
  support_email?: string | null
  teacher_in_charge_email?: string | null
  teacher_in_charge_name?: string | null
  user_course_settings_visibilities?:
    | UserCourseSettingsVisibilityCreateUpdateInput[]
    | null
}

export interface CourseTranslationCreateUpdateInput {
  course?: string | null
  description: string
  id?: string | null
  language: string
  link?: string | null
  name: string
}

export interface CourseVariantCreateUpdateInput {
  course?: string | null
  description?: string | null
  id?: string | null
  slug: string
}

export interface ManualCompletionArg {
  grade?: string | null
  user_id: string
}

export interface OpenUniversityRegistrationLinkCreateUpdateInput {
  course_code: string
  id?: string | null
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
}

export interface StudyModuleArg {
  id?: string | null
  image?: string | null
  name?: string | null
  new_slug?: string | null
  order?: number | null
  slug?: string | null
  study_module_translations?: StudyModuleTranslationCreateUpdateInput[] | null
}

export interface StudyModuleTranslationCreateUpdateInput {
  description: string
  id?: string | null
  language: string
  name: string
  study_module?: string | null
}

export interface StudyModuleWhereUniqueInput {
  id?: any | null
  slug?: string | null
}

export interface UserCourseSettingsVisibilityCreateUpdateInput {
  course?: string | null
  id?: string | null
  language: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
