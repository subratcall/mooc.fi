/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StudyModuleTranslationWithIdInput } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateStudyModule
// ====================================================

export interface updateStudyModule_updateStudyModule_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: any
  language: string
  name: string
  description: string
}

export interface updateStudyModule_updateStudyModule {
  __typename: "StudyModule"
  id: any
  study_module_translations:
    | updateStudyModule_updateStudyModule_study_module_translations[]
    | null
}

export interface updateStudyModule {
  updateStudyModule: updateStudyModule_updateStudyModule
}

export interface updateStudyModuleVariables {
  id: string
  study_module_translations?: StudyModuleTranslationWithIdInput[] | null
}
