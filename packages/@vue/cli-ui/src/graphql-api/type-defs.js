module.exports = `

type ConsoleLog {
  id: ID!
  message: String!
  tag: String
  type: ConsoleLogType!
  date: String
}

enum ConsoleLogType {
  log
  warn
  error
  info
  done
}

enum PackageManager {
  npm
  yarn
}

type Folder {
  name: String!
  path: String!
  isPackage: Boolean
  isVueProject: Boolean
  favorite: Boolean
  children: [Folder]
}

type Project {
  id: ID!
  name: String!
  path: String!
  favorite: Int
  plugins: [Plugin]
}

input ProjectCreateInput {
  folder: String!
  force: Boolean!
  packageManager: PackageManager
  preset: String!
  remote: Boolean
  clone: Boolean
  save: String
}

input ProjectImportInput {
  path: String!
}

type Preset {
  id: ID!
  name: String
  description: String
  link: String
  features: [String]
}

type ProjectCreation {
  presets: [Preset]
  features: [Feature]
  prompts: [Prompt]
}

type Version {
  current: String!
  latest: String
  range: String
}

type GitHubStats {
  stars: Int
}

type Plugin {
  id: ID!
  version: Version!
  official: Boolean
  installed: Boolean
  website: String
  description: String
  githubStats: GitHubStats
  prompts: [Prompt]
  logo: String
}

type Feature {
  id: ID!
  name: String!
  description: String
  link: String
  enabled: Boolean!
}

enum PromptType {
  input
  confirm
  list
  rawlist
  expand
  checkbox
  password
  editor
}

type PromptChoice {
  value: String!
  name: String
  checked: Boolean
  disabled: Boolean
}

type PromptError {
  message: String!
  link: String
}

type Prompt {
  id: ID!
  enabled: Boolean!
  type: PromptType!
  name: String
  message: String
  description: String
  link: String
  choices: [PromptChoice]
  value: String
  valueChanged: Boolean
  error: PromptError
}

input PromptInput {
  id: ID!
  value: String!
}

type Progress {
  id: ID!
  status: String
  info: String
  error: String
  # Progress from 0 to 1 (-1 means disabled)
  progress: Float
}

type Query {
  progress (id: ID!): Progress
  cwd: String!
  consoleLogs: [ConsoleLog]
  consoleLogLast: ConsoleLog
  folderCurrent: Folder
  foldersFavorite: [Folder]
  projects: [Project]
  projectCurrent: Project
  projectCreation: ProjectCreation
}

type Mutation {
  consoleLogsClear: [ConsoleLog]
  folderOpen (path: String!): Folder
  folderOpenParent: Folder
  folderSetFavorite (path: String!, favorite: Boolean!): Folder
  projectCreate (input: ProjectCreateInput!): Project!
  projectImport (input: ProjectImportInput!): Project!
  projectOpen (id: ID!): Project!
  projectSetFavorite (id: ID!, favorite: Int!): Project!
  projectRemove (id: ID!): Boolean!
  projectCwdReset: String
  presetApply (id: ID!): ProjectCreation
  featureSetEnabled (id: ID!, enabled: Boolean): Feature
  pluginAdd (id: ID!): Plugin
  promptAnswer (input: PromptInput!): [Prompt]
}

type Subscription {
  progressChanged (id: ID!): Progress
  consoleLogAdded: ConsoleLog!
  cwdChanged: String!
}
`
