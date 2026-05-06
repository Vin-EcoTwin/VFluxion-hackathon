import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";

export function createBaseMapLayer() {
  return new TileLayer({
    id: "osm-basemap",
    data: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 10,
    maxZoom: 19,
    tileSize: 256,
    refinementStrategy: "best-available",
    renderSubLayers: (props: any) => {
      const { west, south, east, north } = props.tile.boundingBox;
      return new BitmapLayer(props, {
        id: `${props.id}-bitmap`,
        image: props.data,
        bounds: [west, south, east, north],
        desaturate: 0.2,
        opacity: 0.95
      });
    }
  });
}
