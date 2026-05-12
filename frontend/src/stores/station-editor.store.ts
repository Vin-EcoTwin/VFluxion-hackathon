import { create } from "zustand";

export type StationEditMode = "idle" | "add" | "move";

export type EditableAssetType = "station" | "transformer";

export type StationDraft = {
  name: string;
  heading: number;
  capacity: number;
  maxCapacityKw: number;
  inflexibleLoadKw: number;
  pvGenerationKw: number;
  drCapacityReduction: number;
};

type StationEditorState = {
  mode: StationEditMode;
  assetType: EditableAssetType;
  selectedStationId: string | null;
  draft: StationDraft;
  setMode: (mode: StationEditMode) => void;
  setAssetType: (assetType: EditableAssetType) => void;
  setDraft: (draft: Partial<StationDraft>) => void;
  selectStation: (stationId: string | null) => void;
  reset: () => void;
};

const DEFAULT_DRAFT: StationDraft = {
  name: "New Station",
  heading: 0,
  capacity: 4,
  maxCapacityKw: 1500,
  inflexibleLoadKw: 680,
  pvGenerationKw: 150,
  drCapacityReduction: 0
};

export const useStationEditorStore = create<StationEditorState>((set) => ({
  mode: "idle",
  assetType: "station",
  selectedStationId: null,
  draft: { ...DEFAULT_DRAFT },
  setMode: (mode) =>
    set((state) => ({
      mode,
      selectedStationId: mode === "move" ? state.selectedStationId : null
    })),
  setAssetType: (assetType) => set({ assetType }),
  setDraft: (draft) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...draft
      }
    })),
  selectStation: (stationId) => set({ selectedStationId: stationId }),
  reset: () =>
    set({
      mode: "idle",
      assetType: "station",
      selectedStationId: null,
      draft: { ...DEFAULT_DRAFT }
    })
}));
