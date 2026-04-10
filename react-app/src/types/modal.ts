export type ConfirmActionKind = "toggle-publish" | "delete";

export type ActiveModal =
  | { kind: "config" }
  | { kind: "preview"; reportId: string }
  | { kind: "confirm"; reportId: string; action: ConfirmActionKind }
  | null;
