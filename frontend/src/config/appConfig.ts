export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL?.trim() || "";

export const TWIN_NAMESPACE = "vfluxion.hanoi";

export const MODEL_URLS = {
  electricCar:
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/scenegraph-layer/airplane.glb",
  chargingStation:
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
  substation:
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb"
};

export const TERRAIN_ELEVATION_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

export const TERRAIN_TEXTURE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
