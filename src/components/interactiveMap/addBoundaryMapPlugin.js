"use client";
import L from "leaflet";
// import "leaflet-side-by-side";
// import 'esri-leaflet';
// ✅ Extend Leaflet with canvas-based mask plugin using per-pixel alpha masking
async function addBoundaryMapPlugin() {
  if (typeof window !== "undefined" && window.L && !window.L.TileLayer.BoundaryCanvas) {
    let fn = async () => {
      const esri = await import('esri-leaflet');
      L.TileLayer.BoundaryCanvas = L.TileLayer.extend({

        options: {
          async: true
        },

        initialize: function (url, options) {
          L.TileLayer.prototype.initialize.call(this, url, options);
          this._boundary = options.boundary;
          this._tileCache = new Map(); // 🔁
        },

        createTile: function (coords, done) {
          const key = `${coords.z}_${coords.x}_${coords.y}`;
          if (this._tileCache.has(key)) {
            return this._tileCache.get(key);
          }

          const tileSize = this.getTileSize();
          const canvas = document.createElement("canvas");
          canvas.width = tileSize.x;
          canvas.height = tileSize.y;
          const ctx = canvas.getContext("2d");

          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = this.getTileUrl(coords);



          img.onload = () => {
            ctx.drawImage(img, 0, 0, tileSize.x, tileSize.y);

            // Create an alpha mask
            const maskCanvas = document.createElement("canvas");
            maskCanvas.width = tileSize.x;
            maskCanvas.height = tileSize.y;
            const maskCtx = maskCanvas.getContext("2d");

            const nwPoint = coords.scaleBy(tileSize);
            const path = new Path2D();

            this._boundary.eachLayer((layer) => {
              if (!layer.getLatLngs) return;
              const latlngs = layer.getLatLngs();
              const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];

              rings.forEach((ring) => {
                const flat = Array.isArray(ring[0]) ? ring.flat() : ring;
                if (flat.length === 0) return;

                const first = this._map.project(flat[0], coords.z).subtract(nwPoint);
                path.moveTo(first.x, first.y);

                flat.forEach((latlng) => {
                  const point = this._map.project(latlng, coords.z).subtract(nwPoint);
                  path.lineTo(point.x, point.y);
                });

                path.closePath();
              });
            });

            maskCtx.fillStyle = "black";
            maskCtx.fillRect(0, 0, tileSize.x, tileSize.y);
            maskCtx.fillStyle = "white";
            maskCtx.fill(path);

            const imgData = ctx.getImageData(0, 0, tileSize.x, tileSize.y);
            const maskData = maskCtx.getImageData(0, 0, tileSize.x, tileSize.y);

            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 3] = maskData.data[i]; // red channel as alpha
            }

            ctx.clearRect(0, 0, tileSize.x, tileSize.y);
            // ctx.putImageData(imgData, 0, 0);

            // done(null, canvas);


            ctx.putImageData(imgData, 0, 0);
            this._tileCache.set(key, canvas); // 🔁
            done(null, canvas);
          };

          img.onerror = () => {
            done(new Error("Tile load error"), canvas);
          };

          return canvas;
        }
      });

      L.tileLayer.boundaryCanvas = function (url, options) {
        return new L.TileLayer.BoundaryCanvas(url, options);
      };
    }
    let r= await fn();
    return r;
  }
  // window.L.TileLayer.BoundaryCanvas = L.TileLayer.BoundaryCanvas;


}
export default addBoundaryMapPlugin;